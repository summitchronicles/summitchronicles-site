import { NextRequest, NextResponse } from 'next/server';
import { createClient } from '@supabase/supabase-js';
import { parseTrainingPlanExcel } from '@/lib/excel/training-plan-parser';

export const dynamic = 'force-dynamic';

const supabase = createClient(
  process.env.SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!
);

interface UploadResponse {
  success: boolean;
  message?: string;
  plan?: {
    id: string;
    filename: string;
    week: number;
    startDate: string;
    uploadedAt: string;
  };
  error?: string;
}

export async function POST(request: NextRequest): Promise<NextResponse<UploadResponse>> {
  try {
    // Parse form data
    const formData = await request.formData();
    const file = formData.get('training_plan') as File;
    const setAsActive = formData.get('set_as_active') !== 'false'; // default true

    if (!file) {
      return NextResponse.json(
        { success: false, error: 'No training plan file provided' },
        { status: 400 }
      );
    }

    // Validate file type
    const allowedTypes = [
      'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet', // .xlsx
      'application/vnd.ms-excel', // .xls
    ];

    if (!allowedTypes.includes(file.type) && !file.name.endsWith('.xlsx') && !file.name.endsWith('.xls')) {
      return NextResponse.json(
        { success: false, error: 'Invalid file type. Please upload Excel (.xlsx, .xls) files.' },
        { status: 400 }
      );
    }

    // Convert file to buffer and parse to validate
    const fileBuffer = Buffer.from(await file.arrayBuffer());
    const weeklySchedule = await parseTrainingPlanExcel(fileBuffer);

    if (!weeklySchedule || !weeklySchedule.workouts) {
      return NextResponse.json(
        { success: false, error: 'Failed to parse training plan. Please check the file format.' },
        { status: 400 }
      );
    }

    // Upload file to Supabase Storage
    const timestamp = new Date().toISOString().replace(/[:.]/g, '-');
    const filename = `training-plan-${timestamp}-${file.name}`;
    const filePath = `training-plans/${filename}`;

    const { error: uploadError } = await supabase.storage
      .from('workout-files')
      .upload(filePath, fileBuffer, {
        contentType: file.type,
        upsert: false
      });

    if (uploadError) {
      console.error('Supabase storage upload error:', uploadError);
      return NextResponse.json(
        { success: false, error: `Failed to upload file: ${uploadError.message}` },
        { status: 500 }
      );
    }

    // Store metadata in database
    const planMetadata = {
      filename: file.name,
      storage_path: filePath,
      week_number: weeklySchedule.week,
      start_date: weeklySchedule.startDate,
      is_active: setAsActive,
      uploaded_at: new Date().toISOString(),
      workout_count: Object.values(weeklySchedule.workouts).flat().length
    };

    // If setting as active, deactivate all other plans
    if (setAsActive) {
      await supabase
        .from('training_plans')
        .update({ is_active: false })
        .eq('is_active', true);
    }

    const { data: insertedPlan, error: insertError } = await supabase
      .from('training_plans')
      .insert(planMetadata)
      .select()
      .single();

    if (insertError) {
      console.error('Database insert error:', insertError);
      // Try to clean up uploaded file
      await supabase.storage.from('workout-files').remove([filePath]);

      return NextResponse.json(
        { success: false, error: `Failed to save plan metadata: ${insertError.message}` },
        { status: 500 }
      );
    }

    return NextResponse.json({
      success: true,
      message: 'Training plan uploaded successfully',
      plan: {
        id: insertedPlan.id,
        filename: insertedPlan.filename,
        week: insertedPlan.week_number,
        startDate: insertedPlan.start_date,
        uploadedAt: insertedPlan.uploaded_at
      }
    });

  } catch (error) {
    console.error('Training plan upload error:', error);
    return NextResponse.json(
      {
        success: false,
        error: error instanceof Error ? error.message : 'Failed to upload training plan'
      },
      { status: 500 }
    );
  }
}

export async function GET(request: NextRequest): Promise<NextResponse> {
  try {
    // Get all training plans, ordered by upload date
    const { data: plans, error } = await supabase
      .from('training_plans')
      .select('*')
      .order('uploaded_at', { ascending: false });

    if (error) {
      throw new Error(`Failed to fetch training plans: ${error.message}`);
    }

    return NextResponse.json({
      success: true,
      plans: plans || [],
      active_plan: plans?.find(p => p.is_active) || null
    });

  } catch (error) {
    console.error('Get training plans error:', error);
    return NextResponse.json(
      { success: false, error: 'Failed to retrieve training plans' },
      { status: 500 }
    );
  }
}

export async function DELETE(request: NextRequest): Promise<NextResponse> {
  try {
    const { searchParams } = new URL(request.url);
    const planId = searchParams.get('id');

    if (!planId) {
      return NextResponse.json(
        { success: false, error: 'Plan ID is required' },
        { status: 400 }
      );
    }

    // Get plan metadata
    const { data: plan, error: fetchError } = await supabase
      .from('training_plans')
      .select('*')
      .eq('id', planId)
      .single();

    if (fetchError || !plan) {
      return NextResponse.json(
        { success: false, error: 'Training plan not found' },
        { status: 404 }
      );
    }

    // Delete from storage
    const { error: storageError } = await supabase.storage
      .from('workout-files')
      .remove([plan.storage_path]);

    if (storageError) {
      console.error('Storage deletion error:', storageError);
    }

    // Delete from database
    const { error: deleteError } = await supabase
      .from('training_plans')
      .delete()
      .eq('id', planId);

    if (deleteError) {
      return NextResponse.json(
        { success: false, error: `Failed to delete plan: ${deleteError.message}` },
        { status: 500 }
      );
    }

    return NextResponse.json({
      success: true,
      message: 'Training plan deleted successfully'
    });

  } catch (error) {
    console.error('Delete training plan error:', error);
    return NextResponse.json(
      { success: false, error: 'Failed to delete training plan' },
      { status: 500 }
    );
  }
}
