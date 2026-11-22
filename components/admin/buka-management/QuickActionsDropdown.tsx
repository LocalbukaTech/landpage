"use client";

import { useState, useRef, useEffect } from "react";
import Link from "next/link";
import {
  MoreHorizontal,
  CheckCircle,
  PauseCircle,
  XCircle,
  Trash2,
  Eye,
  RefreshCw,
} from "lucide-react";
import type { Restaurant } from "@/lib/api/services/restaurants.service";

interface QuickActionsDropdownProps {
  restaurant: Restaurant;
  onApprove: (restaurant: Restaurant) => void;
  onSuspend: (restaurant: Restaurant) => void;
  onReject: (restaurant: Restaurant) => void;
  onDelete: (restaurant: Restaurant) => void;
  isUpdating?: boolean;
}

export function QuickActionsDropdown({
  restaurant,
  onApprove,
  onSuspend,
  onReject,
  onDelete,
  isUpdating,
}: QuickActionsDropdownProps) {
  const [isOpen, setIsOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  const isApproved = restaurant.status === "approved";
  const isPending = restaurant.status === "pending" || !restaurant.status;
  const isSuspended = restaurant.status === "suspended";
  const isRejected = restaurant.status === "rejected";

  // Close on outside click
  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (
        dropdownRef.current &&
        !dropdownRef.current.contains(event.target as Node)
      ) {
        setIsOpen(false);
      }
    }
    if (isOpen) {
      document.addEventListener("mousedown", handleClickOutside);
    }
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, [isOpen]);

  // Close on escape key
  useEffect(() => {
    function handleEscape(event: KeyboardEvent) {
      if (event.key === "Escape") setIsOpen(false);
    }
    if (isOpen) {
      document.addEventListener("keydown", handleEscape);
    }
    return () => document.removeEventListener("keydown", handleEscape);
  }, [isOpen]);

  const actions = [
    // View details — always available
    {
      type: "link" as const,
      href: `/secure-admin/buka-management/${restaurant.id}`,
      label: "View Full Details",
      description: "Open restaurant profile & settings",
      icon: Eye,
      iconColor: "text-blue-600 dark:text-blue-400",
      bgHover: "hover:bg-blue-50 dark:hover:bg-blue-950/30",
      show: !!restaurant.id,
    },
    { type: "divider" as const, show: true },
    // Approve / Reactivate
    {
      type: "button" as const,
      label: isApproved
        ? "Already Approved"
        : isSuspended
          ? "Reactivate Listing"
          : "Approve Listing",
      description: isApproved
        ? "This restaurant is currently live"
        : "Make visible on search & discovery",
      icon: isApproved ? CheckCircle : isSuspended ? RefreshCw : CheckCircle,
      iconColor: "text-emerald-600 dark:text-emerald-400",
      bgHover: "hover:bg-emerald-50 dark:hover:bg-emerald-950/30",
      onClick: () => {
        onApprove(restaurant);
        setIsOpen(false);
      },
      disabled: isApproved || isUpdating,
      show: true,
    },
    // Suspend
    {
      type: "button" as const,
      label: isSuspended ? "Already Suspended" : "Suspend Listing",
      description: isSuspended
        ? "This restaurant is currently suspended"
        : "Temporarily hide from public view",
      icon: PauseCircle,
      iconColor: "text-amber-600 dark:text-amber-400",
      bgHover: "hover:bg-amber-50 dark:hover:bg-amber-950/30",
      onClick: () => {
        onSuspend(restaurant);
        setIsOpen(false);
      },
      disabled: isSuspended || isUpdating,
      show: true,
    },
    // Reject
    {
      type: "button" as const,
      label: isRejected ? "Already Rejected" : "Reject Submission",
      description: isRejected
        ? "This restaurant was rejected"
        : "Decline due to invalid or duplicate info",
      icon: XCircle,
      iconColor: "text-rose-600 dark:text-rose-400",
      bgHover: "hover:bg-rose-50 dark:hover:bg-rose-950/30",
      onClick: () => {
        onReject(restaurant);
        setIsOpen(false);
      },
      disabled: isRejected || isUpdating,
      show: true,
    },
    { type: "divider" as const, show: true },
    // Delete
    {
      type: "button" as const,
      label: "Delete Permanently",
      description: "Remove restaurant and all associated data",
      icon: Trash2,
      iconColor: "text-red-600 dark:text-red-500",
      bgHover: "hover:bg-red-50 dark:hover:bg-red-950/30",
      onClick: () => {
        onDelete(restaurant);
        setIsOpen(false);
      },
      disabled: isUpdating,
      show: true,
      danger: true,
    },
  ];

  return (
    <div className="relative" ref={dropdownRef}>
      <button
        type="button"
        onClick={() => setIsOpen(!isOpen)}
        className={`p-1.5 rounded-lg border transition-all cursor-pointer ${
          isOpen
            ? "bg-gray-100 dark:bg-gray-800 border-gray-300 dark:border-gray-600"
            : "border-gray-200 dark:border-gray-700 hover:bg-gray-50 dark:hover:bg-gray-800 text-gray-500 dark:text-gray-400"
        }`}
        title="More actions"
      >
        <MoreHorizontal size={16} />
      </button>

      {isOpen && (
        <div
          className="absolute right-0 top-full mt-1.5 w-72 bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-700 rounded-xl shadow-xl z-50 py-1.5 animate-in fade-in slide-in-from-top-1 duration-150"
          style={{ transformOrigin: "top right" }}
        >
          {/* Header */}
          <div className="px-3 pt-1.5 pb-2 border-b border-gray-100 dark:border-gray-800">
            <p className="text-[10px] font-bold uppercase tracking-wider text-gray-400 dark:text-gray-500">
              Actions for {restaurant.name?.slice(0, 28)}
              {(restaurant.name?.length || 0) > 28 ? "…" : ""}
            </p>
          </div>

          <div className="py-1">
            {actions
              .filter((a) => a.show)
              .map((action, idx) => {
                if (action.type === "divider") {
                  return (
                    <div
                      key={`divider-${idx}`}
                      className="my-1 border-t border-gray-100 dark:border-gray-800"
                    />
                  );
                }

                if (action.type === "link" && "href" in action) {
                  const Icon = action.icon;
                  return (
                    <Link
                      key={action.label}
                      href={action.href!}
                      className={`flex items-start gap-2.5 px-3 py-2 text-left w-full ${action.bgHover} transition-colors`}
                      onClick={() => setIsOpen(false)}
                    >
                      <Icon
                        className={`w-4 h-4 mt-0.5 shrink-0 ${action.iconColor}`}
                      />
                      <div className="min-w-0">
                        <span className="text-xs font-semibold text-gray-900 dark:text-white block">
                          {action.label}
                        </span>
                        <span className="text-[10px] text-gray-500 dark:text-gray-400 block leading-tight">
                          {action.description}
                        </span>
                      </div>
                    </Link>
                  );
                }

                if (action.type === "button") {
                  const Icon = action.icon;
                  return (
                    <button
                      key={action.label}
                      type="button"
                      onClick={action.onClick}
                      disabled={action.disabled}
                      className={`flex items-start gap-2.5 px-3 py-2 text-left w-full transition-colors cursor-pointer ${
                        action.disabled
                          ? "opacity-40 cursor-not-allowed"
                          : action.bgHover
                      }`}
                    >
                      <Icon
                        className={`w-4 h-4 mt-0.5 shrink-0 ${action.iconColor}`}
                      />
                      <div className="min-w-0">
                        <span
                          className={`text-xs font-semibold block ${
                            "danger" in action && action.danger
                              ? "text-red-700 dark:text-red-400"
                              : "text-gray-900 dark:text-white"
                          }`}
                        >
                          {action.label}
                        </span>
                        <span className="text-[10px] text-gray-500 dark:text-gray-400 block leading-tight">
                          {action.description}
                        </span>
                      </div>
                    </button>
                  );
                }

                return null;
              })}
          </div>
        </div>
      )}
    </div>
  );
}
