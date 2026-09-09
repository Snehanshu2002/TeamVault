import {
  Organization,
  Profile,
  PublicProfile,
  UserPrivateProfile,
  Team,
  Conversation,
  Message,
  AuditLog,
  DemoPersona,
  UserRole,
} from '@/lib/types';

export const DEMO_PERSONAS: DemoPersona[] = [
  {
    uid: 'u0000000-0000-0000-0000-000000000000',
    name: 'Super Admin',
    username: 'superadmin',
    email: 'superadmin@example.com',
    role: 'PLATFORM_SUPER_ADMIN',
    organizationName: 'Global Governance',
    teamNames: ['All Platform Organizations'],
    description: 'System-wide owner with complete governance across all organizations, admins, and teams.',
    avatarColor: 'bg-rose-600',
  },
  {
    uid: 'u0000000-0000-0000-0000-000000000001',
    name: 'Alex Vance (Admin 1)',
    username: 'admin1',
    email: 'admin1@example.com',
    role: 'ORGANIZATION_ADMIN',
    organizationName: 'Acme Corporation',
    teamNames: ['Team Alpha', 'Team Beta'],
    description: 'Manages Team Alpha & Beta in Acme Corp. Can observe 1-to-1 team chats in these teams.',
    avatarColor: 'bg-indigo-600',
  },
  {
    uid: 'u0000000-0000-0000-0000-000000000002',
    name: 'Beatrice Stone (Admin 2)',
    username: 'admin2',
    email: 'admin2@example.com',
    role: 'ORGANIZATION_ADMIN',
    organizationName: 'Acme Corporation',
    teamNames: ['Team Gamma'],
    description: 'Manages Team Gamma. Strictly isolated from Team Alpha and Team Beta conversations.',
    avatarColor: 'bg-purple-600',
  },
  {
    uid: 'u0000000-0000-0000-0000-000000000003',
    name: 'Rahul Sharma',
    username: 'rahul',
    email: 'rahul@example.com',
    role: 'USER',
    organizationName: 'Acme Corporation',
    teamNames: ['Team Alpha'],
    description: 'Team Alpha Engineer. Can private chat with Amit and Priya.',
    avatarColor: 'bg-blue-600',
  },
  {
    uid: 'u0000000-0000-0000-0000-000000000004',
    name: 'Amit Patel',
    username: 'amit',
    email: 'amit@example.com',
    role: 'USER',
    organizationName: 'Acme Corporation',
    teamNames: ['Team Alpha'],
    description: 'Team Alpha Developer. Can private chat with Rahul and Priya.',
    avatarColor: 'bg-teal-600',
  },
  {
    uid: 'u0000000-0000-0000-0000-000000000005',
    name: 'Priya Singh',
    username: 'priya',
    email: 'priya@example.com',
    role: 'USER',
    organizationName: 'Acme Corporation',
    teamNames: ['Team Alpha'],
    description: 'Team Alpha Tech Lead. Can private chat with Rahul and Amit.',
    avatarColor: 'bg-emerald-600',
  },
  {
    uid: 'u0000000-0000-0000-0000-000000000006',
    name: 'Rohit Kumar',
    username: 'rohit',
    email: 'rohit@example.com',
    role: 'USER',
    organizationName: 'Acme Corporation',
    teamNames: ['Team Beta'],
    description: 'Team Beta Specialist. Can private chat with Neha.',
    avatarColor: 'bg-amber-600',
  },
  {
    uid: 'u0000000-0000-0000-0000-000000000007',
    name: 'Neha Gupta',
    username: 'neha',
    email: 'neha@example.com',
    role: 'USER',
    organizationName: 'Acme Corporation',
    teamNames: ['Team Beta'],
    description: 'Team Beta Analyst. Can private chat with Rohit.',
    avatarColor: 'bg-orange-600',
  },
  {
    uid: 'u0000000-0000-0000-0000-000000000008',
    name: 'Anita Roy',
    username: 'anita',
    email: 'anita@example.com',
    role: 'USER',
    organizationName: 'Acme Corporation',
    teamNames: ['Team Gamma'],
    description: 'Team Gamma Specialist under Admin 2.',
    avatarColor: 'bg-pink-600',
  },
];

export const INITIAL_ORGANIZATIONS: Organization[] = [
  {
    id: 'a0000000-0000-0000-0000-000000000001',
    name: 'Acme Corporation',
    slug: 'acme-corp',
    status: 'active',
    created_at: '2026-01-01T00:00:00.000Z',
    updated_at: '2026-01-01T00:00:00.000Z',
  },
  {
    id: 'a0000000-0000-0000-0000-000000000002',
    name: 'Globex International',
    slug: 'globex-intl',
    status: 'active',
    created_at: '2026-01-01T00:00:00.000Z',
    updated_at: '2026-01-01T00:00:00.000Z',
  },
];

