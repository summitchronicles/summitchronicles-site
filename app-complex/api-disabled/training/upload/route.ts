import { NextRequest, NextResponse } from 'next/server';
import { protectionPresets, ProtectedRequest } from '@/lib/api-protection';
import TrainingExcelParser from '@/lib/training/excel-parser';
import TrainingDatabase from '@/lib/training/database';

export const POST = protectionPresets.adminEndpoint(
  async (request: ProtectedRequest) => {
    try {
      const formData = await request.formData();
      const file = formData.get('file') as File;
      const startDate = formData.get('startDate') as string;

      if (!file) {
        return NextResponse.json(
          { error: 'No file provided' },
          { status: 400 }
        );
      }

      if (!file.name.endsWith('.xlsx')) {
        return NextResponse.json(
          { error: 'Only .xlsx files are supported' },
          { status: 400 }
        );
      }

      // Parse the Excel file
      const parsedPlan = await TrainingExcelParser.parseExcelFile(file);

      if (!parsedPlan.title) {
        return NextResponse.json(
          { error: 'Could not parse training plan title' },
          { status: 400 }
        );
      }

      // Save to database
      const planId = await TrainingDatabase.saveTrainingPlan(
        parsedPlan,
        file.name,
        startDate
      );

      return NextResponse.json({
        success: true,
        planId,
        title: parsedPlan.title,
        weekNumber: parsedPlan.weekNumber,
        strengthDays: parsedPlan.strengthDays.length,
        cardioDays: parsedPlan.cardioDays.length,
        guidelines: parsedPlan.guidelines.length,
      });
    } catch (error: any) {
      console.error('Training plan upload error:', error);
      return NextResponse.json(
        {
          error: error.message || 'Failed to upload training plan',
        },
        { status: 500 }
      );
    }
  }
);
