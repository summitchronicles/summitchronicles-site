import * as XLSX from 'xlsx';
import { generateChatCompletion } from '../integrations/cohere';

export interface WorkoutRow {
  date: string;
  planned_duration?: number;
  actual_duration?: number;
  exercise_type: string;
  intensity?: number;
  completion_rate?: number;
  notes?: string;
  elevation_gain?: number;
  distance?: number;
  heart_rate_avg?: number;
  calories_burned?: number;
}

export interface ParsedWorkoutData {
  workouts: WorkoutRow[];
  errors: string[];
  summary: {
    totalRows: number;
    validRows: number;
    invalidRows: number;
    dateRange: { start: string; end: string };
  };
}

// Expected column mappings (flexible to handle different Excel formats)
const COLUMN_MAPPINGS = {
  date: ['date', 'workout_date', 'training_date', 'day', 'column_1'],
  planned_duration: [
    'planned_duration',
    'planned_time',
    'target_duration',
    'planned_minutes',
  ],
  actual_duration: [
    'actual_duration',
    'actual_time',
    'duration',
    'time_minutes',
    'duration_(mins)',
  ],
  exercise_type: [
    'exercise_type',
    'activity_type',
    'workout_type',
    'type',
    'exercise',
    'activity',
  ],
  intensity: [
    'intensity',
    'effort',
    'rpe',
    'perceived_exertion',
    'intensity_(rpe)',
  ],
  completion_rate: [
    'completion_rate',
    'completion',
    'percent_complete',
    'completed',
  ],
  notes: ['notes', 'comments', 'description', 'remarks'],
  elevation_gain: ['elevation_gain', 'elevation', 'climb', 'ascent'],
  distance: ['distance', 'km', 'kilometers', 'miles', 'distance_(km)'],
  heart_rate_avg: [
    'heart_rate_avg',
    'avg_hr',
    'heart_rate',
    'hr_avg',
    'average_hr_(bpm)',
  ],
  calories_burned: ['calories_burned', 'calories', 'cal', 'energy'],
};

/**
 * Parse Excel file and extract workout data
 */
export async function parseWorkoutExcel(
  fileBuffer: Buffer,
  options: {
    sheetName?: string;
    headerRow?: number;
    useAI?: boolean;
  } = {}
): Promise<ParsedWorkoutData> {
  const { sheetName, headerRow = 0, useAI = true } = options;

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
      blankrows: false,
    }) as any[][];

    if (rawData.length <= headerRow) {
      throw new Error('Not enough data rows in Excel file');
    }

    // Extract headers and data
    const headers = rawData[headerRow].map((h: any) =>
      String(h || '')
        .toLowerCase()
        .trim()
        .replace(/\s+/g, '_')
    );
    const dataRows = rawData.slice(headerRow + 1);

    // Map columns to our schema
    const columnMapping = await mapColumns(headers, useAI);

    // Parse each row
    const workouts: WorkoutRow[] = [];
    const errors: string[] = [];

    for (let i = 0; i < dataRows.length; i++) {
      const rowNumber = headerRow + i + 2; // Excel row number (1-indexed + header)
      const row = dataRows[i];

      try {
        const workout = parseWorkoutRow(row, headers, columnMapping, rowNumber);
        if (workout) {
          workouts.push(workout);
        }
      } catch (error) {
        errors.push(
          `Row ${rowNumber}: ${error instanceof Error ? error.message : String(error)}`
        );
      }
    }

    // Calculate summary
    const dates = workouts
      .map((w) => w.date)
      .filter(Boolean)
      .sort();

    const summary = {
      totalRows: dataRows.length,
      validRows: workouts.length,
      invalidRows: errors.length,
      dateRange: {
        start: dates[0] || '',
        end: dates[dates.length - 1] || '',
      },
    };

    return {
      workouts,
      errors,
      summary,
    };
  } catch (error) {
    throw new Error(
      `Failed to parse Excel file: ${error instanceof Error ? error.message : String(error)}`
    );
  }
}

/**
 * Map Excel columns to our schema using fuzzy matching and AI
 */
