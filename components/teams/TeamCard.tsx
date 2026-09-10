'use client';

import React from 'react';
import { Team, Profile, PublicProfile } from '@/lib/types';
import { Card } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Users, Shield, MessageSquare, Trash2, UserPlus } from 'lucide-react';
import { format, parseISO } from 'date-fns';

export interface TeamCardProps {
  team: Team;
  members: (Profile | PublicProfile)[];
  currentUserRole: string;
  currentUserId?: string;
  onManageMembers?: (team: Team) => void;
  onDeleteTeam?: (teamId: string) => void;
  onStartChatWithMember?: (member: Profile | PublicProfile, team: Team) => void;
  onStartTeamGroupChat?: (team: Team) => void;
}

export const TeamCard: React.FC<TeamCardProps> = ({
  team,
  members,
  currentUserRole,
  currentUserId,
  onManageMembers,
  onDeleteTeam,
  onStartChatWithMember,
  onStartTeamGroupChat,
}) => {
  const isAdmin = currentUserRole === 'ORGANIZATION_ADMIN' || currentUserRole === 'PLATFORM_SUPER_ADMIN';

  const formatDate = (isoString?: string) => {
    if (!isoString) return '';
    try {
      return format(parseISO(isoString), 'MMM d, yyyy');
    } catch {
      return '';
    }
  };

  return (
    <Card className="flex flex-col justify-between hoverable transition-all border-slate-200">
      <div>
        <div className="flex items-start justify-between gap-3 mb-3">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-indigo-50 border border-indigo-100 text-indigo-700 flex items-center justify-center font-bold text-base shadow-2xs">
              {team.name.charAt(0)}
            </div>
            <div>
              <h3 className="text-base font-bold text-slate-900">{team.name}</h3>
              <p className="text-xs text-slate-500 flex items-center gap-1.5 mt-0.5">
                <Shield className="w-3.5 h-3.5 text-indigo-500" />
                <span>Admin: {team.adminName || 'Organization Admin'}</span>
              </p>
            </div>
          </div>
          <Badge variant={team.status === 'active' ? 'success' : 'secondary'} dot>
            {team.status === 'active' ? 'Active' : 'Archived'}
          </Badge>
        </div>

        <p className="text-xs text-slate-600 leading-relaxed mb-4">
          {team.description || 'No description provided.'}
        </p>

        {/* Team Group Chat Button */}
        {onStartTeamGroupChat && (
          <button
            type="button"
            onClick={() => onStartTeamGroupChat(team)}
            className="w-full mb-3.5 py-2 px-3 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs flex items-center justify-center gap-2 shadow-sm transition-all cursor-pointer"
          >
            <Users className="w-4 h-4" />
            <span>Open Team Group Chat ({members.length} Members)</span>
          </button>
        )}

        {/* Member Roster Preview */}
        <div className="bg-slate-50 border border-slate-100 rounded-xl p-3 mb-4">
          <div className="flex items-center justify-between mb-2">
            <span className="text-[11px] font-bold text-slate-700 uppercase tracking-wider flex items-center gap-1.5">
              <Users className="w-3.5 h-3.5 text-slate-500" />
              Direct 1-on-1 Chats ({members.length})
            </span>
            {isAdmin && onManageMembers && (
              <button
                onClick={() => onManageMembers(team)}
                className="text-[11px] font-semibold text-indigo-600 hover:text-indigo-800 flex items-center gap-1 cursor-pointer"
              >
                <UserPlus className="w-3 h-3" />
                Manage
              </button>
            )}
          </div>

          <div className="space-y-1.5 max-h-36 overflow-y-auto pr-1">
            {members.length === 0 ? (
              <p className="text-[11px] text-slate-400 italic">No members assigned yet.</p>
            ) : (
              members.map((member) => {
                const isMe = currentUserId === member.id;
                return (
                  <div
                    key={member.id}
                    className="flex items-center justify-between p-1.5 rounded-lg bg-white border border-slate-200/60 text-xs"
                  >
                    <div className="flex items-center gap-2 min-w-0">
                      <div className="w-6 h-6 rounded-full bg-slate-800 text-white flex items-center justify-center text-[10px] font-bold shrink-0">
                        {member.display_name.charAt(0)}
                      </div>
                      <div className="truncate">
                        <span className="font-semibold text-slate-800 block truncate leading-tight">
                          {member.display_name} {isMe ? '(You)' : ''}
                        </span>
                        <span className="text-[10px] text-slate-500 font-mono">
                          @{member.username}
                        </span>
                      </div>
                    </div>

                    {/* Start 1-on-1 Chat Button for regular users */}
                    {!isAdmin && onStartChatWithMember && !isMe && (
                      <button
                        onClick={() => onStartChatWithMember(member, team)}
                        className="px-2 py-1 text-[11px] font-semibold text-indigo-600 bg-indigo-50 hover:bg-indigo-100 rounded-md transition-colors flex items-center gap-1 shrink-0 cursor-pointer"
                      >
                        <MessageSquare className="w-3 h-3" />
                        Chat
                      </button>
                    )}
                  </div>
                );
              })
            )}
          </div>
        </div>
      </div>

      {/* Card Footer */}
      <div className="pt-3 border-t border-slate-100 flex items-center justify-between text-xs text-slate-400">
        <span>Created {formatDate(team.created_at)}</span>
        {isAdmin && onDeleteTeam && (
          <button
            onClick={() => {
              if (confirm(`Are you sure you want to delete ${team.name}?`)) {
                onDeleteTeam(team.id);
              }
            }}
            className="text-slate-400 hover:text-rose-600 p-1 rounded-lg hover:bg-rose-50 transition-colors cursor-pointer"
            title="Delete Team"
          >
            <Trash2 className="w-4 h-4" />
          </button>
        )}
      </div>
    </Card>
  );
};
