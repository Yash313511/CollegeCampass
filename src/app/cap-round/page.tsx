"use client";

import React, { useState, useCallback, useMemo } from "react";
import {
  FileText, Search, SlidersHorizontal, Star, Building2,
  ChevronUp, ChevronDown, Trash2, Plus, Check, X, Download,
  AlertCircle, GraduationCap, RotateCcw, BookOpen, Banknote,
  TrendingUp, MapPin, Shield, Sparkles, Info, ArrowUpDown, Save,
  ChevronRight, Zap, Target, Flame, CheckCircle2, Award, ListFilter,
  BarChart3, HelpCircle, Trophy, UserCheck, Layers, ArrowRight,
  Sliders, Compass
} from "lucide-react";
import { Button } from "@/components/ui/Button";
import { Badge } from "@/components/ui/Badge";
import { CapCollegeItem, CapCourseItem, CapPreferenceChoice, AdmissionChance } from "@/types/cap";
import { PUNE_CAP_COLLEGES, calculateCapChance, getApplicableCutoff, generateAutoCollegeList } from "@/lib/cap-data";

// ─── Constants ────────────────────────────────────────────────────────────────

const CATEGORIES = [
  { value: "GOPEN", label: "GOPEN – General / Open (Male)" },
  { value: "LOPEN", label: "LOPEN – Open (Ladies / Female)" },
  { value: "GOBC", label: "GOBC – Other Backward Class (Male)" },
  { value: "LOBC", label: "LOBC – Other Backward Class (Ladies)" },
  { value: "GSC", label: "GSC – Scheduled Caste (Male)" },
  { value: "LSC", label: "LSC – Scheduled Caste (Ladies)" },
  { value: "GST", label: "GST – Scheduled Tribe (Male)" },
  { value: "LST", label: "LST – Scheduled Tribe (Ladies)" },
  { value: "GVJ", label: "GVJ – Vimukta Jati (VJ / DT-A)" },
  { value: "GNT1", label: "GNT1 – Nomadic Tribe NT-1 (NT-B)" },
  { value: "GNT2", label: "GNT2 – Nomadic Tribe NT-2 (NT-C)" },
  { value: "GNT3", label: "GNT3 – Nomadic Tribe NT-3 (NT-D)" },
  { value: "EWS", label: "EWS – Economically Weaker Section" },
  { value: "TFWS", label: "TFWS – Tuition Fee Waiver Scheme" },
  { value: "AI", label: "AI – All India Quota (JEE Main Merit)" },
];

const BRANCHES = [
  { value: "", label: "All Engineering Branches" },
  { value: "Computer", label: "Computer Engineering / Tech" },
  { value: "Information Technology", label: "Information Technology (IT)" },
  { value: "Artificial Intelligence", label: "AI & Data Science / AIML" },
  { value: "Electronics", label: "Electronics & Telecommunication (E&TC)" },
  { value: "Mechanical", label: "Mechanical Engineering" },
  { value: "Civil", label: "Civil Engineering" },
  { value: "Electrical", label: "Electrical Engineering" },
  { value: "Chemical", label: "Chemical Engineering" },
];

const COLLEGE_TYPES = [
  { value: "", label: "All Institute Types" },
  { value: "Government", label: "Government / University Dept" },
  { value: "Autonomous", label: "Unaided Autonomous" },
  { value: "Unaided", label: "Unaided Private Colleges" },
  { value: "Women", label: "Women-Only Colleges" },
];

const MAX_FEES = [
  { value: "", label: "Any Annual Fees" },
  { value: "50000", label: "Under ₹50,000 / year (Govt)" },
  { value: "120000", label: "Under ₹1.2 Lakh / year" },
  { value: "160000", label: "Under ₹1.6 Lakh / year" },
  { value: "220000", label: "Under ₹2.2 Lakhs / year" },
  { value: "350000", label: "Under ₹3.5 Lakhs / year" },
];

// ─── Score Conversion Helpers ─────────────────────────────────────────────────

export function marksToPercentile(marks: number): number {
  if (marks >= 180) return Math.min(99.99, +(99.80 + ((marks - 180) / 20) * 0.19).toFixed(2));
  if (marks >= 165) return +(99.00 + ((marks - 165) / 15) * 0.80).toFixed(2);
  if (marks >= 150) return +(98.00 + ((marks - 150) / 15) * 1.00).toFixed(2);
  if (marks >= 135) return +(96.00 + ((marks - 135) / 15) * 2.00).toFixed(2);
  if (marks >= 120) return +(93.00 + ((marks - 120) / 15) * 3.00).toFixed(2);
  if (marks >= 105) return +(88.00 + ((marks - 105) / 15) * 5.00).toFixed(2);
  if (marks >= 90) return +(80.00 + ((marks - 90) / 15) * 8.00).toFixed(2);
  if (marks >= 75) return +(70.00 + ((marks - 75) / 15) * 10.00).toFixed(2);
  if (marks >= 60) return +(55.00 + ((marks - 60) / 15) * 15.00).toFixed(2);
  if (marks >= 45) return +(38.00 + ((marks - 45) / 15) * 17.00).toFixed(2);
  return +(Math.max(10, (marks / 45) * 38)).toFixed(2);
}

export function rankToPercentile(rank: number, total = 145000): number {
  if (rank <= 1) return 99.99;
  const p = 100 - (rank / total) * 100;
  return +Math.max(5, Math.min(99.99, p)).toFixed(2);
}

// ─── Helper Badges ────────────────────────────────────────────────────────────

function ChanceBadge({ chance }: { chance: AdmissionChance }) {
  if (chance === "Safe") {
    return (
      <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[11px] font-bold bg-emerald-50 text-emerald-700 border border-emerald-200">
        <CheckCircle2 className="w-3 h-3 text-emerald-600" /> High Chance
      </span>
    );
  }
  if (chance === "Target") {
    return (
      <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[11px] font-bold bg-amber-50 text-amber-700 border border-amber-200">
        <Target className="w-3 h-3 text-amber-600" /> Best Fit
      </span>
    );
  }
  if (chance === "Dream") {
    return (
      <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[11px] font-bold bg-purple-50 text-purple-700 border border-purple-200">
        <Sparkles className="w-3 h-3 text-purple-600" /> Ambitious
      </span>
    );
  }
  return (
    <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[11px] font-bold bg-slate-100 text-slate-600 border border-slate-200">
      ⚠ Reach
    </span>
  );
}

function CollegeTypeBadge({ status }: { status: string }) {
  const s = status.toLowerCase();
  if (s.includes("government") || s.includes("university dept"))
    return <span className="inline-flex items-center px-2 py-0.5 rounded-md text-[10px] font-bold bg-blue-50 text-blue-700 border border-blue-200">Govt / Autonomous</span>;
  if (s.includes("women"))
    return <span className="inline-flex items-center px-2 py-0.5 rounded-md text-[10px] font-bold bg-pink-50 text-pink-700 border border-pink-200">Women Only</span>;
  if (s.includes("autonomous"))
    return <span className="inline-flex items-center px-2 py-0.5 rounded-md text-[10px] font-bold bg-indigo-50 text-indigo-700 border border-indigo-200">Autonomous</span>;
  return <span className="inline-flex items-center px-2 py-0.5 rounded-md text-[10px] font-bold bg-slate-100 text-slate-700 border border-slate-200">Unaided</span>;
}

function formatFees(fees: number) {
  if (!fees) return "N/A";
  if (fees < 100000) return `₹${(fees / 1000).toFixed(0)}K/yr`;
  return `₹${(fees / 100000).toFixed(2)}L/yr`;
}

