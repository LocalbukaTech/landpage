"use client";

import { useState, useMemo } from "react";
import Link from "next/link";
import { ChevronUp, ChevronDown, ArrowUpDown, Eye } from "lucide-react";
import { cn } from "@/lib/utils";
import type { AdminUser, UserStatus } from "@/types/admin";

/* ── Status badge: colored dot + text in subtle pill ── */
function StatusBadge({ status }: { status: UserStatus }) {
    const config: Record<string, { dot: string; text: string; bg: string }> = {
        Active:    { dot: "bg-green-500",  text: "text-green-600",  bg: "bg-green-50" },
        Banned:    { dot: "bg-red-500",    text: "text-red-600",    bg: "bg-red-50" },
        Suspended: { dot: "bg-orange-400", text: "text-orange-500", bg: "bg-orange-50" },
        Flagged:   { dot: "bg-amber-500",  text: "text-amber-600",  bg: "bg-amber-50" },
    };
    const c = config[status] ?? config.Active;

    return (
        <span className={cn("inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-xs font-medium", c.bg, c.text)}>
            <span className={cn("w-1.5 h-1.5 rounded-full", c.dot)} />
            {status}
        </span>
    );
}

/* ── Sortable column config ── */
export type SortDirection = "asc" | "desc" | null;
export type SortColumn = keyof AdminUser | null;

const sortableColumns: { key: keyof AdminUser; label: string }[] = [
    { key: "id", label: "User ID" },
    { key: "email", label: "Email" },
    { key: "createdAt", label: "Registration Date" },
    { key: "location", label: "Location" },
    { key: "totalPosts", label: "Total Posts" },
];

/* Status column has NO inline sort arrows — sorting is handled by the ArrowUpDown icon */
const STATUS_COL_KEY: keyof AdminUser = "status";
const STATUS_COL_LABEL = "Status";

/* ── Props ── */
interface RealAccountsTableProps {
    users: AdminUser[];
    selectedIds: Set<string>;
    onToggleSelect: (id: string) => void;
    onToggleSelectAll: () => void;
    allSelected: boolean;
    sortColumn: SortColumn;
    sortDirection: SortDirection;
    onSortChange: (column: SortColumn, direction: SortDirection) => void;
}

