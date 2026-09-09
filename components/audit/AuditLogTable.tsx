'use client';

import React, { useState } from 'react';
import { AuditLog } from '@/lib/types';
import { Badge } from '@/components/ui/badge';
import { Search, Filter } from 'lucide-react';
import { format, parseISO } from 'date-fns';

export interface AuditLogTableProps {
  logs: AuditLog[];
}

export const AuditLogTable: React.FC<AuditLogTableProps> = ({ logs }) => {
  const [search, setSearch] = useState('');
  const [actionFilter, setActionFilter] = useState('ALL');

  const formatTimestamp = (isoString?: string) => {
    if (!isoString) return '';
    try {
      return format(parseISO(isoString), 'MMM d, yyyy • h:mm:ss a');
    } catch {
      return '';
    }
  };

  const getActionBadge = (action: string) => {
    if (action.includes('CREATE')) return 'success';
    if (action.includes('DELETE') || action.includes('REMOVE') || action.includes('SUSPEND')) return 'danger';
    if (action.includes('VIEW') || action.includes('AUDIT')) return 'warning';
    return 'primary';
  };

  const filteredLogs = logs.filter((log) => {
    const matchesSearch =
      log.actor_name.toLowerCase().includes(search.toLowerCase()) ||
      log.action.toLowerCase().includes(search.toLowerCase()) ||
      (log.target_name || '').toLowerCase().includes(search.toLowerCase());

    const matchesFilter = actionFilter === 'ALL' || log.action === actionFilter;

    return matchesSearch && matchesFilter;
  });

  return (
    <div className="bg-white border border-slate-200 rounded-2xl overflow-hidden shadow-xs">
      {/* Search & Filter Header */}
      <div className="p-4 border-b border-slate-100 flex flex-col sm:flex-row items-center justify-between gap-3">
        <div className="relative w-full sm:w-72">
          <Search className="w-4 h-4 absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400" />
          <input
            type="text"
            placeholder="Search audit trail..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full pl-9 pr-4 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs text-slate-900 placeholder-slate-400 focus:outline-none focus:bg-white focus:border-indigo-500 transition-colors"
          />
        </div>

        <div className="flex items-center gap-2 w-full sm:w-auto">
          <Filter className="w-3.5 h-3.5 text-slate-400" />
          <select
            value={actionFilter}
            onChange={(e) => setActionFilter(e.target.value)}
            className="bg-slate-50 border border-slate-200 rounded-xl text-xs px-3 py-2 text-slate-700 focus:outline-none focus:border-indigo-500"
          >
            <option value="ALL">All Actions</option>
            <option value="CREATE_ORGANIZATION">CREATE_ORGANIZATION</option>
            <option value="CREATE_TEAM">CREATE_TEAM</option>
            <option value="ADD_TEAM_MEMBER">ADD_TEAM_MEMBER</option>
            <option value="REMOVE_TEAM_MEMBER">REMOVE_TEAM_MEMBER</option>
            <option value="VIEW_CONVERSATION">VIEW_CONVERSATION</option>
            <option value="DELETE_TEAM">DELETE_TEAM</option>
          </select>
        </div>
      </div>

      {/* Table */}
      <div className="overflow-x-auto">
        <table className="w-full text-left text-xs text-slate-600">
          <thead className="bg-slate-50/75 border-b border-slate-100 text-[11px] font-bold uppercase tracking-wider text-slate-500">
            <tr>
              <th className="py-3 px-4">Timestamp</th>
              <th className="py-3 px-4">Actor</th>
              <th className="py-3 px-4">Role</th>
              <th className="py-3 px-4">Action</th>
              <th className="py-3 px-4">Target</th>
              <th className="py-3 px-4">Details</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-100">
            {filteredLogs.length === 0 ? (
              <tr>
                <td colSpan={6} className="py-8 text-center text-slate-400">
                  No audit log entries recorded.
                </td>
              </tr>
            ) : (
              filteredLogs.map((log) => (
                <tr key={log.id} className="hover:bg-slate-50/60 transition-colors">
                  <td className="py-3 px-4 text-slate-500 whitespace-nowrap font-mono text-[11px]">
                    {formatTimestamp(log.created_at)}
                  </td>
                  <td className="py-3 px-4 font-bold text-slate-900">{log.actor_name}</td>
                  <td className="py-3 px-4">
                    <Badge variant={log.actor_role === 'PLATFORM_SUPER_ADMIN' ? 'danger' : 'primary'}>
                      {log.actor_role}
                    </Badge>
                  </td>
                  <td className="py-3 px-4">
                    <Badge variant={getActionBadge(log.action) as any}>{log.action}</Badge>
                  </td>
                  <td className="py-3 px-4 font-medium text-slate-800">
                    {log.target_name || log.target_id}
                  </td>
                  <td className="py-3 px-4 text-slate-500 max-w-xs truncate font-mono text-[10px]">
                    {log.details ? JSON.stringify(log.details) : 'System event'}
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
};
