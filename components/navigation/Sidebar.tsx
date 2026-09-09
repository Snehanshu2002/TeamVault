'use client';

import React from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useAuth } from '@/lib/hooks/useAuth';
import {
  LayoutDashboard,
  Users,
  Shield,
  MessageSquare,
  History,
  Settings,
  UserCheck,
  LogOut,
  FolderLock,
  Layers,
  Building,
  SplitSquareVertical,
} from 'lucide-react';
import { clsx } from 'clsx';

export interface SidebarProps {
  isOpen?: boolean;
  onClose?: () => void;
}

export const Sidebar: React.FC<SidebarProps> = ({ isOpen, onClose }) => {
  const pathname = usePathname();
  const { user, logout } = useAuth();

  const getNavItems = () => {
    if (user?.role === 'PLATFORM_SUPER_ADMIN') {
      return [
        { label: 'Overview', href: '/super-admin', icon: LayoutDashboard },
        { label: 'Organizations', href: '/super-admin/organizations', icon: Building, badge: 'Tenants' },
        { label: 'Admins', href: '/super-admin/admins', icon: Shield },
        { label: 'Users', href: '/super-admin/users', icon: Users },
        { label: 'Teams', href: '/super-admin/teams', icon: Layers },
        { label: 'Conversations', href: '/super-admin/conversations', icon: MessageSquare, badge: 'Monitor' },
        { label: 'Audit Logs', href: '/super-admin/audit-logs', icon: History },
        { label: 'Settings', href: '/super-admin/settings', icon: Settings },
      ];
    }

    if (user?.role === 'ORGANIZATION_ADMIN') {
      return [
        { label: 'Dashboard', href: '/admin', icon: LayoutDashboard },
        { label: 'Teams', href: '/admin/teams', icon: Layers },
        { label: 'Users', href: '/admin/users', icon: Users },
        { label: 'Conversations', href: '/admin/conversations', icon: MessageSquare, badge: 'Live Audit' },
        { label: 'Audit Logs', href: '/admin/audit-logs', icon: History },
        { label: 'Settings', href: '/admin/settings', icon: Settings },
        { label: 'Profile', href: '/admin/profile', icon: UserCheck },
      ];
    }

    // USER role
    return [
      { label: 'Dashboard', href: '/user', icon: LayoutDashboard },
      { label: 'My Teams', href: '/user/teams', icon: Layers },
      { label: 'Messages', href: '/user/messages', icon: MessageSquare, badge: 'Private' },
      { label: 'Profile', href: '/user/profile', icon: UserCheck },
      { label: 'Settings', href: '/user/settings', icon: Settings },
    ];
  };

  const navItems = getNavItems();

  return (
    <>
      {/* Mobile Backdrop */}
      {isOpen && (
        <div
          className="fixed inset-0 bg-slate-900/40 backdrop-blur-xs z-40 lg:hidden"
          onClick={onClose}
        />
      )}

      {/* Sidebar Container */}
      <aside
        className={clsx(
          'fixed top-0 bottom-0 left-0 z-40 w-64 bg-slate-950 text-slate-300 flex flex-col transition-transform duration-200 ease-in-out border-r border-slate-800 lg:translate-x-0 lg:static',
          isOpen ? 'translate-x-0' : '-translate-x-full'
        )}
      >
        {/* Brand Header */}
        <div className="p-5 border-b border-slate-800 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-xl bg-indigo-600 flex items-center justify-center text-white font-black text-base shadow-sm shadow-indigo-500/30">
              <FolderLock className="w-5 h-5" />
            </div>
            <div>
              <h1 className="text-sm font-bold text-white tracking-tight leading-tight">
                Private Team Chat
              </h1>
              <span className="text-[10px] uppercase font-bold tracking-wider text-indigo-400">
                {user?.role === 'PLATFORM_SUPER_ADMIN'
                  ? 'SUPER ADMIN'
                  : user?.role === 'ORGANIZATION_ADMIN'
                  ? 'ORG ADMIN'
                  : 'TEAM MEMBER'}
              </span>
            </div>
          </div>
        </div>

        {/* Live Demo Callout */}
        <div className="px-3 pt-3">
          <Link
            href="/demo/chat"
            className="flex items-center justify-between p-2.5 rounded-xl bg-indigo-950/60 border border-indigo-700/50 hover:border-indigo-500 transition-colors group"
          >
            <div className="flex items-center gap-2">
              <span className="relative flex h-2 w-2">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
                <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-500"></span>
              </span>
              <span className="text-xs font-semibold text-indigo-200 group-hover:text-white">
                Live 2-User Demo
              </span>
            </div>
            <SplitSquareVertical className="w-4 h-4 text-indigo-400 group-hover:text-indigo-300" />
          </Link>
        </div>

        {/* Navigation Links */}
        <nav className="flex-1 p-3 space-y-1 overflow-y-auto">
          <div className="px-2 pb-2 text-[10px] font-bold text-slate-400 uppercase tracking-wider">
            Workspace Menu
          </div>
          {navItems.map((item) => {
            const Icon = item.icon;
            const isActive =
              pathname === item.href ||
              (item.href !== '/admin' &&
                item.href !== '/super-admin' &&
                item.href !== '/user' &&
                pathname.startsWith(item.href));

            return (
              <Link
                key={item.href}
                href={item.href}
                onClick={onClose}
                className={clsx(
                  'flex items-center justify-between px-3 py-2.5 rounded-xl text-xs font-medium transition-all group',
                  isActive
                    ? 'bg-indigo-600 text-white shadow-xs font-semibold'
                    : 'text-slate-400 hover:text-slate-100 hover:bg-slate-900'
                )}
              >
                <div className="flex items-center gap-2.5">
                  <Icon
                    className={clsx(
                      'w-4 h-4 transition-colors',
                      isActive ? 'text-white' : 'text-slate-400 group-hover:text-slate-200'
                    )}
                  />
                  <span>{item.label}</span>
                </div>
                {item.badge && (
                  <span
                    className={clsx(
                      'text-[9px] font-bold px-1.5 py-0.5 rounded-md uppercase tracking-wider',
                      isActive ? 'bg-indigo-700/80 text-white' : 'bg-slate-800 text-indigo-300'
                    )}
                  >
                    {item.badge}
                  </span>
                )}
              </Link>
            );
          })}
        </nav>

        {/* User Footer Profile */}
        <div className="p-3 border-t border-slate-800 bg-slate-950/80">
          <div className="flex items-center justify-between p-2 rounded-xl bg-slate-900 border border-slate-800">
            <div className="flex items-center gap-2.5 min-w-0">
              <div className="w-7 h-7 rounded-full bg-indigo-600 text-white flex items-center justify-center text-xs font-bold shrink-0">
                {user?.display_name.charAt(0) || 'U'}
              </div>
              <div className="truncate">
                <p className="text-xs font-bold text-slate-100 truncate">
                  {user?.display_name || 'User'}
                </p>
                <p className="text-[10px] text-slate-400 truncate">
                  @{user?.username || 'handle'}
                </p>
              </div>
            </div>
            <button
              onClick={() => logout()}
              title="Sign Out"
              className="p-1.5 text-slate-400 hover:text-rose-400 hover:bg-slate-800 rounded-lg transition-colors cursor-pointer"
            >
              <LogOut className="w-4 h-4" />
            </button>
          </div>
        </div>
      </aside>
    </>
  );
};
