import { NextResponse } from 'next/server';
import { serverDb } from '@/lib/database/serverDb';
import { Team } from '@/lib/types';

export async function GET() {
  try {
    const teams = serverDb.getTeams();
    return NextResponse.json({ success: true, data: teams });
  } catch (error: any) {
    return NextResponse.json(
      { success: false, error: error.message || 'Failed to fetch teams' },
      { status: 500 }
    );
  }
}

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const { name, description, organization_id, member_ids, created_by, admin_name } = body;

    if (!name) {
      return NextResponse.json(
        { success: false, error: 'Team name is required' },
        { status: 400 }
      );
    }

    const newTeam: Team = {
      id: 't-' + Date.now() + '-' + Math.random().toString(36).substring(2, 6),
      organization_id: organization_id || 'a0000000-0000-0000-0000-000000000001',
      name: name.trim(),
      description: (description || '').trim(),
      status: 'active',
      created_by: created_by || 'u0000000-0000-0000-0000-000000000001',
      adminName: admin_name || 'Admin',
      memberIds: Array.isArray(member_ids) ? member_ids : [],
      memberCount: Array.isArray(member_ids) ? member_ids.length : 0,
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString(),
    };

    serverDb.saveTeam(newTeam);

    serverDb.addAuditLog({
      organization_id: newTeam.organization_id,
      actor_id: created_by || 'system',
      actor_name: admin_name || 'Admin',
      actor_role: 'ORGANIZATION_ADMIN',
      action: 'CREATE_TEAM',
      target_type: 'team',
      target_id: newTeam.id,
      target_name: newTeam.name,
      details: {
        memberCount: newTeam.memberIds?.length || 0,
      },
    });

    return NextResponse.json(
      { success: true, data: newTeam, message: 'Team created successfully in database' },
      { status: 201 }
    );
  } catch (error: any) {
    return NextResponse.json(
      { success: false, error: error.message || 'Failed to create team' },
      { status: 500 }
    );
  }
}
