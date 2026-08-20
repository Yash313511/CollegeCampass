"use client";

import React, { useEffect } from "react";
import { AlertTriangle, RotateCcw, Home } from "lucide-react";
import { Button } from "@/components/ui/Button";
import Link from "next/link";

export default function GlobalError({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  useEffect(() => {
    console.error("Global application error:", error);
  }, [error]);

  return (
    <div className="min-h-[70vh] flex items-center justify-center px-4 py-16">
      <div className="text-center space-y-4 max-w-md bg-white p-8 sm:p-12 rounded-2xl border border-red-200 shadow-2xs">
        <div className="flex h-14 w-14 items-center justify-center rounded-full bg-red-50 text-red-600 mx-auto">
          <AlertTriangle className="h-7 w-7" />
        </div>
        <span className="text-xs font-bold text-red-600 uppercase tracking-wider">
          Application Error
        </span>
        <h2 className="text-2xl font-extrabold text-slate-900 tracking-tight">
          Something went wrong
        </h2>
        <p className="text-xs sm:text-sm text-slate-500 leading-relaxed">
          An unexpected error occurred while rendering this view. You can retry the operation or navigate back to the home directory.
        </p>
        <div className="pt-2 flex flex-col sm:flex-row items-center justify-center gap-3">
          <Button
            variant="primary"
            size="sm"
            onClick={() => reset()}
            leftIcon={<RotateCcw className="h-4 w-4" />}
          >
            Try Again
          </Button>
          <Link href="/">
            <Button
              variant="outline"
              size="sm"
              leftIcon={<Home className="h-4 w-4" />}
            >
              Go to Homepage
            </Button>
          </Link>
        </div>
      </div>
    </div>
  );
}
