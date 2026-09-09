'use client';

import React from 'react';
import Link from 'next/link';
import { FolderLock, ArrowLeft, ShieldCheck, Lock, Eye, CheckCircle2 } from 'lucide-react';
import { Button } from '@/components/ui/button';

export default function PrivacyPage() {
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
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-emerald-950 border border-emerald-500/40 text-emerald-400 text-xs font-semibold mb-3">
            <ShieldCheck className="w-4 h-4" />
            <span>Enterprise Privacy &amp; Data Governance Policy</span>
          </div>
          <h1 className="text-3xl sm:text-4xl font-black text-white">Privacy &amp; Transparency Statement</h1>
          <p className="text-xs text-slate-400 mt-2">
            Last Updated: September 2026 • Multi-Tenant Enterprise Compliance
          </p>
        </div>

        <section className="p-6 rounded-3xl bg-slate-900 border border-slate-800 space-y-4">
          <h2 className="text-lg font-bold text-white flex items-center gap-2">
            <Lock className="w-5 h-5 text-indigo-400" />
            <span>Zero Personal Data Exposure to Fellow Team Members</span>
          </h2>
          <p className="text-xs text-slate-300 leading-relaxed">
            When standard users view team members or collaborate in private channels, the application strictly exposes only public-safe attributes: <strong>Username handle (@handle)</strong>, <strong>Display Name</strong>, and <strong>Online Presence</strong>.
          </p>
          <p className="text-xs text-slate-300 leading-relaxed">
            Personal contact information (such as email addresses, phone numbers, personal documents, and metadata) is logically and architecturally separated in isolated PostgreSQL tables (`user_private_profiles`) with strict Row Level Security (RLS) policies.
          </p>
        </section>

        <section className="p-6 rounded-3xl bg-slate-900 border border-slate-800 space-y-4">
          <h2 className="text-lg font-bold text-white flex items-center gap-2">
            <Eye className="w-5 h-5 text-amber-400" />
            <span>Authorized Administrator Conversation Oversight Policy</span>
          </h2>
          <p className="text-xs text-slate-300 leading-relaxed">
            Private conversations are visible only to the participating users and authorized organization administrators according to organizational governance policy.
          </p>
          <p className="text-xs text-slate-300 leading-relaxed">
            Administrators can view 1-to-1 conversation transcripts in read-only audit mode solely within teams under their explicit jurisdiction. Every administrative inspection is permanently recorded in the immutable audit log (`VIEW_CONVERSATION`).
          </p>
        </section>

        <section className="p-6 rounded-3xl bg-slate-900 border border-slate-800 space-y-4">
          <h2 className="text-lg font-bold text-white flex items-center gap-2">
            <CheckCircle2 className="w-5 h-5 text-emerald-400" />
            <span>Zero Tracking Assurance in Current MVP</span>
          </h2>
          <p className="text-xs text-slate-300 leading-relaxed">
            The platform does NOT collect GPS coordinates, device tracking, employee surveillance telemetry, or behavioral tracking in this version. Any future telemetry or integrations will require explicit administrator opt-in and consent.
          </p>
        </section>
      </main>
    </div>
  );
}
