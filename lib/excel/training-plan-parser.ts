import * as XLSX from 'xlsx';

export interface TrainingSession {
  id: string;
  date: string;
  day: string;
  block: string;
  sessionTitle: string;
  modality: string;
  exercise: string;
  sets?: string | number;
  reps?: string;
  tempo?: string;
  rpe?: string | number;
  duration?: number; // minutes
  targetHR?: string;
  pace?: string;
  incline?: string;
  load?: string;
  cadence?: string;
  notes?: string;
}

export interface ParsedWorkout {
  id: string;
  title: string;
  type: 'cardio' | 'strength' | 'technical' | 'rest' | 'custom';
  duration: number;
  intensity: 'low' | 'medium' | 'high';
  description: string;
  exercises?: string[];
  zones?: string[];
  warmup?: number;
  cooldown?: number;
  mainWork?: number;
}

export interface WeeklySchedule {
  week: number;
  startDate: string;
  workouts: {
    [key: string]: ParsedWorkout[];
  };
}

/**
 * Parse training plan Excel file
 */
export async function parseTrainingPlanExcel(
  fileBuffer: Buffer,
  options: {
    sheetName?: string;
    headerRow?: number;
    explicitWeekNumber?: number;
  } = {}
): Promise<WeeklySchedule> {
  const { sheetName, headerRow = 0, explicitWeekNumber } = options;

  try {
    // Read the Excel file
    const workbook = XLSX.read(fileBuffer, { type: 'buffer' });
    const sheetNames = workbook.SheetNames;

    if (sheetNames.length === 0) {
      throw new Error('No sheets found in Excel file');
    }

    // Use specified sheet or first sheet
    const targetSheet = sheetName || sheetNames[0];
    const worksheet = workbook.Sheets[targetSheet];

    if (!worksheet) {
      throw new Error(`Sheet "${targetSheet}" not found`);
    }

    // Convert sheet to JSON
    const rawData = XLSX.utils.sheet_to_json(worksheet, {
      header: 1,
      defval: null,
      blankrows: false
    }) as any[][];

    if (rawData.length <= headerRow) {
      throw new Error('Not enough data rows in Excel file');
    }

    // Check if this is the new format (with columns: Day, Session Type, Focus Area, Duration, etc.)
    const headers = rawData[headerRow].map((h: any) => String(h || '').trim());
    const isNewFormat = headers[0]?.toLowerCase() === 'day' &&
                       headers[1]?.toLowerCase().includes('session') &&
                       headers[3]?.toLowerCase().includes('duration');

    let workoutsByDay: { [key: string]: ParsedWorkout[] };

    if (isNewFormat) {
      // Parse new format
      workoutsByDay = parseNewFormatTrainingPlan(rawData.slice(headerRow + 1));
    } else {
      // Parse old format (original columns)
      const sessions: TrainingSession[] = [];
      const dataRows = rawData.slice(headerRow + 1);

      for (let i = 0; i < dataRows.length; i++) {
        const row = dataRows[i];
        if (!row[0]) continue; // Skip rows without dates

        const session: TrainingSession = {
          id: `${i}`,
          date: parseDateValue(row[0]),
          day: String(row[1] || ''),
          block: String(row[2] || ''),
          sessionTitle: String(row[3] || ''),
          modality: String(row[4] || ''),
          exercise: String(row[5] || ''),
          sets: row[6],
          reps: String(row[7] || ''),
          tempo: String(row[8] || ''),
          rpe: row[9],
          duration: parseNumber(row[10]),
          targetHR: String(row[11] || ''),
          pace: String(row[12] || ''),
          incline: String(row[13] || ''),
          load: String(row[14] || ''),
          cadence: String(row[15] || ''),
          notes: String(row[16] || '')
        };

        sessions.push(session);
      }

      // Group sessions by day and convert to workouts
      workoutsByDay = groupSessionsByDay(sessions);
    }

    // Calculate start date - use today as reference
    const today = new Date('2025-10-27'); // Week 41 starts Oct 27
    const startDate = new Date(today);

    // Use explicit week number if provided
    const weekNumber = explicitWeekNumber !== undefined ? explicitWeekNumber : getWeekNumber(startDate);

    return {
      week: weekNumber,
      startDate: startDate.toISOString().split('T')[0],
      workouts: workoutsByDay
    };

  } catch (error) {
    throw new Error(`Failed to parse training plan: ${error instanceof Error ? error.message : String(error)}`);
  }
}

/**
 * Parse the new format training plan (with Day, Session Type, Focus Area, etc.)
 */
