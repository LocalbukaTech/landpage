"use client";

import { useState, useMemo, useEffect } from "react";
import Image from "next/image";
import { Search, UserPlus, Download, X, Check } from "lucide-react";
import { CommunityMember } from "./types";
import { cn } from "@/lib/utils";

type MemberStatusFilter = "All" | "Active" | "Expiring soon" | "Cancelled";

const MEMBERS_STORAGE_KEY = "localbuka_creator_members_v1";

const INITIAL_MEMBERS_DATA: CommunityMember[] = [
  {
    id: "m1",
    name: "Amaka Obi",
    username: "@amaka_obi",
    avatar: "https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=200&q=80",
    joinDate: "Joined Jan 12 · Renews Oct 12",
    status: "Active",
  },
  {
    id: "m2",
    name: "Tunde Bakare",
    username: "@tunde_bakare",
    avatar: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=200&q=80",
    joinDate: "Joined Feb 3 · Renews Oct 3",
    status: "Active",
  },
  {
    id: "m3",
    name: "Chiamaka Eze",
    username: "@chiamaka_eze",
    avatar: "https://images.unsplash.com/photo-1517841905240-472988babdf9?auto=format&fit=crop&w=200&q=80",
    joinDate: "Joined Mar 19 · Renews Sept 28",
    status: "Expiring soon",
  },
  {
    id: "m4",
    name: "Emeka Nwosu",
    username: "@emeka_nwosu",
    avatar: "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?auto=format&fit=crop&w=200&q=80",
    joinDate: "Joined Apr 7 · Renews Oct 7",
    status: "Active",
  },
  {
    id: "m5",
    name: "Ngozi Adeyemi",
    username: "@ngozi_adeyemi",
    avatar: "https://images.unsplash.com/photo-1544005313-94ddf0286df2?auto=format&fit=crop&w=200&q=80",
    joinDate: "Joined May 22 · Ended Aug 22",
    status: "Cancelled",
  },
  {
    id: "m6",
    name: "Seun Okafor",
    username: "@seun_okafor",
    avatar: "https://images.unsplash.com/photo-1519085360753-af0119f7cbe7?auto=format&fit=crop&w=200&q=80",
    joinDate: "Joined Jun 14 · Renews Oct 14",
    status: "Active",
  },
];

const STATUS_FILTERS: MemberStatusFilter[] = [
  "All",
  "Active",
  "Expiring soon",
  "Cancelled",
];

