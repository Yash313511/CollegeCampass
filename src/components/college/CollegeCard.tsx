"use client";

import React, { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useSession } from "next-auth/react";
import { CollegeListItem } from "@/types";
import { useCompare } from "@/context/CompareContext";
import {
  MapPin,
  TrendingUp,
  IndianRupee,
  Bookmark,
  Check,
  Plus,
  ArrowUpRight,
} from "lucide-react";
import { Badge } from "@/components/ui/Badge";
import { RatingStars } from "@/components/college/RatingStars";
import {
  formatCurrency,
  formatLPA,
  getCollegeTypeLabel,
} from "@/lib/utils";

export interface CollegeCardProps {
  college: CollegeListItem;
  isSavedInitial?: boolean;
  onSaveToggle?: (collegeId: string, saved: boolean) => void;
}

export function CollegeCard({
  college,
  isSavedInitial = false,
  onSaveToggle,
}: CollegeCardProps) {
  const router = useRouter();
  const sessionRes = useSession();
  const session = sessionRes?.data;
  const { isInCompare, addToCompare, removeFromCompare, canAddMore } =
    useCompare();

  const inCompare = isInCompare(college.id);
  const [isSaved, setIsSaved] = useState(isSavedInitial);
  const [isSaving, setIsSaving] = useState(false);

  const handleCompareToggle = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    if (inCompare) {
      removeFromCompare(college.id);
    } else {
      addToCompare(college);
    }
  };

  const handleSaveToggle = async (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();

    if (!session?.user) {
      router.push("/auth/login?redirect=" + encodeURIComponent(window.location.pathname));
      return;
    }

    setIsSaving(true);
    const nextSavedState = !isSaved;
    setIsSaved(nextSavedState);

    try {
      if (nextSavedState) {
        await fetch("/api/saved-colleges", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ collegeId: college.id }),
        });
      } else {
        await fetch(`/api/saved-colleges/${college.id}`, {
          method: "DELETE",
        });
      }
      onSaveToggle?.(college.id, nextSavedState);
    } catch (err) {
      console.error("Failed to toggle save state", err);
      setIsSaved(!nextSavedState); // Revert on failure
    } finally {
      setIsSaving(false);
    }
  };

  const typeVariantMap: Record<string, "government" | "private" | "deemed" | "autonomous"> = {
    GOVERNMENT: "government",
    PRIVATE: "private",
    DEEMED: "deemed",
    AUTONOMOUS: "autonomous",
  };

  return (
    <article
      className="group relative flex flex-col justify-between rounded-xl border border-slate-200/90 bg-white p-5 shadow-xs transition-all duration-200 hover:border-slate-300 hover:shadow-md"
    >
      {/* Top Section: Badges & Actions */}
      <div>
        <div className="flex items-start justify-between gap-2 mb-3">
          <div className="flex flex-wrap items-center gap-1.5">
            <Badge
              variant={typeVariantMap[college.type] || "default"}
              size="sm"
            >
              {getCollegeTypeLabel(college.type)}
            </Badge>
            {college.streams.slice(0, 2).map((stream) => (
              <span
                key={stream}
                className="text-[11px] font-medium text-slate-600 bg-slate-100 px-2 py-0.5 rounded border border-slate-200/50"
              >
                {stream}
              </span>
            ))}
          </div>

          <div className="flex items-center gap-1">
            {/* Compare Toggle Button */}
            <button
              onClick={handleCompareToggle}
              disabled={!inCompare && !canAddMore}
              className={`inline-flex items-center gap-1 text-xs font-medium px-2.5 py-1 rounded-md transition-colors cursor-pointer ${
                inCompare
                  ? "bg-slate-900 text-white hover:bg-slate-800"
                  : canAddMore
                  ? "bg-slate-100 text-slate-700 hover:bg-slate-200 border border-slate-200"
                  : "bg-slate-50 text-slate-400 cursor-not-allowed border border-slate-100"
              }`}
              title={
                inCompare
                  ? "Remove from comparison"
                  : canAddMore
                  ? "Add to comparison"
                  : "Maximum 3 colleges in comparison"
              }
            >
              {inCompare ? (
                <>
                  <Check className="h-3 w-3" />
                  <span>Added</span>
                </>
              ) : (
                <>
                  <Plus className="h-3 w-3" />
                  <span>Compare</span>
                </>
              )}
            </button>

            {/* Bookmark Button */}
            <button
              onClick={handleSaveToggle}
              disabled={isSaving}
              className={`p-1.5 rounded-md transition-colors cursor-pointer ${
                isSaved
                  ? "text-blue-600 bg-blue-50 border border-blue-200"
                  : "text-slate-400 hover:text-slate-600 hover:bg-slate-100 border border-transparent"
              }`}
              title={isSaved ? "Saved to your list" : "Save college"}
            >
              <Bookmark
                className={`h-4 w-4 ${isSaved ? "fill-blue-600 text-blue-600" : ""}`}
              />
            </button>
          </div>
        </div>

        {/* College Name & Location */}
        <div className="space-y-1 mb-3">
          <Link
            href={`/colleges/${college.slug}`}
            className="block text-slate-900 group-hover:text-blue-600 transition-colors"
          >
            <h3 className="text-base font-bold leading-snug line-clamp-1">
              {college.name}
            </h3>
          </Link>
          <div className="flex items-center gap-1 text-xs text-slate-500">
            <MapPin className="h-3.5 w-3.5 text-slate-400 shrink-0" />
            <span>
              {college.city}, {college.state}
            </span>
          </div>
        </div>

        {/* Ratings */}
        <div className="mb-3.5">
          <RatingStars
            rating={college.rating}
            reviewCount={college.reviewCount}
            size="sm"
          />
        </div>

        {/* Key Metrics Grid */}
        <div className="grid grid-cols-2 gap-2.5 p-3 rounded-lg border border-slate-100 bg-slate-50/80 text-xs">
          {/* Fees */}
          <div className="space-y-0.5">
            <span className="text-[11px] text-slate-500 font-medium flex items-center gap-1">
              <IndianRupee className="h-3 w-3 text-slate-400" />
              Annual Fees
            </span>
            <p className="font-semibold text-slate-900">
              {formatCurrency(college.feesMin)} - {formatCurrency(college.feesMax)}
            </p>
          </div>

          {/* Average Placement */}
          <div className="space-y-0.5">
            <span className="text-[11px] text-slate-500 font-medium flex items-center gap-1">
              <TrendingUp className="h-3 w-3 text-emerald-600" />
              Avg Package
            </span>
            <p className="font-semibold text-emerald-700">
              {college.avgPackage ? formatLPA(college.avgPackage) : "N/A"}
            </p>
          </div>

          {/* Highest Package */}
          <div className="space-y-0.5">
            <span className="text-[11px] text-slate-500 font-medium">
              Highest Package
            </span>
            <p className="font-medium text-slate-800">
              {college.highestPackage ? formatLPA(college.highestPackage) : "N/A"}
            </p>
          </div>

          {/* Placement Rate */}
          <div className="space-y-0.5">
            <span className="text-[11px] text-slate-500 font-medium">
              Placement Rate
            </span>
            <p className="font-medium text-slate-800">
              {college.placementRate ? `${college.placementRate}%` : "N/A"}
            </p>
          </div>
        </div>
      </div>

      {/* Bottom Action Footer */}
      <div className="pt-3.5 mt-3 border-t border-slate-100 flex items-center justify-between">
        <span className="text-xs text-slate-500">
          {college.streams.length} Stream{college.streams.length !== 1 ? "s" : ""}
        </span>
        <Link
          href={`/colleges/${college.slug}`}
          className="inline-flex items-center gap-1 text-xs font-semibold text-slate-900 hover:text-blue-600 transition-colors"
        >
          <span>View Details</span>
          <ArrowUpRight className="h-3.5 w-3.5" />
        </Link>
      </div>
    </article>
  );
}
