'use client';

import React, { useState } from 'react';
import { useAuth } from '@/lib/hooks/useAuth';
import { PersonaSwitcher } from './PersonaSwitcher';
import { DemoGuideModal } from './DemoGuideModal';
import { 
  Bell, 
  HelpCircle, 
  LogOut, 
  Menu, 
  ShieldAlert, 
  SplitSquareVertical, 
  User as UserIcon,
  Building
} from 'lucide-react';
import Link from 'next/link';

export interface NavbarProps {
  onMobileMenuToggle?: () => void;
}

export const Navbar: React.FC<NavbarProps> = ({ onMobileMenuToggle }) => {
  const { user, logout } = useAuth();
  const [guideOpen, setGuideOpen] = useState(false);
  const [userDropdownOpen, setUserDropdownOpen] = useState(false);

  return (
    <>
      <header className="sticky top-0 z-30 bg-white/90 backdrop-blur-md border-b border-slate-200/80 px-4 sm:px-6 py-2.5 flex items-center justify-between">
        {/* Left: Mobile Toggle & Logo */}
        <div className="flex items-center gap-3">
          <button
            onClick={onMobileMenuToggle}
            className="lg:hidden p-2 text-slate-600 hover:text-slate-900 rounded-xl hover:bg-slate-100 cursor-pointer"
          >
            <Menu className="w-5 h-5" />
          </button>
          
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-xl bg-linear-to-tr from-indigo-600 to-indigo-800 flex items-center justify-center text-white shadow-xs shadow-indigo-200 font-bold text-sm">
              PT
            </div>
            <div className="hidden sm:block">
              <span className="font-bold text-sm tracking-tight text-slate-900 block leading-tight">
                Private Team Chat
              </span>
              <span className="text-[10px] text-slate-500 font-medium">
                Multi-Tenant Enterprise SaaS
              </span>
            </div>
          </div>
        </div>

        {/* Right: Actions, Demo Switcher, Persona Badge & Profile */}
        <div className="flex items-center gap-2 sm:gap-3">
          {/* Explicit Demo Mode Indicator */}
          <div className="hidden lg:flex items-center gap-1 px-2.5 py-1 text-[10px] font-extrabold uppercase tracking-wider text-amber-800 bg-amber-100/90 border border-amber-300 rounded-md shadow-2xs">
            <span className="w-2 h-2 rounded-full bg-amber-500 animate-pulse" />
            <span>DEMO MODE</span>
          </div>

          {/* Side-by-Side 2-Panel Demo Link */}
          <Link
            href="/demo/chat"
            className="hidden md:flex items-center gap-1.5 px-3 py-1.5 text-xs font-semibold text-indigo-700 bg-indigo-50 border border-indigo-200/80 rounded-full hover:bg-indigo-100 transition-colors shadow-2xs"
          >
            <SplitSquareVertical className="w-3.5 h-3.5" />
            <span>2-User Live Demo</span>
          </Link>

          {/* Demo Guide Launcher */}
          <button
            onClick={() => setGuideOpen(true)}
            className="flex items-center gap-1.5 px-3 py-1.5 text-xs font-semibold text-amber-800 bg-amber-50 border border-amber-200/80 rounded-full hover:bg-amber-100 transition-colors cursor-pointer"
          >
            <HelpCircle className="w-3.5 h-3.5 text-amber-600" />
            <span className="hidden sm:inline">10-Step Demo Flow</span>
          </button>

          {/* Demo Persona Switcher */}
          <PersonaSwitcher />

          {/* User Profile Menu */}
          <div className="relative">
            <button
              onClick={() => setUserDropdownOpen(!userDropdownOpen)}
              className="flex items-center gap-2 p-1 pl-1.5 pr-2 rounded-full hover:bg-slate-100 transition-colors border border-slate-200 cursor-pointer"
            >
              <div className="w-7 h-7 rounded-full bg-slate-800 text-white flex items-center justify-center text-xs font-bold">
                {user ? user.display_name.charAt(0) : 'U'}
              </div>
              <div className="hidden sm:block text-left text-xs leading-tight">
                <div className="font-semibold text-slate-800 max-w-[110px] truncate">
                  {user?.display_name || 'User'}
                </div>
              </div>
            </button>

            {userDropdownOpen && (
              <>
                <div className="fixed inset-0 z-40" onClick={() => setUserDropdownOpen(false)} />
                <div className="absolute right-0 mt-2 w-56 bg-white border border-slate-200 rounded-2xl shadow-xl z-50 p-2 animate-in fade-in zoom-in-95 duration-150">
                  <div className="px-3 py-2 border-b border-slate-100 mb-1">
                    <p className="text-xs font-bold text-slate-900">{user?.display_name}</p>
                    <p className="text-[11px] text-slate-500 truncate">{user?.email}</p>
                    <span className="inline-block mt-1 text-[9px] font-bold px-2 py-0.5 rounded-md bg-indigo-50 text-indigo-700 border border-indigo-200">
                      {user?.role}
                    </span>
                  </div>

                  <Link
                    href={user?.role === 'ORGANIZATION_ADMIN' ? '/admin/profile' : '/user/profile'}
                    onClick={() => setUserDropdownOpen(false)}
                    className="w-full text-left flex items-center gap-2 px-3 py-2 text-xs text-slate-700 hover:bg-slate-50 rounded-xl transition-colors"
                  >
                    <UserIcon className="w-4 h-4 text-slate-500" />
                    <span>View Profile</span>
                  </Link>

                  <button
                    onClick={() => {
                      setUserDropdownOpen(false);
                      setGuideOpen(true);
                    }}
                    className="w-full text-left flex items-center gap-2 px-3 py-2 text-xs text-slate-700 hover:bg-slate-50 rounded-xl transition-colors cursor-pointer"
                  >
                    <HelpCircle className="w-4 h-4 text-slate-500" />
                    <span>Demo Presentation Guide</span>
                  </button>

                  <button
                    onClick={() => {
                      setUserDropdownOpen(false);
                      logout();
                    }}
                    className="w-full text-left flex items-center gap-2 px-3 py-2 text-xs text-rose-600 hover:bg-rose-50 rounded-xl transition-colors mt-1 cursor-pointer"
                  >
                    <LogOut className="w-4 h-4" />
                    <span>Sign Out</span>
                  </button>
                </div>
              </>
            )}
          </div>
        </div>
      </header>

      {/* Demo Presentation Guide Modal */}
      <DemoGuideModal isOpen={guideOpen} onClose={() => setGuideOpen(false)} />
    </>
  );
};
