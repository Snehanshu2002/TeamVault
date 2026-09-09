import { UserSession, ActivityEvent, Profile, UserRole } from '@/lib/types';
import { mockSupabase } from '@/lib/supabase/mockSupabase';

const SESSIONS_KEY = 'ptcms_user_sessions_v1';
const ACTIVITY_EVENTS_KEY = 'ptcms_activity_events_v1';

export const INITIAL_SESSIONS: UserSession[] = [
  {
    id: 'sess-001',
    user_id: 'u0000000-0000-0000-0000-000000000003', // Rahul
    user_name: 'Rahul Sharma',
    user_handle: 'rahul',
    role: 'USER',
    organization_id: 'a0000000-0000-0000-0000-000000000001',
    organization_name: 'Acme Corporation',
    team_names: ['Team Alpha'],
    device_type: 'Laptop / Desktop',
    os: 'Windows 11 Pro (64-bit)',
    browser: 'Chrome 124.0.0 (Windows)',
    screen_resolution: '1920x1080 (FHD)',
    ip_address: '192.168.1.103 (Internal)',
    network_type: 'Corporate LAN',
    location: 'Building A, Tech Park (New Delhi, IN)',
    latitude: 28.6139,
    longitude: 77.2090,
    city: 'New Delhi',
    region: 'Delhi NCR',
    country: 'India',
    postal_code: '110001',
    isp_provider: 'Airtel Enterprise Fiber (1 Gbps)',
    connection_speed: '940 Mbps / 890 Mbps',
    status: 'ONLINE',
    last_heartbeat: new Date().toISOString(),
    session_started_at: '2026-09-09T09:00:00.000Z',
    active_window_title: 'Team Alpha • Chat with Amit Patel',
    daily_messages_sent: 14,
  },
  {
    id: 'sess-002',
    user_id: 'u0000000-0000-0000-0000-000000000004', // Amit
    user_name: 'Amit Patel',
    user_handle: 'amit',
    role: 'USER',
    organization_id: 'a0000000-0000-0000-0000-000000000001',
    organization_name: 'Acme Corporation',
    team_names: ['Team Alpha'],
    device_type: 'Laptop / Desktop',
    os: 'Windows 11 Home (64-bit)',
    browser: 'Chrome 124.0.0 (Windows)',
    screen_resolution: '1920x1080 (FHD)',
    ip_address: '192.168.1.104 (Internal)',
    network_type: 'Corporate LAN',
    location: 'Building A, Tech Park (New Delhi, IN)',
    latitude: 28.6139,
    longitude: 77.2090,
    city: 'New Delhi',
    region: 'Delhi NCR',
    country: 'India',
    postal_code: '110001',
    isp_provider: 'Airtel Enterprise Fiber (1 Gbps)',
    connection_speed: '920 Mbps / 860 Mbps',
    status: 'ONLINE',
    last_heartbeat: new Date().toISOString(),
    session_started_at: '2026-09-09T09:15:00.000Z',
    active_window_title: 'Team Alpha • Chat with Rahul Sharma',
    daily_messages_sent: 12,
  },
  {
    id: 'sess-003',
    user_id: 'u0000000-0000-0000-0000-000000000005', // Priya
    user_name: 'Priya Singh',
    user_handle: 'priya',
    role: 'USER',
    organization_id: 'a0000000-0000-0000-0000-000000000001',
    organization_name: 'Acme Corporation',
    team_names: ['Team Alpha'],
    device_type: 'Laptop / Desktop',
    os: 'macOS Sonoma 14.4 (Apple Silicon M3)',
    browser: 'Safari 17.4 (macOS)',
    screen_resolution: '2560x1600 (Retina)',
    ip_address: '10.8.0.44 (Secured Gateway)',
    network_type: 'Remote VPN',
    location: 'Bandra Kurla Complex (Mumbai, IN)',
    latitude: 19.0760,
    longitude: 72.8777,
    city: 'Mumbai',
    region: 'Maharashtra',
    country: 'India',
    postal_code: '400051',
    isp_provider: 'Tata Communications Secured MPLS/VPN',
    connection_speed: '450 Mbps / 320 Mbps',
    status: 'IDLE',
    last_heartbeat: new Date(Date.now() - 1000 * 60 * 12).toISOString(),
    session_started_at: '2026-09-09T08:30:00.000Z',
    active_window_title: 'Team Alpha Workspace',
    daily_messages_sent: 8,
  },
  {
    id: 'sess-004',
    user_id: 'u0000000-0000-0000-0000-000000000006', // Rohit
    user_name: 'Rohit Kumar',
    user_handle: 'rohit',
    role: 'USER',
    organization_id: 'a0000000-0000-0000-0000-000000000001',
    organization_name: 'Acme Corporation',
    team_names: ['Team Beta'],
    device_type: 'Laptop / Desktop',
    os: 'Ubuntu 24.04 LTS (x86_64)',
    browser: 'Firefox 125.0 (Linux)',
    screen_resolution: '1920x1080 (FHD)',
    ip_address: '192.168.2.14 (Internal)',
    network_type: 'Corporate LAN',
    location: 'Electronic City, Tower 2 (Bangalore, IN)',
    latitude: 12.9716,
    longitude: 77.5946,
    city: 'Bangalore',
    region: 'Karnataka',
    country: 'India',
    postal_code: '560100',
    isp_provider: 'Jio Enterprise Dedicated Leased Line',
    connection_speed: '800 Mbps / 800 Mbps',
    status: 'ONLINE',
    last_heartbeat: new Date().toISOString(),
    session_started_at: '2026-09-09T09:45:00.000Z',
    active_window_title: 'Team Beta • Chat with Neha Gupta',
    daily_messages_sent: 19,
  },
  {
    id: 'sess-005',
    user_id: 'u0000000-0000-0000-0000-000000000007', // Neha
    user_name: 'Neha Gupta',
    user_handle: 'neha',
    role: 'USER',
    organization_id: 'a0000000-0000-0000-0000-000000000001',
    organization_name: 'Acme Corporation',
    team_names: ['Team Beta'],
    device_type: 'Laptop / Desktop',
    os: 'Windows 11 Pro (64-bit)',
    browser: 'Microsoft Edge 123.0',
    screen_resolution: '1920x1080 (FHD)',
    ip_address: '192.168.2.15 (Internal)',
    network_type: 'Corporate LAN',
    location: 'Electronic City, Tower 2 (Bangalore, IN)',
    latitude: 12.9716,
    longitude: 77.5946,
    city: 'Bangalore',
    region: 'Karnataka',
    country: 'India',
    postal_code: '560100',
    isp_provider: 'Jio Enterprise Dedicated Leased Line',
    connection_speed: '780 Mbps / 750 Mbps',
    status: 'ONLINE',
    last_heartbeat: new Date().toISOString(),
    session_started_at: '2026-09-09T10:00:00.000Z',
    active_window_title: 'Team Beta • Chat with Rohit Kumar',
    daily_messages_sent: 16,
  },
  {
    id: 'sess-006',
    user_id: 'u0000000-0000-0000-0000-000000000008', // Anita
    user_name: 'Anita Roy',
    user_handle: 'anita',
    role: 'USER',
    organization_id: 'a0000000-0000-0000-0000-000000000001',
    organization_name: 'Acme Corporation',
    team_names: ['Team Gamma'],
    device_type: 'Laptop / Desktop',
    os: 'Windows 10 Enterprise (64-bit)',
    browser: 'Chrome 124.0.0 (Windows)',
    screen_resolution: '1366x768 (HD)',
    ip_address: '10.8.0.92 (Secured Gateway)',
    network_type: 'Remote VPN',
    location: 'Salt Lake Sector V (Kolkata, IN)',
    latitude: 22.5726,
    longitude: 88.3639,
    city: 'Kolkata',
    region: 'West Bengal',
    country: 'India',
    postal_code: '700091',
    isp_provider: 'Vodafone Idea Enterprise VPN Gateway',
    connection_speed: '250 Mbps / 180 Mbps',
    status: 'ONLINE',
    last_heartbeat: new Date().toISOString(),
    session_started_at: '2026-09-09T08:50:00.000Z',
    active_window_title: 'Team Gamma Workspace',
    daily_messages_sent: 6,
  },
  {
    id: 'sess-007',
    user_id: 'u0000000-0000-0000-0000-000000000010', // Dana
    user_name: 'Dana White',
    user_handle: 'dana',
    role: 'USER',
    organization_id: 'a0000000-0000-0000-0000-000000000002',
    organization_name: 'Globex International',
    team_names: ['Globex Core'],
    device_type: 'Laptop / Desktop',
    os: 'macOS Sonoma 14.4 (MacBook Pro)',
    browser: 'Chrome 124.0.0 (macOS)',
    screen_resolution: '1728x1117',
    ip_address: '10.4.0.12 (Globex Gateway)',
    network_type: 'Corporate LAN',
    location: 'Canary Wharf Business Hub (London, UK)',
    latitude: 51.5074,
    longitude: -0.1278,
    city: 'London',
    region: 'Greater London',
    country: 'United Kingdom',
    postal_code: 'E14 5AA',
    isp_provider: 'British Telecom Direct Optical Fiber',
    connection_speed: '1.2 Gbps / 1.0 Gbps',
    status: 'ONLINE',
    last_heartbeat: new Date().toISOString(),
    session_started_at: '2026-09-09T10:30:00.000Z',
    active_window_title: 'Globex Core Workspace',
    daily_messages_sent: 7,
  },
];

