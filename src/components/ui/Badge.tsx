import React from "react";
import { cn } from "@/lib/utils";

export interface BadgeProps extends React.HTMLAttributes<HTMLSpanElement> {
  variant?:
    | "default"
    | "secondary"
    | "outline"
    | "success"
    | "warning"
    | "government"
    | "private"
    | "deemed"
    | "autonomous";
  size?: "sm" | "md";
}

export function Badge({
  className,
  variant = "default",
  size = "md",
  children,
  ...props
}: BadgeProps) {
  const baseStyles =
    "inline-flex items-center font-medium rounded-md tracking-tight transition-colors";

  const variants = {
    default: "bg-slate-100 text-slate-700 border border-slate-200",
    secondary: "bg-gray-50 text-gray-600 border border-gray-200",
    outline: "border border-slate-200 text-slate-600 bg-white",
    success: "bg-emerald-50 text-emerald-700 border border-emerald-200/60",
    warning: "bg-amber-50 text-amber-800 border border-amber-200/60",
    government: "bg-blue-50 text-blue-700 border border-blue-200/60",
    private: "bg-purple-50 text-purple-700 border border-purple-200/60",
    deemed: "bg-teal-50 text-teal-700 border border-teal-200/60",
    autonomous: "bg-indigo-50 text-indigo-700 border border-indigo-200/60",
  };

  const sizes = {
    sm: "text-[11px] px-2 py-0.5",
    md: "text-xs px-2.5 py-1",
  };

  return (
    <span
      className={cn(baseStyles, variants[variant], sizes[size], className)}
      {...props}
    >
      {children}
    </span>
  );
}
