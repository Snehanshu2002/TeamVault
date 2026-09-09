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

export default function SuperAdminUsersPage() {
  const { user } = useAuth();
  const { users, loading, toggleUserStatus, refreshUsers } = useUsers(user);
  const [selectedUser, setSelectedUser] = useState<(Profile | PublicProfile) | null>(null);
  const [createModalOpen, setCreateModalOpen] = useState(false);
  const [successBanner, setSuccessBanner] = useState<string | null>(null);

  const handleUserCreated = (newUser: Profile) => {
    refreshUsers();
    setSuccessBanner(`Global user "${newUser.display_name}" (@${newUser.username}) created successfully.`);
    setTimeout(() => setSuccessBanner(null), 5000);
  };

  return (
    <DashboardLayout allowedRoles={['PLATFORM_SUPER_ADMIN']}>
      <div className="space-y-6">
        {/* Header */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
          <div>
            <h1 className="text-2xl font-black text-slate-900 tracking-tight flex items-center gap-2.5">
              <Users className="w-6 h-6 text-rose-600" />
              <span>Global User Directory</span>
            </h1>
            <p className="text-xs text-slate-500 mt-1">
              Super administrator global directory. View all platform accounts, create new users across any tenant, and manage permissions.
            </p>
          </div>

          <div className="flex items-center gap-2.5">
            <div className="hidden sm:flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-rose-50 border border-rose-200 text-rose-800 text-xs font-semibold">
              <ShieldCheck className="w-3.5 h-3.5 text-rose-600" />
              <span>Global Scope: {users.length} Users</span>
            </div>

            <Button
              onClick={() => setCreateModalOpen(true)}
              className="flex items-center gap-2 bg-rose-600 hover:bg-rose-700 text-white font-bold shadow-md shadow-rose-600/20"
            >
              <UserPlus className="w-4 h-4" />
              <span>Add Global User</span>
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
          <div className="p-12 text-center text-xs text-slate-400">Loading directory...</div>
        ) : (
          <UserTable
            users={users}
            currentUserRole="PLATFORM_SUPER_ADMIN"
            onViewUser={(u) => setSelectedUser(u)}
            onToggleStatus={(uid) => toggleUserStatus(uid)}
          />
        )}

        {/* User Details Modal */}
        <UserDetailModal
          isOpen={Boolean(selectedUser)}
          onClose={() => setSelectedUser(null)}
          user={selectedUser}
          viewerRole="PLATFORM_SUPER_ADMIN"
        />

        {/* Add User Modal */}
        <CreateUserModal
          isOpen={createModalOpen}
          onClose={() => setCreateModalOpen(false)}
          onUserCreated={handleUserCreated}
          viewerRole="PLATFORM_SUPER_ADMIN"
        />
      </div>
    </DashboardLayout>
  );
}

