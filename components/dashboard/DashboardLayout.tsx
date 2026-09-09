'use client';

import React, { useState } from 'react';
import { Sidebar } from '@/components/navigation/Sidebar';
import { Navbar } from '@/components/navigation/Navbar';
import { useAuth } from '@/lib/hooks/useAuth';
import { UserRole } from '@/lib/types';
import { ShieldAlert } from 'lucide-react';
import { Button } from '@/components/ui/button';
import Link from 'next/link';

export interface DashboardLayoutProps {
  children: React.ReactNode;
  allowedRoles?: UserRole[];
}

export const DashboardLayout: React.FC<DashboardLayoutProps> = ({ children, allowedRoles }) => {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const { user, loading, isSuperAdmin } = useAuth();

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-slate-50">
        <div className="flex flex-col items-center gap-3">
          <div className="w-8 h-8 border-3 border-indigo-600 border-t-transparent rounded-full animate-spin" />
          <span className="text-xs text-slate-500 font-medium">Authenticating multi-tenant session...</span>
        </div>
      </div>
    );
  }

  // Check role authorization
  if (allowedRoles && user && !allowedRoles.includes(user.role) && !isSuperAdmin) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-slate-100 p-4">
        <div className="max-w-md w-full bg-white rounded-3xl p-8 border border-slate-200 shadow-xl text-center">
          <div className="w-14 h-14 rounded-2xl bg-rose-50 text-rose-600 flex items-center justify-center mx-auto mb-4 border border-rose-100">
            <ShieldAlert className="w-7 h-7" />
          </div>
          <h2 className="text-xl font-bold text-slate-900 mb-2">Unauthorized Scope</h2>
          <p className="text-xs text-slate-600 mb-6">
            Your current persona (<strong className="text-slate-800">{user.display_name}</strong> -{' '}
            <span className="font-semibold text-rose-600">{user.role}</span>) does not have permission
            to view this administrative section.
          </p>
          <div className="flex flex-col gap-2">
            <Link href={user.role === 'ORGANIZATION_ADMIN' ? '/admin' : user.role === 'PLATFORM_SUPER_ADMIN' ? '/super-admin' : '/user'}>
              <Button className="w-full">Go to Your Authorized Dashboard</Button>
            </Link>
            <Link href="/demo/chat">
              <Button variant="outline" className="w-full">
                Open 2-User Live Demo
              </Button>
            </Link>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen flex flex-col lg:flex-row bg-slate-50">
      <Sidebar isOpen={mobileMenuOpen} onClose={() => setMobileMenuOpen(false)} />
      <div className="flex-1 flex flex-col min-w-0">
        <Navbar onMobileMenuToggle={() => setMobileMenuOpen(!mobileMenuOpen)} />
        <main className="flex-1 p-4 sm:p-6 md:p-8 max-w-7xl w-full mx-auto">{children}</main>
      </div>
    </div>
  );
};
