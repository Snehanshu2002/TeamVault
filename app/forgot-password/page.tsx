'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { FolderLock, Mail, ArrowLeft, CheckCircle2, AlertCircle } from 'lucide-react';
import { Button } from '@/components/ui/button';

export default function ForgotPasswordPage() {
  const [email, setEmail] = useState('');
  const [submitted, setSubmitted] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!email.trim()) return;
    setSubmitted(true);
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
          Reset Password
        </h2>
        <p className="mt-1 text-center text-xs text-slate-400">
          Enter your email address to receive password recovery instructions.
        </p>
      </div>

      <div className="mt-8 sm:mx-auto sm:w-full sm:max-w-md relative z-10 px-4 sm:px-0">
        <div className="bg-slate-900 border border-slate-800 py-8 px-6 sm:px-10 shadow-2xl rounded-3xl space-y-5">
          {submitted ? (
            <div className="p-4 rounded-2xl bg-emerald-950/60 border border-emerald-800 text-center space-y-3">
              <CheckCircle2 className="w-8 h-8 text-emerald-400 mx-auto" />
              <h3 className="text-sm font-bold text-white">Recovery Email Sent</h3>
              <p className="text-xs text-emerald-300">
                If an account exists for <strong className="text-white">{email}</strong>, you will receive password reset instructions.
              </p>
              <Link href="/login" className="inline-block mt-2">
                <Button size="sm" variant="outline" className="text-xs">
                  Back to Login
                </Button>
              </Link>
            </div>
          ) : (
            <form onSubmit={handleSubmit} className="space-y-4">
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
                    placeholder="user@example.com"
                    className="w-full bg-slate-950 border border-slate-800 rounded-xl text-sm pl-10 pr-4 py-2.5 text-white placeholder-slate-500 focus:outline-none focus:border-indigo-500"
                    required
                  />
                </div>
              </div>

              <Button type="submit" className="w-full py-2.5 text-sm font-bold">
                Send Reset Instructions
              </Button>

              <div className="text-center pt-2">
                <Link
                  href="/login"
                  className="text-xs font-semibold text-slate-400 hover:text-white flex items-center justify-center gap-1"
                >
                  <ArrowLeft className="w-3.5 h-3.5" />
                  <span>Back to Sign In</span>
                </Link>
              </div>
            </form>
          )}
        </div>
      </div>
    </div>
  );
}
