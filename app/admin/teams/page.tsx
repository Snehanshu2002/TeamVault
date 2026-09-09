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
import { Layers, Plus, Shield } from 'lucide-react';

export default function AdminTeamsPage() {
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
    <DashboardLayout allowedRoles={['ORGANIZATION_ADMIN', 'PLATFORM_SUPER_ADMIN']}>
      <div className="space-y-6">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
          <div>
            <h1 className="text-2xl font-black text-slate-900 tracking-tight flex items-center gap-2.5">
              <Layers className="w-6 h-6 text-indigo-600" />
              <span>Team Management</span>
            </h1>
            <p className="text-xs text-slate-500 mt-1">
              Create and manage isolated team boundaries, enroll members, and configure team scopes.
            </p>
          </div>

          <Button
            onClick={() => setCreateModalOpen(true)}
            className="flex items-center gap-2"
          >
            <Plus className="w-4 h-4" />
            <span>Create New Team</span>
          </Button>
        </div>

        {/* Teams Grid */}
        {loading ? (
          <div className="p-12 text-center text-xs text-slate-400">Loading teams...</div>
        ) : teams.length === 0 ? (
          <div className="p-12 text-center bg-white rounded-3xl border border-dashed border-slate-200">
            <Layers className="w-12 h-12 text-slate-300 mx-auto mb-3" />
            <h3 className="text-base font-bold text-slate-800">No Teams Configured</h3>
            <p className="text-xs text-slate-500 max-w-sm mx-auto mt-1 mb-4">
              Get started by creating your first team and assigning members.
            </p>
            <Button onClick={() => setCreateModalOpen(true)} size="sm">
              Create Team Now
            </Button>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {teams.map((team) => (
              <TeamCard
                key={team.id}
                team={team}
                members={getTeamMembers(team.id)}
                currentUserRole={user?.role || 'ORGANIZATION_ADMIN'}
                onManageMembers={(t) => setManagingTeam(t)}
                onDeleteTeam={(id) => deleteTeam(id)}
              />
            ))}
          </div>
        )}

        {/* Create Modal */}
        <CreateTeamModal
          isOpen={createModalOpen}
          onClose={() => setCreateModalOpen(false)}
          onCreateTeam={handleCreate}
        />

        {/* Manage Members Modal */}
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
