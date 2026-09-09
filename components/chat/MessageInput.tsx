'use client';

import React, { useState, KeyboardEvent, useRef, useEffect } from 'react';
import { Send, Smile, Paperclip, Mic } from 'lucide-react';

export interface MessageInputProps {
  onSendMessage: (text: string) => Promise<unknown> | void;
  disabled?: boolean;
  placeholder?: string;
}

export const MessageInput: React.FC<MessageInputProps> = ({
  onSendMessage,
  disabled = false,
  placeholder = 'Type a message',
}) => {
  const [text, setText] = useState('');
  const [sending, setSending] = useState(false);
  const inputRef = useRef<HTMLInputElement>(null);

  const handleSend = async () => {
    if (!text.trim() || disabled || sending) return;
    const msgToSend = text.trim();
    setText('');
    setSending(true);
    try {
      await onSendMessage(msgToSend);
    } finally {
      setSending(false);
      // keep focus in input
      setTimeout(() => inputRef.current?.focus(), 50);
    }
  };

  const handleKeyDown = (e: KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSend();
    }
  };

  const handleEmojiClick = () => {
    setText((prev) => prev + ' 👍 ');
    inputRef.current?.focus();
  };

  return (
    <div className="px-3 py-2 sm:px-4 sm:py-2.5 bg-[#f0f2f5] border-t border-[#e9edef] flex items-center gap-1.5 sm:gap-2 select-none">
      {/* Emoji Button */}
      <button
        type="button"
        onClick={handleEmojiClick}
        disabled={disabled}
        title="Emojis"
        className="p-2 text-[#54656f] hover:text-[#111b21] hover:bg-slate-200/60 rounded-full transition-colors shrink-0 cursor-pointer disabled:opacity-50"
      >
        <Smile className="w-6 h-6" />
      </button>

      {/* Attachment Button */}
      <button
        type="button"
        disabled={disabled}
        title="Attach"
        onClick={() => alert('Attachments disabled in private demo mode')}
        className="p-2 text-[#54656f] hover:text-[#111b21] hover:bg-slate-200/60 rounded-full transition-colors shrink-0 cursor-pointer disabled:opacity-50"
      >
        <Paperclip className="w-5 h-5 -rotate-45" />
      </button>

      {/* Text Input */}
      <div className="flex-1 relative flex items-center">
        <input
          ref={inputRef}
          type="text"
          value={text}
          onChange={(e) => setText(e.target.value)}
          onKeyDown={handleKeyDown}
          disabled={disabled}
          placeholder={placeholder}
          className="w-full bg-white text-[#111b21] placeholder-[#667781] text-[14.5px] px-4 py-2.5 rounded-lg border border-transparent focus:border-transparent focus:outline-none shadow-xs disabled:bg-slate-100/80 transition-all"
        />
      </div>

      {/* Send or Mic Button */}
      {text.trim().length > 0 ? (
        <button
          type="button"
          onClick={handleSend}
          disabled={disabled || sending}
          title="Send message (Enter)"
          className="w-10 h-10 rounded-full bg-[#00a884] hover:bg-[#008f6f] active:bg-[#007a5e] text-white flex items-center justify-center shadow-xs transition-all shrink-0 cursor-pointer disabled:opacity-50"
        >
          <Send className="w-5 h-5 translate-x-0.5" />
        </button>
      ) : (
        <button
          type="button"
          disabled={disabled}
          title="Voice message"
          className="w-10 h-10 rounded-full text-[#54656f] hover:text-[#111b21] hover:bg-slate-200/60 flex items-center justify-center transition-all shrink-0 cursor-pointer disabled:opacity-50"
        >
          <Mic className="w-5 h-5" />
        </button>
      )}
    </div>
  );
};

