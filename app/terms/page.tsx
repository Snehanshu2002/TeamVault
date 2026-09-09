'use client';

import React from 'react';
import Link from 'next/link';
import { ArrowLeft, ShieldCheck } from 'lucide-react';
import { Button } from '@/components/ui/button';

export default function TermsPage() {
  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 flex flex-col">
      <header className="border-b border-slate-800 px-6 py-4 flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="w-8 h-8 rounded-xl bg-indigo-600 flex items-center justify-center text-white font-bold text-sm">
            PT
          </div>
          <span className="font-bold text-sm text-white">Private Team Chat</span>
        </div>
        <Link href="/">
          <Button variant="outline" size="sm" className="bg-slate-900 border-slate-700 text-slate-300">
            <ArrowLeft className="w-4 h-4" />
            <span>Back to Home</span>
          </Button>
        </Link>
      </header>

      <main className="flex-1 max-w-4xl mx-auto px-6 py-12 space-y-8">
        <div>
          <h1 className="text-3xl sm:text-4xl font-black text-white">Terms of Service</h1>
          <p className="text-xs text-slate-400 mt-2">
            Multi-Tenant Enterprise Communication Agreement
          </p>
        </div>

        <div className="space-y-6 text-xs text-slate-300 leading-relaxed bg-slate-900 border border-slate-800 rounded-3xl p-6 sm:p-8">
          <div>
            <h2 className="text-base font-bold text-white mb-2">1. Acceptance of Terms</h2>
            <p>
              By accessing or using the Private Team Chat platform, you agree to be bound by these Terms of Service. If you are using the service on behalf of an organization, you represent that you have the authority to bind that entity.
            </p>
          </div>

          <div>
            <h2 className="text-base font-bold text-white mb-2">2. Multi-Tenant Isolation &amp; Team Boundaries</h2>
            <p>
              Users are restricted to communication within their assigned organization and teams. Any attempt to bypass tenant boundaries, impersonate senders, or access unauthorized channels is strictly prohibited.
            </p>
          </div>

          <div>
            <h2 className="text-base font-bold text-white mb-2">3. Organizational Oversight</h2>
            <p>
              Authorized organization administrators maintain transparent audit oversight over team communications for compliance and quality assurance.
            </p>
          </div>
        </div>
      </main>
    </div>
  );
}
