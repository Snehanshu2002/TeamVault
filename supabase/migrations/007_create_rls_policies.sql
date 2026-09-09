-- =============================================================================
-- Migration 007: Row Level Security (RLS) & Helper Functions
-- Enforces multi-tenant isolation, team-level boundaries, and private chat permissions.
-- =============================================================================

-- Enable RLS on all tables
ALTER TABLE public.organizations ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.user_private_profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.organization_members ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.teams ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.team_members ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.conversations ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.conversation_participants ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.messages ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.message_reads ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.audit_logs ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.notifications ENABLE ROW LEVEL SECURITY;

-- -----------------------------------------------------------------------------
-- Helper Functions
-- -----------------------------------------------------------------------------

-- Check if current authenticated user is Platform Super Admin
CREATE OR REPLACE FUNCTION public.is_platform_admin()
RETURNS BOOLEAN AS $$
BEGIN
    RETURN EXISTS (
        SELECT 1 FROM public.profiles
        WHERE id = auth.uid() AND role = 'PLATFORM_SUPER_ADMIN' AND status = 'active'
    );
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Check if current authenticated user is Admin of a specific Organization
CREATE OR REPLACE FUNCTION public.is_org_admin(org_id UUID)
RETURNS BOOLEAN AS $$
BEGIN
    IF public.is_platform_admin() THEN
        RETURN TRUE;
    END IF;

    RETURN EXISTS (
        SELECT 1 FROM public.organization_members
        WHERE organization_id = org_id 
          AND user_id = auth.uid() 
          AND role = 'ORGANIZATION_ADMIN'
          AND status = 'active'
    ) OR EXISTS (
        SELECT 1 FROM public.profiles
        WHERE id = auth.uid()
          AND organization_id = org_id
          AND role = 'ORGANIZATION_ADMIN'
          AND status = 'active'
    );
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Check if current authenticated user is Member of a specific Organization
CREATE OR REPLACE FUNCTION public.is_org_member(org_id UUID)
RETURNS BOOLEAN AS $$
BEGIN
    IF public.is_platform_admin() THEN
        RETURN TRUE;
    END IF;

    RETURN EXISTS (
        SELECT 1 FROM public.profiles
        WHERE id = auth.uid() AND organization_id = org_id AND status = 'active'
    );
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Check if current authenticated user is Member of a specific Team
CREATE OR REPLACE FUNCTION public.is_team_member(t_id UUID)
RETURNS BOOLEAN AS $$
BEGIN
    IF public.is_platform_admin() THEN
        RETURN TRUE;
    END IF;

    -- Org admin can view teams in their organization
    IF EXISTS (
        SELECT 1 FROM public.teams t
        WHERE t.id = t_id AND public.is_org_admin(t.organization_id)
    ) THEN
        RETURN TRUE;
    END IF;

    RETURN EXISTS (
        SELECT 1 FROM public.team_members
        WHERE team_id = t_id AND user_id = auth.uid()
    );
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Check if current user is participant in a conversation
CREATE OR REPLACE FUNCTION public.is_conversation_participant(conv_id UUID)
RETURNS BOOLEAN AS $$
BEGIN
    RETURN EXISTS (
        SELECT 1 FROM public.conversation_participants
        WHERE conversation_id = conv_id AND user_id = auth.uid()
    );
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- -----------------------------------------------------------------------------
-- Policies: Organizations
-- -----------------------------------------------------------------------------
CREATE POLICY "Super admins can manage all organizations"
    ON public.organizations FOR ALL
    USING (public.is_platform_admin());

CREATE POLICY "Members can view their own organization"
    ON public.organizations FOR SELECT
    USING (public.is_org_member(id));

-- -----------------------------------------------------------------------------
-- Policies: Profiles (Public Safe)
-- -----------------------------------------------------------------------------
CREATE POLICY "Users can read own profile and team/org members"
    ON public.profiles FOR SELECT
    USING (
        id = auth.uid() OR
        public.is_org_member(organization_id) OR
        public.is_platform_admin()
    );

CREATE POLICY "Users can update own profile"
    ON public.profiles FOR UPDATE
    USING (id = auth.uid())
    WITH CHECK (id = auth.uid());

