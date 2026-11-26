"use client";

import { useState, useMemo, useEffect } from "react";
import {
  Search,
  UserPlus,
  Download,
  X,
  Check,
  Loader2,
  Users,
  AlertCircle,
  RefreshCw,
} from "lucide-react";
import { CommunityMember } from "./types";
import { cn } from "@/lib/utils";
import {
  useCommunityMembers,
  useSuggestedInvites,
  useInviteCommunityMember,
  useDeclineCommunityInvite,
} from "@/lib/api/services/community.hooks";

type MemberStatusFilter =
  | "All"
  | "Active"
  | "Pending Invite"
  | "Expiring soon"
  | "Cancelled";

const LEGACY_MEMBERS_STORAGE_KEY = "localbuka_creator_members_v2";

const STATUS_FILTERS: MemberStatusFilter[] = [
  "All",
  "Active",
  "Pending Invite",
  "Expiring soon",
  "Cancelled",
];

interface UserSuggestion {
  id: string;
  name: string;
  username: string;
  avatar: string | null;
}

interface MembersTabProps {
  communitySlug?: string;
  communityName?: string;
}

function getInitials(name: string): string {
  const parts = name.trim().split(/\s+/).filter(Boolean);
  if (parts.length === 0) return "?";
  if (parts.length === 1) return parts[0].slice(0, 2).toUpperCase();
  return `${parts[0][0]}${parts[parts.length - 1][0]}`.toUpperCase();
}

function normalizeAvatarUrl(src?: string | null): string | null {
  if (!src) return null;
  const trimmed = src.trim();
  if (!trimmed || trimmed === "/images/community/avatar-1.png") return null;
  if (trimmed.startsWith("http://res.cloudinary.com/")) {
    return trimmed.replace("http://", "https://");
  }
  return trimmed;
}

function formatTimeUntilRefresh(nextRefreshAt?: string): string | null {
  if (!nextRefreshAt) return null;
  const diffMs = new Date(nextRefreshAt).getTime() - Date.now();
  if (Number.isNaN(diffMs)) return null;
  if (diffMs <= 60_000) return "Refreshing soon";
  const mins = Math.ceil(diffMs / 60_000);
  if (mins >= 60) return "Refreshes in 1h";
  return `Refreshes in ${mins}m`;
}

function MemberAvatar({
  src,
  name,
  size = "md",
}: {
  src?: string | null;
  name: string;
  size?: "sm" | "md";
}) {
  const normalizedSrc = normalizeAvatarUrl(src);
  const [failedSrc, setFailedSrc] = useState<string | null>(null);
  const imgError = Boolean(normalizedSrc && failedSrc === normalizedSrc);

  const dims = size === "sm" ? "h-8 w-8 text-[11px]" : "h-10 w-10 text-xs";

  if (normalizedSrc && !imgError) {
    return (
      <div
        className={cn(
          "relative rounded-full overflow-hidden bg-zinc-800 border border-white/10 shrink-0",
          dims
        )}
      >
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img
          src={normalizedSrc}
          alt={name}
          referrerPolicy="no-referrer"
          loading="lazy"
          onError={() => setFailedSrc(normalizedSrc)}
          className="h-full w-full object-cover"
        />
      </div>
    );
  }
  return (
    <div
      className={cn(
        "rounded-full bg-[#2a2a2e] border border-white/10 text-white/85 font-bold flex items-center justify-center shrink-0 select-none",
        dims
      )}
    >
      {getInitials(name)}
    </div>
  );
}

