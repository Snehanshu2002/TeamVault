'use client';

import React, { useState } from 'react';
import { DashboardLayout } from '@/components/dashboard/DashboardLayout';
import { useAuth } from '@/lib/hooks/useAuth';
import { useUsers } from '@/lib/hooks/useUsers';
import { UserTable } from '@/components/users/UserTable';
import { UserDetailModal } from '@/components/users/UserDetailModal';
import { Profile, PublicProfile } from '@/lib/types';
import { Users, ShieldCheck } from 'lucide-react';

export default function SuperAdminUsersPage() {
  const { user } = useAuth();
  const { users, loading, toggleUserStatus } = useUsers(user);
  const [selectedUser, setSelectedUser] = useState<(Profile | PublicProfile) | null>(null);

  return (
    <DashboardLayout allowedRoles={['PLATFORM_SUPER_ADMIN']}>
      <div className="space-y-6">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
          <div>
            <h1 className="text-2xl font-black text-slate-900 tracking-tight flex items-center gap-2.5">
              <Users className="w-6 h-6 text-rose-600" />
              <span>Global User Directory</span>
            </h1>
            <p className="text-xs text-slate-500 mt-1">
              Super administrator global directory. View all platform accounts, toggle status, and inspect memberships.
            </p>
          </div>

          <div className="flex items-center gap-2 px-3 py-1.5 rounded-full bg-rose-50 border border-rose-200 text-rose-800 text-xs font-semibold">
            <ShieldCheck className="w-3.5 h-3.5 text-rose-600" />
            <span>Global Scope: {users.length} Total Registered Users</span>
          </div>
        </div>

        {loading ? (
          <div className="p-12 text-center text-xs text-slate-400">Loading directory...</div>
        ) : (
          <UserTable
            users={users}
            currentUserRole="PLATFORM_SUPER_ADMIN"
            onViewUser={(u) => setSelectedUser(u)}
            onToggleStatus={(uid) => toggleUserStatus(uid)}
          />
        )}

        <UserDetailModal
          isOpen={Boolean(selectedUser)}
          onClose={() => setSelectedUser(null)}
          user={selectedUser}
          viewerRole="PLATFORM_SUPER_ADMIN"
        />
      </div>
    </DashboardLayout>
  );
}
