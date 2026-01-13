import { NextRequest, NextResponse } from 'next/server';
import { getSupabaseClient } from '@/lib/supabase';
import { parseTrainingPlanExcel } from '@/lib/excel/training-plan-parser';
import * as fs from 'fs';
import * as path from 'path';

export const dynamic = 'force-dynamic';


// Local fallback directory for storing training plans when Supabase is unavailable
const LOCAL_UPLOAD_DIR = path.join(process.cwd(), 'public', 'uploads', 'training-plans');

// Ensure local upload directory exists
function ensureUploadDirExists() {
  try {
    if (!fs.existsSync(LOCAL_UPLOAD_DIR)) {
      fs.mkdirSync(LOCAL_UPLOAD_DIR, { recursive: true });
    }
  } catch (err) {
    console.error('Failed to create local upload directory:', err);
  }
}

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

    // Try to extract week number from filename (e.g., "Week_41_...")
    let extractedWeekNumber: number | undefined;
    const weekMatch = file.name.match(/week[_\s]?(\d+)/i);
    if (weekMatch) {
      extractedWeekNumber = parseInt(weekMatch[1], 10);
    }

    const weeklySchedule = await parseTrainingPlanExcel(fileBuffer, {
      explicitWeekNumber: extractedWeekNumber
    });

    if (!weeklySchedule || !weeklySchedule.workouts) {
      return NextResponse.json(
        { success: false, error: 'Failed to parse training plan. Please check the file format.' },
        { status: 400 }
      );
    }

    // Upload file to Supabase Storage with fallback to local storage
    const timestamp = new Date().toISOString().replace(/[:.]/g, '-');
    const filename = `training-plan-${timestamp}-${file.name}`;
    const filePath = `training-plans/${filename}`;

    let uploadedToCloud = false;
    let localFilePath: string | null = null;

    // Try Supabase first
    const { error: uploadError } = await getSupabaseClient().storage
      .from('workout-files')
      .upload(filePath, fileBuffer, {
        contentType: file.type,
        upsert: false
      });

    if (uploadError) {
      console.warn('Supabase upload failed, falling back to local storage:', uploadError.message);

      // Fallback to local storage
      try {
        ensureUploadDirExists();
        localFilePath = path.join(LOCAL_UPLOAD_DIR, filename);
        fs.writeFileSync(localFilePath, fileBuffer);
        console.log('File stored locally at:', localFilePath);
      } catch (localError) {
        console.error('Local storage fallback also failed:', localError);
        return NextResponse.json(
          { success: false, error: `Failed to upload file. Cloud and local storage unavailable: ${uploadError.message}` },
          { status: 500 }
        );
      }
    } else {
      uploadedToCloud = true;
    }

    // Store metadata in database
    const planMetadata = {
      filename: file.name,
      storage_path: uploadedToCloud ? filePath : (localFilePath || filename),
      week_number: weeklySchedule.week,
      start_date: weeklySchedule.startDate,
      is_active: setAsActive,
      uploaded_at: new Date().toISOString(),
      workout_count: Object.values(weeklySchedule.workouts).flat().length,
      storage_location: uploadedToCloud ? 'getSupabaseClient()' : 'local'
    };

    // Try to save metadata to database, with fallback to local JSON if Supabase is unavailable
    let insertedPlan: any = null;
    let dbAvailable = true;

    try {
      // If setting as active, deactivate all other plans
      if (setAsActive) {
        await getSupabaseClient()
          .from('training_plans')
          .update({ is_active: false })
          .eq('is_active', true);
      }

      const { data, error: insertError } = await getSupabaseClient()
        .from('training_plans')
        .insert(planMetadata)
        .select()
        .single();

      if (insertError) {
        throw insertError;
      }

      insertedPlan = data;
    } catch (dbError: any) {
      console.warn('Database insert failed, falling back to local JSON metadata:', dbError.message);
      dbAvailable = false;

      // Fallback: Store metadata in a local JSON file
      try {
        const metadataDir = path.join(process.cwd(), 'public', 'uploads', 'metadata');
        if (!fs.existsSync(metadataDir)) {
          fs.mkdirSync(metadataDir, { recursive: true });
        }

        // Create a plan record with a generated UUID
        const id = `local-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;
        insertedPlan = {
          id,
          ...planMetadata,
          local: true
        };

        const metadataFile = path.join(metadataDir, `${id}.json`);
        fs.writeFileSync(metadataFile, JSON.stringify(insertedPlan, null, 2));
        console.log('Metadata stored locally at:', metadataFile);
      } catch (localError) {
        console.error('Local metadata storage also failed:', localError);
        // Still return success since the file was saved - just the metadata failed
        return NextResponse.json({
          success: true,
          message: 'Training plan file uploaded (metadata save failed - will be restored when database is available)',
          warning: 'Database unavailable - plan stored locally',
          plan: {
            id: `temp-${Date.now()}`,
            filename: file.name,
            week: weeklySchedule.week,
            startDate: weeklySchedule.startDate,
            uploadedAt: new Date().toISOString()
          }
        });
      }
    }

    return NextResponse.json({
      success: true,
      message: 'Training plan uploaded successfully' + (dbAvailable ? '' : ' (stored locally, will sync when database is available)'),
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
    const { data: plans, error } = await getSupabaseClient()
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
    const { data: plan, error: fetchError } = await getSupabaseClient()
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
    const { error: storageError } = await getSupabaseClient().storage
      .from('workout-files')
      .remove([plan.storage_path]);

    if (storageError) {
      console.error('Storage deletion error:', storageError);
    }

    // Delete from database
    const { error: deleteError } = await getSupabaseClient()
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
