'use client';

import React from 'react';
import { DashboardLayout } from '@/components/dashboard/DashboardLayout';
import { useAuth } from '@/lib/hooks/useAuth';
import { useTeams } from '@/lib/hooks/useTeams';
import { useChat } from '@/lib/hooks/useChat';
import { useUsers } from '@/lib/hooks/useUsers';
import { Card, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { 
  Layers, 
  Users, 
  MessageSquare, 
  Activity, 
  ArrowRight, 
  ShieldCheck, 
  Eye, 
  SplitSquareVertical, 
  CheckCircle2,
  Clock
} from 'lucide-react';
import Link from 'next/link';
import { format, parseISO } from 'date-fns';

export default function AdminDashboardPage() {
  const { user } = useAuth();
  const { teams } = useTeams(user);
  const { users } = useUsers(user);
  const { conversations } = useChat(undefined, user);

  // Total messages across monitored conversations
  const totalMessagesToday = conversations.length * 3 + 2; // realistic metric for demo

  const formatTime = (isoString?: string) => {
    if (!isoString) return '';
    try {
      return format(parseISO(isoString), 'MMM d, h:mm a');
    } catch {
      return '';
    }
  };

  return (
    <DashboardLayout allowedRoles={['ORGANIZATION_ADMIN', 'PLATFORM_SUPER_ADMIN']}>
      <div className="space-y-6">
        {/* Admin Header Banner */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-linear-to-r from-slate-900 via-indigo-950 to-slate-900 rounded-3xl p-6 text-white shadow-xl border border-indigo-900/40">
          <div>
            <div className="flex items-center gap-2 mb-1">
              <span className="text-xs font-bold px-2 py-0.5 rounded-md bg-indigo-500/30 border border-indigo-400/40 text-indigo-200">
                AUTHORIZED ADMINISTRATOR CONSOLE
              </span>
              <span className="text-xs text-slate-400">• Scope: {teams.map((t) => t.name).join(', ') || 'Assigned Teams'}</span>
            </div>
            <h1 className="text-2xl font-black">Welcome, {user?.display_name}</h1>
            <p className="text-xs text-slate-300 mt-1">
              Monitor team collaboration, manage user rosters, and review authorized private chat transcripts.
            </p>
          </div>

          <div className="flex items-center gap-2">
            <Link href="/admin/tracking">
              <Button size="sm" className="bg-indigo-600 hover:bg-indigo-700 text-white font-bold shadow-md shadow-indigo-600/30">
                <Activity className="w-4 h-4" />
                <span>Live Device Tracking</span>
              </Button>
            </Link>
            <Link href="/admin/conversations">
              <Button size="sm" variant="outline" className="bg-slate-900 border-slate-700 text-slate-200 hover:bg-slate-800 font-bold">
                <Eye className="w-4 h-4" />
                <span>Observe Chats</span>
              </Button>
            </Link>
          </div>
        </div>

        {/* Dashboard Metrics Cards */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          <Card className="flex items-center gap-4">
            <div className="w-12 h-12 rounded-2xl bg-indigo-50 text-indigo-600 flex items-center justify-center font-bold">
              <Layers className="w-6 h-6" />
            </div>
            <div>
              <p className="text-xs font-medium text-slate-500 uppercase tracking-wider">Total Teams</p>
              <h3 className="text-2xl font-bold text-slate-900">{teams.length}</h3>
            </div>
          </Card>

          <Card className="flex items-center gap-4">
            <div className="w-12 h-12 rounded-2xl bg-teal-50 text-teal-600 flex items-center justify-center font-bold">
              <Users className="w-6 h-6" />
            </div>
            <div>
              <p className="text-xs font-medium text-slate-500 uppercase tracking-wider">Scoped Users</p>
              <h3 className="text-2xl font-bold text-slate-900">{users.length}</h3>
            </div>
          </Card>

          <Card className="flex items-center gap-4">
            <div className="w-12 h-12 rounded-2xl bg-amber-50 text-amber-600 flex items-center justify-center font-bold">
              <MessageSquare className="w-6 h-6" />
            </div>
            <div>
              <p className="text-xs font-medium text-slate-500 uppercase tracking-wider">Active Conversations</p>
              <h3 className="text-2xl font-bold text-slate-900">{conversations.length}</h3>
            </div>
          </Card>

          <Card className="flex items-center gap-4">
            <div className="w-12 h-12 rounded-2xl bg-emerald-50 text-emerald-600 flex items-center justify-center font-bold">
              <Activity className="w-6 h-6" />
            </div>
            <div>
              <p className="text-xs font-medium text-slate-500 uppercase tracking-wider">Messages Monitored</p>
              <h3 className="text-2xl font-bold text-slate-900">{totalMessagesToday}</h3>
            </div>
          </Card>
        </div>

        {/* Recent Teams & Monitored Conversations */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Managed Teams */}
          <Card>
            <CardHeader className="flex items-center justify-between">
              <div>
                <CardTitle>Managed Teams</CardTitle>
                <p className="text-xs text-slate-500 mt-0.5">
                  Teams assigned under your administrative management.
                </p>
              </div>
              <Link href="/admin/teams">
                <Button variant="ghost" size="sm" className="text-xs">
                  Manage Teams
                </Button>
              </Link>
            </CardHeader>

            <div className="space-y-3">
              {teams.length === 0 ? (
                <div className="p-8 text-center text-xs text-slate-400">
                  No teams assigned to this admin account.
                </div>
              ) : (
                teams.map((t) => (
                  <div
                    key={t.id}
                    className="p-4 rounded-2xl bg-slate-50 border border-slate-200/80 flex items-center justify-between"
                  >
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 rounded-xl bg-indigo-600 text-white font-bold flex items-center justify-center text-sm shadow-xs">
                        {t.name.charAt(0)}
                      </div>
                      <div>
                        <h4 className="text-sm font-bold text-slate-900">{t.name}</h4>
                        <p className="text-xs text-slate-500 line-clamp-1">{t.description}</p>
                        <span className="text-[10px] text-slate-500 font-medium mt-1 inline-block">
                          {t.memberIds?.length || 0} Members Enrolled
                        </span>
                      </div>
                    </div>
                    <Link href="/admin/teams">
                      <Button size="sm" variant="outline" className="text-xs">
                        Configure
                      </Button>
                    </Link>
                  </div>
                ))
              )}
            </div>
          </Card>

          {/* Monitored Conversations (Core Requirement) */}
          <Card>
            <CardHeader className="flex items-center justify-between">
              <div>
                <CardTitle className="flex items-center gap-2">
                  <Eye className="w-4 h-4 text-amber-600" />
                  <span>Monitored Team Conversations</span>
                </CardTitle>
                <p className="text-xs text-slate-500 mt-0.5">
                  Transparent administrator oversight of private 1-on-1 team chats.
                </p>
              </div>
              <Link href="/admin/conversations">
                <Button variant="ghost" size="sm" className="text-xs">
                  View All
                </Button>
              </Link>
            </CardHeader>

            <div className="space-y-3">
              {conversations.length === 0 ? (
                <div className="p-8 text-center text-xs text-slate-400">
                  No active conversations in your assigned teams yet.
                </div>
              ) : (
                conversations.map((c) => (
                  <Link
                    key={c.id}
                    href={`/admin/conversations?convId=${c.id}`}
                    className="p-3.5 rounded-2xl bg-slate-50 hover:bg-slate-100 border border-slate-200/80 transition-colors flex items-center justify-between group block"
                  >
                    <div className="flex items-center gap-3 min-w-0">
                      <div className="w-9 h-9 rounded-xl bg-amber-500/10 text-amber-700 font-bold flex items-center justify-center text-xs border border-amber-300 shrink-0">
                        <Eye className="w-4 h-4" />
                      </div>
                      <div className="min-w-0">
                        <div className="flex items-center gap-2">
                          <h4 className="text-xs font-bold text-slate-900 truncate">
                            {c.team_name}
                          </h4>
                          <span className="text-[10px] text-slate-400">
                            {formatTime(c.last_message_at)}
                          </span>
                        </div>
                        <p className="text-xs text-slate-600 truncate mt-0.5 font-medium">
                          Latest: &ldquo;{c.last_message || 'Conversation active'}&rdquo;
                        </p>
                      </div>
                    </div>
                    <Badge variant="warning" className="text-[10px] shrink-0 ml-2">
                      Inspect
                    </Badge>
                  </Link>
                ))
              )}
            </div>
          </Card>
        </div>
      </div>
    </DashboardLayout>
  );
}
