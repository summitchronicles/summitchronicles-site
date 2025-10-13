import { NextRequest, NextResponse } from 'next/server';
import fs from 'fs';
import path from 'path';
import { parseTrainingPlanExcel } from '@/lib/excel/training-plan-parser';

export const dynamic = 'force-dynamic';

interface ParsedWorkout {
  id: string;
  title: string;
  type: 'cardio' | 'strength' | 'technical' | 'rest' | 'custom';
  duration: number; // minutes
  intensity: 'low' | 'medium' | 'high';
  description: string;
  exercises?: string[];
  zones?: string[];
  warmup?: number;
  cooldown?: number;
  mainWork?: number;
}

interface WeeklySchedule {
  week: number;
  startDate: string;
  workouts: {
    [key: string]: ParsedWorkout[]; // Monday, Tuesday, etc. - now array of workouts
  };
}

export async function GET(request: NextRequest) {
  try {
    // Import Supabase client
    const { createClient } = await import('@supabase/supabase-js');
    const supabase = createClient(
      process.env.SUPABASE_URL!,
      process.env.SUPABASE_SERVICE_ROLE_KEY!
    );

    // Try to get active training plan from Supabase
    const { data: activePlan, error: planError } = await supabase
      .from('training_plans')
      .select('*')
      .eq('is_active', true)
      .single();

    if (!planError && activePlan) {
      // Download file from Supabase Storage
      const { data: fileData, error: downloadError } = await supabase.storage
        .from('workout-files')
        .download(activePlan.storage_path);

      if (!downloadError && fileData) {
        const fileBuffer = Buffer.from(await fileData.arrayBuffer());
        const weeklySchedule = await parseTrainingPlanExcel(fileBuffer);

        return NextResponse.json({
          success: true,
          currentWeek: weeklySchedule,
          allWeeks: [weeklySchedule],
          source: activePlan.filename,
          lastUpdated: activePlan.uploaded_at
        });
      }
    }

    // Fallback: Try new Excel format from file system
    const newExcelPath = path.join(process.cwd(), 'garmin-workouts/Scheduled-workouts/Week_13-19_Oct_2025_plan.xlsx');

    if (fs.existsSync(newExcelPath)) {
      const fileBuffer = fs.readFileSync(newExcelPath);
      const weeklySchedule = await parseTrainingPlanExcel(fileBuffer);

      return NextResponse.json({
        success: true,
        currentWeek: weeklySchedule,
        allWeeks: [weeklySchedule],
        source: 'week_13-19_oct_2025_plan (local file)',
        lastUpdated: new Date().toISOString()
      });
    }

    // Fallback to CSV format
    const csvPath = path.join(process.cwd(), 'garmin-workouts/Scheduled-workouts/Everest_Base_Schedule-1.csv');

    if (!fs.existsSync(csvPath)) {
      throw new Error('Workout schedule file not found');
    }

    const csvContent = fs.readFileSync(csvPath, 'utf-8');
    const schedule = parseWorkoutSchedule(csvContent);

    // Get current week based on today's date (October 4, 2025)
    const currentWeek = getCurrentWeekNumber();
    const currentWeekData = schedule.find(week => week.week === currentWeek) || schedule[0];

    return NextResponse.json({
      success: true,
      currentWeek: currentWeekData,
      allWeeks: schedule,
      source: 'everest_base_schedule',
      lastUpdated: new Date().toISOString()
    });

  } catch (error) {
    console.error('Error parsing workout schedule:', error);

    return NextResponse.json({
      success: false,
      error: 'Failed to load workout schedule',
      currentWeek: getFallbackWeeklySchedule(),
      source: 'fallback'
    });
  }
}

function parseWorkoutSchedule(csvContent: string): WeeklySchedule[] {
  // Split by rows, handling multiline entries properly
  const rows = parseCSVRows(csvContent);
  const schedule: WeeklySchedule[] = [];

  // Skip header row
  for (let i = 1; i < rows.length; i++) {
    const row = rows[i];
    if (row.length < 8) continue; // Week + 7 days

    const weekNumber = parseInt(row[0]);
    if (isNaN(weekNumber)) continue;

    const weekData: WeeklySchedule = {
      week: weekNumber,
      startDate: getWeekStartDate(weekNumber),
      workouts: {}
    };

    const days = ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday'];

    for (let dayIndex = 0; dayIndex < 7; dayIndex++) {
      const workoutText = row[dayIndex + 1];
      if (workoutText && workoutText.trim()) {
        weekData.workouts[days[dayIndex]] = parseMultipleWorkouts(workoutText, `${weekNumber}-${dayIndex}`);
      } else {
        weekData.workouts[days[dayIndex]] = [];
      }
    }

    schedule.push(weekData);
  }

  return schedule;
}

