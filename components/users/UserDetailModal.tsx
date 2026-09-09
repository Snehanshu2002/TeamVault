'use client';

import React from 'react';
import { Modal } from '@/components/ui/modal';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Profile, PublicProfile } from '@/lib/types';
import { mockSupabase } from '@/lib/supabase/mockSupabase';
import { Shield, Lock, CheckCircle2 } from 'lucide-react';

export interface UserDetailModalProps {
  isOpen: boolean;
  onClose: () => void;
  user: (Profile | PublicProfile) | null;
  viewerRole: string;
}

export const UserDetailModal: React.FC<UserDetailModalProps> = ({
  isOpen,
  onClose,
  user,
  viewerRole,
}) => {
  if (!user) return null;

  const isAdmin =
    viewerRole === 'ORGANIZATION_ADMIN' || viewerRole === 'PLATFORM_SUPER_ADMIN';
  const hasEmail = 'email' in user;
  const privateProfile = isAdmin ? mockSupabase.getPrivateProfile(user.id) : undefined;

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title="User Profile & Privacy Scope"
      description="Profile inspection respecting Multi-Tenant RBAC and privacy isolation boundaries."
      maxWidth="md"
    >
      <div className="space-y-4">
        {/* User Card */}
        <div className="flex items-center gap-4 p-4 bg-slate-50 border border-slate-200 rounded-2xl">
          <div className="w-14 h-14 rounded-2xl bg-indigo-600 text-white font-bold text-xl flex items-center justify-center shadow-xs">
            {user.display_name.charAt(0)}
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h3 className="text-base font-bold text-slate-900">{user.display_name}</h3>
              <Badge variant={user.status === 'active' ? 'success' : 'danger'} dot>
                {user.status === 'active' ? 'Active' : 'Disabled'}
              </Badge>
            </div>
            <p className="text-xs font-mono text-indigo-600 font-semibold mt-0.5">
              @{user.username}
            </p>
          </div>
        </div>

        {/* Privacy Notice Banner */}
        {!isAdmin ? (
          <div className="bg-emerald-50 border border-emerald-200 rounded-xl p-3 flex items-start gap-2.5">
            <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0 mt-0.5" />
            <div className="text-xs text-emerald-900">
              <p className="font-bold">Privacy Protection Active</p>
              <p className="text-[11px] text-emerald-700 mt-0.5">
                As a standard user, you only see public safe credentials (username and display name). Sensitive personal data (email, phone, address, and metadata) are stripped at the PostgreSQL/data layer.
              </p>
            </div>
          </div>
        ) : (
          <div className="bg-indigo-50 border border-indigo-200 rounded-xl p-3 flex items-start gap-2.5">
            <Shield className="w-4 h-4 text-indigo-600 shrink-0 mt-0.5" />
            <div className="text-xs text-indigo-900">
              <p className="font-bold">Authorized Administrator Clearance</p>
              <p className="text-[11px] text-indigo-700 mt-0.5">
                You have authorized administrative clearance to review this user&apos;s contact information and organization membership.
              </p>
            </div>
          </div>
        )}

        {/* Fields List */}
        <div className="space-y-2 border border-slate-200 rounded-xl p-3 text-xs bg-white">
          <div className="flex justify-between py-1.5 border-b border-slate-100">
            <span className="text-slate-500 font-medium">Display Name</span>
            <span className="font-bold text-slate-900">{user.display_name}</span>
          </div>

          <div className="flex justify-between py-1.5 border-b border-slate-100">
            <span className="text-slate-500 font-medium">Public Username</span>
            <span className="font-mono text-slate-800">@{user.username}</span>
          </div>

          <div className="flex justify-between py-1.5 border-b border-slate-100">
            <span className="text-slate-500 font-medium">Email Address</span>
            {isAdmin && hasEmail ? (
              <span className="font-mono text-slate-900">{(user as Profile).email}</span>
            ) : (
              <span className="text-slate-400 italic flex items-center gap-1">
                <Lock className="w-3.5 h-3.5 text-slate-400" />
                Protected &amp; Redacted
              </span>
            )}
          </div>

          {isAdmin && privateProfile?.phone && (
            <div className="flex justify-between py-1.5 border-b border-slate-100">
              <span className="text-slate-500 font-medium">Phone Number (Admin Only)</span>
              <span className="font-mono text-slate-900">{privateProfile.phone}</span>
            </div>
          )}

          {isAdmin && privateProfile?.address && (
            <div className="flex justify-between py-1.5 border-b border-slate-100">
              <span className="text-slate-500 font-medium">Address (Admin Only)</span>
              <span className="text-slate-800">{privateProfile.address}</span>
            </div>
          )}

          <div className="flex justify-between py-1.5">
            <span className="text-slate-500 font-medium">Organization ID</span>
            <span className="font-mono text-slate-600 text-[11px]">{user.organization_id}</span>
          </div>
        </div>

        <div className="flex justify-end pt-2">
          <Button variant="secondary" onClick={onClose}>
            Close
          </Button>
        </div>
      </div>
    </Modal>
  );
};
