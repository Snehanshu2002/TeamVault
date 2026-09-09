'use client';

import { useState, useEffect, useCallback } from 'react';
import { Team, Profile, PublicProfile } from '@/lib/types';
import { TeamService } from '@/lib/services/teamService';
import { mockSupabase } from '@/lib/supabase/mockSupabase';

export function useTeams(currentUser: Profile | null) {
  const [teams, setTeams] = useState<Team[]>([]);
  const [loading, setLoading] = useState(true);

  const loadTeams = useCallback(() => {
    if (!currentUser) return;
    const userTeams = TeamService.getTeamsForUser(currentUser);
    setTeams(userTeams);
    setLoading(false);
  }, [currentUser]);

  useEffect(() => {
    loadTeams();

    const unsubscribe = mockSupabase.subscribe((event) => {
      if (
        event === 'TEAMS_UPDATED' ||
        event === 'PROFILES_UPDATED' ||
        event === 'RESET_DATA' ||
        event === 'STORAGE_SYNC'
      ) {
        loadTeams();
      }
    });

    return () => unsubscribe();
  }, [currentUser, loadTeams]);

  const createTeam = useCallback(
    (name: string, description: string, memberIds: string[] = []) => {
      if (!currentUser) throw new Error('Not authenticated');
      const newTeam = TeamService.createTeam(name, description, currentUser, memberIds);
      loadTeams();
      return newTeam;
    },
    [currentUser, loadTeams]
  );

  const addMember = useCallback(
    (teamId: string, userId: string) => {
      if (!currentUser) return;
      TeamService.addMemberToTeam(teamId, userId, currentUser);
      loadTeams();
    },
    [currentUser, loadTeams]
  );

  const removeMember = useCallback(
    (teamId: string, userId: string) => {
      if (!currentUser) return;
      TeamService.removeMemberFromTeam(teamId, userId, currentUser);
      loadTeams();
    },
    [currentUser, loadTeams]
  );

  const deleteTeam = useCallback(
    (teamId: string) => {
      if (!currentUser) return;
      TeamService.deleteTeam(teamId, currentUser);
      loadTeams();
    },
    [currentUser, loadTeams]
  );

  const getTeamMembers = useCallback(
    (teamId: string): (Profile | PublicProfile)[] => {
      if (!currentUser) return [];
      return TeamService.getTeamMembers(teamId, currentUser.role);
    },
    [currentUser]
  );

  return {
    teams,
    loading,
    createTeam,
    addMember,
    removeMember,
    deleteTeam,
    getTeamMembers,
    refreshTeams: loadTeams,
  };
}