function parseCSVRows(csvContent: string): string[][] {
  const rows: string[][] = [];
  const lines = csvContent.split('\n');
  let currentRow: string[] = [];
  let currentField = '';
  let inQuotes = false;
  let lineIndex = 0;

  while (lineIndex < lines.length) {
    const line = lines[lineIndex];

    for (let i = 0; i < line.length; i++) {
      const char = line[i];

      if (char === '"') {
        inQuotes = !inQuotes;
      } else if (char === ',' && !inQuotes) {
        currentRow.push(currentField.trim());
        currentField = '';
      } else {
        currentField += char;
      }
    }

    // If we're in quotes, this field continues on the next line
    if (inQuotes) {
      currentField += '\n';
      lineIndex++;
      continue;
    }

    // End of row
    currentRow.push(currentField.trim());
    if (currentRow.length > 0) {
      rows.push(currentRow);
    }

    currentRow = [];
    currentField = '';
    lineIndex++;
  }

  return rows;
}

function parseMultipleWorkouts(workoutText: string, dayId: string): ParsedWorkout[] {
  // Split by lines to find individual workouts
  const lines = workoutText.split('\n').map(line => line.trim()).filter(line => line);

  if (lines.length === 0) {
    return [createDefaultWorkout(dayId, 'Rest Day')];
  }

  // Look for patterns that indicate separate workouts
  const workouts: ParsedWorkout[] = [];
  let currentWorkoutLines: string[] = [];

  for (let i = 0; i < lines.length; i++) {
    const line = lines[i];

    // Check if this line starts a new workout (contains workout type and duration)
    const isNewWorkout = /^(running|custom|cycling|strength|mobility|recovery|treadmill|stair|berghaus|easy).*\d+$/i.test(line);

    if (isNewWorkout && currentWorkoutLines.length > 0) {
      // Parse the current workout and start a new one
      const workoutText = currentWorkoutLines.join('\n');
      workouts.push(parseWorkoutText(workoutText, `${dayId}-${workouts.length}`));
      currentWorkoutLines = [line];
    } else {
      currentWorkoutLines.push(line);
    }
  }

  // Parse the last workout
  if (currentWorkoutLines.length > 0) {
    const workoutText = currentWorkoutLines.join('\n');
    workouts.push(parseWorkoutText(workoutText, `${dayId}-${workouts.length}`));
  }

  return workouts.length > 0 ? workouts : [createDefaultWorkout(dayId, 'Rest Day')];
}

function parseWorkoutText(workoutText: string, id: string): ParsedWorkout {
  const lines = workoutText.split('\n').map(line => line.trim()).filter(line => line);

  if (lines.length === 0) {
    return createDefaultWorkout(id, 'Rest Day');
  }

  const firstLine = lines[0];
  const [typeAndTitle, duration] = firstLine.split(' ').slice(-1)[0].match(/\d+/) ?
    [firstLine.substring(0, firstLine.lastIndexOf(' ')), parseInt(firstLine.split(' ').slice(-1)[0])] :
    [firstLine, 30];

  const workout: ParsedWorkout = {
    id,
    title: extractTitle(typeAndTitle),
    type: determineWorkoutType(typeAndTitle),
    duration: duration || 30,
    intensity: determineIntensity(workoutText),
    description: workoutText,
    exercises: extractExercises(workoutText),
    zones: extractZones(workoutText),
    warmup: extractTimeFromPhase(workoutText, 'warmup'),
    cooldown: extractTimeFromPhase(workoutText, 'cooldown'),
    mainWork: extractTimeFromPhase(workoutText, 'go') || extractTimeFromPhase(workoutText, 'run') || extractTimeFromPhase(workoutText, 'bike')
  };

  return workout;
}

