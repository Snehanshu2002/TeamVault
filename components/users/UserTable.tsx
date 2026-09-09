'use client';

import React, { useState } from 'react';
import { Profile, PublicProfile } from '@/lib/types';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Search, Eye, Ban, CheckCircle, Lock, Filter } from 'lucide-react';

export interface UserTableProps {
  users: (Profile | PublicProfile)[];
  currentUserRole: string;
  onViewUser?: (user: Profile | PublicProfile) => void;
  onToggleStatus?: (userId: string) => void;
}

export const UserTable: React.FC<UserTableProps> = ({
  users,
  currentUserRole,
  onViewUser,
  onToggleStatus,
}) => {
  const [search, setSearch] = useState('');
  const [statusFilter, setStatusFilter] = useState('ALL');

  const isAdmin =
    currentUserRole === 'ORGANIZATION_ADMIN' || currentUserRole === 'PLATFORM_SUPER_ADMIN';

  const filtered = users.filter((u) => {
    const matchesSearch =
      u.display_name.toLowerCase().includes(search.toLowerCase()) ||
      u.username.toLowerCase().includes(search.toLowerCase()) ||
      ('email' in u && (u as Profile).email.toLowerCase().includes(search.toLowerCase()));

    const matchesStatus =
      statusFilter === 'ALL' ||
      (statusFilter === 'ACTIVE' && u.status === 'active') ||
      (statusFilter === 'DISABLED' && u.status === 'disabled');

    return matchesSearch && matchesStatus;
  });

  return (
    <div className="bg-white border border-slate-200 rounded-2xl overflow-hidden shadow-xs">
      {/* Search & Filter Bar */}
      <div className="p-4 border-b border-slate-100 flex flex-col sm:flex-row items-center justify-between gap-3">
        <div className="relative w-full sm:w-72">
          <Search className="w-4 h-4 absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400" />
          <input
            type="text"
            placeholder="Search by name, handle..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full pl-9 pr-4 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs text-slate-900 placeholder-slate-400 focus:outline-none focus:bg-white focus:border-indigo-500 transition-colors"
          />
        </div>

        <div className="flex items-center gap-2 w-full sm:w-auto">
          <Filter className="w-3.5 h-3.5 text-slate-400" />
          <select
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
            className="bg-slate-50 border border-slate-200 rounded-xl text-xs px-3 py-2 text-slate-700 focus:outline-none focus:border-indigo-500"
          >
            <option value="ALL">All Statuses</option>
            <option value="ACTIVE">Active Users</option>
            <option value="DISABLED">Disabled Users</option>
          </select>
        </div>
      </div>

      {/* Table */}
      <div className="overflow-x-auto">
        <table className="w-full text-left text-xs text-slate-600">
          <thead className="bg-slate-50/75 border-b border-slate-100 text-[11px] font-bold uppercase tracking-wider text-slate-500">
            <tr>
              <th className="py-3 px-4">User</th>
              <th className="py-3 px-4">Username</th>
              <th className="py-3 px-4">Role / Permissions</th>
              <th className="py-3 px-4">Status</th>
              {isAdmin && <th className="py-3 px-4">Contact (Admin Only)</th>}
              <th className="py-3 px-4 text-right">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-100">
            {filtered.length === 0 ? (
              <tr>
                <td colSpan={6} className="py-8 text-center text-slate-400">
                  No users match the search criteria.
                </td>
              </tr>
            ) : (
              filtered.map((user) => {
                const isFull = 'email' in user;
                const fullProfile = user as Profile;

                return (
                  <tr key={user.id} className="hover:bg-slate-50/60 transition-colors">
                    <td className="py-3 px-4">
                      <div className="flex items-center gap-2.5">
                        <div className="w-8 h-8 rounded-full bg-slate-800 text-white font-bold flex items-center justify-center text-xs">
                          {user.display_name.charAt(0)}
                        </div>
                        <div>
                          <span className="font-bold text-slate-900 block">
                            {user.display_name}
                          </span>
                          <span className="text-[10px] text-slate-400">
                            ID: {user.id.substring(0, 10)}...
                          </span>
                        </div>
                      </div>
                    </td>
                    <td className="py-3 px-4 font-mono font-medium text-slate-700">
                      @{user.username}
                    </td>
                    <td className="py-3 px-4">
                      <Badge
                        variant={
                          isFull && fullProfile.role === 'PLATFORM_SUPER_ADMIN'
                            ? 'danger'
                            : isFull && fullProfile.role === 'ORGANIZATION_ADMIN'
                            ? 'primary'
                            : 'secondary'
                        }
                      >
                        {isFull ? fullProfile.role : 'USER'}
                      </Badge>
                    </td>
                    <td className="py-3 px-4">
                      <Badge variant={user.status === 'active' ? 'success' : 'danger'} dot>
                        {user.status === 'active' ? 'Active' : 'Disabled'}
                      </Badge>
                    </td>
                    {isAdmin && (
                      <td className="py-3 px-4">
                        {isFull ? (
                          <span className="text-slate-600 font-mono text-[11px]">
                            {fullProfile.email}
                          </span>
                        ) : (
                          <span className="text-slate-400 italic flex items-center gap-1">
                            <Lock className="w-3 h-3" /> Redacted
                          </span>
                        )}
                      </td>
                    )}
                    <td className="py-3 px-4 text-right">
                      <div className="flex items-center justify-end gap-1.5">
                        {onViewUser && (
                          <Button
                            size="sm"
                            variant="ghost"
                            onClick={() => onViewUser(user)}
                            title="View Profile"
                            className="p-1.5 cursor-pointer"
                          >
                            <Eye className="w-4 h-4 text-slate-600" />
                          </Button>
                        )}
                        {isAdmin && onToggleStatus && (
                          <Button
                            size="sm"
                            variant="ghost"
                            onClick={() => onToggleStatus(user.id)}
                            title={user.status === 'active' ? 'Disable User' : 'Enable User'}
                            className={`p-1.5 cursor-pointer ${
                              user.status === 'active'
                                ? 'text-rose-600 hover:bg-rose-50'
                                : 'text-emerald-600 hover:bg-emerald-50'
                            }`}
                          >
                            {user.status === 'active' ? (
                              <Ban className="w-4 h-4" />
                            ) : (
                              <CheckCircle className="w-4 h-4" />
                            )}
                          </Button>
                        )}
                      </div>
                    </td>
                  </tr>
                );
              })
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
};
