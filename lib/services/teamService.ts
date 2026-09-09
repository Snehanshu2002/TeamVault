import { Team, Profile, PublicProfile, UserRole } from '@/lib/types';
import { mockSupabase } from '@/lib/supabase/mockSupabase';
import { PrivacyService } from './privacyService';
import { RBAC } from '@/lib/permissions/rbac';

export class TeamService {
  /**
   * Get teams scoped by role and organization:
   * - PLATFORM_SUPER_ADMIN: all teams
   * - ORGANIZATION_ADMIN: teams in their organization
   * - USER: teams in their organization that they are assigned to
   */
  public static getTeamsForUser(user: Profile | null): Team[] {
    if (!user) return [];
    const all = mockSupabase.getTeams();

    if (user.role === 'PLATFORM_SUPER_ADMIN') {
      return all;
    }

    if (user.role === 'ORGANIZATION_ADMIN') {
      return all.filter((t) => t.organization_id === user.organization_id);
    }

    // USER role
    return all.filter(
      (t) =>
        t.organization_id === user.organization_id &&
        t.status === 'active' &&
        t.memberIds &&
        t.memberIds.includes(user.id)
    );
  }

  /**
   * Get members of a specific team with strict privacy stripping for regular users
   */
  public static getTeamMembers(teamId: string, viewerRole: UserRole): (Profile | PublicProfile)[] {
    const team = mockSupabase.getTeams().find((t) => t.id === teamId);
    if (!team || !team.memberIds) return [];

    const allProfiles = mockSupabase.getProfiles();
    const members = allProfiles.filter((p) => team.memberIds!.includes(p.id));

    return PrivacyService.getVisibleProfiles(members, viewerRole);
  }

  public static createTeam(name: string, description: string, actor: Profile, initialMemberIds: string[] = []): Team {
    const newTeam: Team = {
      id: `t-${Date.now()}`,
      organization_id: actor.organization_id,
      name: name.trim(),
      description: description.trim(),
      status: 'active',
      created_by: actor.id,
      adminName: actor.display_name,
      memberIds: initialMemberIds,
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString(),
    };

    mockSupabase.saveTeam(newTeam);

    mockSupabase.addAuditLog({
      organization_id: actor.organization_id,
      actor_id: actor.id,
      actor_name: actor.display_name,
      actor_role: actor.role,
      action: 'CREATE_TEAM',
      target_type: 'team',
      target_id: newTeam.id,
      target_name: newTeam.name,
      details: { memberCount: initialMemberIds.length },
    });

    return newTeam;
  }

  public static addMemberToTeam(teamId: string, userId: string, actor: Profile): void {
    const team = mockSupabase.getTeams().find((t) => t.id === teamId);
    const target = mockSupabase.getProfileById(userId);
    if (!team || !target) throw new Error('Team or User not found');

    const memberIds = team.memberIds || [];
    if (!memberIds.includes(userId)) {
      team.memberIds = [...memberIds, userId];
      team.updated_at = new Date().toISOString();
      mockSupabase.saveTeam(team);

      mockSupabase.addAuditLog({
        organization_id: team.organization_id,
        actor_id: actor.id,
        actor_name: actor.display_name,
        actor_role: actor.role,
        action: 'ADD_TEAM_MEMBER',
        target_type: 'user',
        target_id: target.id,
        target_name: `${target.display_name} (@${target.username})`,
        details: { teamName: team.name },
      });
    }
  }

  public static removeMemberFromTeam(teamId: string, userId: string, actor: Profile): void {
    const team = mockSupabase.getTeams().find((t) => t.id === teamId);
    const target = mockSupabase.getProfileById(userId);
    if (!team || !target) throw new Error('Team or User not found');

    if (team.memberIds) {
      team.memberIds = team.memberIds.filter((id) => id !== userId);
      team.updated_at = new Date().toISOString();
      mockSupabase.saveTeam(team);

      mockSupabase.addAuditLog({
        organization_id: team.organization_id,
        actor_id: actor.id,
        actor_name: actor.display_name,
        actor_role: actor.role,
        action: 'REMOVE_TEAM_MEMBER',
        target_type: 'user',
        target_id: target.id,
        target_name: `${target.display_name} (@${target.username})`,
        details: { teamName: team.name },
      });
    }
  }

  public static deleteTeam(teamId: string, actor: Profile): void {
    const team = mockSupabase.getTeams().find((t) => t.id === teamId);
    if (!team) return;

    mockSupabase.deleteTeam(teamId);

    mockSupabase.addAuditLog({
      organization_id: team.organization_id,
      actor_id: actor.id,
      actor_name: actor.display_name,
      actor_role: actor.role,
      action: 'DELETE_TEAM',
      target_type: 'team',
      target_id: team.id,
      target_name: team.name,
      details: { deletedAt: new Date().toISOString() },
    });
  }
}
