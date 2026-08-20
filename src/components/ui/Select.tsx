import React, { forwardRef } from "react";
import { cn } from "@/lib/utils";
import { ChevronDown } from "lucide-react";

export interface SelectOption {
  value: string;
  label: string;
}

export interface SelectProps
  extends React.SelectHTMLAttributes<HTMLSelectElement> {
  label?: string;
  options: (SelectOption | string)[];
  error?: string;
  helperText?: string;
}

export const Select = forwardRef<HTMLSelectElement, SelectProps>(
  ({ className, label, options, error, helperText, id, ...props }, ref) => {
    const selectId = id || (label ? label.toLowerCase().replace(/\s+/g, "-") : undefined);

    return (
      <div className="w-full space-y-1.5">
        {label && (
          <label
            htmlFor={selectId}
            className="block text-xs font-bold text-slate-800"
          >
            {label}
          </label>
        )}
        <div className="relative">
          <select
            id={selectId}
            ref={ref}
            className={cn(
              "w-full appearance-none rounded-lg border bg-white px-3 py-2 pr-9 text-sm text-slate-900 shadow-xs transition-colors cursor-pointer",
              "focus:outline-none focus:ring-1 focus:ring-slate-900 focus:border-slate-900",
              error
                ? "border-red-500 focus:ring-red-500 focus:border-red-500"
                : "border-slate-300 hover:border-slate-400",
              className
            )}
            {...props}
          >
            {options.map((opt) => {
              const value = typeof opt === "string" ? opt : opt.value;
              const labelText = typeof opt === "string" ? opt : opt.label;
              return (
                <option key={value} value={value} className="bg-white text-slate-900">
                  {labelText}
                </option>
              );
            })}
          </select>
          <div className="pointer-events-none absolute right-3 top-1/2 -translate-y-1/2 text-slate-400">
            <ChevronDown className="h-4 w-4" />
          </div>
        </div>
        {error && <p className="text-xs font-medium text-red-600">{error}</p>}
        {helperText && !error && (
          <p className="text-xs text-slate-500">{helperText}</p>
        )}
      </div>
    );
  }
);

Select.displayName = "Select";
