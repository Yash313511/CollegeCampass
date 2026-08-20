import React from "react";
import { cn } from "@/lib/utils";

export interface SkeletonProps extends React.HTMLAttributes<HTMLDivElement> {
  variant?: "default" | "circle" | "text";
}

export function Skeleton({
  className,
  variant = "default",
  ...props
}: SkeletonProps) {
  return (
    <div
      className={cn(
        "animate-pulse bg-white/8",
        variant === "circle" && "rounded-full",
        variant === "text" && "h-4 rounded",
        variant === "default" && "rounded-xl",
        className
      )}
      {...props}
    />
  );
}

export function CollegeCardSkeleton() {
  return (
    <div className="glass-panel rounded-2xl p-5 space-y-4">
      <div className="flex items-start justify-between gap-3">
        <div className="space-y-2 flex-1">
          <Skeleton className="h-5 w-3/4" />
          <Skeleton className="h-4 w-1/2" />
        </div>
        <Skeleton className="h-7 w-14 rounded-lg" />
      </div>
      <div className="grid grid-cols-2 gap-3 py-3 border-y border-white/5">
        <Skeleton className="h-10" />
        <Skeleton className="h-10" />
        <Skeleton className="h-10" />
        <Skeleton className="h-10" />
      </div>
      <div className="flex items-center justify-between pt-1">
        <Skeleton className="h-8 w-24" />
        <Skeleton className="h-9 w-28 rounded-xl" />
      </div>
    </div>
  );
}
