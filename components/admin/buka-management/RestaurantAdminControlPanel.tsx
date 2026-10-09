"use client";

import { useState } from "react";
import {
  CheckCircle,
  XCircle,
  PauseCircle,
  Trash2,
  ShieldCheck,
  Eye,
  EyeOff,
  AlertTriangle,
  Clock,
  Loader2,
  Star,
  MapPin,
  Truck,
  Calendar,
  ToggleLeft,
  ToggleRight,
  Info,
  History,
  ChevronDown,
  ChevronUp,
} from "lucide-react";
import type { Restaurant } from "@/lib/api/services/restaurants.service";
import { MdVerified } from "react-icons/md";

interface RestaurantAdminControlPanelProps {
  restaurant: Restaurant;
  onApprove: () => void;
  onOpenSuspend: () => void;
  onOpenReject: () => void;
  onOpenDelete: () => void;
  isUpdating?: boolean;
}

// Toggle Switch Component
function ToggleSwitch({
  label,
  description,
  enabled,
  icon: Icon,
  iconColor,
  readOnly,
}: {
  label: string;
  description: string;
  enabled: boolean;
  icon: React.ComponentType<{ className?: string }>;
  iconColor: string;
  readOnly?: boolean;
}) {
  return (
    <div
      className={`flex items-center justify-between p-3.5 rounded-xl border transition-all ${
        enabled
          ? "bg-emerald-50/60 dark:bg-emerald-950/20 border-emerald-200/80 dark:border-emerald-900/40"
          : "bg-gray-50 dark:bg-gray-800/40 border-gray-200/80 dark:border-gray-700/60"
      }`}
    >
      <div className="flex items-start gap-2.5 min-w-0">
        <Icon className={`w-4 h-4 mt-0.5 shrink-0 ${iconColor}`} />
        <div className="min-w-0">
          <div className="text-xs font-bold text-gray-900 dark:text-white">
            {label}
          </div>
          <div className="text-[10px] text-gray-500 dark:text-gray-400 leading-tight mt-0.5">
            {description}
          </div>
        </div>
      </div>

      <div className="flex items-center gap-2 shrink-0 ml-3">
        {readOnly && (
          <span className="text-[9px] font-medium text-gray-400 uppercase">
            Auto
          </span>
        )}
        {enabled ? (
          <ToggleRight
            className={`w-7 h-7 ${
              readOnly
                ? "text-emerald-400"
                : "text-emerald-500 cursor-pointer hover:text-emerald-600"
            }`}
          />
        ) : (
          <ToggleLeft
            className={`w-7 h-7 ${
              readOnly
                ? "text-gray-300 dark:text-gray-600"
                : "text-gray-400 cursor-pointer hover:text-gray-500"
            }`}
          />
        )}
      </div>
    </div>
  );
}

