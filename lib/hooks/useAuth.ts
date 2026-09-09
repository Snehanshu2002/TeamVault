'use client';

import { useState, useEffect, useCallback } from 'react';
import { Profile, DemoPersona } from '@/lib/types';
import { AuthService } from '@/lib/services/authService';
import { mockSupabase, DEMO_PERSONAS } from '@/lib/supabase/mockSupabase';
import { useRouter } from 'next/navigation';

export function useAuth() {
  const [user, setUser] = useState<Profile | null>(null);
  const [loading, setLoading] = useState(true);
  const router = useRouter();

  const refreshUser = useCallback(() => {
    const current = AuthService.getCurrentUser();
    setUser(current);
    setLoading(false);
  }, []);

  useEffect(() => {
    refreshUser();

    const unsubscribe = mockSupabase.subscribe((event) => {
      if (event === 'USER_AUTH_CHANGE' || event === 'RESET_DATA' || event === 'PROFILES_UPDATED') {
        refreshUser();
      }
    });

    return () => unsubscribe();
  }, [refreshUser]);

  const switchPersona = useCallback(
    (personaUid: string) => {
      const newUser = AuthService.switchPersona(personaUid);
      setUser(newUser);
      if (newUser) {
        const path = AuthService.getDashboardPathForRole(newUser.role);
        router.push(path);
      }
    },
    [router]
  );

  const logout = useCallback(async () => {
    await AuthService.logout();
    setUser(null);
    router.push('/login');
  }, [router]);

  return {
    user,
    loading,
    personas: DEMO_PERSONAS,
    switchPersona,
    logout,
    refreshUser,
    isSuperAdmin: user?.role === 'PLATFORM_SUPER_ADMIN',
    isAdmin: user?.role === 'ORGANIZATION_ADMIN' || user?.role === 'PLATFORM_SUPER_ADMIN',
    isUser: user?.role === 'USER',
  };
}
