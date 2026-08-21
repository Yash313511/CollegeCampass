"use client";

import React from "react";
import { Search, X } from "lucide-react";

interface ScholarshipFiltersProps {
  search: string;
  type: string;
  level: string;
  stream: string;
  category: string;
  onFilterChange: (key: string, value: string) => void;
  onClearAll: () => void;
  totalResults: number;
}

const TYPES = [
  { value: "", label: "All Types" },
  { value: "MERIT", label: "Merit-Based" },
  { value: "NEED_BASED", label: "Need-Based" },
  { value: "MINORITY", label: "Minority" },
  { value: "SPORTS", label: "Sports" },
  { value: "RESEARCH", label: "Research" },
];

const LEVELS = [
  { value: "", label: "All Levels" },
  { value: "NATIONAL", label: "National" },
  { value: "STATE", label: "State" },
  { value: "INSTITUTIONAL", label: "Institutional" },
  { value: "PRIVATE", label: "Private / Foundation" },
];

const STREAMS = [
  { value: "", label: "All Streams" },
  { value: "Engineering", label: "Engineering" },
  { value: "Medical", label: "Medical" },
  { value: "Management", label: "Management" },
  { value: "Science", label: "Science" },
  { value: "Arts", label: "Arts" },
  { value: "Commerce", label: "Commerce" },
  { value: "Law", label: "Law" },
  { value: "Architecture", label: "Architecture" },
  { value: "Pharmacy", label: "Pharmacy" },
];

const CATEGORIES = [
  { value: "", label: "All Categories" },
  { value: "General", label: "General" },
  { value: "OBC", label: "OBC" },
  { value: "SC", label: "SC" },
  { value: "ST", label: "ST" },
  { value: "EWS", label: "EWS" },
];

export function ScholarshipFilters({
  search,
  type,
  level,
  stream,
  category,
  onFilterChange,
  onClearAll,
  totalResults,
}: ScholarshipFiltersProps) {
  const hasActiveFilters = search || type || level || stream || category;

  return (
    <div className="bg-white rounded-xl border border-slate-200 p-5 space-y-5 shadow-2xs">
      {/* Header */}
      <div className="flex items-center justify-between">
        <h3 className="text-sm font-bold text-slate-900">Filters</h3>
        {hasActiveFilters && (
          <button
            onClick={onClearAll}
            className="text-[10px] font-semibold text-slate-500 hover:text-slate-900 transition-colors flex items-center gap-1 cursor-pointer"
          >
            <X className="h-3 w-3" />
            Clear All
          </button>
        )}
      </div>

      {/* Search */}
      <div className="space-y-1.5">
        <label className="text-[10px] font-bold text-slate-500 uppercase tracking-wider">
          Search
        </label>
        <div className="relative">
          <Search className="h-3.5 w-3.5 absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
          <input
            type="text"
            value={search}
            onChange={(e) => onFilterChange("search", e.target.value)}
            placeholder="Search scholarships..."
            className="w-full rounded-lg border border-slate-200 bg-slate-50 py-2 pl-9 pr-3 text-xs text-slate-900 placeholder:text-slate-400 focus:border-slate-900 focus:outline-none focus:ring-1 focus:ring-slate-900 transition-colors"
          />
        </div>
      </div>

      {/* Type */}
      <div className="space-y-1.5">
        <label className="text-[10px] font-bold text-slate-500 uppercase tracking-wider">
          Scholarship Type
        </label>
        <select
          value={type}
          onChange={(e) => onFilterChange("type", e.target.value)}
          className="w-full rounded-lg border border-slate-200 bg-slate-50 py-2 px-3 text-xs text-slate-900 focus:border-slate-900 focus:outline-none focus:ring-1 focus:ring-slate-900 transition-colors cursor-pointer"
        >
          {TYPES.map((t) => (
            <option key={t.value} value={t.value}>
              {t.label}
            </option>
          ))}
        </select>
      </div>

      {/* Level */}
      <div className="space-y-1.5">
        <label className="text-[10px] font-bold text-slate-500 uppercase tracking-wider">
          Level
        </label>
        <select
          value={level}
          onChange={(e) => onFilterChange("level", e.target.value)}
          className="w-full rounded-lg border border-slate-200 bg-slate-50 py-2 px-3 text-xs text-slate-900 focus:border-slate-900 focus:outline-none focus:ring-1 focus:ring-slate-900 transition-colors cursor-pointer"
        >
          {LEVELS.map((l) => (
            <option key={l.value} value={l.value}>
              {l.label}
            </option>
          ))}
        </select>
      </div>

      {/* Stream */}
      <div className="space-y-1.5">
        <label className="text-[10px] font-bold text-slate-500 uppercase tracking-wider">
          Stream
        </label>
        <select
          value={stream}
          onChange={(e) => onFilterChange("stream", e.target.value)}
          className="w-full rounded-lg border border-slate-200 bg-slate-50 py-2 px-3 text-xs text-slate-900 focus:border-slate-900 focus:outline-none focus:ring-1 focus:ring-slate-900 transition-colors cursor-pointer"
        >
          {STREAMS.map((s) => (
            <option key={s.value} value={s.value}>
              {s.label}
            </option>
          ))}
        </select>
      </div>

      {/* Category */}
      <div className="space-y-1.5">
        <label className="text-[10px] font-bold text-slate-500 uppercase tracking-wider">
          Category
        </label>
        <select
          value={category}
          onChange={(e) => onFilterChange("category", e.target.value)}
          className="w-full rounded-lg border border-slate-200 bg-slate-50 py-2 px-3 text-xs text-slate-900 focus:border-slate-900 focus:outline-none focus:ring-1 focus:ring-slate-900 transition-colors cursor-pointer"
        >
          {CATEGORIES.map((c) => (
            <option key={c.value} value={c.value}>
              {c.label}
            </option>
          ))}
        </select>
      </div>

      {/* Result Count */}
      <div className="pt-3 border-t border-slate-100">
        <p className="text-xs text-slate-500 font-medium">
          <span className="text-slate-900 font-bold">{totalResults}</span>{" "}
          scholarship{totalResults !== 1 ? "s" : ""} found
        </p>
      </div>
    </div>
  );
}
