"use client";

import React from "react";
import { Sparkles } from "lucide-react";

interface QuickRepliesProps {
  suggestions: string[];
  onSelect: (question: string) => void;
  disabled?: boolean;
}

export function QuickReplies({
  suggestions,
  onSelect,
  disabled = false,
}: QuickRepliesProps) {
  if (!suggestions || suggestions.length === 0) return null;

  return (
    <div className="mt-2.5 flex flex-wrap gap-1.5">
      {suggestions.map((suggestion, index) => (
        <button
          key={index}
          onClick={() => onSelect(suggestion)}
          disabled={disabled}
          className="inline-flex items-center gap-1 rounded-full border border-slate-200 bg-white px-2.5 py-1 text-[11px] font-medium text-slate-700 shadow-2xs transition-all hover:border-slate-400 hover:bg-slate-50 hover:text-slate-900 active:scale-95 disabled:opacity-50 disabled:cursor-not-allowed cursor-pointer"
        >
          <Sparkles className="h-2.5 w-2.5 text-slate-400" />
          <span>{suggestion}</span>
        </button>
      ))}
    </div>
  );
}
