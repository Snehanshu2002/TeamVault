import { Organization, Profile } from '@/lib/types';
import { mockSupabase } from '@/lib/supabase/mockSupabase';

export class OrgService {
  public static getOrganizations(): Organization[] {
    return mockSupabase.getOrganizations();
  }

  public static getOrgById(id: string): Organization | undefined {
    return mockSupabase.getOrganizations().find((o) => o.id === id);
  }

  public static createOrganization(name: string, slug: string, actor: Profile): Organization {
    const newOrg: Organization = {
      id: `a-${Date.now()}`,
      name: name.trim(),
      slug: slug.trim().toLowerCase(),
      status: 'active',
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString(),
    };

    mockSupabase.saveOrganization(newOrg);

    mockSupabase.addAuditLog({
      organization_id: newOrg.id,
      actor_id: actor.id,
      actor_name: actor.display_name,
      actor_role: actor.role,
      action: 'CREATE_ORGANIZATION',
      target_type: 'organization',
      target_id: newOrg.id,
      target_name: newOrg.name,
      details: { slug: newOrg.slug },
    });

    return newOrg;
  }

  public static toggleOrgStatus(orgId: string, actor: Profile): Organization {
    const org = this.getOrgById(orgId);
    if (!org) throw new Error('Organization not found');

    const newStatus = org.status === 'active' ? 'suspended' : 'active';
    const updated: Organization = {
      ...org,
      status: newStatus,
      updated_at: new Date().toISOString(),
    };

    mockSupabase.saveOrganization(updated);

    mockSupabase.addAuditLog({
      organization_id: org.id,
      actor_id: actor.id,
      actor_name: actor.display_name,
      actor_role: actor.role,
      action: newStatus === 'suspended' ? 'SUSPEND_ORGANIZATION' : 'ACTIVATE_ORGANIZATION',
      target_type: 'organization',
      target_id: org.id,
      target_name: org.name,
      details: { newStatus },
    });

    return updated;
  }
}