async function mapColumns(
  headers: string[],
  useAI: boolean
): Promise<Record<string, number | null>> {
  const mapping: Record<string, number | null> = {};

  // Initialize all mappings as null
  Object.keys(COLUMN_MAPPINGS).forEach((key) => {
    mapping[key] = null;
  });

  // First pass: exact and fuzzy matching
  headers.forEach((header, index) => {
    for (const [schemaField, possibleNames] of Object.entries(
      COLUMN_MAPPINGS
    )) {
      if (
        possibleNames.includes(header) ||
        possibleNames.some(
          (name) => header.includes(name) || name.includes(header)
        )
      ) {
        mapping[schemaField] = index;
        break;
      }
    }
  });

  // Second pass: Use AI for unmapped critical fields
  if (useAI) {
    const unmappedFields = Object.entries(mapping)
      .filter(([_, index]) => index === null)
      .map(([field, _]) => field);

    if (unmappedFields.length > 0) {
      try {
        const aiMapping = await mapColumnsWithAI(headers, unmappedFields);
        Object.assign(mapping, aiMapping);
      } catch (error) {
        console.warn('AI column mapping failed:', error);
      }
    }
  }

  return mapping;
}

/**
 * Use AI to map remaining unmapped columns
 */
async function mapColumnsWithAI(
  headers: string[],
  unmappedFields: string[]
): Promise<Record<string, number | null>> {
  const prompt = `You are analyzing Excel column headers for workout data. Map the following headers to workout data fields.

Excel Headers (with index):
${headers.map((h, i) => `${i}: "${h}"`).join('\n')}

Unmapped Fields to Match:
${unmappedFields.map((f) => `- ${f}: ${getFieldDescription(f)}`).join('\n')}

Return ONLY a JSON object mapping field names to column indices (or null if no match):
Example: {"date": 0, "exercise_type": 2, "duration": null}`;

  try {
    const response = await generateChatCompletion([
      {
        role: 'system',
        content:
          'You are a data mapping assistant. Respond only with valid JSON.',
      },
      { role: 'user', content: prompt },
    ]);

    // Extract JSON from response
    const jsonMatch = response.match(/\{[\s\S]*\}/);
    if (jsonMatch) {
      return JSON.parse(jsonMatch[0]);
    }

    return {};
  } catch (error) {
    console.error('AI column mapping error:', error);
    return {};
  }
}

/**
 * Get human-readable description of field
 */
function getFieldDescription(field: string): string {
  const descriptions: Record<string, string> = {
    date: 'workout date (YYYY-MM-DD format)',
    planned_duration: 'planned workout duration in minutes',
    actual_duration: 'actual workout duration in minutes',
    exercise_type: 'type of exercise (cardio, strength, climbing, etc.)',
    intensity: 'workout intensity rating (1-10 scale)',
    completion_rate: 'percentage of planned workout completed',
    notes: 'workout notes or comments',
    elevation_gain: 'elevation gained during workout in meters',
    distance: 'distance covered in kilometers',
    heart_rate_avg: 'average heart rate in bpm',
    calories_burned: 'calories burned during workout',
  };

  return descriptions[field] || field;
}

/**
 * Parse individual workout row
 */
function parseWorkoutRow(
  row: any[],
  headers: string[],
  columnMapping: Record<string, number | null>,
  rowNumber: number
): WorkoutRow | null {
  const workout: Partial<WorkoutRow> = {};

  // Extract date (required field)
  const dateIndex = columnMapping.date;
  if (dateIndex === null || !row[dateIndex]) {
    throw new Error('Date is required but not found');
  }

  const dateValue = row[dateIndex];
  const parsedDate = parseDate(dateValue);

  if (!parsedDate) {
    throw new Error(`Invalid date format: ${dateValue}`);
  }

  workout.date = parsedDate;

  // Extract exercise type (required field)
  const typeIndex = columnMapping.exercise_type;
  if (typeIndex === null || !row[typeIndex]) {
    throw new Error('Exercise type is required but not found');
  }

  workout.exercise_type = String(row[typeIndex]).toLowerCase().trim();

  if (!isValidExerciseType(workout.exercise_type)) {
    throw new Error(`Invalid exercise type: ${workout.exercise_type}`);
  }

  // Extract optional fields
  Object.entries(columnMapping).forEach(([field, index]) => {
    if (field === 'date' || field === 'exercise_type' || index === null) return;

    const value = row[index];
    if (value !== null && value !== undefined && value !== '') {
      switch (field) {
        case 'planned_duration':
        case 'actual_duration':
        case 'intensity':
        case 'elevation_gain':
        case 'heart_rate_avg':
        case 'calories_burned':
          const numValue = parseFloat(String(value));
          if (!isNaN(numValue)) {
            (workout as any)[field] = Math.round(numValue);
          }
          break;

        case 'completion_rate':
          const pctValue = parseFloat(String(value));
          if (!isNaN(pctValue)) {
            (workout as any)[field] = Math.min(100, Math.max(0, pctValue));
          }
          break;

        case 'distance':
          const distValue = parseFloat(String(value));
          if (!isNaN(distValue)) {
            (workout as any)[field] = distValue;
          }
          break;

        case 'notes':
          (workout as any)[field] = String(value).trim();
          break;
      }
    }
  });

  // Calculate completion rate if missing but have planned/actual duration
  if (
    !workout.completion_rate &&
    workout.planned_duration &&
    workout.actual_duration
  ) {
    workout.completion_rate = Math.min(
      100,
      (workout.actual_duration / workout.planned_duration) * 100
    );
  }

  return workout as WorkoutRow;
}