function extractTitle(typeAndTitle: string): string {
  // Extract title from "running: Treadmill Hike Z2" -> "Treadmill Hike Z2"
  if (typeAndTitle.includes(':')) {
    return typeAndTitle.split(':')[1].trim();
  }
  return typeAndTitle.replace(/^(running|custom|cycling|strength):?\s*/i, '').trim();
}

function determineWorkoutType(text: string): 'cardio' | 'strength' | 'technical' | 'rest' | 'custom' {
  const lower = text.toLowerCase();

  if (lower.includes('running') || lower.includes('cycling') || lower.includes('bike') || lower.includes('cardio')) {
    return 'cardio';
  }
  if (lower.includes('strength') || lower.includes('squat') || lower.includes('press')) {
    return 'strength';
  }
  if (lower.includes('mobility') || lower.includes('core') || lower.includes('stretching')) {
    return 'custom';
  }
  if (lower.includes('rest') || lower.includes('recovery') || lower.includes('easy')) {
    return 'rest';
  }

  return 'custom';
}

function determineIntensity(text: string): 'low' | 'medium' | 'high' {
  const lower = text.toLowerCase();

  if (lower.includes('@z1') || lower.includes('recovery') || lower.includes('easy') || lower.includes('rpe6')) {
    return 'low';
  }
  if (lower.includes('@z2') || lower.includes('moderate') || lower.includes('rpe7') || lower.includes('rpe8')) {
    return 'medium';
  }
  if (lower.includes('@z3') || lower.includes('@z4') || lower.includes('hard') || lower.includes('rpe9')) {
    return 'high';
  }

  return 'medium';
}

function extractExercises(text: string): string[] {
  const exercises: string[] = [];
  const lines = text.split('\n');

  for (const line of lines) {
    if (line.includes('squat') || line.includes('press') || line.includes('step') ||
        line.includes('bridge') || line.includes('plank') || line.includes('dead bug')) {
      exercises.push(line.trim().replace(/^-\s*(go:\s*\d+:\d+;\s*)?/i, ''));
    }
  }

  return exercises;
}

function extractZones(text: string): string[] {
  const zones: string[] = [];
  const zoneMatches = text.match(/@z[1-5]/gi);

  if (zoneMatches) {
    zones.push(...zoneMatches.map(zone => zone.toUpperCase()));
  }

  return [...new Set(zones)]; // Remove duplicates
}

function extractTimeFromPhase(text: string, phase: string): number | undefined {
  const regex = new RegExp(`${phase}:\\s*(\\d+):(\\d+)`, 'i');
  const match = text.match(regex);

  if (match) {
    return parseInt(match[1]) * 60 + parseInt(match[2]);
  }

  return undefined;
}

function getCurrentWeekNumber(): number {
  // For October 4, 2025, we're in Week 1 of the base training phase
  // This should be calculated based on the actual training start date
  return 1;
}

function getWeekStartDate(weekNumber: number): string {
  // Week 1 starts September 29, 2025 (Sunday)
  const baseDate = new Date('2025-09-29');
  const weekStart = new Date(baseDate);
  weekStart.setDate(baseDate.getDate() + (weekNumber - 1) * 7);

  return weekStart.toISOString().split('T')[0];
}

function createDefaultWorkout(id: string, title: string): ParsedWorkout {
  return {
    id,
    title,
    type: 'rest',
    duration: 30,
    intensity: 'low',
    description: 'Rest and recovery day',
    exercises: [],
    zones: []
  };
}

function getFallbackWeeklySchedule(): WeeklySchedule {
  return {
    week: 1,
    startDate: '2025-09-29',
    workouts: {
      Monday: [createDefaultWorkout('1-0', 'Rest Day')],
      Tuesday: [createDefaultWorkout('1-1', 'Base Training')],
      Wednesday: [createDefaultWorkout('1-2', 'Recovery Walk')],
      Thursday: [createDefaultWorkout('1-3', 'Treadmill Hike')],
      Friday: [createDefaultWorkout('1-4', 'Strength Training')],
      Saturday: [createDefaultWorkout('1-5', 'Saturday Endurance')],
      Sunday: [createDefaultWorkout('1-6', 'Easy Recovery')]
    }
  };
}