export const INITIAL_ACTIVITY_LOGS: ActivityEvent[] = [
  {
    id: 'act-1',
    organization_id: 'a0000000-0000-0000-0000-000000000001',
    user_id: 'u0000000-0000-0000-0000-000000000003',
    user_name: 'Rahul Sharma',
    user_handle: 'rahul',
    event_type: 'MESSAGE_SENT',
    description: 'Dispatched message in Team Alpha private chat',
    timestamp: new Date(Date.now() - 1000 * 60 * 2).toISOString(),
    ip_address: '192.168.1.103',
    device_info: 'Windows 11 • Chrome 124',
  },
  {
    id: 'act-2',
    organization_id: 'a0000000-0000-0000-0000-000000000001',
    user_id: 'u0000000-0000-0000-0000-000000000004',
    user_name: 'Amit Patel',
    user_handle: 'amit',
    event_type: 'MESSAGE_SENT',
    description: 'Replied to message in Team Alpha private chat',
    timestamp: new Date(Date.now() - 1000 * 60 * 4).toISOString(),
    ip_address: '192.168.1.104',
    device_info: 'Windows 11 • Chrome 124',
  },
  {
    id: 'act-3',
    organization_id: 'a0000000-0000-0000-0000-000000000001',
    user_id: 'u0000000-0000-0000-0000-000000000006',
    user_name: 'Rohit Kumar',
    user_handle: 'rohit',
    event_type: 'TAB_ACTIVE',
    description: 'Focused Team Beta communication window',
    timestamp: new Date(Date.now() - 1000 * 60 * 7).toISOString(),
    ip_address: '192.168.2.14',
    device_info: 'Ubuntu Linux 24 • Firefox 125',
  },
  {
    id: 'act-4',
    organization_id: 'a0000000-0000-0000-0000-000000000001',
    user_id: 'u0000000-0000-0000-0000-000000000005',
    user_name: 'Priya Singh',
    user_handle: 'priya',
    event_type: 'TAB_IDLE',
    description: 'Window became idle (inactive for > 10m)',
    timestamp: new Date(Date.now() - 1000 * 60 * 12).toISOString(),
    ip_address: '10.8.0.44',
    device_info: 'macOS Sonoma • Safari 17',
  },
  {
    id: 'act-5',
    organization_id: 'a0000000-0000-0000-0000-000000000001',
    user_id: 'u0000000-0000-0000-0000-000000000003',
    user_name: 'Rahul Sharma',
    user_handle: 'rahul',
    event_type: 'DEVICE_CONNECTED',
    description: 'Authenticated session started on Work Laptop',
    timestamp: '2026-09-09T09:00:00.000Z',
    ip_address: '192.168.1.103',
    device_info: 'Windows 11 Pro • Chrome 124',
  },
];

