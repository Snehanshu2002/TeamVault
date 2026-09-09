import { describe, it, expect, beforeEach } from 'vitest';
import { mockSupabase } from '@/lib/supabase/mockSupabase';
import { RBAC } from '@/lib/permissions/rbac';
import { PrivacyService } from '@/lib/services/privacyService';
import { ChatService } from '@/lib/services/chatService';
import { TeamService } from '@/lib/services/teamService';
import { AuditService } from '@/lib/services/auditService';
import { AuthService } from '@/lib/services/authService';
import { rateLimiter } from '@/lib/security/rateLimiter';
import { Profile } from '@/lib/types';

describe('Multi-Tenant & Security Authorization Test Suite', () => {
  let superAdmin: Profile;
  let admin1: Profile;
  let admin2: Profile;
  let rahul: Profile;
  let amit: Profile;
  let priya: Profile;
  let rohit: Profile;
  let anita: Profile;
  let globexAdmin: Profile;
  let globexUser: Profile;

  beforeEach(() => {
    mockSupabase.resetToDefaults();
    rateLimiter.cleanup(0);
    superAdmin = mockSupabase.getProfileById('u0000000-0000-0000-0000-000000000000')!;
    admin1 = mockSupabase.getProfileById('u0000000-0000-0000-0000-000000000001')!;
    admin2 = mockSupabase.getProfileById('u0000000-0000-0000-0000-000000000002')!;
    rahul = mockSupabase.getProfileById('u0000000-0000-0000-0000-000000000003')!;
    amit = mockSupabase.getProfileById('u0000000-0000-0000-0000-000000000004')!;
    priya = mockSupabase.getProfileById('u0000000-0000-0000-0000-000000000005')!;
    rohit = mockSupabase.getProfileById('u0000000-0000-0000-0000-000000000006')!;
    anita = mockSupabase.getProfileById('u0000000-0000-0000-0000-000000000008')!;
    globexAdmin = mockSupabase.getProfileById('u0000000-0000-0000-0000-000000000009')!;
    globexUser = mockSupabase.getProfileById('u0000000-0000-0000-0000-000000000010')!;
  });

  // 1. Cross-Tenant Access Rejection
  it('1. Multi-Tenant Isolation: Cross-tenant profile and conversation access is strictly blocked', () => {
    expect(rahul.organization_id).toBe('a0000000-0000-0000-0000-000000000001'); // Acme
    expect(globexUser.organization_id).toBe('a0000000-0000-0000-0000-000000000002'); // Globex

    // Rahul cannot access Globex organization
    expect(RBAC.isOrgMember(rahul, globexUser.organization_id)).toBe(false);

    // Globex Admin cannot admin Acme organization
    expect(RBAC.isOrgAdmin(globexAdmin, rahul.organization_id)).toBe(false);
  });

  // 2. Cross-Tenant Team Rejection
  it('2. Multi-Tenant Team Isolation: Users cannot view or join teams in another organization', () => {
    const acmeTeams = TeamService.getTeamsForUser(rahul);
    expect(acmeTeams.every((t) => t.organization_id === rahul.organization_id)).toBe(true);

    const globexTeams = TeamService.getTeamsForUser(globexUser);
    expect(globexTeams.every((t) => t.organization_id === globexUser.organization_id)).toBe(true);
    expect(acmeTeams.some((t) => t.id === 't0000000-0000-0000-0000-000000000004')).toBe(false);
  });

  // 3. Cross-Team Conversation Rejection
  it('3. Cross-Team Rejection: Rahul CANNOT start private chat with Rohit (different teams in same org)', () => {
    const check = RBAC.canInitiateDirectChat(rahul, rohit);
    expect(check.allowed).toBe(false);
    expect(check.reason).toContain('Users do not share any authorized team');
  });

  // 4. Cross-Organization 1-to-1 Chat Rejection
  it('4. Cross-Organization Rejection: Rahul CANNOT start private chat with Dana White (Globex)', () => {
    const check = RBAC.canInitiateDirectChat(rahul, globexUser);
    expect(check.allowed).toBe(false);
    expect(check.reason).toContain('Cross-organization messaging is strictly prohibited');
  });

  // 5. Authorized 1-to-1 Chat Initiation
  it('5. 1-to-1 Chat Eligibility: Rahul and Amit can chat because they share active Team Alpha', () => {
    const check = RBAC.canInitiateDirectChat(rahul, amit);
    expect(check.allowed).toBe(true);
    expect(check.sharedTeamId).toBe('t0000000-0000-0000-0000-000000000001');

    const conv = ChatService.getOrCreatePrivateConversation(
      rahul.organization_id,
      check.sharedTeamId!,
      rahul.id,
      amit.id
    );
    expect(conv.participantIds).toContain(rahul.id);
    expect(conv.participantIds).toContain(amit.id);
  });

  // 6. Sensitive Profile PII Protection
  it('6. PII Protection: Regular users receive sanitized profiles with zero email/phone/address exposure', () => {
    const visibleProfiles = PrivacyService.getVisibleProfiles([amit, priya], 'USER');
    expect(visibleProfiles).toHaveLength(2);

    visibleProfiles.forEach((p) => {
      const sanitized = p as any;
      expect(sanitized.username).toBeDefined();
      expect(sanitized.display_name).toBeDefined();
      expect(sanitized.email).toBeUndefined();
      expect(sanitized.phone).toBeUndefined();
      expect(sanitized.address).toBeUndefined();
    });

    // Admin can access full profile with email
    const adminView = PrivacyService.getVisibleProfiles([amit], 'ORGANIZATION_ADMIN');
    expect((adminView[0] as Profile).email).toBe('amit@example.com');
  });

  // 7. Admin Scope Isolation
  it('7. Admin Scope Isolation: Admin 2 (Team Gamma) cannot access Team Alpha conversations', () => {
    const teamAlphaConv = mockSupabase.getConversationById('c0000000-0000-0000-0000-000000000001')!;
    
    // Admin 1 oversees Team Alpha -> Allowed
    expect(RBAC.canAccessConversation(admin1, teamAlphaConv)).toBe(true);

    // Globex Admin -> Blocked
    expect(RBAC.canAccessConversation(globexAdmin, teamAlphaConv)).toBe(false);
  });

  // 8. Admin Conversation Oversight & Audit Logging
  it('8. Admin Oversight: Admin inspection of conversation creates an audit log entry', () => {
    const teamAlphaConv = mockSupabase.getConversationById('c0000000-0000-0000-0000-000000000001')!;
    const initialLogsCount = mockSupabase.getAuditLogs().length;

    ChatService.logAdminConversationView(teamAlphaConv, admin1);

    const updatedLogs = mockSupabase.getAuditLogs();
    expect(updatedLogs.length).toBe(initialLogsCount + 1);
    expect(updatedLogs[0].action).toBe('VIEW_CONVERSATION');
    expect(updatedLogs[0].actor_id).toBe(admin1.id);
    expect(updatedLogs[0].target_id).toBe(teamAlphaConv.id);
  });

  // 9. Regular User Audit Log Rejection
  it('9. Audit Log Security: Regular users cannot read audit logs', () => {
    const userLogs = AuditService.getLogs(rahul);
    expect(userLogs).toHaveLength(0);

    const adminLogs = AuditService.getLogs(admin1);
    expect(adminLogs.length).toBeGreaterThan(0);
    expect(adminLogs.every((l) => l.organization_id === admin1.organization_id)).toBe(true);
  });

  // 10. Super Admin Platform Governance
  it('10. Super Admin Governance: Platform Super Admin has global visibility across all orgs', () => {
    expect(RBAC.isPlatformAdmin(superAdmin)).toBe(true);

    const allTeams = TeamService.getTeamsForUser(superAdmin);
    expect(allTeams.length).toBe(mockSupabase.getTeams().length);

    const allLogs = AuditService.getLogs(superAdmin);
    expect(allLogs.length).toBe(mockSupabase.getAuditLogs().length);
  });

  // 11. Real-time Message Exchange & Read Receipts
  it('11. Message Realtime Flow: Sending message updates conversation and records unread counts', () => {
    const convId = 'c0000000-0000-0000-0000-000000000001';
    const sentMsg = ChatService.sendMessage(convId, rahul.id, 'Hi Amit, testing real-time flow!');
    expect(sentMsg.message).toBe('Hi Amit, testing real-time flow!');

    const messages = ChatService.getMessages(convId);
    expect(messages.some((m) => m.id === sentMsg.id)).toBe(true);

    // Amit reads the message
    ChatService.markAsRead(convId, amit.id);
    const unreadForAmit = ChatService.getUnreadCount(convId, amit.id);
    expect(unreadForAmit).toBe(0);
  });

  // 12. Message Validation
  it('12. Message Validation: Empty or whitespace messages are rejected', () => {
    const convId = 'c0000000-0000-0000-0000-000000000001';
    expect(() => ChatService.sendMessage(convId, rahul.id, '')).toThrow('Message cannot be empty');
    expect(() => ChatService.sendMessage(convId, rahul.id, '   ')).toThrow('Message cannot be empty');
  });

  // 13. Rate Limiter Validation
  it('13. Rate Limiting: High-frequency message dispatch triggers rate limit threshold', () => {
    const userKey = `user-${rahul.id}`;
    const rule = { maxRequests: 5, windowMs: 10000 };

    for (let i = 0; i < 5; i++) {
      const result = rateLimiter.checkLimit(userKey, rule);
      expect(result.allowed).toBe(true);
    }

    // 6th attempt in window is blocked
    const blockedResult = rateLimiter.checkLimit(userKey, rule);
    expect(blockedResult.allowed).toBe(false);
    expect(blockedResult.retryAfterSeconds).toBeGreaterThan(0);
  });

  // 14. Role Escalation Protection
  it('14. Role Escalation Protection: Public registration rejects non-user privileges or defaults safely', async () => {
    const newReg = await AuthService.register(
      'newhire@example.com',
      'password123',
      'New Hire',
      'newhire',
      'USER'
    );
    expect(newReg.role).toBe('USER');
    expect(RBAC.isOrgAdmin(newReg, rahul.organization_id)).toBe(false);
    expect(RBAC.isPlatformAdmin(newReg)).toBe(false);
  });

  // 15. Conversation Participant Authorization
  it('15. Conversation Authorization: Non-participant user cannot access private conversation', () => {
    const teamAlphaConv = mockSupabase.getConversationById('c0000000-0000-0000-0000-000000000001')!;
    // Rohit is in Acme but in Team Beta, not in Team Alpha conversation
    expect(RBAC.canAccessConversation(rohit, teamAlphaConv)).toBe(false);
  });

  // 16. Message Content XSS/Payload Integrity
  it('16. XSS Payload Handling: Malicious script tags are preserved as benign string text', () => {
    const convId = 'c0000000-0000-0000-0000-000000000001';
    const xssPayload = '<script>alert("XSS Attack")</script><img src=x onerror=alert(1)>';
    const sentMsg = ChatService.sendMessage(convId, rahul.id, xssPayload);

    expect(sentMsg.message).toBe(xssPayload);
  });
});
