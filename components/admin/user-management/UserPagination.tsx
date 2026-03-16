"use client";

import { ArrowLeft, ArrowRight } from "lucide-react";
import { cn } from "@/lib/utils";

interface UserPaginationProps {
    currentPage: number;
    totalPages: number;
    onPageChange: (page: number) => void;
}

export function UserPagination({ currentPage, totalPages, onPageChange }: UserPaginationProps) {
    const getVisiblePages = () => {
        const pages: (number | "...")[] = [];

        if (totalPages <= 7) {
            for (let i = 1; i <= totalPages; i++) pages.push(i);
            return pages;
        }

        // Always show first 3 pages
        pages.push(1, 2, 3);

        // Ellipsis if gap between first block and last block
        if (totalPages > 6) pages.push("...");

        // Always show last 3 pages
        for (let i = totalPages - 2; i <= totalPages; i++) {
            if (!pages.includes(i)) pages.push(i);
        }

        return pages;
    };

    return (
        <div className="flex items-center justify-between w-full pt-6">
            {/* Previous */}
            <button
                onClick={() => onPageChange(currentPage - 1)}
                disabled={currentPage === 1}
                className="flex items-center gap-2 text-zinc-500 text-sm font-medium hover:text-zinc-700 transition-colors disabled:opacity-30 disabled:cursor-not-allowed border border-zinc-200 rounded-full px-4 py-2 bg-white hover:bg-zinc-50"
            >
                <ArrowLeft size={14} strokeWidth={2} />
                Previous
            </button>

            {/* Page Numbers */}
            <div className="flex items-center gap-0.5">
                {getVisiblePages().map((page, i) =>
                    page === "..." ? (
                        <span
                            key={`dots-${i}`}
                            className="w-10 h-10 flex items-center justify-center text-zinc-400 text-sm select-none"
                        >
                            …
                        </span>
                    ) : (
                        <button
                            key={page}
                            onClick={() => onPageChange(page)}
                            className={cn(
                                "w-10 h-10 rounded-lg flex items-center justify-center text-sm font-medium transition-colors",
                                currentPage === page
                                    ? "bg-[#fbbe15]/15 text-[#b8860b] border border-[#fbbe15]/30"
                                    : "text-zinc-500 hover:text-zinc-700 hover:bg-zinc-100"
                            )}
                        >
                            {page}
                        </button>
                    )
                )}
            </div>

            {/* Next */}
            <button
                onClick={() => onPageChange(currentPage + 1)}
                disabled={currentPage === totalPages}
                className="flex items-center gap-2 text-zinc-500 text-sm font-medium hover:text-zinc-700 transition-colors disabled:opacity-30 disabled:cursor-not-allowed border border-zinc-200 rounded-full px-4 py-2 bg-white hover:bg-zinc-50"
            >
                Next
                <ArrowRight size={14} strokeWidth={2} />
            </button>
        </div>
    );
}
