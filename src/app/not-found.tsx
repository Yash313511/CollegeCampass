import React from "react";
import Link from "next/link";
import { Compass, Search, Home } from "lucide-react";
import { Button } from "@/components/ui/Button";

export default function NotFound() {
  return (
    <div className="min-h-[70vh] flex items-center justify-center px-4 py-16">
      <div className="text-center space-y-4 max-w-md bg-white p-8 sm:p-12 rounded-2xl border border-slate-200 shadow-2xs">
        <div className="flex h-14 w-14 items-center justify-center rounded-full bg-slate-100 text-slate-500 mx-auto">
          <Compass className="h-7 w-7 text-blue-600" />
        </div>
        <span className="text-xs font-bold text-blue-600 uppercase tracking-wider">
          404 Error
        </span>
        <h1 className="text-2xl font-extrabold text-slate-900 tracking-tight">
          Page Not Found
        </h1>
        <p className="text-xs sm:text-sm text-slate-500 leading-relaxed">
          The college or resource you are looking for may have been moved, renamed, or does not exist in our directory.
        </p>
        <div className="pt-2 flex flex-col sm:flex-row items-center justify-center gap-3">
          <Link href="/colleges">
            <Button
              variant="primary"
              size="sm"
              leftIcon={<Search className="h-4 w-4" />}
            >
              Explore Colleges
            </Button>
          </Link>
          <Link href="/">
            <Button
              variant="outline"
              size="sm"
              leftIcon={<Home className="h-4 w-4" />}
            >
              Back to Home
            </Button>
          </Link>
        </div>
      </div>
    </div>
  );
}
