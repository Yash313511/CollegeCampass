"use client";

import React from "react";
import Link from "next/link";
import { CompareCollege } from "@/types";
import { X, Plus, MapPin } from "lucide-react";
import { Badge } from "@/components/ui/Badge";
import { RatingStars } from "@/components/college/RatingStars";
import {
  formatCurrency,
  formatLPA,
  getCollegeTypeLabel,
} from "@/lib/utils";

export interface CompareTableProps {
  colleges: CompareCollege[];
  onRemoveCollege: (id: string) => void;
  onOpenAddModal: () => void;
}

export function CompareTable({
  colleges,
  onRemoveCollege,
  onOpenAddModal,
}: CompareTableProps) {
  if (colleges.length === 0) return null;

  // Compute best values across current colleges
  const maxRating = Math.max(...colleges.map((c) => c.rating));
  const minFees = Math.min(...colleges.map((c) => c.feesMin));
  const maxAvgPackage = Math.max(
    ...colleges.map((c) => c.avgPackage || 0).filter((v) => v > 0),
    0
  );
  const maxPlacementRate = Math.max(
    ...colleges.map((c) => c.placementRate || 0).filter((v) => v > 0),
    0
  );

  const typeVariantMap: Record<string, "government" | "private" | "deemed" | "autonomous"> = {
    GOVERNMENT: "government",
    PRIVATE: "private",
    DEEMED: "deemed",
    AUTONOMOUS: "autonomous",
  };

  // Helper to render a metric row for the mobile card view
  const MetricRow = ({ label, children }: { label: string; children: React.ReactNode }) => (
    <div className="flex items-start justify-between gap-2 py-2.5 border-b border-slate-100 last:border-b-0">
      <span className="text-xs font-medium text-slate-500 shrink-0">{label}</span>
      <div className="text-right">{children}</div>
    </div>
  );

  return (
    <>
      {/* ── Mobile Card Layout (below lg) ── */}
      <div className="lg:hidden space-y-4">
        {colleges.map((college) => {
          const isBestRating = college.rating === maxRating && maxRating > 0;
          const isLowestFees = college.feesMin === minFees;
          const isBestAvg = college.avgPackage && college.avgPackage === maxAvgPackage && maxAvgPackage > 0;
          const isBestPlacement = college.placementRate && college.placementRate === maxPlacementRate && maxPlacementRate > 0;

          return (
            <div
              key={college.id}
              className="bg-white rounded-xl border border-slate-200 shadow-2xs overflow-hidden"
            >
              {/* Card Header */}
              <div className="p-4 border-b border-slate-100 space-y-2">
                <div className="flex items-start justify-between gap-2">
                  <Badge
                    variant={typeVariantMap[college.type] || "default"}
                    size="sm"
                  >
                    {getCollegeTypeLabel(college.type)}
                  </Badge>
                  <button
                    onClick={() => onRemoveCollege(college.id)}
                    className="text-slate-400 hover:text-red-600 p-1 rounded-md hover:bg-red-50 transition-colors cursor-pointer"
                    title="Remove college"
                  >
                    <X className="h-4 w-4" />
                  </button>
                </div>
                <Link
                  href={`/colleges/${college.slug}`}
                  className="font-bold text-sm text-slate-900 hover:text-blue-600 transition-colors line-clamp-2 block"
                >
                  {college.name}
                </Link>
                <p className="text-xs text-slate-500 flex items-center gap-1">
                  <MapPin className="h-3.5 w-3.5 text-slate-400 shrink-0" />
                  <span>{college.city}, {college.state}</span>
                </p>
              </div>

              {/* Card Metrics */}
              <div className="px-4 py-2">
                <MetricRow label="Overall Rating">
                  <div className="flex items-center gap-1.5 justify-end">
                    <RatingStars rating={college.rating} size="sm" />
                    {isBestRating && (
                      <span className="text-[10px] font-bold text-emerald-700 bg-emerald-100 px-1.5 py-0.5 rounded">Highest</span>
                    )}
                  </div>
                </MetricRow>

                <MetricRow label="Annual Fees">
                  <div className="space-y-0.5">
                    <span className="font-bold text-xs text-slate-900 block">
                      {formatCurrency(college.feesMin)} - {formatCurrency(college.feesMax)}
                    </span>
                    {isLowestFees && (
                      <span className="text-[10px] font-bold text-emerald-700 bg-emerald-100 px-1.5 py-0.5 rounded inline-block">Most Affordable</span>
                    )}
                  </div>
                </MetricRow>

                <MetricRow label="Avg Package">
                  <div className="flex items-center gap-1.5 justify-end">
                    <span className="font-bold text-xs text-slate-900">
                      {college.avgPackage ? formatLPA(college.avgPackage) : "N/A"}
                    </span>
                    {isBestAvg && (
                      <span className="text-[10px] font-bold text-emerald-700 bg-emerald-100 px-1.5 py-0.5 rounded">Highest</span>
                    )}
                  </div>
                </MetricRow>

                <MetricRow label="Highest Package">
                  <span className="font-medium text-xs text-slate-900">
                    {college.highestPackage ? formatLPA(college.highestPackage) : "N/A"}
                  </span>
                </MetricRow>

                <MetricRow label="Placement Rate">
                  <div className="flex items-center gap-1.5 justify-end">
                    <span className="font-medium text-xs text-slate-900">
                      {college.placementRate ? `${college.placementRate}%` : "N/A"}
                    </span>
                    {isBestPlacement && (
                      <span className="text-[10px] font-bold text-emerald-700 bg-emerald-100 px-1.5 py-0.5 rounded">Top %</span>
                    )}
                  </div>
                </MetricRow>

                <MetricRow label="Established">
                  <span className="text-xs text-slate-700">{college.establishedYear}</span>
                </MetricRow>

                <MetricRow label="Affiliation">
                  <span className="text-xs text-slate-700">{college.affiliation}</span>
                </MetricRow>

                <MetricRow label="Accreditation">
                  <span className="text-xs text-slate-700">{college.accreditation || "UGC / AICTE"}</span>
                </MetricRow>

                <MetricRow label="Programs">
                  <div className="text-right">
                    <span className="font-semibold text-xs text-slate-900 block">{college.courses.length} Programs</span>
                    <ul className="space-y-0.5 text-[11px] text-slate-500 mt-0.5">
                      {college.courses.slice(0, 3).map((cr, idx) => (
                        <li key={idx} className="truncate">• {cr.name}</li>
                      ))}
                    </ul>
                  </div>
                </MetricRow>
              </div>
            </div>
          );
        })}

        {/* Add College Card (mobile) */}
        {colleges.length < 3 && (
          <button
            onClick={onOpenAddModal}
            className="flex flex-col items-center justify-center p-8 w-full rounded-xl border-2 border-dashed border-slate-300 hover:border-blue-500 hover:bg-blue-50/40 text-slate-500 hover:text-blue-600 transition-all cursor-pointer bg-white"
          >
            <Plus className="h-6 w-6 mb-1" />
            <span className="text-xs font-semibold">
              Add College ({colleges.length}/3)
            </span>
          </button>
        )}
      </div>

      {/* ── Desktop Table Layout (lg and above) ── */}
      <div className="hidden lg:block bg-white rounded-2xl border border-slate-200 shadow-2xs overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            {/* Header Row with College Names & Remove Actions */}
            <thead>
              <tr className="border-b border-slate-200 bg-slate-50/70">
                <th className="py-5 px-6 w-1/4 text-xs font-bold uppercase tracking-wider text-slate-500">
                  Evaluation Criteria
                </th>
                {colleges.map((college) => (
                  <th
                    key={college.id}
                    className="py-5 px-6 w-1/4 align-top border-l border-slate-200/80 bg-white"
                  >
                    <div className="space-y-3">
                      <div className="flex items-start justify-between gap-2">
                        <Badge
                          variant={typeVariantMap[college.type] || "default"}
                          size="sm"
                        >
                          {getCollegeTypeLabel(college.type)}
                        </Badge>
                        <button
                          onClick={() => onRemoveCollege(college.id)}
                          className="text-slate-400 hover:text-red-600 p-1 rounded-md hover:bg-red-50 transition-colors cursor-pointer"
                          title="Remove college"
                        >
                          <X className="h-4 w-4" />
                        </button>
                      </div>

                      <div>
                        <Link
                          href={`/colleges/${college.slug}`}
                          className="font-bold text-base text-slate-900 hover:text-blue-600 transition-colors line-clamp-2"
                        >
                          {college.name}
                        </Link>
                        <p className="text-xs text-slate-500 flex items-center gap-1 mt-1">
                          <MapPin className="h-3.5 w-3.5 text-slate-400 shrink-0" />
                          <span>
                            {college.city}, {college.state}
                          </span>
                        </p>
                      </div>
                    </div>
                  </th>
                ))}

                {/* Empty placeholder slot if < 3 colleges */}
                {colleges.length < 3 && (
                  <th className="py-5 px-6 w-1/4 align-middle text-center border-l border-slate-200/80 bg-slate-50/50">
                    <button
                      onClick={onOpenAddModal}
                      className="flex flex-col items-center justify-center p-6 w-full rounded-xl border-2 border-dashed border-slate-300 hover:border-blue-500 hover:bg-blue-50/40 text-slate-500 hover:text-blue-600 transition-all cursor-pointer"
                    >
                      <Plus className="h-6 w-6 mb-1" />
                      <span className="text-xs font-semibold">
                        Add College ({colleges.length}/3)
                      </span>
                    </button>
                  </th>
                )}
              </tr>
            </thead>

            <tbody className="divide-y divide-slate-100 text-sm">
              {/* Section 1: Ratings */}
              <tr className="bg-slate-50/40">
                <td
                  colSpan={colleges.length + (colleges.length < 3 ? 2 : 1)}
                  className="py-2.5 px-6 font-bold uppercase tracking-wider text-[11px] text-slate-500"
                >
                  Rating & Student Feedback
                </td>
              </tr>
              <tr>
                <td className="py-4 px-6 font-semibold text-slate-700">
                  Overall Rating
                </td>
                {colleges.map((c) => {
                  const isBest = c.rating === maxRating && maxRating > 0;
                  return (
                    <td
                      key={c.id}
                      className={`py-4 px-6 border-l border-slate-100 ${
                        isBest ? "bg-emerald-50/30 font-semibold" : ""
                      }`}
                    >
                      <div className="flex items-center gap-2">
                        <RatingStars rating={c.rating} size="sm" />
                        {isBest && (
                          <span className="text-[10px] font-bold text-emerald-700 bg-emerald-100 px-1.5 py-0.5 rounded">
                            Highest
                          </span>
                        )}
                      </div>
                    </td>
                  );
                })}
                {colleges.length < 3 && <td className="border-l border-slate-100" />}
              </tr>

              {/* Section 2: Fees */}
              <tr className="bg-slate-50/40">
                <td
                  colSpan={colleges.length + (colleges.length < 3 ? 2 : 1)}
                  className="py-2.5 px-6 font-bold uppercase tracking-wider text-[11px] text-slate-500"
                >
                  Fees & Affordability
                </td>
              </tr>
              <tr>
                <td className="py-4 px-6 font-semibold text-slate-700">
                  Annual Fees Range
                </td>
                {colleges.map((c) => {
                  const isLowest = c.feesMin === minFees;
                  return (
                    <td
                      key={c.id}
                      className={`py-4 px-6 border-l border-slate-100 ${
                        isLowest ? "bg-emerald-50/30" : ""
                      }`}
                    >
                      <div className="space-y-1">
                        <span className="font-bold text-slate-900 block">
                          {formatCurrency(c.feesMin)} - {formatCurrency(c.feesMax)}
                        </span>
                        {isLowest && (
                          <span className="text-[10px] font-bold text-emerald-700 bg-emerald-100 px-1.5 py-0.5 rounded inline-block">
                            Most Affordable
                          </span>
                        )}
                      </div>
                    </td>
                  );
                })}
                {colleges.length < 3 && <td className="border-l border-slate-100" />}
              </tr>

              {/* Section 3: Placements */}
              <tr className="bg-slate-50/40">
                <td
                  colSpan={colleges.length + (colleges.length < 3 ? 2 : 1)}
                  className="py-2.5 px-6 font-bold uppercase tracking-wider text-[11px] text-slate-500"
                >
                  Career & Placements
                </td>
              </tr>
              <tr>
                <td className="py-4 px-6 font-semibold text-slate-700">
                  Average Package
                </td>
                {colleges.map((c) => {
                  const isBest =
                    c.avgPackage &&
                    c.avgPackage === maxAvgPackage &&
                    maxAvgPackage > 0;
                  return (
                    <td
                      key={c.id}
                      className={`py-4 px-6 border-l border-slate-100 ${
                        isBest ? "bg-emerald-50/30" : ""
                      }`}
                    >
                      <div className="flex items-center gap-2">
                        <span className="font-bold text-slate-900">
                          {c.avgPackage ? formatLPA(c.avgPackage) : "N/A"}
                        </span>
                        {isBest && (
                          <span className="text-[10px] font-bold text-emerald-700 bg-emerald-100 px-1.5 py-0.5 rounded">
                            Highest Avg
                          </span>
                        )}
                      </div>
                    </td>
                  );
                })}
                {colleges.length < 3 && <td className="border-l border-slate-100" />}
              </tr>
              <tr>
                <td className="py-4 px-6 font-semibold text-slate-700">
                  Highest Package
                </td>
                {colleges.map((c) => (
                  <td key={c.id} className="py-4 px-6 border-l border-slate-100">
                    <span className="font-medium text-slate-900">
                      {c.highestPackage ? formatLPA(c.highestPackage) : "N/A"}
                    </span>
                  </td>
                ))}
                {colleges.length < 3 && <td className="border-l border-slate-100" />}
              </tr>
              <tr>
                <td className="py-4 px-6 font-semibold text-slate-700">
                  Placement Success Rate
                </td>
                {colleges.map((c) => {
                  const isBest =
                    c.placementRate &&
                    c.placementRate === maxPlacementRate &&
                    maxPlacementRate > 0;
                  return (
                    <td
                      key={c.id}
                      className={`py-4 px-6 border-l border-slate-100 ${
                        isBest ? "bg-emerald-50/30" : ""
                      }`}
                    >
                      <div className="flex items-center gap-2">
                        <span className="font-medium text-slate-900">
                          {c.placementRate ? `${c.placementRate}%` : "N/A"}
                        </span>
                        {isBest && (
                          <span className="text-[10px] font-bold text-emerald-700 bg-emerald-100 px-1.5 py-0.5 rounded">
                            Top Placement %
                          </span>
                        )}
                      </div>
                    </td>
                  );
                })}
                {colleges.length < 3 && <td className="border-l border-slate-100" />}
              </tr>

              {/* Section 4: Institution Details */}
              <tr className="bg-slate-50/40">
                <td
                  colSpan={colleges.length + (colleges.length < 3 ? 2 : 1)}
                  className="py-2.5 px-6 font-bold uppercase tracking-wider text-[11px] text-slate-500"
                >
                  Institutional Overview
                </td>
              </tr>
              <tr>
                <td className="py-4 px-6 font-semibold text-slate-700">
                  Established Year
                </td>
                {colleges.map((c) => (
                  <td key={c.id} className="py-4 px-6 border-l border-slate-100 text-slate-700">
                    {c.establishedYear}
                  </td>
                ))}
                {colleges.length < 3 && <td className="border-l border-slate-100" />}
              </tr>
              <tr>
                <td className="py-4 px-6 font-semibold text-slate-700">
                  Affiliation & Approval
                </td>
                {colleges.map((c) => (
                  <td key={c.id} className="py-4 px-6 border-l border-slate-100 text-slate-700">
                    {c.affiliation}
                  </td>
                ))}
                {colleges.length < 3 && <td className="border-l border-slate-100" />}
              </tr>
              <tr>
                <td className="py-4 px-6 font-semibold text-slate-700">
                  Accreditation
                </td>
                {colleges.map((c) => (
                  <td key={c.id} className="py-4 px-6 border-l border-slate-100 text-slate-700">
                    {c.accreditation || "UGC / AICTE"}
                  </td>
                ))}
                {colleges.length < 3 && <td className="border-l border-slate-100" />}
              </tr>
              <tr>
                <td className="py-4 px-6 font-semibold text-slate-700">
                  Offered Programs
                </td>
                {colleges.map((c) => (
                  <td key={c.id} className="py-4 px-6 border-l border-slate-100 align-top">
                    <div className="space-y-1">
                      <span className="font-semibold text-slate-900 block text-xs">
                        {c.courses.length} Programs
                      </span>
                      <ul className="space-y-1 text-xs text-slate-500">
                        {c.courses.slice(0, 3).map((cr, idx) => (
                          <li key={idx} className="truncate">
                            • {cr.name}
                          </li>
                        ))}
                      </ul>
                    </div>
                  </td>
                ))}
                {colleges.length < 3 && <td className="border-l border-slate-100" />}
              </tr>
            </tbody>
          </table>
        </div>
      </div>
    </>
  );
}
