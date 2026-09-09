'use client';

import React from 'react';
import { DashboardLayout } from '@/components/dashboard/DashboardLayout';
import { useAuth } from '@/lib/hooks/useAuth';
import { isFirebaseConfigured } from '@/lib/firebase/config';
import { mockSupabase } from '@/lib/supabase/mockSupabase';
import { Card, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Settings, ShieldCheck, Database, RefreshCw, Lock, Sparkles, CheckCircle2 } from 'lucide-react';

export default function SuperAdminSettingsPage() {
  const { user } = useAuth();

  const handleResetData = () => {
    if (confirm('Are you sure you want to reset all mock demo data to the initial state?')) {
      mockSupabase.resetToDefaults();
      window.location.reload();
    }
  };

  return (
    <DashboardLayout allowedRoles={['PLATFORM_SUPER_ADMIN']}>
      <div className="max-w-4xl space-y-6">
        <div>
          <h1 className="text-2xl font-black text-slate-900 tracking-tight flex items-center gap-2.5">
            <Settings className="w-6 h-6 text-rose-600" />
            <span>System Settings &amp; Engine Status</span>
          </h1>
          <p className="text-xs text-slate-500 mt-1">
            Global system configurations, data engine health, and security boundaries.
          </p>
        </div>

        {/* Dual Engine Health Card */}
        <Card>
          <CardHeader>
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-2xl bg-indigo-50 text-indigo-600 flex items-center justify-center font-bold">
                <Database className="w-5 h-5" />
              </div>
              <div>
                <CardTitle>Data Engine &amp; Real-Time Sync Status</CardTitle>
                <CardDescription>
                  Dual-Engine Architecture: Live Firebase Firestore or Multi-Tab Broadcast Sync.
                </CardDescription>
              </div>
            </div>
            <Badge variant={isFirebaseConfigured ? 'success' : 'primary'} dot>
              {isFirebaseConfigured ? 'Live Firebase Active' : 'Interactive Demo Engine Active'}
            </Badge>
          </CardHeader>

          <div className="space-y-3 text-xs">
            <div className="flex justify-between py-2 border-b border-slate-100">
              <span className="text-slate-500 font-medium">Real-Time Messaging Protocol</span>
              <span className="font-bold text-slate-900">
                {isFirebaseConfigured ? 'Firebase onSnapshot Listener' : 'BroadcastChannel + LocalStorage Event Sync'}
              </span>
            </div>
            <div className="flex justify-between py-2 border-b border-slate-100">
              <span className="text-slate-500 font-medium">Multi-Tab Session Isolation</span>
              <Badge variant="success">Enabled (SessionStorage + Dual Token)</Badge>
            </div>
            <div className="flex justify-between py-2 border-b border-slate-100">
              <span className="text-slate-500 font-medium">Privacy Data Layer Sanitizer</span>
              <Badge variant="success">Active (Email/Phone Scrubbed)</Badge>
            </div>
            <div className="flex justify-between py-2">
              <span className="text-slate-500 font-medium">Zero Tracking Assurance</span>
              <Badge variant="success">Compliant (No GPS/Telemetry in MVP)</Badge>
            </div>
          </div>
        </Card>

        {/* Demo Seed Reset Card */}
        <Card>
          <CardHeader>
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-2xl bg-amber-50 text-amber-600 flex items-center justify-center font-bold">
                <RefreshCw className="w-5 h-5" />
              </div>
              <div>
                <CardTitle>Reset Demo Seed Data</CardTitle>
                <CardDescription>
                  Re-initialize teams, demo users (Rahul, Amit, Priya, etc.), and pre-seeded conversation transcripts.
                </CardDescription>
              </div>
            </div>
          </CardHeader>

          <p className="text-xs text-slate-600 mb-4">
            This will wipe any newly added temporary teams or chat messages in your local browser storage and return all personas to their default clean demo state.
          </p>

          <Button variant="danger" size="sm" onClick={handleResetData}>
            <RefreshCw className="w-3.5 h-3.5" />
            <span>Reset Demo Database to Initial State</span>
          </Button>
        </Card>
      </div>
    </DashboardLayout>
  );
}
