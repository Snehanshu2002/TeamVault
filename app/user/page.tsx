'use client';

import React from 'react';
import { DashboardLayout } from '@/components/dashboard/DashboardLayout';
import { useAuth } from '@/lib/hooks/useAuth';
import { useTeams } from '@/lib/hooks/useTeams';
import { useChat } from '@/lib/hooks/useChat';
import { Card, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { 
  Layers, 
  Users, 
  MessageSquare, 
  ArrowRight, 
  ShieldCheck, 
  Lock, 
  SplitSquareVertical,
  CheckCircle2,
  Clock
} from 'lucide-react';
import Link from 'next/link';
import { format, parseISO } from 'date-fns';

export default function UserDashboardPage() {
  const { user } = useAuth();
  const { teams } = useTeams(user);
  const { conversations } = useChat(undefined, user);

  // Total teammates across assigned teams
  const allTeammateCount = teams.reduce((acc, t) => acc + (t.memberIds?.length || 0), 0);
  
  // Total unread messages
  const totalUnread = conversations.reduce((acc, c) => acc + (c.unreadCount || 0), 0);

  const formatTime = (isoString?: string) => {
    if (!isoString) return '';
    try {
      return format(parseISO(isoString), 'MMM d, h:mm a');
    } catch {
      return '';
    }
  };

  return (
    <DashboardLayout allowedRoles={['USER', 'ORGANIZATION_ADMIN', 'PLATFORM_SUPER_ADMIN']}>
      <div className="space-y-6">
        {/* Welcome Header */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-linear-to-r from-indigo-900 to-slate-900 rounded-3xl p-6 text-white shadow-lg">
          <div>
            <div className="flex items-center gap-2 mb-1">
              <span className="text-xs font-bold px-2 py-0.5 rounded-md bg-indigo-500/30 border border-indigo-400/30 text-indigo-200">
                TEAM MEMBER WORKSPACE
              </span>
            </div>
            <h1 className="text-2xl font-black">Welcome back, {user?.display_name}!</h1>
            <p className="text-xs text-indigo-200 mt-1">
              Public Handle: <strong className="font-mono text-white">@{user?.username}</strong> • Privacy Protected Mode Active
            </p>
          </div>

          <div className="flex items-center gap-2">
            <Link href="/user/messages">
              <Button size="sm" className="bg-white text-indigo-900 hover:bg-slate-100 font-bold">
                <MessageSquare className="w-4 h-4" />
                <span>Open Chats</span>
              </Button>
            </Link>
            <Link href="/demo/chat">
              <Button size="sm" variant="outline" className="bg-indigo-950/60 border-indigo-700/50 text-indigo-200 hover:bg-indigo-900">
                <SplitSquareVertical className="w-4 h-4" />
                <span>2-User Demo</span>
              </Button>
            </Link>
          </div>
        </div>

        {/* Dashboard Cards Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          <Card className="flex items-center gap-4">
            <div className="w-12 h-12 rounded-2xl bg-indigo-50 text-indigo-600 flex items-center justify-center font-bold">
              <Layers className="w-6 h-6" />
            </div>
            <div>
              <p className="text-xs font-medium text-slate-500 uppercase tracking-wider">My Teams</p>
              <h3 className="text-2xl font-bold text-slate-900">{teams.length}</h3>
            </div>
          </Card>

          <Card className="flex items-center gap-4">
            <div className="w-12 h-12 rounded-2xl bg-teal-50 text-teal-600 flex items-center justify-center font-bold">
              <Users className="w-6 h-6" />
            </div>
            <div>
              <p className="text-xs font-medium text-slate-500 uppercase tracking-wider">Teammates</p>
              <h3 className="text-2xl font-bold text-slate-900">{allTeammateCount}</h3>
            </div>
          </Card>

          <Card className="flex items-center gap-4">
            <div className="w-12 h-12 rounded-2xl bg-blue-50 text-blue-600 flex items-center justify-center font-bold">
              <MessageSquare className="w-6 h-6" />
            </div>
            <div>
              <p className="text-xs font-medium text-slate-500 uppercase tracking-wider">Active Chats</p>
              <h3 className="text-2xl font-bold text-slate-900">{conversations.length}</h3>
            </div>
          </Card>

          <Card className="flex items-center gap-4">
            <div className="w-12 h-12 rounded-2xl bg-emerald-50 text-emerald-600 flex items-center justify-center font-bold">
              <Lock className="w-6 h-6" />
            </div>
            <div>
              <p className="text-xs font-medium text-slate-500 uppercase tracking-wider">Privacy Mode</p>
              <h3 className="text-base font-bold text-emerald-700">Enforced</h3>
            </div>
          </Card>
        </div>

        {/* Assigned Teams & Recent Conversations */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Assigned Teams Section */}
          <Card>
            <CardHeader className="flex items-center justify-between">
              <div>
                <CardTitle>My Assigned Teams</CardTitle>
                <p className="text-xs text-slate-500 mt-0.5">
                  Teams you can collaborate and private-chat within.
                </p>
              </div>
              <Link href="/user/teams">
                <Button variant="ghost" size="sm" className="text-xs">
                  View All
                </Button>
              </Link>
            </CardHeader>

            <div className="space-y-3">
              {teams.length === 0 ? (
                <div className="p-8 text-center text-xs text-slate-400">
                  You are not currently assigned to any team. Contact your administrator.
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
                        <span className="text-[10px] text-indigo-600 font-medium mt-1 inline-block">
                          {t.memberIds?.length || 0} Members in Roster
                        </span>
                      </div>
                    </div>
                    <Link href="/user/teams">
                      <Button size="sm" variant="outline" className="text-xs">
                        Roster
                      </Button>
                    </Link>
                  </div>
                ))
              )}
            </div>
          </Card>

          {/* Recent Conversations Section */}
          <Card>
            <CardHeader className="flex items-center justify-between">
              <div>
                <CardTitle>Recent Private Conversations</CardTitle>
                <p className="text-xs text-slate-500 mt-0.5">
                  1-on-1 chats with fellow team members.
                </p>
              </div>
              <Link href="/user/messages">
                <Button variant="ghost" size="sm" className="text-xs">
                  Open Chats
                </Button>
              </Link>
            </CardHeader>

            <div className="space-y-3">
              {conversations.length === 0 ? (
                <div className="p-8 text-center text-xs text-slate-400">
                  No recent conversations yet. Open your team to start a private chat!
                </div>
              ) : (
                conversations.map((c) => (
                  <Link
                    key={c.id}
                    href="/user/messages"
                    className="p-3.5 rounded-2xl bg-slate-50 hover:bg-slate-100 border border-slate-200/80 transition-colors flex items-center justify-between group block"
                  >
                    <div className="flex items-center gap-3 min-w-0">
                      <div className="w-9 h-9 rounded-xl bg-slate-800 text-white font-bold flex items-center justify-center text-xs shrink-0">
                        💬
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
                        <p className="text-xs text-slate-500 truncate mt-0.5">
                          {c.last_message || 'Click to start chatting...'}
                        </p>
                      </div>
                    </div>
                    <ArrowRight className="w-4 h-4 text-slate-400 group-hover:text-indigo-600 group-hover:translate-x-1 transition-all shrink-0 ml-2" />
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
