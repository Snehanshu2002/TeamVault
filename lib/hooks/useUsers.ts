'use client';

import { useState, useEffect, useCallback } from 'react';
import { Profile, PublicProfile } from '@/lib/types';
import { mockSupabase } from '@/lib/supabase/mockSupabase';
import { PrivacyService } from '@/lib/services/privacyService';

export function useUsers(currentUser: Profile | null) {
  const [users, setUsers] = useState<(Profile | PublicProfile)[]>([]);
  const [loading, setLoading] = useState(true);

  const loadUsers = useCallback(() => {
    if (!currentUser) return;
    const all = mockSupabase.getProfiles();

    if (currentUser.role === 'PLATFORM_SUPER_ADMIN') {
      setUsers(all);
    } else if (currentUser.role === 'ORGANIZATION_ADMIN') {
      // Scoped to current organization
      const orgUsers = all.filter((p) => p.organization_id === currentUser.organization_id);
      setUsers(orgUsers);
    } else {
      // USER role: strictly sanitized public profiles of fellow team members in their organization
      const myTeams = mockSupabase
        .getTeams()
        .filter((t) => t.organization_id === currentUser.organization_id && t.memberIds && t.memberIds.includes(currentUser.id));
      const teammateIds = new Set(myTeams.flatMap((t) => t.memberIds || []));
      const teammates = all.filter((p) => teammateIds.has(p.id));
      setUsers(PrivacyService.getVisibleProfiles(teammates, 'USER'));
    }
    setLoading(false);
  }, [currentUser]);

  useEffect(() => {
    loadUsers();

    const unsubscribe = mockSupabase.subscribe((event) => {
      if (
        event === 'PROFILES_UPDATED' ||
        event === 'TEAMS_UPDATED' ||
        event === 'RESET_DATA' ||
        event === 'STORAGE_SYNC'
      ) {
        loadUsers();
      }
    });

    return () => unsubscribe();
  }, [currentUser, loadUsers]);

  const toggleUserStatus = useCallback(
    (userId: string) => {
      const p = mockSupabase.getProfileById(userId);
      if (!p) return;
      const newStatus = p.status === 'active' ? 'disabled' : 'active';
      mockSupabase.saveProfile({ ...p, status: newStatus });
      loadUsers();
    },
    [loadUsers]
  );

  return {
    users,
    loading,
    toggleUserStatus,
    refreshUsers: loadUsers,
  };
}
