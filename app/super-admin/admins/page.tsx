'use client';

import React, { useState } from 'react';
import { DashboardLayout } from '@/components/dashboard/DashboardLayout';
import { useAuth } from '@/lib/hooks/useAuth';
import { mockSupabase } from '@/lib/supabase/mockSupabase';
import { Profile } from '@/lib/types';
import { Modal } from '@/components/ui/modal';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { ShieldCheck, Plus, Ban, CheckCircle, Search, Edit3 } from 'lucide-react';

export default function SuperAdminAdminsPage() {
  const { user } = useAuth();
  const [users, setUsers] = useState<Profile[]>(mockSupabase.getProfiles());
  const [createModalOpen, setCreateModalOpen] = useState(false);
  const [search, setSearch] = useState('');

  // Form states
  const [name, setName] = useState('');
  const [username, setUsername] = useState('');
  const [email, setEmail] = useState('');
  const [error, setError] = useState('');

  const admins = users.filter((u) => u.role === 'ORGANIZATION_ADMIN');
  const filteredAdmins = admins.filter(
    (a) =>
      a.display_name.toLowerCase().includes(search.toLowerCase()) ||
      a.username.toLowerCase().includes(search.toLowerCase()) ||
      a.email.toLowerCase().includes(search.toLowerCase())
  );

  const handleCreateAdmin = (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim() || !username.trim() || !email.trim()) {
      setError('All fields are required');
      return;
    }

    const newAdmin: Profile = {
      id: `admin-${Date.now()}`,
      organization_id: user?.organization_id || 'org-acme-corp',
      display_name: name.trim(),
      username: username.trim().toLowerCase().replace(/[^a-z0-9_]/g, ''),
      email: email.trim().toLowerCase(),
      role: 'ORGANIZATION_ADMIN',
      status: 'active',
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString(),
      isOnline: true,
    };

    mockSupabase.saveProfile(newAdmin);
    setUsers(mockSupabase.getProfiles());
    setName('');
    setUsername('');
    setEmail('');
    setError('');
    setCreateModalOpen(false);
  };

  const toggleStatus = (id: string) => {
    const target = mockSupabase.getProfileById(id);
    if (!target) return;
    const newStatus = target.status === 'active' ? 'disabled' : 'active';
    mockSupabase.saveProfile({ ...target, status: newStatus });
    setUsers(mockSupabase.getProfiles());
  };

  return (
    <DashboardLayout allowedRoles={['PLATFORM_SUPER_ADMIN']}>
      <div className="space-y-6">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
          <div>
            <h1 className="text-2xl font-black text-slate-900 tracking-tight flex items-center gap-2.5">
              <ShieldCheck className="w-6 h-6 text-rose-600" />
              <span>Administrator Governance</span>
            </h1>
            <p className="text-xs text-slate-500 mt-1">
              Create, configure, and manage system administrators and their delegated oversight capabilities.
            </p>
          </div>

          <Button
            onClick={() => setCreateModalOpen(true)}
            className="flex items-center gap-2 bg-rose-600 hover:bg-rose-700 text-white"
          >
            <Plus className="w-4 h-4" />
            <span>Create New Admin</span>
          </Button>
        </div>

        {/* Admins Table */}
        <div className="bg-white border border-slate-200 rounded-2xl overflow-hidden shadow-xs">
          <div className="p-4 border-b border-slate-100 flex items-center justify-between">
            <div className="relative w-full sm:w-72">
              <Search className="w-4 h-4 absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400" />
              <input
                type="text"
                placeholder="Search admins..."
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                className="w-full pl-9 pr-4 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs text-slate-900 placeholder-slate-400 focus:outline-none focus:bg-white focus:border-rose-500 transition-colors"
              />
            </div>
            <span className="text-xs font-semibold text-slate-500">
              {filteredAdmins.length} Administrator(s)
            </span>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs text-slate-600">
              <thead className="bg-slate-50 border-b border-slate-100 text-[11px] font-bold uppercase tracking-wider text-slate-500">
                <tr>
                  <th className="py-3 px-4">Admin</th>
                  <th className="py-3 px-4">Username</th>
                  <th className="py-3 px-4">Email Address</th>
                  <th className="py-3 px-4">Status</th>
                  <th className="py-3 px-4 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {filteredAdmins.map((admin) => (
                  <tr key={admin.id} className="hover:bg-slate-50/60 transition-colors">
                    <td className="py-3 px-4">
                      <div className="flex items-center gap-2.5">
                        <div className="w-8 h-8 rounded-full bg-rose-600 text-white font-bold flex items-center justify-center text-xs">
                          {admin.display_name.charAt(0)}
                        </div>
                        <span className="font-bold text-slate-900">{admin.display_name}</span>
                      </div>
                    </td>
                    <td className="py-3 px-4 font-mono text-slate-700">@{admin.username}</td>
                    <td className="py-3 px-4 font-mono text-slate-700">{admin.email}</td>
                    <td className="py-3 px-4">
                      <Badge variant={admin.status === 'active' ? 'success' : 'danger'} dot>
                        {admin.status === 'active' ? 'Active' : 'Disabled'}
                      </Badge>
                    </td>
                    <td className="py-3 px-4 text-right">
                      <Button
                        size="sm"
                        variant="ghost"
                        onClick={() => toggleStatus(admin.id)}
                        className={`text-xs ${
                          admin.status === 'active' ? 'text-rose-600 hover:bg-rose-50' : 'text-emerald-600 hover:bg-emerald-50'
                        }`}
                      >
                        {admin.status === 'active' ? (
                          <>
                            <Ban className="w-3.5 h-3.5" />
                            <span>Disable</span>
                          </>
                        ) : (
                          <>
                            <CheckCircle className="w-3.5 h-3.5" />
                            <span>Enable</span>
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

        {/* Create Admin Modal */}
        <Modal
          isOpen={createModalOpen}
          onClose={() => setCreateModalOpen(false)}
          title="Create New Administrator"
          description="Grant administrative privileges to oversee specific teams and user communications."
          maxWidth="md"
        >
          <form onSubmit={handleCreateAdmin} className="space-y-4">
            {error && <p className="text-xs text-rose-600">{error}</p>}
            <Input
              label="Full Name"
              placeholder="e.g. Rachel Adams"
              value={name}
              onChange={(e) => setName(e.target.value)}
              required
            />
            <Input
              label="Username"
              placeholder="e.g. rachel"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              required
            />
            <Input
              label="Email Address"
              type="email"
              placeholder="rachel@example.com"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
            />
            <div className="flex justify-end gap-2 pt-3 border-t border-slate-100">
              <Button type="button" variant="secondary" onClick={() => setCreateModalOpen(false)}>
                Cancel
              </Button>
              <Button type="submit" className="bg-rose-600 hover:bg-rose-700">
                Create Admin
              </Button>
            </div>
          </form>
        </Modal>
      </div>
    </DashboardLayout>
  );
}
