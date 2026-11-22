"use client";

import { useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import Image from "next/image";
import { LogOut, ChevronsLeft } from "lucide-react";
import { cn } from "@/lib/utils";
import { ADMIN_NAV_ITEMS } from "@/components/admin/admin.config";
import { getAdminUser } from "@/lib/auth";
import type { Admin } from "@/lib/api/services/auth.service";

interface AdminSidebarProps {
  isCollapsed?: boolean;
  onToggleCollapse?: () => void;
  onLogoutClick?: () => void;
  className?: string;
}

export function AdminSidebar({
  isCollapsed = false,
  onToggleCollapse,
  onLogoutClick,
  className,
}: AdminSidebarProps) {
  const pathname = usePathname();
  const [admin] = useState<Admin | null>(() => getAdminUser());

  const adminInitials = admin
    ? `${admin.first_name?.[0] || ""}${admin.last_name?.[0] || ""}`.toUpperCase()
    : "A";

  return (
    <aside
      className={cn(
        "bg-white dark:bg-gray-900 border-r border-gray-200 dark:border-gray-800 flex flex-col justify-between h-screen shrink-0 z-40 select-none transition-all duration-300 ease-in-out",
        isCollapsed ? "w-16" : "w-60",
        className,
      )}
    >
      {/* ── Top Section: Logo & Modern Collapse Toggle ── */}
      <div
        className={cn(
          "shrink-0 flex items-center border-b border-gray-200 dark:border-gray-800 transition-all duration-300",
          isCollapsed
            ? "h-16 justify-center px-2"
            : "h-16 justify-between px-4",
        )}
      >
        {!isCollapsed ? (
          <>
            <Link
              href="/secure-admin/dashboard"
              className="flex items-center gap-2.5 min-w-0"
            >
              <Image
                src="/images/localBuka_logo.png"
                alt="LocalBuka"
                width={28}
                height={28}
                className="w-7 h-7 object-contain rounded-full shrink-0"
                priority
              />
              <div className="min-w-0">
                <h1 className="text-sm font-bold text-gray-900 dark:text-white leading-tight truncate">
                  LocalBuka
                </h1>
                <p className="text-[10px] text-gray-500 dark:text-gray-400 leading-none truncate">
                  Admin Panel
                </p>
              </div>
            </Link>

            {onToggleCollapse && (
              <button
                type="button"
                onClick={onToggleCollapse}
                className="w-7 h-7 rounded-lg flex items-center justify-center text-gray-400 hover:text-gray-700 dark:hover:text-gray-200 hover:bg-gray-100 dark:hover:bg-gray-800 transition-all cursor-pointer border-none bg-transparent"
                title="Collapse sidebar"
              >
                <ChevronsLeft size={16} />
              </button>
            )}
          </>
        ) : (
          <div className="flex flex-col items-center justify-center gap-1.5 py-1">
            <Link href="/secure-admin/dashboard" title="LocalBuka Admin">
              <Image
                src="/images/localBuka_logo.png"
                alt="LocalBuka"
                width={26}
                height={26}
                className="w-6 h-6 object-contain rounded-full"
                priority
              />
            </Link>
          </div>
        )}
      </div>

      {/* ── Navigation Section ── */}
      <nav
        className={cn(
          "flex-1 overflow-y-auto space-y-1 scrollbar-thin scrollbar-thumb-gray-200 dark:scrollbar-thumb-gray-700 py-3",
          isCollapsed ? "px-2" : "px-3",
        )}
      >
        {ADMIN_NAV_ITEMS.map((item) => {
          const isActive =
            pathname === item.href ||
            (item.href !== "/secure-admin/dashboard" &&
              pathname?.startsWith(item.href));
          const Icon = item.icon;

          return (
            <Link
              key={item.name}
              href={item.href}
              title={isCollapsed ? item.name : undefined}
              className={cn(
                "flex items-center rounded-xl text-xs font-medium transition-all duration-150 relative group",
                isCollapsed
                  ? "w-10 h-10 mx-auto justify-center p-0"
                  : "gap-2.5 px-3 py-2.5",
                isActive
                  ? "bg-[#fbbe15] text-[#1a1a1a] font-bold shadow-xs"
                  : "text-gray-600 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-gray-800 hover:text-gray-900 dark:hover:text-gray-100",
              )}
            >
              <Icon
                className={cn("shrink-0", isCollapsed ? "w-5 h-5" : "w-4 h-4")}
              />
              {!isCollapsed && <span className="truncate">{item.name}</span>}

              {/* Floating Tooltip in Collapsed Mode */}
              {isCollapsed && (
                <div className="absolute left-full ml-3 px-2.5 py-1 rounded-md bg-gray-950 text-white text-[11px] font-semibold whitespace-nowrap opacity-0 pointer-events-none group-hover:opacity-100 transition-opacity z-50 shadow-xl border border-white/10">
                  {item.name}
                </div>
              )}
            </Link>
          );
        })}
      </nav>

      {/* ── User & Logout Footer ── */}
      <div
        className={cn(
          "shrink-0 border-t border-gray-200 dark:border-gray-800 bg-gray-50/60 dark:bg-gray-900/60 transition-all duration-300",
          isCollapsed
            ? "p-2 flex flex-col items-center gap-2"
            : "p-3 flex items-center justify-between gap-2",
        )}
      >
        {!isCollapsed ? (
          <>
            <div className="flex-1 min-w-0 px-2.5 py-1.5 bg-white dark:bg-gray-800/90 rounded-lg border border-gray-200/70 dark:border-gray-700/70">
              <p className="text-xs font-semibold text-gray-900 dark:text-white capitalize truncate">
                {admin
                  ? `${admin.first_name} ${admin.last_name}`
                  : "Administrator"}
              </p>
              <p className="text-[10px] text-gray-500 dark:text-gray-400 truncate">
                {admin?.email ?? "admin@admin.com"}
              </p>
            </div>
            {onLogoutClick && (
              <button
                onClick={onLogoutClick}
                className="w-8 h-8 flex items-center justify-center rounded-lg text-red-500 hover:bg-red-50 dark:hover:bg-red-950/40 transition-colors cursor-pointer border-none bg-transparent shrink-0"
                title="Sign Out"
              >
                <LogOut size={16} />
              </button>
            )}
          </>
        ) : (
          <>
            <div
              className="w-9 h-9 rounded-xl bg-amber-100 dark:bg-amber-950/60 text-amber-800 dark:text-amber-300 font-bold text-xs flex items-center justify-center border border-amber-300/40"
              title={
                admin
                  ? `${admin.first_name} ${admin.last_name}`
                  : "Administrator"
              }
            >
              {adminInitials}
            </div>
            {onLogoutClick && (
              <button
                onClick={onLogoutClick}
                className="w-8 h-8 flex items-center justify-center rounded-lg text-red-500 hover:bg-red-50 dark:hover:bg-red-950/40 transition-colors cursor-pointer border-none bg-transparent shrink-0"
                title="Sign Out"
              >
                <LogOut size={15} />
              </button>
            )}
          </>
        )}
      </div>
    </aside>
  );
}