export const INITIAL_PROFILES: Profile[] = [
  {
    id: 'u0000000-0000-0000-0000-000000000000',
    organization_id: 'a0000000-0000-0000-0000-000000000001',
    username: 'superadmin',
    display_name: 'Super Admin',
    email: 'superadmin@example.com',
    role: 'PLATFORM_SUPER_ADMIN',
    status: 'active',
    created_at: '2026-01-01T00:00:00.000Z',
    updated_at: '2026-01-01T00:00:00.000Z',
    isOnline: true,
  },
  {
    id: 'u0000000-0000-0000-0000-000000000001',
    organization_id: 'a0000000-0000-0000-0000-000000000001',
    username: 'admin1',
    display_name: 'Alex Vance (Admin 1)',
    email: 'admin1@example.com',
    role: 'ORGANIZATION_ADMIN',
    status: 'active',
    created_at: '2026-01-05T00:00:00.000Z',
    updated_at: '2026-01-05T00:00:00.000Z',
    isOnline: true,
  },
  {
    id: 'u0000000-0000-0000-0000-000000000002',
    organization_id: 'a0000000-0000-0000-0000-000000000001',
    username: 'admin2',
    display_name: 'Beatrice Stone (Admin 2)',
    email: 'admin2@example.com',
    role: 'ORGANIZATION_ADMIN',
    status: 'active',
    created_at: '2026-01-08T00:00:00.000Z',
    updated_at: '2026-01-08T00:00:00.000Z',
    isOnline: true,
  },
  {
    id: 'u0000000-0000-0000-0000-000000000003',
    organization_id: 'a0000000-0000-0000-0000-000000000001',
    username: 'rahul',
    display_name: 'Rahul Sharma',
    email: 'rahul@example.com',
    role: 'USER',
    status: 'active',
    created_at: '2026-01-10T10:00:00.000Z',
    updated_at: '2026-01-10T10:00:00.000Z',
    isOnline: true,
  },
  {
    id: 'u0000000-0000-0000-0000-000000000004',
    organization_id: 'a0000000-0000-0000-0000-000000000001',
    username: 'amit',
    display_name: 'Amit Patel',
    email: 'amit@example.com',
    role: 'USER',
    status: 'active',
    created_at: '2026-01-10T11:00:00.000Z',
    updated_at: '2026-01-10T11:00:00.000Z',
    isOnline: true,
  },
  {
    id: 'u0000000-0000-0000-0000-000000000005',
    organization_id: 'a0000000-0000-0000-0000-000000000001',
    username: 'priya',
    display_name: 'Priya Singh',
    email: 'priya@example.com',
    role: 'USER',
    status: 'active',
    created_at: '2026-01-10T12:00:00.000Z',
    updated_at: '2026-01-10T12:00:00.000Z',
    isOnline: false,
  },
  {
    id: 'u0000000-0000-0000-0000-000000000006',
    organization_id: 'a0000000-0000-0000-0000-000000000001',
    username: 'rohit',
    display_name: 'Rohit Kumar',
    email: 'rohit@example.com',
    role: 'USER',
    status: 'active',
    created_at: '2026-01-15T09:00:00.000Z',
    updated_at: '2026-01-15T09:00:00.000Z',
    isOnline: true,
  },
  {
    id: 'u0000000-0000-0000-0000-000000000007',
    organization_id: 'a0000000-0000-0000-0000-000000000001',
    username: 'neha',
    display_name: 'Neha Gupta',
    email: 'neha@example.com',
    role: 'USER',
    status: 'active',
    created_at: '2026-01-15T10:30:00.000Z',
    updated_at: '2026-01-15T10:30:00.000Z',
    isOnline: true,
  },
  {
    id: 'u0000000-0000-0000-0000-000000000008',
    organization_id: 'a0000000-0000-0000-0000-000000000001',
    username: 'anita',
    display_name: 'Anita Roy',
    email: 'anita@example.com',
    role: 'USER',
    status: 'active',
    created_at: '2026-01-20T14:00:00.000Z',
    updated_at: '2026-01-20T14:00:00.000Z',
    isOnline: true,
  },
  {
    id: 'u0000000-0000-0000-0000-000000000009',
    organization_id: 'a0000000-0000-0000-0000-000000000002',
    username: 'carlos',
    display_name: 'Carlos Mendez (Globex Admin)',
    email: 'carlos@globex.com',
    role: 'ORGANIZATION_ADMIN',
    status: 'active',
    created_at: '2026-01-05T00:00:00.000Z',
    updated_at: '2026-01-05T00:00:00.000Z',
    isOnline: true,
  },
  {
    id: 'u0000000-0000-0000-0000-000000000010',
    organization_id: 'a0000000-0000-0000-0000-000000000002',
    username: 'dana',
    display_name: 'Dana White',
    email: 'dana@globex.com',
    role: 'USER',
    status: 'active',
    created_at: '2026-01-10T00:00:00.000Z',
    updated_at: '2026-01-10T00:00:00.000Z',
    isOnline: true,
  },
];

