import { Profile, Team, Conversation, UserRole } from '@/lib/types';
import { mockSupabase } from '@/lib/supabase/mockSupabase';

export class RBAC {
  public static isPlatformAdmin(user: Profile | null): boolean {
    if (!user) return false;
    return user.role === 'PLATFORM_SUPER_ADMIN' && user.status === 'active';
  }

  public static isOrgAdmin(user: Profile | null, organizationId: string): boolean {
    if (!user) return false;
    if (this.isPlatformAdmin(user)) return true;
    return (
      user.role === 'ORGANIZATION_ADMIN' &&
      user.organization_id === organizationId &&
      user.status === 'active'
    );
  }

  public static isOrgMember(user: Profile | null, organizationId: string): boolean {
    if (!user) return false;
    if (this.isPlatformAdmin(user)) return true;
    return user.organization_id === organizationId && user.status === 'active';
  }

  public static isTeamMember(user: Profile | null, teamId: string): boolean {
    if (!user) return false;
    if (this.isPlatformAdmin(user)) return true;

    const team = mockSupabase.getTeams().find((t) => t.id === teamId);
    if (!team) return false;

    // Org admin of the team's organization
    if (this.isOrgAdmin(user, team.organization_id)) return true;

    return Boolean(team.memberIds && team.memberIds.includes(user.id));
  }

  public static isConversationParticipant(user: Profile | null, conversation: Conversation): boolean {
    if (!user) return false;
    return conversation.participantIds.includes(user.id);
  }

  /**
   * Check if a user is authorized to view a conversation:
   * 1. Direct participant
   * 2. Authorized Organization Admin of the team's organization
   * 3. Platform Super Admin
   */
  public static canAccessConversation(user: Profile | null, conversation: Conversation): boolean {
    if (!user) return false;
    if (this.isPlatformAdmin(user)) return true;
    if (this.isConversationParticipant(user, conversation)) return true;
    return this.isOrgAdmin(user, conversation.organization_id);
  }

  /**
   * Check if two users are eligible to start a private 1-to-1 conversation:
   * 1. Both must belong to the same active organization
   * 2. Both must belong to at least one common authorized active team
   */
  public static canInitiateDirectChat(
    user1: Profile | null,
    user2: Profile | null
  ): { allowed: boolean; reason?: string; sharedTeamId?: string } {
    if (!user1 || !user2) {
      return { allowed: false, reason: 'Both users must be valid profiles.' };
    }
    if (user1.status !== 'active' || user2.status !== 'active') {
      return { allowed: false, reason: 'Both users must be in active status.' };
    }
    if (user1.organization_id !== user2.organization_id) {
      return { allowed: false, reason: 'Cross-organization messaging is strictly prohibited.' };
    }

    const teams = mockSupabase.getTeams().filter((t) => t.organization_id === user1.organization_id && t.status === 'active');
    const sharedTeam = teams.find(
      (t) => t.memberIds && t.memberIds.includes(user1.id) && t.memberIds.includes(user2.id)
    );

    if (!sharedTeam) {
      return {
        allowed: false,
        reason: 'Users do not share any authorized team. Private chat is prohibited.',
      };
    }

    return { allowed: true, sharedTeamId: sharedTeam.id };
  }
}
