"use client";

import React, { useState, useEffect, useCallback } from "react";
import { GraduationCap, Award, Search, ArrowLeft, ArrowRight } from "lucide-react";
import { ScholarshipCard } from "@/components/scholarship/ScholarshipCard";
import { ScholarshipFilters } from "@/components/scholarship/ScholarshipFilters";
import type { ScholarshipListItem } from "@/types";

interface PaginationMeta {
  page: number;
  limit: number;
  total: number;
  totalPages: number;
}

export default function ScholarshipsPage() {
  const [scholarships, setScholarships] = useState<ScholarshipListItem[]>([]);
  const [meta, setMeta] = useState<PaginationMeta>({ page: 1, limit: 12, total: 0, totalPages: 0 });
  const [loading, setLoading] = useState(true);

  // Filters
  const [search, setSearch] = useState("");
  const [type, setType] = useState("");
  const [level, setLevel] = useState("");
  const [stream, setStream] = useState("");
  const [category, setCategory] = useState("");
  const [page, setPage] = useState(1);

  // Debounced search
  const [debouncedSearch, setDebouncedSearch] = useState("");
  useEffect(() => {
    const timer = setTimeout(() => {
      setDebouncedSearch(search);
      setPage(1);
    }, 300);
    return () => clearTimeout(timer);
  }, [search]);

  const fetchScholarships = useCallback(async () => {
    setLoading(true);
    try {
      const params = new URLSearchParams();
      if (debouncedSearch) params.set("search", debouncedSearch);
      if (type) params.set("type", type);
      if (level) params.set("level", level);
      if (stream) params.set("stream", stream);
      if (category) params.set("category", category);
      params.set("page", page.toString());
      params.set("limit", "12");

      const res = await fetch(`/api/scholarships?${params.toString()}`);
      const json = await res.json();

      setScholarships(json.data || []);
      setMeta(json.meta || { page: 1, limit: 12, total: 0, totalPages: 0 });
    } catch (err) {
      console.error("Failed to fetch scholarships:", err);
    } finally {
      setLoading(false);
    }
  }, [debouncedSearch, type, level, stream, category, page]);

  useEffect(() => {
    fetchScholarships();
  }, [fetchScholarships]);

  const handleFilterChange = (key: string, value: string) => {
    switch (key) {
      case "search": setSearch(value); break;
      case "type": setType(value); setPage(1); break;
      case "level": setLevel(value); setPage(1); break;
      case "stream": setStream(value); setPage(1); break;
      case "category": setCategory(value); setPage(1); break;
    }
  };

  const handleClearAll = () => {
    setSearch("");
    setType("");
    setLevel("");
    setStream("");
    setCategory("");
    setPage(1);
  };

  return (
    <div className="space-y-8 pb-16">
      {/* Hero Section */}
      <section className="bg-white border-b border-slate-200 py-10 sm:py-14">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="max-w-3xl space-y-4">
            {/* Pill Badge */}
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-md bg-slate-100 border border-slate-200 text-slate-800 text-xs font-semibold">
              <GraduationCap className="h-3.5 w-3.5 text-slate-700" />
              <span>Scholarship Directory</span>
            </div>

            {/* Headline */}
            <h1 className="text-3xl sm:text-4xl font-black text-slate-900 tracking-tight leading-tight">
              Find scholarships to fund your education
            </h1>

            {/* Sub-headline */}
            <p className="text-base text-slate-600 leading-relaxed max-w-2xl">
              Browse government, institutional, and private scholarships across India.
              Filter by type, stream, category, and more to find the right financial support.
            </p>

            {/* Quick Stats */}
            <div className="flex items-center gap-4 pt-2">
              <div className="flex items-center gap-2 px-3 py-1.5 rounded-lg bg-slate-50 border border-slate-200">
                <Award className="h-4 w-4 text-slate-600" />
                <span className="text-xs font-bold text-slate-900">{meta.total}</span>
                <span className="text-xs text-slate-500 font-medium">Scholarships</span>
              </div>
              <div className="flex items-center gap-2 px-3 py-1.5 rounded-lg bg-slate-50 border border-slate-200">
                <Search className="h-4 w-4 text-slate-600" />
                <span className="text-xs text-slate-500 font-medium">Search & Filter below</span>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Main Content: Filters + Grid */}
      <section className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="flex flex-col lg:flex-row gap-6">
          {/* Sidebar Filters */}
          <aside className="lg:w-[280px] shrink-0">
            <div className="lg:sticky lg:top-24">
              <ScholarshipFilters
                search={search}
                type={type}
                level={level}
                stream={stream}
                category={category}
                onFilterChange={handleFilterChange}
                onClearAll={handleClearAll}
                totalResults={meta.total}
              />
            </div>
          </aside>

          {/* Scholarship Grid */}
          <div className="flex-1 space-y-5">
            {loading ? (
              /* Loading Skeleton */
              <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                {Array.from({ length: 6 }).map((_, i) => (
                  <div
                    key={i}
                    className="bg-white rounded-xl border border-slate-200 p-5 space-y-4 animate-pulse"
                  >
                    <div className="flex gap-2">
                      <div className="h-5 w-16 bg-slate-100 rounded-md" />
                      <div className="h-5 w-20 bg-slate-100 rounded-md" />
                    </div>
                    <div className="h-5 w-3/4 bg-slate-100 rounded" />
                    <div className="h-4 w-1/2 bg-slate-50 rounded" />
                    <div className="h-16 bg-emerald-50 rounded-lg" />
                    <div className="space-y-2">
                      <div className="h-3 w-full bg-slate-50 rounded" />
                      <div className="h-3 w-4/5 bg-slate-50 rounded" />
                    </div>
                    <div className="flex gap-1">
                      <div className="h-5 w-16 bg-slate-50 rounded-md" />
                      <div className="h-5 w-14 bg-slate-50 rounded-md" />
                    </div>
                  </div>
                ))}
              </div>
            ) : scholarships.length === 0 ? (
              /* Empty State */
              <div className="bg-white rounded-xl border border-slate-200 p-12 text-center space-y-3">
                <GraduationCap className="h-10 w-10 text-slate-300 mx-auto" />
                <h3 className="text-base font-bold text-slate-900">No scholarships found</h3>
                <p className="text-sm text-slate-500 max-w-md mx-auto">
                  Try adjusting your filters or search query to find scholarships that match your criteria.
                </p>
                <button
                  onClick={handleClearAll}
                  className="inline-flex items-center gap-1 px-4 py-2 rounded-lg bg-slate-900 text-white text-xs font-semibold hover:bg-slate-800 transition-colors cursor-pointer mt-2"
                >
                  Clear All Filters
                </button>
              </div>
            ) : (
              <>
                {/* Grid */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                  {scholarships.map((scholarship) => (
                    <ScholarshipCard key={scholarship.id} scholarship={scholarship} />
                  ))}
                </div>

                {/* Pagination */}
                {meta.totalPages > 1 && (
                  <div className="flex items-center justify-between pt-4">
                    <p className="text-xs text-slate-500 font-medium">
                      Showing{" "}
                      <span className="text-slate-900 font-bold">
                        {(meta.page - 1) * meta.limit + 1}
                      </span>
                      {" "}-{" "}
                      <span className="text-slate-900 font-bold">
                        {Math.min(meta.page * meta.limit, meta.total)}
                      </span>
                      {" "}of{" "}
                      <span className="text-slate-900 font-bold">{meta.total}</span>
                    </p>
                    <div className="flex items-center gap-2">
                      <button
                        onClick={() => setPage((p) => Math.max(1, p - 1))}
                        disabled={page <= 1}
                        className="flex items-center gap-1 px-3 py-1.5 rounded-lg border border-slate-200 text-xs font-semibold text-slate-700 hover:bg-slate-50 disabled:opacity-40 disabled:cursor-not-allowed transition-colors cursor-pointer"
                      >
                        <ArrowLeft className="h-3.5 w-3.5" />
                        Previous
                      </button>
                      <span className="text-xs font-bold text-slate-900 px-2">
                        {meta.page} / {meta.totalPages}
                      </span>
                      <button
                        onClick={() => setPage((p) => Math.min(meta.totalPages, p + 1))}
                        disabled={page >= meta.totalPages}
                        className="flex items-center gap-1 px-3 py-1.5 rounded-lg border border-slate-200 text-xs font-semibold text-slate-700 hover:bg-slate-50 disabled:opacity-40 disabled:cursor-not-allowed transition-colors cursor-pointer"
                      >
                        Next
                        <ArrowRight className="h-3.5 w-3.5" />
                      </button>
                    </div>
                  </div>
                )}
              </>
            )}
          </div>
        </div>
      </section>
    </div>
  );
}
