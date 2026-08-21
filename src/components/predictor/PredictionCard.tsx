"use client";

import React, { useState } from "react";
import Link from "next/link";
import { PredictionResult } from "@/types";
import {
  CheckCircle2,
  XCircle,
  ChevronDown,
  ChevronUp,
  MapPin,
  Sparkles,
  ArrowUpRight,
} from "lucide-react";
import { Badge } from "@/components/ui/Badge";
import { RatingStars } from "@/components/college/RatingStars";
import { formatCurrency, formatLPA, getCollegeTypeLabel } from "@/lib/utils";

export interface PredictionCardProps {
  prediction: PredictionResult;
  rankIndex: number;
}

export function PredictionCard({ prediction, rankIndex }: PredictionCardProps) {
  const [expanded, setExpanded] = useState(false);
  const { college, matchScore, factors } = prediction;

  const scoreBadgeColor =
    matchScore >= 85
      ? "bg-emerald-50 text-emerald-800 border-emerald-300"
      : matchScore >= 70
      ? "bg-blue-50 text-blue-800 border-blue-300"
      : "bg-amber-50 text-amber-800 border-amber-300";

  const matchLabel =
    matchScore >= 85
      ? "High Probability Match"
      : matchScore >= 70
      ? "Competitive Match"
      : "Aspirational Match";

  return (
    <div className="bg-white rounded-xl border border-slate-200 p-5 shadow-2xs space-y-4 hover:border-slate-300 transition-all">
      {/* Top Banner: Rank & Match % */}
      <div className="flex items-start justify-between gap-3">
        <div className="space-y-1">
          <div className="flex items-center gap-2">
            <span className="flex h-5 w-5 items-center justify-center rounded-full bg-slate-900 text-white text-[11px] font-bold">
              {rankIndex}
            </span>
            <Link
              href={`/colleges/${college.slug}`}
              className="text-base font-bold text-slate-900 hover:text-blue-600 transition-colors line-clamp-1"
            >
              {college.name}
            </Link>
          </div>
          <div className="flex items-center gap-3 text-xs text-slate-500 pl-7">
            <span className="flex items-center gap-1">
              <MapPin className="h-3.5 w-3.5 text-slate-400" />
              {college.city}, {college.state}
            </span>
            <Badge variant="secondary" size="sm">
              {getCollegeTypeLabel(college.type)}
            </Badge>
          </div>
        </div>

        {/* Match Percentage Badge */}
        <div className="text-right shrink-0">
          <div
            className={`inline-flex items-center gap-1 px-2.5 py-1 rounded-lg border font-black text-sm ${scoreBadgeColor}`}
          >
            <Sparkles className="h-3.5 w-3.5" />
            <span>{matchScore}% Match</span>
          </div>
          <span className="text-[10px] text-slate-500 font-medium block mt-0.5">
            {matchLabel}
          </span>
        </div>
      </div>

      {/* Quick Metrics */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-2 bg-slate-50 p-3 rounded-lg text-xs text-slate-700">
        <div>
          <span className="text-[10px] text-slate-400 uppercase font-semibold block">
            Annual Fees
          </span>
          <span className="font-bold text-slate-900">
            {formatCurrency(college.feesMin)}
          </span>
        </div>
        <div>
          <span className="text-[10px] text-slate-400 uppercase font-semibold block">
            Avg Placement
          </span>
          <span className="font-bold text-emerald-700">
            {college.avgPackage ? formatLPA(college.avgPackage) : "N/A"}
          </span>
        </div>
        <div>
          <span className="text-[10px] text-slate-400 uppercase font-semibold block">
            Rating
          </span>
          <RatingStars rating={college.rating} showScore={true} size="sm" />
        </div>
      </div>

      {/* Factor Breakdown Preview */}
      <div className="space-y-1.5 pt-1">
        <div className="flex items-center justify-between text-xs font-semibold text-slate-700">
          <span>Why this college was recommended:</span>
          <button
            onClick={() => setExpanded(!expanded)}
            className="text-blue-600 hover:text-blue-700 flex items-center gap-0.5 cursor-pointer font-medium"
          >
            <span>{expanded ? "Hide Details" : "View Score Breakdown"}</span>
            {expanded ? (
              <ChevronUp className="h-3.5 w-3.5" />
            ) : (
              <ChevronDown className="h-3.5 w-3.5" />
            )}
          </button>
        </div>

        <ul className="space-y-1.5 text-xs text-slate-600">
          {factors.slice(0, expanded ? factors.length : 2).map((factor, idx) => (
            <li
              key={idx}
              className={`flex items-start gap-2 p-2 rounded-md ${
                factor.matched ? "bg-emerald-50/50" : "bg-slate-50"
              }`}
            >
              {factor.matched ? (
                <CheckCircle2 className="h-4 w-4 text-emerald-600 shrink-0 mt-0.5" />
              ) : (
                <XCircle className="h-4 w-4 text-slate-400 shrink-0 mt-0.5" />
              )}
              <div className="flex-1 min-w-0">
                <div className="flex items-center justify-between">
                  <strong className="text-slate-800 font-semibold">
                    {factor.name}
                  </strong>
                  {expanded && (
                    <span className="text-[10px] font-mono text-slate-500">
                      Score: {factor.score}/{factor.weight}
                    </span>
                  )}
                </div>
                <p className="text-[11px] text-slate-600 mt-0.5">
                  {factor.detail}
                </p>
              </div>
            </li>
          ))}
        </ul>
      </div>

      {/* Footer Link */}
      <div className="pt-2 flex items-center justify-between border-t border-slate-100 text-xs">
        <span className="text-slate-400">
          Rank compatible via cutoff database
        </span>
        <Link
          href={`/colleges/${college.slug}`}
          className="inline-flex items-center gap-1 font-semibold text-blue-600 hover:text-blue-700"
        >
          <span>Explore Details & Cutoffs</span>
          <ArrowUpRight className="h-3.5 w-3.5" />
        </Link>
      </div>
    </div>
  );
}
