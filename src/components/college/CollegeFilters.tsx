"use client";

import React from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { Filter, RotateCcw, X } from "lucide-react";
import { Button } from "@/components/ui/Button";
import { formatCurrency } from "@/lib/utils";

export interface FilterData {
  states: string[];
  streams: string[];
  types: string[];
  minFees: number;
  maxFees: number;
}

export interface CollegeFiltersProps {
  filterData?: FilterData;
  isMobileDrawerOpen?: boolean;
  onCloseMobileDrawer?: () => void;
}

export function CollegeFilters({
  filterData,
  isMobileDrawerOpen = false,
  onCloseMobileDrawer,
}: CollegeFiltersProps) {
  const router = useRouter();
  const searchParams = useSearchParams();

  // Read active filters from URL
  const activeState = searchParams.get("state") || "";
  const activeStream = searchParams.get("stream") || "";
  const activeType = searchParams.get("type") || "";
  const activeMinRating = searchParams.get("minRating") || "";
  const activeMaxFees = searchParams.get("maxFees") || "";

  const hasActiveFilters =
    Boolean(activeState || activeStream || activeType || activeMinRating || activeMaxFees);

  const updateParam = (key: string, value: string) => {
    const params = new URLSearchParams(searchParams.toString());
    if (value) {
      params.set(key, value);
    } else {
      params.delete(key);
    }
    params.set("page", "1"); // Reset to page 1 on filter change
    router.push(`/colleges?${params.toString()}`);
  };

  const handleClearFilters = () => {
    const params = new URLSearchParams();
    const search = searchParams.get("search");
    if (search) params.set("search", search);
    router.push(`/colleges?${params.toString()}`);
    onCloseMobileDrawer?.();
  };

  const filterContent = (
    <div className="space-y-6">
      {/* Header with Clear Action */}
      <div className="flex items-center justify-between pb-3 border-b border-slate-200">
        <div className="flex items-center gap-2 font-bold text-slate-900 text-xs uppercase tracking-wider">
          <Filter className="h-3.5 w-3.5 text-slate-700" />
          <span>Filters</span>
          {hasActiveFilters && (
            <span className="flex h-1.5 w-1.5 rounded-full bg-slate-900" />
          )}
        </div>
        {hasActiveFilters && (
          <button
            onClick={handleClearFilters}
            className="flex items-center gap-1 text-xs text-slate-500 hover:text-slate-900 font-medium cursor-pointer"
          >
            <RotateCcw className="h-3 w-3" />
            <span>Reset</span>
          </button>
        )}
      </div>

      {/* Stream / Course Filter */}
      <div className="space-y-2">
        <label className="text-xs font-semibold text-slate-900">
          Discipline
        </label>
        <div className="flex flex-wrap gap-1.5">
          <button
            onClick={() => updateParam("stream", "")}
            className={`text-xs px-2.5 py-1 rounded-md font-medium transition-colors cursor-pointer ${
              !activeStream
                ? "bg-slate-900 text-white"
                : "bg-slate-100 text-slate-700 hover:bg-slate-200"
            }`}
          >
            All
          </button>
          {(filterData?.streams || ["Engineering", "Management", "Medical", "Science"]).map(
            (stream) => {
              const isSelected = activeStream.toLowerCase() === stream.toLowerCase();
              return (
                <button
                  key={stream}
                  onClick={() => updateParam("stream", isSelected ? "" : stream)}
                  className={`text-xs px-2.5 py-1 rounded-md font-medium transition-colors cursor-pointer ${
                    isSelected
                      ? "bg-slate-900 text-white"
                      : "bg-slate-100 text-slate-700 hover:bg-slate-200"
                  }`}
                >
                  {stream}
                </button>
              );
            }
          )}
        </div>
      </div>

      {/* State Filter */}
      <div className="space-y-1.5">
        <label className="text-xs font-semibold text-slate-900">
          Location
        </label>
        <select
          value={activeState}
          onChange={(e) => updateParam("state", e.target.value)}
          className="w-full rounded-lg border border-slate-300 bg-white px-3 py-2 text-xs text-slate-900 focus:border-slate-900 focus:outline-none cursor-pointer"
        >
          <option value="">All States</option>
          {(filterData?.states || []).map((state) => (
            <option key={state} value={state}>
              {state}
            </option>
          ))}
        </select>
      </div>

      {/* Institution Type */}
      <div className="space-y-2">
        <label className="text-xs font-semibold text-slate-900">
          Institution Type
        </label>
        <div className="space-y-1.5">
          {[
            { label: "All Types", value: "" },
            { label: "Government", value: "GOVERNMENT" },
            { label: "Private", value: "PRIVATE" },
            { label: "Deemed University", value: "DEEMED" },
            { label: "Autonomous", value: "AUTONOMOUS" },
          ].map((typeOption) => {
            const isSelected = activeType === typeOption.value;
            return (
              <label
                key={typeOption.value}
                className="flex items-center gap-2 text-xs text-slate-700 hover:text-slate-900 cursor-pointer select-none"
              >
                <input
                  type="radio"
                  name="collegeType"
                  checked={isSelected}
                  onChange={() => updateParam("type", typeOption.value)}
                  className="rounded border-slate-300 text-slate-900 focus:ring-slate-900 cursor-pointer"
                />
                <span>{typeOption.label}</span>
              </label>
            );
          })}
        </div>
      </div>

      {/* Max Annual Fees */}
      <div className="space-y-2">
        <div className="flex items-center justify-between">
          <label className="text-xs font-semibold text-slate-900">
            Max Annual Fees
          </label>
          <span className="text-xs font-medium text-slate-600">
            {activeMaxFees ? formatCurrency(Number(activeMaxFees)) : "Any"}
          </span>
        </div>
        <div className="grid grid-cols-2 gap-1.5">
          {[
            { label: "Under ₹1L", value: "100000" },
            { label: "Under ₹2L", value: "200000" },
            { label: "Under ₹4L", value: "400000" },
            { label: "Under ₹8L", value: "800000" },
          ].map((opt) => (
            <button
              key={opt.value}
              onClick={() =>
                updateParam("maxFees", activeMaxFees === opt.value ? "" : opt.value)
              }
              className={`text-xs py-1.5 px-2 rounded-md font-medium border transition-colors cursor-pointer ${
                activeMaxFees === opt.value
                  ? "border-slate-900 bg-slate-900 text-white font-semibold"
                  : "border-slate-200 bg-white text-slate-700 hover:border-slate-300"
              }`}
            >
              {opt.label}
            </button>
          ))}
        </div>
      </div>

      {/* Minimum Rating */}
      <div className="space-y-2">
        <label className="text-xs font-semibold text-slate-900">
          Minimum Rating
        </label>
        <div className="grid grid-cols-4 gap-1">
          {[
            { label: "All", value: "" },
            { label: "3.5+", value: "3.5" },
            { label: "4.0+", value: "4.0" },
            { label: "4.5+", value: "4.5" },
          ].map((opt) => (
            <button
              key={opt.value}
              onClick={() =>
                updateParam("minRating", activeMinRating === opt.value ? "" : opt.value)
              }
              className={`text-xs py-1.5 rounded-md font-medium border text-center transition-colors cursor-pointer ${
                activeMinRating === opt.value
                  ? "border-slate-900 bg-slate-900 text-white font-semibold"
                  : "border-slate-200 bg-white text-slate-700 hover:border-slate-300"
              }`}
            >
              {opt.label}
            </button>
          ))}
        </div>
      </div>
    </div>
  );

  return (
    <>
      {/* Desktop Sidebar */}
      <aside aria-label="College Filter Sidebar" className="hidden lg:block w-64 shrink-0 bg-white p-5 rounded-xl border border-slate-200 shadow-2xs self-start sticky top-20">
        {filterContent}
      </aside>

      {/* Mobile Filter Drawer / Modal */}
      {isMobileDrawerOpen && (
        <div className="lg:hidden fixed inset-0 z-50 flex">
          {/* Backdrop */}
          <div
            className="fixed inset-0 bg-slate-900/50 backdrop-blur-xs transition-opacity"
            onClick={onCloseMobileDrawer}
          />
          {/* Drawer sheet */}
          <div className="relative ml-auto flex h-full w-full max-w-xs flex-col bg-white p-6 shadow-xl overflow-y-auto">
            <div className="flex items-center justify-between pb-4 border-b border-slate-200 mb-4">
              <span className="text-base font-bold text-slate-900">
                Filter Colleges
              </span>
              <button
                onClick={onCloseMobileDrawer}
                className="p-1 rounded-md text-slate-400 hover:bg-slate-100 hover:text-slate-600 transition-colors"
              >
                <X className="h-5 w-5" />
              </button>
            </div>
            {filterContent}
            <div className="mt-8 pt-4 border-t border-slate-200">
              <Button
                variant="primary"
                className="w-full justify-center"
                onClick={onCloseMobileDrawer}
              >
                Apply Filters
              </Button>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