export function RestaurantAdminControlPanel({
  restaurant,
  onApprove,
  onOpenSuspend,
  onOpenReject,
  onOpenDelete,
  isUpdating,
}: RestaurantAdminControlPanelProps) {
  const [showSettings, setShowSettings] = useState(true);
  const [activeConfirm, setActiveConfirm] = useState<string | null>(null);

  const isApproved = restaurant.status === "approved";
  const isPending = restaurant.status === "pending" || !restaurant.status;
  const isSuspended = restaurant.status === "suspended";
  const isRejected = restaurant.status === "rejected";

  // Status color mapping
  const statusConfig = {
    approved: {
      bg: "bg-emerald-50 dark:bg-emerald-950/40",
      border: "border-emerald-200 dark:border-emerald-800",
      text: "text-emerald-800 dark:text-emerald-300",
      icon: CheckCircle,
      label: "Approved & Live",
      dot: "bg-emerald-500",
    },
    pending: {
      bg: "bg-amber-50 dark:bg-amber-950/40",
      border: "border-amber-200 dark:border-amber-800",
      text: "text-amber-800 dark:text-amber-300",
      icon: Clock,
      label: "Pending Review",
      dot: "bg-amber-500 animate-pulse",
    },
    suspended: {
      bg: "bg-orange-50 dark:bg-orange-950/40",
      border: "border-orange-200 dark:border-orange-800",
      text: "text-orange-700 dark:text-orange-300",
      icon: PauseCircle,
      label: "Suspended (Hidden)",
      dot: "bg-orange-500",
    },
    rejected: {
      bg: "bg-red-50 dark:bg-red-950/40",
      border: "border-red-200 dark:border-red-900",
      text: "text-red-700 dark:text-red-400",
      icon: XCircle,
      label: "Rejected",
      dot: "bg-red-500",
    },
  };

  const currentStatus =
    statusConfig[
      (restaurant.status as keyof typeof statusConfig) || "pending"
    ] || statusConfig.pending;
  const StatusIcon = currentStatus.icon;

  // Inline confirmation handler
  const handleActionWithConfirm = (actionKey: string, action: () => void) => {
    if (activeConfirm === actionKey) {
      action();
      setActiveConfirm(null);
    } else {
      setActiveConfirm(actionKey);
      // Auto-dismiss after 4 seconds
      setTimeout(() => setActiveConfirm(null), 4000);
    }
  };

  return (
    <div className="bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-800 rounded-2xl shadow-xs overflow-hidden">
      {/* ===== Top Header Bar ===== */}
      <div className="p-5 border-b border-gray-100 dark:border-gray-800">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-amber-400/20 to-amber-600/20 text-[#9e7400] dark:text-[#fbbe15] flex items-center justify-center font-bold">
              <ShieldCheck className="w-5 h-5" />
            </div>
            <div>
              <h3 className="text-base font-bold text-gray-900 dark:text-white">
                Admin Control Panel
              </h3>
              <p className="text-[11px] text-gray-500 dark:text-gray-400">
                Manage status, visibility, and restaurant settings
              </p>
            </div>
          </div>

          {/* Current Status Pill - Prominent */}
          <div
            className={`inline-flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-bold ${currentStatus.bg} ${currentStatus.border} ${currentStatus.text} border`}
          >
            <span
              className={`w-2 h-2 rounded-full ${currentStatus.dot}`}
            />
            <StatusIcon className="w-4 h-4" />
            {currentStatus.label}
          </div>
        </div>
      </div>

      {/* ===== Moderation Alert Banner ===== */}
      {(isSuspended || isRejected) && restaurant.moderationReason && (
        <div className="mx-5 mt-4 p-4 rounded-xl bg-amber-50 dark:bg-amber-950/30 border border-amber-200 dark:border-amber-900/50 flex items-start gap-3">
          <AlertTriangle className="w-5 h-5 text-amber-600 shrink-0 mt-0.5" />
          <div>
            <div className="text-xs font-bold text-amber-900 dark:text-amber-200">
              Moderation Reason
            </div>
            <p className="text-[11px] text-amber-800/90 dark:text-amber-300/90 mt-0.5 leading-relaxed">
              {restaurant.moderationReason}
            </p>
          </div>
        </div>
      )}

      {/* ===== Primary Action Buttons ===== */}
      <div className="p-5 space-y-3">
        <div className="flex items-center justify-between">
          <label className="text-[11px] font-bold text-gray-500 dark:text-gray-400 uppercase tracking-wider">
            Status Actions
          </label>
          <span className="text-[10px] text-gray-400 dark:text-gray-500 flex items-center gap-1">
            <Info className="w-3 h-3" />
            Click an action, then confirm
          </span>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3">
          {/* 1. Approve / Reactivate */}
          <button
            type="button"
            onClick={() =>
              handleActionWithConfirm("approve", onApprove)
            }
            disabled={isUpdating || isApproved}
            className={`relative p-4 rounded-xl border-2 font-bold text-xs flex flex-col gap-2 transition-all cursor-pointer group ${
              isApproved
                ? "bg-emerald-50/50 dark:bg-emerald-950/15 border-emerald-300 dark:border-emerald-900/40 text-emerald-800 dark:text-emerald-300 cursor-default"
                : activeConfirm === "approve"
                  ? "bg-emerald-600 border-emerald-600 text-white shadow-lg shadow-emerald-500/20 scale-[1.02]"
                  : "bg-white dark:bg-gray-800 border-emerald-200 dark:border-emerald-900/60 hover:border-emerald-400 hover:bg-emerald-50 dark:hover:bg-emerald-950/30 text-emerald-700 dark:text-emerald-400"
            }`}
          >
            {isApproved && (
              <span className="absolute top-2 right-2 text-[9px] font-bold bg-emerald-200 dark:bg-emerald-900/60 text-emerald-700 dark:text-emerald-300 px-1.5 py-0.5 rounded-md">
                ACTIVE
              </span>
            )}
            <div className="flex items-center gap-2">
              {isUpdating && activeConfirm === "approve" ? (
                <Loader2 className="w-5 h-5 animate-spin" />
              ) : (
                <CheckCircle className="w-5 h-5" />
              )}
              <span className="text-sm font-bold">
                {activeConfirm === "approve"
                  ? "Click Again to Confirm"
                  : isApproved
                    ? "Approved ✓"
                    : isSuspended
                      ? "Reactivate"
                      : "Approve"}
              </span>
            </div>
            <p
              className={`text-[10px] text-left leading-tight ${
                activeConfirm === "approve"
                  ? "text-emerald-100"
                  : isApproved
                    ? "text-emerald-600/70 dark:text-emerald-400/60"
                    : "text-gray-500 dark:text-gray-400"
              }`}
            >
              Make visible on search, map, and discovery feeds.
            </p>
          </button>

          {/* 2. Suspend */}
          <button
            type="button"
            onClick={onOpenSuspend}
            disabled={isUpdating || isSuspended}
            className={`relative p-4 rounded-xl border-2 font-bold text-xs flex flex-col gap-2 transition-all cursor-pointer group ${
              isSuspended
                ? "bg-orange-50/50 dark:bg-orange-950/15 border-orange-300 dark:border-orange-900/40 text-orange-800 dark:text-orange-300 cursor-default"
                : "bg-white dark:bg-gray-800 border-orange-200 dark:border-orange-900/60 hover:border-orange-400 hover:bg-orange-50 dark:hover:bg-orange-950/30 text-orange-700 dark:text-orange-400"
            }`}
          >
            {isSuspended && (
              <span className="absolute top-2 right-2 text-[9px] font-bold bg-orange-200 dark:bg-orange-900/60 text-orange-700 dark:text-orange-300 px-1.5 py-0.5 rounded-md">
                ACTIVE
              </span>
            )}
            <div className="flex items-center gap-2">
              <PauseCircle className="w-5 h-5" />
              <span className="text-sm font-bold">
                {isSuspended ? "Suspended" : "Suspend"}
              </span>
            </div>
            <p className="text-[10px] text-gray-500 dark:text-gray-400 text-left leading-tight">
              Temporarily hide from public view. Data preserved.
            </p>
          </button>

          {/* 3. Reject */}
          <button
            type="button"
            onClick={onOpenReject}
            disabled={isUpdating || isRejected}
            className={`relative p-4 rounded-xl border-2 font-bold text-xs flex flex-col gap-2 transition-all cursor-pointer group ${
              isRejected
                ? "bg-rose-50/50 dark:bg-rose-950/15 border-rose-300 dark:border-rose-900/40 text-rose-800 dark:text-rose-300 cursor-default"
                : "bg-white dark:bg-gray-800 border-rose-200 dark:border-rose-900/60 hover:border-rose-400 hover:bg-rose-50 dark:hover:bg-rose-950/30 text-rose-700 dark:text-rose-400"
            }`}
          >
            {isRejected && (
              <span className="absolute top-2 right-2 text-[9px] font-bold bg-rose-200 dark:bg-rose-900/60 text-rose-700 dark:text-rose-300 px-1.5 py-0.5 rounded-md">
                ACTIVE
              </span>
            )}
            <div className="flex items-center gap-2">
              <XCircle className="w-5 h-5" />
              <span className="text-sm font-bold">
                {isRejected ? "Rejected" : "Reject"}
              </span>
            </div>
            <p className="text-[10px] text-gray-500 dark:text-gray-400 text-left leading-tight">
              Decline submission for duplicate or invalid info.
            </p>
          </button>

          {/* 4. Delete */}
          <button
            type="button"
            onClick={() =>
              handleActionWithConfirm("delete", onOpenDelete)
            }
            disabled={isUpdating}
            className={`relative p-4 rounded-xl border-2 font-bold text-xs flex flex-col gap-2 transition-all cursor-pointer group ${
              activeConfirm === "delete"
                ? "bg-red-600 border-red-600 text-white shadow-lg shadow-red-500/20 scale-[1.02]"
                : "bg-white dark:bg-gray-800 border-red-200 dark:border-red-900/50 hover:border-red-400 hover:bg-red-50 dark:hover:bg-red-950/30 text-red-600 dark:text-red-400"
            }`}
          >
            <span
              className={`absolute top-2 right-2 text-[9px] font-bold px-1.5 py-0.5 rounded-md uppercase ${
                activeConfirm === "delete"
                  ? "bg-red-500 text-white"
                  : "bg-red-100 dark:bg-red-950/60 text-red-600 dark:text-red-400"
              }`}
            >
              Danger
            </span>
            <div className="flex items-center gap-2">
              <Trash2 className="w-5 h-5" />
              <span className="text-sm font-bold">
                {activeConfirm === "delete"
                  ? "Confirm Delete?"
                  : "Delete"}
              </span>
            </div>
            <p
              className={`text-[10px] text-left leading-tight ${
                activeConfirm === "delete"
                  ? "text-red-100"
                  : "text-red-500/80 dark:text-red-400/70"
              }`}
            >
              Permanently remove restaurant and all reviews.
            </p>
          </button>
        </div>
      </div>

      {/* ===== Collapsible Toggle Settings ===== */}
      <div className="border-t border-gray-100 dark:border-gray-800">
        <button
          type="button"
          onClick={() => setShowSettings(!showSettings)}
          className="w-full flex items-center justify-between px-5 py-3 text-xs font-bold text-gray-500 dark:text-gray-400 uppercase tracking-wider hover:bg-gray-50 dark:hover:bg-gray-800/50 transition-colors cursor-pointer"
        >
          <span className="flex items-center gap-2">
            <ToggleRight className="w-4 h-4" />
            Listing Settings & Visibility
          </span>
          {showSettings ? (
            <ChevronUp className="w-4 h-4" />
          ) : (
            <ChevronDown className="w-4 h-4" />
          )}
        </button>

        {showSettings && (
          <div className="px-5 pb-5 space-y-3 animate-in slide-in-from-top-1 fade-in duration-200">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              {/* Public Visibility */}
              <ToggleSwitch
                label="Public Discovery"
                description="Restaurant appears in search results, maps, and feed recommendations."
                enabled={isApproved}
                icon={isApproved ? Eye : EyeOff}
                iconColor={
                  isApproved
                    ? "text-emerald-600 dark:text-emerald-400"
                    : "text-gray-400"
                }
                readOnly
              />

              {/* Featured Listing */}
              <ToggleSwitch
                label="Featured Listing"
                description="Highlighted in trending section and homepage carousel."
                enabled={false}
                icon={Star}
                iconColor="text-amber-500"
                readOnly
              />

              {/* Delivery Available */}
              <ToggleSwitch
                label="Delivery Service"
                description="Restaurant marked as available for delivery orders."
                enabled={false}
                icon={Truck}
                iconColor="text-blue-500"
                readOnly
              />

              {/* Reservations */}
              <ToggleSwitch
                label="Reservations"
                description="Allow users to book tables directly from the listing page."
                enabled={false}
                icon={Calendar}
                iconColor="text-purple-500"
                readOnly
              />
            </div>

            {/* Status Info Cards */}
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 pt-2">
              {/* Ownership */}
              <div className="p-3.5 rounded-xl bg-gray-50 dark:bg-gray-800/50 border border-gray-200/70 dark:border-gray-700/60">
                <div className="text-[9px] font-bold text-gray-400 dark:text-gray-500 uppercase tracking-wider mb-1">
                  Ownership
                </div>
                <div className="text-xs font-bold text-gray-900 dark:text-white flex items-center gap-1.5">
                  {restaurant.owner ? (
                    <span className="text-emerald-700 dark:text-emerald-400 flex items-center gap-1">
                      <CheckCircle className="w-3 h-3" />
                      Claimed by {restaurant.owner.firstName}
                    </span>
                  ) : (
                    <span className="text-gray-500 dark:text-gray-400 flex items-center gap-1">
                      <AlertTriangle className="w-3 h-3" />
                      Unclaimed Listing
                    </span>
                  )}
                </div>
              </div>

              {/* Data Source */}
              <div className="p-3.5 rounded-xl bg-gray-50 dark:bg-gray-800/50 border border-gray-200/70 dark:border-gray-700/60">
                <div className="text-[9px] font-bold text-gray-400 dark:text-gray-500 uppercase tracking-wider mb-1">
                  Data Source
                </div>
                <div className="text-xs font-bold text-gray-900 dark:text-white flex items-center gap-1.5 capitalize">
                  {restaurant.source === "google" && (
                    <MdVerified
                      className="text-[#fbbe15] shrink-0"
                      size={14}
                    />
                  )}
                  {restaurant.source || "Direct Submission"}
                </div>
              </div>

              {/* Listing Location */}
              <div className="p-3.5 rounded-xl bg-gray-50 dark:bg-gray-800/50 border border-gray-200/70 dark:border-gray-700/60">
                <div className="text-[9px] font-bold text-gray-400 dark:text-gray-500 uppercase tracking-wider mb-1">
                  Location
                </div>
                <div className="text-xs font-bold text-gray-900 dark:text-white flex items-center gap-1.5">
                  <MapPin className="w-3 h-3 text-[#fbbe15]" />
                  <span className="truncate">
                    {restaurant.city || restaurant.state || "Not specified"}
                  </span>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
