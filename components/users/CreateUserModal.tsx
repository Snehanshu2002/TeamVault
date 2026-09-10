'use client';

import React, { useState } from 'react';
import { Modal } from '@/components/ui/modal';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Profile, Team, UserRole } from '@/lib/types';
import { mockSupabase } from '@/lib/supabase/mockSupabase';
import { UserPlus, Shield, Building, Layers, Phone, MapPin, Sparkles } from 'lucide-react';

export interface CreateUserModalProps {
  isOpen: boolean;
  onClose: () => void;
  onUserCreated?: (user: Profile) => void;
  viewerRole: UserRole;
  currentOrgId?: string;
}

export const CreateUserModal: React.FC<CreateUserModalProps> = ({
  isOpen,
  onClose,
  onUserCreated,
  viewerRole,
  currentOrgId,
}) => {
  const isSuperAdmin = viewerRole === 'PLATFORM_SUPER_ADMIN';
  const orgs = mockSupabase.getOrganizations();
  const allTeams = mockSupabase.getTeams();

  const defaultOrg = currentOrgId || (orgs.length > 0 ? orgs[0].id : 'a0000000-0000-0000-0000-000000000001');

  // Form fields
  const [displayName, setDisplayName] = useState('');
  const [username, setUsername] = useState('');
  const [email, setEmail] = useState('');
  const [phone, setPhone] = useState('');
  const [address, setAddress] = useState('');
  const [role, setRole] = useState<UserRole>('USER');
  const [selectedOrgId, setSelectedOrgId] = useState(defaultOrg);
  const [selectedTeamIds, setSelectedTeamIds] = useState<string[]>([]);
  const [error, setError] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  const availableTeams = allTeams.filter(
    (t) => t.organization_id === (isSuperAdmin ? selectedOrgId : defaultOrg) && t.status === 'active'
  );

  const handleTeamToggle = (teamId: string) => {
    setSelectedTeamIds((prev) =>
      prev.includes(teamId) ? prev.filter((id) => id !== teamId) : [...prev, teamId]
    );
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setError('');

    const cleanDisplayName = displayName.trim();
    const cleanUsername = username.trim().toLowerCase().replace(/[^a-z0-9_]/g, '');
    const cleanEmail = email.trim().toLowerCase();

    if (!cleanDisplayName || !cleanUsername || !cleanEmail) {
      setError('Name, username, and email are required fields.');
      return;
    }

    // Check uniqueness
    const existingProfiles = mockSupabase.getProfiles();
    if (existingProfiles.some((p) => p.username.toLowerCase() === cleanUsername)) {
      setError(`The handle @${cleanUsername} is already taken.`);
      return;
    }
    if (existingProfiles.some((p) => p.email.toLowerCase() === cleanEmail)) {
      setError(`Email ${cleanEmail} is already registered.`);
      return;
    }

    setIsSubmitting(true);

    try {
      const targetOrgId = isSuperAdmin ? selectedOrgId : defaultOrg;
      const newUserId = `u-${Date.now()}`;

      const newProfile: Profile = {
        id: newUserId,
        organization_id: targetOrgId,
        username: cleanUsername,
        display_name: cleanDisplayName,
        email: cleanEmail,
        role: isSuperAdmin ? role : 'USER',
        status: 'active',
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString(),
        isOnline: true,
      };

      // 1. Save profile locally
      mockSupabase.saveProfile(newProfile);

      // 2. Assign to selected teams
      if (selectedTeamIds.length > 0) {
        selectedTeamIds.forEach((tId) => {
          const team = mockSupabase.getTeamById(tId);
          if (team) {
            const currentMembers = team.memberIds || [];
            if (!currentMembers.includes(newUserId)) {
              team.memberIds = [...currentMembers, newUserId];
              team.updated_at = new Date().toISOString();
              mockSupabase.saveTeam(team);
            }
          }
        });
      }

      // 3. Log audit event
      const currentUser = mockSupabase.getCurrentUser();
      mockSupabase.addAuditLog({
        organization_id: targetOrgId,
        actor_id: currentUser?.id || 'system',
        actor_name: currentUser?.display_name || 'Administrator',
        actor_role: viewerRole,
        action: 'CREATE_USER',
        target_type: 'user',
        target_id: newProfile.id,
        target_name: `${newProfile.display_name} (@${newProfile.username})`,
        details: {
          role: newProfile.role,
          assignedTeamsCount: selectedTeamIds.length,
          email: newProfile.email,
        },
      });

      // 4. Persist to real server database (data/teamvault_db.json) via API
      fetch('/api/users', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          full_name: cleanDisplayName,
          email: cleanEmail,
          role: isSuperAdmin ? role : 'USER',
          phone: phone.trim() || undefined,
          team_ids: selectedTeamIds,
          organization_id: targetOrgId,
          created_by: currentUser?.id || 'admin',
        }),
      }).catch((apiErr) => {
        console.warn('API background persistence note:', apiErr);
      });

      if (onUserCreated) {
        onUserCreated(newProfile);
      }

      // Reset & close
      setDisplayName('');
      setUsername('');
      setEmail('');
      setPhone('');
      setAddress('');
      setSelectedTeamIds([]);
      onClose();
    } catch (err: any) {
      setError(err?.message || 'Failed to create user.');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title="Add New User to Platform"
      description="Create a user profile, assign to teams, and configure organizational permissions."
      maxWidth="lg"
    >
      <form onSubmit={handleSubmit} className="space-y-4">
        {error && (
          <div className="p-3 bg-rose-50 border border-rose-200 rounded-xl text-xs text-rose-700 font-medium">
            {error}
          </div>
        )}

        {/* Basic Info */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
          <Input
            label="Full Display Name *"
            placeholder="e.g. Vikram Malhotra"
            value={displayName}
            onChange={(e) => setDisplayName(e.target.value)}
            required
          />
          <Input
            label="Username Handle (@) *"
            placeholder="e.g. vikram"
            value={username}
            onChange={(e) => setUsername(e.target.value)}
            required
          />
        </div>

        <Input
          label="Corporate Email Address *"
          type="email"
          placeholder="vikram@acmecorp.com"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          required
        />

        {/* Super Admin options: Org & Role */}
        {isSuperAdmin && (
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 bg-slate-50 p-3.5 rounded-xl border border-slate-200/80">
            <div>
              <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1.5 flex items-center gap-1.5">
                <Building className="w-3.5 h-3.5 text-rose-600" />
                <span>Assign Organization</span>
              </label>
              <select
                value={selectedOrgId}
                onChange={(e) => {
                  setSelectedOrgId(e.target.value);
                  setSelectedTeamIds([]);
                }}
                className="w-full bg-white border border-slate-300 rounded-xl text-xs px-3 py-2 text-slate-800 focus:outline-none focus:border-rose-500"
              >
                {orgs.map((o) => (
                  <option key={o.id} value={o.id}>
                    {o.name} ({o.slug})
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1.5 flex items-center gap-1.5">
                <Shield className="w-3.5 h-3.5 text-rose-600" />
                <span>Account Role</span>
              </label>
              <select
                value={role}
                onChange={(e) => setRole(e.target.value as UserRole)}
                className="w-full bg-white border border-slate-300 rounded-xl text-xs px-3 py-2 text-slate-800 focus:outline-none focus:border-rose-500"
              >
                <option value="USER">Regular Team Member (USER)</option>
                <option value="ORGANIZATION_ADMIN">Organization Admin (Admin)</option>
              </select>
            </div>
          </div>
        )}

        {/* Team Assignments */}
        <div className="bg-slate-50 p-3.5 rounded-xl border border-slate-200/80 space-y-2">
          <div className="flex items-center justify-between">
            <label className="text-xs font-bold text-slate-700 uppercase tracking-wider flex items-center gap-1.5">
              <Layers className="w-3.5 h-3.5 text-indigo-600" />
              <span>Initial Team Assignments</span>
            </label>
            <span className="text-[11px] text-slate-500 font-medium">
              {selectedTeamIds.length} team(s) selected
            </span>
          </div>
          <p className="text-[11px] text-slate-500">
            Select the team(s) this user should be allowed to chat with:
          </p>

          {availableTeams.length === 0 ? (
            <p className="text-xs text-slate-400 italic p-2 bg-white rounded-lg border border-slate-200 text-center">
              No active teams available in this organization.
            </p>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 max-h-36 overflow-y-auto pr-1">
              {availableTeams.map((t) => {
                const isSelected = selectedTeamIds.includes(t.id);
                return (
                  <button
                    type="button"
                    key={t.id}
                    onClick={() => handleTeamToggle(t.id)}
                    className={`p-2 rounded-xl text-left text-xs transition-all border flex items-center justify-between cursor-pointer ${
                      isSelected
                        ? 'bg-indigo-50 border-indigo-400 text-indigo-950 font-semibold'
                        : 'bg-white border-slate-200 text-slate-700 hover:border-slate-300'
                    }`}
                  >
                    <span className="truncate">{t.name}</span>
                    <span
                      className={`w-4 h-4 rounded-md flex items-center justify-center text-[10px] ${
                        isSelected ? 'bg-indigo-600 text-white' : 'border border-slate-300'
                      }`}
                    >
                      {isSelected ? '✓' : ''}
                    </span>
                  </button>
                );
              })}
            </div>
          )}
        </div>

        {/* Optional Private Contact Details (Protected PII) */}
        <div className="border-t border-slate-100 pt-3">
          <p className="text-[11px] font-bold text-slate-500 uppercase tracking-wider mb-2 flex items-center gap-1.5">
            <span>Private Profile Details (Admin-Only / PII Safe)</span>
          </p>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <Input
              label="Contact Phone (Optional)"
              placeholder="+1-555-0199"
              value={phone}
              onChange={(e) => setPhone(e.target.value)}
            />
            <Input
              label="Location / Office (Optional)"
              placeholder="Building 4, Floor 2"
              value={address}
              onChange={(e) => setAddress(e.target.value)}
            />
          </div>
        </div>

        {/* Footer actions */}
        <div className="flex items-center justify-end gap-2 pt-4 border-t border-slate-100">
          <Button type="button" variant="secondary" onClick={onClose} disabled={isSubmitting}>
            Cancel
          </Button>
          <Button
            type="submit"
            disabled={isSubmitting}
            className={`flex items-center gap-2 ${
              isSuperAdmin ? 'bg-rose-600 hover:bg-rose-700' : 'bg-indigo-600 hover:bg-indigo-700'
            } text-white font-bold`}
          >
            <UserPlus className="w-4 h-4" />
            <span>{isSubmitting ? 'Creating User...' : 'Create User & Assign'}</span>
          </Button>
        </div>
      </form>
    </Modal>
  );
};
