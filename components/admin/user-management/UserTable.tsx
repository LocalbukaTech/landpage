"use client";

import { useState, useMemo } from "react";
import { ChevronUp, ChevronDown, ArrowUpDown } from "lucide-react";
import { cn } from "@/lib/utils";
import { UserRowActions } from "@/components/admin/user-management/UserRowActions";
import type { AdminUser } from "@/types/admin";

export type SortDirection = "asc" | "desc" | null;
export type SortColumn = keyof AdminUser | null;

interface UserTableProps {
    users: AdminUser[];
    selectedIds: Set<string>;
    onToggleSelect: (id: string) => void;
    onToggleSelectAll: () => void;
    allSelected: boolean;
    onMarkSafe?: (userId: string) => void;
    onBanUser?: (userId: string) => void;
}

/* Columns that show sort chevrons on their headers */
const sortableColumns: { key: keyof AdminUser; label: string }[] = [
    { key: "userId", label: "User ID" },
    { key: "signUpIp", label: "Sign-Up IP" },
    { key: "email", label: "Email" },
    { key: "registrationDate", label: "Registration Date" },
    { key: "location", label: "Location" },
];

/* System Flag Reason has NO inline sort arrows — sorting for it
   is handled by the dedicated ArrowUpDown icon in the last column */
const FLAG_COL_KEY: keyof AdminUser = "systemFlagReason";
const FLAG_COL_LABEL = "System Flag Reason";

export function UserTable({
    users,
    selectedIds,
    onToggleSelect,
    onToggleSelectAll,
    allSelected,
    onMarkSafe,
    onBanUser,
}: UserTableProps) {
    const [sortColumn, setSortColumn] = useState<SortColumn>(null);
    const [sortDirection, setSortDirection] = useState<SortDirection>(null);

    // ── Column header sort (for sortable columns) ──
    const handleHeaderSort = (key: keyof AdminUser) => {
        if (sortColumn === key) {
            if (sortDirection === "asc") setSortDirection("desc");
            else if (sortDirection === "desc") {
                setSortColumn(null);
                setSortDirection(null);
            }
        } else {
            setSortColumn(key);
            setSortDirection("asc");
        }
    };

    // ── Dedicated sort icon toggles System Flag Reason sort ──
    const handleFlagSort = () => {
        handleHeaderSort(FLAG_COL_KEY);
    };

    // ── Sort pipeline ──
    const sortedUsers = useMemo(() => {
        if (!sortColumn || !sortDirection) return users;
        return [...users].sort((a, b) => {
            const aVal = String(a[sortColumn] ?? "");
            const bVal = String(b[sortColumn] ?? "");
            const cmp = aVal.localeCompare(bVal);
            return sortDirection === "asc" ? cmp : -cmp;
        });
    }, [users, sortColumn, sortDirection]);

    const isFlagSorted = sortColumn === FLAG_COL_KEY;

    return (
        <div className="overflow-x-auto">
            <table className="w-full text-sm">
                {/* ── Header ── */}
                <thead>
                    <tr className="border-b border-zinc-200 bg-zinc-50/50">
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

                        {/* System Flag Reason — plain text, NO sort arrows */}
                        <th className="px-4 py-3 text-left text-xs font-semibold text-zinc-500 tracking-wider select-none">
                            {FLAG_COL_LABEL}
                        </th>

                        {/* Sort icon column — sorts by System Flag Reason */}
                        <th className="w-12 px-4 py-3">
                            <button
                                onClick={handleFlagSort}
                                title={
                                    isFlagSorted
                                        ? `Sorted ${sortDirection === "asc" ? "A → Z" : "Z → A"}`
                                        : "Sort by System Flag Reason"
                                }
                                className={cn(
                                    "w-7 h-7 flex items-center justify-center rounded transition-colors",
                                    isFlagSorted
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
                                    {user.userId}
                                </td>
                                <td className="px-4 py-3 text-zinc-500">{user.signUpIp}</td>
                                <td className="px-4 py-3 text-zinc-500">{user.email}</td>
                                <td className="px-4 py-3 text-zinc-500">
                                    {user.registrationDate}
                                </td>
                                <td className="px-4 py-3 text-zinc-500">{user.location}</td>
                                <td className="px-4 py-3 text-zinc-500">
                                    {user.systemFlagReason}
                                </td>
                                <td className="px-4 py-3">
                                    <UserRowActions
                                        userId={user.id}
                                        onMarkSafe={onMarkSafe}
                                        onBanUser={onBanUser}
                                    />
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
