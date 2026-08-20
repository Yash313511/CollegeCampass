import React from "react";
import Link from "next/link";
import { ShieldCheck } from "lucide-react";
import { Logo } from "@/components/ui/Logo";

export function Footer() {
  return (
    <footer className="border-t border-slate-200 bg-white mt-auto">
      {/* Disclaimer Banner */}
      <div className="bg-slate-50 border-b border-slate-100 py-3 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto flex items-center justify-center gap-2 text-xs text-slate-500 text-center">
          <ShieldCheck className="h-4 w-4 text-slate-400 shrink-0" />
          <span>
            <strong>Disclaimer:</strong> Data shown is illustrative for educational exploration. Always verify details with official institution portals.
          </span>
        </div>
      </div>

      <div className="mx-auto max-w-7xl px-4 py-10 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          {/* Brand */}
          <div className="space-y-3 md:col-span-2">
            <Logo size="md" />
            <p className="text-xs text-slate-500 max-w-md leading-relaxed">
              Empowering students with structured, transparent college admissions data. Compare fees, track placement outcomes, and discover your best fit institution.
            </p>
          </div>

          {/* Quick Links */}
          <div className="space-y-2.5">
            <h4 className="text-xs font-bold text-slate-900 uppercase tracking-wider">
              Explore
            </h4>
            <ul className="space-y-1.5 text-xs text-slate-600">
              <li>
                <Link href="/colleges" className="hover:text-slate-900 transition-colors">
                  All Colleges
                </Link>
              </li>
              <li>
                <Link href="/compare" className="hover:text-slate-900 transition-colors">
                  Compare Institutions
                </Link>
              </li>
              <li>
                <Link href="/predictor" className="hover:text-slate-900 transition-colors">
                  Admission Predictor
                </Link>
              </li>
              <li>
                <Link href="/saved" className="hover:text-slate-900 transition-colors">
                  Shortlisted Colleges
                </Link>
              </li>
            </ul>
          </div>

          {/* Streams */}
          <div className="space-y-2.5">
            <h4 className="text-xs font-bold text-slate-900 uppercase tracking-wider">
              Top Disciplines
            </h4>
            <ul className="space-y-1.5 text-xs text-slate-600">
              <li>
                <Link href="/colleges?stream=Engineering" className="hover:text-slate-900 transition-colors">
                  Engineering (B.Tech)
                </Link>
              </li>
              <li>
                <Link href="/colleges?stream=Management" className="hover:text-slate-900 transition-colors">
                  Management (MBA)
                </Link>
              </li>
              <li>
                <Link href="/colleges?stream=Medical" className="hover:text-slate-900 transition-colors">
                  Medical (MBBS)
                </Link>
              </li>
              <li>
                <Link href="/colleges?stream=Computer+Science" className="hover:text-slate-900 transition-colors">
                  Computer Science
                </Link>
              </li>
            </ul>
          </div>
        </div>

        <div className="mt-8 pt-6 border-t border-slate-100 flex flex-col sm:flex-row items-center justify-between gap-4 text-xs text-slate-400">
          <p>© {new Date().getFullYear()} CollegeCompass. Built for Student Decision-Making.</p>
          <div className="flex items-center gap-2">
            <span>Discover</span>
            <span>•</span>
            <span>Compare</span>
            <span>•</span>
            <span>Decide</span>
          </div>
        </div>
      </div>
    </footer>
  );
}
