"use client";

import React from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { ArrowUpDown, ChevronDown } from "lucide-react";

export function CollegeSortSelect() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const currentSort = searchParams.get("sort") || "rating_desc";

  const handleSortChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const params = new URLSearchParams(searchParams.toString());
    params.set("sort", e.target.value);
    params.set("page", "1");
    router.push(`/colleges?${params.toString()}`);
  };

  const sortOptions = [
    { value: "rating_desc", label: "Rating: High to Low" },
    { value: "placement_desc", label: "Avg Package: High to Low" },
    { value: "fees_asc", label: "Fees: Low to High" },
    { value: "fees_desc", label: "Fees: High to Low" },
    { value: "name_asc", label: "Name: A to Z" },
  ];

  return (
    <div className="relative inline-flex items-center">
      <div className="pointer-events-none absolute left-3 flex items-center text-slate-400">
        <ArrowUpDown className="h-3.5 w-3.5" />
      </div>
      <select
        value={currentSort}
        onChange={handleSortChange}
        className="appearance-none rounded-lg border border-slate-300 bg-white py-1.5 pl-8 pr-8 text-xs font-medium text-slate-700 shadow-2xs transition-colors hover:border-slate-400 focus:border-blue-600 focus:outline-none focus:ring-2 focus:ring-blue-600 cursor-pointer"
      >
        {sortOptions.map((opt) => (
          <option key={opt.value} value={opt.value}>
            {opt.label}
          </option>
        ))}
      </select>
      <div className="pointer-events-none absolute right-2.5 flex items-center text-slate-400">
        <ChevronDown className="h-3.5 w-3.5" />
      </div>
    </div>
  );
}
