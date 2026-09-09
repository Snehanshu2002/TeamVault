-- =============================================================================
-- Migration 008: Optimized Query Indexes
-- =============================================================================

-- Organizations
CREATE INDEX IF NOT EXISTS idx_organizations_slug ON public.organizations(slug);
CREATE INDEX IF NOT EXISTS idx_organizations_status ON public.organizations(status);

-- Profiles
CREATE INDEX IF NOT EXISTS idx_profiles_organization_id ON public.profiles(organization_id);
CREATE INDEX IF NOT EXISTS idx_profiles_role ON public.profiles(role);
CREATE INDEX IF NOT EXISTS idx_profiles_username ON public.profiles(username);

-- Teams & Team Members
CREATE INDEX IF NOT EXISTS idx_teams_organization_id ON public.teams(organization_id);
CREATE INDEX IF NOT EXISTS idx_team_members_team_id ON public.team_members(team_id);
CREATE INDEX IF NOT EXISTS idx_team_members_user_id ON public.team_members(user_id);

-- Conversations & Participants
CREATE INDEX IF NOT EXISTS idx_conversations_organization_id ON public.conversations(organization_id);
CREATE INDEX IF NOT EXISTS idx_conversations_team_id ON public.conversations(team_id);
CREATE INDEX IF NOT EXISTS idx_conversations_last_message_at ON public.conversations(last_message_at DESC);
CREATE INDEX IF NOT EXISTS idx_conversation_participants_user_id ON public.conversation_participants(user_id);
CREATE INDEX IF NOT EXISTS idx_conversation_participants_conv_id ON public.conversation_participants(conversation_id);

-- Messages
CREATE INDEX IF NOT EXISTS idx_messages_conversation_id ON public.messages(conversation_id);
CREATE INDEX IF NOT EXISTS idx_messages_sender_id ON public.messages(sender_id);
CREATE INDEX IF NOT EXISTS idx_messages_created_at ON public.messages(created_at ASC);

-- Message Reads
CREATE INDEX IF NOT EXISTS idx_message_reads_user_id ON public.message_reads(user_id);
CREATE INDEX IF NOT EXISTS idx_message_reads_message_id ON public.message_reads(message_id);

-- Audit Logs
CREATE INDEX IF NOT EXISTS idx_audit_logs_org_id ON public.audit_logs(organization_id);
CREATE INDEX IF NOT EXISTS idx_audit_logs_actor_id ON public.audit_logs(actor_id);
CREATE INDEX IF NOT EXISTS idx_audit_logs_created_at ON public.audit_logs(created_at DESC);