CREATE POLICY "Admins can manage profiles in their organization"
    ON public.profiles FOR ALL
    USING (public.is_org_admin(organization_id));

-- -----------------------------------------------------------------------------
-- Policies: User Private Profiles (Sensitive: phone, address, metadata)
-- -----------------------------------------------------------------------------
CREATE POLICY "Only self or org admin can view private profile"
    ON public.user_private_profiles FOR SELECT
    USING (
        user_id = auth.uid() OR
        EXISTS (
            SELECT 1 FROM public.profiles p
            WHERE p.id = user_private_profiles.user_id AND public.is_org_admin(p.organization_id)
        ) OR
        public.is_platform_admin()
    );

CREATE POLICY "User can update own private profile"
    ON public.user_private_profiles FOR UPDATE
    USING (user_id = auth.uid())
    WITH CHECK (user_id = auth.uid());

-- -----------------------------------------------------------------------------
-- Policies: Teams & Team Members
-- -----------------------------------------------------------------------------
CREATE POLICY "Members can view teams in their organization"
    ON public.teams FOR SELECT
    USING (public.is_org_member(organization_id));

CREATE POLICY "Org admins can manage teams"
    ON public.teams FOR ALL
    USING (public.is_org_admin(organization_id));

CREATE POLICY "Users can view members of teams they are assigned to or admin of"
    ON public.team_members FOR SELECT
    USING (
        public.is_team_member(team_id) OR
        public.is_platform_admin()
    );

CREATE POLICY "Org admins can manage team memberships"
    ON public.team_members FOR ALL
    USING (
        EXISTS (
            SELECT 1 FROM public.teams t
            WHERE t.id = team_members.team_id AND public.is_org_admin(t.organization_id)
        )
    );

-- -----------------------------------------------------------------------------
-- Policies: Conversations
-- -----------------------------------------------------------------------------
CREATE POLICY "Participants and authorized Org Admins can view conversations"
    ON public.conversations FOR SELECT
    USING (
        public.is_conversation_participant(id) OR
        public.is_org_admin(organization_id) OR
        public.is_platform_admin()
    );

CREATE POLICY "Participants can create direct conversations within their teams"
    ON public.conversations FOR INSERT
    WITH CHECK (
        public.is_org_member(organization_id) AND
        public.is_team_member(team_id)
    );

CREATE POLICY "Participants can view conversation participants"
    ON public.conversation_participants FOR SELECT
    USING (
        EXISTS (
            SELECT 1 FROM public.conversations c
            WHERE c.id = conversation_participants.conversation_id AND (
                public.is_conversation_participant(c.id) OR
                public.is_org_admin(c.organization_id) OR
                public.is_platform_admin()
            )
        )
    );

-- -----------------------------------------------------------------------------
-- Policies: Messages
-- -----------------------------------------------------------------------------
CREATE POLICY "Participants and authorized Org Admins can read messages"
    ON public.messages FOR SELECT
    USING (
        EXISTS (
            SELECT 1 FROM public.conversations c
            WHERE c.id = messages.conversation_id AND (
                public.is_conversation_participant(c.id) OR
                public.is_org_admin(c.organization_id) OR
                public.is_platform_admin()
            )
        )
    );

CREATE POLICY "Participants can insert messages as themselves only"
    ON public.messages FOR INSERT
    WITH CHECK (
        sender_id = auth.uid() AND
        public.is_conversation_participant(conversation_id)
    );

CREATE POLICY "Users can update own messages (e.g. soft delete)"
    ON public.messages FOR UPDATE
    USING (sender_id = auth.uid())
    WITH CHECK (sender_id = auth.uid());

-- -----------------------------------------------------------------------------
-- Policies: Audit Logs
-- -----------------------------------------------------------------------------
CREATE POLICY "Org admins can view audit logs for their organization"
    ON public.audit_logs FOR SELECT
    USING (
        public.is_org_admin(organization_id) OR
        public.is_platform_admin()
    );

CREATE POLICY "System can append audit logs"
    ON public.audit_logs FOR INSERT
    WITH CHECK (auth.uid() IS NOT NULL);
