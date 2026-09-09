'use client';

import React, { useState } from 'react';
import { useAuth } from '@/lib/hooks/useAuth';
import { AuthService } from '@/lib/services/authService';
import { DEMO_PERSONAS } from '@/lib/services/mockDb';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { 
  FolderLock, 
  Sparkles, 
  ArrowRight, 
  Mail, 
  Lock, 
  ShieldCheck, 
  SplitSquareVertical, 
  AlertCircle 
} from 'lucide-react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';

export default function LoginPage() {
  const [email, setEmail] = useState('rahul@example.com');
  const [password, setPassword] = useState('demo1234');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const { switchPersona } = useAuth();
  const router = useRouter();

  const handleLogin = async (e: React.FormEvent) => {
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

  const handleQuickPersona = (personaUid: string) => {
    switchPersona(personaUid);
  };

  return (
    <div className="min-h-screen bg-slate-950 flex flex-col justify-center py-12 sm:px-6 lg:px-8 relative overflow-hidden">
      {/* Decorative Glow */}
      <div className="absolute top-1/4 left-1/2 -translate-x-1/2 -translate-y-1/2 w-96 h-96 bg-indigo-600/20 rounded-full blur-3xl pointer-events-none" />

      <div className="sm:mx-auto sm:w-full sm:max-w-md relative z-10">
        <div className="flex justify-center">
          <div className="w-14 h-14 rounded-2xl bg-indigo-600 flex items-center justify-center text-white font-black text-2xl shadow-xl shadow-indigo-600/30">
            <FolderLock className="w-7 h-7" />
          </div>
        </div>
        <h2 className="mt-4 text-center text-2xl font-black tracking-tight text-white">
          Private Team Chat Management
        </h2>
        <p className="mt-1 text-center text-xs text-slate-400">
          Multi-Admin Governance • Privacy Isolation • Real-Time Messaging
        </p>
      </div>

      <div className="mt-8 sm:mx-auto sm:w-full sm:max-w-xl relative z-10 px-4 sm:px-0">
        <div className="bg-slate-900 border border-slate-800 py-8 px-6 sm:px-10 shadow-2xl rounded-3xl space-y-6">
          {/* Quick Demo Switcher Section */}
          <div className="bg-slate-950/80 border border-indigo-900/50 rounded-2xl p-4">
            <div className="flex items-center justify-between mb-2">
              <span className="text-xs font-bold text-indigo-300 uppercase tracking-wider flex items-center gap-1.5">
                <Sparkles className="w-3.5 h-3.5 text-amber-400" />
                1-Click Demo Login
              </span>
              <Link
                href="/demo/chat"
                className="text-[11px] font-semibold text-indigo-400 hover:text-indigo-300 flex items-center gap-1"
              >
                <SplitSquareVertical className="w-3 h-3" />
                2-Panel Live Demo
              </Link>
            </div>
            <p className="text-[11px] text-slate-400 mb-3">
              Click any persona to instantly log into their dashboard:
            </p>

            <div className="grid grid-cols-3 gap-2">
              {DEMO_PERSONAS.map((p) => (
                <button
                  key={p.uid}
                  type="button"
                  onClick={() => handleQuickPersona(p.uid)}
                  className="flex flex-col items-start p-2 rounded-xl bg-slate-900 hover:bg-slate-800 border border-slate-800 hover:border-indigo-500/50 transition-all text-left group"
                >
                  <div className="flex items-center gap-1.5 w-full truncate">
                    <span className="w-2 h-2 rounded-full bg-indigo-500 shrink-0" />
                    <span className="text-xs font-bold text-slate-200 group-hover:text-white truncate">
                      {p.name.split(' ')[0]}
                    </span>
                  </div>
                  <span className="text-[9px] text-indigo-400 font-mono mt-0.5">
                    @{p.username}
                  </span>
                  <span className="text-[8px] text-slate-400 uppercase font-bold mt-1">
                    {p.role}
                  </span>
                </button>
              ))}
            </div>
          </div>

          {/* Form */}
          <form onSubmit={handleLogin} className="space-y-4">
            {error && (
              <div className="p-3 rounded-xl bg-rose-950/50 border border-rose-800/80 text-rose-300 text-xs flex items-center gap-2">
                <AlertCircle className="w-4 h-4 shrink-0 text-rose-400" />
                <span>{error}</span>
              </div>
            )}

            <div>
              <label className="block text-xs font-semibold uppercase tracking-wider text-slate-300 mb-1.5">
                Email or Username
              </label>
              <div className="relative">
                <Mail className="w-4 h-4 absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-500" />
                <input
                  type="text"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="e.g. rahul@example.com"
                  className="w-full bg-slate-950 border border-slate-800 rounded-xl text-sm pl-10 pr-4 py-2.5 text-white placeholder-slate-500 focus:outline-none focus:border-indigo-500 transition-colors"
                  required
                />
              </div>
            </div>

            <div>
              <label className="block text-xs font-semibold uppercase tracking-wider text-slate-300 mb-1.5">
                Password
              </label>
              <div className="relative">
                <Lock className="w-4 h-4 absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-500" />
                <input
                  type="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="••••••••"
                  className="w-full bg-slate-950 border border-slate-800 rounded-xl text-sm pl-10 pr-4 py-2.5 text-white placeholder-slate-500 focus:outline-none focus:border-indigo-500 transition-colors"
                  required
                />
              </div>
            </div>

            <Button
              type="submit"
              disabled={loading}
              className="w-full py-2.5 text-sm font-bold mt-2"
            >
              {loading ? 'Authenticating...' : 'Sign In'}
            </Button>
          </form>

          <div className="text-center text-xs text-slate-500">
            Don&apos;t have an account?{' '}
            <Link href="/register" className="font-semibold text-indigo-400 hover:text-indigo-300">
              Register New User
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
