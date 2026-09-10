import { NextResponse } from 'next/server';
import { serverDb } from '@/lib/database/serverDb';
import { Message } from '@/lib/types';

export async function GET(req: Request) {
  try {
    const { searchParams } = new URL(req.url);
    const conversationId = searchParams.get('conversation_id');

    if (!conversationId) {
      return NextResponse.json(
        { success: false, error: 'conversation_id is required' },
        { status: 400 }
      );
    }

    const messages = serverDb.getMessages(conversationId);
    return NextResponse.json({ success: true, data: messages });
  } catch (error: any) {
    return NextResponse.json(
      { success: false, error: error.message || 'Failed to fetch messages' },
      { status: 500 }
    );
  }
}

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const { conversation_id, message } = body;

    if (!conversation_id || !message || !message.sender_id) {
      return NextResponse.json(
        { success: false, error: 'conversation_id and valid message object are required' },
        { status: 400 }
      );
    }

    const saved = serverDb.saveMessage(conversation_id, message);
    return NextResponse.json(
      { success: true, data: saved, message: 'Message saved to database' },
      { status: 201 }
    );
  } catch (error: any) {
    return NextResponse.json(
      { success: false, error: error.message || 'Failed to save message' },
      { status: 500 }
    );
  }
}
