'use client';

import React, { useState } from 'react';
import { DashboardLayout } from '@/components/dashboard/DashboardLayout';
import { useAuth } from '@/lib/hooks/useAuth';
import { useTeams } from '@/lib/hooks/useTeams';
import { TeamCard } from '@/components/teams/TeamCard';
import { CreateTeamModal } from '@/components/teams/CreateTeamModal';
import { ManageMembersModal } from '@/components/teams/ManageMembersModal';
import { Team } from '@/lib/types';
import { Button } from '@/components/ui/button';
import { Layers, Plus } from 'lucide-react';

export default function SuperAdminTeamsPage() {
  const { user } = useAuth();
  const {
    teams,
    loading,
    createTeam,
    addMember,
    removeMember,
    deleteTeam,
    getTeamMembers,
  } = useTeams(user);

  const [createModalOpen, setCreateModalOpen] = useState(false);
  const [managingTeam, setManagingTeam] = useState<Team | null>(null);

  const handleCreate = (name: string, desc: string, members: string[]) => {
    createTeam(name, desc, members);
  };

  return (
    <DashboardLayout allowedRoles={['PLATFORM_SUPER_ADMIN']}>
      <div className="space-y-6">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
          <div>
            <h1 className="text-2xl font-black text-slate-900 tracking-tight flex items-center gap-2.5">
              <Layers className="w-6 h-6 text-rose-600" />
              <span>Global Teams Overview</span>
            </h1>
            <p className="text-xs text-slate-500 mt-1">
              View and manage all platform teams, assigned overseer admins, and member rosters.
            </p>
          </div>

          <Button
            onClick={() => setCreateModalOpen(true)}
            className="flex items-center gap-2 bg-rose-600 hover:bg-rose-700 text-white"
          >
            <Plus className="w-4 h-4" />
            <span>Create New Team</span>
          </Button>
        </div>

        {loading ? (
          <div className="p-12 text-center text-xs text-slate-400">Loading teams...</div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {teams.map((team) => (
              <TeamCard
                key={team.id}
                team={team}
                members={getTeamMembers(team.id)}
                currentUserRole="PLATFORM_SUPER_ADMIN"
                onManageMembers={(t) => setManagingTeam(t)}
                onDeleteTeam={(id) => deleteTeam(id)}
              />
            ))}
          </div>
        )}

        <CreateTeamModal
          isOpen={createModalOpen}
          onClose={() => setCreateModalOpen(false)}
          onCreateTeam={handleCreate}
        />

        <ManageMembersModal
          isOpen={Boolean(managingTeam)}
          onClose={() => setManagingTeam(null)}
          team={managingTeam}
          onAddMember={(teamId, uid) => addMember(teamId, uid)}
          onRemoveMember={(teamId, uid) => removeMember(teamId, uid)}
        />
      </div>
    </DashboardLayout>
  );
}
