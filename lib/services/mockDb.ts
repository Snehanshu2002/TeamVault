import { Profile, Team, Conversation, Message, AuditLog, DemoPersona } from '@/lib/types';
import { mockSupabase, DEMO_PERSONAS } from '@/lib/supabase/mockSupabase';

export { DEMO_PERSONAS };

/**
 * Adapter providing backwards compatibility for legacy mockDb calls,
 * powered by the multi-tenant mockSupabase engine.
 */
class MockDbAdapter {
  getUsers(): Profile[] {
    return mockSupabase.getProfiles();
  }

  getUserById(id: string): Profile | null {
    return mockSupabase.getProfileById(id) || null;
  }

  saveUser(profile: Profile): void {
    mockSupabase.saveProfile(profile);
  }

  getTeams(): Team[] {
    return mockSupabase.getTeams();
  }

  getTeamById(id: string): Team | null {
    return mockSupabase.getTeamById(id) || null;
  }

  saveTeam(team: Team): void {
    mockSupabase.saveTeam(team);
  }

  deleteTeam(id: string): void {
    mockSupabase.deleteTeam(id);
  }

  getConversations(): Conversation[] {
    return mockSupabase.getConversations();
  }

  getConversationById(id: string): Conversation | null {
    return mockSupabase.getConversationById(id) || null;
  }

  getMessages(conversationId: string): Message[] {
    return mockSupabase.getMessages(conversationId);
  }

  sendMessage(conversationId: string, senderId: string, message: string): Message {
    return mockSupabase.sendMessage(conversationId, senderId, message);
  }

  getAuditLogs(): AuditLog[] {
    return mockSupabase.getAuditLogs();
  }

  addAuditLog(log: any): void {
    mockSupabase.addAuditLog(log);
  }

  resetToDefaults(): void {
    mockSupabase.resetToDefaults();
  }
}

export const mockDb = new MockDbAdapter();