function parseNewFormatTrainingPlan(dataRows: any[][]): { [key: string]: ParsedWorkout[] } {
  const days = ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday'];
  const workoutsByDay: { [key: string]: ParsedWorkout[] } = {};

  // Initialize all days
  days.forEach(day => {
    workoutsByDay[day] = [];
  });

  // Column indices for new format:
  // 0: Day, 1: Session Type, 2: Focus Area, 3: Duration, 4: Key Metrics, 5: Equipment/Notes, 6: Recovery Protocol

  for (let i = 0; i < dataRows.length; i++) {
    const row = dataRows[i];
    const dayName = String(row[0] || '').trim();

    if (!dayName || !days.includes(dayName)) continue;

    const sessionType = String(row[1] || '').trim();
    const focusArea = String(row[2] || '').trim();
    const duration = parseNumber(row[3]);
    const keyMetrics = String(row[4] || '').trim();
    const equipment = String(row[5] || '').trim();
    const recovery = String(row[6] || '').trim();

    // Combine session type and focus area for the title
    const title = focusArea ? `${sessionType} - ${focusArea}` : sessionType;

    // Determine workout type
    const type = determineWorkoutTypeFromText(sessionType + ' ' + focusArea);

    // Determine intensity from key metrics
    const intensity = determineIntensityFromMetrics(keyMetrics);

    // Extract zones from metrics
    const zones = extractZonesFromText(keyMetrics);

    // Extract exercises from equipment notes
    const exercises = equipment ? equipment.split(',').map((e: string) => e.trim()) : [];

    const workout: ParsedWorkout = {
      id: `${dayName.toLowerCase()}-${i}`,
      title: title || 'Training Session',
      type,
      duration: duration || 30,
      intensity,
      description: `${keyMetrics}${equipment ? ' • ' + equipment : ''}`,
      exercises: exercises.length > 0 ? exercises : undefined,
      zones: zones.length > 0 ? zones : undefined
    };

    workoutsByDay[dayName].push(workout);
  }

  return workoutsByDay;
}

/**
 * Determine workout type from session text
 */
function determineWorkoutTypeFromText(text: string): 'cardio' | 'strength' | 'technical' | 'rest' | 'custom' {
  const lower = text.toLowerCase();

  if (lower.includes('run') || lower.includes('treadmill') || lower.includes('stair') || lower.includes('climb')) {
    return 'cardio';
  }
  if (lower.includes('strength') || lower.includes('squat') || lower.includes('press') || lower.includes('lift')) {
    return 'strength';
  }
  if (lower.includes('mobility') || lower.includes('core') || lower.includes('stretching')) {
    return 'custom';
  }
  if (lower.includes('rest') || lower.includes('recovery')) {
    return 'rest';
  }

  return 'custom';
}

/**
 * Determine intensity from metrics text
 */
function determineIntensityFromMetrics(metrics: string): 'low' | 'medium' | 'high' {
  const lower = metrics.toLowerCase();

  if (lower.includes('z1') || lower.includes('130 bpm') || lower.includes('recovery') || lower.includes('rpe 6')) {
    return 'low';
  }
  if (lower.includes('z2') || lower.includes('130–145') || lower.includes('135–145') || lower.includes('rpe 7') || lower.includes('rpe 8')) {
    return 'medium';
  }
  if (lower.includes('z3') || lower.includes('z4') || lower.includes('155–165') || lower.includes('rpe 9')) {
    return 'high';
  }

  return 'medium';
}

/**
 * Extract training zones from metrics text
 */
function extractZonesFromText(text: string): string[] {
  const zones: string[] = [];
  const zoneMatches = text.match(/z[1-5]/gi);

  if (zoneMatches) {
    zones.push(...zoneMatches.map(z => z.toUpperCase()));
  }

  return [...new Set(zones)]; // Remove duplicates
}

/**
 * Group training sessions by day and convert to workouts
 */
function groupSessionsByDay(sessions: TrainingSession[]): { [key: string]: ParsedWorkout[] } {
  const days = ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday'];
  const workoutsByDay: { [key: string]: ParsedWorkout[] } = {};

  // Initialize all days
  days.forEach(day => {
    workoutsByDay[day] = [];
  });

  // Group sessions by date
  const sessionsByDate = sessions.reduce((acc, session) => {
    if (!acc[session.date]) {
      acc[session.date] = [];
    }
    acc[session.date].push(session);
    return acc;
  }, {} as Record<string, TrainingSession[]>);

  // Convert each date's sessions to workouts
  Object.entries(sessionsByDate).forEach(([date, dateSessions]) => {
    const dateObj = new Date(date);
    const dayName = days[dateObj.getDay() === 0 ? 6 : dateObj.getDay() - 1]; // Adjust for Monday = 0

    // Group sessions by session title
    const sessionsByTitle = dateSessions.reduce((acc, session) => {
      const title = session.sessionTitle || 'Untitled';
      if (!acc[title]) {
        acc[title] = [];
      }
      acc[title].push(session);
      return acc;
    }, {} as Record<string, TrainingSession[]>);

    // Create workouts from grouped sessions
    Object.entries(sessionsByTitle).forEach(([title, titleSessions], index) => {
      const workout = convertSessionsToWorkout(titleSessions, `${date}-${index}`, title);
      workoutsByDay[dayName].push(workout);
    });
  });

  return workoutsByDay;
}