/**
 * Parse various date formats
 */
function parseDate(value: any): string | null {
  if (!value) return null;

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

  // Try to parse common formats
  const patterns = [
    /^(\d{4})-(\d{1,2})-(\d{1,2})$/, // YYYY-MM-DD
    /^(\d{1,2})\/(\d{1,2})\/(\d{4})$/, // MM/DD/YYYY
    /^(\d{1,2})-(\d{1,2})-(\d{4})$/, // MM-DD-YYYY
  ];

  for (const pattern of patterns) {
    const match = str.match(pattern);
    if (match) {
      const [, p1, p2, p3] = match;
      let year, month, day;

      if (pattern === patterns[0]) {
        // YYYY-MM-DD
        [year, month, day] = [p1, p2, p3];
      } else {
        // MM/DD/YYYY or MM-DD-YYYY
        [month, day, year] = [p1, p2, p3];
      }

      const parsedDate = new Date(
        parseInt(year),
        parseInt(month) - 1,
        parseInt(day)
      );
      if (!isNaN(parsedDate.getTime())) {
        return parsedDate.toISOString().split('T')[0];
      }
    }
  }

  return null;
}

/**
 * Validate exercise type
 */
function isValidExerciseType(type: string): boolean {
  const validTypes = [
    'cardio',
    'strength',
    'climbing',
    'hiking',
    'running',
    'cycling',
    'swimming',
    'yoga',
    'rest',
    'recovery',
    'flexibility',
    'endurance',
    'interval',
    'cross-training',
    'mountaineering',
    'skiing',
    'snowboarding',
    'walk',
    'run',
    'treadmill',
    'bike',
    'elliptical',
    'rowing',
    'weights',
    'core',
    'stretching',
    'training',
  ];

  return (
    validTypes.includes(type) ||
    validTypes.some((valid) => type.includes(valid) || valid.includes(type))
  );
}

/**
 * Validate parsed workout data
 */
export function validateWorkoutData(workouts: WorkoutRow[]): {
  valid: WorkoutRow[];
  invalid: Array<{ workout: WorkoutRow; errors: string[] }>;
} {
  const valid: WorkoutRow[] = [];
  const invalid: Array<{ workout: WorkoutRow; errors: string[] }> = [];

  workouts.forEach((workout) => {
    const errors: string[] = [];

    // Validate date
    if (!workout.date || !workout.date.match(/^\d{4}-\d{2}-\d{2}$/)) {
      errors.push('Invalid date format');
    }

    // Validate exercise type
    if (!workout.exercise_type || !isValidExerciseType(workout.exercise_type)) {
      errors.push('Invalid exercise type');
    }

    // Validate intensity
    if (
      workout.intensity !== undefined &&
      (workout.intensity < 1 || workout.intensity > 10)
    ) {
      errors.push('Intensity must be between 1 and 10');
    }

    // Validate completion rate
    if (
      workout.completion_rate !== undefined &&
      (workout.completion_rate < 0 || workout.completion_rate > 100)
    ) {
      errors.push('Completion rate must be between 0 and 100');
    }

    if (errors.length === 0) {
      valid.push(workout);
    } else {
      invalid.push({ workout, errors });
    }
  });

  return { valid, invalid };
}
