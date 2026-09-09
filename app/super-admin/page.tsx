'use client';

import React from 'react';
import { DashboardLayout } from '@/components/dashboard/DashboardLayout';
import { useAuth } from '@/lib/hooks/useAuth';
import { mockSupabase } from '@/lib/supabase/mockSupabase';
import { Card, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { 
  ShieldAlert, 
  ShieldCheck, 
  Users, 
  Layers, 
  MessageSquare, 
  Activity, 
  ArrowRight, 
  Lock, 
  SplitSquareVertical, 
  Server,
  Sparkles,
  Laptop
} from 'lucide-react';
import Link from 'next/link';

export default function SuperAdminDashboardPage() {
  const { user } = useAuth();
  const allUsers = mockSupabase.getProfiles();
  const admins = allUsers.filter((u) => u.role === 'ORGANIZATION_ADMIN');
  const regularUsers = allUsers.filter((u) => u.role === 'USER');
  const teams = mockSupabase.getTeams();
  const conversations = mockSupabase.getConversations();

  return (
    <DashboardLayout allowedRoles={['PLATFORM_SUPER_ADMIN']}>
      <div className="space-y-6">
        {/* Header Banner */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-linear-to-r from-rose-950 via-slate-900 to-indigo-950 rounded-3xl p-6 text-white shadow-xl border border-rose-900/40">
          <div>
            <div className="flex items-center gap-2 mb-1">
              <span className="text-xs font-bold px-2 py-0.5 rounded-md bg-rose-500/30 border border-rose-400/40 text-rose-200">
                SUPER ADMINISTRATOR GOVERNANCE
              </span>
            </div>
            <h1 className="text-2xl font-black">System Administration Console</h1>
            <p className="text-xs text-slate-300 mt-1">
              Global oversight across all admins, team boundaries, member directories, and communication channels.
            </p>
          </div>

          <div className="flex items-center gap-2">
            <Link href="/super-admin/tracking">
              <Button size="sm" className="bg-rose-600 hover:bg-rose-700 text-white font-bold shadow-md shadow-rose-600/30">
                <Laptop className="w-4 h-4" />
                <span>Live Device Tracking</span>
              </Button>
            </Link>
            <Link href="/super-admin/admins">
              <Button size="sm" variant="outline" className="bg-slate-900 border-slate-700 text-slate-200 hover:bg-slate-800">
                <ShieldCheck className="w-4 h-4" />
                <span>Manage Admins</span>
              </Button>
            </Link>
          </div>
        </div>

        {/* 5 Metrics Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-4">
          <Card className="flex items-center gap-3.5">
            <div className="w-11 h-11 rounded-2xl bg-rose-50 text-rose-600 flex items-center justify-center font-bold shrink-0">
              <ShieldCheck className="w-5 h-5" />
            </div>
            <div>
              <p className="text-[11px] font-medium text-slate-500 uppercase tracking-wider">Total Admins</p>
              <h3 className="text-xl font-bold text-slate-900">{admins.length}</h3>
            </div>
          </Card>

          <Card className="flex items-center gap-3.5">
            <div className="w-11 h-11 rounded-2xl bg-indigo-50 text-indigo-600 flex items-center justify-center font-bold shrink-0">
              <Users className="w-5 h-5" />
            </div>
            <div>
              <p className="text-[11px] font-medium text-slate-500 uppercase tracking-wider">Total Users</p>
              <h3 className="text-xl font-bold text-slate-900">{regularUsers.length}</h3>
            </div>
          </Card>

          <Card className="flex items-center gap-3.5">
            <div className="w-11 h-11 rounded-2xl bg-teal-50 text-teal-600 flex items-center justify-center font-bold shrink-0">
              <Layers className="w-5 h-5" />
            </div>
            <div>
              <p className="text-[11px] font-medium text-slate-500 uppercase tracking-wider">Total Teams</p>
              <h3 className="text-xl font-bold text-slate-900">{teams.length}</h3>
            </div>
          </Card>

          <Card className="flex items-center gap-3.5">
            <div className="w-11 h-11 rounded-2xl bg-amber-50 text-amber-600 flex items-center justify-center font-bold shrink-0">
              <MessageSquare className="w-5 h-5" />
            </div>
            <div>
              <p className="text-[11px] font-medium text-slate-500 uppercase tracking-wider">Conversations</p>
              <h3 className="text-xl font-bold text-slate-900">{conversations.length}</h3>
            </div>
          </Card>

          <Card className="flex items-center gap-3.5">
            <div className="w-11 h-11 rounded-2xl bg-emerald-50 text-emerald-600 flex items-center justify-center font-bold shrink-0">
              <Activity className="w-5 h-5" />
            </div>
            <div>
              <p className="text-[11px] font-medium text-slate-500 uppercase tracking-wider">System State</p>
              <h3 className="text-sm font-bold text-emerald-700">Healthy</h3>
            </div>
          </Card>
        </div>

        {/* Admins Overview & Global Teams Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Admins Table Preview */}
          <Card>
            <CardHeader className="flex items-center justify-between">
              <div>
                <CardTitle>System Administrators</CardTitle>
                <p className="text-xs text-slate-500 mt-0.5">
                  Appointed admins and their assigned team scopes.
                </p>
              </div>
              <Link href="/super-admin/admins">
                <Button variant="ghost" size="sm" className="text-xs">
                  Manage
                </Button>
              </Link>
            </CardHeader>

            <div className="space-y-3">
              {admins.map((adm) => (
                <div
                  key={adm.id}
                  className="p-3.5 rounded-2xl bg-slate-50 border border-slate-200/80 flex items-center justify-between"
                >
                  <div className="flex items-center gap-3">
                    <div className="w-9 h-9 rounded-xl bg-indigo-600 text-white font-bold flex items-center justify-center text-xs shadow-xs">
                      {adm.display_name.charAt(0)}
                    </div>
                    <div>
                      <h4 className="text-xs font-bold text-slate-900">{adm.display_name}</h4>
                      <p className="text-[11px] text-slate-500 font-mono">@{adm.username} • {adm.email}</p>
                    </div>
                  </div>
                  <Badge variant="primary" className="text-[10px]">
                    ADMIN
                  </Badge>
                </div>
              ))}
            </div>
          </Card>

          {/* All Platform Teams Preview */}
          <Card>
            <CardHeader className="flex items-center justify-between">
              <div>
                <CardTitle>All Platform Teams</CardTitle>
                <p className="text-xs text-slate-500 mt-0.5">
                  Active isolated team workspaces across the platform.
                </p>
              </div>
              <Link href="/super-admin/teams">
                <Button variant="ghost" size="sm" className="text-xs">
                  View All
                </Button>
              </Link>
            </CardHeader>

            <div className="space-y-3">
              {teams.map((t) => (
                <div
                  key={t.id}
                  className="p-3.5 rounded-2xl bg-slate-50 border border-slate-200/80 flex items-center justify-between"
                >
                  <div className="flex items-center gap-3">
                    <div className="w-9 h-9 rounded-xl bg-teal-600 text-white font-bold flex items-center justify-center text-xs shadow-xs">
                      {t.name.charAt(0)}
                    </div>
                    <div>
                      <h4 className="text-xs font-bold text-slate-900">{t.name}</h4>
                      <p className="text-[11px] text-slate-500">
                        Admin: {t.adminName || 'Admin'} • {t.memberIds?.length || 0} Members
                      </p>
                    </div>
                  </div>
                  <Badge variant="success" dot className="text-[10px]">
                    Active
                  </Badge>
                </div>
              ))}
            </div>
          </Card>
        </div>
      </div>
    </DashboardLayout>
  );
}
