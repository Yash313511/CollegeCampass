import React from "react";
import Link from "next/link";
import { cn } from "@/lib/utils";

export interface LogoProps {
  size?: "sm" | "md" | "lg";
  showTagline?: boolean;
  className?: string;
  linkHref?: string;
}

export function Logo({
  size = "md",
  showTagline = true,
  className = "",
  linkHref = "/",
}: LogoProps) {
  const heightClasses = {
    sm: "h-8",
    md: "h-10",
    lg: "h-12",
  };

  const content = (
    <div className={cn("inline-flex items-center gap-2 select-none group", className)}>
      {/* Dynamic SVG Emblem */}
      <svg
        viewBox="0 0 136 136"
        className={cn(heightClasses[size], "w-auto shrink-0 transition-transform duration-200 group-hover:scale-105")}
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
      >
        <defs>
          <linearGradient id="logo-c-grad" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor="#00A3FF" />
            <stop offset="50%" stopColor="#0066FF" />
            <stop offset="100%" stopColor="#0044CC" />
          </linearGradient>
          <linearGradient id="logo-needle-blue" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor="#0099FF" />
            <stop offset="100%" stopColor="#0055EE" />
          </linearGradient>
        </defs>

        <g transform="translate(0, 3)">
          {/* North Pointer */}
          <polygon points="68,8 60,38 76,38" fill="#0066FF" />
          <polygon points="68,8 68,38 60,38" fill="#0088FF" />
          <polygon points="68,8 76,38 68,38" fill="#0044CC" />

          {/* South Pointer */}
          <polygon points="68,122 60,92 76,92" fill="#0044CC" />
          <polygon points="68,122 68,92 60,92" fill="#0055EE" />
          <polygon points="68,122 76,92 68,92" fill="#003399" />

          {/* West Pointer */}
          <polygon points="10,65 38,57 38,73" fill="#0077FF" />
          <polygon points="10,65 38,57 38,65" fill="#0099FF" />
          <polygon points="10,65 38,73 38,65" fill="#0055EE" />

          {/* East Pointer */}
          <polygon points="126,65 98,58 98,72" fill="#0066FF" opacity="0.8" />

          {/* Outer 'C' Dynamic Curved Ribbon */}
          <path
            d="M 98,35 A 44 44 0 1 0 98,95 L 86,83 A 27 27 0 1 1 86,47 Z"
            fill="url(#logo-c-grad)"
          />

          {/* Inner Compass Needle */}
          <polygon points="68,65 92,41 78,57" fill="url(#logo-needle-blue)" />
          <polygon points="68,65 92,41 68,49" fill="#00B4FF" />
          <polygon points="68,65 44,89 58,73" fill="#FFFFFF" />
          <polygon points="68,65 44,89 68,81" fill="#E2E8F0" />

          {/* Center Ring Pivot */}
          <circle cx="68" cy="65" r="7.5" fill="#0055EE" stroke="#FFFFFF" strokeWidth="2.5" />
          <circle cx="68" cy="65" r="3" fill="#FFFFFF" />
        </g>
      </svg>

      {/* Typography Wordmark */}
      <div className="flex flex-col justify-center">
        <div className="flex items-center leading-none">
          <span
            className={cn(
              "font-bold tracking-tight text-slate-900",
              size === "sm" && "text-lg",
              size === "md" && "text-xl",
              size === "lg" && "text-2xl"
            )}
          >
            College
          </span>
          <span
            className={cn(
              "font-bold tracking-tight text-[#0066FF]",
              size === "sm" && "text-lg",
              size === "md" && "text-xl",
              size === "lg" && "text-2xl"
            )}
          >
            Compass
          </span>
        </div>
        {showTagline && (
          <span
            className={cn(
              "text-slate-500 font-medium tracking-[0.22em] uppercase mt-0.5",
              size === "sm" && "text-[8px]",
              size === "md" && "text-[9px]",
              size === "lg" && "text-[10px]"
            )}
          >
            Discover • Compare • Decide
          </span>
        )}
      </div>
    </div>
  );

  if (linkHref) {
    return <Link href={linkHref}>{content}</Link>;
  }

  return content;
}