export const INITIAL_USER_PRIVATE_PROFILES: UserPrivateProfile[] = [
  {
    id: 'p0000000-0000-0000-0000-000000000003',
    user_id: 'u0000000-0000-0000-0000-000000000003',
    phone: '+1-555-0103',
    address: '100 Silicon Way, Tech City',
    metadata: { clearanceLevel: 'L2', department: 'Core Engineering' },
    created_at: '2026-01-10T10:00:00.000Z',
    updated_at: '2026-01-10T10:00:00.000Z',
  },
  {
    id: 'p0000000-0000-0000-0000-000000000004',
    user_id: 'u0000000-0000-0000-0000-000000000004',
    phone: '+1-555-0104',
    address: '200 Innovation Blvd',
    metadata: { clearanceLevel: 'L2', department: 'Real-time Systems' },
    created_at: '2026-01-10T11:00:00.000Z',
    updated_at: '2026-01-10T11:00:00.000Z',
  },
];

export const INITIAL_TEAMS: Team[] = [
  {
    id: 't0000000-0000-0000-0000-000000000001',
    organization_id: 'a0000000-0000-0000-0000-000000000001',
    name: 'Team Alpha',
    description: 'Core Product Engineering & Real-Time Architecture',
    status: 'active',
    created_by: 'u0000000-0000-0000-0000-000000000001',
    adminName: 'Alex Vance (Admin 1)',
    memberIds: [
      'u0000000-0000-0000-0000-000000000003', // Rahul
      'u0000000-0000-0000-0000-000000000004', // Amit
      'u0000000-0000-0000-0000-000000000005', // Priya
    ],
    created_at: '2026-01-10T08:00:00.000Z',
    updated_at: '2026-01-10T08:00:00.000Z',
  },
  {
    id: 't0000000-0000-0000-0000-000000000002',
    organization_id: 'a0000000-0000-0000-0000-000000000001',
    name: 'Team Beta',
    description: 'Quality Assurance, Deployment & Product Ops',
    status: 'active',
    created_by: 'u0000000-0000-0000-0000-000000000001',
    adminName: 'Alex Vance (Admin 1)',
    memberIds: [
      'u0000000-0000-0000-0000-000000000006', // Rohit
      'u0000000-0000-0000-0000-000000000007', // Neha
    ],
    created_at: '2026-01-15T08:00:00.000Z',
    updated_at: '2026-01-15T08:00:00.000Z',
  },
  {
    id: 't0000000-0000-0000-0000-000000000003',
    organization_id: 'a0000000-0000-0000-0000-000000000001',
    name: 'Team Gamma',
    description: 'Customer Support, Compliance & Operations',
    status: 'active',
    created_by: 'u0000000-0000-0000-0000-000000000002',
    adminName: 'Beatrice Stone (Admin 2)',
    memberIds: [
      'u0000000-0000-0000-0000-000000000008', // Anita
    ],
    created_at: '2026-01-20T08:00:00.000Z',
    updated_at: '2026-01-20T08:00:00.000Z',
  },
  {
    id: 't0000000-0000-0000-0000-000000000004',
    organization_id: 'a0000000-0000-0000-0000-000000000002',
    name: 'Globex Core',
    description: 'Globex International Operations & Engineering',
    status: 'active',
    created_by: 'u0000000-0000-0000-0000-000000000009',
    adminName: 'Carlos Mendez (Globex Admin)',
    memberIds: [
      'u0000000-0000-0000-0000-000000000010', // Dana
    ],
    created_at: '2026-01-20T08:00:00.000Z',
    updated_at: '2026-01-20T08:00:00.000Z',
  },
];