export function MembersTab({
  communitySlug = "",
  communityName = "My Community",
}: MembersTabProps) {
  const {
    data: liveMembers,
    isLoading: isLoadingMembers,
    refetch: refetchMembers,
  } = useCommunityMembers(communitySlug);
  const inviteMutation = useInviteCommunityMember();
  const cancelInviteMutation = useDeclineCommunityInvite();

  const [searchQuery, setSearchQuery] = useState("");
  const [debouncedSearch, setDebouncedSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState<MemberStatusFilter>("All");
  const [showInviteModal, setShowInviteModal] = useState(false);
  const [inviteSearch, setInviteSearch] = useState("");
  const [debouncedInviteSearch, setDebouncedInviteSearch] = useState("");
  const [refreshSeed, setRefreshSeed] = useState(0);
  const [invitingUserId, setInvitingUserId] = useState<string | null>(null);
  const [cancellingMemberId, setCancellingMemberId] = useState<string | null>(
    null
  );
  const [countdownLabel, setCountdownLabel] = useState<string | null>(null);
  const [toastState, setToastState] = useState<{
    message: string;
    isError?: boolean;
  } | null>(null);

  // Debounce member search & modal search
  useEffect(() => {
    const t = setTimeout(() => setDebouncedSearch(searchQuery.trim()), 250);
    return () => clearTimeout(t);
  }, [searchQuery]);

  useEffect(() => {
    const t = setTimeout(
      () => setDebouncedInviteSearch(inviteSearch.trim()),
      250
    );
    return () => clearTimeout(t);
  }, [inviteSearch]);

  // Clear legacy local-only member cache so stale/failed invites never appear
  useEffect(() => {
    if (typeof window !== "undefined") {
      try {
        window.localStorage.removeItem(LEGACY_MEMBERS_STORAGE_KEY);
      } catch {
        // ignore
      }
    }
  }, []);

  // Hourly-rotating real unjoined users from GET /community/:slug/suggested-invites
  const {
    data: suggestedData,
    isLoading: isLoadingSuggestions,
    isFetching: isFetchingSuggestions,
    refetch: refetchSuggestions,
  } = useSuggestedInvites(communitySlug, {
    limit: 6,
    q: debouncedSearch || undefined,
    seed: refreshSeed,
  });

  // Dedicated query for the Invite Member search modal
  const {
    data: modalSuggestedData,
    isFetching: isSearchingModalUsers,
    refetch: refetchModalSuggestions,
  } = useSuggestedInvites(showInviteModal ? communitySlug : "", {
    limit: 15,
    q: debouncedInviteSearch || undefined,
    seed: refreshSeed,
  });

  // Live countdown to the next 1-hour auto-rotation + automatic refetch when the hour rolls over
  useEffect(() => {
    const nextAt = suggestedData?.nextRefreshAt;
    if (!nextAt) {
      setCountdownLabel(null);
      return;
    }

    const updateCountdown = () => {
      const remaining = new Date(nextAt).getTime() - Date.now();
      if (remaining <= 0) {
        setRefreshSeed(0);
        void refetchSuggestions();
        setCountdownLabel("Refreshing...");
      } else {
        setCountdownLabel(formatTimeUntilRefresh(nextAt));
      }
    };

    updateCountdown();
    const interval = setInterval(updateCountdown, 30_000);
    return () => clearInterval(interval);
  }, [suggestedData?.nextRefreshAt, refetchSuggestions]);

  // Live backend members only (zero dummy or localStorage-cached members)
  const members: CommunityMember[] = useMemo(() => {
    if (!Array.isArray(liveMembers)) return [];
    return liveMembers.map((m) => {
      const formattedDate =
        m.status === "Pending Invite"
          ? "Invitation sent · Waiting for user to accept in Notifications"
          : m.joinedAt
          ? `Joined ${new Date(m.joinedAt).toLocaleDateString("en-US", {
              month: "short",
              day: "numeric",
            })}`
          : "Joined Recently";

      return {
        id: m.id,
        userId: m.userId,
        name: m.name,
        username: m.username,
        avatar: normalizeAvatarUrl(m.avatar) || "",
        joinDate:
          m.role === "creator"
            ? `${formattedDate} · Community Creator`
            : formattedDate,
        status: m.status,
      };
    });
  }, [liveMembers]);

  const showToast = (message: string, isError = false) => {
    setToastState({ message, isError });
    setTimeout(() => setToastState(null), 3500);
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

  const suggestedUsers: UserSuggestion[] = useMemo(() => {
    const items = suggestedData?.items || [];
    const activeOrPendingIds = new Set(
      members
        .filter((m) => m.status !== "Cancelled")
        .map((m) => m.userId)
        .filter(Boolean) as string[]
    );
    return items.filter((u) => !activeOrPendingIds.has(u.id));
  }, [suggestedData, members]);

  const modalUsers: UserSuggestion[] = useMemo(
    () => modalSuggestedData?.items || [],
    [modalSuggestedData]
  );

  const handleManualRefresh = () => {
    setRefreshSeed((prev) => prev + 1);
  };

  const handleInviteUser = async (u: UserSuggestion) => {
    if (!communitySlug) {
      showToast(
        "Community is still syncing. Refresh and try inviting again.",
        true
      );
      return;
    }

    const exists = members.some(
      (m) =>
        m.status !== "Cancelled" &&
        (m.userId === u.id ||
          m.username.toLowerCase() === u.username.toLowerCase())
    );
    if (exists) {
      showToast(`${u.name} already has a membership or pending invite.`);
      return;
    }

    setInvitingUserId(u.id);
    try {
      await inviteMutation.mutateAsync({
        idOrSlug: communitySlug,
        userId: u.id,
      });
      await Promise.all([
        refetchMembers(),
        refetchSuggestions(),
        showInviteModal ? refetchModalSuggestions() : Promise.resolve(),
      ]);
      showToast(
        `Invitation sent to ${u.name} (${u.username}). They'll see it in their Notifications.`
      );
    } catch (err: any) {
      const apiMsg =
        err?.response?.data?.message ||
        err?.message ||
        "Could not send invitation. Make sure you are signed in.";
      showToast(
        Array.isArray(apiMsg) ? apiMsg.join(", ") : String(apiMsg),
        true
      );
    } finally {
      setInvitingUserId(null);
    }
  };

  const handleCancelPendingInvite = async (member: CommunityMember) => {
    if (!communitySlug || !member.userId) {
      showToast("Unable to cancel invitation right now.", true);
      return;
    }

    setCancellingMemberId(member.id);
    try {
      await cancelInviteMutation.mutateAsync({
        idOrSlug: communitySlug,
        userId: member.userId,
      });
      await Promise.all([refetchMembers(), refetchSuggestions()]);
      showToast(`Invitation to ${member.name} cancelled.`);
    } catch (err: any) {
      const apiMsg =
        err?.response?.data?.message ||
        err?.message ||
        "Failed to cancel invitation.";
      showToast(
        Array.isArray(apiMsg) ? apiMsg.join(", ") : String(apiMsg),
        true
      );
    } finally {
      setCancellingMemberId(null);
    }
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
    showToast(`Exported ${filteredMembers.length} member(s) to CSV.`);
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
      {toastState && (
        <div
          className={cn(
            "fixed top-20 right-6 z-50 flex items-center gap-2 rounded-2xl px-4 py-2.5 text-xs font-bold shadow-xl animate-in slide-in-from-top duration-200 max-w-sm",
            toastState.isError
              ? "bg-red-500 text-white"
              : "bg-[#f5c94d] text-black"
          )}
        >
          {toastState.isError ? (
            <AlertCircle className="h-4 w-4 shrink-0" />
          ) : (
            <Check className="h-4 w-4 shrink-0" />
          )}
          <span>{toastState.message}</span>
        </div>
      )}

      {/* Search + Invite + Export Row */}
      <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-3">
        <div className="relative flex-1">
          <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 h-4 w-4 text-white/40" />
          <input
            type="text"
            placeholder="Search members by name or @username..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full rounded-2xl border border-white/10 bg-[#1a1a1a] pl-10 pr-4 py-2.5 text-xs sm:text-sm text-white placeholder-white/35 focus:border-[#f5c94d] focus:outline-none"
          />
        </div>

        <button
          type="button"
          onClick={() => setShowInviteModal(true)}
          className="inline-flex items-center justify-center gap-1.5 rounded-2xl bg-[#f5c94d] px-4 py-2.5 text-xs font-bold text-black hover:bg-[#eab308] active:scale-95 transition-all cursor-pointer shrink-0"
        >
          <UserPlus className="h-4 w-4" />
          <span>Invite Member</span>
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
          {members.length === 1 ? "member" : "members"}
        </span>
      </div>

      {/* Members List */}
      <div className="divide-y divide-white/8 rounded-2xl border border-white/8 bg-[#18181a] overflow-hidden">
        {isLoadingMembers ? (
          <div className="p-10 flex items-center justify-center gap-2 text-xs text-white/50">
            <Loader2 className="h-4 w-4 animate-spin text-[#f5c94d]" />
            <span>Loading members...</span>
          </div>
        ) : filteredMembers.length === 0 ? (
          <div className="p-10 text-center space-y-2">
            <Users className="h-8 w-8 text-white/30 mx-auto" />
            <p className="text-sm font-semibold text-white">
              No matching members yet
            </p>
            <p className="text-xs text-white/50">
              Invite people below or share your community link to grow your members.
            </p>
          </div>
        ) : (
          filteredMembers.map((member) => (
            <div
              key={member.id}
              className="flex items-center justify-between gap-3 px-4 py-3.5 hover:bg-white/[0.03] transition-colors"
            >
              <div className="flex items-center gap-3 min-w-0">
                <MemberAvatar src={member.avatar} name={member.name} />
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
                <span
                  className={cn(
                    "rounded-full px-3 py-1 text-[11px] font-semibold",
                    getStatusBadgeClasses(member.status)
                  )}
                >
                  {member.status}
                </span>
                {member.status === "Pending Invite" && (
                  <button
                    type="button"
                    disabled={cancellingMemberId === member.id}
                    onClick={() => void handleCancelPendingInvite(member)}
                    className="inline-flex items-center gap-1 rounded-full border border-red-500/30 bg-red-500/10 px-2.5 py-1 text-[11px] font-semibold text-red-400 hover:bg-red-500/20 hover:text-red-300 transition-colors disabled:opacity-40 cursor-pointer"
                    title="Cancel invitation"
                    aria-label={`Cancel invitation for ${member.name}`}
                  >
                    {cancellingMemberId === member.id ? (
                      <Loader2 className="h-3 w-3 animate-spin" />
                    ) : (
                      <X className="h-3 w-3" />
                    )}
                    <span>Cancel</span>
                  </button>
                )}
                {member.status === "Cancelled" && member.userId && (
                  <button
                    type="button"
                    disabled={invitingUserId === member.userId}
                    onClick={() =>
                      void handleInviteUser({
                        id: member.userId!,
                        name: member.name,
                        username: member.username,
                        avatar: member.avatar || null,
                      })
                    }
                    className="inline-flex items-center gap-1 rounded-full border border-[#f5c94d]/40 bg-[#f5c94d]/15 px-2.5 py-1 text-[11px] font-semibold text-[#f5c94d] hover:bg-[#f5c94d] hover:text-black transition-colors disabled:opacity-40 cursor-pointer"
                    title="Send a new invitation"
                  >
                    {invitingUserId === member.userId ? (
                      <Loader2 className="h-3 w-3 animate-spin" />
                    ) : (
                      "Re-invite"
                    )}
                  </button>
                )}
              </div>
            </div>
          ))
        )}
      </div>

      {/* Suggested People to Invite (Auto-rotates hourly + Manual Refresh) */}
      <div className="rounded-2xl border border-white/8 bg-[#18181a] p-5 space-y-4">
        <div className="flex flex-wrap items-center justify-between gap-2">
          <div>
            <h3 className="text-sm font-bold text-white">
              Suggested People to Invite
            </h3>
            <p className="text-[11px] text-white/45 mt-0.5">
              Updates every hour
              {countdownLabel ? ` · ${countdownLabel}` : ""}
              {typeof suggestedData?.totalAvailable === "number" &&
              suggestedData.totalAvailable > 0
                ? ` · ${suggestedData.totalAvailable} people available`
                : ""}
            </p>
          </div>

          <button
            type="button"
            disabled={isFetchingSuggestions}
            onClick={handleManualRefresh}
            className="inline-flex items-center gap-1.5 rounded-full border border-white/10 bg-[#232326] px-3 py-1.5 text-[11px] font-semibold text-white/80 hover:bg-white/10 hover:text-white transition-all disabled:opacity-50 cursor-pointer"
            title="Load a new batch of suggested people"
          >
            <RefreshCw
              className={cn(
                "h-3.5 w-3.5",
                isFetchingSuggestions && "animate-spin text-[#f5c94d]"
              )}
            />
            <span>Refresh</span>
          </button>
        </div>

        {isLoadingSuggestions ? (
          <div className="flex items-center justify-center py-6 gap-2 text-xs text-white/50">
            <Loader2 className="h-4 w-4 animate-spin text-[#f5c94d]" />
            <span>Loading people to invite...</span>
          </div>
        ) : suggestedUsers.length === 0 ? (
          <p className="text-xs text-white/45">
            {debouncedSearch
              ? `No unjoined users match "${debouncedSearch}".`
              : "No more unjoined users available to suggest right now."}
          </p>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
            {suggestedUsers.map((u) => {
              const isInviting = invitingUserId === u.id;
              return (
                <div
                  key={u.id}
                  className="flex items-center justify-between gap-2.5 rounded-xl bg-[#202022] border border-white/8 px-3 py-2.5"
                >
                  <div className="flex items-center gap-2.5 min-w-0">
                    <MemberAvatar src={u.avatar} name={u.name} size="sm" />
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
                    disabled={isInviting}
                    onClick={() => void handleInviteUser(u)}
                    className="rounded-full bg-[#f5c94d]/15 border border-[#f5c94d]/40 px-3 py-1 text-[11px] font-bold text-[#f5c94d] hover:bg-[#f5c94d] hover:text-black transition-all disabled:opacity-50 cursor-pointer shrink-0 inline-flex items-center gap-1"
                  >
                    {isInviting ? (
                      <>
                        <Loader2 className="h-3 w-3 animate-spin" />
                        <span>Sending</span>
                      </>
                    ) : (
                      "Invite"
                    )}
                  </button>
                </div>
              );
            })}
          </div>
        )}
      </div>

      {/* Invite Member Modal */}
      {showInviteModal && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center bg-black/75 backdrop-blur-sm p-4"
          onClick={() => setShowInviteModal(false)}
        >
          <div
            className="w-full max-w-md rounded-3xl border border-white/10 bg-[#1a1a1c] p-6 shadow-2xl space-y-4"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="flex items-center justify-between">
              <div>
                <h3 className="text-base font-bold text-white">
                  Invite Member
                </h3>
                <p className="text-xs text-white/50">
                  Search people on LocalBuka to invite to {communityName}
                </p>
              </div>
              <button
                type="button"
                onClick={() => setShowInviteModal(false)}
                className="rounded-full p-1.5 text-white/50 hover:bg-white/10 hover:text-white cursor-pointer"
                aria-label="Close invite modal"
              >
                <X className="h-4 w-4" />
              </button>
            </div>

            <div className="relative">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-white/40" />
              <input
                type="text"
                autoFocus
                placeholder="Search by name or @username..."
                value={inviteSearch}
                onChange={(e) => setInviteSearch(e.target.value)}
                className="w-full rounded-xl border border-white/10 bg-[#242428] pl-9 pr-4 py-2.5 text-xs text-white placeholder-white/40 focus:border-[#f5c94d] focus:outline-none"
              />
            </div>

            <div className="max-h-64 overflow-y-auto space-y-2 pr-1">
              {isSearchingModalUsers ? (
                <div className="flex items-center justify-center py-8 text-xs text-white/50 gap-2">
                  <Loader2 className="h-4 w-4 animate-spin text-[#f5c94d]" />
                  <span>Searching users...</span>
                </div>
              ) : modalUsers.length === 0 ? (
                <p className="py-6 text-center text-xs text-white/50">
                  {debouncedInviteSearch
                    ? `No users found matching "${debouncedInviteSearch}".`
                    : "No unjoined users found."}
                </p>
              ) : (
                modalUsers.map((u) => {
                  const existingMember = members.find(
                    (m) =>
                      m.status !== "Cancelled" &&
                      (m.userId === u.id ||
                        m.username.toLowerCase() === u.username.toLowerCase())
                  );
                  const isInviting = invitingUserId === u.id;
                  return (
                    <div
                      key={u.id}
                      className="flex items-center justify-between gap-3 rounded-xl bg-[#242428] border border-white/8 p-2.5"
                    >
                      <div className="flex items-center gap-2.5 min-w-0">
                        <MemberAvatar src={u.avatar} name={u.name} size="sm" />
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
                        disabled={Boolean(existingMember) || isInviting}
                        onClick={() => void handleInviteUser(u)}
                        className="rounded-full bg-[#f5c94d] px-3.5 py-1 text-[11px] font-bold text-black hover:bg-[#eab308] disabled:opacity-45 cursor-pointer shrink-0 inline-flex items-center gap-1"
                      >
                        {isInviting ? (
                          <Loader2 className="h-3 w-3 animate-spin" />
                        ) : existingMember?.status === "Pending Invite" ? (
                          "Invited"
                        ) : existingMember ? (
                          "Member"
                        ) : (
                          "Invite"
                        )}
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
