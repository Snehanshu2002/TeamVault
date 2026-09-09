'use client';

import React from 'react';
import { DashboardLayout } from '@/components/dashboard/DashboardLayout';
import { useAuth } from '@/lib/hooks/useAuth';
import { DeviceTrackingView } from '@/components/tracking/DeviceTrackingView';
import { Laptop, Activity, ShieldCheck, Radio } from 'lucide-react';

export default function SuperAdminTrackingPage() {
  const { user } = useAuth();

  return (
    <DashboardLayout allowedRoles={['PLATFORM_SUPER_ADMIN']}>
      <div className="space-y-6">
        {/* Top Header */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-linear-to-r from-rose-950 via-slate-900 to-indigo-950 p-6 rounded-3xl text-white border border-rose-900/40 shadow-xl">
          <div>
            <div className="flex items-center gap-2 mb-1">
              <span className="text-xs font-bold px-2 py-0.5 rounded-md bg-rose-500/30 border border-rose-400/40 text-rose-200">
                GLOBAL PLATFORM TELEMETRY
              </span>
            </div>
            <h1 className="text-2xl font-black flex items-center gap-2.5">
              <Laptop className="w-7 h-7 text-rose-400" />
              <span>Global Device &amp; Session Tracking</span>
            </h1>
            <p className="text-xs text-slate-300 mt-1 max-w-2xl">
              Cross-tenant device tracking across all organizations, active laptop workstations, and session lifecycle controls.
            </p>
          </div>

          <div className="flex items-center gap-2">
            <div className="flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-emerald-950/80 border border-emerald-500/40 text-emerald-400 text-xs font-bold shadow-xs">
              <Radio className="w-3.5 h-3.5 animate-pulse" />
              <span>GLOBAL ROSTER ACTIVE</span>
            </div>
          </div>
        </div>

        {/* Global Device Tracking View */}
        <DeviceTrackingView
          currentUser={user}
          viewerRole="PLATFORM_SUPER_ADMIN"
        />
      </div>
    </DashboardLayout>
  );
}
