"use client";

import React from "react";
import { Bot, User, AlertCircle, Scale } from "lucide-react";
import { CollegeCard, type CollegeCardData } from "./CollegeCard";
import { SourceCitation, type Citation } from "./SourceCitation";
import { QuickReplies } from "./QuickReplies";

export interface ComparisonTableData {
  college_names: string[];
  rows: Array<{
    attribute: string;
    values: string[];
  }>;
}

export interface Message {
  id: string;
  role: "user" | "bot";
  content: string;
  timestamp: Date;
  collegeCards?: CollegeCardData[];
  comparison?: ComparisonTableData | null;
  sources?: Citation[];
  followUpQuestions?: string[];
  disclaimer?: string | null;
}

interface ChatMessageProps {
  message: Message;
  onSelectSuggestion?: (question: string) => void;
  isLatest?: boolean;
}

/**
 * Helper to render simple markdown formatting (bold, italic, bullets).
 */
function FormattedText({ content }: { content: string }) {
  const lines = content.split("\n");

  return (
    <div className="space-y-1 text-sm leading-relaxed text-slate-800">
      {lines.map((line, idx) => {
        if (!line.trim()) {
          return <div key={idx} className="h-1.5" />;
        }

        // Handle bolding: **bold**
        const parts = line.split(/(\*\*.*?\*\*)/g);
        const formattedLine = parts.map((part, pIdx) => {
          if (part.startsWith("**") && part.endsWith("**")) {
            return (
              <strong key={pIdx} className="font-semibold text-slate-900">
                {part.slice(2, -2)}
              </strong>
            );
          }
          if (part.startsWith("*") && part.endsWith("*")) {
            return <em key={pIdx}>{part.slice(1, -1)}</em>;
          }
          return part;
        });

        // Check if line is bullet
        if (line.trim().startsWith("• ") || line.trim().startsWith("- ")) {
          return (
            <div key={idx} className="flex items-start gap-1.5 pl-1">
              <span className="text-slate-400 select-none">•</span>
              <span className="flex-1">{formattedLine}</span>
            </div>
          );
        }

        return <p key={idx}>{formattedLine}</p>;
      })}
    </div>
  );
}

export function ChatMessage({
  message,
  onSelectSuggestion,
  isLatest = false,
}: ChatMessageProps) {
  const isUser = message.role === "user";

  return (
    <div
      className={`flex items-end gap-2 ${
        isUser ? "flex-row-reverse" : "flex-row"
      }`}
    >
      {/* Avatar */}
      <div
        className={`flex h-7 w-7 shrink-0 items-center justify-center rounded-full text-xs font-bold shadow-xs ${
          isUser
            ? "bg-slate-900 text-white"
            : "bg-slate-100 text-slate-700 border border-slate-200"
        }`}
      >
        {isUser ? <User className="h-3.5 w-3.5" /> : <Bot className="h-3.5 w-3.5" />}
      </div>

      {/* Main Bubble */}
      <div
        className={`relative max-w-[88%] rounded-2xl px-3.5 py-2.5 shadow-xs ${
          isUser
            ? "bg-slate-900 text-white rounded-br-md text-sm leading-relaxed"
            : "bg-white border border-slate-200 text-slate-900 rounded-bl-md"
        }`}
      >
        {isUser ? (
          <p className="whitespace-pre-wrap break-words">{message.content}</p>
        ) : (
          <div>
            <FormattedText content={message.content} />

            {/* Comparison Table */}
            {message.comparison && (
              <div className="mt-3 overflow-x-auto rounded-lg border border-slate-200">
                <div className="flex items-center gap-1.5 bg-slate-50 px-2.5 py-1.5 text-xs font-semibold text-slate-700 border-b border-slate-200">
                  <Scale className="h-3.5 w-3.5 text-slate-500" />
                  <span>College Comparison</span>
                </div>
                <table className="w-full text-left text-xs">
                  <thead className="bg-slate-100/60 text-slate-600 font-semibold border-b border-slate-200">
                    <tr>
                      <th className="p-2">Attribute</th>
                      {message.comparison.college_names.map((colName, cIdx) => (
                        <th key={cIdx} className="p-2 truncate max-w-[120px]">
                          {colName}
                        </th>
                      ))}
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-100">
                    {message.comparison.rows.map((row, rIdx) => (
                      <tr key={rIdx} className="hover:bg-slate-50/50">
                        <td className="p-2 font-medium text-slate-600">{row.attribute}</td>
                        {row.values.map((val, vIdx) => (
                          <td key={vIdx} className="p-2 text-slate-800">
                            {val}
                          </td>
                        ))}
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}

            {/* College Recommendation Cards */}
            {message.collegeCards && message.collegeCards.length > 0 && (
              <div className="mt-3 space-y-2">
                <div className="text-[11px] font-semibold text-slate-500 uppercase tracking-wider">
                  Recommended Colleges ({message.collegeCards.length})
                </div>
                <div className="space-y-2 max-h-[360px] overflow-y-auto pr-1">
                  {message.collegeCards.map((college) => (
                    <CollegeCard key={college.id} college={college} />
                  ))}
                </div>
              </div>
            )}

            {/* Disclaimer */}
            {message.disclaimer && (
              <div className="mt-2.5 flex items-start gap-1 rounded bg-amber-50 p-1.5 text-[10px] text-amber-800 border border-amber-200/50">
                <AlertCircle className="h-3 w-3 shrink-0 text-amber-600 mt-0.5" />
                <span>{message.disclaimer}</span>
              </div>
            )}

            {/* Source Citations */}
            {message.sources && message.sources.length > 0 && (
              <SourceCitation sources={message.sources} />
            )}

            {/* Follow-up Quick Suggestions (only on latest bot message) */}
            {isLatest &&
              message.followUpQuestions &&
              message.followUpQuestions.length > 0 &&
              onSelectSuggestion && (
                <QuickReplies
                  suggestions={message.followUpQuestions}
                  onSelect={onSelectSuggestion}
                />
              )}
          </div>
        )}

        {/* Timestamp */}
        <span
          className={`mt-1.5 block text-[10px] ${
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
