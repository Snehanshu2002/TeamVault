import { Profile, PublicProfile, UserRole } from '@/lib/types';

export class PrivacyService {
  /**
   * Sanitizes a full Profile into a PublicProfile.
   * Strictly removes email, phone, address, and private metadata.
   */
  public static sanitizeProfile(profile: Profile): PublicProfile {
    return {
      id: profile.id,
      organization_id: profile.organization_id,
      username: profile.username,
      display_name: profile.display_name,
      avatar_url: profile.avatar_url,
      status: profile.status,
      isOnline: profile.isOnline,
    };
  }

  /**
   * Filters and sanitizes an array of profiles based on viewer role:
   * - PLATFORM_SUPER_ADMIN / ORGANIZATION_ADMIN: can view full Profile
   * - USER: strictly receives PublicProfile (no email/phone/metadata)
   */
  public static getVisibleProfiles(
    profiles: Profile[],
    viewerRole: UserRole
  ): (Profile | PublicProfile)[] {
    if (viewerRole === 'PLATFORM_SUPER_ADMIN' || viewerRole === 'ORGANIZATION_ADMIN') {
      return profiles;
    }
    return profiles.map((p) => this.sanitizeProfile(p));
  }
}
