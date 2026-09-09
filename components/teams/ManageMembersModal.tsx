'use client';

import React, { useState } from 'react';
import { Modal } from '@/components/ui/modal';
import { Button } from '@/components/ui/button';
import { Team } from '@/lib/types';
import { mockSupabase } from '@/lib/supabase/mockSupabase';
import { Plus, Trash2 } from 'lucide-react';

export interface ManageMembersModalProps {
  isOpen: boolean;
  onClose: () => void;
  team: Team | null;
  onAddMember: (teamId: string, userId: string) => void;
  onRemoveMember: (teamId: string, userId: string) => void;
}

export const ManageMembersModal: React.FC<ManageMembersModalProps> = ({
  isOpen,
  onClose,
  team,
  onAddMember,
  onRemoveMember,
}) => {
  const [selectedAddUserId, setSelectedAddUserId] = useState('');

  if (!team) return null;

  const allUsers = mockSupabase.getProfiles().filter((u) => u.role === 'USER' && u.organization_id === team.organization_id);
  const currentMemberIds = team.memberIds || [];
  const currentMembers = allUsers.filter((u) => currentMemberIds.includes(u.id));
  const availableUsersToAdd = allUsers.filter((u) => !currentMemberIds.includes(u.id));

  const handleAdd = () => {
    if (!selectedAddUserId) return;
    onAddMember(team.id, selectedAddUserId);
    setSelectedAddUserId('');
  };

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title={`Manage Members: ${team.name}`}
      description="Add or remove members for this team. Remember: members can only private chat within their assigned teams."
      maxWidth="lg"
    >
      <div className="space-y-5">
        {/* Add Member Row */}
        <div className="bg-slate-50 border border-slate-200/80 rounded-xl p-3.5 space-y-2">
          <label className="block text-xs font-bold uppercase tracking-wider text-slate-700">
            Add New Member to Team
          </label>
          <div className="flex gap-2">
            <select
              value={selectedAddUserId}
              onChange={(e) => setSelectedAddUserId(e.target.value)}
              className="flex-1 bg-white border border-slate-300 rounded-xl text-xs px-3 py-2 text-slate-800 focus:outline-none focus:border-indigo-500"
            >
              <option value="">Select a user to add...</option>
              {availableUsersToAdd.map((u) => (
                <option key={u.id} value={u.id}>
                  {u.display_name} (@{u.username})
                </option>
              ))}
            </select>
            <Button
              size="sm"
              disabled={!selectedAddUserId}
              onClick={handleAdd}
              className="shrink-0"
            >
              <Plus className="w-3.5 h-3.5" />
              <span>Add User</span>
            </Button>
          </div>
        </div>

        {/* Current Members List */}
        <div>
          <h4 className="text-xs font-bold uppercase tracking-wider text-slate-700 mb-2 flex items-center justify-between">
            <span>Current Members ({currentMembers.length})</span>
            <span className="text-[10px] text-slate-400 font-normal">
              Changes apply in real time
            </span>
          </h4>

          <div className="space-y-2 max-h-60 overflow-y-auto pr-1">
            {currentMembers.length === 0 ? (
              <p className="text-xs text-slate-400 italic p-3 text-center bg-slate-50 rounded-xl">
                No members currently in this team.
              </p>
            ) : (
              currentMembers.map((member) => (
                <div
                  key={member.id}
                  className="flex items-center justify-between p-2.5 rounded-xl bg-white border border-slate-200 text-xs hover:border-slate-300 transition-colors"
                >
                  <div className="flex items-center gap-3">
                    <div className="w-8 h-8 rounded-full bg-slate-800 text-white flex items-center justify-center text-xs font-bold">
                      {member.display_name.charAt(0)}
                    </div>
                    <div>
                      <div className="flex items-center gap-2">
                        <span className="font-bold text-slate-900">{member.display_name}</span>
                        <span className="text-[10px] font-mono text-slate-500">
                          @{member.username}
                        </span>
                      </div>
                      <span className="text-[10px] text-slate-400">{member.email}</span>
                    </div>
                  </div>

                  <Button
                    size="sm"
                    variant="ghost"
                    onClick={() => onRemoveMember(team.id, member.id)}
                    className="text-rose-600 hover:text-rose-700 hover:bg-rose-50 text-xs px-2.5 cursor-pointer"
                  >
                    <Trash2 className="w-3.5 h-3.5" />
                    <span>Remove</span>
                  </Button>
                </div>
              ))
            )}
          </div>
        </div>

        <div className="flex justify-end pt-3 border-t border-slate-100">
          <Button variant="secondary" onClick={onClose}>
            Done
          </Button>
        </div>
      </div>
    </Modal>
  );
};
