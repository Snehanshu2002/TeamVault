'use client';

import React from 'react';
import { DashboardLayout } from '@/components/dashboard/DashboardLayout';
import { useAuth } from '@/lib/hooks/useAuth';
import { AuditLogTable } from '@/components/audit/AuditLogTable';
import { AuditService } from '@/lib/services/auditService';
import { History, ShieldCheck } from 'lucide-react';

export default function AdminAuditLogsPage() {
  const { user } = useAuth();
  const logs = AuditService.getLogs(user);

  return (
    <DashboardLayout allowedRoles={['ORGANIZATION_ADMIN', 'PLATFORM_SUPER_ADMIN']}>
      <div className="space-y-6">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
          <div>
            <h1 className="text-2xl font-black text-slate-900 tracking-tight flex items-center gap-2.5">
              <History className="w-6 h-6 text-indigo-600" />
              <span>Administrative Audit Trail</span>
            </h1>
            <p className="text-xs text-slate-500 mt-1">
              Immutable record of administrative actions, team roster changes, and oversight accesses.
            </p>
          </div>

          <div className="flex items-center gap-2 px-3 py-1.5 rounded-full bg-indigo-50 border border-indigo-200 text-indigo-800 text-xs font-semibold">
            <ShieldCheck className="w-3.5 h-3.5 text-indigo-600" />
            <span>Scope: Admin Actions ({logs.length} Recorded)</span>
          </div>
        </div>

        <AuditLogTable logs={logs} />
      </div>
    </DashboardLayout>
  );
}
