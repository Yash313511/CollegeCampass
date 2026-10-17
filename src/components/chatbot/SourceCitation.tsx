"use client";

import React, { useState } from "react";
import { BookOpen, ChevronDown, ChevronUp, Database, ExternalLink } from "lucide-react";

export interface Citation {
  title: string;
  source_type?: string;
  url?: string | null;
  detail?: string | null;
  academic_year?: string | null;
}

interface SourceCitationProps {
  sources: Citation[];
}

export function SourceCitation({ sources }: SourceCitationProps) {
  const [isExpanded, setIsExpanded] = useState(false);

  if (!sources || sources.length === 0) return null;

  return (
    <div className="mt-2.5 rounded-lg border border-slate-200/80 bg-slate-50/80 px-2.5 py-1.5 text-[11px] text-slate-600">
      <button
        onClick={() => setIsExpanded(!isExpanded)}
        className="flex w-full items-center justify-between font-medium text-slate-700 hover:text-slate-900 cursor-pointer"
        aria-label="Toggle sources and citations"
      >
        <span className="flex items-center gap-1.5">
          <BookOpen className="h-3 w-3 text-slate-500" />
          <span>Sources & Grounding ({sources.length})</span>
        </span>
        {isExpanded ? (
          <ChevronUp className="h-3 w-3 text-slate-400" />
        ) : (
          <ChevronDown className="h-3 w-3 text-slate-400" />
        )}
      </button>

      {isExpanded && (
        <ul className="mt-2 space-y-1.5 border-t border-slate-200/60 pt-1.5">
          {sources.map((src, idx) => (
            <li key={idx} className="flex items-start gap-1.5 text-slate-600">
              <Database className="h-3 w-3 shrink-0 text-slate-400 mt-0.5" />
              <div className="flex-1">
                <span className="font-semibold text-slate-800">{src.title}</span>
                {src.academic_year && (
                  <span className="ml-1 text-slate-400">({src.academic_year})</span>
                )}
                {src.detail && <p className="text-[10px] text-slate-500">{src.detail}</p>}
                {src.url && (
                  <a
                    href={src.url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center gap-0.5 text-[10px] text-blue-600 hover:underline mt-0.5"
                  >
                    <span>Official portal</span>
                    <ExternalLink className="h-2.5 w-2.5" />
                  </a>
                )}
              </div>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}
