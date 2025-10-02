import { NextRequest, NextResponse } from 'next/server';
import * as XLSX from 'xlsx';

export interface Exercise {
  name: string;
  sets: number;
  reps: number;
  rpe: string;
  weight?: number;
  restTime?: number;
}

export interface TrainingActivity {
  id: string;
  title: string;
  type: 'cardio' | 'strength' | 'technical' | 'rest' | 'expedition';
  duration: number; // minutes
  intensity: 'low' | 'medium' | 'high';
  exercises?: Exercise[]; // For strength workouts
  location?: string;
  notes?: string;
  completed: boolean;
  date: string;
  // Planned vs Actual tracking
  actual?: {
    duration?: number;
    heartRate?: { avg: number; max: number };
    calories?: number;
    completedAt?: string;
    garminActivityId?: string;
  };
  garminWorkoutId?: string;
  status: 'planned' | 'synced' | 'completed' | 'skipped';
  compliance?: {
    durationMatch: number; // percentage
    intensityMatch: number; // percentage
    distanceMatch: number; // percentage
    overallScore: number; // percentage
    completed: boolean;
    notes: string[];
  };
}

export interface WeeklyPlan {
  weekStartDate: string;
  weekNumber: number;
  phase: string;
  goals: string[];
  activities: TrainingActivity[];
}

// Utility function to generate unique IDs
function generateId(): string {
  return Math.random().toString(36).substr(2, 9);
}

// Find the header row in the Excel sheet
function findHeaderRow(worksheet: XLSX.WorkSheet): number {
  const range = XLSX.utils.decode_range(worksheet['!ref'] || 'A1');

  // Look for common header patterns in first 10 rows
  for (let row = 0; row <= Math.min(10, range.e.r); row++) {
    const cellA = worksheet[XLSX.utils.encode_cell({r: row, c: 0})];
    const cellB = worksheet[XLSX.utils.encode_cell({r: row, c: 1})];
    const cellC = worksheet[XLSX.utils.encode_cell({r: row, c: 2})];

    if (cellA && cellB && cellC) {
      const text = `${cellA.v} ${cellB.v} ${cellC.v}`.toLowerCase();
      if (text.includes('date') || text.includes('day') || text.includes('workout') || text.includes('week')) {
        return row;
      }
    }
  }

  return 0; // Default to first row
}

// Extract day from date or date string
function getDayFromDate(dateValue: any): string | null {
  if (!dateValue) return null;

  try {
    let date: Date;

    if (typeof dateValue === 'number') {
      // Excel date serial number
      date = new Date((dateValue - 25569) * 86400 * 1000);
    } else if (typeof dateValue === 'string') {
      date = new Date(dateValue);
    } else {
      return null;
    }

    const days = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];
    return days[date.getDay()];
  } catch {
    return null;
  }
}

// Map RPE to intensity level
function mapRPEToIntensity(rpe: string): 'low' | 'medium' | 'high' {
  const rpeNum = parseInt(rpe.toString().replace(/[^0-9]/g, ''));

  if (rpeNum <= 3) return 'low';
  if (rpeNum <= 6) return 'medium';
  return 'high';
}

