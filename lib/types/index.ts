export type UserRole = 'PLATFORM_SUPER_ADMIN' | 'ORGANIZATION_ADMIN' | 'USER';

export interface Organization {
  id: string;
  name: string;
  slug: string;
  logo_url?: string | null;
  status: 'active' | 'suspended' | 'archived';
  created_at: string;
  updated_at: string;
}

export interface Profile {
  id: string;
  organization_id: string;
  username: string;
  display_name: string;
  email: string;
  avatar_url?: string | null;
  role: UserRole;
  status: 'active' | 'disabled';
  created_at: string;
  updated_at: string;
  isOnline?: boolean;
}

/**
 * Public-Safe Profile returned to fellow team members.
 * Strictly omits email, phone, address, and private metadata at database & service levels.
 */
export interface PublicProfile {
  id: string;
  organization_id: string;
  username: string;
  display_name: string;
  avatar_url?: string | null;
  status: 'active' | 'disabled';
  isOnline?: boolean;
  assignedTeamIds?: string[];
}

export interface UserPrivateProfile {
  id: string;
  user_id: string;
  phone?: string | null;
  address?: string | null;
  metadata?: Record<string, any>;
  created_at: string;
  updated_at: string;
}

export interface OrganizationMember {
  id: string;
  organization_id: string;
  user_id: string;
  role: 'ORGANIZATION_ADMIN' | 'USER';
  status: 'active' | 'disabled';
  created_at: string;
}

export interface Team {
  id: string;
  organization_id: string;
  name: string;
  description?: string | null;
  status: 'active' | 'archived' | 'disabled';
  created_by?: string | null;
  adminName?: string;
  memberIds?: string[];
  memberCount?: number;
  created_at: string;
  updated_at: string;
}

export interface TeamMember {
  id: string;
  team_id: string;
  user_id: string;
  joined_at: string;
}

export interface Conversation {
  id: string;
  organization_id: string;
  team_id: string;
  team_name?: string;
  conversation_type: 'DIRECT' | 'GROUP';
  participantIds: string[];
  last_message?: string;
  last_message_sender_id?: string;
  last_message_at: string;
  created_at: string;
  updated_at: string;
  unreadCount?: number;
}

export interface ConversationParticipant {
  id: string;
  conversation_id: string;
  user_id: string;
  joined_at: string;
}

export interface Message {
  id: string;
  conversation_id: string;
  sender_id: string;
  sender_name?: string;
  sender_username?: string;
  message: string;
  created_at: string;
  edited_at?: string | null;
  deleted_at?: string | null;
  read_by: string[];
}

export interface MessageRead {
  id: string;
  message_id: string;
  user_id: string;
  read_at: string;
}

export interface AuditLog {
  id: string;
  organization_id: string;
  actor_id: string;
  actor_name: string;
  actor_role: UserRole;
  action: string;
  target_type: string;
  target_id?: string | null;
  target_name?: string | null;
  details?: Record<string, any> | null;
  created_at: string;
}

export interface Notification {
  id: string;
  organization_id: string;
  user_id: string;
  type: string;
  title: string;
  message: string;
  read_at?: string | null;
  created_at: string;
}

export interface DemoPersona {
  uid: string;
  name: string;
  username: string;
  email: string;
  role: UserRole;
  organizationName: string;
  teamNames: string[];
  description: string;
  avatarColor: string;
}
