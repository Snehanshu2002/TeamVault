'use client';

import React from 'react';
import Link from 'next/link';
import { useAuth } from '@/lib/hooks/useAuth';
import { DEMO_PERSONAS } from '@/lib/services/mockDb';
import { 
  FolderLock, 
  ShieldCheck, 
  MessageSquare, 
  Users, 
  SplitSquareVertical, 
  ArrowRight, 
  Lock, 
  Radio, 
  Eye,
  CheckCircle,
  HelpCircle,
  Zap,
  Layers
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';

export default function LandingPage() {
  const { switchPersona } = useAuth();

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 flex flex-col selection:bg-indigo-500 selection:text-white">
      {/* Top Navbar */}
      <header className="border-b border-slate-800/80 bg-slate-950/80 backdrop-blur-md sticky top-0 z-30 px-6 py-4 flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-2xl bg-indigo-600 flex items-center justify-center text-white font-bold text-lg shadow-lg shadow-indigo-600/30">
            <FolderLock className="w-5 h-5" />
          </div>
          <div>
            <span className="font-extrabold text-base text-white tracking-tight block">
              Private Team Chat
            </span>
            <span className="text-[11px] text-slate-400 font-medium">
              Enterprise Communication &amp; Oversight SaaS
            </span>
          </div>
        </div>

        <div className="flex items-center gap-3">
          <Link href="/demo/chat">
            <Button variant="secondary" size="sm" className="hidden sm:flex items-center gap-1.5 bg-slate-900 text-indigo-300 border border-slate-700 hover:bg-slate-800">
              <SplitSquareVertical className="w-4 h-4 text-indigo-400" />
              <span>Live 2-User Demo</span>
            </Button>
          </Link>

          <Link href="/login">
            <Button size="sm">
              <span>Sign In / Demo Hub</span>
              <ArrowRight className="w-4 h-4" />
            </Button>
          </Link>
        </div>
      </header>

      {/* Hero Section */}
      <section className="py-16 sm:py-24 px-6 text-center max-w-5xl mx-auto relative overflow-hidden">
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[550px] h-[350px] bg-indigo-600/15 rounded-full blur-3xl pointer-events-none" />

        <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-indigo-950/80 border border-indigo-500/30 text-indigo-300 text-xs font-semibold mb-6">
          <Zap className="w-3.5 h-3.5 text-amber-400" />
          <span>Production-Quality SaaS Demo • Next.js 15 App Router &amp; Real-Time Architecture</span>
        </div>

        <h1 className="text-4xl sm:text-6xl font-black tracking-tight text-white leading-tight">
          Secure Team Chat with <br className="hidden sm:inline" />
          <span className="text-transparent bg-clip-text bg-linear-to-r from-indigo-400 via-indigo-200 to-teal-300">
            Multi-Admin Governance &amp; Strict Privacy
          </span>
        </h1>

        <p className="mt-5 text-sm sm:text-base text-slate-400 max-w-2xl mx-auto leading-relaxed">
          One-to-one private conversations strictly confined to authorized team boundaries. Users only see public handles (@username) while authorized administrators maintain transparent conversation oversight.
        </p>

        <div className="mt-8 flex flex-wrap items-center justify-center gap-3">
          <Link href="/demo/chat">
            <Button size="lg" className="text-sm font-bold shadow-lg shadow-indigo-600/25">
              <SplitSquareVertical className="w-4 h-4" />
              <span>Launch Live Two-Panel Demo</span>
            </Button>
          </Link>

          <Link href="/login">
            <Button variant="outline" size="lg" className="bg-slate-900 border-slate-700 text-slate-200 hover:bg-slate-800 text-sm">
              <span>Explore Role Dashboards</span>
            </Button>
          </Link>
        </div>
      </section>

      {/* 1-Click Interactive Persona Switcher Grid */}
      <section className="py-10 px-6 max-w-6xl mx-auto w-full">
        <div className="border border-slate-800 bg-slate-900/70 rounded-3xl p-6 sm:p-8 shadow-2xl backdrop-blur-xs">
          <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 mb-6">
            <div>
              <h2 className="text-lg font-bold text-white flex items-center gap-2">
                <Users className="w-5 h-5 text-indigo-400" />
                <span>Instant Demo Personas (1-Click Access)</span>
              </h2>
              <p className="text-xs text-slate-400 mt-1">
                Select any user or administrator to immediately explore their authorized dashboard and permissions:
              </p>
            </div>
            <Link
              href="/demo/chat"
              className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-indigo-600 text-white text-xs font-bold hover:bg-indigo-700 transition-colors shadow-xs"
            >
              <SplitSquareVertical className="w-3.5 h-3.5" />
              <span>Two-User Live Demo</span>
            </Link>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-3.5">
            {DEMO_PERSONAS.map((p) => (
              <button
                key={p.uid}
                onClick={() => switchPersona(p.uid)}
                className="text-left p-4 rounded-2xl bg-slate-950 border border-slate-800 hover:border-indigo-500/60 transition-all hover:shadow-lg group flex flex-col justify-between"
              >
                <div>
                  <div className="flex items-center justify-between gap-2 mb-2">
                    <span className="font-bold text-sm text-slate-200 group-hover:text-white">
                      {p.name}
                    </span>
                    <span
                      className={`text-[9px] font-bold px-2 py-0.5 rounded-md border ${
                        p.role === 'PLATFORM_SUPER_ADMIN'
                          ? 'bg-rose-950 text-rose-300 border-rose-800'
                          : p.role === 'ORGANIZATION_ADMIN'
                          ? 'bg-indigo-950 text-indigo-300 border-indigo-800'
                          : 'bg-emerald-950 text-emerald-300 border-emerald-800'
                      }`}
                    >
                      {p.role}
                    </span>
                  </div>
                  <p className="text-[11px] font-mono text-indigo-400 mb-2">@{p.username}</p>
                  <p className="text-xs text-slate-400 leading-snug">{p.description}</p>
                </div>

                <div className="mt-4 pt-3 border-t border-slate-800/80 flex items-center justify-between text-[10px] text-slate-500">
                  <span>{p.teamNames.join(', ')}</span>
                  <span className="text-indigo-400 font-semibold group-hover:translate-x-0.5 transition-transform flex items-center gap-1">
                    Enter <ArrowRight className="w-3 h-3" />
                  </span>
                </div>
              </button>
            ))}
          </div>
        </div>
      </section>

      {/* Core Architectural Pillars */}
      <section className="py-12 px-6 max-w-6xl mx-auto w-full">
        <div className="text-center mb-10">
          <h2 className="text-2xl font-bold text-white">System Architecture &amp; Core Guardrails</h2>
          <p className="text-xs text-slate-400 mt-1">Built to production specification for enterprise compliance</p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="p-6 rounded-3xl bg-slate-900 border border-slate-800 space-y-3">
            <div className="w-10 h-10 rounded-2xl bg-indigo-950 text-indigo-400 border border-indigo-800/60 flex items-center justify-center font-bold">
              <ShieldCheck className="w-5 h-5" />
            </div>
            <h3 className="text-base font-bold text-white">Multi-Admin Scope Isolation</h3>
            <p className="text-xs text-slate-400 leading-relaxed">
              Admins are strictly isolated. Admin 1 (Alex Vance) oversees Team Alpha and Team Beta; Admin 2 (Beatrice Stone) oversees Team Gamma with zero access to Team Alpha communications.
            </p>
          </div>

          <div className="p-6 rounded-3xl bg-slate-900 border border-slate-800 space-y-3">
            <div className="w-10 h-10 rounded-2xl bg-emerald-950 text-emerald-400 border border-emerald-800/60 flex items-center justify-center font-bold">
              <Lock className="w-5 h-5" />
            </div>
            <h3 className="text-base font-bold text-white">Zero Personal Data Exposure</h3>
            <p className="text-xs text-slate-400 leading-relaxed">
              When regular users view team members, only username (@handle), display name, and online presence are exposed. Emails, phone numbers, and metadata are scrubbed at the data layer.
            </p>
          </div>

          <div className="p-6 rounded-3xl bg-slate-900 border border-slate-800 space-y-3">
            <div className="w-10 h-10 rounded-2xl bg-amber-950 text-amber-400 border border-amber-800/60 flex items-center justify-center font-bold">
              <Eye className="w-5 h-5" />
            </div>
            <h3 className="text-base font-bold text-white">Transparent Admin Chat Oversight</h3>
            <p className="text-xs text-slate-400 leading-relaxed">
              Authorized administrators can review live 1-on-1 conversations occurring in their teams in read-only audit mode with live message streams, search, and audit trail logging.
            </p>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="mt-auto border-t border-slate-800/80 bg-slate-950 px-6 py-6 text-center text-xs text-slate-500">
        <p>Private Team Chat Management System SaaS • Demo Implementation</p>
      </footer>
    </div>
  );
}
