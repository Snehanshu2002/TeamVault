'use client';

import React, { useState, useEffect, useRef } from 'react';
import { Conversation, Message, Profile } from '@/lib/types';
import { MessageItem } from './MessageItem';
import { MessageInput } from './MessageInput';
import { ChatService } from '@/lib/services/chatService';
import { 
  ShieldCheck, 
  ArrowLeft, 
  Lock, 
  Search, 
  MoreVertical, 
  Users,
  Info
} from 'lucide-react';
import { format, isToday, isYesterday, parseISO } from 'date-fns';

export interface ChatAreaProps {
  conversation: Conversation | null;
  currentUser: Profile | null;
  messages: Message[];
  loading?: boolean;
  onSendMessage?: (text: string) => Promise<unknown> | void;
  onBack?: () => void;
  isReadOnlyAdminView?: boolean;
}

export const ChatArea: React.FC<ChatAreaProps> = ({
  conversation,
  currentUser,
  messages,
  loading = false,
  onSendMessage,
  onBack,
  isReadOnlyAdminView = false,
}) => {
  const scrollRef = useRef<HTMLDivElement>(null);
  const [searchOpen, setSearchOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [menuOpen, setMenuOpen] = useState(false);
  const [isMuted, setIsMuted] = useState(false);
  const [showInfoModal, setShowInfoModal] = useState(false);

  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
  }, [messages]);

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

  const formatDateSeparator = (isoString: string) => {
    try {
      const date = parseISO(isoString);
      if (isToday(date)) return 'TODAY';
      if (isYesterday(date)) return 'YESTERDAY';
      return format(date, 'MMMM d, yyyy').toUpperCase();
    } catch {
      return '';
    }
  };

  if (!conversation) {
    return (
      <div 
        className="h-full flex flex-col items-center justify-center p-8 text-center bg-[#f0f2f5] border-b-6 border-[#00a884] select-none"
        style={{
          backgroundColor: '#f0f2f5',
          backgroundImage: 'radial-gradient(#d1c7b7 0.75px, transparent 0.75px)',
          backgroundSize: '16px 16px',
        }}
      >
        <div className="w-16 h-16 rounded-full bg-[#e7fce3] text-[#00a884] flex items-center justify-center mb-4 shadow-sm">
          <Lock className="w-8 h-8" />
        </div>
        <h3 className="text-xl font-bold text-[#111b21]">Private Team Messenger</h3>
        <p className="text-[13px] text-[#667781] max-w-sm mt-1.5 leading-relaxed">
          Select a conversation from the left sidebar or start a new private 1-on-1 team chat to send secure end-to-end scoped messages.
        </p>
        <div className="flex items-center gap-1.5 mt-8 text-[11px] text-[#8696a0]">
          <Lock className="w-3.5 h-3.5" />
          <span>Strict Multi-Tenant Database Isolation</span>
        </div>
      </div>
    );
  }

  const participantSummary = ChatService.getParticipantSummary(
    conversation,
    isReadOnlyAdminView ? undefined : currentUser?.id
  );

  const avatarBg = getAvatarColor(participantSummary.title);

  // Filter messages by search query if search is active
  const displayedMessages = searchQuery.trim()
    ? messages.filter((m) => m.message.toLowerCase().includes(searchQuery.toLowerCase()))
    : messages;

  return (
    <div className="h-full flex flex-col bg-[#efeae2] relative overflow-hidden select-none">
      {/* WhatsApp Web Sticky Chat Header */}
      <div className="h-15 px-3 sm:px-4 bg-[#f0f2f5] border-b border-[#e9edef] flex items-center justify-between shrink-0 z-10">
        <div className="flex items-center gap-2.5 sm:gap-3 min-w-0">
          {onBack && (
            <button
              onClick={onBack}
              title="Back to chats"
              className="lg:hidden p-1.5 text-[#54656f] hover:text-[#111b21] rounded-full hover:bg-slate-200/60 cursor-pointer"
            >
              <ArrowLeft className="w-5 h-5" />
            </button>
          )}

          <div 
            onClick={() => setShowInfoModal(true)}
            className="relative shrink-0 cursor-pointer"
            title="Click to view info"
          >
            <div
              className={`w-10 h-10 rounded-full ${
                conversation.conversation_type === 'GROUP' ? 'bg-emerald-600' : avatarBg
              } text-white font-bold flex items-center justify-center text-sm shadow-2xs`}
            >
              {conversation.conversation_type === 'GROUP' ? (
                <Users className="w-5 h-5 text-white" />
              ) : (
                participantSummary.title.charAt(0)
              )}
            </div>
            <span className="absolute bottom-0 right-0 w-3 h-3 bg-[#25d366] border-2 border-white rounded-full" />
          </div>

          <div 
            onClick={() => setShowInfoModal(true)}
            className="min-w-0 cursor-pointer"
            title="Click to view info"
          >
            <div className="flex items-center gap-1.5 truncate">
              {conversation.conversation_type === 'GROUP' && (
                <span className="text-[10px] bg-emerald-100 text-emerald-800 font-bold px-1.5 py-0.2 rounded shrink-0">
                  GROUP
                </span>
              )}
              <h2 className="text-[15px] font-semibold text-[#111b21] truncate leading-tight">
                {participantSummary.title}
              </h2>
            </div>
            <div className="text-[12px] text-[#667781] flex items-center gap-1.5 truncate">
              {conversation.conversation_type === 'GROUP' ? (
                <span className="truncate">
                  {conversation.participantIds.length} members: {participantSummary.participantProfiles.map(p => p.display_name).join(', ')}
                </span>
              ) : (
                <>
                  <span className="text-[#00a884] font-medium">online</span>
                  <span>•</span>
                  <span className="truncate">{conversation.team_name || 'Team Chat'}</span>
                </>
              )}
            </div>
          </div>
        </div>

        {/* Right Header Options */}
        <div className="flex items-center gap-1 text-[#54656f] relative">
          {isReadOnlyAdminView ? (
            <div className="flex items-center gap-1 px-2.5 py-1 rounded-full bg-amber-100/90 text-amber-800 text-[11px] font-bold border border-amber-300">
              <ShieldCheck className="w-3.5 h-3.5 text-amber-700" />
              <span>Admin Oversight</span>
            </div>
          ) : (
            <>
              <button
                type="button"
                onClick={() => {
                  setSearchOpen((prev) => !prev);
                  if (searchOpen) setSearchQuery('');
                }}
                title="Search in chat"
                className={`p-2 rounded-full transition-colors cursor-pointer ${
                  searchOpen ? 'bg-slate-300/80 text-[#00a884]' : 'hover:bg-slate-200/60'
                }`}
              >
                <Search className="w-5 h-5" />
              </button>
              <button
                type="button"
                onClick={() => setMenuOpen((prev) => !prev)}
                title="Menu"
                className={`p-2 rounded-full transition-colors cursor-pointer ${
                  menuOpen ? 'bg-slate-300/80 text-[#111b21]' : 'hover:bg-slate-200/60'
                }`}
              >
                <MoreVertical className="w-5 h-5" />
              </button>

              {/* 3-Dots Dropdown Menu */}
              {menuOpen && (
                <div className="absolute top-12 right-0 z-30 bg-white border border-slate-200 rounded-2xl shadow-xl py-1.5 w-52 text-xs font-medium text-slate-700">
                  <button
                    type="button"
                    onClick={() => {
                      setShowInfoModal(true);
                      setMenuOpen(false);
                    }}
                    className="w-full text-left px-3.5 py-2 hover:bg-slate-50 flex items-center gap-2 cursor-pointer"
                  >
                    <Info className="w-4 h-4 text-indigo-600" />
                    <span>View {conversation.conversation_type === 'GROUP' ? 'Group' : 'Contact'} Info</span>
                  </button>
                  <button
                    type="button"
                    onClick={() => {
                      setIsMuted((prev) => !prev);
                      setMenuOpen(false);
                    }}
                    className="w-full text-left px-3.5 py-2 hover:bg-slate-50 flex items-center gap-2 cursor-pointer"
                  >
                    <Lock className="w-4 h-4 text-slate-500" />
                    <span>{isMuted ? 'Unmute Notifications' : 'Mute Notifications'}</span>
                  </button>
                  <button
                    type="button"
                    onClick={() => {
                      const dataStr = 'data:text/json;charset=utf-8,' + encodeURIComponent(JSON.stringify(messages, null, 2));
                      const downloadAnchor = document.createElement('a');
                      downloadAnchor.setAttribute('href', dataStr);
                      downloadAnchor.setAttribute('download', `audit_chat_${conversation.id}.json`);
                      document.body.appendChild(downloadAnchor);
                      downloadAnchor.click();
                      downloadAnchor.remove();
                      setMenuOpen(false);
                    }}
                    className="w-full text-left px-3.5 py-2 hover:bg-slate-50 flex items-center gap-2 cursor-pointer"
                  >
                    <ShieldCheck className="w-4 h-4 text-emerald-600" />
                    <span>Export Chat Transcript</span>
                  </button>
                </div>
              )}
            </>
          )}
        </div>
      </div>

      {/* In-Chat Search Bar */}
      {searchOpen && (
        <div className="px-4 py-2 bg-white border-b border-[#e9edef] flex items-center gap-2 z-10 animate-in fade-in slide-in-from-top-2 duration-150">
          <Search className="w-4 h-4 text-[#54656f]" />
          <input
            type="text"
            placeholder="Search messages in this chat..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="flex-1 bg-transparent text-xs text-slate-800 placeholder-slate-400 focus:outline-none"
            autoFocus
          />
          {searchQuery && (
            <span className="text-[11px] text-slate-500 font-medium">
              {displayedMessages.length} found
            </span>
          )}
          <button
            onClick={() => {
              setSearchOpen(false);
              setSearchQuery('');
            }}
            className="p-1 hover:bg-slate-100 rounded-full text-slate-400 hover:text-slate-600 cursor-pointer"
          >
            <ArrowLeft className="w-4 h-4" />
          </button>
        </div>
      )}

      {/* Info Modal Popup */}
      {showInfoModal && (
        <div className="fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl max-w-md w-full shadow-2xl overflow-hidden border border-slate-200">
            <div className="p-6 bg-slate-900 text-white text-center relative">
              <button
                onClick={() => setShowInfoModal(false)}
                className="absolute top-4 right-4 p-1.5 rounded-full hover:bg-slate-800 text-slate-400 hover:text-white cursor-pointer"
              >
                ✕
              </button>
              <div
                className={`w-16 h-16 rounded-full mx-auto mb-3 ${
                  conversation.conversation_type === 'GROUP' ? 'bg-emerald-600' : avatarBg
                } text-white font-bold text-2xl flex items-center justify-center shadow-lg`}
              >
                {conversation.conversation_type === 'GROUP' ? (
                  <Users className="w-8 h-8" />
                ) : (
                  participantSummary.title.charAt(0)
                )}
              </div>
              <h3 className="text-lg font-bold">{participantSummary.title}</h3>
              <p className="text-xs text-slate-400 mt-1">{conversation.team_name || 'Team Chat'}</p>
            </div>

            <div className="p-5 space-y-4 text-xs">
              <div>
                <h4 className="font-bold text-slate-700 uppercase tracking-wider mb-2">
                  Participants ({participantSummary.participantProfiles.length})
                </h4>
                <div className="space-y-2 max-h-48 overflow-y-auto">
                  {participantSummary.participantProfiles.map((p) => (
                    <div
                      key={p.id}
                      className="flex items-center justify-between p-2 rounded-xl bg-slate-50 border border-slate-100"
                    >
                      <div className="flex items-center gap-2.5">
                        <div className="w-7 h-7 rounded-full bg-slate-800 text-white flex items-center justify-center text-xs font-bold">
                          {p.display_name.charAt(0)}
                        </div>
                        <div>
                          <span className="font-bold text-slate-900 block">{p.display_name}</span>
                          <span className="text-[10px] text-slate-500 font-mono">@{p.username}</span>
                        </div>
                      </div>
                      <span className="px-2 py-0.5 rounded-md bg-emerald-100 text-emerald-800 text-[10px] font-bold">
                        {p.role}
                      </span>
                    </div>
                  ))}
                </div>
              </div>

              <div className="p-3 bg-indigo-50 border border-indigo-100 rounded-xl text-indigo-900 flex items-center gap-2">
                <Lock className="w-4 h-4 text-indigo-600 shrink-0" />
                <span>Messages in this conversation are scoped strictly to authorized team members.</span>
              </div>

              <div className="flex justify-end pt-2">
                <button
                  type="button"
                  onClick={() => setShowInfoModal(false)}
                  className="px-4 py-2 bg-slate-900 text-white rounded-xl font-bold hover:bg-slate-800 cursor-pointer"
                >
                  Done
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Admin Live Audit Banner */}
      {isReadOnlyAdminView && (
        <div className="bg-amber-50 border-b border-amber-200 px-4 py-2 text-xs text-amber-900 flex items-center gap-2 shrink-0 z-10">
          <Info className="w-4 h-4 text-amber-600 shrink-0" />
          <span>
            Live inspection active for <strong>{conversation.team_name}</strong>. Participant activities are logged.
          </span>
        </div>
      )}

      {/* WhatsApp Chat Wallpaper & Message Stream */}
      <div
        ref={scrollRef}
        className="flex-1 p-2 sm:p-4 overflow-y-auto space-y-1"
        style={{
          backgroundColor: '#efeae2',
          backgroundImage: 'radial-gradient(#d1c7b7 0.85px, transparent 0.85px)',
          backgroundSize: '18px 18px',
        }}
      >
        {/* End-to-End Privacy Pill */}
        <div className="flex justify-center my-3">
          <div className="bg-[#ffeecd] border border-[#f5dfaa] px-4 py-1.5 rounded-lg text-center max-w-md shadow-2xs">
            <div className="flex items-center justify-center gap-1.5 text-[11.5px] font-semibold text-[#66532d]">
              <Lock className="w-3.5 h-3.5 text-[#66532d]" />
              <span>End-to-End Private Team Scope</span>
            </div>
            <p className="text-[10.5px] text-[#7d683a] mt-0.5">
              Messages are isolated to authorized members of {conversation.team_name || 'this team'}.
            </p>
          </div>
        </div>

        {loading ? (
          <div className="h-40 flex items-center justify-center">
            <div className="w-6 h-6 border-2 border-[#00a884] border-t-transparent rounded-full animate-spin" />
          </div>
        ) : displayedMessages.length === 0 ? (
          <div className="h-48 flex flex-col items-center justify-center text-center p-6">
            <div className="w-12 h-12 rounded-full bg-white/80 text-[#00a884] flex items-center justify-center mb-2 shadow-2xs">
              <Search className="w-6 h-6" />
            </div>
            <p className="text-[13px] font-semibold text-[#111b21]">No matching messages found</p>
            <p className="text-[11.5px] text-[#667781] mt-0.5">
              Try searching with a different keyword.
            </p>
          </div>
        ) : (
          displayedMessages.map((msg, index) => {
            const isCurr = !isReadOnlyAdminView && currentUser?.id === msg.sender_id;
            const prevMsg = index > 0 ? displayedMessages[index - 1] : null;
            const nextMsg = index < displayedMessages.length - 1 ? displayedMessages[index + 1] : null;

            const isFirstInGroup = !prevMsg || prevMsg.sender_id !== msg.sender_id;
            const isLastInGroup = !nextMsg || nextMsg.sender_id !== msg.sender_id;

            // Date Separator Check
            let showDateSeparator = false;
            let dateLabel = '';
            if (index === 0) {
              showDateSeparator = true;
              dateLabel = formatDateSeparator(msg.created_at);
            } else if (prevMsg) {
              const prevDate = format(parseISO(prevMsg.created_at), 'yyyy-MM-dd');
              const currDate = format(parseISO(msg.created_at), 'yyyy-MM-dd');
              if (prevDate !== currDate) {
                showDateSeparator = true;
                dateLabel = formatDateSeparator(msg.created_at);
              }
            }

            return (
              <React.Fragment key={msg.id}>
                {showDateSeparator && dateLabel && (
                  <div className="flex justify-center my-3 select-none">
                    <span className="bg-white/95 text-[#54656f] text-[11px] font-bold px-3 py-1 rounded-lg shadow-2xs border border-slate-200/60 uppercase tracking-wider">
                      {dateLabel}
                    </span>
                  </div>
                )}
                <MessageItem
                  message={msg}
                  isCurrentUser={isCurr}
                  showSenderName={isReadOnlyAdminView || !isCurr}
                  isFirstInGroup={isFirstInGroup}
                  isLastInGroup={isLastInGroup}
                />
              </React.Fragment>
            );
          })
        )}
      </div>

      {/* Bottom Composer */}
      {isReadOnlyAdminView ? (
        <div className="px-4 py-3 bg-[#f0f2f5] border-t border-[#e9edef] text-center text-xs text-[#667781] font-medium flex items-center justify-center gap-1.5">
          <Lock className="w-3.5 h-3.5 text-[#667781]" />
          <span>Message sending disabled in Admin Inspection Mode</span>
        </div>
      ) : (
        onSendMessage && (
          <MessageInput
            onSendMessage={onSendMessage}
            placeholder="Type a message"
          />
        )
      )}
    </div>
  );
};

