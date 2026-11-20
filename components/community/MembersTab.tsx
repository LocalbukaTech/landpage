"use client";

import { useState, useMemo, useEffect } from "react";
import Image from "next/image";
import {
  Search,
  UserPlus,
  Download,
  X,
  Check,
  Loader2,
  Users,
  Sparkles,
} from "lucide-react";
import { CommunityMember } from "./types";
import { cn } from "@/lib/utils";
import { useAuth } from "@/context/AuthContext";
import {
  useCommunityMembers,
  useInviteCommunityMember,
  useDeclineCommunityInvite,
} from "@/lib/api/services/community.hooks";
import apiClient from "@/lib/api/client";

type MemberStatusFilter =
  | "All"
  | "Active"
  | "Pending Invite"
  | "Expiring soon"
  | "Cancelled";

const MEMBERS_STORAGE_KEY = "localbuka_creator_members_v2";
const FAKE_SEED_MEMBER_IDS = new Set(["m1", "m2", "m3", "m4", "m5", "m6"]);

const STATUS_FILTERS: MemberStatusFilter[] = [
  "All",
  "Active",
  "Pending Invite",
  "Expiring soon",
  "Cancelled",
];

interface RealUserSuggestion {
  id: string;
  name: string;
  username: string;
  avatar: string;
  email?: string;
}

interface MembersTabProps {
  communitySlug?: string;
  communityName?: string;
}

