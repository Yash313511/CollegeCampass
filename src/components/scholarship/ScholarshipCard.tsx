import React from "react";
import {
  Building2,
  IndianRupee,
  Clock,
  ExternalLink,
  Users,
  Award,
  Trophy,
  BookOpen,
  Microscope,
  Heart,
} from "lucide-react";

interface ScholarshipCardProps {
  scholarship: {
    id: string;
    name: string;
    provider: string;
    description: string;
    type: string;
    level: string;
    amount: string;
    eligibility: string;
    deadline: string | null;
    applicationLink: string | null;
    streams: string[];
    categories: string[];
  };
}

const TYPE_CONFIG: Record<string, { label: string; color: string; icon: React.ReactNode }> = {
  MERIT: { label: "Merit", color: "bg-amber-50 text-amber-700 border-amber-200", icon: <Award className="h-3 w-3" /> },
  NEED_BASED: { label: "Need-Based", color: "bg-blue-50 text-blue-700 border-blue-200", icon: <Heart className="h-3 w-3" /> },
  MINORITY: { label: "Minority", color: "bg-purple-50 text-purple-700 border-purple-200", icon: <Users className="h-3 w-3" /> },
  SPORTS: { label: "Sports", color: "bg-green-50 text-green-700 border-green-200", icon: <Trophy className="h-3 w-3" /> },
  RESEARCH: { label: "Research", color: "bg-rose-50 text-rose-700 border-rose-200", icon: <Microscope className="h-3 w-3" /> },
};

const LEVEL_CONFIG: Record<string, { label: string; color: string }> = {
  NATIONAL: { label: "National", color: "bg-slate-900 text-white" },
  STATE: { label: "State", color: "bg-slate-700 text-white" },
  INSTITUTIONAL: { label: "Institutional", color: "bg-slate-500 text-white" },
  PRIVATE: { label: "Private", color: "bg-slate-400 text-white" },
};

export function ScholarshipCard({ scholarship }: ScholarshipCardProps) {
  const typeConf = TYPE_CONFIG[scholarship.type] || TYPE_CONFIG.MERIT;
  const levelConf = LEVEL_CONFIG[scholarship.level] || LEVEL_CONFIG.NATIONAL;

  return (
    <div className="biz-card rounded-xl p-5 space-y-4 flex flex-col h-full">
      {/* Header */}
      <div className="space-y-2.5">
        {/* Badges */}
        <div className="flex items-center gap-2 flex-wrap">
          <span
            className={`inline-flex items-center gap-1 px-2 py-0.5 rounded-md text-[10px] font-bold uppercase tracking-wider border ${typeConf.color}`}
          >
            {typeConf.icon}
            {typeConf.label}
          </span>
          <span
            className={`inline-flex items-center px-2 py-0.5 rounded-md text-[10px] font-bold uppercase tracking-wider ${levelConf.color}`}
          >
            {levelConf.label}
          </span>
        </div>

        {/* Name */}
        <h3 className="text-base font-bold text-slate-900 leading-snug">
          {scholarship.name}
        </h3>

        {/* Provider */}
        <div className="flex items-center gap-1.5 text-xs text-slate-500 font-medium">
          <Building2 className="h-3.5 w-3.5 text-slate-400 shrink-0" />
          <span className="truncate">{scholarship.provider}</span>
        </div>
      </div>

      {/* Amount — highlighted */}
      <div className="bg-emerald-50 border border-emerald-200 rounded-lg px-3.5 py-2.5 flex items-start gap-2">
        <IndianRupee className="h-4 w-4 text-emerald-600 shrink-0 mt-0.5" />
        <div>
          <div className="text-xs font-bold text-emerald-800">Amount</div>
          <div className="text-xs text-emerald-700 leading-relaxed">
            {scholarship.amount}
          </div>
        </div>
      </div>

      {/* Description */}
      <p className="text-xs text-slate-600 leading-relaxed line-clamp-3 flex-1">
        {scholarship.description}
      </p>

      {/* Eligibility */}
      <div className="space-y-1">
        <div className="flex items-center gap-1 text-[10px] font-bold text-slate-500 uppercase tracking-wider">
          <BookOpen className="h-3 w-3" />
          Eligibility
        </div>
        <p className="text-xs text-slate-600 leading-relaxed line-clamp-2">
          {scholarship.eligibility}
        </p>
      </div>

      {/* Stream Tags */}
      {scholarship.streams.length > 0 && (
        <div className="flex flex-wrap gap-1">
          {scholarship.streams.slice(0, 4).map((stream) => (
            <span
              key={stream}
              className="px-2 py-0.5 rounded-md bg-slate-50 text-slate-600 text-[10px] font-semibold border border-slate-200"
            >
              {stream}
            </span>
          ))}
          {scholarship.streams.length > 4 && (
            <span className="px-2 py-0.5 rounded-md bg-slate-50 text-slate-400 text-[10px] font-semibold border border-slate-200">
              +{scholarship.streams.length - 4} more
            </span>
          )}
        </div>
      )}

      {/* Category Tags */}
      {scholarship.categories.length > 0 && (
        <div className="flex flex-wrap gap-1">
          {scholarship.categories.map((cat) => (
            <span
              key={cat}
              className="px-1.5 py-0.5 rounded bg-slate-100 text-slate-500 text-[10px] font-medium"
            >
              {cat}
            </span>
          ))}
        </div>
      )}

      {/* Footer */}
      <div className="flex items-center justify-between pt-2 border-t border-slate-100 mt-auto">
        {/* Deadline */}
        <div className="flex items-center gap-1 text-xs text-slate-500">
          <Clock className="h-3.5 w-3.5 text-slate-400" />
          <span className="font-medium">
            {scholarship.deadline || "Rolling"}
          </span>
        </div>

        {/* Apply Link */}
        {scholarship.applicationLink && (
          <a
            href={scholarship.applicationLink}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-1 px-3 py-1.5 rounded-lg bg-slate-900 text-white text-xs font-semibold hover:bg-slate-800 transition-colors"
          >
            Apply Now
            <ExternalLink className="h-3 w-3" />
          </a>
        )}
      </div>
    </div>
  );
}
