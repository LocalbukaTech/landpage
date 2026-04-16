"use client";

import { ChevronLeft, ChevronRight } from "lucide-react";
import { cn } from "@/lib/utils";

interface PaginationProps {
  currentPage: number;
  totalPages: number;
  onPageChange?: (page: number) => void;
}

export function Pagination({ currentPage, totalPages, onPageChange }: PaginationProps) {
  const getVisiblePages = () => {
    const pages: (number | "...")[] = [];

    // Ensure we have at least 1 page for display
    const total = Math.max(1, totalPages);

    if (total <= 7) {
      for (let i = 1; i <= total; i++) pages.push(i);
      return pages;
    }

    // Always show first page
    pages.push(1);

    if (currentPage > 3) {
      pages.push("...");
    }

    // Show pages around current
    const start = Math.max(2, currentPage - 1);
    const end = Math.min(total - 1, currentPage + 1);

    for (let i = start; i <= end; i++) {
      if (!pages.includes(i)) pages.push(i);
    }

    if (currentPage < total - 2) {
      pages.push("...");
    }

    // Always show last page
    if (!pages.includes(total)) {
      pages.push(total);
    }

    return pages;
  };

  const handlePageClick = (page: number | "...") => {
    if (page !== "..." && onPageChange) {
      onPageChange(page);
    }
  };

  // We always show the pagination footer now to give a "finished" feel to the table
  const total = Math.max(1, totalPages);

  return (
    <div className="flex items-center justify-between w-full px-6 py-4 border-t border-gray-100 bg-white rounded-b-xl shadow-sm mt-auto">
      <button 
        onClick={() => currentPage > 1 && onPageChange?.(currentPage - 1)}
        disabled={currentPage <= 1}
        className="flex items-center gap-1.5 px-4 py-2 text-sm font-medium text-gray-600 bg-white border border-gray-200 rounded-lg hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed transition-all active:scale-95"
      >
        <ChevronLeft size={16} />
        Previous
      </button>

      <div className="flex items-center gap-1">
        {getVisiblePages().map((p, i) => (
          <button
            key={i}
            onClick={() => handlePageClick(p)}
            className={cn(
              "min-w-[36px] h-9 flex items-center justify-center rounded-lg text-sm font-semibold transition-all duration-200",
              p === currentPage 
                ? "bg-[#FCF7E8] text-[#D19909] ring-1 ring-[#fbbe15]/20" 
                : p === "..."
                  ? "text-gray-400 cursor-default"
                  : "text-gray-600 hover:bg-gray-50 hover:text-gray-900"
            )}
            disabled={p === "..."}
          >
            {p}
          </button>
        ))}
      </div>

      <button 
        onClick={() => currentPage < total && onPageChange?.(currentPage + 1)}
        disabled={currentPage >= total}
        className="flex items-center gap-1.5 px-4 py-2 text-sm font-medium text-gray-600 bg-white border border-gray-200 rounded-lg hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed transition-all active:scale-95"
      >
        Next
        <ChevronRight size={16} />
      </button>
    </div>
  );
}