export const INITIAL_CONVERSATIONS: Conversation[] = [
  {
    id: 'c0000000-0000-0000-0000-000000000001',
    organization_id: 'a0000000-0000-0000-0000-000000000001',
    team_id: 't0000000-0000-0000-0000-000000000001',
    team_name: 'Team Alpha',
    conversation_type: 'DIRECT',
    participantIds: [
      'u0000000-0000-0000-0000-000000000003', // Rahul
      'u0000000-0000-0000-0000-000000000004', // Amit
    ],
    last_message: 'Everything is on track. Working on the PostgreSQL RLS schemas.',
    last_message_sender_id: 'u0000000-0000-0000-0000-000000000004',
    last_message_at: '2026-09-09T10:05:00.000Z',
    created_at: '2026-09-09T10:00:00.000Z',
    updated_at: '2026-09-09T10:05:00.000Z',
  },
  {
    id: 'c0000000-0000-0000-0000-000000000002',
    organization_id: 'a0000000-0000-0000-0000-000000000001',
    team_id: 't0000000-0000-0000-0000-000000000002',
    team_name: 'Team Beta',
    conversation_type: 'DIRECT',
    participantIds: [
      'u0000000-0000-0000-0000-000000000006', // Rohit
      'u0000000-0000-0000-0000-000000000007', // Neha
    ],
    last_message: 'Yes Rohit, all test criteria are looking solid.',
    last_message_sender_id: 'u0000000-0000-0000-0000-000000000007',
    last_message_at: '2026-09-09T09:30:00.000Z',
    created_at: '2026-09-09T09:00:00.000Z',
    updated_at: '2026-09-09T09:30:00.000Z',
  },
];

export const INITIAL_MESSAGES: Record<string, Message[]> = {
  'c0000000-0000-0000-0000-000000000001': [
    {
      id: 'm0000000-0000-0000-0000-000000000001',
      conversation_id: 'c0000000-0000-0000-0000-000000000001',
      sender_id: 'u0000000-0000-0000-0000-000000000003',
      sender_name: 'Rahul Sharma',
      sender_username: 'rahul',
      message: 'Hi Amit, how is the project going?',
      created_at: '2026-09-09T10:00:00.000Z',
      read_by: ['u0000000-0000-0000-0000-000000000003', 'u0000000-0000-0000-0000-000000000004'],
    },
    {
      id: 'm0000000-0000-0000-0000-000000000002',
      conversation_id: 'c0000000-0000-0000-0000-000000000001',
      sender_id: 'u0000000-0000-0000-0000-000000000004',
      sender_name: 'Amit Patel',
      sender_username: 'amit',
      message: 'Everything is on track. Working on the PostgreSQL RLS schemas.',
      created_at: '2026-09-09T10:05:00.000Z',
      read_by: ['u0000000-0000-0000-0000-000000000003', 'u0000000-0000-0000-0000-000000000004'],
    },
  ],
  'c0000000-0000-0000-0000-000000000002': [
    {
      id: 'm0000000-0000-0000-0000-000000000003',
      conversation_id: 'c0000000-0000-0000-0000-000000000002',
      sender_id: 'u0000000-0000-0000-0000-000000000006',
      sender_name: 'Rohit Kumar',
      sender_username: 'rohit',
      message: 'Hi Neha, did you review the latest deployment checklist?',
      created_at: '2026-09-09T09:00:00.000Z',
      read_by: ['u0000000-0000-0000-0000-000000000006', 'u0000000-0000-0000-0000-000000000007'],
    },
    {
      id: 'm0000000-0000-0000-0000-000000000004',
      conversation_id: 'c0000000-0000-0000-0000-000000000002',
      sender_id: 'u0000000-0000-0000-0000-000000000007',
      sender_name: 'Neha Gupta',
      sender_username: 'neha',
      message: 'Yes Rohit, all test criteria are looking solid.',
      created_at: '2026-09-09T09:30:00.000Z',
      read_by: ['u0000000-0000-0000-0000-000000000006', 'u0000000-0000-0000-0000-000000000007'],
    },
  ],
};

export const INITIAL_AUDIT_LOGS: AuditLog[] = [
  {
    id: 'a0000000-0000-0000-0000-000000000001',
    organization_id: 'a0000000-0000-0000-0000-000000000001',
    actor_id: 'u0000000-0000-0000-0000-000000000001',
    actor_name: 'Alex Vance (Admin 1)',
    actor_role: 'ORGANIZATION_ADMIN',
    action: 'CREATE_TEAM',
    target_type: 'team',
    target_id: 't0000000-0000-0000-0000-000000000001',
    target_name: 'Team Alpha',
    details: { memberCount: 3, description: 'Core Engineering' },
    created_at: '2026-01-10T08:00:00.000Z',
  },
  {
    id: 'a0000000-0000-0000-0000-000000000002',
    organization_id: 'a0000000-0000-0000-0000-000000000001',
    actor_id: 'u0000000-0000-0000-0000-000000000001',
    actor_name: 'Alex Vance (Admin 1)',
    actor_role: 'ORGANIZATION_ADMIN',
    action: 'VIEW_CONVERSATION',
    target_type: 'conversation',
    target_id: 'c0000000-0000-0000-0000-000000000001',
    target_name: 'Rahul <-> Amit (Team Alpha)',
    details: { reason: 'Authorized organizational audit' },
    created_at: '2026-09-09T10:15:00.000Z',
  },
];

