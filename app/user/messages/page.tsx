'use client';

import React, { useState, useEffect, Suspense } from 'react';
import { useSearchParams, useRouter } from 'next/navigation';
import { DashboardLayout } from '@/components/dashboard/DashboardLayout';
import { useAuth } from '@/lib/hooks/useAuth';
import { useChat } from '@/lib/hooks/useChat';
import { useTeams } from '@/lib/hooks/useTeams';
import { ConversationList } from '@/components/chat/ConversationList';
import { ChatArea } from '@/components/chat/ChatArea';
import { Modal } from '@/components/ui/modal';
import { Button } from '@/components/ui/button';
import { Conversation, Profile, PublicProfile, Team } from '@/lib/types';
import { ChatService } from '@/lib/services/chatService';
import { MessageSquare, Plus, Lock, Users, ArrowLeft } from 'lucide-react';

function MessagesContent() {
  const searchParams = useSearchParams();
  const router = useRouter();
  const convIdParam = searchParams.get('convId') || undefined;

  const { user } = useAuth();
  const { teams, getTeamMembers } = useTeams(user);
  const [activeConvId, setActiveConvId] = useState<string | undefined>(convIdParam);
  const [newChatModalOpen, setNewChatModalOpen] = useState(false);
  const [isMobileChatOpen, setIsMobileChatOpen] = useState(false);

  const {
    conversations,
    messages,
    activeConversation,
    loading,
    sendMessage,
  } = useChat(activeConvId, user);

  useEffect(() => {
    if (convIdParam) {
      setActiveConvId(convIdParam);
      setIsMobileChatOpen(true);
    } else if (conversations.length > 0 && !activeConvId) {
      setActiveConvId(conversations[0].id);
    }
  }, [convIdParam, conversations, activeConvId]);

  const handleSelectConversation = (conv: Conversation) => {
    setActiveConvId(conv.id);
    setIsMobileChatOpen(true);
    router.replace(`/user/messages?convId=${conv.id}`);
  };

  const handleStartNewChat = (targetMember: Profile | PublicProfile, team: Team) => {
    if (!user) return;
    try {
      const conv = ChatService.getOrCreatePrivateConversation(team.organization_id || user.organization_id, team.id, user.id, targetMember.id);
      setNewChatModalOpen(false);
      setActiveConvId(conv.id);
      setIsMobileChatOpen(true);
      router.replace(`/user/messages?convId=${conv.id}`);
    } catch (err: any) {
      alert(err.message || 'Cannot initiate chat');
    }
  };
  return (
    <div className="h-[calc(100vh-6.5rem)] sm:h-[calc(100vh-7rem)] flex flex-col">
      {/* WhatsApp Web Container Frame */}
      <div className="flex-1 bg-white border border-[#d1d7db] rounded-2xl sm:shadow-lg overflow-hidden flex flex-col min-h-0">
        <div className="flex-1 grid grid-cols-1 lg:grid-cols-12 min-h-0 h-full">
          {/* Left Column: Conversation List */}
          <div
            className={`h-full lg:col-span-4 xl:col-span-4 min-h-0 ${
              isMobileChatOpen ? 'hidden lg:block' : 'block'
            }`}
          >
            <ConversationList
              conversations={conversations}
              activeConversationId={activeConvId}
              onSelectConversation={handleSelectConversation}
              currentUser={user}
              onNewChat={() => setNewChatModalOpen(true)}
            />
          </div>

          {/* Right Column: Active Chat Area */}
          <div
            className={`h-full lg:col-span-8 xl:col-span-8 min-h-0 ${
              !isMobileChatOpen ? 'hidden lg:block' : 'block'
            }`}
          >
            <ChatArea
              conversation={activeConversation}
              currentUser={user}
              messages={messages}
              loading={loading}
              onSendMessage={sendMessage}
              onBack={() => setIsMobileChatOpen(false)}
            />
          </div>
        </div>
      </div>

      {/* New Private Chat Modal */}
      <Modal
        isOpen={newChatModalOpen}
        onClose={() => setNewChatModalOpen(false)}
        title="Start Private Conversation"
        description="Select a teammate from your shared teams to start a 1-on-1 private chat."
        maxWidth="md"
      >
        <div className="space-y-4">
          {teams.length === 0 ? (
            <p className="text-xs text-slate-400 italic p-4 text-center">
              You are not a member of any teams yet.
            </p>
          ) : (
            teams.map((team) => {
              const members = getTeamMembers(team.id).filter((m) => m.id !== user?.id);
              return (
                <div key={team.id} className="border border-slate-200 rounded-xl p-3 bg-slate-50">
                  <h4 className="text-xs font-bold text-slate-800 uppercase tracking-wider mb-2">
                    {team.name}
                  </h4>
                  <div className="space-y-1.5">
                    {members.length === 0 ? (
                      <p className="text-[11px] text-slate-400 italic">No other members in this team.</p>
                    ) : (
                      members.map((member) => (
                        <div
                          key={member.id}
                          className="flex items-center justify-between p-2 rounded-lg bg-white border border-slate-200 text-xs"
                        >
                          <div className="flex items-center gap-2">
                            <div className="w-7 h-7 rounded-full bg-slate-800 text-white flex items-center justify-center text-xs font-bold">
                              {member.display_name.charAt(0)}
                            </div>
                            <div>
                              <p className="font-bold text-slate-800">{member.display_name}</p>
                              <p className="text-[10px] text-slate-500 font-mono">@{member.username}</p>
                            </div>
                          </div>
                          <Button
                            size="sm"
                            onClick={() => handleStartNewChat(member, team)}
                            className="text-xs py-1"
                          >
                            Chat
                          </Button>
                        </div>
                      ))
                    )}
                  </div>
                </div>
              );
            })
          )}

          <div className="flex justify-end pt-2">
            <Button variant="secondary" onClick={() => setNewChatModalOpen(false)}>
              Cancel
            </Button>
          </div>
        </div>
      </Modal>
    </div>
  );
}

export default function UserMessagesPage() {
  return (
    <DashboardLayout allowedRoles={['USER', 'ORGANIZATION_ADMIN', 'PLATFORM_SUPER_ADMIN']}>
      <Suspense fallback={<div className="p-8 text-center text-xs text-slate-400">Loading chats...</div>}>
        <MessagesContent />
      </Suspense>
    </DashboardLayout>
  );
}
