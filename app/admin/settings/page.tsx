'use client';

import React from 'react';
import { DashboardLayout } from '@/components/dashboard/DashboardLayout';
import { useAuth } from '@/lib/hooks/useAuth';
import { Card, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Settings, Shield, Lock, Bell, Database } from 'lucide-react';

export default function AdminSettingsPage() {
  const { user } = useAuth();

  return (
    <DashboardLayout allowedRoles={['ORGANIZATION_ADMIN', 'PLATFORM_SUPER_ADMIN']}>
      <div className="max-w-4xl space-y-6">
        <div>
          <h1 className="text-2xl font-black text-slate-900 tracking-tight flex items-center gap-2.5">
            <Settings className="w-6 h-6 text-indigo-600" />
            <span>Organization Settings &amp; Governance</span>
          </h1>
          <p className="text-xs text-slate-500 mt-1">
            Configure team collaboration policies, privacy guardrails, and audit thresholds for your organization.
          </p>
        </div>

        <Card>
          <CardHeader>
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-2xl bg-indigo-50 text-indigo-600 flex items-center justify-center font-bold">
                <Shield className="w-5 h-5" />
              </div>
              <div>
                <CardTitle>Organization Data Governance</CardTitle>
                <CardDescription>
                  Tenant Key: <strong className="font-mono text-slate-800">{user?.organization_id}</strong>
                </CardDescription>
              </div>
            </div>
          </CardHeader>

          <div className="space-y-3 text-xs">
            <div className="flex justify-between py-2 border-b border-slate-100">
              <span className="text-slate-500 font-medium">Multi-Tenant Boundary Mode</span>
              <Badge variant="success">PostgreSQL RLS Enforced</Badge>
            </div>
            <div className="flex justify-between py-2 border-b border-slate-100">
              <span className="text-slate-500 font-medium">1-to-1 Private Chat Policy</span>
              <Badge variant="primary">Restricted to Shared Team Members</Badge>
            </div>
            <div className="flex justify-between py-2 border-b border-slate-100">
              <span className="text-slate-500 font-medium">Public Safe Profile Masking</span>
              <Badge variant="success">Active (@handle &amp; Display Name only)</Badge>
            </div>
            <div className="flex justify-between py-2">
              <span className="text-slate-500 font-medium">Admin Oversight Logging</span>
              <Badge variant="warning">Audit Trail Enabled (VIEW_CONVERSATION)</Badge>
            </div>
          </div>
        </Card>
      </div>
    </DashboardLayout>
  );
}