const ORGS_KEY = 'ptcms_pg_orgs_v2';
const PROFILES_KEY = 'ptcms_pg_profiles_v2';
const PRIVATE_PROFILES_KEY = 'ptcms_pg_private_profiles_v2';
const TEAMS_KEY = 'ptcms_pg_teams_v2';
const CONVERSATIONS_KEY = 'ptcms_pg_conversations_v2';
const MESSAGES_KEY = 'ptcms_pg_messages_v2';
const AUDIT_LOGS_KEY = 'ptcms_pg_audit_logs_v2';
const SESSION_KEY = 'ptcms_pg_current_session_v2';

// In-memory store for Node / Vitest test environments
let memOrgs = [...INITIAL_ORGANIZATIONS];
let memProfiles = [...INITIAL_PROFILES];
let memPrivateProfiles = [...INITIAL_USER_PRIVATE_PROFILES];
let memTeams = [...INITIAL_TEAMS];
let memConversations = [...INITIAL_CONVERSATIONS];
let memMessages = { ...INITIAL_MESSAGES };
let memAuditLogs = [...INITIAL_AUDIT_LOGS];
let memSession: Profile | null = INITIAL_PROFILES[3];

class MockSupabaseService {
  private channel: BroadcastChannel | null = null;
  private listeners: Set<(event: string, data?: unknown) => void> = new Set();

  constructor() {
    if (typeof window !== 'undefined') {
      try {
        this.channel = new BroadcastChannel('ptcms_supabase_realtime_v2');
        this.channel.onmessage = (event) => {
          const { type, data } = event.data || {};
          this.notifyListeners(type, data);
        };
      } catch {
        // Fallback
      }

      window.addEventListener('storage', (e) => {
        if (e.key && e.key.startsWith('ptcms_pg_')) {
          this.notifyListeners('STORAGE_SYNC', { key: e.key });
        }
      });

      this.initializeDefaults();
      this.startCrossBrowserSync();
    }
  }

  private initializeDefaults() {
    if (typeof window === 'undefined') return;
    if (!localStorage.getItem(ORGS_KEY)) {
      localStorage.setItem(ORGS_KEY, JSON.stringify(INITIAL_ORGANIZATIONS));
    }
    if (!localStorage.getItem(PROFILES_KEY)) {
      localStorage.setItem(PROFILES_KEY, JSON.stringify(INITIAL_PROFILES));
    }
    if (!localStorage.getItem(PRIVATE_PROFILES_KEY)) {
      localStorage.setItem(PRIVATE_PROFILES_KEY, JSON.stringify(INITIAL_USER_PRIVATE_PROFILES));
    }
    if (!localStorage.getItem(TEAMS_KEY)) {
      localStorage.setItem(TEAMS_KEY, JSON.stringify(INITIAL_TEAMS));
    }
    if (!localStorage.getItem(CONVERSATIONS_KEY)) {
      localStorage.setItem(CONVERSATIONS_KEY, JSON.stringify(INITIAL_CONVERSATIONS));
    }
    if (!localStorage.getItem(MESSAGES_KEY)) {
      localStorage.setItem(MESSAGES_KEY, JSON.stringify(INITIAL_MESSAGES));
    }
    if (!localStorage.getItem(AUDIT_LOGS_KEY)) {
      localStorage.setItem(AUDIT_LOGS_KEY, JSON.stringify(INITIAL_AUDIT_LOGS));
    }
  }

  public resetToDefaults() {
    memOrgs = [...INITIAL_ORGANIZATIONS];
    memProfiles = [...INITIAL_PROFILES];
    memPrivateProfiles = [...INITIAL_USER_PRIVATE_PROFILES];
    memTeams = [...INITIAL_TEAMS];
    memConversations = [...INITIAL_CONVERSATIONS];
    memMessages = { ...INITIAL_MESSAGES };
    memAuditLogs = [...INITIAL_AUDIT_LOGS];
    memSession = INITIAL_PROFILES[3];

    if (typeof window !== 'undefined') {
      localStorage.setItem(ORGS_KEY, JSON.stringify(INITIAL_ORGANIZATIONS));
      localStorage.setItem(PROFILES_KEY, JSON.stringify(INITIAL_PROFILES));
      localStorage.setItem(PRIVATE_PROFILES_KEY, JSON.stringify(INITIAL_USER_PRIVATE_PROFILES));
      localStorage.setItem(TEAMS_KEY, JSON.stringify(INITIAL_TEAMS));
      localStorage.setItem(CONVERSATIONS_KEY, JSON.stringify(INITIAL_CONVERSATIONS));
      localStorage.setItem(MESSAGES_KEY, JSON.stringify(INITIAL_MESSAGES));
      localStorage.setItem(AUDIT_LOGS_KEY, JSON.stringify(INITIAL_AUDIT_LOGS));
    }
    this.broadcast('RESET_DATA');
  }

