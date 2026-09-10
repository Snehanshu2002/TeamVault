import { Conversation, Message, Profile, UserRole } from '@/lib/types';
import { mockSupabase } from '@/lib/supabase/mockSupabase';
import { RBAC } from '@/lib/permissions/rbac';

export class ChatService {
  /**
   * Get or create a 1-to-1 direct private conversation.
   * Strictly enforces team membership and organization boundaries.
   */
  public static getOrCreatePrivateConversation(
    orgId: string,
    teamId: string,
    user1Id: string,
    user2Id: string
  ): Conversation {
    const user1 = mockSupabase.getProfileById(user1Id);
    const user2 = mockSupabase.getProfileById(user2Id);

    const check = RBAC.canInitiateDirectChat(user1 || null, user2 || null);
    if (!check.allowed && !teamId) {
      throw new Error(check.reason || 'Cannot initiate private conversation.');
    }

    const effectiveTeamId = teamId || check.sharedTeamId!;
    const effectiveOrgId = orgId || user1?.organization_id || 'a0000000-0000-0000-0000-000000000001';

    return mockSupabase.findOrCreateConversation(effectiveOrgId, effectiveTeamId, user1Id, user2Id);
  }

  /**
   * Get or create a Team Group Conversation where all assigned team members participate together.
   */
  public static getOrCreateTeamGroupConversation(
    orgId: string,
    teamId: string
  ): Conversation {
    const team = mockSupabase.getTeamById(teamId);
    if (!team) throw new Error('Team not found');

    const deterministicId = `group_${teamId.replace(/[^a-zA-Z0-9]/g, '')}`;
    const convs = mockSupabase.getConversations();
    const existing = convs.find(
      (c) => c.id === deterministicId || (c.team_id === teamId && c.conversation_type === 'GROUP')
    );

    const memberIds = team.memberIds || [];
    if (existing) {
      existing.participantIds = memberIds;
      existing.team_name = team.name;
      mockSupabase.saveConversation(existing);
      return existing;
    }

    const newGroupConv: Conversation = {
      id: deterministicId,
      organization_id: orgId || team.organization_id,
      team_id: teamId,
      team_name: `${team.name} (Team Group)`,
      conversation_type: 'GROUP',
      participantIds: memberIds,
      last_message: 'Team group initialized. All team members can chat together.',
      last_message_at: new Date().toISOString(),
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString(),
    };

    mockSupabase.saveConversation(newGroupConv);
    return newGroupConv;
  }

  /**
   * Get conversations visible to user based on role and organization:
   * - PLATFORM_SUPER_ADMIN: all conversations across all organizations
   * - ORGANIZATION_ADMIN: all team conversations in their organization
   * - USER: conversations they participate in (both 1-on-1 and Team Groups)
   */
  public static getConversationsForUser(user: Profile | null): Conversation[] {
    if (!user) return [];

    // Ensure team group conversations are initialized for all user's teams
    const userTeams = mockSupabase.getTeams().filter(
      (t) =>
        t.organization_id === user.organization_id &&
        t.status === 'active' &&
        (user.role !== 'USER' || (t.memberIds && t.memberIds.includes(user.id)))
    );
    userTeams.forEach((t) => {
      ChatService.getOrCreateTeamGroupConversation(t.organization_id, t.id);
    });

    const all = mockSupabase.getConversations();

    if (user.role === 'PLATFORM_SUPER_ADMIN') {
      return all;
    }

    if (user.role === 'ORGANIZATION_ADMIN') {
      return all.filter((c) => c.organization_id === user.organization_id);
    }

    // USER role
    return all.filter(
      (c) => c.organization_id === user.organization_id && c.participantIds.includes(user.id)
    );
  }

  public static getMessages(conversationId: string): Message[] {
    return mockSupabase.getMessages(conversationId);
  }

  public static sendMessage(conversationId: string, senderId: string, text: string): Message {
    if (!text || !text.trim()) {
      throw new Error('Message cannot be empty');
    }
    return mockSupabase.sendMessage(conversationId, senderId, text.trim());
  }

  public static markAsRead(conversationId: string, userId: string): void {
    mockSupabase.markMessagesRead(conversationId, userId);
  }

  public static getUnreadCount(conversationId: string, userId: string): number {
    const messages = mockSupabase.getMessages(conversationId);
    return messages.filter((m) => m.sender_id !== userId && !m.read_by.includes(userId)).length;
  }

  public static getParticipantSummary(
    conversation: Conversation,
    currentUserId?: string
  ): { title: string; usernames: string[]; participantProfiles: Profile[] } {
    const all = mockSupabase.getProfiles();
    const participants = all.filter((p) => conversation.participantIds.includes(p.id));
    const usernames = participants.map((p) => `@${p.username}`);

    if (conversation.conversation_type === 'GROUP') {
      return {
        title: conversation.team_name || 'Team Group Chat',
        usernames,
        participantProfiles: participants,
      };
    }

    if (currentUserId) {
      const other = participants.find((p) => p.id !== currentUserId);
      if (other) {
        return {
          title: other.display_name,
          usernames,
          participantProfiles: participants,
        };
      }
    }

    return {
      title: participants.map((p) => p.display_name).join(' ↔ '),
      usernames,
      participantProfiles: participants,
    };
  }

  /**
   * Log an admin conversation inspection event
   */
  public static logAdminConversationView(conversation: Conversation, admin: Profile): void {
    mockSupabase.addAuditLog({
      organization_id: conversation.organization_id,
      actor_id: admin.id,
      actor_name: admin.display_name,
      actor_role: admin.role,
      action: 'VIEW_CONVERSATION',
      target_type: 'conversation',
      target_id: conversation.id,
      target_name: `${conversation.team_name || 'Team'} Chat`,
      details: { participantIds: conversation.participantIds },
    });
  }
}
