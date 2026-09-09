'use client';

import React, { useState } from 'react';
import { useAuth } from '@/lib/hooks/useAuth';
import { DEMO_PERSONAS, mockSupabase } from '@/lib/supabase/mockSupabase';
import { Sparkles, Users, RefreshCw, ChevronDown, CheckCircle2, SplitSquareVertical, Building } from 'lucide-react';
import Link from 'next/link';

export const PersonaSwitcher: React.FC = () => {
  const { user, switchPersona } = useAuth();
  const [isOpen, setIsOpen] = useState(false);
  const [resetting, setResetting] = useState(false);

  const handleReset = () => {
    setResetting(true);
    mockSupabase.resetToDefaults();
    setTimeout(() => {
      setResetting(false);
      window.location.reload();
    }, 400);
  };

  const getRoleBadgeColor = (role: string) => {
    switch (role) {
      case 'PLATFORM_SUPER_ADMIN':
        return 'bg-rose-100 text-rose-700 border-rose-200';
      case 'ORGANIZATION_ADMIN':
        return 'bg-indigo-100 text-indigo-700 border-indigo-200';
      case 'USER':
      default:
        return 'bg-emerald-100 text-emerald-700 border-emerald-200';
    }
  };

  return (
    <div className="relative">
      {/* Trigger Button */}
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="flex items-center gap-2 px-3 py-1.5 rounded-full bg-slate-900 text-white text-xs font-medium hover:bg-slate-800 transition-all shadow-sm border border-slate-700 cursor-pointer"
      >
        <Sparkles className="w-3.5 h-3.5 text-amber-400 animate-pulse" />
        <span className="hidden sm:inline">Demo Persona:</span>
        <span className="font-semibold text-indigo-200 truncate max-w-[120px]">
          {user ? user.display_name : 'Select Persona'}
        </span>
        <ChevronDown className={`w-3.5 h-3.5 text-slate-400 transition-transform ${isOpen ? 'rotate-180' : ''}`} />
      </button>

      {/* Dropdown Panel */}
      {isOpen && (
        <>
          <div className="fixed inset-0 z-40" onClick={() => setIsOpen(false)} />
          <div className="absolute right-0 mt-2 w-80 sm:w-96 bg-white border border-slate-200 rounded-2xl shadow-xl z-50 p-3 animate-in fade-in zoom-in-95 duration-150">
            <div className="flex items-center justify-between pb-2 mb-2 border-b border-slate-100 px-1">
              <div className="flex items-center gap-1.5">
                <Users className="w-4 h-4 text-indigo-600" />
                <span className="text-xs font-bold text-slate-900 uppercase tracking-wider">
                  Switch Demo Persona
                </span>
              </div>
              <div className="flex items-center gap-1">
                <Link
                  href="/demo/chat"
                  onClick={() => setIsOpen(false)}
                  className="flex items-center gap-1 px-2 py-1 text-[11px] font-semibold text-indigo-600 bg-indigo-50 hover:bg-indigo-100 rounded-lg transition-colors"
                >
                  <SplitSquareVertical className="w-3 h-3" />
                  Live 2-Panel
                </Link>
                <button
                  onClick={handleReset}
                  title="Reset database to initial state"
                  disabled={resetting}
                  className="p-1 text-slate-400 hover:text-slate-700 rounded-lg hover:bg-slate-100 cursor-pointer"
                >
                  <RefreshCw className={`w-3.5 h-3.5 ${resetting ? 'animate-spin text-indigo-600' : ''}`} />
                </button>
              </div>
            </div>

            <p className="text-[11px] text-slate-500 px-1 mb-2">
              Click any persona to immediately switch context and test multi-tenant features:
            </p>

            <div className="space-y-1 max-h-80 overflow-y-auto pr-1">
              {DEMO_PERSONAS.map((persona) => {
                const isActive = user?.id === persona.uid;
                return (
                  <button
                    key={persona.uid}
                    onClick={() => {
                      switchPersona(persona.uid);
                      setIsOpen(false);
                    }}
                    className={`w-full text-left p-2 rounded-xl transition-all flex items-center justify-between group cursor-pointer ${
                      isActive
                        ? 'bg-indigo-50/80 border border-indigo-200 shadow-xs'
                        : 'hover:bg-slate-50 border border-transparent'
                    }`}
                  >
                    <div className="flex items-center gap-2.5 min-w-0">
                      <div
                        className={`w-7 h-7 rounded-full flex items-center justify-center text-white text-xs font-bold shrink-0 ${persona.avatarColor}`}
                      >
                        {persona.name.charAt(0)}
                      </div>
                      <div className="truncate">
                        <div className="flex items-center gap-1.5">
                          <span className="text-xs font-semibold text-slate-900 truncate">
                            {persona.name}
                          </span>
                          <span
                            className={`text-[9px] px-1.5 py-0.2 rounded-md font-medium border ${getRoleBadgeColor(
                              persona.role
                            )}`}
                          >
                            {persona.role === 'PLATFORM_SUPER_ADMIN'
                              ? 'SUPER'
                              : persona.role === 'ORGANIZATION_ADMIN'
                              ? 'ADMIN'
                              : 'USER'}
                          </span>
                        </div>
                        <div className="text-[10px] text-slate-500 flex items-center gap-1 mt-0.5">
                          <span>@{persona.username}</span>
                          <span>•</span>
                          <span className="text-slate-600 font-medium truncate max-w-[140px]">
                            {persona.organizationName}
                          </span>
                        </div>
                      </div>
                    </div>
                    {isActive && <CheckCircle2 className="w-4 h-4 text-indigo-600 shrink-0 ml-2" />}
                  </button>
                );
              })}
            </div>

            <div className="mt-2 pt-2 border-t border-slate-100 px-1 flex items-center justify-between text-[10px] text-slate-500">
              <span>Multi-Tenant RLS • PostgreSQL Sync Active</span>
            </div>
          </div>
        </>
      )}
    </div>
  );
};
