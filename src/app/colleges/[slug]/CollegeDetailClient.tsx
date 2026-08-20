"use client";

import React, { useState } from "react";
import { useRouter } from "next/navigation";
import { useSession } from "next-auth/react";
import { CollegeDetail, ReviewItem } from "@/types";
import { useCompare } from "@/context/CompareContext";
import {
  MapPin,
  Building,
  Award,
  Globe,
  Plus,
  Check,
  Bookmark,
  Scale,
  GraduationCap,
  IndianRupee,
  TrendingUp,
  MessageSquare,
  ExternalLink,
} from "lucide-react";
import { Badge } from "@/components/ui/Badge";
import { Button } from "@/components/ui/Button";
import { RatingStars } from "@/components/college/RatingStars";
import { PlacementMetrics } from "@/components/college/PlacementMetrics";
import { ReviewForm } from "@/components/college/ReviewForm";
import {
  formatCurrency,
  formatLPA,
  getCollegeTypeLabel,
} from "@/lib/utils";

export interface CollegeDetailClientProps {
  college: CollegeDetail;
  initialIsSaved?: boolean;
}

export function CollegeDetailClient({
  college,
  initialIsSaved = false,
}: CollegeDetailClientProps) {
  const router = useRouter();
  const sessionRes = useSession();
  const session = sessionRes?.data;
  const { isInCompare, addToCompare, removeFromCompare, canAddMore } =
    useCompare();

  const [activeTab, setActiveTab] = useState<"overview" | "courses" | "placements" | "reviews">(
    "overview"
  );
  const [reviews, setReviews] = useState<ReviewItem[]>(college.reviews || []);
  const [isSaved, setIsSaved] = useState(initialIsSaved);
  const [isSaving, setIsSaving] = useState(false);

  const inCompare = isInCompare(college.id);

  const handleCompareToggle = () => {
    if (inCompare) {
      removeFromCompare(college.id);
    } else {
      addToCompare({
        id: college.id,
        name: college.name,
        slug: college.slug,
        city: college.city,
        state: college.state,
        type: college.type,
        rating: college.rating,
        reviewCount: college.reviewCount,
        feesMin: college.feesMin,
        feesMax: college.feesMax,
        avgPackage: college.avgPackage,
        highestPackage: college.highestPackage,
        placementRate: college.placementRate,
        logoUrl: college.logoUrl,
        streams: Array.from(new Set(college.courses.map((c) => c.stream))),
      });
    }
  };

  const handleSaveToggle = async () => {
    if (!session?.user) {
      router.push(
        "/auth/login?redirect=" + encodeURIComponent(window.location.pathname)
      );
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
    } catch (err) {
      console.error("Failed to toggle save state", err);
      setIsSaved(!nextSavedState);
    } finally {
      setIsSaving(false);
    }
  };

  const handleReviewSubmitted = (newReview: ReviewItem) => {
    setReviews((prev) => [newReview, ...prev]);
  };

  const typeVariantMap: Record<string, "government" | "private" | "deemed" | "autonomous"> = {
    GOVERNMENT: "government",
    PRIVATE: "private",
    DEEMED: "deemed",
    AUTONOMOUS: "autonomous",
  };

  return (
    <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-8 space-y-6">
      {/* Header Banner */}
      <div className="bg-white rounded-2xl border border-slate-200 p-6 sm:p-8 shadow-2xs space-y-6">
        <div className="flex flex-col lg:flex-row lg:items-start lg:justify-between gap-6">
          <div className="space-y-3 flex-1">
            {/* Badges */}
            <div className="flex flex-wrap items-center gap-2">
              <Badge
                variant={typeVariantMap[college.type] || "default"}
                size="md"
              >
                {getCollegeTypeLabel(college.type)}
              </Badge>
              {college.accreditation && (
                <Badge variant="success" size="md">
                  {college.accreditation}
                </Badge>
              )}
              <span className="text-xs text-slate-500 bg-slate-100 px-2.5 py-1 rounded-md font-medium">
                Est. {college.establishedYear}
              </span>
            </div>

            {/* Title */}
            <h1 className="text-2xl sm:text-3xl lg:text-4xl font-extrabold text-slate-900 tracking-tight">
              {college.name}
            </h1>

            {/* Location & Affiliation */}
            <div className="flex flex-wrap items-center gap-4 text-xs sm:text-sm text-slate-600">
              <div className="flex items-center gap-1.5">
                <MapPin className="h-4 w-4 text-slate-400" />
                <span>
                  {college.city}, {college.state}
                </span>
              </div>
              <div className="flex items-center gap-1.5">
                <Building className="h-4 w-4 text-slate-400" />
                <span>Affiliated to {college.affiliation}</span>
              </div>
              {college.website && (
                <a
                  href={college.website}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center gap-1 text-blue-600 hover:underline"
                >
                  <Globe className="h-3.5 w-3.5" />
                  <span>Official Website</span>
                  <ExternalLink className="h-3 w-3" />
                </a>
              )}
            </div>

            {/* Rating Stars */}
            <div className="pt-1">
              <RatingStars
                rating={college.rating}
                reviewCount={reviews.length || college.reviewCount}
                size="md"
              />
            </div>
          </div>

          {/* Action CTAs */}
          <div className="flex flex-wrap sm:flex-nowrap items-center gap-3 shrink-0">
            <Button
              variant={inCompare ? "primary" : "outline"}
              onClick={handleCompareToggle}
              disabled={!inCompare && !canAddMore}
              leftIcon={
                inCompare ? (
                  <Check className="h-4 w-4" />
                ) : (
                  <Plus className="h-4 w-4" />
                )
              }
              className="text-xs sm:text-sm"
            >
              {inCompare ? "In Comparison" : "Add to Compare"}
            </Button>

            <Button
              variant={isSaved ? "secondary" : "outline"}
              onClick={handleSaveToggle}
              isLoading={isSaving}
              leftIcon={
                <Bookmark
                  className={`h-4 w-4 ${
                    isSaved ? "fill-blue-600 text-blue-600" : ""
                  }`}
                />
              }
              className={`text-xs sm:text-sm ${
                isSaved ? "text-blue-700 bg-blue-50 border-blue-200" : ""
              }`}
            >
              {isSaved ? "Saved" : "Save College"}
            </Button>
          </div>
        </div>

        {/* Quick Highlights Strip */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 pt-6 border-t border-slate-100 text-slate-900">
          <div className="space-y-0.5">
            <span className="text-xs text-slate-500 flex items-center gap-1 font-medium">
              <IndianRupee className="h-3.5 w-3.5 text-slate-400" />
              Annual Fees Range
            </span>
            <p className="text-sm sm:text-base font-bold">
              {formatCurrency(college.feesMin)} - {formatCurrency(college.feesMax)}
            </p>
          </div>

          <div className="space-y-0.5">
            <span className="text-xs text-slate-500 flex items-center gap-1 font-medium">
              <TrendingUp className="h-3.5 w-3.5 text-emerald-600" />
              Avg Package
            </span>
            <p className="text-sm sm:text-base font-bold text-emerald-700">
              {college.avgPackage ? formatLPA(college.avgPackage) : "N/A"}
            </p>
          </div>

          <div className="space-y-0.5">
            <span className="text-xs text-slate-500 flex items-center gap-1 font-medium">
              <Award className="h-3.5 w-3.5 text-blue-600" />
              Highest Package
            </span>
            <p className="text-sm sm:text-base font-bold text-slate-900">
              {college.highestPackage ? formatLPA(college.highestPackage) : "N/A"}
            </p>
          </div>

          <div className="space-y-0.5">
            <span className="text-xs text-slate-500 flex items-center gap-1 font-medium">
              <GraduationCap className="h-3.5 w-3.5 text-indigo-600" />
              Total Courses
            </span>
            <p className="text-sm sm:text-base font-bold text-slate-900">
              {college.courses.length} Programs
            </p>
          </div>
        </div>
      </div>

      {/* Tabs Navigation */}
      <div className="border-b border-slate-200 bg-white rounded-xl px-4 shadow-2xs">
        <div className="flex space-x-6 overflow-x-auto">
          {[
            { id: "overview", label: "Overview", icon: Building },
            { id: "courses", label: `Courses & Fees (${college.courses.length})`, icon: GraduationCap },
            { id: "placements", label: "Placements", icon: TrendingUp },
            { id: "reviews", label: `Reviews (${reviews.length})`, icon: MessageSquare },
          ].map((tab) => {
            const Icon = tab.icon;
            const isActive = activeTab === tab.id;
            return (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id as "overview" | "courses" | "placements" | "reviews")}
                className={`flex items-center gap-2 py-4 text-xs sm:text-sm font-semibold border-b-2 transition-colors whitespace-nowrap cursor-pointer ${
                  isActive
                    ? "border-blue-600 text-blue-600"
                    : "border-transparent text-slate-600 hover:text-slate-900 hover:border-slate-300"
                }`}
              >
                <Icon className={`h-4 w-4 ${isActive ? "text-blue-600" : "text-slate-400"}`} />
                <span>{tab.label}</span>
              </button>
            );
          })}
        </div>
      </div>

      {/* Tab Content */}
      <div className="space-y-6">
        {/* Tab 1: Overview */}
        {activeTab === "overview" && (
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            <div className="lg:col-span-2 space-y-6">
              <div className="bg-white rounded-xl border border-slate-200 p-6 space-y-3 shadow-2xs">
                <h3 className="text-base font-bold text-slate-900">
                  About {college.name}
                </h3>
                <p className="text-sm text-slate-600 leading-relaxed whitespace-pre-line">
                  {college.description}
                </p>
              </div>

              {/* Programs Overview */}
              <div className="bg-white rounded-xl border border-slate-200 p-6 space-y-4 shadow-2xs">
                <div className="flex items-center justify-between">
                  <h3 className="text-base font-bold text-slate-900">
                    Featured Academic Programs
                  </h3>
                  <button
                    onClick={() => setActiveTab("courses")}
                    className="text-xs font-semibold text-blue-600 hover:underline"
                  >
                    View All {college.courses.length} Courses →
                  </button>
                </div>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  {college.courses.slice(0, 4).map((c) => (
                    <div
                      key={c.id}
                      className="p-3 bg-slate-50 border border-slate-200 rounded-lg space-y-1"
                    >
                      <span className="text-[11px] font-semibold text-blue-600 uppercase">
                        {c.stream}
                      </span>
                      <h4 className="text-xs font-bold text-slate-900 line-clamp-1">
                        {c.name}
                      </h4>
                      <div className="flex items-center justify-between text-xs text-slate-500 pt-1">
                        <span>{c.duration}</span>
                        <span className="font-semibold text-slate-800">
                          {formatCurrency(c.fees)}/yr
                        </span>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>

            {/* Sidebar Facts */}
            <div className="space-y-6">
              <div className="bg-white rounded-xl border border-slate-200 p-6 space-y-4 shadow-2xs">
                <h3 className="text-sm font-bold text-slate-900 uppercase tracking-wider">
                  Key Institution Facts
                </h3>
                <dl className="divide-y divide-slate-100 text-xs">
                  <div className="py-2.5 flex justify-between">
                    <dt className="text-slate-500">Established</dt>
                    <dd className="font-semibold text-slate-900">
                      {college.establishedYear}
                    </dd>
                  </div>
                  <div className="py-2.5 flex justify-between">
                    <dt className="text-slate-500">Ownership</dt>
                    <dd className="font-semibold text-slate-900">
                      {getCollegeTypeLabel(college.type)}
                    </dd>
                  </div>
                  <div className="py-2.5 flex justify-between">
                    <dt className="text-slate-500">Affiliation</dt>
                    <dd className="font-semibold text-slate-900">
                      {college.affiliation}
                    </dd>
                  </div>
                  <div className="py-2.5 flex justify-between">
                    <dt className="text-slate-500">Accreditation</dt>
                    <dd className="font-semibold text-slate-900">
                      {college.accreditation || "UGC Approved"}
                    </dd>
                  </div>
                  <div className="py-2.5 flex justify-between">
                    <dt className="text-slate-500">Location</dt>
                    <dd className="font-semibold text-slate-900">
                      {college.city}, {college.state}
                    </dd>
                  </div>
                </dl>
              </div>

              {/* Compare Quick CTA */}
              <div className="bg-blue-50/70 border border-blue-200/80 rounded-xl p-5 space-y-2">
                <div className="flex items-center gap-2 text-xs font-bold text-blue-900">
                  <Scale className="h-4 w-4 text-blue-600" />
                  <span>Compare with other colleges</span>
                </div>
                <p className="text-xs text-blue-700">
                  Add {college.name} to your comparison tray to evaluate fees, placements, and ratings side-by-side.
                </p>
                <Button
                  size="sm"
                  variant="primary"
                  onClick={handleCompareToggle}
                  className="w-full mt-2"
                >
                  {inCompare ? "Remove from Compare" : "Add to Comparison"}
                </Button>
              </div>
            </div>
          </div>
        )}

        {/* Tab 2: Courses & Fees */}
        {activeTab === "courses" && (
          <div className="bg-white rounded-xl border border-slate-200 shadow-2xs overflow-hidden">
            <div className="p-6 border-b border-slate-200">
              <h3 className="text-base font-bold text-slate-900">
                Courses Offered & Fee Structure
              </h3>
              <p className="text-xs text-slate-500 mt-1">
                Annual tuition and eligibility requirements for undergraduate and postgraduate courses.
              </p>
            </div>

            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs sm:text-sm">
                <thead className="bg-slate-50 border-b border-slate-200 text-slate-600 font-semibold uppercase text-[11px] tracking-wider">
                  <tr>
                    <th className="py-3.5 px-5">Course Name</th>
                    <th className="py-3.5 px-5">Stream</th>
                    <th className="py-3.5 px-5">Duration</th>
                    <th className="py-3.5 px-5">Annual Fees</th>
                    <th className="py-3.5 px-5">Eligibility Criteria</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100">
                  {college.courses.map((course) => (
                    <tr key={course.id} className="hover:bg-slate-50/80 transition-colors">
                      <td className="py-3.5 px-5 font-semibold text-slate-900">
                        {course.name}
                      </td>
                      <td className="py-3.5 px-5">
                        <span className="bg-slate-100 text-slate-700 px-2 py-0.5 rounded text-[11px] font-medium">
                          {course.stream}
                        </span>
                      </td>
                      <td className="py-3.5 px-5 text-slate-600">
                        {course.duration}
                      </td>
                      <td className="py-3.5 px-5 font-bold text-slate-900">
                        {formatCurrency(course.fees)}
                      </td>
                      <td className="py-3.5 px-5 text-slate-600">
                        {course.eligibility || "10+2 with relevant subjects"}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {/* Tab 3: Placements */}
        {activeTab === "placements" && (
          <div className="space-y-6">
            <PlacementMetrics
              avgPackage={college.avgPackage}
              highestPackage={college.highestPackage}
              placementRate={college.placementRate}
            />
          </div>
        )}

        {/* Tab 4: Reviews */}
        {activeTab === "reviews" && (
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            {/* Reviews List */}
            <div className="lg:col-span-2 space-y-4">
              <div className="bg-white rounded-xl border border-slate-200 p-6 shadow-2xs flex items-center justify-between">
                <div>
                  <h3 className="text-base font-bold text-slate-900">
                    Student Reviews
                  </h3>
                  <p className="text-xs text-slate-500 mt-0.5">
                    Based on {reviews.length} authentic student feedback submissions.
                  </p>
                </div>
                <div className="text-right">
                  <div className="text-2xl font-black text-slate-900">
                    {college.rating.toFixed(1)}
                  </div>
                  <RatingStars rating={college.rating} showScore={false} size="sm" />
                </div>
              </div>

              {reviews.length === 0 ? (
                <div className="bg-white rounded-xl border border-slate-200 p-8 text-center text-slate-500 text-sm">
                  No reviews submitted yet. Be the first student to review {college.name}!
                </div>
              ) : (
                reviews.map((rev) => (
                  <div
                    key={rev.id}
                    className="bg-white rounded-xl border border-slate-200 p-5 space-y-2 shadow-2xs"
                  >
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        <div className="flex h-7 w-7 items-center justify-center rounded-full bg-blue-100 text-blue-700 text-xs font-bold">
                          {rev.user.name ? rev.user.name[0].toUpperCase() : "S"}
                        </div>
                        <span className="text-xs font-semibold text-slate-900">
                          {rev.user.name}
                        </span>
                      </div>
                      <RatingStars rating={rev.rating} showScore={false} size="sm" />
                    </div>
                    <h4 className="text-sm font-bold text-slate-900">{rev.title}</h4>
                    <p className="text-xs text-slate-600 leading-relaxed">
                      {rev.comment}
                    </p>
                    <span className="text-[11px] text-slate-400 block pt-1">
                      {new Date(rev.createdAt).toLocaleDateString("en-IN", {
                        day: "numeric",
                        month: "short",
                        year: "numeric",
                      })}
                    </span>
                  </div>
                ))
              )}
            </div>

            {/* Submit Review Form */}
            <div className="space-y-6">
              <ReviewForm
                collegeId={college.id}
                onReviewSubmitted={handleReviewSubmitted}
              />
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