let memSessions = [...INITIAL_SESSIONS];
let memActivityLogs = [...INITIAL_ACTIVITY_LOGS];

export class TrackingService {
  /**
   * Returns active sessions scoped by user role & organization.
   */
  public static getSessions(viewer: Profile | null): UserSession[] {
    if (!viewer) return [];

    let sessions = memSessions;
    if (typeof window !== 'undefined') {
      try {
        const stored = localStorage.getItem(SESSIONS_KEY);
        if (stored) sessions = JSON.parse(stored);
      } catch {
        sessions = memSessions;
      }
    }

    if (viewer.role === 'PLATFORM_SUPER_ADMIN') {
      return sessions;
    }

    if (viewer.role === 'ORGANIZATION_ADMIN') {
      return sessions.filter((s) => s.organization_id === viewer.organization_id);
    }

    // Regular users can only see own session
    return sessions.filter((s) => s.user_id === viewer.id);
  }

  /**
   * Returns real-time activity events scoped by user role & organization.
   */
  public static getActivityLogs(viewer: Profile | null): ActivityEvent[] {
    if (!viewer) return [];

    let logs = memActivityLogs;
    if (typeof window !== 'undefined') {
      try {
        const stored = localStorage.getItem(ACTIVITY_EVENTS_KEY);
        if (stored) logs = JSON.parse(stored);
      } catch {
        logs = memActivityLogs;
      }
    }

    if (viewer.role === 'PLATFORM_SUPER_ADMIN') {
      return logs;
    }

    if (viewer.role === 'ORGANIZATION_ADMIN') {
      return logs.filter((l) => l.organization_id === viewer.organization_id);
    }

    return [];
  }

