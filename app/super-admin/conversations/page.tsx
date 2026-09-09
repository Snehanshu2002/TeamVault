'use client';

import React, { useState, useEffect, Suspense } from 'react';
import { useSearchParams, useRouter } from 'next/navigation';
import { DashboardLayout } from '@/components/dashboard/DashboardLayout';
import { useAuth } from '@/lib/hooks/useAuth';
import { useChat } from '@/lib/hooks/useChat';
import { ConversationList } from '@/components/chat/ConversationList';
import { ChatArea } from '@/components/chat/ChatArea';
import { Conversation } from '@/lib/types';
import { Eye, ShieldCheck, Radio } from 'lucide-react';

function SuperAdminConversationsContent() {
  const searchParams = useSearchParams();
  const router = useRouter();
  const convIdParam = searchParams.get('convId') || undefined;

  const { user } = useAuth();
  const [activeConvId, setActiveConvId] = useState<string | undefined>(convIdParam);

  const {
    conversations,
    messages,
    activeConversation,
    loading,
  } = useChat(activeConvId, user);

  useEffect(() => {
    if (convIdParam) {
      setActiveConvId(convIdParam);
    } else if (conversations.length > 0 && !activeConvId) {
      setActiveConvId(conversations[0].id);
    }
  }, [convIdParam, conversations, activeConvId]);

  const handleSelect = (conv: Conversation) => {
    setActiveConvId(conv.id);
    router.replace(`/super-admin/conversations?convId=${conv.id}`);
  };

  return (
    <div className="h-[calc(100vh-8rem)] flex flex-col space-y-3">
      {/* Top Banner */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 bg-slate-900 text-white p-4 rounded-2xl border border-slate-800 shadow-md">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-rose-600 text-white flex items-center justify-center font-bold">
            <Eye className="w-5 h-5" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h1 className="text-base font-bold">Global System Conversation Inspector</h1>
              <span className="text-[10px] font-bold px-2 py-0.5 rounded-md bg-rose-950 text-rose-300 border border-rose-800">
                SUPER ADMIN
              </span>
            </div>
            <p className="text-xs text-slate-400 mt-0.5">
              Super-admin cross-team transparency. Review all system-wide 1-on-1 private conversations.
            </p>
          </div>
        </div>

        <div className="flex items-center gap-2">
          <div className="flex items-center gap-1.5 px-3 py-1 rounded-full bg-emerald-950/80 border border-emerald-500/40 text-emerald-400 text-xs font-semibold">
            <Radio className="w-3 h-3 animate-pulse" />
            <span>Global Feed Live</span>
          </div>
        </div>
      </div>

      {/* Main Split Grid */}
      <div className="flex-1 bg-white border border-[#d1d7db] rounded-2xl shadow-md overflow-hidden min-h-0">
        <div className="grid grid-cols-1 lg:grid-cols-12 min-h-0 h-full">
          <div className="h-full lg:col-span-4 xl:col-span-4 min-h-0">
            <ConversationList
              conversations={conversations}
              activeConversationId={activeConvId}
              onSelectConversation={handleSelect}
              currentUser={user}
              isReadOnlyAdminView={true}
            />
          </div>

          <div className="h-full lg:col-span-8 xl:col-span-8 min-h-0">
            <ChatArea
              conversation={activeConversation}
              currentUser={user}
              messages={messages}
              loading={loading}
              isReadOnlyAdminView={true}
            />
          </div>
        </div>
      </div>
    </div>
  );
}

export default function SuperAdminConversationsPage() {
  return (
    <DashboardLayout allowedRoles={['PLATFORM_SUPER_ADMIN']}>
      <Suspense fallback={<div className="p-8 text-center text-xs text-slate-400">Loading inspector...</div>}>
        <SuperAdminConversationsContent />
      </Suspense>
    </DashboardLayout>
  );
}
