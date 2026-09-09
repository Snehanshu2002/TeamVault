# Private Team Chat Management System

> **Enterprise-Grade Multi-Tenant Private Team Communication & Administration SaaS**
> Built with Next.js 15+ (App Router), TypeScript, Tailwind CSS, PostgreSQL, Supabase Auth, Row-Level Security (RLS), and Real-Time Synchronization.

---

## Overview

**Private Team Chat Management System** is a secure multi-tenant SaaS application engineered for team communication, role-based boundary enforcement, sensitive data protection, and transparent administrative governance.

### Core Architectural Guarantees
- **Multi-Tenant Database Isolation**: Strict organization boundary enforcement. Tenant A can never query, read, or receive messages belonging to Tenant B.
- **Three-Tier Role Hierarchy**: `PLATFORM_SUPER_ADMIN`, `ORGANIZATION_ADMIN`, and `USER`.
- **Sensitive Profile Separation**: Public profiles (`display_name`, `@username`, online status) are exposed to teammates, while private profiles (`email`, `phone`, `address`, sensitive metadata) remain strictly protected at the database and service layer.
- **1-to-1 Private Chat Boundary**: Regular users can **only** message colleagues who share an active team assignment within their organization.
- **Transparent Administrator Oversight**: Organization administrators can monitor and review 1-to-1 chats occurring within their assigned teams in read-only audit mode with live transcript streaming and audit trail logging.
- **Dual-Engine Architecture**: Operates with a production Supabase/PostgreSQL backend or in an instant local emulator mode powered by multi-tab BroadcastChannel state replication.

---

## Technology Stack

| Layer | Technology |
|---|---|
| **Framework** | Next.js 15+ (App Router, Server Actions, Route Handlers) |
| **Language** | TypeScript (Strict mode, full type-safety) |
| **Styling** | Tailwind CSS & Lucide Icons |
| **Validation** | Zod schemas for all inputs & database payloads |
| **Database** | PostgreSQL with Row-Level Security (RLS) & Performance Indexes |
| **Auth & Storage** | Supabase Auth & Supabase Storage |
| **Real-Time** | Supabase Realtime & BroadcastChannel (Local multi-tab sync) |
| **Testing** | Vitest automated RBAC & multi-tenant authorization suite |

---

## Database Schema & RLS Policies

All SQL migrations are organized in `supabase/migrations/`:

1. `001_create_organizations.sql`: `organizations` table with tenant slugs and lifecycle status.
2. `002_create_profiles.sql`: Separate `profiles` (public-safe) and `user_private_profiles` (protected PII).
3. `003_create_teams.sql`: `organization_members`, `teams`, and `team_members` tables.
4. `004_create_conversations.sql`: `conversations` and `conversation_participants` tables.
5. `005_create_messages.sql`: `messages` and `message_reads` tables.
6. `006_create_audit_logs.sql`: `audit_logs` and `notifications` tables.
7. `007_create_rls_policies.sql`: Helper functions (`auth_user_org_id()`, `auth_user_role()`, `are_users_in_shared_team()`) and RLS policies on all tables.
8. `008_create_indexes.sql`: Composite indexes on tenant IDs, team lookups, message timestamps, and conversation participants.
9. `supabase/seed/seed.sql`: Multi-tenant demo dataset with Acme Corp & Globex Corp personas.

---

## Getting Started

### 1. Prerequisites
- **Node.js**: v18.17+ or v20+
- **npm** or **yarn** or **pnpm**

### 2. Installation
```bash
git clone https://github.com/your-org/private-team-chat-management-system.git
cd private-team-chat-management-system
npm install
```

### 3. Environment Configuration
Copy `.env.example` to `.env.local`:
```bash
cp .env.example .env.local
```

Configure your Supabase credentials (optional for local demo emulator mode):
```env
NEXT_PUBLIC_SUPABASE_URL=https://your-project.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=your-anon-key
SUPABASE_SERVICE_ROLE_KEY=your-service-role-key
```

### 4. Running the App
```bash
npm run dev
```
Visit [http://localhost:3000](http://localhost:3000) to access the application.

---

## Automated Testing

Run the comprehensive authorization and RBAC test suite:
```bash
npm test
```

The test suite validates:
- Multi-tenant data isolation (cross-tenant access rejected).
- Sensitive user profile sanitization (email/phone scrubbed for standard users).
- 1-to-1 chat initiation allowed only between shared team members.
- Cross-team and cross-organization direct chat blocking.
- Scoped admin conversation oversight vs unauthorized admin access.
- Message validation, real-time dispatch, and read receipts.

---

## Demo Personas (1-Click Switcher)

| Persona | Role | Organization | Teams Assigned | Description |
|---|---|---|---|---|
| **Platform Super Admin** | `PLATFORM_SUPER_ADMIN` | Global | All Teams | Global governance & cross-org oversight |
| **Alex Vance (Admin 1)** | `ORGANIZATION_ADMIN` | Acme Corp | Team Alpha, Team Beta | Acme Admin overseeing Alpha & Beta chats |
| **Beatrice Stone (Admin 2)** | `ORGANIZATION_ADMIN` | Acme Corp | Team Gamma | Acme Admin strictly isolated to Gamma |
| **Rahul Sharma** | `USER` | Acme Corp | Team Alpha | Engineer; can chat with Amit & Priya |
| **Amit Patel** | `USER` | Acme Corp | Team Alpha | Developer; can chat with Rahul & Priya |
| **Priya Singh** | `USER` | Acme Corp | Team Alpha | Tech Lead in Team Alpha |
| **Rohit Kumar** | `USER` | Acme Corp | Team Beta | Team Beta specialist; chats with Neha |
| **Neha Gupta** | `USER` | Acme Corp | Team Beta | Team Beta analyst; chats with Rohit |
| **Anita Roy** | `USER` | Acme Corp | Team Gamma | Team Gamma specialist under Admin 2 |
| **Carlos Mendez** | `ORGANIZATION_ADMIN` | Globex Corp | Globex Core | Tenant 2 Admin (Isolated from Acme) |
| **Dana White** | `USER` | Globex Corp | Globex Core | Tenant 2 User (Isolated from Acme) |

---

## Live Two-Panel Demo (`/demo/chat`)

To showcase simultaneous two-user real-time chat on a single monitor:
1. Navigate to **`/demo/chat`**.
2. **Left Panel**: Rahul Sharma (Team Alpha).
3. **Right Panel**: Amit Patel (Team Alpha).
4. Send a message from either panel — watch instant bi-directional message receipt and state sync in real-time.

---

## Production Deployment

### Deploy to Vercel
1. Push this repository to GitHub.
2. Import the repository into **Vercel**.
3. In Project Settings > Environment Variables, add:
   - `NEXT_PUBLIC_SUPABASE_URL`
   - `NEXT_PUBLIC_SUPABASE_ANON_KEY`
   - `SUPABASE_SERVICE_ROLE_KEY`
4. Deploy!

---

## Security Compliance Checklist
- [x] Multi-tenant PostgreSQL Row Level Security (RLS) enabled on all tables
- [x] Strict separation of public user profiles and private personal metadata (PII)
- [x] Zero GPS/telemetry/device tracking in MVP
- [x] Immutable audit trail for all admin oversight and administrative actions
- [x] Zod validation across all inputs, endpoints, and server actions
