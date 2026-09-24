"use client";

import React, { useState, useRef, useEffect, useCallback } from "react";
import { MessageCircle, X, Bot, Minus } from "lucide-react";
import { ChatMessage, type Message } from "./ChatMessage";
import { ChatInput } from "./ChatInput";

function generateSessionId(): string {
  return `session_${Date.now()}_${Math.random().toString(36).substring(2, 11)}`;
}

function TypingIndicator() {
  return (
    <div className="flex items-end gap-2">
      <div className="flex h-7 w-7 shrink-0 items-center justify-center rounded-full bg-slate-100 text-slate-600 border border-slate-200">
        <Bot className="h-3.5 w-3.5" />
      </div>
      <div className="rounded-2xl rounded-bl-md bg-white border border-slate-200 px-4 py-3 shadow-xs">
        <div className="flex items-center gap-1.5">
          <span className="h-1.5 w-1.5 rounded-full bg-slate-400 animate-bounce [animation-delay:0ms]" />
          <span className="h-1.5 w-1.5 rounded-full bg-slate-400 animate-bounce [animation-delay:150ms]" />
          <span className="h-1.5 w-1.5 rounded-full bg-slate-400 animate-bounce [animation-delay:300ms]" />
        </div>
      </div>
    </div>
  );
}

export function Chatbot() {
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState<Message[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [sessionId] = useState(() => generateSessionId());
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const chatContainerRef = useRef<HTMLDivElement>(null);

  // Auto-scroll to the bottom on new messages
  const scrollToBottom = useCallback(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, []);

  useEffect(() => {
    scrollToBottom();
  }, [messages, isLoading, scrollToBottom]);

  // Add welcome message when first opened
  useEffect(() => {
    if (isOpen && messages.length === 0) {
      setMessages([
        {
          id: "welcome",
          role: "bot",
          content:
            "Hello! 👋 I'm your CollegeCompass assistant. Ask me anything about colleges, admissions, cutoffs, or placements. How can I help you today?",
          timestamp: new Date(),
        },
      ]);
    }
  }, [isOpen, messages.length]);

  const handleSend = async (content: string) => {
    const userMessage: Message = {
      id: `user_${Date.now()}`,
      role: "user",
      content,
      timestamp: new Date(),
    };

    setMessages((prev) => [...prev, userMessage]);
    setIsLoading(true);

    try {
      const webhookUrl = process.env.NEXT_PUBLIC_N8N_CHAT_WEBHOOK_URL;

      if (!webhookUrl) {
        throw new Error(
          "Chat webhook URL is not configured. Please set NEXT_PUBLIC_N8N_CHAT_WEBHOOK_URL in your environment variables."
        );
      }

      const response = await fetch(webhookUrl, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          message: content,
          sessionId,
        }),
      });

      if (!response.ok) {
        throw new Error(`Server responded with status ${response.status}`);
      }

      const data = await response.json();

      const botMessage: Message = {
        id: `bot_${Date.now()}`,
        role: "bot",
        content:
          data.response ||
          data.output ||
          data.text ||
          data.message ||
          "I received your message but couldn't generate a response. Please try again.",
        timestamp: new Date(),
      };

      setMessages((prev) => [...prev, botMessage]);
    } catch (error) {
      const errorMessage: Message = {
        id: `error_${Date.now()}`,
        role: "bot",
        content:
          error instanceof Error
            ? `⚠️ ${error.message}`
            : "⚠️ Something went wrong. Please try again later.",
        timestamp: new Date(),
      };

      setMessages((prev) => [...prev, errorMessage]);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <>
      {/* Chat Window */}
      <div
        className={`fixed bottom-20 right-4 z-50 flex flex-col overflow-hidden rounded-2xl border border-slate-200 bg-[#f8f9fa] shadow-2xl transition-all duration-300 ease-out sm:right-6 ${
          isOpen
            ? "opacity-100 translate-y-0 pointer-events-auto"
            : "opacity-0 translate-y-4 pointer-events-none"
        }`}
        style={{
          width: "min(380px, calc(100vw - 2rem))",
          height: "min(560px, calc(100vh - 10rem))",
        }}
        role="dialog"
        aria-label="Chat assistant"
        id="chatbot-window"
      >
        {/* Header */}
        <div className="flex items-center justify-between border-b border-slate-200 bg-white px-4 py-3">
          <div className="flex items-center gap-2.5">
            <div className="flex h-8 w-8 items-center justify-center rounded-full bg-slate-900 text-white shadow-xs">
              <Bot className="h-4 w-4" />
            </div>
            <div>
              <h3 className="text-sm font-bold text-slate-900 leading-tight">
                CollegeCompass AI
              </h3>
              <p className="text-[10px] text-emerald-600 font-medium flex items-center gap-1">
                <span className="h-1.5 w-1.5 rounded-full bg-emerald-500 inline-block" />
                Online
              </p>
            </div>
          </div>
          <div className="flex items-center gap-1">
            <button
              onClick={() => setIsOpen(false)}
              className="rounded-lg p-1.5 text-slate-400 hover:bg-slate-100 hover:text-slate-600 transition-colors cursor-pointer"
              aria-label="Minimize chat"
            >
              <Minus className="h-4 w-4" />
            </button>
            <button
              onClick={() => setIsOpen(false)}
              className="rounded-lg p-1.5 text-slate-400 hover:bg-slate-100 hover:text-slate-600 transition-colors cursor-pointer"
              aria-label="Close chat"
            >
              <X className="h-4 w-4" />
            </button>
          </div>
        </div>

        {/* Messages Area */}
        <div
          ref={chatContainerRef}
          className="flex-1 overflow-y-auto px-3 py-4 space-y-3"
          id="chatbot-messages"
        >
          {messages.map((msg) => (
            <ChatMessage key={msg.id} message={msg} />
          ))}
          {isLoading && <TypingIndicator />}
          <div ref={messagesEndRef} />
        </div>

        {/* Input Area */}
        <ChatInput onSend={handleSend} isLoading={isLoading} />
      </div>

      {/* Floating Action Button */}
      <button
        onClick={() => setIsOpen(!isOpen)}
        className={`fixed bottom-4 right-4 z-50 flex h-14 w-14 items-center justify-center rounded-full shadow-lg transition-all duration-300 cursor-pointer sm:right-6 active:scale-90 ${
          isOpen
            ? "bg-slate-700 hover:bg-slate-800 rotate-0"
            : "bg-slate-900 hover:bg-slate-800 rotate-0"
        }`}
        aria-label={isOpen ? "Close chat" : "Open chat"}
        id="chatbot-toggle-button"
      >
        {isOpen ? (
          <X className="h-6 w-6 text-white transition-transform" />
        ) : (
          <MessageCircle className="h-6 w-6 text-white transition-transform" />
        )}
        {/* Notification dot when closed and no messages read */}
        {!isOpen && messages.length === 0 && (
          <span className="absolute -top-0.5 -right-0.5 flex h-3.5 w-3.5">
            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75" />
            <span className="relative inline-flex rounded-full h-3.5 w-3.5 bg-emerald-500" />
          </span>
        )}
      </button>
    </>
  );
}
