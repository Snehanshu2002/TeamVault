'use client';

import React, { useEffect, useRef, useMemo } from 'react';
import { useChat } from '@/lib/hooks/useChat';
import { mockSupabase } from '@/lib/supabase/mockSupabase';
import { ChatService } from '@/lib/services/chatService';
import { MessageItem } from '@/components/chat/MessageItem';
import { MessageInput } from '@/components/chat/MessageInput';
import { Radio, ArrowLeft, SplitSquareVertical } from 'lucide-react';
import Link from 'next/link';

export default function TwoPanelDemoPage() {
  const rahulProfile = useMemo(() => {
    return mockSupabase.getProfileById('u0000000-0000-0000-0000-000000000003') || {
      id: 'u0000000-0000-0000-0000-000000000003',
      organization_id: 'a0000000-0000-0000-0000-000000000001',
      display_name: 'Rahul Sharma',
      username: 'rahul',
      email: 'rahul@example.com',
      role: 'USER' as const,
      status: 'active' as const,
      created_at: '',
      updated_at: '',
      isOnline: true,
    };
  }, []);

  const amitProfile = useMemo(() => {
    return mockSupabase.getProfileById('u0000000-0000-0000-0000-000000000004') || {
      id: 'u0000000-0000-0000-0000-000000000004',
      organization_id: 'a0000000-0000-0000-0000-000000000001',
      display_name: 'Amit Patel',
      username: 'amit',
      email: 'amit@example.com',
      role: 'USER' as const,
      status: 'active' as const,
      created_at: '',
      updated_at: '',
      isOnline: true,
    };
  }, []);

  // Find or create conversation between Rahul and Amit on Team Alpha in Acme Corp
  const conversation = useMemo(() => {
    return ChatService.getOrCreatePrivateConversation(
      rahulProfile.organization_id,
      't0000000-0000-0000-0000-000000000001',
      rahulProfile.id,
      amitProfile.id
    );
  }, [rahulProfile.organization_id, rahulProfile.id, amitProfile.id]);

  // Hook for Rahul panel
  const rahulChat = useChat(conversation.id, rahulProfile);
  // Hook for Amit panel
  const amitChat = useChat(conversation.id, amitProfile);

  const rahulScrollRef = useRef<HTMLDivElement>(null);
  const amitScrollRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (rahulScrollRef.current) {
      rahulScrollRef.current.scrollTop = rahulScrollRef.current.scrollHeight;
    }
    if (amitScrollRef.current) {
      amitScrollRef.current.scrollTop = amitScrollRef.current.scrollHeight;
    }
  }, [rahulChat.messages, amitChat.messages]);

  const handleRahulSend = async (text: string) => {
    await rahulChat.sendMessage(text);
  };

  const handleAmitSend = async (text: string) => {
    await amitChat.sendMessage(text);
  };

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 flex flex-col">
      {/* Top Banner */}
      <header className="bg-slate-900 border-b border-slate-800 px-4 sm:px-6 py-3 flex items-center justify-between">
        <div className="flex items-center gap-3">
          <Link
            href="/user"
            className="flex items-center gap-1.5 px-3 py-1.5 text-xs font-semibold text-slate-300 hover:text-white bg-slate-800 hover:bg-slate-700 rounded-xl transition-colors border border-slate-700 cursor-pointer"
          >
            <ArrowLeft className="w-3.5 h-3.5" />
            <span>Back to Dashboard</span>
          </Link>
          <div className="hidden sm:flex items-center gap-2">
            <span className="text-sm font-bold text-white">Live Real-Time Demonstration</span>
            <span className="text-slate-500">•</span>
            <span className="text-xs text-indigo-300">Acme Corp • Team Alpha Private Chat</span>
          </div>
        </div>

        <div className="flex items-center gap-2 sm:gap-3">
          {/* Status Badges */}
          <div className="flex items-center gap-1.5 px-3 py-1 rounded-full bg-emerald-950/80 border border-emerald-500/40 text-emerald-400 text-xs font-bold shadow-xs">
            <span className="relative flex h-2 w-2">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
              <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-500"></span>
            </span>
            <span>REAL-TIME DEMO</span>
          </div>

          <div className="hidden md:flex items-center gap-1.5 px-3 py-1 rounded-full bg-indigo-950/80 border border-indigo-500/40 text-indigo-300 text-xs font-medium">
            <Radio className="w-3 h-3 text-indigo-400 animate-pulse" />
            <span>Two users connected</span>
          </div>

          <Link
            href="/admin/conversations"
            className="px-3 py-1 text-xs font-semibold text-amber-300 bg-amber-950/60 hover:bg-amber-900/60 border border-amber-500/40 rounded-full transition-colors flex items-center gap-1 cursor-pointer"
          >
            <span>Admin View</span>
          </Link>
        </div>
      </header>

      {/* Main Two-Panel Arena */}
      <div className="flex-1 p-3 sm:p-6 grid grid-cols-1 lg:grid-cols-2 gap-4 sm:gap-6 max-w-7xl w-full mx-auto min-h-0">
        {/* LEFT PANEL: RAHUL */}
        <div className="flex flex-col bg-[#efeae2] border border-[#d1d7db] rounded-3xl overflow-hidden shadow-2xl h-[calc(100vh-10.5rem)] min-h-[520px]">
          {/* WhatsApp Panel Header */}
          <div className="h-15 px-4 bg-[#f0f2f5] border-b border-[#e9edef] flex items-center justify-between shrink-0 select-none">
            <div className="flex items-center gap-3">
              <div className="relative">
                <div className="w-10 h-10 rounded-full bg-[#0284c7] text-white font-bold flex items-center justify-center text-sm shadow-2xs">
                  R
                </div>
                <span className="absolute bottom-0 right-0 w-3 h-3 bg-[#25d366] border-2 border-white rounded-full" />
              </div>
              <div>
                <div className="flex items-center gap-2">
                  <h3 className="text-[14.5px] font-semibold text-[#111b21] leading-tight">
                    Rahul Sharma
                  </h3>
                  <span className="text-[10px] font-bold px-1.5 py-0.2 rounded bg-[#e7fce3] text-[#00a884] border border-[#a8f2a2]">
                    Tab 1
                  </span>
                </div>
                <p className="text-[11.5px] text-[#667781] flex items-center gap-1.5 mt-0.5">
                  <span className="text-[#00a884] font-medium">online</span>
                  <span>•</span>
                  <span>Chatting with @amit</span>
                </p>
              </div>
            </div>

            <div className="text-right text-[11px] text-[#667781] hidden sm:block">
              <span className="font-semibold text-[#00a884]">Team Alpha</span>
            </div>
          </div>

          {/* Messages Stream for Rahul */}
          <div 
            ref={rahulScrollRef} 
            className="flex-1 p-3 sm:p-4 overflow-y-auto space-y-1"
            style={{
              backgroundColor: '#efeae2',
              backgroundImage: 'radial-gradient(#d1c7b7 0.85px, transparent 0.85px)',
              backgroundSize: '18px 18px',
            }}
          >
            {/* End to end privacy pill */}
            <div className="flex justify-center my-2">
              <span className="bg-[#ffeecd] text-[#66532d] text-[11px] font-medium px-3 py-1 rounded-lg shadow-2xs border border-[#f5dfaa]">
                🔒 1-on-1 Private Channel (Team Alpha)
              </span>
            </div>

            {rahulChat.messages.map((msg, idx) => (
              <MessageItem
                key={msg.id}
                message={msg}
                isCurrentUser={msg.sender_id === rahulProfile.id}
                showSenderName={msg.sender_id !== rahulProfile.id}
                isFirstInGroup={idx === 0 || rahulChat.messages[idx - 1]?.sender_id !== msg.sender_id}
                isLastInGroup={idx === rahulChat.messages.length - 1 || rahulChat.messages[idx + 1]?.sender_id !== msg.sender_id}
              />
            ))}
          </div>

          {/* Input for Rahul */}
          <div className="shrink-0">
            <MessageInput
              onSendMessage={handleRahulSend}
              placeholder="Message as Rahul (e.g. Hi Amit, how is the project going?)"
            />
          </div>
        </div>

        {/* RIGHT PANEL: AMIT */}
        <div className="flex flex-col bg-[#efeae2] border border-[#d1d7db] rounded-3xl overflow-hidden shadow-2xl h-[calc(100vh-10.5rem)] min-h-[520px]">
          {/* WhatsApp Panel Header */}
          <div className="h-15 px-4 bg-[#f0f2f5] border-b border-[#e9edef] flex items-center justify-between shrink-0 select-none">
            <div className="flex items-center gap-3">
              <div className="relative">
                <div className="w-10 h-10 rounded-full bg-[#00a884] text-white font-bold flex items-center justify-center text-sm shadow-2xs">
                  A
                </div>
                <span className="absolute bottom-0 right-0 w-3 h-3 bg-[#25d366] border-2 border-white rounded-full" />
              </div>
              <div>
                <div className="flex items-center gap-2">
                  <h3 className="text-[14.5px] font-semibold text-[#111b21] leading-tight">
                    Amit Patel
                  </h3>
                  <span className="text-[10px] font-bold px-1.5 py-0.2 rounded bg-[#e7fce3] text-[#00a884] border border-[#a8f2a2]">
                    Tab 2
                  </span>
                </div>
                <p className="text-[11.5px] text-[#667781] flex items-center gap-1.5 mt-0.5">
                  <span className="text-[#00a884] font-medium">online</span>
                  <span>•</span>
                  <span>Chatting with @rahul</span>
                </p>
              </div>
            </div>

            <div className="text-right text-[11px] text-[#667781] hidden sm:block">
              <span className="font-semibold text-[#00a884]">Team Alpha</span>
            </div>
          </div>

          {/* Messages Stream for Amit */}
          <div 
            ref={amitScrollRef} 
            className="flex-1 p-3 sm:p-4 overflow-y-auto space-y-1"
            style={{
              backgroundColor: '#efeae2',
              backgroundImage: 'radial-gradient(#d1c7b7 0.85px, transparent 0.85px)',
              backgroundSize: '18px 18px',
            }}
          >
            {/* End to end privacy pill */}
            <div className="flex justify-center my-2">
              <span className="bg-[#ffeecd] text-[#66532d] text-[11px] font-medium px-3 py-1 rounded-lg shadow-2xs border border-[#f5dfaa]">
                🔒 1-on-1 Private Channel (Team Alpha)
              </span>
            </div>

            {amitChat.messages.map((msg, idx) => (
              <MessageItem
                key={msg.id}
                message={msg}
                isCurrentUser={msg.sender_id === amitProfile.id}
                showSenderName={msg.sender_id !== amitProfile.id}
                isFirstInGroup={idx === 0 || amitChat.messages[idx - 1]?.sender_id !== msg.sender_id}
                isLastInGroup={idx === amitChat.messages.length - 1 || amitChat.messages[idx + 1]?.sender_id !== msg.sender_id}
              />
            ))}
          </div>

          {/* Input for Amit */}
          <div className="shrink-0">
            <MessageInput
              onSendMessage={handleAmitSend}
              placeholder="Reply as Amit (e.g. Hey Rahul, everything is on track!)"
            />
          </div>
        </div>
      </div>

      {/* Footer Info */}
      <div className="bg-slate-900/60 border-t border-slate-800/80 px-4 py-3 text-center text-xs text-slate-400">
        <span>
          🚀 Real-time PostgreSQL event architecture. Messages persist across Supabase database tables and reflect across the Admin conversation oversight dashboards.
        </span>
      </div>
    </div>
  );
}
