'use client';

import React from 'react';
import { DashboardLayout } from '@/components/dashboard/DashboardLayout';
import { useAuth } from '@/lib/hooks/useAuth';
import { AuditLogTable } from '@/components/audit/AuditLogTable';
import { AuditService } from '@/lib/services/auditService';
import { History, ShieldCheck } from 'lucide-react';

export default function SuperAdminAuditLogsPage() {
  const { user } = useAuth();
  const logs = AuditService.getLogs(user);

  return (
    <DashboardLayout allowedRoles={['PLATFORM_SUPER_ADMIN']}>
      <div className="space-y-6">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
          <div>
            <h1 className="text-2xl font-black text-slate-900 tracking-tight flex items-center gap-2.5">
              <History className="w-6 h-6 text-rose-600" />
              <span>System-Wide Audit Logs</span>
            </h1>
            <p className="text-xs text-slate-500 mt-1">
              Complete chronological audit trail of all administrator actions across the platform.
            </p>
          </div>

          <div className="flex items-center gap-2 px-3 py-1.5 rounded-full bg-rose-50 border border-rose-200 text-rose-800 text-xs font-semibold">
            <ShieldCheck className="w-3.5 h-3.5 text-rose-600" />
            <span>Global Log Entries ({logs.length})</span>
          </div>
        </div>

        <AuditLogTable logs={logs} />
      </div>
    </DashboardLayout>
  );
}
