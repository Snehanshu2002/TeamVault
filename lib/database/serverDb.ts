import fs from 'fs';
import path from 'path';
import {
  Profile,
  Organization,
  Team,
  Conversation,
  Message,
  AuditLog,
  UserPrivateProfile,
} from '@/lib/types';
import {
  INITIAL_ORGANIZATIONS,
  INITIAL_PROFILES,
  INITIAL_USER_PRIVATE_PROFILES,
  INITIAL_TEAMS,
  INITIAL_CONVERSATIONS,
  INITIAL_MESSAGES,
  INITIAL_AUDIT_LOGS,
} from '@/lib/supabase/mockSupabase';

export interface DeviceLocation {
  userId: string;
  latitude: number;
  longitude: number;
  timestamp: string;
  accuracy?: number;
}

export interface DatabaseSchema {
  organizations: Organization[];
  profiles: Profile[];
  private_profiles: UserPrivateProfile[];
  teams: Team[];
  conversations: Conversation[];
  messages: Record<string, Message[]>;
  audit_logs: AuditLog[];
  device_tracking: DeviceLocation[];
  version: number;
  last_updated: string;
}

const DB_FILE = path.join(process.cwd(), 'data', 'teamvault_db.json');

class ServerDatabase {
  private cache: DatabaseSchema | null = null;

  constructor() {
    this.ensureDatabaseFile();
  }

  private ensureDatabaseFile(): DatabaseSchema {
    if (this.cache) return this.cache;

    const dataDir = path.dirname(DB_FILE);
    if (!fs.existsSync(dataDir)) {
      fs.mkdirSync(dataDir, { recursive: true });
    }

    if (fs.existsSync(DB_FILE)) {
      try {
        const raw = fs.readFileSync(DB_FILE, 'utf8');
        this.cache = JSON.parse(raw);
        return this.cache!;
      } catch (err) {
        console.warn('Failed to parse database file, re-initializing with seed data:', err);
      }
    }

    const initialDb: DatabaseSchema = {
      organizations: [...INITIAL_ORGANIZATIONS],
      profiles: [...INITIAL_PROFILES],
      private_profiles: [...INITIAL_USER_PRIVATE_PROFILES],
      teams: [...INITIAL_TEAMS],
      conversations: [...INITIAL_CONVERSATIONS],
      messages: { ...INITIAL_MESSAGES },
      audit_logs: [...INITIAL_AUDIT_LOGS],
      device_tracking: [],
      version: 1,
      last_updated: new Date().toISOString(),
    };

    this.cache = initialDb;
    this.persist();
    return initialDb;
  }

  private persist() {
    if (!this.cache) return;
    try {
      this.cache.last_updated = new Date().toISOString();
      fs.writeFileSync(DB_FILE, JSON.stringify(this.cache, null, 2), 'utf8');
    } catch (err) {
      console.error('Failed to write database to disk:', err);
    }
  }

  public getProfiles(): Profile[] {
    const db = this.ensureDatabaseFile();
    return db.profiles;
  }

  public getProfileById(id: string): Profile | undefined {
    return this.getProfiles().find((p) => p.id === id);
  }

  public saveProfile(profile: Profile): Profile {
    const db = this.ensureDatabaseFile();
    const idx = db.profiles.findIndex((p) => p.id === profile.id);
    if (idx >= 0) {
      db.profiles[idx] = { ...profile, updated_at: new Date().toISOString() };
    } else {
      db.profiles.push(profile);
    }
    this.persist();
    return profile;
  }

  public deleteProfile(id: string): boolean {
    const db = this.ensureDatabaseFile();
    const initialLen = db.profiles.length;
    db.profiles = db.profiles.filter((p) => p.id !== id);
    if (db.profiles.length !== initialLen) {
      this.persist();
      return true;
    }
    return false;
  }

  public getOrganizations(): Organization[] {
    const db = this.ensureDatabaseFile();
    return db.organizations;
  }

  public saveOrganization(org: Organization): Organization {
    const db = this.ensureDatabaseFile();
    const idx = db.organizations.findIndex((o) => o.id === org.id);
    if (idx >= 0) {
      db.organizations[idx] = org;
    } else {
      db.organizations.push(org);
    }
    this.persist();
    return org;
  }

  public getTeams(): Team[] {
    const db = this.ensureDatabaseFile();
    return db.teams;
  }

  public getTeamById(id: string): Team | undefined {
    return this.getTeams().find((t) => t.id === id);
  }

  public saveTeam(team: Team): Team {
    const db = this.ensureDatabaseFile();
    const idx = db.teams.findIndex((t) => t.id === team.id);
    if (idx >= 0) {
      db.teams[idx] = { ...team, updated_at: new Date().toISOString() };
    } else {
      db.teams.push(team);
    }
    this.persist();
    return team;
  }

  public getConversations(): Conversation[] {
    const db = this.ensureDatabaseFile();
    return db.conversations;
  }

  public saveConversation(conv: Conversation): Conversation {
    const db = this.ensureDatabaseFile();
    const idx = db.conversations.findIndex((c) => c.id === conv.id);
    if (idx >= 0) {
      db.conversations[idx] = conv;
    } else {
      db.conversations.unshift(conv);
    }
    this.persist();
    return conv;
  }

  public getMessages(convId: string): Message[] {
    const db = this.ensureDatabaseFile();
    return db.messages[convId] || [];
  }

  public getAllMessagesMap(): Record<string, Message[]> {
    const db = this.ensureDatabaseFile();
    return db.messages;
  }

  public saveMessage(convId: string, message: Message): Message {
    const db = this.ensureDatabaseFile();
    if (!db.messages[convId]) {
      db.messages[convId] = [];
    }
    const list = db.messages[convId];
    const idx = list.findIndex((m) => m.id === message.id);
    if (idx >= 0) {
      list[idx] = message;
    } else {
      list.push(message);
    }

    const cIdx = db.conversations.findIndex((c) => c.id === convId);
    if (cIdx >= 0) {
      db.conversations[cIdx].last_message = message.message;
      db.conversations[cIdx].last_message_sender_id = message.sender_id;
      db.conversations[cIdx].last_message_at = message.created_at;
      db.conversations[cIdx].updated_at = message.created_at;
    }

    this.persist();
    return message;
  }

  public markMessagesRead(convId: string, readerId: string): void {
    const db = this.ensureDatabaseFile();
    const list = db.messages[convId];
    if (list) {
      let changed = false;
      list.forEach((m) => {
        if (!m.read_by.includes(readerId)) {
          m.read_by.push(readerId);
          changed = true;
        }
      });
      if (changed) {
        this.persist();
      }
    }
  }

  public getAuditLogs(): AuditLog[] {
    const db = this.ensureDatabaseFile();
    return db.audit_logs;
  }

  public addAuditLog(log: Omit<AuditLog, 'id' | 'created_at'>): AuditLog {
    const db = this.ensureDatabaseFile();
    const newLog: AuditLog = {
      ...log,
      id: 'a-' + Date.now() + '-' + Math.random().toString(36).substring(2, 6),
      created_at: new Date().toISOString(),
    };
    db.audit_logs.unshift(newLog);
    this.persist();
    return newLog;
  }

  public getDeviceTracking(): DeviceLocation[] {
    const db = this.ensureDatabaseFile();
    return db.device_tracking;
  }

  public saveDeviceTracking(data: DeviceLocation[]): void {
    const db = this.ensureDatabaseFile();
    db.device_tracking = data;
    this.persist();
  }
}

export const serverDb = new ServerDatabase();