  /**
   * Log an activity event in the real-time stream.
   */
  public static logActivity(
    user: Profile,
    eventType: ActivityEvent['event_type'],
    description: string
  ): void {
    const newEvent: ActivityEvent = {
      id: `act-${Date.now()}`,
      organization_id: user.organization_id,
      user_id: user.id,
      user_name: user.display_name,
      user_handle: user.username,
      event_type: eventType,
      description,
      timestamp: new Date().toISOString(),
      ip_address: '192.168.1.103',
      device_info: this.detectBrowserDeviceInfo(),
    };

    let allLogs = this.getActivityLogs(user);
    allLogs.unshift(newEvent);
    memActivityLogs = allLogs;

    if (typeof window !== 'undefined') {
      localStorage.setItem(ACTIVITY_EVENTS_KEY, JSON.stringify(allLogs));
    }
  }

  /**
   * Terminate / Revoke a user's active laptop session (Admin action).
   */
  public static terminateSession(sessionId: string, adminActor: Profile): void {
    let sessions = this.getSessions(adminActor);
    const target = sessions.find((s) => s.id === sessionId);
    if (!target) return;

    target.status = 'OFFLINE';
    target.last_heartbeat = new Date().toISOString();
    target.active_window_title = 'Session terminated by Administrator';

    memSessions = sessions;
    if (typeof window !== 'undefined') {
      localStorage.setItem(SESSIONS_KEY, JSON.stringify(sessions));
    }

    // Log in audit log and activity stream
    mockSupabase.addAuditLog({
      organization_id: target.organization_id,
      actor_id: adminActor.id,
      actor_name: adminActor.display_name,
      actor_role: adminActor.role,
      action: 'TERMINATE_SESSION',
      target_type: 'user_session',
      target_id: target.user_id,
      target_name: `${target.user_name} (@${target.user_handle})`,
      details: {
        sessionId,
        device: target.os,
        browser: target.browser,
        ip: target.ip_address,
      },
    });

    this.logActivity(
      adminActor,
      'SESSION_TERMINATED',
      `Terminated laptop session for ${target.user_name} (@${target.user_handle})`
    );
  }

  /**
   * Helper to detect local laptop / browser hardware info.
   */
  public static detectBrowserDeviceInfo(): string {
    if (typeof window === 'undefined') return 'Laptop Workstation (Desktop)';
    const ua = navigator.userAgent;
    let os = 'Windows 11';
    if (ua.includes('Macintosh') || ua.includes('Mac OS')) os = 'macOS';
    else if (ua.includes('Linux')) os = 'Linux';

    let browser = 'Chrome';
    if (ua.includes('Edg/')) browser = 'Edge';
    else if (ua.includes('Firefox/')) browser = 'Firefox';
    else if (ua.includes('Safari/') && !ua.includes('Chrome/')) browser = 'Safari';

    return `${os} • ${browser}`;
  }
}
