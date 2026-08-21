import React from "react";
import Link from "next/link";
import { prisma } from "@/lib/prisma";
import {
  Compass,
  Search,
  Scale,
  Sparkles,
  Award,
  ArrowRight,
  TrendingUp,
  GraduationCap,
  Building2,
  FileCheck2,
} from "lucide-react";
import { CollegeCard } from "@/components/college/CollegeCard";
import { Button } from "@/components/ui/Button";

export const revalidate = 3600; // Cache homepage for 1 hour

export default async function HomePage() {
  // Fetch top 6 featured colleges from PostgreSQL
  const [topColleges, stats] = await Promise.all([
    prisma.college.findMany({
      orderBy: [{ rating: "desc" }, { reviewCount: "desc" }],
      take: 6,
      include: {
        courses: {
          select: { stream: true },
        },
      },
    }),
    prisma.college.aggregate({
      _count: { id: true },
      _avg: { avgPackage: true },
    }),
  ]);

  const formattedTopColleges = topColleges.map((c) => ({
    id: c.id,
    name: c.name,
    slug: c.slug,
    city: c.city,
    state: c.state,
    type: c.type,
    rating: c.rating,
    reviewCount: c.reviewCount,
    feesMin: c.feesMin,
    feesMax: c.feesMax,
    avgPackage: c.avgPackage,
    highestPackage: c.highestPackage,
    placementRate: c.placementRate,
    logoUrl: c.logoUrl,
    streams: Array.from(new Set(c.courses.map((cr) => cr.stream))),
  }));

  const totalCount = stats._count.id;
  const avgPackageOverall = stats._avg.avgPackage
    ? `${stats._avg.avgPackage.toFixed(1)} LPA`
    : "8.5 LPA";

  return (
    <div className="space-y-12 pb-16">
      {/* ─── Hero Section ────────────────────────────────────────── */}
      <section className="bg-white border-b border-slate-200 py-12 sm:py-16">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="max-w-3xl space-y-5">
            {/* Pill Badge */}
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-md bg-slate-100 border border-slate-200 text-slate-800 text-xs font-semibold">
              <Compass className="h-3.5 w-3.5 text-slate-700" />
              <span>India&apos;s College Discovery & Decision Platform</span>
            </div>

            {/* Main Headline */}
            <h1 className="text-3xl sm:text-5xl font-black text-slate-900 tracking-tight leading-[1.15]">
              Discover, compare, and decide your future college with real data.
            </h1>

            {/* Sub-headline */}
            <p className="text-base sm:text-lg text-slate-600 leading-relaxed max-w-2xl">
              Make structured admission choices based on verified tuition fee ranges, average campus placement packages, official exam cutoffs, and genuine student reviews.
            </p>

            {/* Search Bar Direct Trigger */}
            <form
              action="/colleges"
              method="GET"
              className="flex flex-col sm:flex-row items-stretch gap-2.5 pt-2 max-w-2xl"
            >
              <div className="relative flex-1">
                <Search className="h-4 w-4 absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400" />
                <input
                  type="text"
                  name="search"
                  placeholder="Search by college name, city (e.g. Pune, Bangalore), or stream..."
                  className="w-full rounded-lg border border-slate-300 bg-white py-2.5 pl-10 pr-4 text-sm text-slate-900 placeholder:text-slate-400 focus:border-slate-900 focus:outline-none focus:ring-1 focus:ring-slate-900 transition-colors"
                />
              </div>
              <Button
                type="submit"
                variant="primary"
                size="md"
                className="shrink-0 text-sm font-semibold"
                rightIcon={<ArrowRight className="h-4 w-4" />}
              >
                Explore Colleges
              </Button>
            </form>

            {/* Stream Quick Pills */}
            <div className="flex flex-wrap items-center gap-1.5 pt-1 text-xs">
              <span className="font-semibold text-slate-500 mr-1">
                Popular:
              </span>
              {[
                { label: "Engineering (B.Tech)", query: "Engineering" },
                { label: "Management (MBA)", query: "Management" },
                { label: "Medical (MBBS)", query: "Medical" },
                { label: "Computer Science", query: "Computer Science" },
                { label: "Pune Colleges", query: "Pune" },
              ].map((pill) => (
                <Link
                  key={pill.label}
                  href={`/colleges?search=${encodeURIComponent(pill.query)}`}
                  className="px-2.5 py-1 rounded-md bg-slate-50 text-slate-700 hover:bg-slate-100 font-medium transition-colors border border-slate-200"
                >
                  {pill.label}
                </Link>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* ─── Platform Metrics Bar (BizLink Analytics Style) ──────── */}
      <section className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          <div className="bg-white rounded-xl border border-slate-200 p-5 space-y-1 shadow-2xs">
            <div className="flex items-center justify-between text-slate-500 text-xs font-medium">
              <span>Indexed Colleges</span>
              <Building2 className="h-4 w-4 text-slate-400" />
            </div>
            <div className="flex items-baseline gap-2">
              <span className="text-2xl sm:text-3xl font-extrabold text-slate-900">{totalCount}+</span>
              <span className="text-xs font-semibold text-emerald-600">Verified</span>
            </div>
          </div>

          <div className="bg-white rounded-xl border border-slate-200 p-5 space-y-1 shadow-2xs">
            <div className="flex items-center justify-between text-slate-500 text-xs font-medium">
              <span>Average Package</span>
              <TrendingUp className="h-4 w-4 text-slate-400" />
            </div>
            <div className="flex items-baseline gap-2">
              <span className="text-2xl sm:text-3xl font-extrabold text-slate-900">{avgPackageOverall}</span>
              <span className="text-xs font-semibold text-emerald-600">Across Strs.</span>
            </div>
          </div>

          <div className="bg-white rounded-xl border border-slate-200 p-5 space-y-1 shadow-2xs">
            <div className="flex items-center justify-between text-slate-500 text-xs font-medium">
              <span>Academic Programs</span>
              <GraduationCap className="h-4 w-4 text-slate-400" />
            </div>
            <div className="flex items-baseline gap-2">
              <span className="text-2xl sm:text-3xl font-extrabold text-slate-900">400+</span>
              <span className="text-xs font-semibold text-slate-500">Degree paths</span>
            </div>
          </div>

          <div className="bg-white rounded-xl border border-slate-200 p-5 space-y-1 shadow-2xs">
            <div className="flex items-center justify-between text-slate-500 text-xs font-medium">
              <span>Exam Cutoff Rows</span>
              <FileCheck2 className="h-4 w-4 text-slate-400" />
            </div>
            <div className="flex items-baseline gap-2">
              <span className="text-2xl sm:text-3xl font-extrabold text-slate-900">800+</span>
              <span className="text-xs font-semibold text-slate-500">JEE & CET</span>
            </div>
          </div>
        </div>
      </section>

      {/* ─── 4 Step Decision Framework ───────────────────────────── */}
      <section className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-5">
          {/* Step 1: Discover */}
          <div className="bg-white rounded-xl border border-slate-200 p-6 space-y-3 shadow-2xs">
            <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-slate-100 text-slate-900 font-bold">
              <Compass className="h-5 w-5" />
            </div>
            <h3 className="text-base font-bold text-slate-900">
              1. Discover Institutions
            </h3>
            <p className="text-xs sm:text-sm text-slate-600 leading-relaxed">
              Filter across {totalCount}+ colleges by state, course discipline, ownership type, and fee range.
            </p>
            <Link
              href="/colleges"
              className="inline-flex items-center gap-1 text-xs font-semibold text-slate-900 hover:text-blue-600 pt-1 transition-colors"
            >
              <span>Browse All Colleges</span>
              <ArrowRight className="h-3 w-3" />
            </Link>
          </div>

          {/* Step 2: Compare */}
          <div className="bg-white rounded-xl border border-slate-200 p-6 space-y-3 shadow-2xs">
            <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-slate-100 text-slate-900 font-bold">
              <Scale className="h-5 w-5" />
            </div>
            <h3 className="text-base font-bold text-slate-900">
              2. Compare Side-by-Side
            </h3>
            <p className="text-xs sm:text-sm text-slate-600 leading-relaxed">
              Evaluate 2 to 3 colleges on tuition fees, average packages, and highest offers with automatic best-metric highlights.
            </p>
            <Link
              href="/compare"
              className="inline-flex items-center gap-1 text-xs font-semibold text-slate-900 hover:text-blue-600 pt-1 transition-colors"
            >
              <span>Open Comparison Matrix</span>
              <ArrowRight className="h-3 w-3" />
            </Link>
          </div>

          {/* Step 3: Predict */}
          <div className="bg-white rounded-xl border border-slate-200 p-6 space-y-3 shadow-2xs">
            <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-slate-100 text-slate-900 font-bold">
              <Sparkles className="h-5 w-5" />
            </div>
            <h3 className="text-base font-bold text-slate-900">
              3. Predict Admission Chances
            </h3>
            <p className="text-xs sm:text-sm text-slate-600 leading-relaxed">
              Input your JEE Main or State CET rank to receive deterministic recommendations with full score transparency.
            </p>
            <Link
              href="/predictor"
              className="inline-flex items-center gap-1 text-xs font-semibold text-slate-900 hover:text-blue-600 pt-1 transition-colors"
            >
              <span>Run Admission Predictor</span>
              <ArrowRight className="h-3 w-3" />
            </Link>
          </div>

          {/* Step 4: Scholarships */}
          <div className="bg-white rounded-xl border border-slate-200 p-6 space-y-3 shadow-2xs">
            <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-slate-100 text-slate-900 font-bold">
              <GraduationCap className="h-5 w-5" />
            </div>
            <h3 className="text-base font-bold text-slate-900">
              4. Explore Scholarships
            </h3>
            <p className="text-xs sm:text-sm text-slate-600 leading-relaxed">
              Browse 35+ government, institutional, and private scholarships with eligibility details, amounts, and direct apply links.
            </p>
            <Link
              href="/scholarships"
              className="inline-flex items-center gap-1 text-xs font-semibold text-slate-900 hover:text-blue-600 pt-1 transition-colors"
            >
              <span>Find Scholarships</span>
              <ArrowRight className="h-3 w-3" />
            </Link>
          </div>
        </div>
      </section>

      {/* ─── Featured Top Rated Colleges ─────────────────────────── */}
      <section className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 space-y-5">
        <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-3">
          <div>
            <div className="flex items-center gap-1.5 text-xs font-bold text-slate-500 uppercase tracking-wider mb-1">
              <Award className="h-4 w-4" />
              <span>Top Rated Institutions</span>
            </div>
            <h2 className="text-xl sm:text-2xl font-extrabold text-slate-900 tracking-tight">
              Featured Colleges in India
            </h2>
          </div>
          <Link
            href="/colleges"
            className="inline-flex items-center gap-1 text-xs font-semibold text-slate-900 hover:text-blue-600 transition-colors"
          >
            <span>View all {totalCount} colleges</span>
            <ArrowRight className="h-3.5 w-3.5" />
          </Link>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
          {formattedTopColleges.map((college) => (
            <CollegeCard key={college.id} college={college} />
          ))}
        </div>
      </section>
    </div>
  );
}
