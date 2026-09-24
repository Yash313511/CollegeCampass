"use client";

import React from "react";
import { Bot, User } from "lucide-react";

export interface Message {
  id: string;
  role: "user" | "bot";
  content: string;
  timestamp: Date;
}

interface ChatMessageProps {
  message: Message;
}

export function ChatMessage({ message }: ChatMessageProps) {
  const isUser = message.role === "user";

  return (
    <div
      className={`flex items-end gap-2 ${isUser ? "flex-row-reverse" : "flex-row"}`}
    >
      {/* Avatar */}
      <div
        className={`flex h-7 w-7 shrink-0 items-center justify-center rounded-full text-xs font-bold shadow-xs ${
          isUser
            ? "bg-slate-900 text-white"
            : "bg-slate-100 text-slate-600 border border-slate-200"
        }`}
      >
        {isUser ? <User className="h-3.5 w-3.5" /> : <Bot className="h-3.5 w-3.5" />}
      </div>

      {/* Bubble */}
      <div
        className={`relative max-w-[80%] rounded-2xl px-3.5 py-2.5 text-sm leading-relaxed shadow-xs ${
          isUser
            ? "bg-slate-900 text-white rounded-br-md"
            : "bg-white text-slate-800 border border-slate-200 rounded-bl-md"
        }`}
      >
        <p className="whitespace-pre-wrap break-words">{message.content}</p>
        <span
          className={`mt-1 block text-[10px] ${
            isUser ? "text-slate-400" : "text-slate-400"
          }`}
        >
          {message.timestamp.toLocaleTimeString([], {
            hour: "2-digit",
            minute: "2-digit",
          })}
        </span>
      </div>
    </div>
  );
}
