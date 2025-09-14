import { NextRequest, NextResponse } from 'next/server';
import { protectionPresets, ProtectedRequest } from '@/lib/api-protection';
import { MultiUserDatabase } from '@/lib/multi-user/database';
import { TrainingProgram } from '@/lib/multi-user/types';

export const GET = protectionPresets.apiEndpoint(async (request: ProtectedRequest) => {
  try {
    const { searchParams } = new URL(request.url);
    const userId = request.user.id;
    const userRole = request.user.role;
    const action = searchParams.get('action');
    const programId = searchParams.get('programId');

    switch (action) {
      case 'my_programs':
        const myPrograms = await MultiUserDatabase.getTrainingPrograms({ 
          created_by: userId 
        });
        return NextResponse.json({ programs: myPrograms });

      case 'public_templates':
        const publicPrograms = await MultiUserDatabase.getTrainingPrograms({ 
          is_public: true,
          is_template: true
        });
        return NextResponse.json({ programs: publicPrograms });

      case 'assigned_programs':
        if (userRole === 'trainer') {
          // Get programs assigned by this trainer
          const assignments = await MultiUserDatabase.getClientProgramAssignments({ 
            assigned_by: userId 
          });
          return NextResponse.json({ assignments });
        } else {
          // Get programs assigned to this client
          const assignments = await MultiUserDatabase.getClientProgramAssignments({ 
            client_id: userId 
          });
          return NextResponse.json({ assignments });
        }

      case 'program_details':
        if (!programId) {
          return NextResponse.json({ error: 'programId is required' }, { status: 400 });
        }
        
        const program = await MultiUserDatabase.getTrainingPrograms({ id: programId });
        if (!program.length) {
          return NextResponse.json({ error: 'Program not found' }, { status: 404 });
        }
        
        // Check access permissions
        const programData = program[0];
        const hasAccess = programData.is_public || 
                         programData.created_by === userId ||
                         userRole === 'admin';
        
        if (!hasAccess) {
          return NextResponse.json({ error: 'Access denied' }, { status: 403 });
        }
        
        return NextResponse.json({ program: programData });

      case 'summit_specific':
        const targetSummit = searchParams.get('summit');
        if (!targetSummit) {
          return NextResponse.json({ error: 'summit parameter is required' }, { status: 400 });
        }
        
        const summitPrograms = await MultiUserDatabase.getTrainingPrograms({
          target_summit: targetSummit,
          is_public: true
        });
        
        return NextResponse.json({ programs: summitPrograms });

      case 'recommended':
        // Get recommended programs based on user profile
        const userProfile = await MultiUserDatabase.getUserProfile(userId);
        if (!userProfile) {
          return NextResponse.json({ error: 'User profile not found' }, { status: 404 });
        }
        
        const filters: any = {
          is_public: true,
          difficulty_level: userProfile.experience_level
        };
        
        if (userProfile.target_summit) {
          filters.target_summit = userProfile.target_summit;
        }
        
        const recommendedPrograms = await MultiUserDatabase.getTrainingPrograms(filters);
        
        return NextResponse.json({ programs: recommendedPrograms });

      default:
        return NextResponse.json({ 
          error: 'Invalid action. Use: my_programs, public_templates, assigned_programs, program_details, summit_specific, or recommended' 
        }, { status: 400 });
    }

  } catch (error: any) {
    console.error('Programs GET error:', error);
    return NextResponse.json({ 
      error: error.message || 'Failed to fetch programs' 
    }, { status: 500 });
  }
});

