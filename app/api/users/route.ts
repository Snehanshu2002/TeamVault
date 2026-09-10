import { NextResponse } from 'next/server';
import { serverDb } from '@/lib/database/serverDb';
import { Profile } from '@/lib/types';

export async function GET() {
  try {
    const profiles = serverDb.getProfiles();
    return NextResponse.json({ success: true, data: profiles });
  } catch (error: any) {
    return NextResponse.json(
      { success: false, error: error.message || 'Failed to fetch users' },
      { status: 500 }
    );
  }
}

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const { full_name, username, email, role, team_ids, organization_id, created_by } = body;

    const displayName = full_name || body.display_name;
    const userHandle = username || (displayName ? displayName.toLowerCase().replace(/[^a-z0-9_]/g, '') : '');

    if (!displayName || !email || !role) {
      return NextResponse.json(
        { success: false, error: 'Display name, email, and role are required' },
        { status: 400 }
      );
    }

    const existing = serverDb.getProfiles().find(
      (p) => p.email.toLowerCase() === email.toLowerCase() || (userHandle && p.username.toLowerCase() === userHandle.toLowerCase())
    );
    if (existing) {
      return NextResponse.json(
        { success: false, error: 'A user with this email or username already exists' },
        { status: 409 }
      );
    }

    const newProfile: Profile = {
      id: 'u-' + Date.now() + '-' + Math.random().toString(36).substring(2, 6),
      organization_id: organization_id || 'a0000000-0000-0000-0000-000000000001',
      username: userHandle || ('user_' + Date.now()),
      display_name: displayName,
      email: email.toLowerCase(),
      avatar_url: 'https://api.dicebear.com/7.x/avataaars/svg?seed=' + encodeURIComponent(displayName),
      role: role || 'USER',
      status: 'active',
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString(),
      isOnline: true,
    };

    serverDb.saveProfile(newProfile);

    // If teams are assigned, update team member lists
    if (Array.isArray(team_ids) && team_ids.length > 0) {
      team_ids.forEach((tId: string) => {
        const team = serverDb.getTeamById(tId);
        if (team) {
          const members = team.memberIds || [];
          if (!members.includes(newProfile.id)) {
            team.memberIds = [...members, newProfile.id];
            team.updated_at = new Date().toISOString();
            serverDb.saveTeam(team);
          }
        }
      });
    }

    serverDb.addAuditLog({
      organization_id: newProfile.organization_id,
      actor_id: created_by || 'system',
      actor_name: 'Administrator',
      actor_role: 'ORGANIZATION_ADMIN',
      action: 'CREATE_USER',
      target_type: 'user',
      target_id: newProfile.id,
      target_name: newProfile.display_name + ' (@' + newProfile.username + ')',
      details: {
        role: newProfile.role,
        assignedTeams: team_ids || [],
        email: newProfile.email,
      },
    });

    return NextResponse.json(
      { success: true, data: newProfile, message: 'User created and persisted in database' },
      { status: 201 }
    );
  } catch (error: any) {
    return NextResponse.json(
      { success: false, error: error.message || 'Failed to create user' },
      { status: 500 }
    );
  }
}
