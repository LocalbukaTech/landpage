import { ChevronLeft, ChevronRight } from "lucide-react";
import { cn } from "@/lib/utils";

interface PaginationProps {
  currentPage: number;
  totalPages: number;
}

export function Pagination({ currentPage, totalPages }: PaginationProps) {
  // Hardcoded structure based on the design: Previous ... 1 2 3 ... 8 9 10 ... Next
  // For demonstration purposes, we will hardcode the view shown in the design.
  const pages = [1, 2, 3, "...", 8, 9, 10];

  return (
    <div className="flex items-center justify-between px-6 py-4 border-t border-gray-100 bg-white rounded-b-xl">
      <button 
        disabled={currentPage === 1}
        className="flex items-center gap-1.5 px-4 py-2 text-sm font-medium text-gray-600 bg-white border border-gray-200 rounded-lg hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
      >
        <ChevronLeft size={16} />
        Previous
      </button>

      <div className="flex items-center gap-1">
        {pages.map((p, i) => (
          <button
            key={i}
            className={cn(
              "min-w-8 h-8 flex items-center justify-center rounded-lg text-sm font-medium transition-colors",
              p === currentPage 
                ? "bg-[#FCF7E8] text-[#D39B0A]" 
                : p === "..."
                  ? "text-gray-400 cursor-default"
                  : "text-gray-600 hover:bg-gray-50"
            )}
            disabled={p === "..."}
          >
            {p}
          </button>
        ))}
      </div>

      <button 
        disabled={currentPage === totalPages}
        className="flex items-center gap-1.5 px-4 py-2 text-sm font-medium text-gray-600 bg-white border border-gray-200 rounded-lg hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
      >
        Next
        <ChevronRight size={16} />
      </button>
    </div>
  );
}
