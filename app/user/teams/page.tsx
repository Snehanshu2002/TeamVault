'use client';

import React, { useState } from 'react';
import { DashboardLayout } from '@/components/dashboard/DashboardLayout';
import { useAuth } from '@/lib/hooks/useAuth';
import { useTeams } from '@/lib/hooks/useTeams';
import { TeamCard } from '@/components/teams/TeamCard';
import { ChatService } from '@/lib/services/chatService';
import { Profile, PublicProfile, Team } from '@/lib/types';
import { useRouter } from 'next/navigation';
import { Layers, ShieldCheck, Lock, Users } from 'lucide-react';
import { UserDetailModal } from '@/components/users/UserDetailModal';

export default function UserTeamsPage() {
  const { user } = useAuth();
  const { teams, getTeamMembers, loading } = useTeams(user);
  const [selectedUser, setSelectedUser] = useState<(Profile | PublicProfile) | null>(null);
  const router = useRouter();

  const handleStartChat = (member: Profile | PublicProfile, team: Team) => {
    if (!user) return;
    try {
      const conv = ChatService.getOrCreatePrivateConversation(team.organization_id || user.organization_id, team.id, user.id, member.id);
      router.push(`/user/messages?convId=${conv.id}`);
    } catch (err: any) {
      alert(err.message || 'Cannot initiate chat');
    }
  };

  return (
    <DashboardLayout allowedRoles={['USER', 'ORGANIZATION_ADMIN', 'PLATFORM_SUPER_ADMIN']}>
      <div className="space-y-6">
        {/* Page Title */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
          <div>
            <h1 className="text-2xl font-black text-slate-900 tracking-tight flex items-center gap-2.5">
              <Layers className="w-6 h-6 text-indigo-600" />
              <span>My Assigned Teams</span>
            </h1>
            <p className="text-xs text-slate-500 mt-1">
              Teams you belong to. You can private chat with members in the same team.
            </p>
          </div>

          {/* Privacy Badge */}
          <div className="flex items-center gap-2 px-3 py-1.5 rounded-full bg-emerald-50 border border-emerald-200 text-emerald-800 text-xs font-semibold">
            <Lock className="w-3.5 h-3.5 text-emerald-600" />
            <span>Zero Personal Data Exposure Active</span>
          </div>
        </div>

        {/* Teams Grid */}
        {loading ? (
          <div className="p-12 text-center">
            <div className="w-8 h-8 border-3 border-indigo-600 border-t-transparent rounded-full animate-spin mx-auto mb-2" />
            <p className="text-xs text-slate-500">Loading team rosters...</p>
          </div>
        ) : teams.length === 0 ? (
          <div className="p-12 text-center bg-white rounded-3xl border border-dashed border-slate-200">
            <Users className="w-12 h-12 text-slate-300 mx-auto mb-3" />
            <h3 className="text-base font-bold text-slate-800">No Assigned Teams</h3>
            <p className="text-xs text-slate-500 max-w-sm mx-auto mt-1">
              You are currently not enrolled in any teams. Contact your team administrator to be added to an active workspace.
            </p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {teams.map((team) => {
              const members = getTeamMembers(team.id);
              return (
                <TeamCard
                  key={team.id}
                  team={team}
                  members={members}
                  currentUserRole={user?.role || 'USER'}
                  onStartChatWithMember={(member, t) => handleStartChat(member, t)}
                />
              );
            })}
          </div>
        )}

        {/* User Privacy Inspect Modal */}
        <UserDetailModal
          isOpen={Boolean(selectedUser)}
          onClose={() => setSelectedUser(null)}
          user={selectedUser}
          viewerRole="USER"
        />
      </div>
    </DashboardLayout>
  );
}
