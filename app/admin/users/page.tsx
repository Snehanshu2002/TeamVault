'use client';

import React, { useState } from 'react';
import { DashboardLayout } from '@/components/dashboard/DashboardLayout';
import { useAuth } from '@/lib/hooks/useAuth';
import { useUsers } from '@/lib/hooks/useUsers';
import { UserTable } from '@/components/users/UserTable';
import { UserDetailModal } from '@/components/users/UserDetailModal';
import { Profile, PublicProfile } from '@/lib/types';
import { Users, ShieldCheck, Lock } from 'lucide-react';

export default function AdminUsersPage() {
  const { user } = useAuth();
  const { users, loading, toggleUserStatus } = useUsers(user);
  const [selectedUser, setSelectedUser] = useState<(Profile | PublicProfile) | null>(null);

  return (
    <DashboardLayout allowedRoles={['ORGANIZATION_ADMIN', 'PLATFORM_SUPER_ADMIN']}>
      <div className="space-y-6">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
          <div>
            <h1 className="text-2xl font-black text-slate-900 tracking-tight flex items-center gap-2.5">
              <Users className="w-6 h-6 text-indigo-600" />
              <span>User Directory &amp; Scope</span>
            </h1>
            <p className="text-xs text-slate-500 mt-1">
              Manage member accounts within your assigned teams, monitor status, and review contact details.
            </p>
          </div>

          <div className="flex items-center gap-2 px-3 py-1.5 rounded-full bg-indigo-50 border border-indigo-200 text-indigo-800 text-xs font-semibold">
            <ShieldCheck className="w-3.5 h-3.5 text-indigo-600" />
            <span>Administrator View ({users.length} Scoped Users)</span>
          </div>
        </div>

        {loading ? (
          <div className="p-12 text-center text-xs text-slate-400">Loading user directory...</div>
        ) : (
          <UserTable
            users={users}
            currentUserRole={user?.role || 'ORGANIZATION_ADMIN'}
            onViewUser={(u) => setSelectedUser(u)}
            onToggleStatus={(uid) => toggleUserStatus(uid)}
          />
        )}

        <UserDetailModal
          isOpen={Boolean(selectedUser)}
          onClose={() => setSelectedUser(null)}
          user={selectedUser}
          viewerRole="ORGANIZATION_ADMIN"
        />
      </div>
    </DashboardLayout>
  );
}
