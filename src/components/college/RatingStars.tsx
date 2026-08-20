import React from "react";
import { Star } from "lucide-react";
import { cn } from "@/lib/utils";

export interface RatingStarsProps {
  rating: number;
  showScore?: boolean;
  reviewCount?: number;
  size?: "sm" | "md" | "lg";
  className?: string;
}

export function RatingStars({
  rating,
  showScore = true,
  reviewCount,
  size = "md",
  className = "",
}: RatingStarsProps) {
  const sizeClasses = {
    sm: "h-3.5 w-3.5",
    md: "h-4 w-4",
    lg: "h-5 w-5",
  };

  const textClasses = {
    sm: "text-xs",
    md: "text-sm",
    lg: "text-base font-semibold",
  };

  return (
    <div className={cn("inline-flex items-center gap-1.5", className)}>
      <div className="inline-flex items-center gap-0.5">
        {[1, 2, 3, 4, 5].map((star) => {
          const isFilled = rating >= star;
          const isHalf = !isFilled && rating >= star - 0.5;

          return (
            <Star
              key={star}
              className={cn(
                sizeClasses[size],
                isFilled
                  ? "text-amber-500 fill-amber-500"
                  : isHalf
                  ? "text-amber-500 fill-amber-500/50"
                  : "text-slate-200 fill-slate-100"
              )}
            />
          );
        })}
      </div>

      {showScore && (
        <span className={cn("font-bold text-slate-800", textClasses[size])}>
          {rating.toFixed(1)}
        </span>
      )}

      {reviewCount !== undefined && (
        <span className="text-xs text-slate-500">
          ({reviewCount})
        </span>
      )}
    </div>
  );
}