  public subscribe(callback: (event: string, data?: unknown) => void): () => void {
    this.listeners.add(callback);
    return () => {
      this.listeners.delete(callback);
    };
  }

  private broadcast(type: string, data?: unknown) {
    if (this.channel) {
      this.channel.postMessage({ type, data });
    }
    this.notifyListeners(type, data);
  }

  private notifyListeners(type: string, data?: unknown) {
    this.listeners.forEach((cb) => {
      try {
        cb(type, data);
      } catch (err) {
        console.error('Subscriber error in MockSupabase:', err);
      }
    });
  }

  // Session & Authentication
  public getCurrentUser(): Profile | null {
    if (typeof window === 'undefined') return memSession;
    try {
      const session = sessionStorage.getItem(SESSION_KEY);
      if (session) return JSON.parse(session);
      const local = localStorage.getItem(SESSION_KEY);
      if (local) return JSON.parse(local);
    } catch {
      // ignore
    }
    return memSession;
  }

  public setCurrentUser(profile: Profile | null) {
    memSession = profile;
    if (typeof window !== 'undefined') {
      if (profile) {
        sessionStorage.setItem(SESSION_KEY, JSON.stringify(profile));
        localStorage.setItem(SESSION_KEY, JSON.stringify(profile));
      } else {
        sessionStorage.removeItem(SESSION_KEY);
        localStorage.removeItem(SESSION_KEY);
      }
    }
    this.broadcast('USER_AUTH_CHANGE', profile);
  }

  // Organizations
  public getOrganizations(): Organization[] {
    if (typeof window === 'undefined') return memOrgs;
    try {
      const d = localStorage.getItem(ORGS_KEY);
      return d ? JSON.parse(d) : memOrgs;
    } catch {
      return memOrgs;
    }
  }

  public saveOrganization(org: Organization) {
    const orgs = this.getOrganizations();
    const idx = orgs.findIndex((o) => o.id === org.id);
    if (idx >= 0) orgs[idx] = org;
    else orgs.push(org);
    memOrgs = orgs;
    if (typeof window !== 'undefined') {
      localStorage.setItem(ORGS_KEY, JSON.stringify(orgs));
    }
    this.broadcast('ORGANIZATIONS_UPDATED', orgs);
  }

  // Profiles
  public getProfiles(): Profile[] {
    if (typeof window === 'undefined') return memProfiles;
    try {
      const d = localStorage.getItem(PROFILES_KEY);
      return d ? JSON.parse(d) : memProfiles;
    } catch {
      return memProfiles;
    }
  }

  public getProfileById(id: string): Profile | undefined {
    return this.getProfiles().find((p) => p.id === id);
  }

  public saveProfile(profile: Profile) {
    const profiles = this.getProfiles();
    const idx = profiles.findIndex((p) => p.id === profile.id);
    if (idx >= 0) profiles[idx] = profile;
    else profiles.push(profile);
    memProfiles = profiles;
    if (typeof window !== 'undefined') {
      localStorage.setItem(PROFILES_KEY, JSON.stringify(profiles));
    }
    this.broadcast('PROFILES_UPDATED', profiles);
  }

  // User Private Profiles
  public getPrivateProfile(userId: string): UserPrivateProfile | undefined {
    if (typeof window === 'undefined') return memPrivateProfiles.find((p) => p.user_id === userId);
    try {
      const d = localStorage.getItem(PRIVATE_PROFILES_KEY);
      const list: UserPrivateProfile[] = d ? JSON.parse(d) : memPrivateProfiles;
      return list.find((p) => p.user_id === userId);
    } catch {
      return undefined;
    }
  }

  // Teams
  public getTeams(): Team[] {
    if (typeof window === 'undefined') return memTeams;
    try {
      const d = localStorage.getItem(TEAMS_KEY);
      return d ? JSON.parse(d) : memTeams;
    } catch {
      return memTeams;
    }
  }

  public getTeamById(id: string): Team | undefined {
    return this.getTeams().find((t) => t.id === id);
  }

