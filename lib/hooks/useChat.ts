'use client';

import { useState, useEffect, useCallback, useRef } from 'react';
import { Conversation, Message, Profile } from '@/lib/types';
import { ChatService } from '@/lib/services/chatService';
import { mockSupabase } from '@/lib/supabase/mockSupabase';

export function useChat(activeConversationId?: string, currentUser?: Profile | null) {
  const [conversations, setConversations] = useState<Conversation[]>([]);
  const [messages, setMessages] = useState<Message[]>([]);
  const [activeConversation, setActiveConversation] = useState<Conversation | null>(null);
  const [loading, setLoading] = useState(true);
  const [sending, setSending] = useState(false);

  const activeConvIdRef = useRef<string | undefined>(activeConversationId);
  const currentUserRef = useRef<Profile | null | undefined>(currentUser);

  useEffect(() => {
    activeConvIdRef.current = activeConversationId;
  }, [activeConversationId]);

  useEffect(() => {
    currentUserRef.current = currentUser;
  }, [currentUser]);

  const loadConversations = useCallback(() => {
    const user = currentUserRef.current;
    if (!user) return;
    const convs = ChatService.getConversationsForUser(user);
    setConversations(convs);

    if (activeConvIdRef.current) {
      const active = convs.find((c) => c.id === activeConvIdRef.current) || null;
      setActiveConversation(active);
    }
  }, []);

  const loadMessages = useCallback((convId: string, shouldMarkRead = true) => {
    const msgs = ChatService.getMessages(convId);
    setMessages(msgs);
    setLoading(false);

    const user = currentUserRef.current;
    if (user && shouldMarkRead) {
      const hasUnread = msgs.some((m) => m.sender_id !== user.id && !m.read_by.includes(user.id));
      if (hasUnread) {
        ChatService.markAsRead(convId, user.id);
      }
    }
  }, []);

  useEffect(() => {
    loadConversations();
    if (activeConversationId) {
      loadMessages(activeConversationId, true);
    } else {
      setLoading(false);
    }

    const unsubscribe = mockSupabase.subscribe((event, data: any) => {
      const currentConv = activeConvIdRef.current;
      if (event === 'NEW_MESSAGE') {
        if (currentConv && data?.conversationId && data.conversationId === currentConv) {
          loadMessages(currentConv, true);
        }
        loadConversations();
      } else if (event === 'MESSAGES_READ') {
        if (currentConv && data?.conversationId && data.conversationId === currentConv) {
          loadMessages(currentConv, false); // Don't loop marking read
        }
      } else if (
        event === 'CONVERSATIONS_UPDATED' ||
        event === 'RESET_DATA' ||
        event === 'STORAGE_SYNC'
      ) {
        loadConversations();
        if (currentConv) {
          loadMessages(currentConv, false);
        }
      }
    });

    return () => unsubscribe();
  }, [activeConversationId, currentUser?.id, loadConversations, loadMessages]);

  const sendMessage = useCallback(
    async (text: string): Promise<Message | null> => {
      const user = currentUserRef.current;
      if (!activeConversationId || !user || !text.trim()) return null;
      setSending(true);
      try {
        const newMsg = ChatService.sendMessage(activeConversationId, user.id, text.trim());
        setMessages((prev) => {
          if (prev.some((m) => m.id === newMsg.id)) return prev;
          return [...prev, newMsg];
        });
        loadConversations();
        return newMsg;
      } finally {
        setSending(false);
      }
    },
    [activeConversationId, loadConversations]
  );

  return {
    conversations,
    messages,
    activeConversation,
    loading,
    sending,
    sendMessage,
    refreshConversations: loadConversations,
    refreshMessages: () => {
      if (activeConversationId) loadMessages(activeConversationId, true);
    },
  };
}

