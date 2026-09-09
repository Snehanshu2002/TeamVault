import { NextResponse } from 'next/server';
import { Message, Conversation } from '@/lib/types';

// Server-side shared state across all browser clients (Chrome, Edge, Safari, Firefox)
declare global {
  var __ptcms_server_messages: Record<string, Message[]> | undefined;
  var __ptcms_server_conversations: Conversation[] | undefined;
}

if (!globalThis.__ptcms_server_messages) {
  globalThis.__ptcms_server_messages = {};
}
if (!globalThis.__ptcms_server_conversations) {
  globalThis.__ptcms_server_conversations = [];
}

export async function GET(req: Request) {
  return NextResponse.json({
    messages: globalThis.__ptcms_server_messages || {},
    conversations: globalThis.__ptcms_server_conversations || [],
    timestamp: Date.now(),
  });
}

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const { type, message, conversation, convId, readerId } = body;

    if (type === 'NEW_MESSAGE' && message && message.conversation_id) {
      const cid = message.conversation_id;
      if (!globalThis.__ptcms_server_messages![cid]) {
        globalThis.__ptcms_server_messages![cid] = [];
      }
      const existing = globalThis.__ptcms_server_messages![cid];
      if (!existing.some((m) => m.id === message.id)) {
        existing.push(message);
      }
    }

    if (type === 'NEW_CONVERSATION' && conversation) {
      const convs = globalThis.__ptcms_server_conversations!;
      const idx = convs.findIndex((c) => c.id === conversation.id);
      if (idx >= 0) {
        convs[idx] = conversation;
      } else {
        convs.unshift(conversation);
      }
    }

    if (type === 'MARK_READ' && convId && readerId) {
      const msgs = globalThis.__ptcms_server_messages![convId];
      if (msgs) {
        msgs.forEach((m) => {
          if (!m.read_by.includes(readerId)) {
            m.read_by.push(readerId);
          }
        });
      }
    }

    return NextResponse.json({ success: true, timestamp: Date.now() });
  } catch (err: any) {
    return NextResponse.json({ error: err?.message || 'Sync failed' }, { status: 400 });
  }
}