export const POST = protectionPresets.apiEndpoint(async (request: ProtectedRequest) => {
  try {
    const body = await request.json();
    const userId = request.user.id;
    const userRole = request.user.role;
    const { action } = body;

    switch (action) {
      case 'create_program':
        const programData: Partial<TrainingProgram> = {
          created_by: userId,
          ...body.program_data,
          is_public: body.program_data.is_public || false,
          is_template: body.program_data.is_template || false,
          currency: body.program_data.currency || 'USD'
        };
        
        const createdProgram = await MultiUserDatabase.createTrainingProgram(programData);
        
        return NextResponse.json({
          success: true,
          program: createdProgram,
          message: 'Training program created successfully'
        });

      case 'clone_template':
        const { template_id, customizations } = body;
        
        const template = await MultiUserDatabase.getTrainingPrograms({ id: template_id });
        if (!template.length || !template[0].is_template) {
          return NextResponse.json({ error: 'Template not found' }, { status: 404 });
        }
        
        const templateData = template[0];
        const clonedProgram = await MultiUserDatabase.createTrainingProgram({
          ...templateData,
          id: undefined, // Generate new ID
          created_by: userId,
          name: customizations.name || `${templateData.name} (Copy)`,
          description: customizations.description || templateData.description,
          is_public: false,
          is_template: false,
          ...customizations
        });
        
        return NextResponse.json({
          success: true,
          program: clonedProgram,
          message: 'Program cloned from template successfully'
        });

      case 'update_program':
        const { program_id, updates } = body;
        
        // Verify ownership or admin access
        const existingProgram = await MultiUserDatabase.getTrainingPrograms({ id: program_id });
        if (!existingProgram.length) {
          return NextResponse.json({ error: 'Program not found' }, { status: 404 });
        }
        
        const canEdit = existingProgram[0].created_by === userId || userRole === 'admin';
        if (!canEdit) {
          return NextResponse.json({ error: 'Access denied' }, { status: 403 });
        }
        
        const updatedProgram = await MultiUserDatabase.updateTrainingProgram(program_id, updates);
        
        return NextResponse.json({
          success: true,
          program: updatedProgram
        });

      case 'assign_to_client':
        if (userRole !== 'trainer' && userRole !== 'admin') {
          return NextResponse.json({ error: 'Only trainers can assign programs' }, { status: 403 });
        }
        
        const { client_id, program_id: assignProgramId, start_date, target_end_date, custom_modifications } = body;
        
        // Verify trainer-client relationship
        const relationships = await MultiUserDatabase.getTrainerClients(userId);
        const hasRelationship = relationships.some(rel => 
          rel.client_id === client_id && rel.status === 'active'
        );
        
        if (!hasRelationship && userRole !== 'admin') {
          return NextResponse.json({ 
            error: 'No active relationship with this client' 
          }, { status: 403 });
        }
        
        const assignment = await MultiUserDatabase.assignProgramToClient({
          client_id,
          program_id: assignProgramId,
          assigned_by: userId,
          status: 'assigned',
          start_date: start_date || new Date().toISOString().split('T')[0],
          target_end_date,
          current_week: 1,
          completion_percentage: 0,
          custom_modifications
        });
        
        return NextResponse.json({
          success: true,
          assignment,
          message: 'Program assigned to client successfully'
        });

      case 'update_assignment':
        const { assignment_id, assignment_updates } = body;
        
        // Verify access to assignment
        const existingAssignment = await MultiUserDatabase.getClientProgramAssignments({ id: assignment_id });
        if (!existingAssignment.length) {
          return NextResponse.json({ error: 'Assignment not found' }, { status: 404 });
        }
        
        const assignmentData = existingAssignment[0];
        const canUpdate = assignmentData.assigned_by === userId || 
                         assignmentData.client_id === userId || 
                         userRole === 'admin';
        
        if (!canUpdate) {
          return NextResponse.json({ error: 'Access denied' }, { status: 403 });
        }
        
        const updatedAssignment = await MultiUserDatabase.updateProgramAssignment(
          assignment_id, 
          assignment_updates
        );
        
        return NextResponse.json({
          success: true,
          assignment: updatedAssignment
        });

      case 'publish_template':
        const { program_id: publishProgramId } = body;
        
        const programToPublish = await MultiUserDatabase.getTrainingPrograms({ 
          id: publishProgramId,
          created_by: userId 
        });
        
        if (!programToPublish.length) {
          return NextResponse.json({ error: 'Program not found' }, { status: 404 });
        }
        
        const publishedProgram = await MultiUserDatabase.updateTrainingProgram(publishProgramId, {
          is_public: true,
          is_template: true
        });
        
        return NextResponse.json({
          success: true,
          program: publishedProgram,
          message: 'Program published as public template'
        });

      default:
        return NextResponse.json({ error: 'Invalid action' }, { status: 400 });
    }

  } catch (error: any) {
    console.error('Programs POST error:', error);
    return NextResponse.json({ 
      error: error.message || 'Failed to process program request' 
    }, { status: 500 });
  }
});