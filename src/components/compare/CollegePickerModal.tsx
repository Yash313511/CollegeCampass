"use client";

import React, { useState, useEffect } from "react";
import { Modal } from "@/components/ui/Modal";
import { CollegeListItem } from "@/types";
import { Search, Plus, MapPin, Check } from "lucide-react";
import { formatCurrency, formatLPA } from "@/lib/utils";

export interface CollegePickerModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSelectCollege: (college: CollegeListItem) => void;
  currentSelectedIds: string[];
}

export function CollegePickerModal({
  isOpen,
  onClose,
  onSelectCollege,
  currentSelectedIds,
}: CollegePickerModalProps) {
  const [searchTerm, setSearchTerm] = useState("");
  const [colleges, setColleges] = useState<CollegeListItem[]>([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (!isOpen) return;

    const delayDebounceFn = setTimeout(async () => {
      setLoading(true);
      try {
        const res = await fetch(`/api/colleges?search=${encodeURIComponent(searchTerm)}&limit=10`);
        if (res.ok) {
          const json = await res.json();
          setColleges(json.data || []);
        }
      } catch (err) {
        console.error("Error fetching colleges for picker", err);
      } finally {
        setLoading(false);
      }
    }, 250);

    return () => clearTimeout(delayDebounceFn);
  }, [searchTerm, isOpen]);

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title="Add College to Compare"
      description="Select an institution to compare metrics side-by-side."
      maxWidth="lg"
    >
      <div className="space-y-4 pt-2">
        {/* Search input */}
        <div className="relative">
          <Search className="h-4 w-4 absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
          <input
            type="text"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            placeholder="Search by name, city, or stream..."
            className="w-full rounded-lg border border-slate-300 bg-white py-2 pl-9 pr-3 text-xs sm:text-sm focus:border-blue-600 focus:outline-none focus:ring-2 focus:ring-blue-600"
            autoFocus
          />
        </div>

        {/* Results List */}
        <div className="max-h-80 overflow-y-auto divide-y divide-slate-100 -mx-6 px-6">
          {loading && (
            <div className="py-6 text-center text-xs text-slate-400">
              Searching colleges...
            </div>
          )}

          {!loading && colleges.length === 0 && (
            <div className="py-8 text-center text-xs text-slate-500">
              No matching colleges found.
            </div>
          )}

          {!loading &&
            colleges.map((college) => {
              const isAlreadySelected = currentSelectedIds.includes(college.id);
              return (
                <div
                  key={college.id}
                  className="py-3 flex items-center justify-between gap-3 hover:bg-slate-50 px-2 rounded-lg transition-colors"
                >
                  <div className="space-y-1 flex-1 min-w-0">
                    <h4 className="text-xs sm:text-sm font-bold text-slate-900 truncate">
                      {college.name}
                    </h4>
                    <div className="flex flex-wrap items-center gap-2 sm:gap-3 text-[11px] text-slate-500">
                      <span className="flex items-center gap-1">
                        <MapPin className="h-3 w-3 text-slate-400" />
                        {college.city}, {college.state}
                      </span>
                      <span>Fees: {formatCurrency(college.feesMin)}</span>
                      {college.avgPackage && (
                        <span className="text-emerald-700 font-semibold">
                          Avg: {formatLPA(college.avgPackage)}
                        </span>
                      )}
                    </div>
                  </div>

                  <button
                    disabled={isAlreadySelected}
                    onClick={() => {
                      onSelectCollege(college);
                      onClose();
                    }}
                    className={`inline-flex items-center gap-1 text-xs font-semibold px-3 py-1.5 rounded-lg transition-colors cursor-pointer shrink-0 ${
                      isAlreadySelected
                        ? "bg-slate-100 text-slate-400 cursor-not-allowed"
                        : "bg-blue-600 text-white hover:bg-blue-700"
                    }`}
                  >
                    {isAlreadySelected ? (
                      <>
                        <Check className="h-3.5 w-3.5" />
                        <span>Added</span>
                      </>
                    ) : (
                      <>
                        <Plus className="h-3.5 w-3.5" />
                        <span>Select</span>
                      </>
                    )}
                  </button>
                </div>
              );
            })}
        </div>
      </div>
    </Modal>
  );
}
