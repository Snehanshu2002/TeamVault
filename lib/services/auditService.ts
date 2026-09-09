import { AuditLog, Profile, UserRole } from '@/lib/types';
import { mockSupabase } from '@/lib/supabase/mockSupabase';

export class AuditService {
  public static logAction(
    actor: Profile,
    action: string,
    targetType: string,
    targetId?: string | null,
    targetName?: string | null,
    details?: Record<string, any> | null
  ): void {
    mockSupabase.addAuditLog({
      organization_id: actor.organization_id,
      actor_id: actor.id,
      actor_name: actor.display_name,
      actor_role: actor.role,
      action,
      target_type: targetType,
      target_id: targetId,
      target_name: targetName,
      details,
    });
  }

  public static getLogs(user: Profile | null): AuditLog[] {
    if (!user) return [];
    const all = mockSupabase.getAuditLogs();

    if (user.role === 'PLATFORM_SUPER_ADMIN') {
      return all;
    }

    if (user.role === 'ORGANIZATION_ADMIN') {
      return all.filter((l) => l.organization_id === user.organization_id);
    }

    return [];
  }
}
