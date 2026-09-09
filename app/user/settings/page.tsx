'use client';

import React from 'react';
import { DashboardLayout } from '@/components/dashboard/DashboardLayout';
import { useAuth } from '@/lib/hooks/useAuth';
import { Card, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Settings, Lock, ShieldCheck, Bell, UserCheck } from 'lucide-react';

export default function UserSettingsPage() {
  const { user } = useAuth();

  return (
    <DashboardLayout allowedRoles={['USER', 'ORGANIZATION_ADMIN', 'PLATFORM_SUPER_ADMIN']}>
      <div className="max-w-3xl space-y-6">
        <div>
          <h1 className="text-2xl font-black text-slate-900 tracking-tight flex items-center gap-2.5">
            <Settings className="w-6 h-6 text-indigo-600" />
            <span>Account &amp; Notification Settings</span>
          </h1>
          <p className="text-xs text-slate-500 mt-1">
            Manage your personal preferences and privacy boundaries.
          </p>
        </div>

        <Card>
          <CardHeader>
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-2xl bg-indigo-50 text-indigo-600 flex items-center justify-center font-bold">
                <Bell className="w-5 h-5" />
              </div>
              <div>
                <CardTitle>In-App Notifications</CardTitle>
                <CardDescription>Real-time notifications for new incoming private messages.</CardDescription>
              </div>
            </div>
          </CardHeader>

          <div className="space-y-3 text-xs">
            <div className="flex justify-between items-center py-2 border-b border-slate-100">
              <div>
                <p className="font-bold text-slate-900">Direct Message Alerts</p>
                <p className="text-slate-500">Show in-app toast badges when teammates send messages</p>
              </div>
              <Badge variant="success">Enabled</Badge>
            </div>
            <div className="flex justify-between items-center py-2 border-b border-slate-100">
              <div>
                <p className="font-bold text-slate-900">Online Presence Indicator</p>
                <p className="text-slate-500">Display active online presence to fellow team members</p>
              </div>
              <Badge variant="success">Active</Badge>
            </div>
            <div className="flex justify-between items-center py-2">
              <div>
                <p className="font-bold text-slate-900">Zero Telemetry Compliance</p>
                <p className="text-slate-500">No background GPS or employee monitoring</p>
              </div>
              <Badge variant="success">Protected</Badge>
            </div>
          </div>
        </Card>
      </div>
    </DashboardLayout>
  );
}