// Parse Sunith's specific Excel workout format
function parseSunithWorkoutFormat(worksheet: XLSX.WorkSheet): WeeklyPlan[] {
  const plans: WeeklyPlan[] = [];
  const planMap = new Map<string, WeeklyPlan>();

  const range = XLSX.utils.decode_range(worksheet['!ref'] || 'A1');

  // Sunith's format has data starting around row 7
  for (let r = 7; r <= range.e.r; r++) {
    try {
      // Extract data from specific columns based on the structure we observed
      const dateCell = worksheet[XLSX.utils.encode_cell({r, c: 1})]; // Column B
      const dayCell = worksheet[XLSX.utils.encode_cell({r, c: 3})];   // Column D
      const exerciseNumCell = worksheet[XLSX.utils.encode_cell({r, c: 6})]; // Column G
      const exerciseNameCell = worksheet[XLSX.utils.encode_cell({r, c: 7})]; // Column H
      const setsCell = worksheet[XLSX.utils.encode_cell({r, c: 11})]; // Column L
      const repsCell = worksheet[XLSX.utils.encode_cell({r, c: 13})]; // Column N
      const rpeCell = worksheet[XLSX.utils.encode_cell({r, c: 16})];  // Column Q

      // Skip empty rows
      if (!exerciseNameCell || !exerciseNameCell.v) {
        continue;
      }

      const exerciseName = exerciseNameCell.v.toString().trim();
      const sets = setsCell ? parseInt(setsCell.v.toString()) : 1;
      const reps = repsCell ? parseInt(repsCell.v.toString()) : 1;
      const rpe = rpeCell ? rpeCell.v.toString() : 'moderate';

      // Determine the date and create week key
      let workoutDate: Date;
      let dayName: string;

      if (dateCell && dateCell.v) {
        // Excel date number
        if (typeof dateCell.v === 'number') {
          workoutDate = new Date((dateCell.v - 25569) * 86400 * 1000);
        } else {
          workoutDate = new Date(dateCell.v);
        }
        dayName = workoutDate.toLocaleDateString('en-US', { weekday: 'long' });
      } else if (dayCell && dayCell.v) {
        // Use day name and create a date (using current week)
        dayName = dayCell.v.toString();
        workoutDate = new Date(); // Will be adjusted below
      } else {
        // Skip this row if we can't determine the date
        continue;
      }

      const weekKey = getWeekKey(workoutDate);

      // Get or create weekly plan
      let weeklyPlan = planMap.get(weekKey);
      if (!weeklyPlan) {
        const weekStartDate = getWeekStart(workoutDate);
        weeklyPlan = {
          weekStartDate: weekStartDate.toISOString().split('T')[0],
          weekNumber: getWeekNumber(workoutDate),
          phase: 'Foundational Strength & Mobility', // From the Excel header
          goals: ['Build strength', 'Improve mobility'],
          activities: []
        };
        planMap.set(weekKey, weeklyPlan);
      }

      // Look for existing strength workout for this day
      const workoutDateStr = workoutDate.toISOString().split('T')[0];
      const existingWorkout = weeklyPlan.activities.find(a =>
        a.date === workoutDateStr && a.type === 'strength'
      );

      const exercise: Exercise = {
        name: exerciseName,
        sets: sets || 1,
        reps: reps || 1,
        rpe: rpe || 'moderate',
        restTime: 90
      };

      if (existingWorkout) {
        // Add exercise to existing workout
        if (!existingWorkout.exercises) {
          existingWorkout.exercises = [];
        }
        existingWorkout.exercises.push(exercise);

        // Update workout title to be more general if multiple exercises
        if (existingWorkout.exercises.length > 1) {
          existingWorkout.title = `Strength Training - ${dayName}`;
        }
      } else {
        // Create new strength workout
        const activity: TrainingActivity = {
          id: generateId(),
          title: exerciseName,
          type: 'strength',
          duration: 60, // Default 60 minutes for strength training
          intensity: mapRPEToIntensity(rpe),
          exercises: [exercise],
          completed: false,
          date: workoutDateStr,
          status: 'planned'
        };
        weeklyPlan.activities.push(activity);
      }

    } catch (error) {
      console.error(`Error parsing row ${r}:`, error);
      continue;
    }
  }

  return Array.from(planMap.values()).sort((a, b) => a.weekNumber - b.weekNumber);
}

// Helper functions for date handling
function getWeekKey(date: Date): string {
  const weekStart = getWeekStart(date);
  return weekStart.toISOString().split('T')[0];
}

function getWeekStart(date: Date): Date {
  const d = new Date(date);
  const day = d.getDay();
  const diff = d.getDate() - day; // Subtract days to get to Sunday
  return new Date(d.setDate(diff));
}

function getWeekNumber(date: Date): number {
  const d = new Date(Date.UTC(date.getFullYear(), date.getMonth(), date.getDate()));
  const dayNum = d.getUTCDay() || 7;
  d.setUTCDate(d.getUTCDate() + 4 - dayNum);
  const yearStart = new Date(Date.UTC(d.getUTCFullYear(), 0, 1));
  return Math.ceil((((d.getTime() - yearStart.getTime()) / 86400000) + 1) / 7);
}