/**
 * Convert a group of training sessions to a single workout
 */
function convertSessionsToWorkout(
  sessions: TrainingSession[],
  id: string,
  title: string
): ParsedWorkout {
  // Determine workout type based on modalities
  const modalities = sessions.map(s => s.modality.toLowerCase());
  const type = determineWorkoutType(modalities);

  // Calculate total duration
  const duration = sessions.reduce((sum, s) => sum + (s.duration || 0), 0);

  // Determine intensity based on RPE and zones
  const intensity = determineIntensity(sessions);

  // Build description
  const description = sessions
    .map(s => `${s.modality}: ${s.exercise}${s.duration ? ` (${s.duration} min)` : ''}${s.notes ? ` - ${s.notes}` : ''}`)
    .join('\n');

  // Extract exercises
  const exercises = sessions
    .filter(s => s.exercise)
    .map(s => {
      let ex = s.exercise;
      if (s.sets) ex += ` ${s.sets} sets`;
      if (s.reps) ex += ` x ${s.reps}`;
      if (s.load) ex += ` @ ${s.load}`;
      return ex;
    });

  // Extract zones
  const zones = sessions
    .map(s => s.targetHR)
    .filter(Boolean)
    .map(hr => hr?.includes('Z') ? hr : null)
    .filter(Boolean) as string[];

  return {
    id,
    title: title || 'Training Session',
    type,
    duration,
    intensity,
    description,
    exercises: exercises.length > 0 ? exercises : undefined,
    zones: zones.length > 0 ? [...new Set(zones)] : undefined
  };
}

/**
 * Determine workout type from modalities
 */
function determineWorkoutType(modalities: string[]): 'cardio' | 'strength' | 'technical' | 'rest' | 'custom' {
  const hasStrength = modalities.some(m =>
    m.includes('strength') || m.includes('core') || m.includes('prehab')
  );
  const hasCardio = modalities.some(m =>
    m.includes('run') || m.includes('bike') || m.includes('hike') || m.includes('cardio')
  );
  const hasMobility = modalities.some(m =>
    m.includes('mobility') || m.includes('stretch') || m.includes('fuel')
  );

  if (hasStrength && hasCardio) return 'custom';
  if (hasStrength) return 'strength';
  if (hasCardio) return 'cardio';
  if (hasMobility) return 'custom';

  return 'custom';
}

/**
 * Determine intensity from sessions
 */
function determineIntensity(sessions: TrainingSession[]): 'low' | 'medium' | 'high' {
  const rpeValues = sessions
    .map(s => typeof s.rpe === 'number' ? s.rpe : parseFloat(String(s.rpe || '').replace(/[^\d.]/g, '')))
    .filter(rpe => !isNaN(rpe));

  if (rpeValues.length === 0) {
    // Check for zone indicators
    const hasHighZone = sessions.some(s =>
      s.targetHR?.includes('Z3') || s.targetHR?.includes('Z4') || s.targetHR?.includes('Z5')
    );
    const hasLowZone = sessions.some(s =>
      s.targetHR?.includes('Z1') || s.exercise?.toLowerCase().includes('easy') || s.exercise?.toLowerCase().includes('recovery')
    );

    if (hasHighZone) return 'high';
    if (hasLowZone) return 'low';
    return 'medium';
  }

  const avgRPE = rpeValues.reduce((sum, rpe) => sum + rpe, 0) / rpeValues.length;

  if (avgRPE >= 8) return 'high';
  if (avgRPE >= 6) return 'medium';
  return 'low';
}

/**
 * Parse date value from Excel
 */
function parseDateValue(value: any): string {
  if (!value) return new Date().toISOString().split('T')[0];

  // Handle Excel date serial numbers
  if (typeof value === 'number') {
    const date = XLSX.SSF.parse_date_code(value);
    if (date) {
      return `${date.y}-${String(date.m).padStart(2, '0')}-${String(date.d).padStart(2, '0')}`;
    }
  }

  // Handle string dates
  const str = String(value).trim();
  const date = new Date(str);

  if (!isNaN(date.getTime())) {
    return date.toISOString().split('T')[0];
  }

  return new Date().toISOString().split('T')[0];
}

/**
 * Parse number from various formats
 */
function parseNumber(value: any): number | undefined {
  if (value === null || value === undefined || value === '') return undefined;

  const num = typeof value === 'number' ? value : parseFloat(String(value).replace(/[^\d.]/g, ''));

  return isNaN(num) ? undefined : num;
}

/**
 * Get week number for a date (ISO week numbering)
 */
function getWeekNumber(date: Date): number {
  // Calculate week number based on training start date
  // Week 1 starts on October 13, 2025
  const trainingStartDate = new Date('2025-10-13');
  const diffTime = Math.abs(date.getTime() - trainingStartDate.getTime());
  const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
  const weekNumber = Math.floor(diffDays / 7) + 1;

  return Math.max(1, weekNumber);
}
