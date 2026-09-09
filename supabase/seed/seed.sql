-- =============================================================================
-- Multi-Tenant Development & Demo SQL Seed Data
-- =============================================================================

-- Organizations
INSERT INTO public.organizations (id, name, slug, status)
VALUES 
    ('a0000000-0000-0000-0000-000000000001', 'Acme Corporation', 'acme-corp', 'active'),
    ('a0000000-0000-0000-0000-000000000002', 'Globex International', 'globex-intl', 'active')
ON CONFLICT (id) DO NOTHING;

-- Profiles (matching demo personas)
INSERT INTO public.profiles (id, organization_id, username, display_name, email, role, status)
VALUES
    ('u0000000-0000-0000-0000-000000000000', 'a0000000-0000-0000-0000-000000000001', 'superadmin', 'Super Admin', 'superadmin@example.com', 'PLATFORM_SUPER_ADMIN', 'active'),
    ('u0000000-0000-0000-0000-000000000001', 'a0000000-0000-0000-0000-000000000001', 'admin1', 'Alex Vance (Admin 1)', 'admin1@example.com', 'ORGANIZATION_ADMIN', 'active'),
    ('u0000000-0000-0000-0000-000000000002', 'a0000000-0000-0000-0000-000000000001', 'admin2', 'Beatrice Stone (Admin 2)', 'admin2@example.com', 'ORGANIZATION_ADMIN', 'active'),
    ('u0000000-0000-0000-0000-000000000003', 'a0000000-0000-0000-0000-000000000001', 'rahul', 'Rahul Sharma', 'rahul@example.com', 'USER', 'active'),
    ('u0000000-0000-0000-0000-000000000004', 'a0000000-0000-0000-0000-000000000001', 'amit', 'Amit Patel', 'amit@example.com', 'USER', 'active'),
    ('u0000000-0000-0000-0000-000000000005', 'a0000000-0000-0000-0000-000000000001', 'priya', 'Priya Singh', 'priya@example.com', 'USER', 'active'),
    ('u0000000-0000-0000-0000-000000000006', 'a0000000-0000-0000-0000-000000000001', 'rohit', 'Rohit Kumar', 'rohit@example.com', 'USER', 'active'),
    ('u0000000-0000-0000-0000-000000000007', 'a0000000-0000-0000-0000-000000000001', 'neha', 'Neha Gupta', 'neha@example.com', 'USER', 'active'),
    ('u0000000-0000-0000-0000-000000000008', 'a0000000-0000-0000-0000-000000000001', 'anita', 'Anita Roy', 'anita@example.com', 'USER', 'active')
ON CONFLICT (id) DO NOTHING;

-- Protected Private Profiles (Phone, address, metadata)
INSERT INTO public.user_private_profiles (id, user_id, phone, address, metadata)
VALUES
    ('p0000000-0000-0000-0000-000000000003', 'u0000000-0000-0000-0000-000000000003', '+1-555-0103', '100 Silicon Way, Tech City', '{"securityClearance": "L2"}'::jsonb),
    ('p0000000-0000-0000-0000-000000000004', 'u0000000-0000-0000-0000-000000000004', '+1-555-0104', '200 Innovation Blvd', '{"securityClearance": "L2"}'::jsonb)
ON CONFLICT (user_id) DO NOTHING;

-- Teams
INSERT INTO public.teams (id, organization_id, name, description, status, created_by)
VALUES
    ('t0000000-0000-0000-0000-000000000001', 'a0000000-0000-0000-0000-000000000001', 'Team Alpha', 'Core Architecture & Platform Engineering', 'active', 'u0000000-0000-0000-0000-000000000001'),
    ('t0000000-0000-0000-0000-000000000002', 'a0000000-0000-0000-0000-000000000001', 'Team Beta', 'Operations & Deployment Pipeline', 'active', 'u0000000-0000-0000-0000-000000000001'),
    ('t0000000-0000-0000-0000-000000000003', 'a0000000-0000-0000-0000-000000000001', 'Team Gamma', 'Customer Operations & Security Audits', 'active', 'u0000000-0000-0000-0000-000000000002')
ON CONFLICT (id) DO NOTHING;

-- Team Members
-- Team Alpha: Rahul, Amit, Priya
INSERT INTO public.team_members (team_id, user_id)
VALUES
    ('t0000000-0000-0000-0000-000000000001', 'u0000000-0000-0000-0000-000000000003'),
    ('t0000000-0000-0000-0000-000000000001', 'u0000000-0000-0000-0000-000000000004'),
    ('t0000000-0000-0000-0000-000000000001', 'u0000000-0000-0000-0000-000000000005')
ON CONFLICT DO NOTHING;

-- Team Beta: Rohit, Neha
INSERT INTO public.team_members (team_id, user_id)
VALUES
    ('t0000000-0000-0000-0000-000000000002', 'u0000000-0000-0000-0000-000000000006'),
    ('t0000000-0000-0000-0000-000000000002', 'u0000000-0000-0000-0000-000000000007')
ON CONFLICT DO NOTHING;

-- Team Gamma: Anita
INSERT INTO public.team_members (team_id, user_id)
VALUES
    ('t0000000-0000-0000-0000-000000000003', 'u0000000-0000-0000-0000-000000000008')
ON CONFLICT DO NOTHING;

-- Seed Conversations: Rahul <-> Amit
INSERT INTO public.conversations (id, organization_id, team_id, conversation_type, last_message_at)
VALUES
    ('c0000000-0000-0000-0000-000000000001', 'a0000000-0000-0000-0000-000000000001', 't0000000-0000-0000-0000-000000000001', 'DIRECT', NOW())
ON CONFLICT (id) DO NOTHING;

INSERT INTO public.conversation_participants (conversation_id, user_id)
VALUES
    ('c0000000-0000-0000-0000-000000000001', 'u0000000-0000-0000-0000-000000000003'),
    ('c0000000-0000-0000-0000-000000000001', 'u0000000-0000-0000-0000-000000000004')
ON CONFLICT DO NOTHING;

-- Seed Messages: Rahul <-> Amit
INSERT INTO public.messages (id, conversation_id, sender_id, message)
VALUES
    ('m0000000-0000-0000-0000-000000000001', 'c0000000-0000-0000-0000-000000000001', 'u0000000-0000-0000-0000-000000000003', 'Hi Amit, how is the project going?'),
    ('m0000000-0000-0000-0000-000000000002', 'c0000000-0000-0000-0000-000000000001', 'u0000000-0000-0000-0000-000000000004', 'Everything is on track. Working on the PostgreSQL RLS schemas.')
ON CONFLICT (id) DO NOTHING;