// ─── PDF Export Modal ─────────────────────────────────────────────────────────

function PdfModal({
  isOpen,
  onClose,
  items,
  percentile,
  category,
  quota,
  initialName,
}: {
  isOpen: boolean;
  onClose: () => void;
  items: CapPreferenceChoice[];
  percentile: number;
  category: string;
  quota: string;
  initialName?: string;
}) {
  const [name, setName] = useState(initialName || "");
  const [appId, setAppId] = useState("");
  const [cetRoll, setCetRoll] = useState("");
  const [round, setRound] = useState("CAP Round 1");
  const [homeUni, setHomeUni] = useState(quota === "HU" ? "SPPU (Pune University)" : quota === "OHU" ? "Other Than Home Univ." : "All India Merit");
  const [generating, setGenerating] = useState(false);

  const handleGenerate = async () => {
    if (!name.trim()) return;
    setGenerating(true);
    try {
      const { generateCapPreferencePdf } = await import("@/lib/pdf-export");
      generateCapPreferencePdf({
        candidateName: name,
        applicationId: appId || undefined,
        cetRollNo: cetRoll || undefined,
        category,
        percentile,
        homeUniversity: homeUni,
        round,
        items,
      });
    } catch (e) {
      console.error("PDF generation failed:", e);
    } finally {
      setGenerating(false);
      onClose();
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      <div className="absolute inset-0 bg-slate-900/60 backdrop-blur-xs" onClick={onClose} />
      <div className="relative bg-white rounded-2xl shadow-2xl w-full max-w-md p-6 space-y-4 z-10 border border-slate-200">
        <div className="flex items-center justify-between border-b border-slate-100 pb-3">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-blue-600 flex items-center justify-center shadow-xs">
              <Download className="w-5 h-5 text-white" />
            </div>
            <div>
              <h3 className="text-base font-bold text-slate-900">Export CAP Preference Sheet</h3>
              <p className="text-xs text-slate-500">{items.length} choices in official priority order</p>
            </div>
          </div>
          <button onClick={onClose} className="p-1 rounded-lg text-slate-400 hover:text-slate-600 hover:bg-slate-100 transition-colors">
            <X className="w-5 h-5" />
          </button>
        </div>

        <div className="space-y-3">
          <div>
            <label className="block text-xs font-semibold text-slate-700 mb-1">Candidate Full Name *</label>
            <input
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="e.g. Aditya Deshmukh"
              className="w-full text-sm px-3.5 py-2.5 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">CET Application No.</label>
              <input
                value={appId}
                onChange={(e) => setAppId(e.target.value)}
                placeholder="e.g. EN25109482"
                className="w-full text-sm px-3.5 py-2 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>
            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">MHT-CET Roll No.</label>
              <input
                value={cetRoll}
                onChange={(e) => setCetRoll(e.target.value)}
                placeholder="e.g. 24089201"
                className="w-full text-sm px-3.5 py-2 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">Admission Round</label>
              <select
                value={round}
                onChange={(e) => setRound(e.target.value)}
                className="w-full text-sm px-3 py-2 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500"
              >
                <option>CAP Round 1</option>
                <option>CAP Round 2</option>
                <option>CAP Round 3</option>
              </select>
            </div>
            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">Home University</label>
              <select
                value={homeUni}
                onChange={(e) => setHomeUni(e.target.value)}
                className="w-full text-sm px-3 py-2 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500"
              >
                <option>SPPU (Pune University)</option>
                <option>Mumbai University</option>
                <option>DBATU Lonere</option>
                <option>RTM Nagpur University</option>
                <option>SRTMU Nanded</option>
                <option>All India Merit Seat</option>
              </select>
            </div>
          </div>
        </div>

        <div className="bg-blue-50/90 border border-blue-200 rounded-xl p-3 text-xs text-blue-900 flex gap-2">
          <Info className="w-4 h-4 mt-0.5 shrink-0 text-blue-600" />
          <span>Generates an official-styled preference sheet displaying 9-digit choice codes, institute names, past cutoffs, and chance tags.</span>
        </div>

        <div className="flex gap-3 pt-2">
          <Button variant="outline" onClick={onClose} className="flex-1">Cancel</Button>
          <Button
            variant="primary"
            onClick={handleGenerate}
            isLoading={generating}
            disabled={!name.trim()}
            className="flex-1 justify-center shadow-md bg-blue-600 hover:bg-blue-700"
            leftIcon={<Download className="w-4 h-4" />}
          >
            Download PDF
          </Button>
        </div>
      </div>
    </div>
  );
}

// ─── Main Preference List Sidebar / Panel ─────────────────────────────────────

function PreferenceListPanel({
  items,
  onRemove,
  onMoveUp,
  onMoveDown,
  onClear,
  onExportPdf,
  onOneClickDownloadTop20,
  isDownloadingTop20,
  percentile,
  category,
}: {
  items: CapPreferenceChoice[];
  onRemove: (choiceCode: string) => void;
  onMoveUp: (idx: number) => void;
  onMoveDown: (idx: number) => void;
  onClear: () => void;
  onExportPdf: () => void;
  onOneClickDownloadTop20: () => void;
  isDownloadingTop20: boolean;
  percentile: number;
  category: string;
}) {
  const safeCount = items.filter((i) => i.chance === "Safe").length;
  const targetCount = items.filter((i) => i.chance === "Target").length;
  const dreamCount = items.filter((i) => i.chance === "Dream" || i.chance === "Reach").length;

  return (
    <div className="bg-white rounded-2xl border border-slate-200 shadow-sm flex flex-col h-full max-h-[85vh]">
      {/* Header */}
      <div className="p-4 border-b border-slate-100">
        <div className="flex items-center justify-between mb-3">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-lg bg-blue-600 flex items-center justify-center text-white shadow-xs">
              <BookOpen className="w-4 h-4" />
            </div>
            <div>
              <h2 className="text-sm font-bold text-slate-900">My Preference Form</h2>
              <p className="text-xs text-slate-500">{items.length} choices selected</p>
            </div>
          </div>
          {items.length > 0 && (
            <button
              onClick={onClear}
              className="text-xs font-semibold text-rose-500 hover:text-rose-700 flex items-center gap-1 transition-colors px-2 py-1 rounded hover:bg-rose-50"
            >
              <Trash2 className="w-3.5 h-3.5" /> Clear All
            </button>
          )}
        </div>

        {/* Stats Row */}
        {items.length > 0 && (
          <div className="grid grid-cols-3 gap-2">
            <div className="rounded-lg bg-purple-50 border border-purple-100 p-1.5 text-center">
              <div className="text-sm font-black text-purple-700">{dreamCount}</div>
              <div className="text-[9px] text-purple-600 font-semibold uppercase tracking-wider">Dream</div>
            </div>
            <div className="rounded-lg bg-amber-50 border border-amber-100 p-1.5 text-center">
              <div className="text-sm font-black text-amber-700">{targetCount}</div>
              <div className="text-[9px] text-amber-600 font-semibold uppercase tracking-wider">Target</div>
            </div>
            <div className="rounded-lg bg-emerald-50 border border-emerald-100 p-1.5 text-center">
              <div className="text-sm font-black text-emerald-700">{safeCount}</div>
              <div className="text-[9px] text-emerald-600 font-semibold uppercase tracking-wider">Safe</div>
            </div>
          </div>
        )}
      </div>

      {/* Choice Items List */}
      <div className="flex-1 overflow-y-auto p-3 space-y-2">
        {items.length === 0 ? (
          <div className="text-center py-10 px-4 text-slate-400">
            <div className="w-12 h-12 rounded-full bg-slate-100 flex items-center justify-center mx-auto mb-3 text-slate-400">
              <BookOpen className="w-6 h-6" />
            </div>
            <p className="text-sm font-semibold text-slate-700">Option form is empty</p>
            <p className="text-xs text-slate-500 mt-1 max-w-xs mx-auto">
              Add individual colleges or click the button below to load the Top 20 best colleges instantly.
            </p>
            <button
              onClick={onOneClickDownloadTop20}
              disabled={isDownloadingTop20}
              className="mt-4 px-4 py-2 bg-gradient-to-r from-amber-500 to-orange-500 hover:from-amber-600 hover:to-orange-600 text-white rounded-xl text-xs font-bold shadow-sm transition-all flex items-center gap-1.5 mx-auto active:scale-95"
            >
              <Zap className="w-3.5 h-3.5 fill-current" /> Load Top 20 Choices
            </button>
          </div>
        ) : (
          items.map((item, idx) => (
            <div
              key={item.choiceCode}
              className="group flex items-start gap-2.5 p-2.5 rounded-xl border border-slate-100 hover:border-blue-200 hover:bg-blue-50/20 transition-all bg-white shadow-2xs"
            >
              {/* Order Number */}
              <div className="shrink-0 w-6 h-6 rounded-md bg-slate-900 text-white text-xs font-black flex items-center justify-center shadow-xs">
                {idx + 1}
              </div>

              {/* College & Course Info */}
              <div className="flex-1 min-w-0">
                <p className="text-xs font-bold text-slate-900 truncate leading-snug">{item.collegeName}</p>
                <p className="text-[11px] text-slate-600 truncate">{item.courseName}</p>
                <div className="flex items-center gap-2 mt-1">
                  <span className="text-[10px] font-mono font-medium text-slate-400 bg-slate-100 px-1.5 py-0.5 rounded">
                    {item.choiceCode}
                  </span>
                  <span className="text-[10px] font-semibold text-slate-600">
                    Cutoff: {item.cutoffPercentile?.toFixed(2)}%
                  </span>
                </div>
              </div>

              {/* Controls */}
              <div className="flex flex-col gap-1 items-center">
                <div className="flex items-center gap-0.5">
                  <button
                    disabled={idx === 0}
                    onClick={() => onMoveUp(idx)}
                    className="p-1 rounded text-slate-400 hover:text-blue-600 hover:bg-blue-50 disabled:opacity-20 disabled:hover:bg-transparent transition-colors"
                    title="Move higher in preference"
                  >
                    <ChevronUp className="w-3.5 h-3.5" />
                  </button>
                  <button
                    disabled={idx === items.length - 1}
                    onClick={() => onMoveDown(idx)}
                    className="p-1 rounded text-slate-400 hover:text-blue-600 hover:bg-blue-50 disabled:opacity-20 disabled:hover:bg-transparent transition-colors"
                    title="Move lower in preference"
                  >
                    <ChevronDown className="w-3.5 h-3.5" />
                  </button>
                </div>
                <button
                  onClick={() => onRemove(item.choiceCode)}
                  className="p-1 rounded text-slate-400 hover:text-rose-600 hover:bg-rose-50 transition-colors"
                  title="Remove from list"
                >
                  <X className="w-3.5 h-3.5" />
                </button>
              </div>
            </div>
          ))
        )}
      </div>

      {/* Footer / Export */}
      <div className="p-3 border-t border-slate-100 bg-slate-50/50 rounded-b-2xl space-y-2">
        <Button
          variant="primary"
          onClick={onExportPdf}
          disabled={items.length === 0}
          className="w-full justify-center text-sm py-2.5 font-bold shadow-sm bg-blue-600 hover:bg-blue-700"
          leftIcon={<Download className="w-4 h-4" />}
        >
          Export Preference PDF
        </Button>
        <button
          onClick={onOneClickDownloadTop20}
          disabled={isDownloadingTop20}
          className="w-full py-2 px-3 bg-gradient-to-r from-amber-500 to-orange-500 hover:from-amber-600 hover:to-orange-600 text-white rounded-xl text-xs font-bold shadow-xs transition-all flex items-center justify-center gap-1.5 active:scale-95"
        >
          <Zap className="w-3.5 h-3.5 fill-current" /> 1-Click Top 20 PDF
        </button>
      </div>
    </div>
  );
}

// ─── Main CAP Round Page Component ───────────────────────────────────────────

export default function CapRoundPage() {
  // Input score state
  const [scoreMode, setScoreMode] = useState<"percentile" | "marks" | "rank">("percentile");
  const [rawScore, setRawScore] = useState<string>("92.50");
  const [candidateName, setCandidateName] = useState<string>("");
  const [category, setCategory] = useState("GOPEN");
  const [quota, setQuota] = useState<"HU" | "OHU" | "AI">("HU");
  const [branchFilter, setBranchFilter] = useState("");
  const [collegeTypeFilter, setCollegeTypeFilter] = useState("");
  const [maxFeesFilter, setMaxFeesFilter] = useState("");
  const [searchQuery, setSearchQuery] = useState("");
  const [activeTab, setActiveTab] = useState<"top20" | "recommendations" | "all_colleges">("top20");
  const [chanceSubFilter, setChanceSubFilter] = useState<"all" | "Safe" | "Target" | "Dream">("all");

  // Colleges & Preference state
  const [preferenceList, setPreferenceList] = useState<CapPreferenceChoice[]>([]);
  const [showPdfModal, setShowPdfModal] = useState(false);
  const [expandedColleges, setExpandedColleges] = useState<Record<string, boolean>>({});
  const [isDownloadingTop20, setIsDownloadingTop20] = useState(false);
  const [toastMessage, setToastMessage] = useState<string | null>(null);

  // Compute normalized percentile based on active score mode
  const candidatePercentile = useMemo(() => {
    const num = parseFloat(rawScore);
    if (isNaN(num)) return 0;
    if (scoreMode === "percentile") return Math.min(100, Math.max(0, num));
    if (scoreMode === "marks") return marksToPercentile(num);
    if (scoreMode === "rank") return rankToPercentile(num);
    return 0;
  }, [rawScore, scoreMode]);

  // Generate smart recommendations based on user marks, caste, quota & branch
  const recommendations = useMemo(() => {
    if (candidatePercentile <= 0) return [];
    const maxFees = maxFeesFilter ? parseInt(maxFeesFilter) : undefined;
    return generateAutoCollegeList(candidatePercentile, category, quota, branchFilter, maxFees);
  }, [candidatePercentile, category, quota, branchFilter, maxFeesFilter]);

  // Recommendation counts
  const safeChoices = useMemo(() => recommendations.filter((r) => r.chance === "Safe"), [recommendations]);
  const targetChoices = useMemo(() => recommendations.filter((r) => r.chance === "Target"), [recommendations]);
  const dreamChoices = useMemo(() => recommendations.filter((r) => r.chance === "Dream"), [recommendations]);

  // ─── TOP 20 BEST COLLEGES ACCORDING TO RANK / SCORE & CASTE ────────────────
  const top20Choices = useMemo<CapPreferenceChoice[]>(() => {
    if (candidatePercentile <= 0) return [];
    const list: CapPreferenceChoice[] = [];
    const addedCodes = new Set<string>();

    const pushItem = (item: typeof recommendations[0]) => {
      if (list.length >= 20) return;
      if (addedCodes.has(item.choiceCode)) return;
      addedCodes.add(item.choiceCode);
      list.push({
        order: list.length + 1,
        choiceCode: item.choiceCode,
        collegeCode: item.collegeCode,
        collegeName: item.collegeName,
        courseName: item.courseName,
        status: item.collegeStatus,
        feesAnnual: item.feesAnnual,
        avgPackage: item.avgPackage,
        cutoffPercentile: item.cutoffPercentile || 0,
        candidatePercentile,
        category,
        chance: item.chance,
      });
    };

    // 1. Up to 5 Ambitious Dream choices (top colleges where student is slightly below cutoff, high upgrade chance in round 2/3)
    for (const item of dreamChoices) {
      if (list.filter((x) => x.chance === "Dream").length >= 5) break;
      pushItem(item);
    }

    // 2. Up to 10 Realistic Target choices (colleges that match their marks closely, highest allotment chance in round 1)
    for (const item of targetChoices) {
      if (list.filter((x) => x.chance === "Target").length >= 10) break;
      pushItem(item);
    }

    // 3. Up to 5 High Chance / Safe choices (solid backup colleges guaranteeing allotment)
    for (const item of safeChoices) {
      if (list.filter((x) => x.chance === "Safe").length >= 5) break;
      pushItem(item);
    }

    // 4. If fewer than 20 choices collected, backfill from available Target, Safe, Dream
    for (const item of targetChoices) {
      if (list.length >= 20) break;
      pushItem(item);
    }
    for (const item of safeChoices) {
      if (list.length >= 20) break;
      pushItem(item);
    }
    for (const item of dreamChoices) {
      if (list.length >= 20) break;
      pushItem(item);
    }

    return list.map((item, idx) => ({ ...item, order: idx + 1 }));
  }, [candidatePercentile, dreamChoices, targetChoices, safeChoices, category, recommendations]);

  // Grouped Top 20 for Strategy Display
  const top20Dream = useMemo(() => top20Choices.filter((c) => c.chance === "Dream"), [top20Choices]);
  const top20Target = useMemo(() => top20Choices.filter((c) => c.chance === "Target"), [top20Choices]);
  const top20Safe = useMemo(() => top20Choices.filter((c) => c.chance === "Safe" || c.chance === "Reach"), [top20Choices]);

  // ─── 1-CLICK INSTANT DOWNLOAD TOP 20 BEST COLLEGES PDF ─────────────────────
  const handleOneClickDownloadTop20 = async () => {
    if (top20Choices.length === 0) return;
    setIsDownloadingTop20(true);
    try {
      setPreferenceList(top20Choices);

      const { generateCapPreferencePdf } = await import("@/lib/pdf-export");
      generateCapPreferencePdf({
        candidateName: candidateName.trim() || `Candidate (${category} Merit)`,
        applicationId: "EN25" + Math.floor(100000 + Math.random() * 900000),
        cetRollNo: "240" + Math.floor(10000 + Math.random() * 90000),
        category,
        percentile: candidatePercentile,
        homeUniversity: quota === "HU" ? "SPPU (Pune University)" : quota === "OHU" ? "Other Than Home Univ." : "All India Merit",
        round: "CAP Round 1",
        items: top20Choices,
      });

      setToastMessage(`✅ Top 20 Best Colleges PDF Downloaded for ${candidatePercentile}%ile (${category})!`);
      setTimeout(() => setToastMessage(null), 5000);
    } catch (err) {
      console.error("1-click download error:", err);
    } finally {
      setIsDownloadingTop20(false);
    }
  };

  // Filtered recommendations for general display
  const displayedRecommendations = useMemo(() => {
    let list = recommendations;
    if (chanceSubFilter !== "all") {
      list = list.filter((r) => r.chance === chanceSubFilter);
    }
    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase();
      list = list.filter((r) => r.collegeName.toLowerCase().includes(q) || r.courseName.toLowerCase().includes(q) || r.collegeCode.includes(q));
    }
    return list;
  }, [recommendations, chanceSubFilter, searchQuery]);

  // All 56 Pune Colleges Catalog
  const catalogColleges = useMemo(() => {
    return PUNE_CAP_COLLEGES.filter((c) => {
      if (searchQuery) {
        const q = searchQuery.toLowerCase();
        if (!c.name.toLowerCase().includes(q) && !c.collegeCode.includes(q) && !c.district.toLowerCase().includes(q)) {
          return false;
        }
      }
      if (collegeTypeFilter && !c.status.toLowerCase().includes(collegeTypeFilter.toLowerCase())) {
        return false;
      }
      if (maxFeesFilter && c.feesAnnual > parseInt(maxFeesFilter)) {
        return false;
      }
      return true;
    }).map((c) => {
      const courses = c.courses
        .filter((cr) => !branchFilter || cr.courseName.toLowerCase().includes(branchFilter.toLowerCase()))
        .map((cr) => {
          const cutoff = getApplicableCutoff(cr.cutoffs, category, quota);
          const chance = candidatePercentile > 0 && cutoff != null
            ? calculateCapChance(candidatePercentile, cutoff)
            : "Target" as AdmissionChance;
          return { ...cr, applicableCutoff: cutoff, chance };
        });

      return { ...c, courses };
    }).filter((c) => c.courses.length > 0);
  }, [searchQuery, collegeTypeFilter, maxFeesFilter, branchFilter, category, quota, candidatePercentile]);

  // Preference list handlers
  const preferenceCodeSet = useMemo(() => new Set(preferenceList.map((p) => p.choiceCode)), [preferenceList]);

  const addChoice = useCallback((choice: {
    choiceCode: string;
    collegeCode: string;
    collegeName: string;
    courseName: string;
    status: string;
    feesAnnual: number;
    avgPackage?: number | null;
    cutoffPercentile: number | null;
    chance: AdmissionChance;
  }) => {
    setPreferenceList((prev) => {
      if (prev.find((p) => p.choiceCode === choice.choiceCode)) return prev;
      return [
        ...prev,
        {
          order: prev.length + 1,
          choiceCode: choice.choiceCode,
          collegeCode: choice.collegeCode,
          collegeName: choice.collegeName,
          courseName: choice.courseName,
          status: choice.status,
          feesAnnual: choice.feesAnnual,
          avgPackage: choice.avgPackage,
          cutoffPercentile: choice.cutoffPercentile || 0,
          candidatePercentile,
          category,
          chance: choice.chance,
        },
      ];
    });
  }, [candidatePercentile, category]);

  const removeChoice = useCallback((choiceCode: string) => {
    setPreferenceList((prev) =>
      prev.filter((p) => p.choiceCode !== choiceCode).map((p, i) => ({ ...p, order: i + 1 }))
    );
  }, []);

  const moveUp = useCallback((idx: number) => {
    setPreferenceList((prev) => {
      if (idx === 0) return prev;
      const copy = [...prev];
      [copy[idx - 1], copy[idx]] = [copy[idx], copy[idx - 1]];
      return copy.map((p, i) => ({ ...p, order: i + 1 }));
    });
  }, []);

  const moveDown = useCallback((idx: number) => {
    setPreferenceList((prev) => {
      if (idx === prev.length - 1) return prev;
      const copy = [...prev];
      [copy[idx], copy[idx + 1]] = [copy[idx + 1], copy[idx]];
      return copy.map((p, i) => ({ ...p, order: i + 1 }));
    });
  }, []);

  const toggleCollegeExpand = (collegeId: string) => {
    setExpandedColleges((prev) => ({ ...prev, [collegeId]: !prev[collegeId] }));
  };

  return (
    <div className="min-h-screen bg-slate-50/70">
      {/* Toast Notification */}
      {toastMessage && (
        <div className="fixed bottom-6 right-6 z-50 bg-slate-900 text-white px-5 py-3.5 rounded-2xl shadow-2xl border border-slate-700 flex items-center gap-3">
          <CheckCircle2 className="w-5 h-5 text-emerald-400 shrink-0" />
          <span className="text-xs sm:text-sm font-bold">{toastMessage}</span>
          <button onClick={() => setToastMessage(null)} className="ml-2 text-slate-400 hover:text-white">
            <X className="w-4 h-4" />
          </button>
        </div>
      )}

      {/* ─── Modern Minimal Header ─────────────────────────────────────────── */}
      <div className="bg-slate-900 text-white border-b border-slate-800">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-8">
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
            <div>
              <div className="flex items-center gap-2 mb-2">
                <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-blue-500/20 border border-blue-400/30 text-blue-300 text-xs font-bold">
                  <Sparkles className="w-3.5 h-3.5 text-blue-400" /> Maharashtra DTE • CAP 2025
                </span>
                <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-emerald-500/20 border border-emerald-400/30 text-emerald-300 text-xs font-bold">
                  56 Pune Colleges Seeded
                </span>
              </div>
              <h1 className="text-2xl sm:text-3xl font-black tracking-tight">
                Pune CAP Round <span className="text-blue-400">Preference Builder</span>
              </h1>
              <p className="text-slate-300 text-xs sm:text-sm mt-1 max-w-2xl">
                Get an instant, scientifically ranked **Top 20 Best Colleges list** based on your score, caste category, and quota. Download official PDF in 1 click.
              </p>
            </div>

            {/* Quick Metrics */}
            <div className="flex gap-2.5 shrink-0">
              <div className="bg-white/5 border border-white/10 rounded-xl px-3.5 py-2 text-center">
                <div className="text-lg font-black text-white">56</div>
                <div className="text-[10px] text-slate-400 font-semibold uppercase">Colleges</div>
              </div>
              <div className="bg-white/5 border border-white/10 rounded-xl px-3.5 py-2 text-center">
                <div className="text-lg font-black text-blue-400">232</div>
                <div className="text-[10px] text-slate-400 font-semibold uppercase">Choice Codes</div>
              </div>
              <div className="bg-white/5 border border-white/10 rounded-xl px-3.5 py-2 text-center">
                <div className="text-lg font-black text-emerald-400">1,002</div>
                <div className="text-[10px] text-slate-400 font-semibold uppercase">Cutoffs</div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* ─── Managed Clean Control Console Card ────────────────────────────── */}
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 -mt-4">
        <div className="bg-white rounded-2xl border border-slate-200/80 shadow-lg p-5 sm:p-6 space-y-4">
          {/* Inputs Row */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-12 gap-4 items-end">
            {/* Score Mode & Input */}
            <div className="lg:col-span-3 space-y-1.5">
              <div className="flex items-center justify-between text-xs font-bold text-slate-700">
                <span>Enter Your Score</span>
                <div className="flex bg-slate-100 p-0.5 rounded-lg border border-slate-200 text-[10px]">
                  <button
                    type="button"
                    onClick={() => setScoreMode("percentile")}
                    className={`px-2 py-0.5 rounded font-bold transition-all ${scoreMode === "percentile" ? "bg-white text-blue-600 shadow-2xs" : "text-slate-500 hover:text-slate-900"}`}
                  >
                    %ile
                  </button>
                  <button
                    type="button"
                    onClick={() => setScoreMode("marks")}
                    className={`px-2 py-0.5 rounded font-bold transition-all ${scoreMode === "marks" ? "bg-white text-blue-600 shadow-2xs" : "text-slate-500 hover:text-slate-900"}`}
                  >
                    Marks
                  </button>
                  <button
                    type="button"
                    onClick={() => setScoreMode("rank")}
                    className={`px-2 py-0.5 rounded font-bold transition-all ${scoreMode === "rank" ? "bg-white text-blue-600 shadow-2xs" : "text-slate-500 hover:text-slate-900"}`}
                  >
                    Rank
                  </button>
                </div>
              </div>

              <div className="relative">
                <input
                  type="number"
                  step={scoreMode === "percentile" ? "0.01" : "1"}
                  value={rawScore}
                  onChange={(e) => setRawScore(e.target.value)}
                  placeholder={scoreMode === "percentile" ? "e.g. 94.50" : scoreMode === "marks" ? "e.g. 135" : "e.g. 8500"}
                  className="w-full text-base font-bold px-3.5 py-2.5 rounded-xl bg-slate-50 border border-slate-200 text-slate-900 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:bg-white"
                />
                {scoreMode !== "percentile" && (
                  <span className="absolute right-3 top-2.5 text-xs font-bold text-emerald-700 bg-emerald-50 border border-emerald-200 px-2 py-0.5 rounded-md">
                    ≈ {candidatePercentile}%ile
                  </span>
                )}
              </div>
            </div>

            {/* Category */}
            <div className="lg:col-span-3 space-y-1.5">
              <label className="block text-xs font-bold text-slate-700">Category / Caste</label>
              <select
                value={category}
                onChange={(e) => setCategory(e.target.value)}
                className="w-full text-sm font-semibold px-3 py-2.5 rounded-xl bg-slate-50 border border-slate-200 text-slate-900 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:bg-white"
              >
                {CATEGORIES.map((c) => (
                  <option key={c.value} value={c.value}>
                    {c.label}
                  </option>
                ))}
              </select>
            </div>

            {/* Quota */}
            <div className="lg:col-span-2 space-y-1.5">
              <label className="block text-xs font-bold text-slate-700">Quota</label>
              <select
                value={quota}
                onChange={(e) => setQuota(e.target.value as "HU" | "OHU" | "AI")}
                className="w-full text-sm font-semibold px-3 py-2.5 rounded-xl bg-slate-50 border border-slate-200 text-slate-900 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:bg-white"
              >
                <option value="HU">Home Univ. (SPPU)</option>
                <option value="OHU">Other Home Univ.</option>
                <option value="AI">All India (JEE Main)</option>
              </select>
            </div>

            {/* Preferred Stream */}
            <div className="lg:col-span-2 space-y-1.5">
              <label className="block text-xs font-bold text-slate-700">Stream</label>
              <select
                value={branchFilter}
                onChange={(e) => setBranchFilter(e.target.value)}
                className="w-full text-sm font-semibold px-3 py-2.5 rounded-xl bg-slate-50 border border-slate-200 text-slate-900 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:bg-white"
              >
                {BRANCHES.map((b) => (
                  <option key={b.value} value={b.value}>
                    {b.label}
                  </option>
                ))}
              </select>
            </div>

            {/* Optional Candidate Name */}
            <div className="lg:col-span-2 space-y-1.5">
              <label className="block text-xs font-bold text-slate-700">Name for PDF</label>
              <input
                type="text"
                value={candidateName}
                onChange={(e) => setCandidateName(e.target.value)}
                placeholder="Candidate name..."
                className="w-full text-sm px-3 py-2.5 rounded-xl bg-slate-50 border border-slate-200 text-slate-900 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:bg-white"
              />
            </div>
          </div>

          {/* Action Header Strip */}
          <div className="pt-3 border-t border-slate-100 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
            <div className="flex items-center gap-2 flex-wrap text-xs">
              <span className="font-bold text-slate-700">Rank Breakdown for {candidatePercentile}%ile:</span>
              <span className="px-2.5 py-0.5 rounded-full bg-purple-50 text-purple-700 font-bold border border-purple-200">
                {dreamChoices.length} Dream
              </span>
              <span className="px-2.5 py-0.5 rounded-full bg-amber-50 text-amber-700 font-bold border border-amber-200">
                {targetChoices.length} Target
              </span>
              <span className="px-2.5 py-0.5 rounded-full bg-emerald-50 text-emerald-700 font-bold border border-emerald-200">
                {safeChoices.length} Safe
              </span>
            </div>

            {/* HIGH IMPACT 1-CLICK DOWNLOAD BUTTON */}
            <button
              type="button"
              onClick={handleOneClickDownloadTop20}
              disabled={isDownloadingTop20 || top20Choices.length === 0}
              className="px-5 py-2.5 rounded-xl bg-gradient-to-r from-amber-500 via-orange-500 to-amber-600 hover:from-amber-600 hover:to-orange-600 text-white font-black text-xs sm:text-sm flex items-center justify-center gap-2 shadow-md shadow-orange-500/20 active:scale-95 transition-all disabled:opacity-50"
            >
              <Zap className="w-4 h-4 fill-current text-white" />
              {isDownloadingTop20 ? "Exporting PDF..." : "⚡ 1-Click Download Top 20 Best Colleges (PDF)"}
            </button>
          </div>
        </div>
      </div>

      {/* ─── Main Content Workspace ────────────────────────────────────────── */}
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-6">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
          {/* Left Column: Tabs & Main List */}
          <div className="lg:col-span-8 space-y-4">
            {/* Clean Segmented Navigation Tabs */}
            <div className="flex items-center justify-between border-b border-slate-200 pb-3 flex-wrap gap-3">
              <div className="flex items-center gap-2 flex-wrap">
                <button
                  onClick={() => setActiveTab("top20")}
                  className={`flex items-center gap-2 px-3.5 py-2 rounded-xl text-xs sm:text-sm font-bold transition-all ${
                    activeTab === "top20"
                      ? "bg-slate-900 text-white shadow-xs"
                      : "bg-white text-slate-700 hover:bg-slate-100 border border-slate-200"
                  }`}
                >
                  <Trophy className="w-4 h-4 text-amber-400" />
                  <span>Top 20 Best for Your Rank</span>
                  <span className={`px-1.5 py-0.2 rounded-full text-[10px] ${activeTab === "top20" ? "bg-white/20 text-white" : "bg-slate-100 text-slate-700"}`}>
                    {top20Choices.length}
                  </span>
                </button>

                <button
                  onClick={() => setActiveTab("recommendations")}
                  className={`flex items-center gap-2 px-3.5 py-2 rounded-xl text-xs sm:text-sm font-bold transition-all ${
                    activeTab === "recommendations"
                      ? "bg-slate-900 text-white shadow-xs"
                      : "bg-white text-slate-700 hover:bg-slate-100 border border-slate-200"
                  }`}
                >
                  <Target className="w-4 h-4 text-blue-400" />
                  <span>All Recommendations</span>
                  <span className={`px-1.5 py-0.2 rounded-full text-[10px] ${activeTab === "recommendations" ? "bg-white/20 text-white" : "bg-slate-100 text-slate-700"}`}>
                    {recommendations.length}
                  </span>
                </button>

                <button
                  onClick={() => setActiveTab("all_colleges")}
                  className={`flex items-center gap-2 px-3.5 py-2 rounded-xl text-xs sm:text-sm font-bold transition-all ${
                    activeTab === "all_colleges"
                      ? "bg-slate-900 text-white shadow-xs"
                      : "bg-white text-slate-700 hover:bg-slate-100 border border-slate-200"
                  }`}
                >
                  <Building2 className="w-4 h-4 text-emerald-400" />
                  <span>All 56 Pune Colleges</span>
                  <span className={`px-1.5 py-0.2 rounded-full text-[10px] ${activeTab === "all_colleges" ? "bg-white/20 text-white" : "bg-slate-100 text-slate-700"}`}>
                    {catalogColleges.length}
                  </span>
                </button>
              </div>

              {/* Search Box */}
              <div className="relative w-full sm:w-56">
                <Search className="absolute left-3 top-2.5 w-3.5 h-3.5 text-slate-400" />
                <input
                  type="text"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  placeholder="Filter colleges / branches..."
                  className="w-full text-xs pl-8 pr-3 py-2 border border-slate-200 rounded-xl bg-white focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>
            </div>

            {/* TAB 1: TOP 20 BEST COLLEGES (ORGANIZED BY STRATEGY TIERS) */}
            {activeTab === "top20" && (
              <div className="space-y-5">
                {/* 1. TIER 1: DREAM CHOICES */}
                {top20Dream.length > 0 && (
                  <div className="space-y-2">
                    <div className="flex items-center justify-between px-1">
                      <div className="flex items-center gap-2">
                        <span className="p-1 rounded-md bg-purple-100 text-purple-700">
                          <Sparkles className="w-4 h-4" />
                        </span>
                        <div>
                          <h3 className="text-sm font-bold text-slate-900">
                            Tier 1: Ambitious Dream Choices (Priority #1 – #{top20Dream.length})
                          </h3>
                          <p className="text-[11px] text-slate-500">
                            Top Pune institutes slightly above cutoff. Crucial for Round 1 &amp; 2 seat betterment!
                          </p>
                        </div>
                      </div>
                      <span className="text-xs font-bold text-purple-700 bg-purple-50 border border-purple-200 px-2 py-0.5 rounded-full">
                        {top20Dream.length} choices
                      </span>
                    </div>

                    <div className="space-y-2">
                      {top20Dream.map((choice) => (
                        <CollegeChoiceRow
                          key={choice.choiceCode}
                          choice={choice}
                          isAdded={preferenceCodeSet.has(choice.choiceCode)}
                          onAdd={addChoice}
                          onRemove={removeChoice}
                          badgeColor="purple"
                        />
                      ))}
                    </div>
                  </div>
                )}

                {/* 2. TIER 2: TARGET MATCHES */}
                {top20Target.length > 0 && (
                  <div className="space-y-2 pt-2">
                    <div className="flex items-center justify-between px-1">
                      <div className="flex items-center gap-2">
                        <span className="p-1 rounded-md bg-amber-100 text-amber-700">
                          <Target className="w-4 h-4" />
                        </span>
                        <div>
                          <h3 className="text-sm font-bold text-slate-900">
                            Tier 2: Core Target Matches (Priority #{top20Dream.length + 1} – #{top20Dream.length + top20Target.length})
                          </h3>
                          <p className="text-[11px] text-slate-500">
                            Best fit for your merit marks. Highest probability of allotment in CAP Round 1.
                          </p>
                        </div>
                      </div>
                      <span className="text-xs font-bold text-amber-700 bg-amber-50 border border-amber-200 px-2 py-0.5 rounded-full">
                        {top20Target.length} choices
                      </span>
                    </div>

                    <div className="space-y-2">
                      {top20Target.map((choice) => (
                        <CollegeChoiceRow
                          key={choice.choiceCode}
                          choice={choice}
                          isAdded={preferenceCodeSet.has(choice.choiceCode)}
                          onAdd={addChoice}
                          onRemove={removeChoice}
                          badgeColor="amber"
                        />
                      ))}
                    </div>
                  </div>
                )}

                {/* 3. TIER 3: SAFE CHOICES */}
                {top20Safe.length > 0 && (
                  <div className="space-y-2 pt-2">
                    <div className="flex items-center justify-between px-1">
                      <div className="flex items-center gap-2">
                        <span className="p-1 rounded-md bg-emerald-100 text-emerald-700">
                          <CheckCircle2 className="w-4 h-4" />
                        </span>
                        <div>
                          <h3 className="text-sm font-bold text-slate-900">
                            Tier 3: Guaranteed Safety Net (Priority #{top20Dream.length + top20Target.length + 1} – #{top20Choices.length})
                          </h3>
                          <p className="text-[11px] text-slate-500">
                            High-reputation colleges comfortably below cutoff. Ensures 100% seat security.
                          </p>
                        </div>
                      </div>
                      <span className="text-xs font-bold text-emerald-700 bg-emerald-50 border border-emerald-200 px-2 py-0.5 rounded-full">
                        {top20Safe.length} choices
                      </span>
                    </div>

                    <div className="space-y-2">
                      {top20Safe.map((choice) => (
                        <CollegeChoiceRow
                          key={choice.choiceCode}
                          choice={choice}
                          isAdded={preferenceCodeSet.has(choice.choiceCode)}
                          onAdd={addChoice}
                          onRemove={removeChoice}
                          badgeColor="emerald"
                        />
                      ))}
                    </div>
                  </div>
                )}
              </div>
            )}

            {/* TAB 2: ALL RECOMMENDATIONS VIEW */}
            {activeTab === "recommendations" && (
              <div className="space-y-3">
                {/* Chance Filter Pills */}
                <div className="flex items-center justify-between bg-white border border-slate-200 rounded-xl p-3 flex-wrap gap-2">
                  <div className="flex items-center gap-1.5 flex-wrap">
                    <span className="text-[11px] font-bold text-slate-500 uppercase mr-1">Filter:</span>
                    <button
                      onClick={() => setChanceSubFilter("all")}
                      className={`px-3 py-1 rounded-lg text-xs font-bold transition-all ${chanceSubFilter === "all" ? "bg-slate-900 text-white" : "text-slate-600 hover:bg-slate-100"}`}
                    >
                      All ({recommendations.length})
                    </button>
                    <button
                      onClick={() => setChanceSubFilter("Safe")}
                      className={`px-3 py-1 rounded-lg text-xs font-bold flex items-center gap-1 transition-all ${chanceSubFilter === "Safe" ? "bg-emerald-600 text-white" : "text-emerald-700 hover:bg-emerald-50"}`}
                    >
                      <CheckCircle2 className="w-3.5 h-3.5" /> High Chance ({safeChoices.length})
                    </button>
                    <button
                      onClick={() => setChanceSubFilter("Target")}
                      className={`px-3 py-1 rounded-lg text-xs font-bold flex items-center gap-1 transition-all ${chanceSubFilter === "Target" ? "bg-amber-600 text-white" : "text-amber-700 hover:bg-amber-50"}`}
                    >
                      <Target className="w-3.5 h-3.5" /> Target ({targetChoices.length})
                    </button>
                    <button
                      onClick={() => setChanceSubFilter("Dream")}
                      className={`px-3 py-1 rounded-lg text-xs font-bold flex items-center gap-1 transition-all ${chanceSubFilter === "Dream" ? "bg-purple-600 text-white" : "text-purple-700 hover:bg-purple-50"}`}
                    >
                      <Sparkles className="w-3.5 h-3.5" /> Ambitious ({dreamChoices.length})
                    </button>
                  </div>
                </div>

                {/* Items */}
                <div className="space-y-2">
                  {displayedRecommendations.map((rec, idx) => (
                    <CollegeChoiceRow
                      key={rec.choiceCode}
                      choice={{
                        order: idx + 1,
                        choiceCode: rec.choiceCode,
                        collegeCode: rec.collegeCode,
                        collegeName: rec.collegeName,
                        courseName: rec.courseName,
                        status: rec.collegeStatus,
                        feesAnnual: rec.feesAnnual,
                        avgPackage: rec.avgPackage,
                        cutoffPercentile: rec.cutoffPercentile || 0,
                        candidatePercentile,
                        category,
                        chance: rec.chance,
                      }}
                      isAdded={preferenceCodeSet.has(rec.choiceCode)}
                      onAdd={addChoice}
                      onRemove={removeChoice}
                      badgeColor={rec.chance === "Dream" ? "purple" : rec.chance === "Target" ? "amber" : "emerald"}
                    />
                  ))}
                </div>
              </div>
            )}

            {/* TAB 3: ALL 56 COLLEGES DIRECTORY */}
            {activeTab === "all_colleges" && (
              <div className="space-y-3">
                {/* Filter Toolbar */}
                <div className="bg-white border border-slate-200 rounded-xl p-3 grid grid-cols-1 sm:grid-cols-3 gap-3">
                  <div>
                    <label className="block text-[10px] font-bold text-slate-500 uppercase mb-1">Status</label>
                    <select
                      value={collegeTypeFilter}
                      onChange={(e) => setCollegeTypeFilter(e.target.value)}
                      className="w-full text-xs border border-slate-200 rounded-lg px-2.5 py-1.5 focus:outline-none focus:ring-2 focus:ring-blue-500"
                    >
                      {COLLEGE_TYPES.map((t) => (
                        <option key={t.value} value={t.value}>{t.label}</option>
                      ))}
                    </select>
                  </div>
                  <div>
                    <label className="block text-[10px] font-bold text-slate-500 uppercase mb-1">Max Annual Fees</label>
                    <select
                      value={maxFeesFilter}
                      onChange={(e) => setMaxFeesFilter(e.target.value)}
                      className="w-full text-xs border border-slate-200 rounded-lg px-2.5 py-1.5 focus:outline-none focus:ring-2 focus:ring-blue-500"
                    >
                      {MAX_FEES.map((f) => (
                        <option key={f.value} value={f.value}>{f.label}</option>
                      ))}
                    </select>
                  </div>
                  <div className="flex items-end">
                    <button
                      onClick={() => {
                        setCollegeTypeFilter("");
                        setMaxFeesFilter("");
                        setSearchQuery("");
                      }}
                      className="w-full py-1.5 px-3 bg-slate-100 hover:bg-slate-200 text-slate-700 text-xs font-bold rounded-lg transition-colors flex items-center justify-center gap-1"
                    >
                      <RotateCcw className="w-3 h-3" /> Reset Filters
                    </button>
                  </div>
                </div>

                {/* Directory Accordion */}
                <div className="space-y-2.5">
                  {catalogColleges.map((college) => {
                    const isExpanded = !!expandedColleges[college.id];
                    return (
                      <div
                        key={college.id}
                        className="bg-white rounded-xl border border-slate-200 overflow-hidden shadow-2xs hover:shadow-xs transition-all"
                      >
                        <div
                          onClick={() => toggleCollegeExpand(college.id)}
                          className="flex items-start gap-3.5 p-3.5 cursor-pointer hover:bg-slate-50/60 transition-colors"
                        >
                          <div className="shrink-0 w-11 h-11 rounded-xl bg-slate-900 text-white flex flex-col items-center justify-center">
                            <span className="text-[7px] text-slate-400 font-semibold">DTE</span>
                            <span className="text-xs font-black">{college.collegeCode}</span>
                          </div>

                          <div className="flex-1 min-w-0">
                            <div className="flex items-start justify-between gap-2">
                              <div>
                                <h3 className="text-sm font-bold text-slate-900 leading-snug">{college.name}</h3>
                                <div className="flex items-center gap-1.5 mt-1 flex-wrap">
                                  <CollegeTypeBadge status={college.status} />
                                  {college.accreditation && (
                                    <span className="text-[10px] font-semibold text-slate-500 bg-slate-100 px-1.5 py-0.5 rounded">
                                      {college.accreditation.split("/")[0].trim()}
                                    </span>
                                  )}
                                </div>
                              </div>
                              <div className="shrink-0 text-slate-400">
                                {isExpanded ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />}
                              </div>
                            </div>

                            <div className="flex items-center gap-3 mt-2 flex-wrap text-xs text-slate-500">
                              <span className="flex items-center gap-1"><MapPin className="w-3.5 h-3.5 text-slate-400" />{college.district}</span>
                              <span className="flex items-center gap-1"><Star className="w-3.5 h-3.5 text-amber-500 fill-amber-500" />{college.rating.toFixed(1)}</span>
                              <span className="flex items-center gap-1"><Banknote className="w-3.5 h-3.5 text-slate-400" />{formatFees(college.feesAnnual)}</span>
                              {college.avgPackage && (
                                <span className="flex items-center gap-1"><TrendingUp className="w-3.5 h-3.5 text-emerald-500" />{college.avgPackage.toFixed(1)} LPA</span>
                              )}
                              <span className="text-blue-600 font-semibold">{college.courses.length} Branches</span>
                            </div>
                          </div>
                        </div>

                        {isExpanded && (
                          <div className="border-t border-slate-100 divide-y divide-slate-100 bg-slate-50/30">
                            {college.courses.map((course) => {
                              const isAdded = preferenceCodeSet.has(course.choiceCode);
                              return (
                                <div
                                  key={course.choiceCode}
                                  className="px-4 py-2.5 flex items-center justify-between gap-3 hover:bg-white transition-colors"
                                >
                                  <div>
                                    <div className="flex items-center gap-2">
                                      <span className="text-xs font-bold text-slate-800">{course.courseName}</span>
                                      <span className="text-[10px] font-mono text-slate-400 bg-slate-100 px-1.5 py-0.5 rounded">
                                        {course.choiceCode}
                                      </span>
                                    </div>
                                    <div className="text-[10px] text-slate-500 mt-0.5">
                                      Intake: {course.intake} seats • {course.shift}
                                    </div>
                                  </div>

                                  <div className="flex items-center gap-3 shrink-0">
                                    <div className="text-right">
                                      <div className="text-xs font-bold text-slate-900">
                                        {course.applicableCutoff != null ? `${course.applicableCutoff.toFixed(2)}%` : "N/A"}
                                      </div>
                                      {course.applicableCutoff != null && (
                                        <ChanceBadge chance={course.chance} />
                                      )}
                                    </div>

                                    {isAdded ? (
                                      <button
                                        onClick={() => removeChoice(course.choiceCode)}
                                        className="w-7 h-7 rounded-lg bg-emerald-100 text-emerald-800 flex items-center justify-center hover:bg-rose-100 hover:text-rose-700 transition-colors"
                                      >
                                        <Check className="w-4 h-4" />
                                      </button>
                                    ) : (
                                      <button
                                        onClick={() => addChoice({
                                          choiceCode: course.choiceCode,
                                          collegeCode: college.collegeCode,
                                          collegeName: college.name,
                                          courseName: course.courseName,
                                          status: college.status,
                                          feesAnnual: college.feesAnnual,
                                          avgPackage: college.avgPackage,
                                          cutoffPercentile: course.applicableCutoff || 0,
                                          chance: course.chance,
                                        })}
                                        className="w-7 h-7 rounded-lg bg-blue-600 hover:bg-blue-700 text-white flex items-center justify-center transition-all shadow-xs"
                                      >
                                        <Plus className="w-4 h-4" />
                                      </button>
                                    )}
                                  </div>
                                </div>
                              );
                            })}
                          </div>
                        )}
                      </div>
                    );
                  })}
                </div>
              </div>
            )}
          </div>

          {/* Right Column: Sticky Preference List Panel */}
          <div className="lg:col-span-4 lg:sticky lg:top-6">
            <PreferenceListPanel
              items={preferenceList}
              onRemove={removeChoice}
              onMoveUp={moveUp}
              onMoveDown={moveDown}
              onClear={() => setPreferenceList([])}
              onExportPdf={() => setShowPdfModal(true)}
              onOneClickDownloadTop20={handleOneClickDownloadTop20}
              isDownloadingTop20={isDownloadingTop20}
              percentile={candidatePercentile}
              category={category}
            />
          </div>
        </div>
      </div>

      {/* PDF Modal */}
      <PdfModal
        isOpen={showPdfModal}
        onClose={() => setShowPdfModal(false)}
        items={preferenceList}
        percentile={candidatePercentile}
        category={category}
        quota={quota}
        initialName={candidateName}
      />
    </div>
  );
}

// ─── Sub-Component: Clean College Choice Row ──────────────────────────────────

function CollegeChoiceRow({
  choice,
  isAdded,
  onAdd,
  onRemove,
  badgeColor,
}: {
  choice: CapPreferenceChoice;
  isAdded: boolean;
  onAdd: (choice: any) => void;
  onRemove: (choiceCode: string) => void;
  badgeColor: "purple" | "amber" | "emerald";
}) {
  const rankBg =
    badgeColor === "purple"
      ? "bg-purple-600 text-white"
      : badgeColor === "amber"
      ? "bg-amber-600 text-white"
      : "bg-emerald-600 text-white";

  return (
    <div
      className={`bg-white rounded-xl border p-3.5 transition-all hover:shadow-xs flex items-center justify-between gap-3 ${
        isAdded ? "border-emerald-300 bg-emerald-50/20" : "border-slate-200/90"
      }`}
    >
      <div className="flex items-center gap-3 min-w-0">
        {/* Priority Rank */}
        <div className={`shrink-0 w-7 h-7 rounded-lg ${rankBg} font-black text-xs flex items-center justify-center shadow-xs`}>
          #{choice.order}
        </div>

        {/* Info */}
        <div className="min-w-0">
          <div className="flex items-center gap-2 flex-wrap">
            <h4 className="text-xs sm:text-sm font-bold text-slate-900 leading-snug truncate">{choice.collegeName}</h4>
            <CollegeTypeBadge status={choice.status} />
          </div>

          <div className="text-xs font-semibold text-blue-700 mt-0.5 flex items-center gap-1.5 flex-wrap">
            <span>{choice.courseName}</span>
            <span className="text-slate-300">•</span>
            <span className="text-slate-400 font-mono text-[10px]">DTE {choice.choiceCode}</span>
          </div>

          <div className="flex items-center gap-2.5 mt-1.5 flex-wrap text-[11px] text-slate-500">
            <span className="font-bold text-slate-900 bg-slate-100 px-1.5 py-0.2 rounded">
              Cutoff: {choice.cutoffPercentile?.toFixed(2)}%
            </span>
            <span className="flex items-center gap-0.5 text-slate-400">
              <Banknote className="w-3 h-3" /> {formatFees(choice.feesAnnual)}
            </span>
            {choice.avgPackage && (
              <span className="flex items-center gap-0.5 text-emerald-600 font-semibold">
                <TrendingUp className="w-3 h-3" /> {choice.avgPackage.toFixed(1)} LPA
              </span>
            )}
          </div>
        </div>
      </div>

      {/* Chance & Action */}
      <div className="flex items-center gap-2.5 shrink-0">
        <ChanceBadge chance={choice.chance} />

        {isAdded ? (
          <button
            onClick={() => onRemove(choice.choiceCode)}
            className="px-2.5 py-1.5 rounded-lg bg-emerald-50 text-emerald-800 text-xs font-bold hover:bg-rose-50 hover:text-rose-700 transition-colors flex items-center gap-1 border border-emerald-200"
          >
            <Check className="w-3.5 h-3.5" /> Added
          </button>
        ) : (
          <button
            onClick={() => onAdd(choice)}
            className="px-3 py-1.5 rounded-lg bg-blue-600 hover:bg-blue-700 text-white text-xs font-bold transition-all shadow-2xs active:scale-95 flex items-center gap-1"
          >
            <Plus className="w-3.5 h-3.5" /> Add
          </button>
        )}
      </div>
    </div>
  );
}
