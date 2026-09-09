'use client';

import React, { useState } from 'react';
import { AuthService } from '@/lib/services/authService';
import { UserRole } from '@/lib/types';
import { Button } from '@/components/ui/button';
import { FolderLock, Mail, Lock, User as UserIcon, AtSign, AlertCircle } from 'lucide-react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';

export default function RegisterPage() {
  const [displayName, setDisplayName] = useState('');
  const [username, setUsername] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const router = useRouter();

  const handleRegister = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError('');
    try {
      // In production SaaS, public self-registration strictly provisions standard USER role.
      // Administrative privileges must only be granted by existing authorized admins.
      const user = await AuthService.register(email, password, displayName, username, 'USER');
      const path = AuthService.getDashboardPathForRole(user.role);
      router.push(path);
    } catch (err: any) {
      setError(err?.message || 'Registration failed.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-slate-950 flex flex-col justify-center py-12 sm:px-6 lg:px-8 relative overflow-hidden">
      <div className="sm:mx-auto sm:w-full sm:max-w-md relative z-10">
        <div className="flex justify-center">
          <div className="w-12 h-12 rounded-2xl bg-indigo-600 flex items-center justify-center text-white font-black text-xl shadow-xl shadow-indigo-600/30">
            <FolderLock className="w-6 h-6" />
          </div>
        </div>
        <h2 className="mt-4 text-center text-2xl font-black tracking-tight text-white">
          Create Demo Account
        </h2>
        <p className="mt-1 text-center text-xs text-slate-400">
          Join the Private Team Chat Platform
        </p>
      </div>

      <div className="mt-8 sm:mx-auto sm:w-full sm:max-w-md relative z-10 px-4 sm:px-0">
        <div className="bg-slate-900 border border-slate-800 py-8 px-6 sm:px-10 shadow-2xl rounded-3xl space-y-5">
          <form onSubmit={handleRegister} className="space-y-4">
            {error && (
              <div className="p-3 rounded-xl bg-rose-950/50 border border-rose-800/80 text-rose-300 text-xs flex items-center gap-2">
                <AlertCircle className="w-4 h-4 shrink-0 text-rose-400" />
                <span>{error}</span>
              </div>
            )}

            <div>
              <label className="block text-xs font-semibold uppercase tracking-wider text-slate-300 mb-1.5">
                Full Name
              </label>
              <div className="relative">
                <UserIcon className="w-4 h-4 absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-500" />
                <input
                  type="text"
                  value={displayName}
                  onChange={(e) => setDisplayName(e.target.value)}
                  placeholder="e.g. Vikram Seth"
                  className="w-full bg-slate-950 border border-slate-800 rounded-xl text-sm pl-10 pr-4 py-2.5 text-white placeholder-slate-500 focus:outline-none focus:border-indigo-500"
                  required
                />
              </div>
            </div>

            <div>
              <label className="block text-xs font-semibold uppercase tracking-wider text-slate-300 mb-1.5">
                Username (Public Handle)
              </label>
              <div className="relative">
                <AtSign className="w-4 h-4 absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-500" />
                <input
                  type="text"
                  value={username}
                  onChange={(e) => setUsername(e.target.value)}
                  placeholder="e.g. vikram"
                  className="w-full bg-slate-950 border border-slate-800 rounded-xl text-sm pl-10 pr-4 py-2.5 text-white placeholder-slate-500 focus:outline-none focus:border-indigo-500 font-mono"
                  required
                />
              </div>
            </div>

            <div>
              <label className="block text-xs font-semibold uppercase tracking-wider text-slate-300 mb-1.5">
                Email Address
              </label>
              <div className="relative">
                <Mail className="w-4 h-4 absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-500" />
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="vikram@example.com"
                  className="w-full bg-slate-950 border border-slate-800 rounded-xl text-sm pl-10 pr-4 py-2.5 text-white placeholder-slate-500 focus:outline-none focus:border-indigo-500"
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
                  className="w-full bg-slate-950 border border-slate-800 rounded-xl text-sm pl-10 pr-4 py-2.5 text-white placeholder-slate-500 focus:outline-none focus:border-indigo-500"
                  required
                />
              </div>
            </div>

            <div className="p-3 bg-slate-950/80 border border-slate-800/80 rounded-xl text-xs text-slate-400 flex items-center justify-between">
              <span>Account Type</span>
              <span className="font-semibold text-indigo-400 bg-indigo-950/60 px-2 py-0.5 rounded border border-indigo-800/50">Team Member</span>
            </div>

            <Button
              type="submit"
              disabled={loading}
              className="w-full py-2.5 text-sm font-bold mt-2"
            >
              {loading ? 'Registering...' : 'Create Account'}
            </Button>
          </form>

          <div className="text-center text-xs text-slate-500">
            Already have an account?{' '}
            <Link href="/login" className="font-semibold text-indigo-400 hover:text-indigo-300">
              Back to Sign In
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
