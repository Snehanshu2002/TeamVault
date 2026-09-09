'use client';

import React, { useState } from 'react';
import { DashboardLayout } from '@/components/dashboard/DashboardLayout';
import { useAuth } from '@/lib/hooks/useAuth';
import { useUsers } from '@/lib/hooks/useUsers';
import { UserTable } from '@/components/users/UserTable';
import { UserDetailModal } from '@/components/users/UserDetailModal';
import { CreateUserModal } from '@/components/users/CreateUserModal';
import { Button } from '@/components/ui/button';
import { Profile, PublicProfile } from '@/lib/types';
import { Users, ShieldCheck, UserPlus, CheckCircle2 } from 'lucide-react';

export default function AdminUsersPage() {
  const { user } = useAuth();
  const { users, loading, toggleUserStatus, refreshUsers } = useUsers(user);
  const [selectedUser, setSelectedUser] = useState<(Profile | PublicProfile) | null>(null);
  const [createModalOpen, setCreateModalOpen] = useState(false);
  const [successBanner, setSuccessBanner] = useState<string | null>(null);

  const handleUserCreated = (newUser: Profile) => {
    refreshUsers();
    setSuccessBanner(`User "${newUser.display_name}" (@${newUser.username}) was successfully created and assigned.`);
    setTimeout(() => setSuccessBanner(null), 5000);
  };

  return (
    <DashboardLayout allowedRoles={['ORGANIZATION_ADMIN', 'PLATFORM_SUPER_ADMIN']}>
      <div className="space-y-6">
        {/* Header */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
          <div>
            <h1 className="text-2xl font-black text-slate-900 tracking-tight flex items-center gap-2.5">
              <Users className="w-6 h-6 text-indigo-600" />
              <span>User Directory &amp; Scope</span>
            </h1>
            <p className="text-xs text-slate-500 mt-1">
              Manage member accounts within your organization, assign them to teams, monitor status, and review contact details.
            </p>
          </div>

          <div className="flex items-center gap-2.5">
            <div className="hidden sm:flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-indigo-50 border border-indigo-200 text-indigo-800 text-xs font-semibold">
              <ShieldCheck className="w-3.5 h-3.5 text-indigo-600" />
              <span>{users.length} Scoped Users</span>
            </div>

            <Button
              onClick={() => setCreateModalOpen(true)}
              className="flex items-center gap-2 bg-indigo-600 hover:bg-indigo-700 text-white font-bold shadow-md shadow-indigo-600/20"
            >
              <UserPlus className="w-4 h-4" />
              <span>Add User</span>
            </Button>
          </div>
        </div>

        {/* Success Alert */}
        {successBanner && (
          <div className="p-3.5 bg-emerald-50 border border-emerald-300 rounded-2xl flex items-center justify-between gap-2 text-xs text-emerald-900 font-medium animate-in fade-in">
            <div className="flex items-center gap-2">
              <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
              <span>{successBanner}</span>
            </div>
            <button
              onClick={() => setSuccessBanner(null)}
              className="text-emerald-700 hover:text-emerald-900 font-bold text-xs"
            >
              ✕
            </button>
          </div>
        )}

        {/* User Table */}
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

        {/* User Details Modal */}
        <UserDetailModal
          isOpen={Boolean(selectedUser)}
          onClose={() => setSelectedUser(null)}
          user={selectedUser}
          viewerRole="ORGANIZATION_ADMIN"
        />

        {/* Add User Modal */}
        <CreateUserModal
          isOpen={createModalOpen}
          onClose={() => setCreateModalOpen(false)}
          onUserCreated={handleUserCreated}
          viewerRole="ORGANIZATION_ADMIN"
          currentOrgId={user?.organization_id}
        />
      </div>
    </DashboardLayout>
  );
}

