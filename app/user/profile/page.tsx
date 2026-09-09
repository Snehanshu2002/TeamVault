'use client';

import React from 'react';
import { DashboardLayout } from '@/components/dashboard/DashboardLayout';
import { useAuth } from '@/lib/hooks/useAuth';
import { useTeams } from '@/lib/hooks/useTeams';
import { Card, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { ShieldCheck, Lock, UserCheck, CheckCircle2 } from 'lucide-react';

export default function UserProfilePage() {
  const { user } = useAuth();
  const { teams } = useTeams(user);

  return (
    <DashboardLayout allowedRoles={['USER', 'ORGANIZATION_ADMIN', 'PLATFORM_SUPER_ADMIN']}>
      <div className="max-w-3xl space-y-6">
        <div>
          <h1 className="text-2xl font-black text-slate-900 tracking-tight">User Profile &amp; Privacy</h1>
          <p className="text-xs text-slate-500 mt-1">
            Review your account settings and privacy safeguards.
          </p>
        </div>

        {/* Profile Card */}
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
              <span className="text-slate-500 font-medium">Display Name</span>
              <span className="font-bold text-slate-900">{user?.display_name}</span>
            </div>
            <div className="flex justify-between py-2">
              <span className="text-slate-500 font-medium">Public Handle</span>
              <span className="font-mono text-slate-900">@{user?.username}</span>
            </div>
            <div className="flex justify-between py-2">
              <span className="text-slate-500 font-medium">Email Address (Private)</span>
              <span className="font-mono text-slate-900">{user?.email}</span>
            </div>
            <div className="flex justify-between py-2">
              <span className="text-slate-500 font-medium">Account Status</span>
              <Badge variant="success" dot>Active</Badge>
            </div>
            <div className="flex justify-between py-2">
              <span className="text-slate-500 font-medium">Assigned Team Count</span>
              <span className="font-bold text-slate-900">{teams.length} Team(s)</span>
            </div>
          </div>
        </Card>

        {/* Privacy Safeguards Explanation */}
        <Card className="bg-emerald-50/50 border-emerald-200/80">
          <div className="flex items-start gap-3">
            <div className="w-9 h-9 rounded-xl bg-emerald-600 text-white flex items-center justify-center font-bold shrink-0">
              <ShieldCheck className="w-5 h-5" />
            </div>
            <div className="space-y-2">
              <h3 className="text-sm font-bold text-emerald-950">Strict Member Privacy Protection</h3>
              <p className="text-xs text-emerald-900 leading-relaxed">
                Your private personal information (email, phone number, address, and metadata) is never visible to other team members. Teammates can only view your public display name and handle (@{user?.username}).
              </p>
              <div className="flex items-center gap-1.5 text-xs font-semibold text-emerald-800 pt-1">
                <CheckCircle2 className="w-4 h-4 text-emerald-600" />
                <span>Zero telemetry / Zero location tracking guaranteed in MVP</span>
              </div>
            </div>
          </div>
        </Card>
      </div>
    </DashboardLayout>
  );
}
