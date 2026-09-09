'use client';

import React, { useState } from 'react';
import { useAuth } from '@/lib/hooks/useAuth';
import { AuthService } from '@/lib/services/authService';
import { DEMO_PERSONAS } from '@/lib/supabase/mockSupabase';
import { Button } from '@/components/ui/button';
import { 
  FolderLock, 
  Sparkles, 
  ArrowRight, 
  Mail, 
  Lock, 
  ShieldCheck, 
  SplitSquareVertical, 
  AlertCircle,
  KeyRound,
  Users,
  CheckCircle2,
  ChevronRight
} from 'lucide-react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';

export default function LoginPage() {
  const [activeTab, setActiveTab] = useState<'demo' | 'manual'>('demo');
  const [selectedCategory, setSelectedCategory] = useState<'ALL' | 'ADMINS' | 'ALPHA' | 'BETA'>('ALL');
  const [email, setEmail] = useState('rahul@example.com');
  const [password, setPassword] = useState('demo1234');
  const [loading, setLoading] = useState(false);
  const [selectedPersonaUid, setSelectedPersonaUid] = useState<string | null>(null);
  const [error, setError] = useState('');
  const { switchPersona } = useAuth();
  const router = useRouter();

  const handleManualLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError('');
    try {
      const user = await AuthService.login(email, password);
      const path = AuthService.getDashboardPathForRole(user.role);
      router.push(path);
    } catch (err: any) {
      setError(err?.message || 'Login failed. Please verify credentials.');
    } finally {
      setLoading(false);
    }
  };

  const handleQuickLogin = (persona: typeof DEMO_PERSONAS[0]) => {
    setSelectedPersonaUid(persona.uid);
    setLoading(true);
    setTimeout(() => {
      switchPersona(persona.uid);
      const path = AuthService.getDashboardPathForRole(persona.role);
      router.push(path);
    }, 250);
  };

  // Filtered personas for clean non-cluttered display
  const filteredPersonas = DEMO_PERSONAS.filter((p) => {
    if (selectedCategory === 'ADMINS') {
      return p.role === 'PLATFORM_SUPER_ADMIN' || p.role === 'ORGANIZATION_ADMIN';
    }
    if (selectedCategory === 'ALPHA') {
      return p.teamNames.some((t) => t.includes('Alpha'));
    }
    if (selectedCategory === 'BETA') {
      return p.teamNames.some((t) => t.includes('Beta') || t.includes('Gamma'));
    }
    return true;
  });

  return (
    <div className="min-h-screen bg-slate-950 flex flex-col justify-center py-6 sm:py-10 px-4 sm:px-6 lg:px-8 relative overflow-hidden select-none">
      {/* Background Ambient Glows */}
      <div className="absolute top-1/4 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[500px] h-[350px] bg-indigo-600/15 rounded-full blur-3xl pointer-events-none" />
      <div className="absolute bottom-10 right-10 w-72 h-72 bg-teal-600/10 rounded-full blur-3xl pointer-events-none" />

      {/* Brand Header */}
      <div className="sm:mx-auto sm:w-full sm:max-w-md relative z-10 text-center mb-5">
        <div className="inline-flex items-center justify-center w-12 h-12 rounded-2xl bg-linear-to-tr from-indigo-600 to-indigo-800 text-white shadow-xl shadow-indigo-600/25 mb-3 border border-indigo-500/30">
          <FolderLock className="w-6 h-6" />
        </div>
        <h1 className="text-xl sm:text-2xl font-black tracking-tight text-white">
          Private Team Chat
        </h1>
        <p className="text-xs text-slate-400 mt-0.5">
          Enterprise Multi-Tenant Communication &amp; Oversight SaaS
        </p>
      </div>

      {/* Main Container Card */}
      <div className="sm:mx-auto sm:w-full sm:max-w-lg relative z-10">
        <div className="bg-slate-900/95 border border-slate-800 backdrop-blur-xl p-5 sm:p-7 shadow-2xl rounded-3xl space-y-4">
          {/* Top Segmented Navigation Tabs */}
          <div className="grid grid-cols-2 p-1 bg-slate-950/80 rounded-2xl border border-slate-800 text-xs font-bold">
            <button
              type="button"
              onClick={() => setActiveTab('demo')}
              className={`py-2 px-3 rounded-xl flex items-center justify-center gap-1.5 transition-all cursor-pointer ${
                activeTab === 'demo'
                  ? 'bg-indigo-600 text-white shadow-md shadow-indigo-600/30'
                  : 'text-slate-400 hover:text-slate-200'
              }`}
            >
              <Sparkles className="w-3.5 h-3.5 text-amber-300" />
              <span>1-Click Demo Login</span>
            </button>
            <button
              type="button"
              onClick={() => setActiveTab('manual')}
              className={`py-2 px-3 rounded-xl flex items-center justify-center gap-1.5 transition-all cursor-pointer ${
                activeTab === 'manual'
                  ? 'bg-indigo-600 text-white shadow-md shadow-indigo-600/30'
                  : 'text-slate-400 hover:text-slate-200'
              }`}
            >
              <KeyRound className="w-3.5 h-3.5" />
              <span>Password Sign In</span>
            </button>
          </div>

          {/* TAB 1: 1-CLICK DEMO LOGIN */}
          {activeTab === 'demo' && (
            <div className="space-y-3 animate-in fade-in duration-200">
              {/* Category Filter Pills */}
              <div className="flex items-center justify-between gap-1 pb-1">
                <span className="text-[11px] font-bold uppercase tracking-wider text-slate-400">
                  Select Persona:
                </span>
                <div className="flex items-center gap-1">
                  {[
                    { id: 'ALL', label: 'All' },
                    { id: 'ADMINS', label: 'Admins' },
                    { id: 'ALPHA', label: 'Team Alpha' },
                    { id: 'BETA', label: 'Beta/Gamma' },
                  ].map((cat) => (
                    <button
                      key={cat.id}
                      type="button"
                      onClick={() => setSelectedCategory(cat.id as any)}
                      className={`px-2 py-0.5 rounded-lg text-[10px] font-bold transition-all cursor-pointer ${
                        selectedCategory === cat.id
                          ? 'bg-indigo-500/25 text-indigo-300 border border-indigo-400/40'
                          : 'text-slate-400 hover:text-slate-300 hover:bg-slate-800'
                      }`}
                    >
                      {cat.label}
                    </button>
                  ))}
                </div>
              </div>

              {/* Persona Grid (Compact & Sleek) */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 max-h-[300px] overflow-y-auto pr-1">
                {filteredPersonas.map((p) => {
                  const isSelecting = selectedPersonaUid === p.uid && loading;
                  return (
                    <button
                      key={p.uid}
                      type="button"
                      disabled={loading}
                      onClick={() => handleQuickLogin(p)}
                      className={`p-2.5 rounded-2xl bg-slate-950/70 border text-left transition-all flex items-center justify-between group cursor-pointer ${
                        isSelecting
                          ? 'border-indigo-500 bg-indigo-950/40 ring-2 ring-indigo-500/30'
                          : 'border-slate-800 hover:border-indigo-500/50 hover:bg-slate-800/80'
                      }`}
                    >
                      <div className="flex items-center gap-2.5 min-w-0">
                        <div
                          className={`w-8 h-8 rounded-full flex items-center justify-center text-white text-xs font-bold shrink-0 shadow-xs ${p.avatarColor}`}
                        >
                          {p.name.charAt(0)}
                        </div>
                        <div className="truncate">
                          <div className="flex items-center gap-1.5">
                            <span className="text-xs font-bold text-slate-100 group-hover:text-white truncate">
                              {p.name.split(' (')[0]}
                            </span>
                          </div>
                          <div className="text-[10px] text-slate-400 flex items-center gap-1">
                            <span className="font-mono text-indigo-300">@{p.username}</span>
                            <span>•</span>
                            <span className="truncate max-w-[80px]">
                              {p.role === 'PLATFORM_SUPER_ADMIN'
                                ? 'Super Admin'
                                : p.role === 'ORGANIZATION_ADMIN'
                                ? 'Org Admin'
                                : p.teamNames[0]?.replace('Team ', '') || 'Member'}
                            </span>
                          </div>
                        </div>
                      </div>

                      <div className="shrink-0 pl-1">
                        {isSelecting ? (
                          <div className="w-4 h-4 border-2 border-indigo-400 border-t-transparent rounded-full animate-spin" />
                        ) : (
                          <ChevronRight className="w-4 h-4 text-slate-600 group-hover:text-indigo-400 group-hover:translate-x-0.5 transition-all" />
                        )}
                      </div>
                    </button>
                  );
                })}
              </div>

              {/* Bottom Live Demo Banner */}
              <div className="pt-2 border-t border-slate-800/80 flex items-center justify-between text-xs">
                <span className="text-[11px] text-slate-400">Want side-by-side chat?</span>
                <Link
                  href="/demo/chat"
                  className="flex items-center gap-1.5 text-xs font-bold text-indigo-400 hover:text-indigo-300 transition-colors"
                >
                  <SplitSquareVertical className="w-3.5 h-3.5" />
                  <span>Open 2-User Live Screen →</span>
                </Link>
              </div>
            </div>
          )}

          {/* TAB 2: MANUAL PASSWORD LOGIN */}
          {activeTab === 'manual' && (
            <form onSubmit={handleManualLogin} className="space-y-3.5 animate-in fade-in duration-200">
              {error && (
                <div className="p-3 rounded-xl bg-rose-950/60 border border-rose-800 text-rose-300 text-xs flex items-center gap-2">
                  <AlertCircle className="w-4 h-4 shrink-0 text-rose-400" />
                  <span>{error}</span>
                </div>
              )}

              <div>
                <label className="block text-[11px] font-bold uppercase tracking-wider text-slate-300 mb-1">
                  Email or Username Handle
                </label>
                <div className="relative">
                  <Mail className="w-4 h-4 absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-500" />
                  <input
                    type="text"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="e.g. rahul@example.com or @rahul"
                    className="w-full bg-slate-950 border border-slate-800 rounded-xl text-xs pl-10 pr-4 py-2.5 text-white placeholder-slate-500 focus:outline-none focus:border-indigo-500 transition-colors"
                    required
                  />
                </div>
              </div>

              <div>
                <label className="block text-[11px] font-bold uppercase tracking-wider text-slate-300 mb-1">
                  Password
                </label>
                <div className="relative">
                  <Lock className="w-4 h-4 absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-500" />
                  <input
                    type="password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    placeholder="••••••••"
                    className="w-full bg-slate-950 border border-slate-800 rounded-xl text-xs pl-10 pr-4 py-2.5 text-white placeholder-slate-500 focus:outline-none focus:border-indigo-500 transition-colors"
                    required
                  />
                </div>
              </div>

              {/* Quick Fill presets for convenience */}
              <div className="flex items-center gap-1.5 text-[10px] text-slate-400 pt-1">
                <span>Quick fill:</span>
                <button
                  type="button"
                  onClick={() => {
                    setEmail('rahul@example.com');
                    setPassword('demo1234');
                  }}
                  className="px-2 py-0.5 rounded-md bg-slate-800 hover:bg-slate-700 text-slate-300"
                >
                  Rahul (User)
                </button>
                <button
                  type="button"
                  onClick={() => {
                    setEmail('admin1@example.com');
                    setPassword('demo1234');
                  }}
                  className="px-2 py-0.5 rounded-md bg-slate-800 hover:bg-slate-700 text-slate-300"
                >
                  Alex (Admin)
                </button>
              </div>

              <Button
                type="submit"
                disabled={loading}
                className="w-full py-2.5 text-xs font-bold bg-indigo-600 hover:bg-indigo-700 text-white rounded-xl shadow-md shadow-indigo-600/30"
              >
                {loading ? 'Authenticating...' : 'Sign In with Password'}
              </Button>
            </form>
          )}

          {/* Footer Registration Link */}
          <div className="pt-2 border-t border-slate-800/80 text-center text-xs text-slate-500">
            Need a new account?{' '}
            <Link href="/register" className="font-bold text-indigo-400 hover:text-indigo-300">
              Register New User
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
