import React from "react";
import { TrendingUp, Award, Users, CheckCircle2 } from "lucide-react";
import { formatLPA } from "@/lib/utils";

export interface PlacementMetricsProps {
  avgPackage: number | null;
  highestPackage: number | null;
  placementRate: number | null;
}

export function PlacementMetrics({
  avgPackage,
  highestPackage,
  placementRate,
}: PlacementMetricsProps) {
  return (
    <div className="space-y-6">
      {/* Top 3 Metric Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        {/* Average Package */}
        <div className="bg-emerald-50/60 border border-emerald-200/80 rounded-xl p-4 space-y-1">
          <div className="flex items-center justify-between text-xs font-semibold text-emerald-800">
            <span>Average Package</span>
            <TrendingUp className="h-4 w-4 text-emerald-600" />
          </div>
          <div className="text-2xl font-extrabold text-emerald-950">
            {avgPackage ? formatLPA(avgPackage) : "N/A"}
          </div>
          <p className="text-[11px] text-emerald-700">
            Across all placed graduates in the previous academic session.
          </p>
        </div>

        {/* Highest Package */}
        <div className="bg-blue-50/60 border border-blue-200/80 rounded-xl p-4 space-y-1">
          <div className="flex items-center justify-between text-xs font-semibold text-blue-800">
            <span>Highest Package</span>
            <Award className="h-4 w-4 text-blue-600" />
          </div>
          <div className="text-2xl font-extrabold text-blue-950">
            {highestPackage ? formatLPA(highestPackage) : "N/A"}
          </div>
          <p className="text-[11px] text-blue-700">
            Top national / international offer recorded on campus.
          </p>
        </div>

        {/* Placement Rate */}
        <div className="bg-indigo-50/60 border border-indigo-200/80 rounded-xl p-4 space-y-1">
          <div className="flex items-center justify-between text-xs font-semibold text-indigo-800">
            <span>Placement Rate</span>
            <Users className="h-4 w-4 text-indigo-600" />
          </div>
          <div className="text-2xl font-extrabold text-indigo-950">
            {placementRate ? `${placementRate}%` : "N/A"}
          </div>
          <p className="text-[11px] text-indigo-700">
            Eligible graduating students successfully placed.
          </p>
        </div>
      </div>

      {/* Progress Bar Visualization */}
      {placementRate && (
        <div className="bg-white border border-slate-200 rounded-xl p-5 space-y-3">
          <div className="flex items-center justify-between text-xs">
            <span className="font-semibold text-slate-700">
              Campus Placement Success Rate
            </span>
            <span className="font-bold text-slate-900">{placementRate}%</span>
          </div>
          <div className="h-3 w-full bg-slate-100 rounded-full overflow-hidden">
            <div
              className="h-full bg-emerald-600 rounded-full transition-all duration-500"
              style={{ width: `${placementRate}%` }}
            />
          </div>
          <div className="flex items-center justify-between text-[11px] text-slate-400">
            <span>0%</span>
            <span>50%</span>
            <span>100% Placed</span>
          </div>
        </div>
      )}

      {/* Highlights */}
      <div className="bg-slate-50 border border-slate-200 rounded-xl p-4 space-y-2">
        <h4 className="text-xs font-bold text-slate-900 uppercase tracking-wider">
          Placement Insights
        </h4>
        <ul className="space-y-1.5 text-xs text-slate-600">
          <li className="flex items-start gap-2">
            <CheckCircle2 className="h-3.5 w-3.5 text-emerald-600 shrink-0 mt-0.5" />
            <span>
              Active Training and Placement Cell organizing pre-placement talks, mock interviews, and coding tests.
            </span>
          </li>
          <li className="flex items-start gap-2">
            <CheckCircle2 className="h-3.5 w-3.5 text-emerald-600 shrink-0 mt-0.5" />
            <span>
              Major recruiters include Tier-1 product companies, multinational IT services, core engineering firms, and consultancies.
            </span>
          </li>
          <li className="flex items-start gap-2">
            <CheckCircle2 className="h-3.5 w-3.5 text-emerald-600 shrink-0 mt-0.5" />
            <span>
              Industry internship partnerships facilitate pre-placement offers (PPOs) prior to final semester.
            </span>
          </li>
        </ul>
      </div>
    </div>
  );
}
