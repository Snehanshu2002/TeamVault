'use client';

import React, { useState } from 'react';
import { Modal } from '@/components/ui/modal';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { mockSupabase } from '@/lib/supabase/mockSupabase';

export interface CreateTeamModalProps {
  isOpen: boolean;
  onClose: () => void;
  onCreateTeam: (teamName: string, description: string, memberIds: string[]) => void;
}

export const CreateTeamModal: React.FC<CreateTeamModalProps> = ({
  isOpen,
  onClose,
  onCreateTeam,
}) => {
  const [name, setName] = useState('');
  const [description, setDescription] = useState('');
  const [selectedMembers, setSelectedMembers] = useState<string[]>([]);
  const [error, setError] = useState('');

  const allUsers = mockSupabase.getProfiles().filter((u) => u.role === 'USER');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim()) {
      setError('Team name is required');
      return;
    }
    onCreateTeam(name.trim(), description.trim(), selectedMembers);
    setName('');
    setDescription('');
    setSelectedMembers([]);
    setError('');
    onClose();
  };

  const toggleMember = (uid: string) => {
    setSelectedMembers((prev) =>
      prev.includes(uid) ? prev.filter((id) => id !== uid) : [...prev, uid]
    );
  };

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title="Create New Team"
      description="Create an isolated team workspace and assign team members."
      maxWidth="md"
    >
      <form onSubmit={handleSubmit} className="space-y-4">
        <Input
          label="Team Name"
          placeholder="e.g. Team Delta"
          value={name}
          onChange={(e) => {
            setName(e.target.value);
            setError('');
          }}
          error={error}
          required
        />

        <div>
          <label className="block text-xs font-semibold uppercase tracking-wider text-slate-700 mb-1.5">
            Description / Scope
          </label>
          <textarea
            placeholder="Brief description of this team's focus..."
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            rows={2}
            className="w-full bg-white border border-slate-300 rounded-xl text-sm p-3 text-slate-900 placeholder-slate-400 focus:outline-none focus:border-indigo-500 focus:ring-2 focus:ring-indigo-100 transition-colors"
          />
        </div>

        <div>
          <label className="block text-xs font-semibold uppercase tracking-wider text-slate-700 mb-1.5">
            Assign Initial Members ({selectedMembers.length} selected)
          </label>
          <div className="space-y-1.5 max-h-48 overflow-y-auto border border-slate-200 rounded-xl p-2 bg-slate-50">
            {allUsers.map((user) => {
              const isSelected = selectedMembers.includes(user.id);
              return (
                <div
                  key={user.id}
                  onClick={() => toggleMember(user.id)}
                  className={`flex items-center justify-between p-2 rounded-lg cursor-pointer transition-colors ${
                    isSelected
                      ? 'bg-indigo-50 border border-indigo-200'
                      : 'bg-white hover:bg-slate-100 border border-transparent'
                  }`}
                >
                  <div className="flex items-center gap-2">
                    <div className="w-6 h-6 rounded-full bg-slate-800 text-white flex items-center justify-center text-[10px] font-bold">
                      {user.display_name.charAt(0)}
                    </div>
                    <div>
                      <p className="text-xs font-bold text-slate-800">{user.display_name}</p>
                      <p className="text-[10px] text-slate-500">@{user.username}</p>
                    </div>
                  </div>
                  <input
                    type="checkbox"
                    checked={isSelected}
                    onChange={() => {}}
                    className="w-4 h-4 text-indigo-600 rounded-sm border-slate-300 pointer-events-none"
                  />
                </div>
              );
            })}
          </div>
        </div>

        <div className="flex items-center justify-end gap-2 pt-3 border-t border-slate-100">
          <Button type="button" variant="secondary" onClick={onClose}>
            Cancel
          </Button>
          <Button type="submit">Create Team</Button>
        </div>
      </form>
    </Modal>
  );
};
