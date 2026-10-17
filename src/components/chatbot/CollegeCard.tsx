"use client";

import React from "react";
import Link from "next/link";
import { Star, MapPin, IndianRupee, Briefcase, ExternalLink, Award } from "lucide-react";

export interface CollegeCardData {
  id: string;
  name: string;
  slug: string;
  city?: string;
  state?: string;
  type?: string;
  rating?: number;
  feesMin?: number;
  feesMax?: number;
  avgPackage?: number | null;
  placementRate?: number | null;
  accreditation?: string | null;
  matchReason?: string | null;
  matchScore?: number | null;
  streams?: string[];
}

interface CollegeCardProps {
  college: CollegeCardData;
}

export function CollegeCard({ college }: CollegeCardProps) {
  const formattedFees =
    college.feesMin !== undefined && college.feesMin > 0
      ? `₹${(college.feesMin / 100000).toFixed(1)}L/yr`
      : null;

  return (
    <div className="group relative flex flex-col justify-between rounded-xl border border-slate-200 bg-white p-3.5 shadow-xs transition-all hover:border-slate-300 hover:shadow-md">
      {/* Top row: Match Score & Rating */}
      <div className="flex items-center justify-between gap-2 mb-1.5">
        {college.matchScore ? (
          <span className="inline-flex items-center gap-1 rounded-full bg-emerald-50 px-2 py-0.5 text-[11px] font-semibold text-emerald-700 border border-emerald-200/60">
            <span className="h-1.5 w-1.5 rounded-full bg-emerald-500" />
            {college.matchScore}% Match
          </span>
        ) : college.type ? (
          <span className="rounded-full bg-slate-100 px-2 py-0.5 text-[10px] font-medium text-slate-600">
            {college.type}
          </span>
        ) : <span />}

        {college.rating ? (
          <div className="flex items-center gap-1 text-xs font-semibold text-amber-600 bg-amber-50 px-1.5 py-0.5 rounded border border-amber-200/50">
            <Star className="h-3 w-3 fill-amber-500 text-amber-500" />
            <span>{college.rating.toFixed(1)}</span>
          </div>
        ) : null}
      </div>

      {/* College Name & Location */}
      <div className="mb-2.5">
        <h4 className="text-sm font-bold text-slate-900 group-hover:text-slate-800 line-clamp-1">
          {college.name}
        </h4>
        {(college.city || college.state) && (
          <p className="flex items-center gap-1 text-xs text-slate-500 mt-0.5">
            <MapPin className="h-3 w-3 shrink-0 text-slate-400" />
            <span className="truncate">
              {[college.city, college.state].filter(Boolean).join(", ")}
            </span>
          </p>
        )}
      </div>

      {/* Match Reason or Highlights */}
      {college.matchReason && (
        <p className="mb-2 text-[11px] text-slate-600 bg-slate-50 rounded-md p-1.5 border border-slate-100 line-clamp-2">
          {college.matchReason}
        </p>
      )}

      {/* Stats Grid */}
      <div className="grid grid-cols-2 gap-2 border-t border-slate-100 pt-2 text-[11px] mb-3">
        {formattedFees && (
          <div className="flex items-center gap-1 text-slate-700">
            <IndianRupee className="h-3 w-3 text-slate-400 shrink-0" />
            <span className="font-semibold">{formattedFees}</span>
          </div>
        )}
        {college.avgPackage ? (
          <div className="flex items-center gap-1 text-slate-700">
            <Briefcase className="h-3 w-3 text-slate-400 shrink-0" />
            <span>Avg <strong className="font-semibold">₹{college.avgPackage}L</strong></span>
          </div>
        ) : college.accreditation ? (
          <div className="flex items-center gap-1 text-slate-700 truncate">
            <Award className="h-3 w-3 text-slate-400 shrink-0" />
            <span className="truncate">{college.accreditation}</span>
          </div>
        ) : null}
      </div>

      {/* Action Link */}
      <Link
        href={`/colleges/${college.slug || college.id}`}
        target="_blank"
        rel="noopener noreferrer"
        className="inline-flex w-full items-center justify-center gap-1.5 rounded-lg bg-slate-900 px-3 py-1.5 text-xs font-semibold text-white transition-colors hover:bg-slate-800"
      >
        <span>View Details</span>
        <ExternalLink className="h-3 w-3" />
      </Link>
    </div>
  );
}
