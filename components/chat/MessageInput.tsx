'use client';

import React, { useState, KeyboardEvent, useRef, useEffect } from 'react';
import { 
  Send, 
  Smile, 
  Paperclip, 
  Mic, 
  Image as ImageIcon, 
  FileText, 
  BarChart3, 
  Trash2, 
  Check, 
  X 
} from 'lucide-react';

export interface MessageInputProps {
  onSendMessage: (text: string) => Promise<unknown> | void;
  disabled?: boolean;
  placeholder?: string;
}

const EMOJIS = [
  '😄', '😃', '😀', '😊', '😍', '🤩', '😎', '😂', 
  '👍', '👏', '🙌', '🤝', '🔥', '🚀', '🎉', '💯', 
  '❤️', '✨', '⭐', '💡', '✅', '🔒', '💼', '📊', 
  '📝', '📌', '📈', '⚡', '☕', '🎯', '🏆', '💪'
];

export const MessageInput: React.FC<MessageInputProps> = ({
  onSendMessage,
  disabled = false,
  placeholder = 'Type a message',
}) => {
  const [text, setText] = useState('');
  const [sending, setSending] = useState(false);
  const [showEmojiPicker, setShowEmojiPicker] = useState(false);
  const [showAttachMenu, setShowAttachMenu] = useState(false);
  const [isRecording, setIsRecording] = useState(false);
  const [recordingSeconds, setRecordingSeconds] = useState(0);

  const inputRef = useRef<HTMLInputElement>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const timerRef = useRef<NodeJS.Timeout | null>(null);

  useEffect(() => {
    if (isRecording) {
      setRecordingSeconds(0);
      timerRef.current = setInterval(() => {
        setRecordingSeconds((prev) => prev + 1);
      }, 1000);
    } else {
      if (timerRef.current) clearInterval(timerRef.current);
    }
    return () => {
      if (timerRef.current) clearInterval(timerRef.current);
    };
  }, [isRecording]);

  const handleSend = async () => {
    if (!text.trim() || disabled || sending) return;
    const msgToSend = text.trim();
    setText('');
    setShowEmojiPicker(false);
    setShowAttachMenu(false);
    setSending(true);
    try {
      await onSendMessage(msgToSend);
    } finally {
      setSending(false);
      setTimeout(() => inputRef.current?.focus(), 50);
    }
  };

  const handleKeyDown = (e: KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSend();
    }
  };

  const handleEmojiSelect = (emoji: string) => {
    setText((prev) => prev + emoji);
    inputRef.current?.focus();
  };

  const handleSendVoiceNote = async () => {
    const duration = recordingSeconds > 0 ? recordingSeconds : 3;
    const formatted = `0:${duration < 10 ? '0' : ''}${duration}`;
    setIsRecording(false);
    setSending(true);
    try {
      await onSendMessage(`🎙️ Voice Message (${formatted})`);
    } finally {
      setSending(false);
    }
  };

  const handleCancelVoiceNote = () => {
    setIsRecording(false);
    setRecordingSeconds(0);
  };

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    setShowAttachMenu(false);
    const fileName = file.name;
    const isImage = file.type.startsWith('image/');
    const icon = isImage ? '🖼️' : '📄';
    onSendMessage(`${icon} Attachment: ${fileName} (${(file.size / 1024).toFixed(1)} KB)`);
    if (fileInputRef.current) fileInputRef.current.value = '';
  };

  return (
    <div className="relative bg-[#f0f2f5] border-t border-[#e9edef] select-none">
      {/* Hidden File Input for Real Upload */}
      <input
        type="file"
        ref={fileInputRef}
        onChange={handleFileUpload}
        className="hidden"
      />

      {/* Emoji Picker Popover */}
      {showEmojiPicker && (
        <div className="absolute bottom-14 left-3 z-30 bg-white border border-slate-200 rounded-2xl shadow-xl p-3 w-72 sm:w-80">
          <div className="flex items-center justify-between pb-2 mb-2 border-b border-slate-100">
            <span className="text-xs font-bold text-slate-700 uppercase tracking-wider">
              Select Emoji
            </span>
            <button
              onClick={() => setShowEmojiPicker(false)}
              className="p-1 hover:bg-slate-100 rounded-full text-slate-400 hover:text-slate-600 cursor-pointer"
            >
              <X className="w-3.5 h-3.5" />
            </button>
          </div>
          <div className="grid grid-cols-8 gap-1.5 max-h-48 overflow-y-auto pr-1">
            {EMOJIS.map((emoji, i) => (
              <button
                key={i}
                type="button"
                onClick={() => handleEmojiSelect(emoji)}
                className="w-8 h-8 rounded-lg hover:bg-slate-100 flex items-center justify-center text-lg transition-transform active:scale-125 cursor-pointer"
              >
                {emoji}
              </button>
            ))}
          </div>
        </div>
      )}

      {/* Attachment Menu Popover */}
      {showAttachMenu && (
        <div className="absolute bottom-14 left-12 z-30 bg-white border border-slate-200 rounded-2xl shadow-xl p-2 w-56 space-y-1">
          <button
            type="button"
            onClick={() => fileInputRef.current?.click()}
            className="w-full flex items-center gap-2.5 px-3 py-2 text-xs font-semibold text-slate-700 hover:bg-indigo-50 hover:text-indigo-700 rounded-xl transition-colors cursor-pointer text-left"
          >
            <div className="w-7 h-7 rounded-lg bg-indigo-100 text-indigo-600 flex items-center justify-center">
              <ImageIcon className="w-4 h-4" />
            </div>
            <span>Photos & Videos</span>
          </button>

          <button
            type="button"
            onClick={() => fileInputRef.current?.click()}
            className="w-full flex items-center gap-2.5 px-3 py-2 text-xs font-semibold text-slate-700 hover:bg-purple-50 hover:text-purple-700 rounded-xl transition-colors cursor-pointer text-left"
          >
            <div className="w-7 h-7 rounded-lg bg-purple-100 text-purple-600 flex items-center justify-center">
              <FileText className="w-4 h-4" />
            </div>
            <span>Document (.pdf, .doc)</span>
          </button>

          <button
            type="button"
            onClick={() => {
              setShowAttachMenu(false);
              onSendMessage('📊 [Team Status Report attached: Sprint Progress.pdf - 1.2 MB]');
            }}
            className="w-full flex items-center gap-2.5 px-3 py-2 text-xs font-semibold text-slate-700 hover:bg-emerald-50 hover:text-emerald-700 rounded-xl transition-colors cursor-pointer text-left"
          >
            <div className="w-7 h-7 rounded-lg bg-emerald-100 text-emerald-600 flex items-center justify-center">
              <BarChart3 className="w-4 h-4" />
            </div>
            <span>Share Project Report</span>
          </button>
        </div>
      )}

      {/* Recording State Overlay */}
      {isRecording ? (
        <div className="px-4 py-2.5 flex items-center justify-between gap-3 bg-[#e7fce3] text-[#00a884]">
          <div className="flex items-center gap-2.5">
            <span className="w-3 h-3 rounded-full bg-rose-500 animate-pulse" />
            <span className="text-xs font-bold text-slate-800">Recording Voice Note...</span>
            <span className="text-xs font-mono font-bold text-slate-600">
              0:{recordingSeconds < 10 ? '0' : ''}{recordingSeconds}
            </span>
          </div>

          <div className="flex items-center gap-2">
            <button
              type="button"
              onClick={handleCancelVoiceNote}
              className="p-1.5 text-rose-600 hover:bg-rose-100 rounded-full transition-colors cursor-pointer"
              title="Cancel Recording"
            >
              <Trash2 className="w-4 h-4" />
            </button>
            <button
              type="button"
              onClick={handleSendVoiceNote}
              className="p-1.5 bg-[#00a884] hover:bg-[#008f6f] text-white rounded-full transition-colors cursor-pointer shadow-sm"
              title="Send Voice Note"
            >
              <Check className="w-4 h-4" />
            </button>
          </div>
        </div>
      ) : (
        <div className="px-3 py-2 sm:px-4 sm:py-2.5 flex items-center gap-1.5 sm:gap-2">
          {/* Emoji Button */}
          <button
            type="button"
            onClick={() => {
              setShowEmojiPicker((prev) => !prev);
              setShowAttachMenu(false);
            }}
            disabled={disabled}
            title="Emojis"
            className={`p-2 rounded-full transition-colors shrink-0 cursor-pointer disabled:opacity-50 ${
              showEmojiPicker
                ? 'bg-slate-300/80 text-[#00a884]'
                : 'text-[#54656f] hover:text-[#111b21] hover:bg-slate-200/60'
            }`}
          >
            <Smile className="w-6 h-6" />
          </button>

          {/* Attachment Button */}
          <button
            type="button"
            disabled={disabled}
            title="Attach Document / Photo"
            onClick={() => {
              setShowAttachMenu((prev) => !prev);
              setShowEmojiPicker(false);
            }}
            className={`p-2 rounded-full transition-colors shrink-0 cursor-pointer disabled:opacity-50 ${
              showAttachMenu
                ? 'bg-slate-300/80 text-indigo-600'
                : 'text-[#54656f] hover:text-[#111b21] hover:bg-slate-200/60'
            }`}
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
              onClick={() => setIsRecording(true)}
              disabled={disabled}
              title="Record voice message"
              className="w-10 h-10 rounded-full text-[#54656f] hover:text-rose-600 hover:bg-slate-200/60 flex items-center justify-center transition-all shrink-0 cursor-pointer disabled:opacity-50"
            >
              <Mic className="w-5 h-5" />
            </button>
          )}
        </div>
      )}
    </div>
  );
};