export function MembersTab({
  communitySlug = "",
  communityName = "My Community",
}: MembersTabProps) {
  const { user: authUser } = useAuth();
  const { data: liveMembers } = useCommunityMembers(communitySlug);
  const inviteMutation = useInviteCommunityMember();
  const cancelInviteMutation = useDeclineCommunityInvite();

  const [members, setMembers] = useState<CommunityMember[]>(() => {
    if (typeof window !== "undefined") {
      try {
        const saved = window.localStorage.getItem(MEMBERS_STORAGE_KEY);
        if (saved) {
          const parsed = JSON.parse(saved);
          if (Array.isArray(parsed)) {
            return parsed
              .filter((m: any) => m && !FAKE_SEED_MEMBER_IDS.has(m.id))
              .map((m: CommunityMember) =>
                m.joinDate?.startsWith("Invited Today") && m.status === "Active"
                  ? {
                      ...m,
                      status: "Pending Invite",
                      joinDate: "Invitation sent · Waiting for user to accept",
                    }
                  : m
              );
          }
        }
      } catch {
        // ignore
      }
    }
    return [];
  });

  // Merge real backend members + authenticated creator (no fake accounts)
  useEffect(() => {
    setMembers((prev) => {
      const mergedMap = new Map<string, CommunityMember>();

      // Add live backend members first
      if (Array.isArray(liveMembers)) {
        for (const m of liveMembers) {
          const formattedDate = m.joinedAt
            ? `Joined ${new Date(m.joinedAt).toLocaleDateString("en-US", {
                month: "short",
                day: "numeric",
              })}`
            : "Joined Recently";
          mergedMap.set(m.username.toLowerCase(), {
            id: m.id,
            name: m.name,
            username: m.username,
            avatar: m.avatar || "/images/community/avatar-1.png",
            joinDate:
              m.role === "creator"
                ? `${formattedDate} · Community Creator`
                : formattedDate,
            status: m.status,
          });
        }
      }

      // Include current logged-in creator if list has no creator yet
      if (authUser) {
        const handle = authUser.username
          ? `@${authUser.username.replace(/^@/, "")}`
          : `@${(authUser.fullName || "creator")
              .toLowerCase()
              .replace(/[^a-z0-9_]/g, "_")}`;
        if (!mergedMap.has(handle.toLowerCase())) {
          mergedMap.set(handle.toLowerCase(), {
            id: `creator-${authUser.id}`,
            name: authUser.fullName || authUser.username || "Creator",
            username: handle,
            avatar:
              authUser.avatar ||
              authUser.image_url ||
              "/images/community/avatar-1.png",
            joinDate: "Joined Today · Community Creator",
            status: "Active",
          });
        }
      }

      // Preserve any real invited users from local state
      for (const existing of prev) {
        if (FAKE_SEED_MEMBER_IDS.has(existing.id)) continue;
        const key = existing.username.toLowerCase();
        if (!mergedMap.has(key)) {
          mergedMap.set(key, existing);
        }
      }

      return Array.from(mergedMap.values());
    });
  }, [liveMembers, authUser]);

  const [searchQuery, setSearchQuery] = useState("");
  const [statusFilter, setStatusFilter] = useState<MemberStatusFilter>("All");
  const [showAddModal, setShowAddModal] = useState(false);
  const [inviteSearch, setInviteSearch] = useState("");
  const [recommendedUsers, setRecommendedUsers] = useState<RealUserSuggestion[]>([]);
  const [isSearchingUsers, setIsSearchingUsers] = useState(false);
  const [newMemberStatus, setNewMemberStatus] =
    useState<CommunityMember["status"]>("Active");
  const [toastMsg, setToastMsg] = useState<string | null>(null);

  // Persist real members to localStorage
  useEffect(() => {
    if (typeof window !== "undefined") {
      try {
        window.localStorage.setItem(
          MEMBERS_STORAGE_KEY,
          JSON.stringify(members)
        );
      } catch {
        // ignore
      }
    }
  }, [members]);

  // Fetch real users using the exact same /search?type=users API used for @tagging
  useEffect(() => {
    const queryTerm = inviteSearch.trim() || searchQuery.trim() || "a";
    const timer = setTimeout(async () => {
      setIsSearchingUsers(true);
      try {
        const res = await apiClient.get("/search", {
          params: { q: queryTerm, type: "users" },
        });
        const rawUsers =
          res?.data?.data?.users ||
          res?.data?.users ||
          (Array.isArray(res?.data?.data) ? res.data.data : []);
        if (Array.isArray(rawUsers)) {
          const mapped: RealUserSuggestion[] = rawUsers
            .slice(0, 10)
            .map((u: any) => {
              const handle =
                u.username ||
                (u.fullName || u.name || "user")
                  .toLowerCase()
                  .replace(/[^a-z0-9_]/g, "_");
              return {
                id: String(u.id || handle),
                name: u.fullName || u.name || handle,
                username: `@${handle.replace(/^@/, "")}`,
                avatar:
                  u.avatar ||
                  u.image_url ||
                  "/images/community/avatar-1.png",
                email: u.email,
              };
            });
          setRecommendedUsers(mapped);
        }
      } catch {
        setRecommendedUsers([]);
      } finally {
        setIsSearchingUsers(false);
      }
    }, 250);

    return () => clearTimeout(timer);
  }, [inviteSearch, searchQuery]);

  const showToast = (msg: string) => {
    setToastMsg(msg);
    setTimeout(() => setToastMsg(null), 3000);
  };

  const filteredMembers = useMemo(() => {
    return members.filter((member) => {
      const q = searchQuery.toLowerCase().trim();
      const matchesSearch =
        !q ||
        member.name.toLowerCase().includes(q) ||
        member.username.toLowerCase().includes(q);
      const matchesStatus =
        statusFilter === "All" || member.status === statusFilter;
      return matchesSearch && matchesStatus;
    });
  }, [members, searchQuery, statusFilter]);

  // Real users from LocalBuka not yet in this community
  const unjoinedRecommendations = useMemo(() => {
    const existingHandles = new Set(
      members.map((m) => m.username.toLowerCase())
    );
    return recommendedUsers.filter(
      (u) => !existingHandles.has(u.username.toLowerCase())
    );
  }, [recommendedUsers, members]);

  const handleInviteRealUser = (u: RealUserSuggestion) => {
    const exists = members.some(
      (m) => m.username.toLowerCase() === u.username.toLowerCase()
    );
    if (exists) {
      showToast(`${u.name} already has an invitation or membership.`);
      return;
    }

    // Fire real backend invitation endpoint (creates PENDING membership + Notification bell alert for invitee)
    if (communitySlug) {
      inviteMutation.mutate({ idOrSlug: communitySlug, userId: u.id });
    }

    const pendingInvite: CommunityMember = {
      id: `invite-${u.id}-${Date.now()}`,
      userId: u.id,
      name: u.name,
      username: u.username,
      avatar: u.avatar,
      joinDate: "Invitation sent · Waiting for user to accept in Notifications",
      status: "Pending Invite",
    };
    setMembers((prev) => [pendingInvite, ...prev]);
    showToast(
      `Invitation sent to ${u.name} (${u.username})! It will appear in their Notifications.`
    );
  };

  const handleCancelPendingInvite = (member: CommunityMember) => {
    if (communitySlug && member.userId) {
      cancelInviteMutation.mutate({
        idOrSlug: communitySlug,
        userId: member.userId,
      });
    }
    setMembers((prev) => prev.filter((m) => m.id !== member.id));
    showToast(`Invitation to ${member.name} cancelled.`);
  };

  const handleCycleStatus = (id: string) => {
    const target = members.find((m) => m.id === id);
    if (target?.status === "Pending Invite") {
      showToast(
        `${target.name} must accept the invitation from their Notifications to become Active.`
      );
      return;
    }
    const order: CommunityMember["status"][] = [
      "Active",
      "Expiring soon",
      "Cancelled",
    ];
    setMembers((prev) =>
      prev.map((m) => {
        if (m.id !== id) return m;
        const nextStatus =
          order[(order.indexOf(m.status) + 1) % order.length];
        showToast(`${m.name} status updated to ${nextStatus}`);
        return { ...m, status: nextStatus };
      })
    );
  };

  const handleExportCSV = () => {
    if (filteredMembers.length === 0) {
      showToast("No members to export yet.");
      return;
    }

    const headers = ["Name", "Username", "Status", "Join Details", "Community"];
    const rows = filteredMembers.map((m) => [
      `"${m.name.replace(/"/g, '""')}"`,
      `"${m.username.replace(/"/g, '""')}"`,
      `"${m.status}"`,
      `"${m.joinDate.replace(/"/g, '""')}"`,
      `"${communityName.replace(/"/g, '""')}"`,
    ]);

    const csvContent = [
      headers.join(","),
      ...rows.map((r) => r.join(",")),
    ].join("\n");

    const blob = new Blob([csvContent], { type: "text/csv;charset=utf-8;" });
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `${(communitySlug || "community")}-members-${
      new Date().toISOString().split("T")[0]
    }.csv`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    window.URL.revokeObjectURL(url);
    showToast(`Exported ${filteredMembers.length} member(s) to CSV!`);
  };

  const getStatusBadgeClasses = (status: CommunityMember["status"]) => {
    switch (status) {
      case "Active":
        return "bg-[#22c55e]/15 text-[#4ade80] border border-[#22c55e]/30";
      case "Pending Invite":
        return "bg-blue-500/15 text-blue-400 border border-blue-500/30";
      case "Expiring soon":
        return "bg-[#f5c94d]/15 text-[#f5c94d] border border-[#f5c94d]/30";
      case "Cancelled":
        return "bg-red-500/15 text-red-400 border border-red-500/30";
    }
  };

  return (
    <div className="w-full max-w-[780px] text-white space-y-6 pt-1">
      {/* Toast Notification */}
      {toastMsg && (
        <div className="fixed top-20 right-6 z-50 flex items-center gap-2 rounded-2xl bg-[#f5c94d] px-4 py-2.5 text-xs font-bold text-black shadow-xl animate-in slide-in-from-top duration-200">
          <Check className="h-4 w-4" />
          <span>{toastMsg}</span>
        </div>
      )}

      {/* Search + Invite + Export Row */}
      <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-3">
        <div className="relative flex-1">
          <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 h-4 w-4 text-white/40" />
          <input
            type="text"
            placeholder="Search real members by name or @username..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full rounded-2xl border border-white/10 bg-[#1a1a1a] pl-10 pr-4 py-2.5 text-xs sm:text-sm text-white placeholder-white/35 focus:border-[#f5c94d] focus:outline-none"
          />
        </div>

        <button
          type="button"
          onClick={() => setShowAddModal(true)}
          className="inline-flex items-center justify-center gap-1.5 rounded-2xl bg-[#f5c94d] px-4 py-2.5 text-xs font-bold text-black hover:bg-[#eab308] active:scale-95 transition-all cursor-pointer shrink-0"
        >
          <UserPlus className="h-4 w-4" />
          <span>+ Invite Member</span>
        </button>

        <button
          type="button"
          onClick={handleExportCSV}
          className="inline-flex items-center justify-center gap-1.5 rounded-2xl border border-white/10 bg-[#1f1f1f] px-4 py-2.5 text-xs font-semibold text-white/90 hover:bg-white/10 active:scale-95 transition-all cursor-pointer shrink-0"
        >
          <Download className="h-4 w-4" />
          <span>Export CSV</span>
        </button>
      </div>

      {/* Filter Pills + Counter */}
      <div className="flex flex-wrap items-center justify-between gap-3">
        <div className="flex items-center gap-2 overflow-x-auto scrollbar-none">
          {STATUS_FILTERS.map((filter) => (
            <button
              key={filter}
              type="button"
              onClick={() => setStatusFilter(filter)}
              className={cn(
                "rounded-full px-4 py-1.5 text-xs font-semibold transition-all cursor-pointer whitespace-nowrap",
                statusFilter === filter
                  ? "bg-[#f5c94d] text-black font-bold"
                  : "bg-[#242424] text-white/70 hover:bg-[#2f2f2f] hover:text-white"
              )}
            >
              {filter}
            </button>
          ))}
        </div>

        <span className="text-[11px] text-white/45">
          {filteredMembers.length} of {members.length}{" "}
          {members.length === 1 ? "member" : "members"} (click badge to change
          status)
        </span>
      </div>

      {/* Real Members List */}
      <div className="divide-y divide-white/8 rounded-2xl border border-white/8 bg-[#18181a] overflow-hidden">
        {filteredMembers.length === 0 ? (
          <div className="p-10 text-center space-y-2">
            <Users className="h-8 w-8 text-white/30 mx-auto" />
            <p className="text-sm font-semibold text-white">
              No matching members yet
            </p>
            <p className="text-xs text-white/50">
              Invite real LocalBuka users below or share your community link to grow your members.
            </p>
          </div>
        ) : (
          filteredMembers.map((member) => (
            <div
              key={member.id}
              className="flex items-center justify-between gap-3 px-4 py-3.5 hover:bg-white/[0.03] transition-colors"
            >
              <div className="flex items-center gap-3 min-w-0">
                <div className="relative h-10 w-10 rounded-full overflow-hidden bg-zinc-800 border border-white/10 shrink-0">
                  <Image
                    src={member.avatar}
                    alt={member.name}
                    fill
                    unoptimized
                    className="object-cover"
                    sizes="40px"
                  />
                </div>
                <div className="min-w-0">
                  <div className="flex items-center gap-1.5">
                    <span className="text-sm font-semibold text-white truncate">
                      {member.name}
                    </span>
                    <span className="text-xs text-[#f5c94d] truncate">
                      {member.username}
                    </span>
                  </div>
                  <p className="text-[11px] text-white/45 truncate">
                    {member.joinDate}
                  </p>
                </div>
              </div>

              <div className="flex items-center gap-2 shrink-0">
                <button
                  type="button"
                  onClick={() => handleCycleStatus(member.id)}
                  className={cn(
                    "rounded-full px-3 py-1 text-[11px] font-semibold transition-all cursor-pointer",
                    getStatusBadgeClasses(member.status)
                  )}
                  title={
                    member.status === "Pending Invite"
                      ? "Waiting for invitee to accept in Notifications"
                      : "Click to cycle status"
                  }
                >
                  {member.status}
                </button>
                {member.status === "Pending Invite" && (
                  <button
                    type="button"
                    onClick={() => handleCancelPendingInvite(member)}
                    className="rounded-full p-1 text-white/40 hover:bg-red-500/15 hover:text-red-400 transition-colors cursor-pointer"
                    title="Cancel invitation"
                  >
                    <X className="h-3.5 w-3.5" />
                  </button>
                )}
              </div>
            </div>
          ))
        )}
      </div>

      {/* Recommended Real Users on LocalBuka to Invite (from /search?type=users) */}
      <div className="rounded-2xl border border-white/8 bg-[#18181a] p-5 space-y-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Sparkles className="h-4 w-4 text-[#f5c94d]" />
            <h3 className="text-sm font-bold text-white">
              Recommended Real Users to Invite
            </h3>
          </div>
          {isSearchingUsers && (
            <Loader2 className="h-3.5 w-3.5 animate-spin text-[#f5c94d]" />
          )}
        </div>

        {unjoinedRecommendations.length === 0 ? (
          <p className="text-xs text-white/45">
            {isSearchingUsers
              ? "Finding LocalBuka users..."
              : "Search by name or @username above to discover and invite real LocalBuka users."}
          </p>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
            {unjoinedRecommendations.slice(0, 6).map((u) => (
              <div
                key={u.id}
                className="flex items-center justify-between gap-2.5 rounded-xl bg-[#202022] border border-white/8 px-3 py-2.5"
              >
                <div className="flex items-center gap-2.5 min-w-0">
                  <div className="relative h-8 w-8 rounded-full overflow-hidden bg-zinc-800 shrink-0">
                    <Image
                      src={u.avatar}
                      alt={u.name}
                      fill
                      unoptimized
                      className="object-cover"
                      sizes="32px"
                    />
                  </div>
                  <div className="min-w-0">
                    <div className="text-xs font-bold text-white truncate">
                      {u.name}
                    </div>
                    <div className="text-[10.5px] text-white/50 truncate">
                      {u.username}
                    </div>
                  </div>
                </div>
                <button
                  type="button"
                  onClick={() => handleInviteRealUser(u)}
                  className="rounded-full bg-[#f5c94d]/15 border border-[#f5c94d]/40 px-3 py-1 text-[11px] font-bold text-[#f5c94d] hover:bg-[#f5c94d] hover:text-black transition-all cursor-pointer shrink-0"
                >
                  Invite
                </button>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Invite Real Member Search Modal */}
      {showAddModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/75 backdrop-blur-sm p-4">
          <div className="w-full max-w-md rounded-3xl border border-white/10 bg-[#1a1a1c] p-6 shadow-2xl space-y-4">
            <div className="flex items-center justify-between">
              <div>
                <h3 className="text-base font-bold text-white">
                  Invite Real LocalBuka User
                </h3>
                <p className="text-xs text-white/50">
                  Search live LocalBuka accounts to invite to {communityName}
                </p>
              </div>
              <button
                type="button"
                onClick={() => setShowAddModal(false)}
                className="rounded-full p-1.5 text-white/50 hover:bg-white/10 hover:text-white cursor-pointer"
              >
                <X className="h-4 w-4" />
              </button>
            </div>

            <div className="relative">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-white/40" />
              <input
                type="text"
                autoFocus
                placeholder="Search by full name or @username..."
                value={inviteSearch}
                onChange={(e) => setInviteSearch(e.target.value)}
                className="w-full rounded-xl border border-white/10 bg-[#242428] pl-9 pr-4 py-2.5 text-xs text-white placeholder-white/40 focus:border-[#f5c94d] focus:outline-none"
              />
            </div>

            <div className="flex items-center gap-2 text-xs">
              <span className="text-white/50">Initial status:</span>
              {(["Active", "Expiring soon"] as const).map((st) => (
                <button
                  key={st}
                  type="button"
                  onClick={() => setNewMemberStatus(st)}
                  className={cn(
                    "rounded-full px-3 py-1 text-[11px] font-semibold cursor-pointer",
                    newMemberStatus === st
                      ? "bg-[#f5c94d] text-black font-bold"
                      : "bg-white/5 text-white/60"
                  )}
                >
                  {st}
                </button>
              ))}
            </div>

            <div className="max-h-60 overflow-y-auto space-y-2 pr-1">
              {isSearchingUsers ? (
                <div className="flex items-center justify-center py-8 text-xs text-white/50 gap-2">
                  <Loader2 className="h-4 w-4 animate-spin text-[#f5c94d]" />
                  <span>Searching LocalBuka users...</span>
                </div>
              ) : recommendedUsers.length === 0 ? (
                <p className="py-6 text-center text-xs text-white/50">
                  No users found matching &ldquo;{inviteSearch}&rdquo;.
                </p>
              ) : (
                recommendedUsers.map((u) => {
                  const alreadyIn = members.some(
                    (m) => m.username.toLowerCase() === u.username.toLowerCase()
                  );
                  return (
                    <div
                      key={u.id}
                      className="flex items-center justify-between gap-3 rounded-xl bg-[#242428] border border-white/8 p-2.5"
                    >
                      <div className="flex items-center gap-2.5 min-w-0">
                        <div className="relative h-8 w-8 rounded-full overflow-hidden bg-zinc-800 shrink-0">
                          <Image
                            src={u.avatar}
                            alt={u.name}
                            fill
                            unoptimized
                            className="object-cover"
                            sizes="32px"
                          />
                        </div>
                        <div className="min-w-0">
                          <div className="text-xs font-bold text-white truncate">
                            {u.name}
                          </div>
                          <div className="text-[11px] text-[#f5c94d] truncate">
                            {u.username}
                          </div>
                        </div>
                      </div>

                      <button
                        type="button"
                        disabled={alreadyIn}
                        onClick={() => handleInviteRealUser(u)}
                        className="rounded-full bg-[#f5c94d] px-3.5 py-1 text-[11px] font-bold text-black hover:bg-[#eab308] disabled:opacity-40 cursor-pointer shrink-0"
                      >
                        {alreadyIn ? "Joined ✓" : "Invite"}
                      </button>
                    </div>
                  );
                })
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
