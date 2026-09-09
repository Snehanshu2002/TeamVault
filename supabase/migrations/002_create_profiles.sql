-- =============================================================================
-- Migration 002: Profiles & Protected Private Profiles
-- Separates public-safe user data from private sensitive information.
-- =============================================================================

-- Public Profiles (Safe for fellow team members)
CREATE TABLE IF NOT EXISTS public.profiles (
    id UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
    organization_id UUID NOT NULL REFERENCES public.organizations(id) ON DELETE CASCADE,
    username TEXT UNIQUE NOT NULL,
    display_name TEXT NOT NULL,
    email TEXT NOT NULL,
    avatar_url TEXT NULL,
    role TEXT NOT NULL DEFAULT 'USER' CHECK (role IN ('PLATFORM_SUPER_ADMIN', 'ORGANIZATION_ADMIN', 'USER')),
    status TEXT NOT NULL DEFAULT 'active' CHECK (status IN ('active', 'disabled')),
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- User Private Profiles (Sensitive data: phone, address, metadata)
CREATE TABLE IF NOT EXISTS public.user_private_profiles (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID UNIQUE NOT NULL REFERENCES public.profiles(id) ON DELETE CASCADE,
    phone TEXT NULL,
    address TEXT NULL,
    metadata JSONB NULL DEFAULT '{}'::jsonb,
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- Triggers for updated_at
CREATE TRIGGER update_profiles_updated_at
    BEFORE UPDATE ON public.profiles
    FOR EACH ROW
    EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_user_private_profiles_updated_at
    BEFORE UPDATE ON public.user_private_profiles
    FOR EACH ROW
    EXECUTE FUNCTION update_updated_at_column();
