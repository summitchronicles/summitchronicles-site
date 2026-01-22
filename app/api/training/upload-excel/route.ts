import { NextRequest, NextResponse } from 'next/server';
import {
  parseWorkoutExcel,
  validateWorkoutData,
  type WorkoutRow,
} from '@/lib/excel/workout-parser';
import { generateChatCompletion } from '@/lib/integrations/replicate';
import { getSupabaseClient } from '@/lib/supabase';

export const dynamic = 'force-dynamic';

// Initialize Supabase client

interface UploadResponse {
  success: boolean;
  data?: {
    summary: {
      totalRows: number;
      validRows: number;
      invalidRows: number;
      dateRange: { start: string; end: string };
    };
    workouts: WorkoutRow[];
    insights?: string;
  };
  error?: string;
  errors?: string[];
}

export async function POST(
  request: NextRequest
): Promise<NextResponse<UploadResponse>> {
  try {
    // Parse form data
    const formData = await request.formData();
    const file = formData.get('excel_file') as File;
    const generateInsights = formData.get('generate_insights') === 'true';

    if (!file) {
      return NextResponse.json(
        { success: false, error: 'No Excel file provided' },
        { status: 400 }
      );
    }

    // Validate file type
    const allowedTypes = [
      'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet', // .xlsx
      'application/vnd.ms-excel', // .xls
      'text/csv', // .csv
    ];

    if (!allowedTypes.includes(file.type)) {
      return NextResponse.json(
        {
          success: false,
          error:
            'Invalid file type. Please upload Excel (.xlsx, .xls) or CSV files.',
        },
        { status: 400 }
      );
    }

    // Convert file to buffer
    const fileBuffer = Buffer.from(await file.arrayBuffer());

    // Parse Excel file
    const parseResult = await parseWorkoutExcel(fileBuffer, {
      useAI: false, // Disable AI for faster parsing (column names already match)
    });

    if (parseResult.workouts.length === 0) {
      return NextResponse.json(
        {
          success: false,
          error: 'No valid workout data found in file',
          errors: parseResult.errors,
        },
        { status: 400 }
      );
    }

    // Validate workout data
    const validation = validateWorkoutData(parseResult.workouts);

    if (validation.invalid.length > 0) {
      const invalidErrors = validation.invalid.map(
        ({ workout, errors }) => `Date ${workout.date}: ${errors.join(', ')}`
      );

      return NextResponse.json(
        {
          success: false,
          error: 'Some workout data is invalid',
          errors: [...parseResult.errors, ...invalidErrors],
        },
        { status: 400 }
      );
    }

    // Store validated workouts in Supabase
    const newWorkouts = validation.valid;

    // Check for existing workouts to avoid duplicates
    const { data: existingWorkouts, error: fetchError } =
      await getSupabaseClient()
        .from('historical_workouts')
        .select('date, exercise_type')
        .in(
          'date',
          newWorkouts.map((w) => w.date)
        );

    if (fetchError) {
      console.error('Error fetching existing workouts:', fetchError);
    }

    const existingKeys = new Set(
      (existingWorkouts || []).map((w) => `${w.date}-${w.exercise_type}`)
    );

    const uniqueNewWorkouts = newWorkouts.filter(
      (workout) => !existingKeys.has(`${workout.date}-${workout.exercise_type}`)
    );

    // Insert new workouts into Supabase
    if (uniqueNewWorkouts.length > 0) {
      const { error: insertError } = await getSupabaseClient()
        .from('historical_workouts')
        .insert(uniqueNewWorkouts);

      if (insertError) {
        console.error('Error inserting workouts:', insertError);
        return NextResponse.json(
          {
            success: false,
            error: `Failed to save workouts to database: ${insertError.message}`,
          },
          { status: 500 }
        );
      }
    }

    // Generate AI insights if requested
    let insights: string | undefined;

    if (generateInsights && uniqueNewWorkouts.length > 0) {
      try {
        // Fetch recent workouts for context
        const { data: recentWorkouts } = await getSupabaseClient()
          .from('historical_workouts')
          .select('*')
          .order('date', { ascending: false })
          .limit(20);

        insights = await generateWorkoutInsights(
          uniqueNewWorkouts,
          recentWorkouts || []
        );
      } catch (error) {
        console.error('Failed to generate insights:', error);
        // Don't fail the entire upload if insights fail
      }
    }

    return NextResponse.json({
      success: true,
      data: {
        summary: {
          ...parseResult.summary,
          validRows: uniqueNewWorkouts.length,
        },
        workouts: uniqueNewWorkouts,
        insights,
      },
    });
  } catch (error) {
    console.error('Excel upload error:', error);
    return NextResponse.json(
      {
        success: false,
        error:
          error instanceof Error
            ? error.message
            : 'Failed to process Excel file',
      },
      { status: 500 }
    );
  }
}

