import { NextRequest, NextResponse } from 'next/server';
import * as XLSX from 'xlsx';

export interface TrainingActivity {
  id: string;
  title: string;
  type: 'cardio' | 'strength' | 'technical' | 'rest' | 'expedition';
  duration: number; // minutes
  intensity: 'low' | 'medium' | 'high';
  location?: string;
  notes?: string;
  completed: boolean;
  date: string;
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

  // Convert to JSON
  const data = XLSX.utils.sheet_to_json(worksheet) as any[];

  // Expected column headers (case-insensitive):
  // Week Number, Phase, Day, Activity Title, Type, Duration (min), Intensity, Location, Notes, Goals

  data.forEach((row, index) => {
    try {
      // Normalize column names (handle various possible headers)
      const normalizedRow: any = {};
      Object.keys(row).forEach(key => {
        const normalizedKey = key.toLowerCase()
          .replace(/[^a-z0-9]/g, '')
          .replace(/min|minutes/, 'duration')
          .replace(/activitytitle|activity/, 'title')
          .replace(/weeknumber|week/, 'weeknumber');
        normalizedRow[normalizedKey] = row[key];
      });

      const weekNumber = parseInt(normalizedRow.weeknumber || normalizedRow.week) || 1;
      const phase = normalizedRow.phase || 'Training Phase';
      const day = normalizedRow.day || index % 7;
      const title = normalizedRow.title || normalizedRow.activitytitle || 'Training Activity';
      const type = normalizedRow.type?.toLowerCase() || 'cardio';
      const duration = parseInt(normalizedRow.duration || normalizedRow.durationmin) || 60;
      const intensity = normalizedRow.intensity?.toLowerCase() || 'medium';
      const location = normalizedRow.location || '';
      const notes = normalizedRow.notes || '';
      const goals = normalizedRow.goals || '';

      // Validate type
      const validTypes = ['cardio', 'strength', 'technical', 'rest', 'expedition'];
      const activityType = validTypes.includes(type) ? type : 'cardio';

      // Validate intensity
      const validIntensities = ['low', 'medium', 'high'];
      const activityIntensity = validIntensities.includes(intensity) ? intensity : 'medium';

      // Get or create weekly plan
      let weeklyPlan = planMap.get(weekNumber);
      if (!weeklyPlan) {
        weeklyPlan = {
          weekStartDate: getWeekStartDate(weekNumber),
          weekNumber,
          phase,
          goals: goals ? goals.split(',').map((g: string) => g.trim()).filter(Boolean) : [],
          activities: [],
        };
        planMap.set(weekNumber, weeklyPlan);
      }

      // Create activity
      const activity: TrainingActivity = {
        id: generateId(),
        title,
        type: activityType as any,
        duration,
        intensity: activityIntensity as any,
        location: location || undefined,
        notes: notes || undefined,
        completed: false,
        date: getActivityDate(weeklyPlan.weekStartDate, typeof day === 'number' ? day : weeklyPlan.activities.length % 7),
      };

      weeklyPlan.activities.push(activity);

      // Update goals if provided in this row
      if (goals && weeklyPlan.goals.length === 0) {
        weeklyPlan.goals = goals.split(',').map((g: string) => g.trim()).filter(Boolean);
      }

    } catch (error) {
      console.error(`Error parsing row ${index + 1}:`, error);
      // Continue processing other rows
    }
  });

  // Convert map to array and sort by week number
  return Array.from(planMap.values()).sort((a, b) => a.weekNumber - b.weekNumber);
}

export async function POST(request: NextRequest) {
  try {
    const formData = await request.formData();
    const file = formData.get('file') as File;

    if (!file) {
      return NextResponse.json(
        { error: 'No file provided' },
        { status: 400 }
      );
    }

    // Check file type
    if (!file.name.match(/\.(xlsx|xls)$/i)) {
      return NextResponse.json(
        { error: 'Invalid file type. Please upload an Excel file (.xlsx or .xls)' },
        { status: 400 }
      );
    }

    // Check file size (limit to 10MB)
    if (file.size > 10 * 1024 * 1024) {
      return NextResponse.json(
        { error: 'File too large. Maximum size is 10MB' },
        { status: 400 }
      );
    }

    // Read file
    const buffer = await file.arrayBuffer();
    const workbook = XLSX.read(buffer, { type: 'array' });

    // Parse Excel data
    const plans = parseExcelToWeeklyPlans(workbook);

    if (plans.length === 0) {
      return NextResponse.json(
        { error: 'No valid training data found in the Excel file' },
        { status: 400 }
      );
    }

    // Return parsed plans
    return NextResponse.json({
      success: true,
      message: `Successfully parsed ${plans.length} training weeks`,
      plans,
      summary: {
        totalWeeks: plans.length,
        totalActivities: plans.reduce((sum, plan) => sum + plan.activities.length, 0),
        phases: [...new Set(plans.map(plan => plan.phase))],
      }
    });

  } catch (error) {
    console.error('Excel upload error:', error);
    return NextResponse.json(
      {
        error: 'Failed to process Excel file. Please check the format and try again.',
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