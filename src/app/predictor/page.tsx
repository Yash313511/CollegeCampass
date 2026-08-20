"use client";

import React, { useState } from "react";
import { PredictionResult } from "@/types";
import { PredictionCard } from "@/components/predictor/PredictionCard";
import {
  Sparkles,
  RotateCcw,
  Sliders,
  CheckCircle,
  HelpCircle,
  Zap,
} from "lucide-react";
import { Button } from "@/components/ui/Button";
import { Input } from "@/components/ui/Input";
import { Select } from "@/components/ui/Select";
import { EmptyState } from "@/components/ui/EmptyState";
import { ErrorState } from "@/components/ui/ErrorState";

export default function PredictorPage() {
  const [exam, setExam] = useState("JEE Main");
  const [rank, setRank] = useState<number | "">(8500);
  const [category, setCategory] = useState("General");
  const [course, setCourse] = useState("Computer Science");
  const [state, setState] = useState("");
  const [maxFees, setMaxFees] = useState("");

  const [results, setResults] = useState<PredictionResult[]>([]);
  const [isPredicting, setIsPredicting] = useState(false);
  const [hasRun, setHasRun] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handlePredict = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!rank || Number(rank) <= 0) {
      setError("Please enter a valid entrance rank.");
      return;
    }

    setIsPredicting(true);
    setError(null);

    try {
      const res = await fetch("/api/predict", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          exam,
          rank: Number(rank),
          category,
          course,
          state: state || undefined,
          maxFees: maxFees ? Number(maxFees) : undefined,
        }),
      });

      if (!res.ok) {
        const json = await res.json();
        throw new Error(json.error || "Failed to generate predictions");
      }

      const json = await res.json();
      setResults(json.data || []);
      setHasRun(true);
    } catch (err: unknown) {
      console.error("Predictor error:", err);
      const message = err instanceof Error ? err.message : "Something went wrong while predicting";
      setError(message);
    } finally {
      setIsPredicting(false);
    }
  };

  const handleReset = () => {
    setExam("JEE Main");
    setRank(8500);
    setCategory("General");
    setCourse("Computer Science");
    setState("");
    setMaxFees("");
    setResults([]);
    setHasRun(false);
    setError(null);
  };

  return (
    <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-8 space-y-8">
      {/* Header */}
      <div className="space-y-1.5 text-center max-w-2xl mx-auto">
        <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-md bg-slate-100 border border-slate-200 text-slate-800 text-xs font-semibold">
          <Sparkles className="h-3.5 w-3.5 text-slate-700" />
          <span>Explainable Admission Predictor</span>
        </div>
        <h1 className="text-2xl sm:text-4xl font-extrabold text-slate-900 tracking-tight">
          College Admission Predictor
        </h1>
        <p className="text-sm text-slate-500">
          Enter your entrance exam rank and preferences. Our database evaluates previous cutoff closing ranks, stream availability, and location compatibility.
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        {/* Left Column: Form Card */}
        <div className="lg:col-span-5 bg-white rounded-2xl border border-slate-200 p-6 shadow-2xs space-y-5 sticky top-20">
          <div className="flex items-center justify-between pb-3 border-b border-slate-100">
            <h2 className="text-sm font-bold text-slate-900 flex items-center gap-2">
              <Sliders className="h-4 w-4 text-slate-700" />
              <span>Candidate Parameters</span>
            </h2>
            <button
              onClick={handleReset}
              className="text-xs text-slate-500 hover:text-blue-600 flex items-center gap-1 cursor-pointer"
            >
              <RotateCcw className="h-3 w-3" />
              <span>Reset</span>
            </button>
          </div>

          <form onSubmit={handlePredict} className="space-y-4">
            {/* Exam Selector */}
            <Select
              label="Entrance Exam"
              value={exam}
              onChange={(e) => setExam(e.target.value)}
              options={[
                { value: "JEE Main", label: "JEE Main (All India / State)" },
                { value: "MHT-CET", label: "MHT-CET (Maharashtra)" },
                { value: "KCET", label: "KCET (Karnataka)" },
                { value: "AP EAMCET", label: "AP EAMCET (Andhra / Telangana)" },
                { value: "WBJEE", label: "WBJEE (West Bengal)" },
                { value: "COMEDK", label: "COMEDK (Private Engineering)" },
              ]}
            />

            {/* Rank Input */}
            <Input
              label="Your All India / State Rank"
              type="number"
              min={1}
              max={500000}
              value={rank}
              onChange={(e) =>
                setRank(e.target.value === "" ? "" : Number(e.target.value))
              }
              placeholder="e.g. 8500"
              helperText="Enter your achieved or expected merit rank"
              required
            />

            {/* Category */}
            <Select
              label="Admission Category / Quota"
              value={category}
              onChange={(e) => setCategory(e.target.value)}
              options={[
                { value: "General", label: "General / Open" },
                { value: "OBC", label: "OBC (Other Backward Classes)" },
                { value: "SC", label: "SC (Scheduled Caste)" },
                { value: "ST", label: "ST (Scheduled Tribe)" },
                { value: "EWS", label: "EWS (Economically Weaker Section)" },
              ]}
            />

            {/* Preferred Course */}
            <Select
              label="Desired Discipline / Stream"
              value={course}
              onChange={(e) => setCourse(e.target.value)}
              options={[
                { value: "Computer Science", label: "Computer Science & Engineering (CSE)" },
                { value: "Electronics", label: "Electronics & Communication (ECE)" },
                { value: "Artificial Intelligence", label: "AI & Data Science" },
                { value: "Information Technology", label: "Information Technology (IT)" },
                { value: "Mechanical", label: "Mechanical Engineering" },
                { value: "Civil", label: "Civil Engineering" },
                { value: "MBA", label: "Management (MBA)" },
                { value: "Medical", label: "Medical / MBBS" },
              ]}
            />

            {/* Preferred State */}
            <Select
              label="Preferred State (Optional)"
              value={state}
              onChange={(e) => setState(e.target.value)}
              options={[
                { value: "", label: "All India (Any State)" },
                { value: "Maharashtra", label: "Maharashtra" },
                { value: "Karnataka", label: "Karnataka" },
                { value: "Tamil Nadu", label: "Tamil Nadu" },
                { value: "Delhi", label: "Delhi NCR" },
                { value: "Uttar Pradesh", label: "Uttar Pradesh" },
                { value: "Telangana", label: "Telangana" },
                { value: "Gujarat", label: "Gujarat" },
                { value: "Rajasthan", label: "Rajasthan" },
                { value: "West Bengal", label: "West Bengal" },
              ]}
            />

            {/* Max Annual Fees */}
            <Select
              label="Maximum Annual Fees Budget (Optional)"
              value={maxFees}
              onChange={(e) => setMaxFees(e.target.value)}
              options={[
                { value: "", label: "No Budget Limit" },
                { value: "100000", label: "Under ₹1 Lakh / year" },
                { value: "200000", label: "Under ₹2 Lakhs / year" },
                { value: "400000", label: "Under ₹4 Lakhs / year" },
                { value: "800000", label: "Under ₹8 Lakhs / year" },
              ]}
            />

            <Button
              type="submit"
              variant="primary"
              isLoading={isPredicting}
              className="w-full justify-center text-sm py-2.5"
              leftIcon={<Zap className="h-4 w-4" />}
            >
              Predict Colleges
            </Button>
          </form>

          {/* Algorithm Transparency Card */}
          <div className="bg-slate-50 border border-slate-200 rounded-xl p-4 space-y-2 text-xs text-slate-600">
            <h4 className="font-bold text-slate-900 uppercase tracking-wider text-[11px] flex items-center gap-1.5">
              <HelpCircle className="h-3.5 w-3.5 text-blue-600" />
              <span>How Predictor Works</span>
            </h4>
            <p className="text-[11px] text-slate-500 leading-relaxed">
              Calculates deterministic match scores using weighted evaluation: <strong>Rank Cutoff (40%)</strong>, <strong>Course Availability (25%)</strong>, <strong>Location (15%)</strong>, <strong>Fees (10%)</strong>, and <strong>Rating (10%)</strong>.
            </p>
          </div>
        </div>

        {/* Right Column: Results Stream */}
        <div className="lg:col-span-7 space-y-4">
          {error && (
            <ErrorState
              title="Prediction Failed"
              message={error}
              onRetry={() => {
                setError(null);
                const fakeEvent = { preventDefault: () => {} } as React.FormEvent;
                handlePredict(fakeEvent);
              }}
            />
          )}

          {!hasRun && !error && (
            <div className="bg-white rounded-2xl border border-slate-200 p-10 sm:p-14 text-center space-y-4 shadow-2xs">
              <div className="flex h-14 w-14 items-center justify-center rounded-full bg-blue-50 text-blue-600 mx-auto">
                <Sparkles className="h-7 w-7" />
              </div>
              <h3 className="text-lg font-bold text-slate-900">
                Ready to Find Your Best-Fit Colleges
              </h3>
              <p className="text-xs sm:text-sm text-slate-500 max-w-md mx-auto leading-relaxed">
                Fill in your entrance exam rank and preferences on the left to see instant, explainable recommendations sorted by match percentage.
              </p>
              <div className="flex items-center justify-center gap-6 pt-3 text-xs text-slate-600 font-medium">
                <span className="flex items-center gap-1.5">
                  <CheckCircle className="h-4 w-4 text-emerald-600" />
                  Cutoff Database
                </span>
                <span className="flex items-center gap-1.5">
                  <CheckCircle className="h-4 w-4 text-emerald-600" />
                  Transparent Scoring
                </span>
                <span className="flex items-center gap-1.5">
                  <CheckCircle className="h-4 w-4 text-emerald-600" />
                  Zero Black-Box
                </span>
              </div>
            </div>
          )}

          {hasRun && !error && results.length === 0 && (
            <EmptyState
              title="No recommendations for this rank & criteria"
              description="Your specified rank and strict filters did not match any current institutions. Try broadening your location or fee filters."
              actionLabel="Broaden Criteria"
              onAction={() => {
                setState("");
                setMaxFees("");
              }}
            />
          )}

          {hasRun && !error && results.length > 0 && (
            <div className="space-y-4">
              <div className="flex items-center justify-between text-xs text-slate-600 font-medium px-1">
                <span>
                  Found <strong>{results.length} recommended institutions</strong> matching rank {rank} ({exam})
                </span>
              </div>

              <div className="space-y-4">
                {results.map((item, idx) => (
                  <PredictionCard
                    key={item.college.id}
                    prediction={item}
                    rankIndex={idx + 1}
                  />
                ))}
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
