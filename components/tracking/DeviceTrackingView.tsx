'use client';

import React, { useState, useEffect } from 'react';
import { UserSession, ActivityEvent, Profile } from '@/lib/types';
import { TrackingService } from '@/lib/services/trackingService';
import { Modal } from '@/components/ui/modal';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { 
  Laptop, 
  Monitor, 
  Activity, 
  ShieldCheck, 
  Radio, 
  Wifi, 
  Globe, 
  Clock, 
  MessageSquare, 
  Search, 
  Filter, 
  PowerOff, 
  Eye, 
  AlertTriangle,
  Layers,
  MapPin,
  Compass,
  Navigation,
  CheckCircle2,
  Lock,
  Signal
} from 'lucide-react';
import { format, parseISO } from 'date-fns';

export interface DeviceTrackingViewProps {
  currentUser: Profile | null;
  viewerRole: 'ORGANIZATION_ADMIN' | 'PLATFORM_SUPER_ADMIN';
}

export const DeviceTrackingView: React.FC<DeviceTrackingViewProps> = ({
  currentUser,
  viewerRole,
}) => {
  const [sessions, setSessions] = useState<UserSession[]>([]);
  const [activityLogs, setActivityLogs] = useState<ActivityEvent[]>([]);
  const [activeTab, setActiveTab] = useState<'roster' | 'map' | 'events'>('roster');
  const [search, setSearch] = useState('');
  const [statusFilter, setStatusFilter] = useState<'ALL' | 'ONLINE' | 'IDLE' | 'OFFLINE'>('ALL');
  const [selectedSession, setSelectedSession] = useState<UserSession | null>(null);
  const [activeMapPin, setActiveMapPin] = useState<UserSession | null>(null);
  const [alertMessage, setAlertMessage] = useState<string | null>(null);

  const loadData = () => {
    if (!currentUser) return;
    const s = TrackingService.getSessions(currentUser);
    setSessions(s);
    setActivityLogs(TrackingService.getActivityLogs(currentUser));
    if (!activeMapPin && s.length > 0) {
      setActiveMapPin(s[0]);
    }
  };

  useEffect(() => {
    loadData();
    const interval = setInterval(loadData, 3000);
    return () => clearInterval(interval);
  }, [currentUser]);

  const handleTerminate = (session: UserSession) => {
    if (!currentUser) return;
    if (confirm(`Are you sure you want to disconnect ${session.user_name}'s active laptop session?`)) {
      TrackingService.terminateSession(session.id, currentUser);
      loadData();
      setAlertMessage(`Session for ${session.user_name} on ${session.os} has been terminated.`);
      setTimeout(() => setAlertMessage(null), 4000);
      if (selectedSession?.id === session.id) {
        setSelectedSession(null);
      }
    }
  };

  // Metrics calculation
  const onlineCount = sessions.filter((s) => s.status === 'ONLINE').length;
  const idleCount = sessions.filter((s) => s.status === 'IDLE').length;
  const totalLaptops = sessions.length;
  const distinctCities = Array.from(new Set(sessions.map((s) => s.city))).length;

  const filteredSessions = sessions.filter((s) => {
    const matchesSearch =
      s.user_name.toLowerCase().includes(search.toLowerCase()) ||
      s.user_handle.toLowerCase().includes(search.toLowerCase()) ||
      s.os.toLowerCase().includes(search.toLowerCase()) ||
      s.city.toLowerCase().includes(search.toLowerCase()) ||
      s.team_names.some((t) => t.toLowerCase().includes(search.toLowerCase()));

    const matchesStatus = statusFilter === 'ALL' || s.status === statusFilter;
    return matchesSearch && matchesStatus;
  });

  const formatTimestamp = (isoString?: string) => {
    if (!isoString) return 'Just now';
    try {
      return format(parseISO(isoString), 'h:mm:ss a');
    } catch {
      return 'Just now';
    }
  };

  return (
    <div className="space-y-6">
      {/* Top Telemetry Metric Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="p-4 rounded-2xl bg-white border border-slate-200 shadow-xs flex items-center gap-3.5">
          <div className="w-11 h-11 rounded-2xl bg-indigo-50 text-indigo-600 flex items-center justify-center font-bold shrink-0">
            <Laptop className="w-6 h-6" />
          </div>
          <div>
            <p className="text-[11px] font-semibold text-slate-500 uppercase tracking-wider">
              Connected Laptops
            </p>
            <h3 className="text-2xl font-bold text-slate-900">{totalLaptops}</h3>
            <span className="text-[10px] text-indigo-600 font-medium">Workstations Online</span>
          </div>
        </div>

        <div className="p-4 rounded-2xl bg-white border border-slate-200 shadow-xs flex items-center gap-3.5">
          <div className="w-11 h-11 rounded-2xl bg-emerald-50 text-emerald-600 flex items-center justify-center font-bold shrink-0">
            <Radio className="w-6 h-6 animate-pulse" />
          </div>
          <div>
            <p className="text-[11px] font-semibold text-slate-500 uppercase tracking-wider">
              Real-Time Presence
            </p>
            <h3 className="text-2xl font-bold text-emerald-600">{onlineCount} Active</h3>
            <span className="text-[10px] text-slate-400 font-medium">{idleCount} Idle / Backgrounded</span>
          </div>
        </div>

        <div className="p-4 rounded-2xl bg-white border border-slate-200 shadow-xs flex items-center gap-3.5">
          <div className="w-11 h-11 rounded-2xl bg-rose-50 text-rose-600 flex items-center justify-center font-bold shrink-0">
            <MapPin className="w-6 h-6" />
          </div>
          <div>
            <p className="text-[11px] font-semibold text-slate-500 uppercase tracking-wider">
              Tracked Locations
            </p>
            <h3 className="text-2xl font-bold text-rose-600">{distinctCities} Cities</h3>
            <span className="text-[10px] text-slate-400 font-medium">Live GPS / IP Geolocation</span>
          </div>
        </div>

        <div className="p-4 rounded-2xl bg-white border border-slate-200 shadow-xs flex items-center gap-3.5">
          <div className="w-11 h-11 rounded-2xl bg-blue-50 text-blue-600 flex items-center justify-center font-bold shrink-0">
            <Signal className="w-6 h-6" />
          </div>
          <div>
            <p className="text-[11px] font-semibold text-slate-500 uppercase tracking-wider">
              Network Telemetry
            </p>
            <h3 className="text-xl font-bold text-slate-900">~800 Mbps Avg</h3>
            <span className="text-[10px] text-blue-600 font-medium">Enterprise Leased Lines</span>
          </div>
        </div>
      </div>

      {/* Dismissible Alert */}
      {alertMessage && (
        <div className="p-3.5 bg-rose-50 border border-rose-300 rounded-2xl text-xs text-rose-900 font-medium flex items-center justify-between animate-in fade-in">
          <div className="flex items-center gap-2">
            <CheckCircle2 className="w-4 h-4 text-rose-600" />
            <span>{alertMessage}</span>
          </div>
          <button onClick={() => setAlertMessage(null)} className="text-rose-700 font-bold">
            ✕
          </button>
        </div>
      )}

      {/* Main Container Card */}
      <div className="bg-white border border-slate-200 rounded-3xl shadow-xs overflow-hidden">
        {/* Navigation Bar & Search */}
        <div className="p-4 border-b border-slate-100 flex flex-col md:flex-row items-start md:items-center justify-between gap-3">
          {/* Segmented 3-Tab Switcher */}
          <div className="flex items-center gap-1.5 p-1 bg-slate-100 rounded-xl text-xs font-bold">
            <button
              onClick={() => setActiveTab('roster')}
              className={`px-3 py-1.5 rounded-lg transition-all cursor-pointer ${
                activeTab === 'roster'
                  ? 'bg-white text-slate-900 shadow-xs'
                  : 'text-slate-500 hover:text-slate-800'
              }`}
            >
              <span className="flex items-center gap-1.5">
                <Laptop className="w-3.5 h-3.5" />
                <span>Device Roster ({sessions.length})</span>
              </span>
            </button>

            <button
              onClick={() => setActiveTab('map')}
              className={`px-3 py-1.5 rounded-lg transition-all cursor-pointer ${
                activeTab === 'map'
                  ? 'bg-white text-slate-900 shadow-xs'
                  : 'text-slate-500 hover:text-slate-800'
              }`}
            >
              <span className="flex items-center gap-1.5">
                <Compass className="w-3.5 h-3.5 text-rose-600" />
                <span>Live Geographic Map &amp; Radar</span>
              </span>
            </button>

            <button
              onClick={() => setActiveTab('events')}
              className={`px-3 py-1.5 rounded-lg transition-all cursor-pointer ${
                activeTab === 'events'
                  ? 'bg-white text-slate-900 shadow-xs'
                  : 'text-slate-500 hover:text-slate-800'
              }`}
            >
              <span className="flex items-center gap-1.5">
                <Activity className="w-3.5 h-3.5 text-indigo-600" />
                <span>Activity Stream</span>
              </span>
            </button>
          </div>

          {/* Search & Status Filter */}
          {activeTab === 'roster' && (
            <div className="flex items-center gap-2 w-full md:w-auto">
              <div className="relative flex-1 md:w-64">
                <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
                <input
                  type="text"
                  placeholder="Search user, team, city, or OS..."
                  value={search}
                  onChange={(e) => setSearch(e.target.value)}
                  className="w-full pl-9 pr-3 py-1.5 bg-slate-50 border border-slate-200 rounded-xl text-xs text-slate-800 focus:outline-none focus:bg-white focus:border-indigo-500"
                />
              </div>

              <select
                value={statusFilter}
                onChange={(e) => setStatusFilter(e.target.value as any)}
                className="bg-slate-50 border border-slate-200 rounded-xl text-xs px-2.5 py-1.5 text-slate-700 focus:outline-none"
              >
                <option value="ALL">All Status</option>
                <option value="ONLINE">🟢 Online</option>
                <option value="IDLE">🟡 Idle</option>
                <option value="OFFLINE">⚪ Offline</option>
              </select>
            </div>
          )}
        </div>

        {/* TAB 1: DEVICE ROSTER */}
        {activeTab === 'roster' && (
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs text-slate-600">
              <thead className="bg-slate-50/80 border-b border-slate-100 text-[11px] font-bold uppercase tracking-wider text-slate-500">
                <tr>
                  <th className="py-3 px-4">User &amp; Team</th>
                  <th className="py-3 px-4">Laptop &amp; OS</th>
                  <th className="py-3 px-4">Physical Location &amp; Coordinates</th>
                  <th className="py-3 px-4">ISP &amp; Network IP</th>
                  <th className="py-3 px-4">Status &amp; Window Focus</th>
                  <th className="py-3 px-4 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {filteredSessions.length === 0 ? (
                  <tr>
                    <td colSpan={6} className="py-8 text-center text-slate-400">
                      No active device sessions match the criteria.
                    </td>
                  </tr>
                ) : (
                  filteredSessions.map((session) => {
                    const isOnline = session.status === 'ONLINE';
                    const isIdle = session.status === 'IDLE';

                    return (
                      <tr key={session.id} className="hover:bg-slate-50/70 transition-colors">
                        {/* User & Team */}
                        <td className="py-3.5 px-4">
                          <div className="flex items-center gap-2.5">
                            <div className="relative">
                              <div className="w-8 h-8 rounded-full bg-slate-800 text-white font-bold flex items-center justify-center text-xs">
                                {session.user_name.charAt(0)}
                              </div>
                              <span
                                className={`absolute -bottom-0.5 -right-0.5 w-3 h-3 rounded-full border-2 border-white ${
                                  isOnline
                                    ? 'bg-emerald-500'
                                    : isIdle
                                    ? 'bg-amber-400'
                                    : 'bg-slate-400'
                                }`}
                              />
                            </div>
                            <div>
                              <div className="flex items-center gap-1.5">
                                <span className="font-bold text-slate-900">{session.user_name}</span>
                                <span className="text-[10px] font-mono text-slate-400">
                                  @{session.user_handle}
                                </span>
                              </div>
                              <span className="text-[10px] font-semibold text-indigo-600 bg-indigo-50 px-1.5 py-0.2 rounded border border-indigo-100">
                                {session.team_names.join(', ')}
                              </span>
                            </div>
                          </div>
                        </td>

                        {/* Laptop & OS */}
                        <td className="py-3.5 px-4">
                          <div className="flex items-center gap-1.5 font-medium text-slate-800">
                            <Laptop className="w-3.5 h-3.5 text-slate-500 shrink-0" />
                            <span className="font-semibold">{session.os}</span>
                          </div>
                          <span className="text-[10px] text-slate-400 font-mono">
                            {session.browser} • {session.screen_resolution}
                          </span>
                        </td>

                        {/* Location & GPS Coordinates */}
                        <td className="py-3.5 px-4">
                          <div className="flex items-center gap-1.5 font-bold text-slate-900">
                            <MapPin className="w-3.5 h-3.5 text-rose-600 shrink-0" />
                            <span>{session.city}, {session.country}</span>
                          </div>
                          <div className="text-[10px] text-slate-500 font-mono">
                            {session.latitude.toFixed(4)}° N, {session.longitude.toFixed(4)}° E
                          </div>
                        </td>

                        {/* ISP & IP */}
                        <td className="py-3.5 px-4">
                          <div className="flex items-center gap-1 font-mono text-[11px] text-slate-800 font-semibold">
                            <Wifi className="w-3 h-3 text-blue-500 shrink-0" />
                            <span>{session.ip_address}</span>
                          </div>
                          <div className="text-[10px] text-slate-500 truncate max-w-[170px]" title={session.isp_provider}>
                            {session.isp_provider}
                          </div>
                        </td>

                        {/* Status & Active Window */}
                        <td className="py-3.5 px-4">
                          <div className="flex items-center gap-1.5 mb-1">
                            <span
                              className={`text-[10px] font-bold px-2 py-0.5 rounded-full border ${
                                isOnline
                                  ? 'bg-emerald-50 text-emerald-700 border-emerald-200'
                                  : isIdle
                                  ? 'bg-amber-50 text-amber-700 border-amber-200'
                                  : 'bg-slate-100 text-slate-600 border-slate-200'
                              }`}
                            >
                              {session.status}
                            </span>
                            <span className="text-[10px] text-slate-400">
                              {formatTimestamp(session.last_heartbeat)}
                            </span>
                          </div>
                          <p className="text-[10px] text-slate-500 italic max-w-[170px] truncate">
                            &quot;{session.active_window_title}&quot;
                          </p>
                        </td>

                        {/* Actions */}
                        <td className="py-3.5 px-4 text-right">
                          <div className="flex items-center justify-end gap-1.5">
                            <Button
                              size="sm"
                              variant="ghost"
                              onClick={() => setSelectedSession(session)}
                              title="Inspect Full Telemetry & Geolocation"
                              className="p-1.5 text-indigo-600 hover:bg-indigo-50 cursor-pointer"
                            >
                              <Eye className="w-4 h-4" />
                            </Button>
                            {session.status !== 'OFFLINE' && (
                              <Button
                                size="sm"
                                variant="ghost"
                                onClick={() => handleTerminate(session)}
                                title="Terminate/Disconnect Session"
                                className="p-1.5 text-rose-600 hover:bg-rose-50 cursor-pointer"
                              >
                                <PowerOff className="w-4 h-4" />
                              </Button>
                            )}
                          </div>
                        </td>
                      </tr>
                    );
                  })
                )}
              </tbody>
            </table>
          </div>
        )}

        {/* TAB 2: LIVE GEOGRAPHIC MAP & RADAR */}
        {activeTab === 'map' && (
          <div className="p-6 space-y-6">
            {/* Visual Radar & Interactive Map Container */}
            <div className="relative w-full h-[420px] rounded-3xl bg-slate-950 border border-slate-800 overflow-hidden shadow-2xl p-6 flex flex-col justify-between">
              {/* Decorative Map Grid Lines */}
              <div 
                className="absolute inset-0 opacity-20 pointer-events-none"
                style={{
                  backgroundImage: 'radial-gradient(#6366f1 1px, transparent 1px), linear-gradient(to right, #1e293b 1px, transparent 1px), linear-gradient(to bottom, #1e293b 1px, transparent 1px)',
                  backgroundSize: '24px 24px, 48px 48px, 48px 48px',
                }}
              />

              {/* Map Header Overlay */}
              <div className="relative z-10 flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <div className="w-8 h-8 rounded-xl bg-rose-600 text-white flex items-center justify-center shadow-lg shadow-rose-600/30">
                    <Compass className="w-4 h-4 animate-spin text-white" style={{ animationDuration: '10s' }} />
                  </div>
                  <div>
                    <h3 className="text-sm font-bold text-white flex items-center gap-2">
                      <span>Global Geolocation &amp; Physical Workstation Radar</span>
                      <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-emerald-950 border border-emerald-500 text-emerald-400">
                        LIVE GPS / IP SYNC
                      </span>
                    </h3>
                    <p className="text-[11px] text-slate-400">
                      Real-time physical location coordinates of all active laptops. Click any node below to inspect.
                    </p>
                  </div>
                </div>

                <div className="hidden sm:flex items-center gap-3 text-xs text-slate-400 bg-slate-900/80 border border-slate-800 px-3 py-1.5 rounded-xl backdrop-blur-md">
                  <span className="flex items-center gap-1.5"><span className="w-2 h-2 rounded-full bg-emerald-400 animate-ping" /> Online Workstation</span>
                  <span className="flex items-center gap-1.5"><span className="w-2 h-2 rounded-full bg-amber-400" /> Idle Laptop</span>
                </div>
              </div>

              {/* Visual Interactive Location Pins Grid on Map Arena */}
              <div className="relative z-10 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3.5 my-auto py-4">
                {sessions.map((s) => {
                  const isSelected = activeMapPin?.id === s.id;
                  const isOnline = s.status === 'ONLINE';

                  return (
                    <button
                      key={s.id}
                      type="button"
                      onClick={() => setActiveMapPin(s)}
                      className={`p-3.5 rounded-2xl text-left transition-all backdrop-blur-md cursor-pointer border ${
                        isSelected
                          ? 'bg-indigo-950/80 border-indigo-400 shadow-xl shadow-indigo-600/20 ring-2 ring-indigo-500/40'
                          : 'bg-slate-900/80 border-slate-800 hover:border-slate-700 hover:bg-slate-900'
                      }`}
                    >
                      <div className="flex items-center justify-between gap-2 mb-2">
                        <div className="flex items-center gap-2">
                          <span className="relative flex h-2.5 w-2.5">
                            {isOnline && (
                              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
                            )}
                            <span className={`relative inline-flex rounded-full h-2.5 w-2.5 ${isOnline ? 'bg-emerald-500' : 'bg-amber-400'}`}></span>
                          </span>
                          <span className="font-bold text-xs text-white truncate">{s.user_name}</span>
                        </div>
                        <span className="text-[10px] font-bold text-rose-400 bg-rose-950/60 border border-rose-800 px-1.5 py-0.2 rounded">
                          {s.city}
                        </span>
                      </div>

                      <div className="text-[11px] text-slate-300 font-mono flex items-center gap-1.5">
                        <MapPin className="w-3 h-3 text-rose-400 shrink-0" />
                        <span className="truncate">{s.location}</span>
                      </div>

                      <div className="mt-2 pt-2 border-t border-slate-800/80 flex items-center justify-between text-[10px] text-slate-400">
                        <span className="font-mono">{s.latitude.toFixed(2)}°N, {s.longitude.toFixed(2)}°E</span>
                        <span className="text-indigo-400 font-semibold">{s.network_type}</span>
                      </div>
                    </button>
                  );
                })}
              </div>

              {/* Bottom Selected Location Bar */}
              {activeMapPin && (
                <div className="relative z-10 p-3.5 bg-slate-900/90 border border-indigo-900/60 rounded-2xl flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 text-xs backdrop-blur-md">
                  <div className="flex items-center gap-3">
                    <div className="w-9 h-9 rounded-xl bg-indigo-600 text-white font-bold flex items-center justify-center shrink-0">
                      {activeMapPin.user_name.charAt(0)}
                    </div>
                    <div>
                      <div className="flex items-center gap-2">
                        <span className="font-bold text-white">{activeMapPin.user_name} (@{activeMapPin.user_handle})</span>
                        <span className="text-[10px] font-mono text-emerald-400">● {activeMapPin.status}</span>
                      </div>
                      <p className="text-slate-300 text-[11px]">
                        📍 <strong>{activeMapPin.location}</strong> • Coordinates: <span className="font-mono text-indigo-300">[{activeMapPin.latitude}° N, {activeMapPin.longitude}° E]</span> • ISP: <span className="text-slate-200">{activeMapPin.isp_provider}</span>
                      </p>
                    </div>
                  </div>

                  <Button
                    size="sm"
                    onClick={() => setSelectedSession(activeMapPin)}
                    className="bg-indigo-600 hover:bg-indigo-700 text-white text-xs font-bold shrink-0"
                  >
                    <Eye className="w-3.5 h-3.5" />
                    <span>View Diagnostic Telemetry</span>
                  </Button>
                </div>
              )}
            </div>
          </div>
        )}

        {/* TAB 3: REAL-TIME ACTIVITY STREAM */}
        {activeTab === 'events' && (
          <div className="p-4 space-y-2.5 max-h-[460px] overflow-y-auto">
            {activityLogs.map((log) => (
              <div
                key={log.id}
                className="p-3 rounded-2xl bg-slate-50 border border-slate-200/80 flex items-center justify-between text-xs hover:border-slate-300 transition-all"
              >
                <div className="flex items-center gap-3">
                  <div className="w-8 h-8 rounded-full bg-slate-900 text-white flex items-center justify-center font-bold text-xs shrink-0">
                    {log.user_name.charAt(0)}
                  </div>
                  <div>
                    <div className="flex items-center gap-2">
                      <span className="font-bold text-slate-900">{log.user_name}</span>
                      <span className="text-[10px] font-mono text-slate-400">@{log.user_handle}</span>
                      <span className="text-[9px] font-bold px-1.5 py-0.2 rounded bg-indigo-50 text-indigo-700 border border-indigo-100">
                        {log.event_type}
                      </span>
                    </div>
                    <p className="text-slate-600 mt-0.5">{log.description}</p>
                  </div>
                </div>

                <div className="text-right shrink-0">
                  <span className="font-mono text-[11px] text-slate-500 block">
                    {formatTimestamp(log.timestamp)}
                  </span>
                  <span className="text-[10px] text-slate-400 font-mono">{log.device_info}</span>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Full Telemetry & Geolocation Inspector Modal */}
      {selectedSession && (
        <Modal
          isOpen={Boolean(selectedSession)}
          onClose={() => setSelectedSession(null)}
          title={`Laptop Telemetry & Geolocation: ${selectedSession.user_name}`}
          description="Detailed hardware profile, physical location coordinates, and network ISP parameters."
          maxWidth="lg"
        >
          <div className="space-y-4">
            {/* Header info */}
            <div className="p-3.5 bg-slate-900 text-white rounded-2xl flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-xl bg-indigo-600 flex items-center justify-center font-bold text-sm">
                  {selectedSession.user_name.charAt(0)}
                </div>
                <div>
                  <h4 className="font-bold text-sm">{selectedSession.user_name}</h4>
                  <p className="text-xs text-indigo-300 font-mono">@{selectedSession.user_handle} • {selectedSession.team_names.join(', ')}</p>
                </div>
              </div>
              <Badge
                variant={selectedSession.status === 'ONLINE' ? 'success' : 'warning'}
                dot
              >
                {selectedSession.status}
              </Badge>
            </div>

            {/* Geolocation & Physical Location Box */}
            <div className="p-3.5 bg-rose-50 border border-rose-200 rounded-2xl text-xs space-y-2">
              <span className="text-[10px] font-bold uppercase tracking-wider text-rose-800 flex items-center gap-1.5">
                <MapPin className="w-3.5 h-3.5 text-rose-600" />
                <span>Physical Geolocation &amp; Coordinates</span>
              </span>
              <div className="grid grid-cols-2 gap-2 text-rose-950 font-medium">
                <div>
                  <span className="text-[10px] text-rose-700 block">Street / Facility:</span>
                  <strong>{selectedSession.location}</strong>
                </div>
                <div>
                  <span className="text-[10px] text-rose-700 block">City, Region &amp; Country:</span>
                  <strong>{selectedSession.city}, {selectedSession.region}, {selectedSession.country}</strong>
                </div>
                <div>
                  <span className="text-[10px] text-rose-700 block">GPS Coordinates:</span>
                  <strong className="font-mono">{selectedSession.latitude}° N, {selectedSession.longitude}° E</strong>
                </div>
                <div>
                  <span className="text-[10px] text-rose-700 block">ISP &amp; Uplink:</span>
                  <strong>{selectedSession.isp_provider} ({selectedSession.connection_speed})</strong>
                </div>
              </div>
            </div>

            {/* Hardware Diagnostic Grid */}
            <div className="grid grid-cols-2 gap-3 text-xs">
              <div className="p-3 bg-slate-50 border border-slate-200 rounded-xl space-y-1">
                <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400 flex items-center gap-1">
                  <Laptop className="w-3.5 h-3.5 text-indigo-600" />
                  <span>Workstation &amp; OS</span>
                </span>
                <p className="font-bold text-slate-800">{selectedSession.os}</p>
                <p className="text-[11px] text-slate-500 font-mono">Type: {selectedSession.device_type}</p>
              </div>

              <div className="p-3 bg-slate-50 border border-slate-200 rounded-xl space-y-1">
                <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400 flex items-center gap-1">
                  <Monitor className="w-3.5 h-3.5 text-teal-600" />
                  <span>Browser &amp; Display</span>
                </span>
                <p className="font-bold text-slate-800">{selectedSession.browser}</p>
                <p className="text-[11px] text-slate-500 font-mono">Resolution: {selectedSession.screen_resolution}</p>
              </div>

              <div className="p-3 bg-slate-50 border border-slate-200 rounded-xl space-y-1">
                <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400 flex items-center gap-1">
                  <Wifi className="w-3.5 h-3.5 text-blue-600" />
                  <span>Network IP &amp; Gateway</span>
                </span>
                <p className="font-bold text-slate-800 font-mono">{selectedSession.ip_address}</p>
                <p className="text-[11px] text-slate-500">{selectedSession.network_type}</p>
              </div>

              <div className="p-3 bg-slate-50 border border-slate-200 rounded-xl space-y-1">
                <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400 flex items-center gap-1">
                  <Radio className="w-3.5 h-3.5 text-amber-600 animate-pulse" />
                  <span>Active Workspace Focus</span>
                </span>
                <p className="font-bold text-slate-800 truncate">&quot;{selectedSession.active_window_title}&quot;</p>
                <p className="text-[11px] text-slate-500">Messages Sent Today: {selectedSession.daily_messages_sent}</p>
              </div>
            </div>

            {/* Modal Actions */}
            <div className="flex items-center justify-between pt-3 border-t border-slate-100">
              {selectedSession.status !== 'OFFLINE' ? (
                <Button
                  size="sm"
                  variant="outline"
                  onClick={() => handleTerminate(selectedSession)}
                  className="text-rose-600 border-rose-200 hover:bg-rose-50 text-xs font-bold"
                >
                  <PowerOff className="w-3.5 h-3.5 mr-1" />
                  <span>Disconnect Session</span>
                </Button>
              ) : (
                <span className="text-xs text-slate-400 italic">Session Disconnected</span>
              )}

              <Button size="sm" onClick={() => setSelectedSession(null)}>
                Close
              </Button>
            </div>
          </div>
        </Modal>
      )}
    </div>
  );
};
