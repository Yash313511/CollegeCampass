"use client";

import React, { useEffect, useState, Suspense } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { useCompare } from "@/context/CompareContext";
import { CompareCollege, CollegeListItem } from "@/types";
import { CompareTable } from "@/components/compare/CompareTable";
import { CollegePickerModal } from "@/components/compare/CollegePickerModal";
import { ErrorState } from "@/components/ui/ErrorState";
import { Skeleton } from "@/components/ui/Skeleton";
import { Scale, Plus } from "lucide-react";
import { Button } from "@/components/ui/Button";
import Link from "next/link";

function CompareContent() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const { selectedColleges, addToCompare, removeFromCompare, clearCompare } =
    useCompare();

  const [collegesData, setCollegesData] = useState<CompareCollege[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [isPickerOpen, setIsPickerOpen] = useState(false);

  // Derive target IDs from URL or context
  const idsParam = searchParams.get("ids");

  // When mounted or URL changes, fetch the comparison data
  useEffect(() => {
    async function fetchCompareData() {
      let targetIds = idsParam ? idsParam.split(",").filter(Boolean) : [];

      // If URL has no IDs but context has at least 2, update URL
      if (targetIds.length < 2 && selectedColleges.length >= 2) {
        targetIds = selectedColleges.map((c) => c.id);
        router.replace(`/compare?ids=${targetIds.join(",")}`);
      }

      if (targetIds.length < 2) {
        setCollegesData([]);
        setLoading(false);
        return;
      }

      setLoading(true);
      setError(null);

      try {
        const res = await fetch(`/api/compare?ids=${targetIds.join(",")}`);
        if (!res.ok) {
          const json = await res.json();
          throw new Error(json.error || "Failed to load comparison data");
        }
        const json = await res.json();
        setCollegesData(json.data || []);
      } catch (err: unknown) {
        console.error("Comparison fetch error:", err);
        const message = err instanceof Error ? err.message : "Failed to compare colleges";
        setError(message);
      } finally {
        setLoading(false);
      }
    }

    fetchCompareData();
  }, [idsParam, selectedColleges, router]);

  const handleRemoveCollege = (id: string) => {
    removeFromCompare(id);
    const newColleges = collegesData.filter((c) => c.id !== id && c.slug !== id);
    setCollegesData(newColleges);

    const newIds = newColleges.map((c) => c.id);
    if (newIds.length >= 2) {
      router.push(`/compare?ids=${newIds.join(",")}`);
    } else {
      router.push(`/compare`);
    }
  };

  const handleSelectFromPicker = (college: CollegeListItem) => {
    addToCompare(college);
    const currentIds = collegesData.map((c) => c.id);
    if (!currentIds.includes(college.id) && currentIds.length < 3) {
      const updatedIds = [...currentIds, college.id];
      router.push(`/compare?ids=${updatedIds.join(",")}`);
    }
  };

  return (
    <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-8 space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div className="space-y-1">
          <div className="flex items-center gap-2 text-xs font-semibold text-slate-500 uppercase tracking-wider">
            <Scale className="h-4 w-4 text-slate-700" />
            <span>Decision Support Matrix</span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900 tracking-tight">
            Compare Colleges
          </h1>
          <p className="text-sm text-slate-500 max-w-2xl">
            Evaluate key decision metrics side-by-side: tuition fees, placement records, and accreditation.
          </p>
        </div>

        {collegesData.length >= 2 && (
          <div className="flex items-center gap-2.5">
            <Button
              variant="outline"
              size="sm"
              onClick={() => {
                clearCompare();
                router.push("/compare");
              }}
              className="text-xs"
            >
              Clear Comparison
            </Button>
            {collegesData.length < 3 && (
              <Button
                variant="primary"
                size="sm"
                onClick={() => setIsPickerOpen(true)}
                leftIcon={<Plus className="h-4 w-4" />}
                className="text-xs"
              >
                Add College
              </Button>
            )}
          </div>
        )}
      </div>

      {/* Loading Skeleton */}
      {loading && (
        <div className="bg-white rounded-2xl border border-slate-200 p-6 space-y-4 shadow-2xs">
          <div className="grid grid-cols-3 gap-4">
            <Skeleton className="h-20" />
            <Skeleton className="h-20" />
            <Skeleton className="h-20" />
          </div>
          <Skeleton className="h-64" />
        </div>
      )}

      {/* Error state */}
      {!loading && error && (
        <ErrorState
          title="Could not load comparison"
          message={error}
          onRetry={() => window.location.reload()}
        />
      )}

      {/* Empty State (fewer than 2 colleges) */}
      {!loading && !error && collegesData.length < 2 && (
        <div className="bg-white rounded-2xl border border-slate-200 p-10 sm:p-16 text-center space-y-4 shadow-2xs">
          <div className="flex h-14 w-14 items-center justify-center rounded-full bg-slate-100 text-slate-900 mx-auto">
            <Scale className="h-7 w-7" />
          </div>
          <h3 className="text-lg font-bold text-slate-900">
            Select at least 2 colleges to compare
          </h3>
          <p className="text-sm text-slate-500 max-w-md mx-auto">
            Compare tuition fees, average and highest placement packages, student ratings, and available programs across 2 to 3 institutions.
          </p>
          <div className="pt-2 flex flex-wrap items-center justify-center gap-3">
            <Button
              variant="primary"
              onClick={() => setIsPickerOpen(true)}
              leftIcon={<Plus className="h-4 w-4" />}
            >
              Choose College
            </Button>
            <Link href="/colleges">
              <Button variant="outline">
                Browse Directory
              </Button>
            </Link>
          </div>
        </div>
      )}

      {/* Comparison Table */}
      {!loading && !error && collegesData.length >= 2 && (
        <CompareTable
          colleges={collegesData}
          onRemoveCollege={handleRemoveCollege}
          onOpenAddModal={() => setIsPickerOpen(true)}
        />
      )}

      {/* College Picker Modal */}
      <CollegePickerModal
        isOpen={isPickerOpen}
        onClose={() => setIsPickerOpen(false)}
        onSelectCollege={handleSelectFromPicker}
        currentSelectedIds={collegesData.map((c) => c.id)}
      />
    </div>
  );
}

export default function ComparePage() {
  return (
    <Suspense
      fallback={
        <div className="mx-auto max-w-7xl px-4 py-8">
          <Skeleton className="h-96" />
        </div>
      }
    >
      <CompareContent />
    </Suspense>
  );
}
