"use client";

import React, { useEffect, useState, Suspense, useCallback } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { CollegeListItem, PaginationMeta } from "@/types";
import { CollegeCard } from "@/components/college/CollegeCard";
import { CollegeFilters, FilterData } from "@/components/college/CollegeFilters";
import { CollegeSearch } from "@/components/college/CollegeSearch";
import { CollegeSortSelect } from "@/components/college/CollegeSortSelect";
import { Pagination } from "@/components/college/Pagination";
import { CollegeCardSkeleton } from "@/components/ui/Skeleton";
import { EmptyState } from "@/components/ui/EmptyState";
import { ErrorState } from "@/components/ui/ErrorState";
import { SlidersHorizontal, Building2 } from "lucide-react";
import { Button } from "@/components/ui/Button";

function CollegesContent() {
  const router = useRouter();
  const searchParams = useSearchParams();

  const [colleges, setColleges] = useState<CollegeListItem[]>([]);
  const [meta, setMeta] = useState<PaginationMeta>({
    page: 1,
    limit: 12,
    total: 0,
    totalPages: 1,
  });
  const [filterData, setFilterData] = useState<FilterData | undefined>(undefined);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [isMobileFiltersOpen, setIsMobileFiltersOpen] = useState(false);

  // Fetch filter options once on mount
  useEffect(() => {
    async function fetchFilters() {
      try {
        const res = await fetch("/api/colleges/filters");
        if (res.ok) {
          const json = await res.json();
          setFilterData(json.data);
        }
      } catch (e) {
        console.error("Failed to load filter options", e);
      }
    }
    fetchFilters();
  }, []);

  const fetchColleges = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const queryString = searchParams.toString();
      const res = await fetch(`/api/colleges?${queryString}`);
      if (!res.ok) throw new Error(`Failed to load colleges (${res.status})`);
      const json = await res.json();
      setColleges(json.data || []);
      setMeta(json.meta || { page: 1, limit: 12, total: 0, totalPages: 1 });
    } catch (err: unknown) {
      console.error("Error fetching colleges:", err);
      const message = err instanceof Error ? err.message : "Something went wrong";
      setError(message);
    } finally {
      setLoading(false);
    }
  }, [searchParams]);

  useEffect(() => {
    fetchColleges();
  }, [fetchColleges]);

  return (
    <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-8 space-y-6">
      {/* Page Header */}
      <div className="space-y-1.5">
        <div className="flex items-center gap-2 text-xs font-bold text-slate-500 uppercase tracking-wider">
          <Building2 className="h-4 w-4 text-slate-700" />
          <span>Institutions Directory</span>
        </div>
        <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900 tracking-tight">
          Explore Colleges in India
        </h1>
        <p className="text-sm text-slate-600 max-w-2xl">
          Discover vetted government, deemed, and private institutions. Filter by stream, annual fees, and average placement metrics to make data-driven decisions.
        </p>
      </div>

      {/* Search Bar & Mobile Filter Trigger */}
      <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-3 bg-white p-3 rounded-xl border border-slate-200 shadow-2xs">
        <div className="flex-1">
          <CollegeSearch />
        </div>

        <div className="flex items-center justify-between sm:justify-end gap-2.5">
          {/* Mobile Filter Button */}
          <Button
            variant="outline"
            size="sm"
            onClick={() => setIsMobileFiltersOpen(true)}
            className="lg:hidden flex items-center gap-1.5 text-xs font-medium"
            leftIcon={<SlidersHorizontal className="h-4 w-4" />}
          >
            Filters
          </Button>

          <CollegeSortSelect />
        </div>
      </div>

      {/* Main Content: Sidebar Filters + College Grid */}
      <div className="flex items-start gap-8">
        {/* Desktop Filter Sidebar & Mobile Drawer */}
        <CollegeFilters
          filterData={filterData}
          isMobileDrawerOpen={isMobileFiltersOpen}
          onCloseMobileDrawer={() => setIsMobileFiltersOpen(false)}
        />

        {/* College Grid Area */}
        <div className="flex-1 min-w-0">
          {/* Status / Count bar */}
          <div className="mb-4 flex items-center justify-between text-xs text-slate-500 font-medium">
            <span>
              {!loading && `${meta.total} ${meta.total === 1 ? "college" : "colleges"} found`}
            </span>
          </div>

          {/* Loading Skeleton State */}
          {loading && (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
              {[...Array(6)].map((_, i) => (
                <CollegeCardSkeleton key={i} />
              ))}
            </div>
          )}

          {/* Error State */}
          {!loading && error && (
            <ErrorState
              message={error}
              onRetry={fetchColleges}
            />
          )}

          {/* Empty State */}
          {!loading && !error && colleges.length === 0 && (
            <EmptyState
              title="No colleges found"
              description="No colleges match your current search and filter criteria. Try adjusting or clearing filters to see more results."
              actionLabel="Clear all filters"
              onAction={() => {
                router.push("/colleges");
              }}
            />
          )}

          {/* Results Grid */}
          {!loading && !error && colleges.length > 0 && (
            <div className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                {colleges.map((college) => (
                  <CollegeCard key={college.id} college={college} />
                ))}
              </div>

              {/* Pagination */}
              <Pagination
                currentPage={meta.page}
                totalPages={meta.totalPages}
                totalItems={meta.total}
                limit={meta.limit}
              />
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

export default function CollegesPage() {
  return (
    <Suspense
      fallback={
        <div className="mx-auto max-w-7xl px-4 py-8">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
            {[...Array(6)].map((_, i) => (
              <CollegeCardSkeleton key={i} />
            ))}
          </div>
        </div>
      }
    >
      <CollegesContent />
    </Suspense>
  );
}
