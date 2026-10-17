"use client";

import React, { useState, useRef, useEffect, useCallback } from "react";
import {
  MessageCircle,
  X,
  Bot,
  Minus,
  RotateCcw,
  Sparkles,
  Maximize2,
  Minimize2,
  AlertTriangle,
} from "lucide-react";
import { ChatMessage, type Message } from "./ChatMessage";
import { ChatInput } from "./ChatInput";
import { QuickReplies } from "./QuickReplies";

function generateSessionId(): string {
  return `session_${Date.now()}_${Math.random().toString(36).substring(2, 9)}`;
}

const STARTER_PROMPTS = [
  "Top engineering colleges in Pune under ₹2L",
  "Colleges for 92 percentile in MHT-CET",
  "Compare COEP and VJTI Mumbai",
  "Scholarships for engineering students",
];

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
  const [isExpanded, setIsExpanded] = useState(false);
  const [messages, setMessages] = useState<Message[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [errorState, setErrorState] = useState<string | null>(null);
  const [sessionId, setSessionId] = useState(() => generateSessionId());
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const chatContainerRef = useRef<HTMLDivElement>(null);

  const scrollToBottom = useCallback(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, []);

  useEffect(() => {
    if (isOpen) {
      scrollToBottom();
    }
  }, [messages, isLoading, isOpen, scrollToBottom]);

  // Initial welcome message
  const initWelcomeMessage = useCallback(() => {
    return {
      id: "welcome",
      role: "bot" as const,
      content:
        "Hello! 👋 I'm your **CollegeCompass AI Assistant**. I can help you search colleges, check MHT-CET cutoffs, evaluate CAP rounds, compare institutions, and find scholarships.\n\nWhat would you like to explore today?",
      timestamp: new Date(),
      followUpQuestions: STARTER_PROMPTS,
    };
  }, []);

  useEffect(() => {
    if (isOpen && messages.length === 0) {
      setMessages([initWelcomeMessage()]);
    }
  }, [isOpen, messages.length, initWelcomeMessage]);

  const handleReset = () => {
    setMessages([initWelcomeMessage()]);
    setSessionId(generateSessionId());
    setErrorState(null);
  };

  const handleSend = async (content: string) => {
    if (!content.trim() || isLoading) return;

    setErrorState(null);
    const userMessage: Message = {
      id: `user_${Date.now()}`,
      role: "user",
      content,
      timestamp: new Date(),
    };

    setMessages((prev) => [...prev, userMessage]);
    setIsLoading(true);

    try {
      // Build conversation history from previous messages
      const conversationHistory = messages.map((m) => ({
        role: m.role === "user" ? ("user" as const) : ("assistant" as const),
        content: m.content,
      }));

      const res = await fetch("/api/chatbot", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          message: content,
          sessionId,
          conversationHistory,
        }),
      });

      if (!res.ok) {
        throw new Error(`Server responded with status ${res.status}`);
      }

      const data = await res.json();

      const botMessage: Message = {
        id: `bot_${Date.now()}`,
        role: "bot",
        content:
          data.answer ||
          data.response ||
          "I received your request but didn't get a response. Please try again.",
        timestamp: new Date(),
        collegeCards: data.college_cards || [],
        comparison: data.comparison || null,
        sources: data.sources || [],
        followUpQuestions: data.follow_up_questions || [],
        disclaimer: data.disclaimer || null,
      };

      setMessages((prev) => [...prev, botMessage]);
    } catch (err: any) {
      console.error("Chat error:", err);
      const errorMessageText =
        err?.message || "Something went wrong while contacting the assistant.";
      setErrorState(errorMessageText);

      const errorMessage: Message = {
        id: `error_${Date.now()}`,
        role: "bot",
        content: `⚠️ ${errorMessageText}\n\nYou can try again or ask another question.`,
        timestamp: new Date(),
      };
      setMessages((prev) => [...prev, errorMessage]);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <>
      {/* Floating Action Button */}
      <button
        onClick={() => setIsOpen(!isOpen)}
        className={`fixed bottom-4 right-4 z-50 flex h-14 w-14 items-center justify-center rounded-full shadow-xl transition-all duration-300 cursor-pointer sm:right-6 active:scale-95 ${
          isOpen
            ? "bg-slate-800 text-white rotate-90"
            : "bg-slate-900 hover:bg-slate-800 text-white rotate-0"
        }`}
        aria-label={isOpen ? "Close chat assistant" : "Open chat assistant"}
        id="chatbot-toggle-button"
      >
        {isOpen ? (
          <X className="h-6 w-6" />
        ) : (
          <div className="relative">
            <MessageCircle className="h-6 w-6" />
            {messages.length === 0 && (
              <span className="absolute -top-1 -right-1 flex h-3 w-3">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75" />
                <span className="relative inline-flex rounded-full h-3 w-3 bg-emerald-500" />
              </span>
            )}
          </div>
        )}
      </button>

      {/* Chat Window */}
      <div
        className={`fixed bottom-20 right-4 z-50 flex flex-col overflow-hidden rounded-2xl border border-slate-200/90 bg-[#f8f9fa] shadow-2xl transition-all duration-300 ease-out sm:right-6 ${
          isOpen
            ? "opacity-100 translate-y-0 pointer-events-auto"
            : "opacity-0 translate-y-4 pointer-events-none"
        }`}
        style={{
          width: isExpanded
            ? "min(640px, calc(100vw - 2rem))"
            : "min(400px, calc(100vw - 2rem))",
          height: isExpanded
            ? "min(720px, calc(100vh - 7rem))"
            : "min(580px, calc(100vh - 9rem))",
        }}
        role="dialog"
        aria-label="CollegeCompass Chat Assistant"
        id="chatbot-window"
      >
        {/* Header */}
        <div className="flex items-center justify-between border-b border-slate-200 bg-white px-4 py-3 shadow-2xs">
          <div className="flex items-center gap-2.5">
            <div className="flex h-8 w-8 items-center justify-center rounded-full bg-slate-900 text-white shadow-xs">
              <Bot className="h-4 w-4" />
            </div>
            <div>
              <div className="flex items-center gap-1.5">
                <h3 className="text-sm font-bold text-slate-900 leading-tight">
                  CollegeCompass AI
                </h3>
                <span className="rounded bg-slate-100 px-1 py-0.2 text-[9px] font-semibold text-slate-600">
                  v1.0
                </span>
              </div>
              <p className="text-[10px] text-emerald-600 font-medium flex items-center gap-1">
                <span className="h-1.5 w-1.5 rounded-full bg-emerald-500 inline-block" />
                Live College Guidance
              </p>
            </div>
          </div>

          <div className="flex items-center gap-1 text-slate-400">
            {/* Reset Conversation */}
            <button
              onClick={handleReset}
              className="rounded-lg p-1.5 hover:bg-slate-100 hover:text-slate-700 transition-colors cursor-pointer"
              title="Reset conversation"
              aria-label="Reset conversation"
            >
              <RotateCcw className="h-3.5 w-3.5" />
            </button>

            {/* Expand / Minimize Window */}
            <button
              onClick={() => setIsExpanded(!isExpanded)}
              className="hidden sm:inline-flex rounded-lg p-1.5 hover:bg-slate-100 hover:text-slate-700 transition-colors cursor-pointer"
              title={isExpanded ? "Collapse window" : "Expand window"}
              aria-label={isExpanded ? "Collapse window" : "Expand window"}
            >
              {isExpanded ? (
                <Minimize2 className="h-3.5 w-3.5" />
              ) : (
                <Maximize2 className="h-3.5 w-3.5" />
              )}
            </button>

            {/* Close */}
            <button
              onClick={() => setIsOpen(false)}
              className="rounded-lg p-1.5 hover:bg-slate-100 hover:text-slate-700 transition-colors cursor-pointer"
              aria-label="Close chat"
            >
              <Minus className="h-4 w-4" />
            </button>
          </div>
        </div>

        {/* Messages Container */}
        <div
          ref={chatContainerRef}
          className="flex-1 overflow-y-auto px-3.5 py-4 space-y-3"
          id="chatbot-messages"
        >
          {messages.map((msg, idx) => (
            <ChatMessage
              key={msg.id}
              message={msg}
              isLatest={idx === messages.length - 1}
              onSelectSuggestion={(question) => handleSend(question)}
            />
          ))}

          {isLoading && <TypingIndicator />}
          <div ref={messagesEndRef} />
        </div>

        {/* Input Area */}
        <ChatInput onSend={handleSend} isLoading={isLoading} />
      </div>
    </>
  );
}
