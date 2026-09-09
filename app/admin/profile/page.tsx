'use client';

import React from 'react';
import { DashboardLayout } from '@/components/dashboard/DashboardLayout';
import { useAuth } from '@/lib/hooks/useAuth';
import { useTeams } from '@/lib/hooks/useTeams';
import { Card } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { ShieldCheck, UserCheck, Layers } from 'lucide-react';

export default function AdminProfilePage() {
  const { user } = useAuth();
  const { teams } = useTeams(user);

  return (
    <DashboardLayout allowedRoles={['ORGANIZATION_ADMIN', 'PLATFORM_SUPER_ADMIN']}>
      <div className="max-w-3xl space-y-6">
        <div>
          <h1 className="text-2xl font-black text-slate-900 tracking-tight">Administrator Profile</h1>
          <p className="text-xs text-slate-500 mt-1">
            Review administrator privileges and team jurisdictions.
          </p>
        </div>

        <Card>
          <div className="flex items-center gap-4 mb-6">
            <div className="w-16 h-16 rounded-2xl bg-indigo-600 text-white font-black text-2xl flex items-center justify-center shadow-md shadow-indigo-200">
              {user?.display_name.charAt(0)}
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h2 className="text-lg font-bold text-slate-900">{user?.display_name}</h2>
                <Badge variant="primary">{user?.role}</Badge>
              </div>
              <p className="text-xs font-mono text-indigo-600 font-semibold mt-0.5">
                @{user?.username}
              </p>
            </div>
          </div>

          <div className="space-y-3 divide-y divide-slate-100 text-xs">
            <div className="flex justify-between py-2">
              <span className="text-slate-500 font-medium">Full Name</span>
              <span className="font-bold text-slate-900">{user?.display_name}</span>
            </div>
            <div className="flex justify-between py-2">
              <span className="text-slate-500 font-medium">Username</span>
              <span className="font-mono text-slate-900">@{user?.username}</span>
            </div>
            <div className="flex justify-between py-2">
              <span className="text-slate-500 font-medium">Email Address</span>
              <span className="font-mono text-slate-900">{user?.email}</span>
            </div>
            <div className="flex justify-between py-2">
              <span className="text-slate-500 font-medium">Jurisdiction</span>
              <span className="font-bold text-indigo-600">
                {teams.map((t) => t.name).join(', ') || 'None assigned'}
              </span>
            </div>
            <div className="flex justify-between py-2">
              <span className="text-slate-500 font-medium">Role Clearance</span>
              <Badge variant="success">AUTHORIZED ADMIN</Badge>
            </div>
          </div>
        </Card>
      </div>
    </DashboardLayout>
  );
}
