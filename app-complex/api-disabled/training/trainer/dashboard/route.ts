import { NextRequest, NextResponse } from 'next/server';
import { protectionPresets, ProtectedRequest } from '@/lib/api-protection';
import { MultiUserDatabase } from '@/lib/multi-user/database';

export const GET = protectionPresets.adminEndpoint(
  async (request: ProtectedRequest) => {
    try {
      const { searchParams } = new URL(request.url);
      const trainerId = searchParams.get('trainerId');
      const action = searchParams.get('action');

      if (!trainerId) {
        return NextResponse.json(
          {
            error: 'trainerId is required',
          },
          { status: 400 }
        );
      }

      switch (action) {
        case 'stats':
          const stats =
            await MultiUserDatabase.getTrainerDashboardStats(trainerId);
          return NextResponse.json({ stats });

        case 'clients':
          const clients =
            await MultiUserDatabase.getClientProgressSummaries(trainerId);
          return NextResponse.json({ clients });

        case 'programs':
          const programs = await MultiUserDatabase.getTrainingPrograms({
            created_by: trainerId,
          });
          return NextResponse.json({ programs: programs.slice(0, 10) });

        case 'relationships':
          const relationships =
            await MultiUserDatabase.getTrainerClients(trainerId);
          return NextResponse.json({ relationships });

        case 'overview':
          // Combined overview data
          const [overviewStats, overviewClients, overviewPrograms] =
            await Promise.all([
              MultiUserDatabase.getTrainerDashboardStats(trainerId),
              MultiUserDatabase.getClientProgressSummaries(trainerId),
              MultiUserDatabase.getTrainingPrograms({ created_by: trainerId }),
            ]);

          return NextResponse.json({
            stats: overviewStats,
            clients: overviewClients.slice(0, 5),
            programs: overviewPrograms.slice(0, 5),
          });

        default:
          return NextResponse.json(
            {
              error:
                'Invalid action. Use: stats, clients, programs, relationships, or overview',
            },
            { status: 400 }
          );
      }
    } catch (error: any) {
      console.error('Trainer dashboard error:', error);
      return NextResponse.json(
        {
          error: error.message || 'Failed to fetch trainer dashboard data',
        },
        { status: 500 }
      );
    }
  }
);

export const POST = protectionPresets.adminEndpoint(
  async (request: ProtectedRequest) => {
    try {
      const body = await request.json();
      const { action, trainerId } = body;

      switch (action) {
        case 'create_client_relationship':
          const { client_email, access_level, monthly_fee } = body;

          // First, find or create client profile
          // This would typically involve sending an invitation email
          const relationship =
            await MultiUserDatabase.createTrainerClientRelationship({
              trainer_id: trainerId,
              client_id: body.client_id, // Would be resolved from email
              status: 'pending',
              start_date: new Date().toISOString().split('T')[0],
              access_level: access_level || 'view',
              can_create_plans: false,
              can_modify_plans: false,
              can_view_progress: true,
              can_send_messages: true,
              monthly_fee: monthly_fee,
              currency: 'USD',
              billing_status: 'active',
            });

          return NextResponse.json({
            success: true,
            relationship,
            message: 'Client relationship created successfully',
          });

        case 'update_client_access':
          const { relationship_id, updates } = body;

          const updatedRelationship =
            await MultiUserDatabase.updateRelationshipStatus(
              relationship_id,
              updates.status || 'active',
              updates
            );

          return NextResponse.json({
            success: true,
            relationship: updatedRelationship,
          });

        case 'assign_program':
          const {
            client_id,
            program_id,
            start_date,
            target_end_date,
            custom_modifications,
          } = body;

          const assignment = await MultiUserDatabase.assignProgramToClient({
            client_id,
            program_id,
            assigned_by: trainerId,
            status: 'assigned',
            start_date: start_date || new Date().toISOString().split('T')[0],
            target_end_date,
            current_week: 1,
            completion_percentage: 0,
            custom_modifications,
          });

          return NextResponse.json({
            success: true,
            assignment,
            message: 'Program assigned to client successfully',
          });

        case 'create_program':
          const { program_data } = body;

          const program = await MultiUserDatabase.createTrainingProgram({
            created_by: trainerId,
            ...program_data,
          });

          return NextResponse.json({
            success: true,
            program,
            message: 'Training program created successfully',
          });

        default:
          return NextResponse.json(
            {
              error: 'Invalid action',
            },
            { status: 400 }
          );
      }
    } catch (error: any) {
      console.error('Trainer dashboard POST error:', error);
      return NextResponse.json(
        {
          error: error.message || 'Failed to process trainer dashboard request',
        },
        { status: 500 }
      );
    }
  }
);