export async function GET(request: NextRequest): Promise<NextResponse> {
  try {
    const url = new URL(request.url);
    const startDate = url.searchParams.get('start_date');
    const endDate = url.searchParams.get('end_date');
    const exerciseType = url.searchParams.get('exercise_type');

    // Build Supabase query with filters
    let query = getSupabaseClient()
      .from('historical_workouts')
      .select('*')
      .order('date', { ascending: false });

    // Apply filters
    if (startDate) {
      query = query.gte('date', startDate);
    }

    if (endDate) {
      query = query.lte('date', endDate);
    }

    if (exerciseType) {
      query = query.ilike('exercise_type', `%${exerciseType}%`);
    }

    const { data: filteredWorkouts, error } = await query;

    if (error) {
      throw new Error(`Database query failed: ${error.message}`);
    }

    // Calculate summary statistics
    const summary = calculateWorkoutSummary(filteredWorkouts);

    return NextResponse.json({
      success: true,
      data: {
        workouts: filteredWorkouts,
        summary,
        totalCount: filteredWorkouts.length,
      },
    });
  } catch (error) {
    console.error('Get workouts error:', error);
    return NextResponse.json(
      { success: false, error: 'Failed to retrieve workout data' },
      { status: 500 }
    );
  }
}

/**
 * Generate AI insights from workout data
 */
async function generateWorkoutInsights(
  newWorkouts: WorkoutRow[],
  allWorkouts: WorkoutRow[]
): Promise<string> {
  const recentWorkouts = allWorkouts
    .filter((w) => {
      const workoutDate = new Date(w.date);
      const fourWeeksAgo = new Date();
      fourWeeksAgo.setDate(fourWeeksAgo.getDate() - 28);
      return workoutDate >= fourWeeksAgo;
    })
    .slice(-20); // Last 20 workouts

  const workoutSummary = recentWorkouts
    .map(
      (w) =>
        `${w.date}: ${w.exercise_type} - ${w.actual_duration || w.planned_duration || 'N/A'}min, ` +
        `intensity ${w.intensity || 'N/A'}, completion ${w.completion_rate || 'N/A'}%`
    )
    .join('\n');

  const newWorkoutSummary = newWorkouts
    .map(
      (w) =>
        `${w.date}: ${w.exercise_type} - ${w.actual_duration || w.planned_duration || 'N/A'}min`
    )
    .join('\n');

  const prompt = `You are Sunith's personal mountaineering training analyst. Analyze the newly uploaded workout data in context of recent training history.

NEWLY UPLOADED WORKOUTS:
${newWorkoutSummary}

RECENT TRAINING HISTORY (last 4 weeks):
${workoutSummary}

Provide specific insights about:
1. **Training Consistency**: How does the new data fit with recent patterns?
2. **Progress Assessment**: What improvements or concerns do you see?
3. **Expedition Readiness**: How is this training supporting Everest 2025 preparation?
4. **Recommendations**: 3 specific action items for the next training block

Keep response under 300 words, focus on actionable insights, and maintain an encouraging but honest tone.`;

  return await generateChatCompletion([
    {
      role: 'system',
      content:
        'You are an expert mountaineering coach analyzing training data for Everest preparation. Be specific and actionable.',
    },
    {
      role: 'user',
      content: prompt,
    },
  ]);
}

/**
 * Calculate workout summary statistics
 */
function calculateWorkoutSummary(workouts: WorkoutRow[]) {
  if (workouts.length === 0) {
    return {
      totalWorkouts: 0,
      avgDuration: 0,
      avgIntensity: 0,
      avgCompletionRate: 0,
      totalElevation: 0,
      totalDistance: 0,
      exerciseTypes: {},
    };
  }

  const withDuration = workouts.filter(
    (w) => w.actual_duration || w.planned_duration
  );
  const withIntensity = workouts.filter((w) => w.intensity);
  const withCompletion = workouts.filter((w) => w.completion_rate);
  const withElevation = workouts.filter((w) => w.elevation_gain);
  const withDistance = workouts.filter((w) => w.distance);

  const exerciseTypes = workouts.reduce(
    (acc, w) => {
      acc[w.exercise_type] = (acc[w.exercise_type] || 0) + 1;
      return acc;
    },
    {} as Record<string, number>
  );

  return {
    totalWorkouts: workouts.length,
    avgDuration:
      withDuration.length > 0
        ? Math.round(
            withDuration.reduce(
              (sum, w) => sum + (w.actual_duration || w.planned_duration || 0),
              0
            ) / withDuration.length
          )
        : 0,
    avgIntensity:
      withIntensity.length > 0
        ? Math.round(
            (withIntensity.reduce((sum, w) => sum + (w.intensity || 0), 0) /
              withIntensity.length) *
              10
          ) / 10
        : 0,
    avgCompletionRate:
      withCompletion.length > 0
        ? Math.round(
            (withCompletion.reduce(
              (sum, w) => sum + (w.completion_rate || 0),
              0
            ) /
              withCompletion.length) *
              10
          ) / 10
        : 0,
    totalElevation: withElevation.reduce(
      (sum, w) => sum + (w.elevation_gain || 0),
      0
    ),
    totalDistance:
      Math.round(
        withDistance.reduce((sum, w) => sum + (w.distance || 0), 0) * 10
      ) / 10,
    exerciseTypes,
  };
}
