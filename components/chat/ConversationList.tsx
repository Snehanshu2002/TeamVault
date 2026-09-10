'use client';

import React, { useState } from 'react';
import { Conversation, Profile } from '@/lib/types';
import { ChatService } from '@/lib/services/chatService';
import { AuthService } from '@/lib/services/authService';
import { 
  Search, 
  Plus, 
  MessageSquarePlus, 
  MoreVertical, 
  CircleDashed, 
  Filter,
  CheckCheck,
  Users,
  Shield,
  Lock,
  LogOut,
  Settings,
  X
} from 'lucide-react';
import { format, isToday, isYesterday, parseISO } from 'date-fns';
import { useRouter } from 'next/navigation';

export interface ConversationListProps {
  conversations: Conversation[];
  activeConversationId?: string;
  onSelectConversation: (conv: Conversation) => void;
  currentUser: Profile | null;
  onNewChat?: () => void;
  isReadOnlyAdminView?: boolean;
}

export const ConversationList: React.FC<ConversationListProps> = ({
  conversations,
  activeConversationId,
  onSelectConversation,
  currentUser,
  onNewChat,
  isReadOnlyAdminView = false,
}) => {
  const [search, setSearch] = useState('');
  const [filterType, setFilterType] = useState<'ALL' | 'UNREAD'>('ALL');
  const [showStatusModal, setShowStatusModal] = useState(false);
  const [showLeftMenu, setShowLeftMenu] = useState(false);
  const router = useRouter();

  const formatTime = (isoString?: string) => {
    if (!isoString) return '';
    try {
      const date = parseISO(isoString);
      if (isToday(date)) {
        return format(date, 'h:mm a');
      }
      if (isYesterday(date)) {
        return 'Yesterday';
      }
      return format(date, 'dd/MM/yyyy');
    } catch {
      return '';
    }
  };

  // Generate a consistent vibrant avatar color based on name
  const getAvatarColor = (name: string) => {
    const colors = [
      'bg-[#00a884]',
      'bg-[#0284c7]',
      'bg-[#7c3aed]',
      'bg-[#d97706]',
      'bg-[#e11d48]',
      'bg-[#059669]',
      'bg-[#4f46e5]',
    ];
    let hash = 0;
    for (let i = 0; i < name.length; i++) {
      hash = name.charCodeAt(i) + ((hash << 5) - hash);
    }
    return colors[Math.abs(hash) % colors.length];
  };

  const handleLogout = async () => {
    await AuthService.logout();
    router.push('/login');
  };

  const filteredConversations = conversations.filter((c) => {
    const summary = ChatService.getParticipantSummary(c, isReadOnlyAdminView ? undefined : currentUser?.id);
    const matchesTitle = summary.title.toLowerCase().includes(search.toLowerCase());
    const matchesUsernames = summary.usernames.some((u) => u.toLowerCase().includes(search.toLowerCase()));
    const matchesTeam = (c.team_name || '').toLowerCase().includes(search.toLowerCase());
    const matchesMessage = (c.last_message || '').toLowerCase().includes(search.toLowerCase());
    const matchesText = matchesTitle || matchesUsernames || matchesTeam || matchesMessage;

    if (!matchesText) return false;

    if (filterType === 'UNREAD' && currentUser) {
      const unread = ChatService.getUnreadCount(c.id, currentUser.id);
      return unread > 0;
    }
    return true;
  });

  return (
    <div className="h-full flex flex-col bg-white border-r border-[#e9edef] select-none relative">
      {/* WhatsApp Web Top Left Bar */}
      <div className="h-15 px-4 bg-[#f0f2f5] border-b border-[#e9edef] flex items-center justify-between shrink-0">
        <div className="flex items-center gap-3">
          <div
            className={`w-10 h-10 rounded-full ${
              currentUser ? getAvatarColor(currentUser.display_name) : 'bg-slate-700'
            } text-white font-bold flex items-center justify-center text-sm shadow-2xs`}
          >
            {currentUser?.display_name?.charAt(0) || 'U'}
          </div>
          <div>
            <div className="text-[13.5px] font-bold text-[#111b21] leading-none">
              {currentUser?.display_name || 'My Chats'}
            </div>
            <div className="text-[11px] text-[#667781] mt-1 font-mono">
              @{currentUser?.username || 'user'}
            </div>
          </div>
        </div>

        <div className="flex items-center gap-1 text-[#54656f] relative">
          <button
            type="button"
            onClick={() => setShowStatusModal(true)}
            title="View Team Status Stories"
            className="p-2 hover:bg-slate-200/60 rounded-full transition-colors cursor-pointer text-[#00a884]"
          >
            <CircleDashed className="w-5 h-5" />
          </button>
          {onNewChat && (
            <button
              type="button"
              onClick={onNewChat}
              title="New Chat"
              className="p-2 hover:bg-slate-200/60 rounded-full transition-colors cursor-pointer text-[#00a884] hover:text-[#008f6f]"
            >
              <MessageSquarePlus className="w-5 h-5" />
            </button>
          )}
          <button
            type="button"
            onClick={() => setShowLeftMenu((prev) => !prev)}
            title="Menu"
            className={`p-2 rounded-full transition-colors cursor-pointer ${
              showLeftMenu ? 'bg-slate-300/80 text-[#111b21]' : 'hover:bg-slate-200/60'
            }`}
          >
            <MoreVertical className="w-5 h-5" />
          </button>

          {/* Left 3-Dots Dropdown Menu */}
          {showLeftMenu && (
            <div className="absolute top-12 right-0 z-30 bg-white border border-slate-200 rounded-2xl shadow-xl py-1.5 w-52 text-xs font-medium text-slate-700">
              {onNewChat && (
                <button
                  type="button"
                  onClick={() => {
                    setShowLeftMenu(false);
                    onNewChat();
                  }}
                  className="w-full text-left px-3.5 py-2 hover:bg-slate-50 flex items-center gap-2 cursor-pointer"
                >
                  <MessageSquarePlus className="w-4 h-4 text-emerald-600" />
                  <span>Start New Chat</span>
                </button>
              )}
              <button
                type="button"
                onClick={() => {
                  setShowLeftMenu(false);
                  setShowStatusModal(true);
                }}
                className="w-full text-left px-3.5 py-2 hover:bg-slate-50 flex items-center gap-2 cursor-pointer"
              >
                <CircleDashed className="w-4 h-4 text-indigo-600" />
                <span>Team Status Updates</span>
              </button>
              <button
                type="button"
                onClick={() => {
                  setShowLeftMenu(false);
                  router.push('/user/settings');
                }}
                className="w-full text-left px-3.5 py-2 hover:bg-slate-50 flex items-center gap-2 cursor-pointer"
              >
                <Settings className="w-4 h-4 text-slate-500" />
                <span>Account Settings</span>
              </button>
              <div className="border-t border-slate-100 my-1" />
              <button
                type="button"
                onClick={handleLogout}
                className="w-full text-left px-3.5 py-2 hover:bg-rose-50 text-rose-600 flex items-center gap-2 cursor-pointer font-bold"
              >
                <LogOut className="w-4 h-4 text-rose-600" />
                <span>Sign Out</span>
              </button>
            </div>
          )}
        </div>
      </div>

      {/* Status Stories Modal */}
      {showStatusModal && (
        <div className="fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl max-w-sm w-full shadow-2xl overflow-hidden border border-slate-200 animate-in fade-in zoom-in-95 duration-150">
            <div className="p-4 bg-emerald-600 text-white flex items-center justify-between">
              <div className="flex items-center gap-2">
                <CircleDashed className="w-5 h-5" />
                <span className="font-bold text-sm">Team Status & Stories</span>
              </div>
              <button
                onClick={() => setShowStatusModal(false)}
                className="p-1 hover:bg-emerald-700 rounded-full cursor-pointer"
              >
                <X className="w-4 h-4" />
              </button>
            </div>
            <div className="p-4 space-y-3 text-xs">
              <div className="flex items-center gap-3 p-2 rounded-xl bg-slate-50 border border-slate-100">
                <div className="w-10 h-10 rounded-full border-2 border-emerald-500 p-0.5">
                  <div className="w-full h-full rounded-full bg-emerald-600 text-white flex items-center justify-center font-bold">
                    {currentUser?.display_name?.charAt(0) || 'U'}
                  </div>
                </div>
                <div>
                  <h4 className="font-bold text-slate-800">My Status</h4>
                  <p className="text-[11px] text-emerald-600 font-medium">● Online & Available</p>
                </div>
              </div>

              <div className="border-t border-slate-100 pt-2">
                <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">
                  Recent Team Updates
                </span>
                <div className="mt-2 space-y-2">
                  <div className="flex items-center gap-3 p-2 rounded-xl hover:bg-slate-50 transition-colors">
                    <div className="w-9 h-9 rounded-full border-2 border-indigo-500 p-0.5">
                      <div className="w-full h-full rounded-full bg-indigo-600 text-white flex items-center justify-center font-bold text-xs">
                        A
                      </div>
                    </div>
                    <div>
                      <h4 className="font-bold text-slate-800">Amit Patel</h4>
                      <p className="text-[11px] text-slate-500">Working on Sprint Review (Today at 10:15 AM)</p>
                    </div>
                  </div>

                  <div className="flex items-center gap-3 p-2 rounded-xl hover:bg-slate-50 transition-colors">
                    <div className="w-9 h-9 rounded-full border-2 border-purple-500 p-0.5">
                      <div className="w-full h-full rounded-full bg-purple-600 text-white flex items-center justify-center font-bold text-xs">
                        A
                      </div>
                    </div>
                    <div>
                      <h4 className="font-bold text-slate-800">Anita Roy</h4>
                      <p className="text-[11px] text-slate-500">In Meeting with Client (Today at 09:30 AM)</p>
                    </div>
                  </div>
                </div>
              </div>

              <div className="pt-2 flex justify-end">
                <button
                  type="button"
                  onClick={() => setShowStatusModal(false)}
                  className="px-4 py-1.5 bg-slate-900 text-white rounded-xl font-bold hover:bg-slate-800 cursor-pointer"
                >
                  Close
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* WhatsApp Web Search & Filter Bar */}
      <div className="p-2 bg-white border-b border-[#f0f2f5] space-y-2">
        <div className="relative flex items-center">
          <Search className="w-4 h-4 absolute left-3.5 text-[#54656f]" />
          <input
            type="text"
            placeholder="Search or start new chat"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full bg-[#f0f2f5] text-[#111b21] placeholder-[#667781] text-[13px] pl-10 pr-4 py-1.5 rounded-lg border-none focus:outline-none focus:bg-white focus:ring-1 focus:ring-[#00a884] transition-all"
          />
        </div>

        {/* Filter Chips */}
        <div className="flex items-center gap-1.5 px-1 pb-0.5">
          <button
            type="button"
            onClick={() => setFilterType('ALL')}
            className={`px-3 py-1 rounded-full text-xs font-semibold transition-colors cursor-pointer ${
              filterType === 'ALL'
                ? 'bg-[#e7fce3] text-[#00a884] border border-[#a8f2a2]'
                : 'bg-[#f0f2f5] text-[#54656f] hover:bg-slate-200/60'
            }`}
          >
            All
          </button>
          <button
            type="button"
            onClick={() => setFilterType('UNREAD')}
            className={`px-3 py-1 rounded-full text-xs font-semibold transition-colors cursor-pointer ${
              filterType === 'UNREAD'
                ? 'bg-[#e7fce3] text-[#00a884] border border-[#a8f2a2]'
                : 'bg-[#f0f2f5] text-[#54656f] hover:bg-slate-200/60'
            }`}
          >
            Unread
          </button>
        </div>
      </div>

      {/* Conversations Scrollable List */}
      <div className="flex-1 overflow-y-auto divide-y divide-[#f0f2f5]">
        {filteredConversations.length === 0 ? (
          <div className="p-8 text-center text-xs text-[#667781]">
            No chats found. Click the new chat button above to start a conversation with a teammate.
          </div>
        ) : (
          filteredConversations.map((conv) => {
            const summary = ChatService.getParticipantSummary(
              conv,
              isReadOnlyAdminView ? undefined : currentUser?.id
            );
            const isActive = activeConversationId === conv.id;
            const unreadCount = currentUser ? ChatService.getUnreadCount(conv.id, currentUser.id) : 0;
            const avatarBg = getAvatarColor(summary.title);

            return (
              <button
                key={conv.id}
                type="button"
                onClick={() => onSelectConversation(conv)}
                className={`w-full text-left px-3.5 py-3 transition-colors flex items-center gap-3.5 cursor-pointer border-l-4 ${
                  isActive
                    ? 'bg-[#f0f2f5] border-l-[#00a884]'
                    : 'bg-white hover:bg-[#f5f6f6] border-l-transparent'
                }`}
              >
                {/* Circular Avatar */}
                <div className="relative shrink-0">
                  <div
                    className={`w-12 h-12 rounded-full ${
                      conv.conversation_type === 'GROUP' ? 'bg-emerald-600' : avatarBg
                    } text-white font-bold text-base flex items-center justify-center shadow-2xs`}
                  >
                    {conv.conversation_type === 'GROUP' ? (
                      <Users className="w-5 h-5 text-white" />
                    ) : (
                      summary.title.charAt(0)
                    )}
                  </div>
                  <span className="absolute bottom-0 right-0 w-3.5 h-3.5 bg-[#25d366] border-2 border-white rounded-full" />
                </div>

                {/* Conversation Details */}
                <div className="min-w-0 flex-1">
                  <div className="flex items-center justify-between gap-1 mb-0.5">
                    <div className="flex items-center gap-1.5 truncate">
                      {conv.conversation_type === 'GROUP' && (
                        <span className="text-[10px] bg-emerald-100 text-emerald-800 font-bold px-1.5 py-0.5 rounded shrink-0">
                          GROUP
                        </span>
                      )}
                      <h4 className="text-[14.5px] font-semibold text-[#111b21] truncate">
                        {summary.title}
                      </h4>
                    </div>
                    <span
                      className={`text-[11px] shrink-0 ${
                        unreadCount > 0 ? 'text-[#25d366] font-bold' : 'text-[#667781]'
                      }`}
                    >
                      {formatTime(conv.last_message_at)}
                    </span>
                  </div>

                  <div className="flex items-center justify-between gap-2">
                    <p className="text-[13px] text-[#667781] truncate flex items-center gap-1">
                      {conv.last_message ? (
                        <>
                          <CheckCheck className="w-3.5 h-3.5 text-[#8696a0] shrink-0" />
                          <span className="truncate">{conv.last_message}</span>
                        </>
                      ) : (
                        <span className="italic text-[#8696a0]">Tap to send a message</span>
                      )}
                    </p>

                    <div className="flex items-center gap-1.5 shrink-0">
                      {conv.team_name && (
                        <span className="text-[10px] font-medium px-1.5 py-0.5 rounded bg-[#f0f2f5] text-[#54656f] border border-slate-200/50">
                          {conv.team_name}
                        </span>
                      )}
                      {unreadCount > 0 && (
                        <span className="min-w-[20px] h-5 px-1.5 rounded-full bg-[#25d366] text-white text-[11px] font-bold flex items-center justify-center">
                          {unreadCount}
                        </span>
                      )}
                    </div>
                  </div>
                </div>
              </button>
            );
          })
        )}
      </div>
    </div>
  );
};

