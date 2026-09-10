import { Profile, UserRole, DemoPersona } from '@/lib/types';
import { mockSupabase, DEMO_PERSONAS } from '@/lib/supabase/mockSupabase';
import { createClient, isSupabaseConfigured } from '@/lib/supabase/client';

export class AuthService {
  public static getCurrentUser(): Profile | null {
    return mockSupabase.getCurrentUser();
  }

  public static switchPersona(personaUid: string): Profile | null {
    const persona = DEMO_PERSONAS.find(
      (p) => p.uid === personaUid || p.username.toLowerCase() === personaUid.toLowerCase() || p.email.toLowerCase() === personaUid.toLowerCase()
    );
    if (!persona) return null;

    let profile = mockSupabase.getProfileById(persona.uid);
    if (!profile) {
      profile = {
        id: persona.uid,
        organization_id: 'a0000000-0000-0000-0000-000000000001',
        username: persona.username,
        display_name: persona.name,
        email: persona.email,
        role: persona.role,
        status: 'active',
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString(),
        isOnline: true,
      };
      mockSupabase.saveProfile(profile);
    }

    mockSupabase.setCurrentUser(profile);
    return profile;
  }

  public static async login(email: string, pass: string): Promise<Profile> {
    const cleanEmail = email.trim().toLowerCase();

    // Supabase Live Auth check
    if (isSupabaseConfigured) {
      const supabase = createClient();
      if (supabase) {
        try {
          const { data, error } = await supabase.auth.signInWithPassword({
            email: cleanEmail,
            password: pass,
          });
          if (data?.user && !error) {
            const { data: profile } = await supabase
              .from('profiles')
              .select('*')
              .eq('id', data.user.id)
              .single();
            if (profile) {
              mockSupabase.setCurrentUser(profile);
              return profile;
            }
          }
        } catch (err) {
          console.warn('Supabase sign-in fallback to mock:', err);
        }
      }
    }

    // Mock engine lookup
    const profiles = mockSupabase.getProfiles();
    const found = profiles.find((p) => p.email.toLowerCase() === cleanEmail || p.username.toLowerCase() === cleanEmail);
    if (found) {
      if (found.status === 'disabled') {
        throw new Error('This account has been disabled by an administrator.');
      }
      mockSupabase.setCurrentUser(found);
      return found;
    }

    // Fallback persona match
    const persona = DEMO_PERSONAS.find((p) => p.email.toLowerCase() === cleanEmail || p.username.toLowerCase() === cleanEmail);
    if (persona) {
      const newProfile: Profile = {
        id: persona.uid,
        organization_id: 'a0000000-0000-0000-0000-000000000001',
        username: persona.username,
        display_name: persona.name,
        email: persona.email,
        role: persona.role,
        status: 'active',
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString(),
        isOnline: true,
      };
      mockSupabase.saveProfile(newProfile);
      mockSupabase.setCurrentUser(newProfile);
      return newProfile;
    }

    throw new Error('Invalid email or password. Please use a demo persona or register.');
  }

  public static async register(
    email: string,
    pass: string,
    displayName: string,
    username: string,
    role: UserRole = 'USER',
    orgId: string = 'a0000000-0000-0000-0000-000000000001'
  ): Promise<Profile> {
    const cleanEmail = email.trim().toLowerCase();
    const cleanUsername = username.trim().toLowerCase().replace(/[^a-z0-9_]/g, '');

    const profiles = mockSupabase.getProfiles();
    if (profiles.some((p) => p.email.toLowerCase() === cleanEmail)) {
      throw new Error('Email address already registered.');
    }
    if (profiles.some((p) => p.username.toLowerCase() === cleanUsername)) {
      throw new Error('Username handle already taken.');
    }

    const newProfile: Profile = {
      id: `u-${Date.now()}`,
      organization_id: orgId,
      username: cleanUsername,
      display_name: displayName.trim(),
      email: cleanEmail,
      role,
      status: 'active',
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString(),
      isOnline: true,
    };

    if (isSupabaseConfigured) {
      const supabase = createClient();
      if (supabase) {
        try {
          const { data } = await supabase.auth.signUp({
            email: cleanEmail,
            password: pass,
          });
          if (data?.user) {
            newProfile.id = data.user.id;
            await supabase.from('profiles').insert(newProfile);
          }
        } catch (err) {
          console.warn('Supabase sign-up fallback to mock:', err);
        }
      }
    }

    mockSupabase.saveProfile(newProfile);
    mockSupabase.setCurrentUser(newProfile);

    if (typeof window !== 'undefined') {
      fetch('/api/sync', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ type: 'NEW_PROFILE', profile: newProfile }),
      }).catch(() => {});

      fetch('/api/users', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          full_name: newProfile.display_name,
          username: newProfile.username,
          email: newProfile.email,
          role: newProfile.role,
          organization_id: newProfile.organization_id,
          created_by: 'self_registration',
        }),
      }).catch(() => {});
    }

    return newProfile;
  }

  public static async logout(): Promise<void> {
    if (isSupabaseConfigured) {
      const supabase = createClient();
      if (supabase) {
        await supabase.auth.signOut();
      }
    }
    mockSupabase.setCurrentUser(null);
  }

  public static getDashboardPathForRole(role: UserRole): string {
    switch (role) {
      case 'PLATFORM_SUPER_ADMIN':
        return '/super-admin';
      case 'ORGANIZATION_ADMIN':
        return '/admin';
      case 'USER':
      default:
        return '/user';
    }
  }
}
