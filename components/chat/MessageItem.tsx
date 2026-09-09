'use client';

import React from 'react';
import { Message } from '@/lib/types';
import { Check, CheckCheck } from 'lucide-react';
import { format, parseISO } from 'date-fns';

export interface MessageItemProps {
  message: Message;
  isCurrentUser: boolean;
  showSenderName?: boolean;
  isFirstInGroup?: boolean;
  isLastInGroup?: boolean;
}

export const MessageItem: React.FC<MessageItemProps> = ({
  message,
  isCurrentUser,
  showSenderName = true,
  isFirstInGroup = true,
  isLastInGroup = true,
}) => {
  const formatTime = (isoString: string) => {
    try {
      return format(parseISO(isoString), 'h:mm a');
    } catch {
      return '';
    }
  };

  const isRead = message.read_by && message.read_by.length > 1;

  return (
    <div
      className={`flex flex-col ${
        isCurrentUser ? 'items-end' : 'items-start'
      } ${isLastInGroup ? 'mb-2' : 'mb-0.5'} group px-2 sm:px-4`}
    >
      <div
        className={`relative max-w-[85%] sm:max-w-[65%] md:max-w-[60%] px-3.5 pt-2 pb-1.5 text-[14.2px] leading-relaxed shadow-xs transition-all ${
          isCurrentUser
            ? 'bg-[#d9fdd3] text-[#111b21] rounded-2xl rounded-tr-xs'
            : 'bg-white text-[#111b21] rounded-2xl rounded-tl-xs border border-slate-100/80'
        }`}
        style={{
          boxShadow: '0 1px 0.5px rgba(11,20,26,0.13)',
        }}
      >
        {/* Sender Name if incoming & first in group */}
        {showSenderName && !isCurrentUser && isFirstInGroup && (
          <div className="text-[12.5px] font-bold text-[#1f7a63] mb-0.5 cursor-pointer hover:underline select-none">
            {message.sender_name || `@${message.sender_username || 'member'}`}
          </div>
        )}

        {/* Message Text */}
        <div className="whitespace-pre-wrap break-words pr-2">
          {message.message}
        </div>

        {/* Timestamp & Status Metadata */}
        <div className="flex items-center justify-end gap-1 mt-0.5 select-none float-right ml-2 -mb-0.5">
          <span className="text-[11px] text-[#667781] font-normal">
            {formatTime(message.created_at)}
          </span>
          {isCurrentUser && (
            <span title={isRead ? 'Read' : 'Delivered'} className="flex items-center">
              {isRead ? (
                <CheckCheck className="w-4 h-4 text-[#53bdeb] shrink-0" />
              ) : (
                <CheckCheck className="w-4 h-4 text-[#8696a0] shrink-0" />
              )}
            </span>
          )}
        </div>
      </div>
    </div>
  );
};

