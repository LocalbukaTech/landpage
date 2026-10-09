"use client";

import { useState } from "react";
import Image from "next/image";
import { Search, UserCheck, Filter } from "lucide-react";
import { CommunityMember } from "./types";

const MEMBERS_DATA: CommunityMember[] = [
  {
    id: "m-1",
    name: "Cheftory226",
    username: "@cheftory226",
    avatar:
      "https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=150&q=80",
    joinDate: "11 Sep, 2026",
    status: "Active",
  },
  {
    id: "m-2",
    name: "Supa_byte",
    username: "@supa_byte",
    avatar:
      "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=150&q=80",
    joinDate: "15 Sep, 2026",
    status: "Cancelled",
  },
  {
    id: "m-3",
    name: "Cookbook223",
    username: "@cookbook223",
    avatar:
      "https://images.unsplash.com/photo-1494790108377-be9c29b29330?auto=format&fit=crop&w=150&q=80",
    joinDate: "20 Sep, 2026",
    status: "Expiring soon",
  },
  {
    id: "m-4",
    name: "Chefjulia19",
    username: "@chefjulia19",
    avatar:
      "https://images.unsplash.com/photo-1517841905240-472988babdf9?auto=format&fit=crop&w=150&q=80",
    joinDate: "19 Sep, 2026",
    status: "Active",
  },
  {
    id: "m-5",
    name: "Foodfinder",
    username: "@foodfinder",
    avatar:
      "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?auto=format&fit=crop&w=150&q=80",
    joinDate: "22 Sep, 2026",
    status: "Cancelled",
  },
  {
    id: "m-6",
    name: "Thechef88",
    username: "@thechef88",
    avatar:
      "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?auto=format&fit=crop&w=150&q=80",
    joinDate: "23 Sep, 2026",
    status: "Expiring soon",
  },
];

export function MembersTab() {
  const [searchQuery, setSearchQuery] = useState("");
  const [statusFilter, setStatusFilter] = useState<string>("All");

  const filteredMembers = MEMBERS_DATA.filter((member) => {
    const matchesSearch = member.name
      .toLowerCase()
      .includes(searchQuery.toLowerCase());
    const matchesStatus =
      statusFilter === "All" || member.status === statusFilter;
    return matchesSearch && matchesStatus;
  });

  return (
    <div className="w-full max-w-[700px] text-white space-y-6 pt-2">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <h2 className="text-xl md:text-2xl font-bold tracking-tight text-white">
          All Members (1,200)
        </h2>

        {/* Search bar */}
        <div className="relative w-full sm:w-64">
          <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 h-4 w-4 text-white/40" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search members..."
            className="w-full rounded-full border border-white/10 bg-[#1c1c1c] pl-10 pr-4 py-2 text-xs md:text-sm text-white placeholder-white/40 focus:border-[#f5c94d] focus:outline-none focus:ring-1 focus:ring-[#f5c94d]"
          />
        </div>
      </div>

      {/* Filter Chips */}
      <div className="flex items-center gap-2 overflow-x-auto pb-1 text-xs">
        {["All", "Active", "Expiring soon", "Cancelled"].map((status) => (
          <button
            key={status}
            type="button"
            onClick={() => setStatusFilter(status)}
            className={`rounded-full px-3.5 py-1.5 font-medium transition-all ${
              statusFilter === status
                ? "bg-white/20 text-white"
                : "bg-[#1f1f1f] text-white/50 hover:text-white"
            }`}
          >
            {status}
          </button>
        ))}
      </div>

      {/* Members Table Card (Matching Screenshot 4) */}
      <div className="rounded-[24px] bg-[#1a1a1a] border border-white/5 p-4 sm:p-6 shadow-xl">
        <div className="w-full">
          {/* Table Header Row */}
          <div className="grid grid-cols-12 pb-4 text-xs sm:text-sm font-semibold text-white/90 border-b border-white/5 px-2">
            <div className="col-span-5 sm:col-span-5">User name</div>
            <div className="col-span-4 sm:col-span-4 text-center sm:text-left">
              Join Date
            </div>
            <div className="col-span-3 sm:col-span-3 text-right">
              Membership status
            </div>
          </div>

          {/* Members List Rows */}
          <div className="divide-y divide-white/5">
            {filteredMembers.map((member) => (
              <div
                key={member.id}
                className="grid grid-cols-12 items-center py-4 px-2 hover:bg-white/[0.02] transition-colors rounded-xl"
              >
                {/* Column 1: User name & Avatar */}
                <div className="col-span-5 sm:col-span-5 flex items-center gap-3 min-w-0 pr-2">
                  <div className="relative h-9 w-9 shrink-0 rounded-full overflow-hidden bg-[#242424]">
                    <Image
                      src={member.avatar}
                      alt={member.name}
                      fill
                      className="object-cover"
                      sizes="36px"
                    />
                  </div>
                  <span className="truncate text-xs sm:text-sm font-medium text-white">
                    {member.name}
                  </span>
                </div>

                {/* Column 2: Join Date */}
                <div className="col-span-4 sm:col-span-4 text-xs sm:text-sm text-white/70 text-center sm:text-left">
                  {member.joinDate}
                </div>

                {/* Column 3: Membership Status Badge */}
                <div className="col-span-3 sm:col-span-3 flex justify-end">
                  {member.status === "Active" && (
                    <span className="inline-flex items-center gap-1.5 rounded-full bg-[#13261a] border border-[#22c55e]/20 px-3 py-1 text-[11px] sm:text-xs font-medium text-[#4ade80]">
                      <span className="h-1.5 w-1.5 rounded-full bg-[#22c55e]" />
                      Active
                    </span>
                  )}

                  {member.status === "Cancelled" && (
                    <span className="inline-flex items-center gap-1.5 rounded-full bg-[#2b1414] border border-[#ef4444]/20 px-3 py-1 text-[11px] sm:text-xs font-medium text-[#ef4444]">
                      <span className="h-1.5 w-1.5 rounded-full bg-[#ef4444]" />
                      Cancelled
                    </span>
                  )}

                  {member.status === "Expiring soon" && (
                    <span className="inline-flex items-center gap-1.5 rounded-full bg-[#2b210e] border border-[#f59e0b]/20 px-3 py-1 text-[11px] sm:text-xs font-medium text-[#f59e0b]">
                      <span className="h-1.5 w-1.5 rounded-full bg-[#f59e0b]" />
                      Expiring soon
                    </span>
                  )}
                </div>
              </div>
            ))}

            {filteredMembers.length === 0 && (
              <div className="py-12 text-center text-sm text-white/40">
                No members found matching &quot;{searchQuery}&quot;
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
