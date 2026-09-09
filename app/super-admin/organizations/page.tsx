'use client';

import React, { useState } from 'react';
import { DashboardLayout } from '@/components/dashboard/DashboardLayout';
import { useAuth } from '@/lib/hooks/useAuth';
import { OrgService } from '@/lib/services/orgService';
import { Organization } from '@/lib/types';
import { Modal } from '@/components/ui/modal';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Building, Plus, Ban, CheckCircle, Search, ShieldCheck } from 'lucide-react';
import { format, parseISO } from 'date-fns';

export default function SuperAdminOrganizationsPage() {
  const { user } = useAuth();
  const [orgs, setOrgs] = useState<Organization[]>(OrgService.getOrganizations());
  const [createModalOpen, setCreateModalOpen] = useState(false);
  const [name, setName] = useState('');
  const [slug, setSlug] = useState('');
  const [error, setError] = useState('');
  const [search, setSearch] = useState('');

  const handleCreate = (e: React.FormEvent) => {
    e.preventDefault();
    if (!user) return;
    if (!name.trim() || !slug.trim()) {
      setError('Organization name and slug are required');
      return;
    }

    try {
      OrgService.createOrganization(name, slug, user);
      setOrgs(OrgService.getOrganizations());
      setName('');
      setSlug('');
      setError('');
      setCreateModalOpen(false);
    } catch (err: any) {
      setError(err.message || 'Error creating organization');
    }
  };

  const handleToggleStatus = (orgId: string) => {
    if (!user) return;
    try {
      OrgService.toggleOrgStatus(orgId, user);
      setOrgs(OrgService.getOrganizations());
    } catch (err: any) {
      alert(err.message);
    }
  };

  const filteredOrgs = orgs.filter(
    (o) =>
      o.name.toLowerCase().includes(search.toLowerCase()) ||
      o.slug.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <DashboardLayout allowedRoles={['PLATFORM_SUPER_ADMIN']}>
      <div className="space-y-6">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
          <div>
            <h1 className="text-2xl font-black text-slate-900 tracking-tight flex items-center gap-2.5">
              <Building className="w-6 h-6 text-rose-600" />
              <span>Multi-Tenant Organizations</span>
            </h1>
            <p className="text-xs text-slate-500 mt-1">
              Super administrator tenant governance. Create organizations and manage strict database RLS boundaries.
            </p>
          </div>

          <Button
            onClick={() => setCreateModalOpen(true)}
            className="flex items-center gap-2 bg-rose-600 hover:bg-rose-700 text-white"
          >
            <Plus className="w-4 h-4" />
            <span>Create Organization</span>
          </Button>
        </div>

        {/* Organizations Table */}
        <div className="bg-white border border-slate-200 rounded-2xl overflow-hidden shadow-xs">
          <div className="p-4 border-b border-slate-100 flex items-center justify-between">
            <div className="relative w-full sm:w-72">
              <Search className="w-4 h-4 absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400" />
              <input
                type="text"
                placeholder="Search organizations..."
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                className="w-full pl-9 pr-4 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs text-slate-900 placeholder-slate-400 focus:outline-none focus:bg-white focus:border-rose-500 transition-colors"
              />
            </div>
            <span className="text-xs font-semibold text-slate-500">
              {filteredOrgs.length} Tenant(s)
            </span>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs text-slate-600">
              <thead className="bg-slate-50 border-b border-slate-100 text-[11px] font-bold uppercase tracking-wider text-slate-500">
                <tr>
                  <th className="py-3 px-4">Organization</th>
                  <th className="py-3 px-4">Slug (Tenant Key)</th>
                  <th className="py-3 px-4">Status</th>
                  <th className="py-3 px-4">Created Date</th>
                  <th className="py-3 px-4 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {filteredOrgs.map((org) => (
                  <tr key={org.id} className="hover:bg-slate-50/60 transition-colors">
                    <td className="py-3 px-4">
                      <div className="flex items-center gap-2.5">
                        <div className="w-8 h-8 rounded-xl bg-rose-50 text-rose-700 font-bold flex items-center justify-center text-xs border border-rose-200">
                          {org.name.charAt(0)}
                        </div>
                        <div>
                          <span className="font-bold text-slate-900 block">{org.name}</span>
                          <span className="text-[10px] text-slate-400 font-mono">ID: {org.id}</span>
                        </div>
                      </div>
                    </td>
                    <td className="py-3 px-4 font-mono font-semibold text-indigo-600">
                      {org.slug}
                    </td>
                    <td className="py-3 px-4">
                      <Badge variant={org.status === 'active' ? 'success' : 'danger'} dot>
                        {org.status === 'active' ? 'Active' : 'Suspended'}
                      </Badge>
                    </td>
                    <td className="py-3 px-4 text-slate-500">
                      {format(parseISO(org.created_at), 'MMM d, yyyy')}
                    </td>
                    <td className="py-3 px-4 text-right">
                      <Button
                        size="sm"
                        variant="ghost"
                        onClick={() => handleToggleStatus(org.id)}
                        className={`text-xs cursor-pointer ${
                          org.status === 'active' ? 'text-rose-600 hover:bg-rose-50' : 'text-emerald-600 hover:bg-emerald-50'
                        }`}
                      >
                        {org.status === 'active' ? (
                          <>
                            <Ban className="w-3.5 h-3.5" />
                            <span>Suspend</span>
                          </>
                        ) : (
                          <>
                            <CheckCircle className="w-3.5 h-3.5" />
                            <span>Activate</span>
                          </>
                        )}
                      </Button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        {/* Create Modal */}
        <Modal
          isOpen={createModalOpen}
          onClose={() => setCreateModalOpen(false)}
          title="Create New Organization"
          description="Provision a new isolated tenant in the multi-tenant architecture."
          maxWidth="md"
        >
          <form onSubmit={handleCreate} className="space-y-4">
            {error && <p className="text-xs text-rose-600">{error}</p>}
            <Input
              label="Organization Name"
              placeholder="e.g. Wayne Enterprises"
              value={name}
              onChange={(e) => {
                setName(e.target.value);
                setSlug(e.target.value.toLowerCase().replace(/[^a-z0-9]/g, '-'));
              }}
              required
            />
            <Input
              label="Slug / Identifier"
              placeholder="wayne-enterprises"
              value={slug}
              onChange={(e) => setSlug(e.target.value)}
              required
            />
            <div className="flex justify-end gap-2 pt-3 border-t border-slate-100">
              <Button type="button" variant="secondary" onClick={() => setCreateModalOpen(false)}>
                Cancel
              </Button>
              <Button type="submit" className="bg-rose-600 hover:bg-rose-700">
                Create Organization
              </Button>
            </div>
          </form>
        </Modal>
      </div>
    </DashboardLayout>
  );
}