  public saveTeam(team: Team) {
    const teams = this.getTeams();
    const idx = teams.findIndex((t) => t.id === team.id);
    if (idx >= 0) teams[idx] = team;
    else teams.push(team);
    memTeams = teams;
    if (typeof window !== 'undefined') {
      localStorage.setItem(TEAMS_KEY, JSON.stringify(teams));
    }
    this.broadcast('TEAMS_UPDATED', teams);
  }

  public deleteTeam(teamId: string) {
    let teams = this.getTeams();
    teams = teams.filter((t) => t.id !== teamId);
    memTeams = teams;
    if (typeof window !== 'undefined') {
      localStorage.setItem(TEAMS_KEY, JSON.stringify(teams));
    }
    this.broadcast('TEAMS_UPDATED', teams);
  }

  // Conversations
  public getConversations(): Conversation[] {
    if (typeof window === 'undefined') return memConversations;
    try {
      const d = localStorage.getItem(CONVERSATIONS_KEY);
      return d ? JSON.parse(d) : memConversations;
    } catch {
      return memConversations;
    }
  }

  public getConversationById(id: string): Conversation | undefined {
    return this.getConversations().find((c) => c.id === id);
  }

  public findOrCreateConversation(orgId: string, teamId: string, user1Id: string, user2Id: string): Conversation {
    const convs = this.getConversations();
    const sorted = [user1Id, user2Id].sort();
    const deterministicId = `c_${teamId.replace(/[^a-zA-Z0-9]/g, '')}_${sorted[0].replace(/[^a-zA-Z0-9]/g, '')}_${sorted[1].replace(/[^a-zA-Z0-9]/g, '')}`;

    const existing = convs.find(
      (c) =>
        c.id === deterministicId ||
        (c.team_id === teamId &&
          c.participantIds.includes(user1Id) &&
          c.participantIds.includes(user2Id))
    );
    if (existing) {
      if (existing.id !== deterministicId && !existing.id.startsWith('c0000000')) {
        existing.id = deterministicId;
      }
      return existing;
    }

    const team = this.getTeams().find((t) => t.id === teamId);
    const newConv: Conversation = {
      id: deterministicId,
      organization_id: orgId,
      team_id: teamId,
      team_name: team?.name || 'Team Chat',
      conversation_type: 'DIRECT',
      participantIds: [user1Id, user2Id],
      last_message: '',
      last_message_at: new Date().toISOString(),
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString(),
    };

    convs.unshift(newConv);
    memConversations = convs;
    if (typeof window !== 'undefined') {
      localStorage.setItem(CONVERSATIONS_KEY, JSON.stringify(convs));
      fetch('/api/sync', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ type: 'NEW_CONVERSATION', conversation: newConv }),
      }).catch(() => {});
    }
    this.broadcast('CONVERSATIONS_UPDATED', convs);
    return newConv;
  }

  // Messages
  public getMessages(convId: string): Message[] {
    if (typeof window === 'undefined') return memMessages[convId] || [];
    try {
      const d = localStorage.getItem(MESSAGES_KEY);
      const all = d ? JSON.parse(d) : memMessages;
      return all[convId] || [];
    } catch {
      return memMessages[convId] || [];
    }
  }

  public sendMessage(convId: string, senderId: string, text: string): Message {
    const sender = this.getProfileById(senderId);
    const msg: Message = {
      id: `m-${Date.now()}-${Math.random().toString(36).substring(2, 6)}`,
      conversation_id: convId,
      sender_id: senderId,
      sender_name: sender?.display_name || 'User',
      sender_username: sender?.username || 'user',
      message: text.trim(),
      created_at: new Date().toISOString(),
      read_by: [senderId],
    };

    let all: Record<string, Message[]> = memMessages;
    if (typeof window !== 'undefined') {
      try {
        const d = localStorage.getItem(MESSAGES_KEY);
        all = d ? JSON.parse(d) : memMessages;
      } catch {
        all = memMessages;
      }
    }

    if (!all[convId]) all[convId] = [];
    all[convId].push(msg);
    memMessages = all;
    if (typeof window !== 'undefined') {
      localStorage.setItem(MESSAGES_KEY, JSON.stringify(all));
      fetch('/api/sync', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ type: 'NEW_MESSAGE', message: msg }),
      }).catch(() => {});
    }

    // Update conversation last message
    const convs = this.getConversations();
    const idx = convs.findIndex((c) => c.id === convId);
    if (idx >= 0) {
      convs[idx].last_message = text.trim();
      convs[idx].last_message_sender_id = senderId;
      convs[idx].last_message_at = msg.created_at;
      convs[idx].updated_at = msg.created_at;
      memConversations = convs;
      if (typeof window !== 'undefined') {
        localStorage.setItem(CONVERSATIONS_KEY, JSON.stringify(convs));
        fetch('/api/sync', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ type: 'NEW_CONVERSATION', conversation: convs[idx] }),
        }).catch(() => {});
      }
    }

    this.broadcast('NEW_MESSAGE', { conversationId: convId, message: msg });
    this.broadcast('CONVERSATIONS_UPDATED', convs);
    return msg;
  }

  public markMessagesRead(convId: string, userId: string) {
    let all: Record<string, Message[]> = memMessages;
    if (typeof window !== 'undefined') {
      try {
        const d = localStorage.getItem(MESSAGES_KEY);
        all = d ? JSON.parse(d) : memMessages;
      } catch {
        all = memMessages;
      }
    }

    if (all[convId]) {
      let changed = false;
      all[convId].forEach((m: Message) => {
        if (!m.read_by.includes(userId)) {
          m.read_by.push(userId);
          changed = true;
        }
      });
      if (changed) {
        memMessages = all;
        if (typeof window !== 'undefined') {
          localStorage.setItem(MESSAGES_KEY, JSON.stringify(all));
          fetch('/api/sync', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ type: 'MARK_READ', convId, readerId: userId }),
          }).catch(() => {});
        }
        this.broadcast('MESSAGES_READ', { conversationId: convId, readerId: userId });
      }
    }
  }

  private startCrossBrowserSync() {
    if (typeof window === 'undefined') return;
    setInterval(async () => {
      try {
        const res = await fetch('/api/sync');
        if (!res.ok) return;
        const data = await res.json();
        const serverMessages: Record<string, Message[]> = data.messages || {};
        const serverConversations: Conversation[] = data.conversations || [];
        let messagesUpdated = false;
        let convsUpdated = false;

        // Sync messages
        let currentAll: Record<string, Message[]> = {};
        try {
          const d = localStorage.getItem(MESSAGES_KEY);
          currentAll = d ? JSON.parse(d) : { ...memMessages };
        } catch {
          currentAll = { ...memMessages };
        }

        for (const [cid, sMsgs] of Object.entries(serverMessages)) {
          if (!currentAll[cid]) currentAll[cid] = [];
          const localMsgs = currentAll[cid];
          for (const sm of sMsgs) {
            const existing = localMsgs.find((m) => m.id === sm.id);
            if (!existing) {
              localMsgs.push(sm);
              messagesUpdated = true;
              this.notifyListeners('NEW_MESSAGE', { conversationId: cid, message: sm });
            } else if (existing.read_by.length !== sm.read_by.length) {
              existing.read_by = sm.read_by;
              messagesUpdated = true;
            }
          }
        }

        if (messagesUpdated) {
          memMessages = currentAll;
          localStorage.setItem(MESSAGES_KEY, JSON.stringify(currentAll));
        }

        // Sync conversations
        const localConvs = this.getConversations();
        for (const sc of serverConversations) {
          const existing = localConvs.find((c) => c.id === sc.id);
          if (!existing) {
            localConvs.unshift(sc);
            convsUpdated = true;
          } else if (existing.last_message_at !== sc.last_message_at) {
            existing.last_message = sc.last_message;
            existing.last_message_at = sc.last_message_at;
            convsUpdated = true;
          }
        }

        if (convsUpdated) {
          memConversations = localConvs;
          localStorage.setItem(CONVERSATIONS_KEY, JSON.stringify(localConvs));
          this.notifyListeners('CONVERSATIONS_UPDATED', localConvs);
        }
      } catch {}
    }, 600);
  }

  // Audit Logs
  public getAuditLogs(): AuditLog[] {
    if (typeof window === 'undefined') return memAuditLogs;
    try {
      const d = localStorage.getItem(AUDIT_LOGS_KEY);
      return d ? JSON.parse(d) : memAuditLogs;
    } catch {
      return memAuditLogs;
    }
  }

  public addAuditLog(log: Omit<AuditLog, 'id' | 'created_at'>) {
    const logs = this.getAuditLogs();
    const item: AuditLog = {
      ...log,
      id: `a-${Date.now()}`,
      created_at: new Date().toISOString(),
    };
    logs.unshift(item);
    memAuditLogs = logs;
    if (typeof window !== 'undefined') {
      localStorage.setItem(AUDIT_LOGS_KEY, JSON.stringify(logs));
    }
    this.broadcast('AUDIT_LOGS_UPDATED', logs);
  }
}

export const mockSupabase = new MockSupabaseService();

