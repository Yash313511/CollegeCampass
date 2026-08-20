"use client";

import React, { useEffect, useState, useCallback } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useSession } from "next-auth/react";
import { SavedCollegeItem } from "@/types";
import { CollegeCard } from "@/components/college/CollegeCard";
import { CollegeCardSkeleton } from "@/components/ui/Skeleton";
import { EmptyState } from "@/components/ui/EmptyState";
import { ErrorState } from "@/components/ui/ErrorState";
import { Bookmark, Scale, LogIn } from "lucide-react";
import { Button } from "@/components/ui/Button";
import { useCompare } from "@/context/CompareContext";

export default function SavedCollegesPage() {
  const router = useRouter();
  const session = useSession();
  const status = session?.status ?? "loading";
  const { addToCompare } = useCompare();

  const [savedItems, setSavedItems] = useState<SavedCollegeItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchSaved = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const res = await fetch("/api/saved-colleges");
      if (!res.ok) {
        if (res.status === 401) { setLoading(false); return; }
        throw new Error("Failed to load saved colleges");
      }
      const json = await res.json();
      setSavedItems(json.data || []);
    } catch (err: unknown) {
      const message = err instanceof Error ? err.message : "Failed to load saved colleges";
      setError(message);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    if (status === "loading") return;
    if (status === "unauthenticated") { setLoading(false); return; }
    fetchSaved();
  }, [status, fetchSaved]);

  const handleSaveToggle = (collegeId: string, saved: boolean) => {
    if (!saved) {
      setSavedItems((prev) => prev.filter((item) => item.collegeId !== collegeId));
    }
  };

  const handleCompareAll = () => {
    const toCompare = savedItems.slice(0, 3);
    toCompare.forEach((item) => addToCompare(item.college));
  };

  if (status === "unauthenticated") {
    return (
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-16">
        <div className="bg-white rounded-2xl border border-slate-200 p-10 sm:p-14 text-center space-y-4 max-w-lg mx-auto shadow-2xs">
          <div className="flex h-14 w-14 items-center justify-center rounded-full bg-slate-100 text-slate-900 mx-auto">
            <LogIn className="h-7 w-7" />
          </div>
          <h2 className="text-xl font-bold text-slate-900">
            Sign In to View Saved Colleges
          </h2>
          <p className="text-xs sm:text-sm text-slate-500 leading-relaxed">
            Your shortlisted colleges are securely stored in your personal account so you can track admission deadlines and comparisons across devices.
          </p>
          <div className="pt-2">
            <Link href="/auth/login?redirect=/saved">
              <Button variant="primary" className="w-full justify-center">
                Sign in to your Account
              </Button>
            </Link>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-8 space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div className="space-y-1">
          <div className="flex items-center gap-2 text-xs font-semibold text-slate-500 uppercase tracking-wider">
            <Bookmark className="h-4 w-4 text-slate-700" />
            <span>Shortlisted Institutions</span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900 tracking-tight">
            Saved Colleges
          </h1>
          <p className="text-sm text-slate-500">
            Track and compare your selected institutions. All bookmarks are saved to your account database.
          </p>
        </div>

        {savedItems.length >= 2 && (
          <Button
            variant="outline"
            size="sm"
            onClick={handleCompareAll}
            leftIcon={<Scale className="h-4 w-4 text-slate-700" />}
            className="text-xs shrink-0"
          >
            Compare Saved ({Math.min(savedItems.length, 3)})
          </Button>
        )}
      </div>

      {/* Loading Skeleton */}
      {loading && (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
          {[...Array(3)].map((_, i) => (
            <CollegeCardSkeleton key={i} />
          ))}
        </div>
      )}

      {/* Error state */}
      {!loading && error && (
        <ErrorState message={error} onRetry={fetchSaved} />
      )}

      {/* Empty State */}
      {!loading && !error && savedItems.length === 0 && (
        <EmptyState
          icon={Bookmark}
          title="No saved colleges yet"
          description="You haven't bookmarked any colleges. Explore the directory and click the bookmark icon on any college card to save it here."
          actionLabel="Explore Colleges"
          onAction={() => { router.push("/colleges"); }}
        />
      )}

      {/* Results Grid */}
      {!loading && !error && savedItems.length > 0 && (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
          {savedItems.map((item) => (
            <CollegeCard
              key={item.id}
              college={item.college}
              isSavedInitial={true}
              onSaveToggle={handleSaveToggle}
            />
          ))}
        </div>
      )}
    </div>
  );
}
