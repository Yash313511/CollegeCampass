"use client";

import React from "react";
import Link from "next/link";
import { useCompare } from "@/context/CompareContext";
import { X, ArrowRight, Scale } from "lucide-react";
import { Button } from "@/components/ui/Button";

export function CompareBar() {
  const { selectedColleges, removeFromCompare, clearCompare } = useCompare();

  if (selectedColleges.length === 0) return null;

  const compareUrl = `/compare?ids=${selectedColleges.map((c) => c.id).join(",")}`;

  return (
    <aside
      aria-label="College Comparison Tray"
      className="fixed bottom-5 left-1/2 -translate-x-1/2 z-40 w-[95%] max-w-3xl bg-slate-900 text-white rounded-xl shadow-2xl border border-slate-800 p-3 sm:p-3.5 animate-in slide-in-from-bottom-5 duration-200"
    >
      <div className="flex flex-col sm:flex-row items-center justify-between gap-3">
        {/* Header & List of Selected */}
        <div className="flex items-center gap-3 w-full sm:w-auto overflow-x-auto pb-1 sm:pb-0 scrollbar-hide">
          <div className="flex items-center gap-1.5 text-xs font-bold text-slate-200 shrink-0">
            <Scale className="h-4 w-4 text-blue-400" />
            <span>Compare ({selectedColleges.length}/3)</span>
          </div>

          <div className="flex items-center gap-2 overflow-x-auto">
            {selectedColleges.map((college) => (
              <div
                key={college.id}
                className="flex items-center gap-1.5 bg-slate-800 border border-slate-700 text-white text-xs px-2.5 py-1.5 rounded-lg max-w-[140px] sm:max-w-[200px] shrink-0"
              >
                <span className="truncate font-medium">{college.name}</span>
                <button
                  onClick={() => removeFromCompare(college.id)}
                  className="text-slate-400 hover:text-white p-0.5 rounded transition-colors cursor-pointer"
                  title="Remove from comparison"
                >
                  <X className="h-3.5 w-3.5" />
                </button>
              </div>
            ))}
          </div>
        </div>

        {/* Actions */}
        <div className="flex items-center gap-2 w-full sm:w-auto justify-end shrink-0">
          <button
            onClick={clearCompare}
            className="text-xs text-slate-400 hover:text-white px-2 py-1 transition-colors cursor-pointer"
          >
            Clear
          </button>
          <Link href={selectedColleges.length >= 2 ? compareUrl : "#"}>
            <Button
              size="sm"
              disabled={selectedColleges.length < 2}
              className="bg-blue-600 hover:bg-blue-500 text-white text-xs font-semibold px-3.5 py-1.5 h-auto rounded-lg shadow-xs"
              rightIcon={<ArrowRight className="h-3.5 w-3.5" />}
            >
              {selectedColleges.length < 2
                ? "Select 1 more"
                : `Compare (${selectedColleges.length})`}
            </Button>
          </Link>
        </div>
      </div>
    </aside>
  );
}