export function MembersTab() {
  const [members, setMembers] = useState<CommunityMember[]>(() => {
    if (typeof window !== "undefined") {
      try {
        const saved = window.localStorage.getItem(MEMBERS_STORAGE_KEY);
        if (saved) {
          const parsed = JSON.parse(saved);
          if (Array.isArray(parsed) && parsed.length > 0 && parsed[0]?.joinDate) {
            return parsed;
          }
        }
      } catch {
        // ignore
      }
    }
    return INITIAL_MEMBERS_DATA;
  });

  const [searchQuery, setSearchQuery] = useState("");
  const [statusFilter, setStatusFilter] = useState<MemberStatusFilter>("All");
  const [showAddModal, setShowAddModal] = useState(false);
  const [newMemberName, setNewMemberName] = useState("");
  const [newMemberStatus, setNewMemberStatus] = useState<CommunityMember["status"]>("Active");
  const [toastMsg, setToastMsg] = useState<string | null>(null);

  useEffect(() => {
    if (typeof window !== "undefined") {
      try {
        window.localStorage.setItem(MEMBERS_STORAGE_KEY, JSON.stringify(members));
      } catch {
        // ignore
      }
    }
  }, [members]);

  const showToast = (msg: string) => {
    setToastMsg(msg);
    setTimeout(() => setToastMsg(null), 3000);
  };

  const filteredMembers = useMemo(() => {
    return members.filter((member) => {
      const matchesSearch = member.name
        .toLowerCase()
        .includes(searchQuery.toLowerCase().trim());
      const matchesStatus =
        statusFilter === "All" || member.status === statusFilter;
      return matchesSearch && matchesStatus;
    });
  }, [members, searchQuery, statusFilter]);

  const handleAddMember = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newMemberName.trim()) return;
    const cleanName = newMemberName.trim();
    const added: CommunityMember = {
      id: `m-${Date.now()}`,
      name: cleanName,
      username: `@${cleanName.toLowerCase().replace(/[^a-z0-9]+/g, "_")}`,
      avatar:
        "https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=200&q=80",
      joinDate:
        newMemberStatus === "Cancelled"
          ? "Joined Today · Ended Today"
          : "Joined Today · Renews Dec 11",
      status: newMemberStatus,
    };
    setMembers((prev) => [added, ...prev]);
    setNewMemberName("");
    setShowAddModal(false);
    showToast(`${added.name} added to your community!`);
  };

  const handleCycleStatus = (id: string) => {
    const order: CommunityMember["status"][] = ["Active", "Expiring soon", "Cancelled"];
    setMembers((prev) =>
      prev.map((m) => {
        if (m.id !== id) return m;
        const nextStatus = order[(order.indexOf(m.status) + 1) % order.length];
        return {
          ...m,
          status: nextStatus,
        };
      })
    );
    showToast("Member subscription status updated.");
  };

  const handleExportCsv = () => {
    const header = "Name,Username,Membership Info,Status\n";
    const rows = members
      .map((m) => `"${m.name}","${m.username}","${m.joinDate}","${m.status}"`)
      .join("\n");
    const blob = new Blob([header + rows], { type: "text/csv;charset=utf-8;" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = "localbuka-community-members.csv";
    a.click();
    URL.revokeObjectURL(url);
    showToast("Exported member list to CSV!");
  };

  const getStatusBadgeClasses = (status: CommunityMember["status"]) => {
    switch (status) {
      case "Active":
        return "bg-[#1f3528] text-[#4ade80]";
      case "Expiring soon":
        return "bg-[#3a2e16] text-[#fbbf24]";
      case "Cancelled":
        return "bg-[#3b1d1d] text-[#f87171]";
    }
  };

  return (
    <div className="w-full max-w-[680px] text-white space-y-6">
      {toastMsg && (
        <div className="fixed top-20 right-6 z-50 flex items-center gap-2 rounded-2xl bg-[#f5c94d] px-4 py-2.5 text-xs font-bold text-black shadow-xl">
          <Check className="h-4 w-4" />
          <span>{toastMsg}</span>
        </div>
      )}

      {/* Search + Actions Row */}
      <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-3">
        <div className="relative flex-1">
          <Search className="absolute left-4 top-1/2 -translate-y-1/2 h-4 w-4 text-white/50 pointer-events-none" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search members..."
            className="w-full rounded-xl border border-white/15 bg-transparent py-3 pl-11 pr-4 text-sm text-white placeholder:text-white/40 focus:border-[#f5c94d] focus:outline-none transition-colors"
          />
        </div>
        <div className="flex items-center gap-2">
          <button
            type="button"
            onClick={() => setShowAddModal(true)}
            className="inline-flex items-center gap-1.5 rounded-xl bg-[#f5c94d] px-4 py-3 text-xs font-bold text-black hover:bg-[#e5bc42] transition-all cursor-pointer"
          >
            <UserPlus className="h-4 w-4" />
            <span>+ Invite Member</span>
          </button>
          <button
            type="button"
            onClick={handleExportCsv}
            className="inline-flex items-center gap-1.5 rounded-xl bg-[#252525] border border-white/10 px-3.5 py-3 text-xs font-semibold text-white/80 hover:text-white hover:bg-[#2e2e2e] transition-all cursor-pointer"
          >
            <Download className="h-4 w-4" />
            <span>Export CSV</span>
          </button>
        </div>
      </div>

      {/* Filter Pills + Total Count */}
      <div className="flex items-center justify-between gap-2 flex-wrap">
        <div className="flex items-center gap-2 flex-wrap">
          {STATUS_FILTERS.map((filter) => {
            const isSelected = statusFilter === filter;
            return (
              <button
                key={filter}
                type="button"
                onClick={() => setStatusFilter(filter)}
                className={cn(
                  "rounded-full px-4 py-1.5 text-xs font-medium transition-all duration-200 cursor-pointer",
                  isSelected
                    ? "bg-[#f5c94d] text-[#111111] font-semibold"
                    : "bg-[#252525] text-white/75 hover:bg-[#303030] hover:text-white"
                )}
              >
                {filter}
              </button>
            );
          })}
        </div>
        <span className="text-xs text-white/45">
          {filteredMembers.length} of {members.length} members (click badge to change status)
        </span>
      </div>

      {/* Members List */}
      <div className="divide-y divide-white/10 border-t border-white/10">
        {filteredMembers.length === 0 ? (
          <div className="py-12 text-center text-sm text-white/40">
            No members found matching your filter.
          </div>
        ) : (
          filteredMembers.map((member) => (
            <div
              key={member.id}
              className="flex items-center justify-between py-4 gap-4"
            >
              {/* Left: Avatar + Name & Dates */}
              <div className="flex items-center gap-3.5 min-w-0">
                <div className="relative h-11 w-11 rounded-full overflow-hidden bg-[#262626] shrink-0">
                  <Image
                    src={member.avatar}
                    alt={member.name}
                    fill
                    className="object-cover"
                    sizes="44px"
                  />
                </div>
                <div className="min-w-0">
                  <p className="text-sm font-medium text-white truncate">
                    {member.name}
                  </p>
                  <p className="text-xs text-white/45 truncate mt-0.5">
                    {member.joinDate}
                  </p>
                </div>
              </div>

              {/* Right: Status Badge (clickable to cycle status) */}
              <button
                type="button"
                onClick={() => handleCycleStatus(member.id)}
                title="Click to cycle member status"
                className={cn(
                  "shrink-0 rounded-full px-3 py-1 text-[11px] font-medium cursor-pointer hover:opacity-85 transition-opacity",
                  getStatusBadgeClasses(member.status)
                )}
              >
                {member.status}
              </button>
            </div>
          ))
        )}
      </div>

      {/* Add / Invite Member Modal */}
      {showAddModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 backdrop-blur-sm p-4">
          <div className="w-full max-w-md rounded-2xl bg-[#1e1e1e] border border-white/10 p-6 space-y-4 shadow-2xl">
            <div className="flex items-center justify-between">
              <h3 className="text-base font-bold text-white">Invite / Add Community Member</h3>
              <button
                type="button"
                onClick={() => setShowAddModal(false)}
                className="text-white/50 hover:text-white cursor-pointer"
              >
                <X className="h-4 w-4" />
              </button>
            </div>
            <form onSubmit={handleAddMember} className="space-y-4">
              <div>
                <label className="block text-xs text-white/70 mb-1.5">Member Full Name</label>
                <input
                  type="text"
                  required
                  value={newMemberName}
                  onChange={(e) => setNewMemberName(e.target.value)}
                  placeholder="e.g. Damilola Olatunji"
                  className="w-full rounded-xl bg-[#262626] border border-white/10 px-3.5 py-2.5 text-sm text-white focus:border-[#f5c94d] focus:outline-none"
                />
              </div>
              <div>
                <label className="block text-xs text-white/70 mb-1.5">Subscription Status</label>
                <select
                  value={newMemberStatus}
                  onChange={(e) =>
                    setNewMemberStatus(e.target.value as CommunityMember["status"])
                  }
                  className="w-full rounded-xl bg-[#262626] border border-white/10 px-3.5 py-2.5 text-sm text-white focus:border-[#f5c94d] focus:outline-none"
                >
                  <option value="Active">Active (Paid via Paystack)</option>
                  <option value="Expiring soon">Expiring soon</option>
                  <option value="Cancelled">Cancelled</option>
                </select>
              </div>
              <div className="flex justify-end gap-2 pt-2">
                <button
                  type="button"
                  onClick={() => setShowAddModal(false)}
                  className="rounded-xl px-4 py-2 text-xs font-semibold text-white/70 hover:bg-white/10 cursor-pointer"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="rounded-xl bg-[#f5c94d] px-5 py-2 text-xs font-bold text-black hover:bg-[#e5bc42] cursor-pointer"
                >
                  Add Member
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