// Utility function to calculate week start date
function getWeekStartDate(weekNumber: number, baseDate?: string): string {
  const base = baseDate ? new Date(baseDate) : new Date();
  // Start from the beginning of the year or a specified base date
  const yearStart = new Date(base.getFullYear(), 0, 1);
  const weekStart = new Date(yearStart);
  weekStart.setDate(yearStart.getDate() + (weekNumber - 1) * 7);
  return weekStart.toISOString().split('T')[0];
}

// Utility function to get activity date for a specific day in a week
function getActivityDate(weekStartDate: string, dayIndex: number): string {
  const weekStart = new Date(weekStartDate);
  const activityDate = new Date(weekStart);
  activityDate.setDate(weekStart.getDate() + dayIndex);
  return activityDate.toISOString().split('T')[0];
}

// Parse Excel data into WeeklyPlan format
function parseExcelToWeeklyPlans(workbook: XLSX.WorkBook): WeeklyPlan[] {
  const plans: WeeklyPlan[] = [];
  const planMap = new Map<number, WeeklyPlan>();

  // Get the first worksheet
  const sheetName = workbook.SheetNames[0];
  const worksheet = workbook.Sheets[sheetName];

  // Parse Sunith's specific Excel format
  return parseSunithWorkoutFormat(worksheet);
}

