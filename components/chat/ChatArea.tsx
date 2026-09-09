'use client';

import React, { useEffect, useRef } from 'react';
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

          <div className="relative shrink-0">
            <div
              className={`w-10 h-10 rounded-full ${avatarBg} text-white font-bold flex items-center justify-center text-sm shadow-2xs`}
            >
              {participantSummary.title.charAt(0)}
            </div>
            <span className="absolute bottom-0 right-0 w-3 h-3 bg-[#25d366] border-2 border-white rounded-full" />
          </div>

          <div className="min-w-0">
            <h2 className="text-[15px] font-semibold text-[#111b21] truncate leading-tight">
              {participantSummary.title}
            </h2>
            <div className="text-[12px] text-[#667781] flex items-center gap-1.5 truncate">
              <span className="text-[#00a884] font-medium">online</span>
              <span>•</span>
              <span className="truncate">{conversation.team_name || 'Team Chat'}</span>
            </div>
          </div>
        </div>

        {/* Right Header Options */}
        <div className="flex items-center gap-1 text-[#54656f]">
          {isReadOnlyAdminView ? (
            <div className="flex items-center gap-1 px-2.5 py-1 rounded-full bg-amber-100/90 text-amber-800 text-[11px] font-bold border border-amber-300">
              <ShieldCheck className="w-3.5 h-3.5 text-amber-700" />
              <span>Admin Oversight</span>
            </div>
          ) : (
            <>
              <button
                type="button"
                title="Search in chat"
                className="p-2 hover:bg-slate-200/60 rounded-full transition-colors cursor-pointer"
              >
                <Search className="w-5 h-5" />
              </button>
              <button
                type="button"
                title="Menu"
                className="p-2 hover:bg-slate-200/60 rounded-full transition-colors cursor-pointer"
              >
                <MoreVertical className="w-5 h-5" />
              </button>
            </>
          )}
        </div>
      </div>

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
        ) : messages.length === 0 ? (
          <div className="h-48 flex flex-col items-center justify-center text-center p-6">
            <div className="w-12 h-12 rounded-full bg-white/80 text-[#00a884] flex items-center justify-center mb-2 shadow-2xs">
              <Users className="w-6 h-6" />
            </div>
            <p className="text-[13px] font-semibold text-[#111b21]">No messages yet</p>
            <p className="text-[11.5px] text-[#667781] mt-0.5">
              Send a message below to start this private conversation.
            </p>
          </div>
        ) : (
          messages.map((msg, index) => {
            const isCurr = !isReadOnlyAdminView && currentUser?.id === msg.sender_id;
            const prevMsg = index > 0 ? messages[index - 1] : null;
            const nextMsg = index < messages.length - 1 ? messages[index + 1] : null;

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