export function RealAccountsTable({
    users,
    selectedIds,
    onToggleSelect,
    onToggleSelectAll,
    allSelected,
    sortColumn,
    sortDirection,
    onSortChange,
}: RealAccountsTableProps) {

    // ── Column header sort ──
    const handleHeaderSort = (key: keyof AdminUser) => {
        if (sortColumn === key) {
            if (sortDirection === "asc") onSortChange(key, "desc");
            else if (sortDirection === "desc") {
                onSortChange(null, null);
            }
        } else {
            onSortChange(key, "asc");
        }
    };

    // ── Dedicated sort icon toggles Status sort ──
    const handleStatusSort = () => {
        handleHeaderSort(STATUS_COL_KEY);
    };

    const sortedUsers = users;

    const isStatusSorted = sortColumn === STATUS_COL_KEY;

    return (
        <div className="overflow-x-auto">
            <table className="w-full text-sm">
                {/* ── Header ── */}
                <thead>
                    <tr className="border-b border-zinc-200 bg-[#F8F9FA]">
                        <th className="w-12 px-4 py-3">
                            <input
                                type="checkbox"
                                checked={allSelected}
                                onChange={onToggleSelectAll}
                                className="w-4 h-4 rounded border-zinc-300 text-[#fbbe15] focus:ring-[#fbbe15]/40 accent-[#fbbe15] cursor-pointer"
                            />
                        </th>

                        {/* Sortable columns (with chevron arrows) */}
                        {sortableColumns.map((col) => {
                            const isSorted = sortColumn === col.key;
                            return (
                                <th
                                    key={col.key}
                                    onClick={() => handleHeaderSort(col.key)}
                                    className="px-4 py-3 text-left text-xs font-semibold text-zinc-500 tracking-wider cursor-pointer select-none group"
                                >
                                    <span className="inline-flex items-center gap-1.5">
                                        {col.label}
                                        <span
                                            className={cn(
                                                "inline-flex flex-col -space-y-1 transition-opacity",
                                                isSorted
                                                    ? "opacity-100"
                                                    : "opacity-0 group-hover:opacity-40"
                                            )}
                                        >
                                            <ChevronUp
                                                size={12}
                                                strokeWidth={2.5}
                                                className={cn(
                                                    "transition-colors",
                                                    isSorted && sortDirection === "asc"
                                                        ? "text-zinc-800"
                                                        : "text-zinc-400"
                                                )}
                                            />
                                            <ChevronDown
                                                size={12}
                                                strokeWidth={2.5}
                                                className={cn(
                                                    "transition-colors",
                                                    isSorted && sortDirection === "desc"
                                                        ? "text-zinc-800"
                                                        : "text-zinc-400"
                                                )}
                                            />
                                        </span>
                                    </span>
                                </th>
                            );
                        })}

                        {/* Status column — plain text, NO sort arrows */}
                        <th className="px-4 py-3 text-left text-xs font-semibold text-zinc-500 tracking-wider select-none">
                            {STATUS_COL_LABEL}
                        </th>

                        {/* Sort icon column — sorts by Status */}
                        <th className="w-12 px-4 py-3">
                            <button
                                onClick={handleStatusSort}
                                title={
                                    isStatusSorted
                                        ? `Sorted ${sortDirection === "asc" ? "A → Z" : "Z → A"}`
                                        : "Sort by Status"
                                }
                                className={cn(
                                    "w-7 h-7 flex items-center justify-center rounded transition-colors",
                                    isStatusSorted
                                        ? "bg-[#fbbe15]/20 text-[#1a1a1a]"
                                        : "text-zinc-400 hover:text-zinc-600 hover:bg-zinc-100"
                                )}
                            >
                                <ArrowUpDown size={15} />
                            </button>
                        </th>
                    </tr>
                </thead>

                {/* ── Body ── */}
                <tbody className="divide-y divide-zinc-100">
                    {sortedUsers.map((user) => {
                        const isSelected = selectedIds.has(user.id);
                        return (
                            <tr
                                key={user.id}
                                className={cn(
                                    "transition-colors hover:bg-zinc-50/80",
                                    isSelected ? "bg-[#fbbe15]/5" : ""
                                )}
                            >
                                <td className="px-4 py-3">
                                    <input
                                        type="checkbox"
                                        checked={isSelected}
                                        onChange={() => onToggleSelect(user.id)}
                                        className="w-4 h-4 rounded border-zinc-300 text-[#fbbe15] focus:ring-[#fbbe15]/40 accent-[#fbbe15] cursor-pointer"
                                    />
                                </td>
                                <td className="px-4 py-3 text-zinc-700 font-medium">
                                    {user.id}
                                </td>
                                <td className="px-4 py-3 text-zinc-500">{user.email || "-"}</td>
                                <td className="px-4 py-3 text-zinc-500">
                                    {user.createdAt ? new Date(user.createdAt).toLocaleDateString() : "-"}
                                </td>
                                <td className="px-4 py-3 text-zinc-500">{user.location || "-"}</td>
                                <td className="px-4 py-3 text-zinc-500">{user.totalPosts ?? "-"}</td>
                                <td className="px-4 py-3">
                                    <StatusBadge status={user.status} />
                                </td>
                                <td className="px-4 py-3">
                                    <Link
                                        href={`/secure-admin/user-management/${user.id}`}
                                        className="p-1 text-zinc-400 hover:text-zinc-600 transition-colors"
                                    >
                                        <Eye size={18} />
                                    </Link>
                                </td>
                            </tr>
                        );
                    })}

                    {sortedUsers.length === 0 && (
                        <tr>
                            <td
                                colSpan={sortableColumns.length + 3}
                                className="px-4 py-12 text-center text-zinc-400"
                            >
                                No users found.
                            </td>
                        </tr>
                    )}
                </tbody>
            </table>
        </div>
    );
}