export async function POST(request: NextRequest) {
  try {
    const formData = await request.formData();
    const file = formData.get('file') as File;

    // Validation: File presence
    if (!file) {
      return NextResponse.json(
        {
          error: 'No file provided',
          code: 'NO_FILE',
          help: 'Please select an Excel file to upload'
        },
        { status: 400 }
      );
    }

    // Validation: File type
    if (!file.name.match(/\.(xlsx|xls)$/i)) {
      return NextResponse.json(
        {
          error: 'Invalid file type. Please upload an Excel file (.xlsx or .xls)',
          code: 'INVALID_FILE_TYPE',
          help: 'Only Excel files with .xlsx or .xls extensions are supported'
        },
        { status: 400 }
      );
    }

    // Validation: File size (limit to 10MB)
    if (file.size > 10 * 1024 * 1024) {
      return NextResponse.json(
        {
          error: 'File too large. Maximum size is 10MB',
          code: 'FILE_TOO_LARGE',
          help: `Your file is ${(file.size / (1024 * 1024)).toFixed(2)}MB. Please reduce the file size or split into smaller files.`
        },
        { status: 400 }
      );
    }

    // Validation: Minimum file size (avoid empty files)
    if (file.size < 100) {
      return NextResponse.json(
        {
          error: 'File appears to be empty or corrupted',
          code: 'FILE_TOO_SMALL',
          help: 'Please check that your Excel file contains training data'
        },
        { status: 400 }
      );
    }

    // Read and validate Excel file
    let buffer: ArrayBuffer;
    let workbook: XLSX.WorkBook;

    try {
      buffer = await file.arrayBuffer();
      workbook = XLSX.read(buffer, { type: 'array', cellDates: true, cellNF: false });
    } catch (readError) {
      return NextResponse.json(
        {
          error: 'Failed to read Excel file. File may be corrupted or password-protected.',
          code: 'EXCEL_READ_ERROR',
          help: 'Ensure the file is a valid Excel file and not password-protected',
          details: readError instanceof Error ? readError.message : 'Unknown read error'
        },
        { status: 400 }
      );
    }

    // Validation: Check if workbook has sheets
    if (!workbook.SheetNames || workbook.SheetNames.length === 0) {
      return NextResponse.json(
        {
          error: 'Excel file contains no worksheets',
          code: 'NO_WORKSHEETS',
          help: 'Please ensure your Excel file contains at least one worksheet with training data'
        },
        { status: 400 }
      );
    }

    // Validation: Check first sheet has data
    const firstSheet = workbook.Sheets[workbook.SheetNames[0]];
    if (!firstSheet || !firstSheet['!ref']) {
      return NextResponse.json(
        {
          error: 'First worksheet appears to be empty',
          code: 'EMPTY_WORKSHEET',
          help: 'Please ensure the first worksheet contains your training data'
        },
        { status: 400 }
      );
    }

    // Parse Excel data with enhanced error handling
    let plans: WeeklyPlan[];
    const parseWarnings: string[] = [];

    try {
      plans = parseExcelToWeeklyPlans(workbook);

      // Additional validation on parsed data
      if (plans.length === 0) {
        return NextResponse.json(
          {
            error: 'No valid training data found in the Excel file',
            code: 'NO_TRAINING_DATA',
            help: 'Please ensure your Excel file follows the expected format with dates, exercises, sets, reps, and RPE columns',
            suggestion: 'Check that data starts around row 7 and includes exercise names in column H'
          },
          { status: 400 }
        );
      }

      // Validate parsed data quality
      const totalActivities = plans.reduce((sum, plan) => sum + plan.activities.length, 0);
      if (totalActivities === 0) {
        return NextResponse.json(
          {
            error: 'No training activities found in parsed data',
            code: 'NO_ACTIVITIES',
            help: 'Parsed training weeks but found no individual activities. Check exercise data format.'
          },
          { status: 400 }
        );
      }

      // Check for common data issues
      const activitiesWithoutExercises = plans.reduce((count, plan) =>
        count + plan.activities.filter(a => a.type === 'strength' && (!a.exercises || a.exercises.length === 0)).length, 0);

      if (activitiesWithoutExercises > 0) {
        parseWarnings.push(`${activitiesWithoutExercises} strength activities found without exercise details`);
      }

      const activitiesWithoutDates = plans.reduce((count, plan) =>
        count + plan.activities.filter(a => !a.date || a.date === 'Invalid Date').length, 0);

      if (activitiesWithoutDates > 0) {
        parseWarnings.push(`${activitiesWithoutDates} activities found with invalid dates`);
      }

    } catch (parseError) {
      console.error('Excel parsing error:', parseError);
      return NextResponse.json(
        {
          error: 'Failed to parse training data from Excel file',
          code: 'PARSE_ERROR',
          help: 'The Excel file structure may not match the expected format. Please check column positions and data types.',
          details: parseError instanceof Error ? parseError.message : 'Unknown parsing error',
          suggestion: 'Ensure dates are in column B, exercises in column H, sets in column L, reps in column N, and RPE in column Q'
        },
        { status: 400 }
      );
    }

    // Return parsed plans with success response
    return NextResponse.json({
      success: true,
      message: `Successfully parsed ${plans.length} training weeks`,
      plans,
      summary: {
        totalWeeks: plans.length,
        totalActivities: plans.reduce((sum, plan) => sum + plan.activities.length, 0),
        phases: [...new Set(plans.map(plan => plan.phase))],
        dateRange: {
          earliest: plans.length > 0 ? plans[0].weekStartDate : null,
          latest: plans.length > 0 ? plans[plans.length - 1].weekStartDate : null
        }
      },
      warnings: parseWarnings.length > 0 ? parseWarnings : undefined
    });

  } catch (error) {
    console.error('Unexpected Excel upload error:', error);
    return NextResponse.json(
      {
        error: 'An unexpected error occurred while processing the Excel file',
        code: 'INTERNAL_ERROR',
        help: 'This appears to be a system error. Please try again or contact support.',
        details: error instanceof Error ? error.message : 'Unknown error'
      },
      { status: 500 }
    );
  }
}

// GET endpoint to provide Excel template information
export async function GET() {
  return NextResponse.json({
    templateFormat: {
      requiredColumns: [
        'Week Number',
        'Phase',
        'Day',
        'Activity Title',
        'Type',
        'Duration (min)',
        'Intensity',
        'Location',
        'Notes',
        'Goals'
      ],
      supportedTypes: ['cardio', 'strength', 'technical', 'rest', 'expedition'],
      supportedIntensities: ['low', 'medium', 'high'],
      example: {
        'Week Number': 1,
        'Phase': 'Base Building',
        'Day': 'Monday',
        'Activity Title': 'Morning Hike',
        'Type': 'cardio',
        'Duration (min)': 120,
        'Intensity': 'medium',
        'Location': 'Local Trail',
        'Notes': 'Focus on steady pace',
        'Goals': 'Build aerobic base, Improve endurance'
      }
    }
  });
}