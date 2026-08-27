"use client";

import Image from "next/image";
import { Settings, Bell, LogOut, PanelLeftClose, PanelLeftOpen, ChevronsRight } from "lucide-react";

interface AdminHeaderProps {
  isCollapsed?: boolean;
  onToggleCollapse?: () => void;
  onLogoutClick?: () => void;
}

export function AdminHeader({
  isCollapsed = false,
  onToggleCollapse,
  onLogoutClick,
}: AdminHeaderProps) {
  return (
    <header className="h-16 w-full border-b border-gray-200 dark:border-gray-800 bg-white dark:bg-gray-900 flex items-center justify-between px-6 gap-3 shrink-0 z-30">
      {/* Left: Visible Expand Toggle when collapsed */}
      <div className="flex items-center gap-3">
        {isCollapsed && onToggleCollapse && (
           <button
                type="button"
                onClick={onToggleCollapse}
                className="w-7 h-7 rounded-lg bg-gray-100 hover:bg-[#fbbe15] dark:bg-gray-800 dark:hover:bg-[#fbbe15] text-gray-500 hover:text-black dark:text-gray-400 dark:hover:text-black transition-all cursor-pointer border-none flex items-center justify-center shadow-2xs"
                title="Expand sidebar"
              >
                <ChevronsRight size={14} />
              </button>
        )}
      </div>

      {/* Right: Actions & User Menu */}
      <div className="flex items-center gap-3">
        {/* Settings */}
        <button
          type="button"
          className="w-9 h-9 rounded-lg flex items-center justify-center text-gray-500 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors cursor-pointer border-none bg-transparent"
          title="Settings"
        >
          <Settings size={18} />
        </button>

        {/* Notifications */}
        <button
          type="button"
          className="relative w-9 h-9 rounded-lg flex items-center justify-center text-gray-500 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors cursor-pointer border-none bg-transparent"
          title="Notifications"
        >
          <Bell size={18} />
          <span className="absolute top-2 right-2 w-2 h-2 rounded-full bg-red-500" />
        </button>

        {/* Admin Avatar */}
        <div className="flex items-center gap-2 pl-2 pr-1">
          <Image
            src="/images/localBuka_logo.png"
            alt="Admin"
            width={30}
            height={30}
            className="w-7 h-7 rounded-full object-contain border border-gray-200 dark:border-gray-700"
          />
        </div>

        {/* Logout */}
        {onLogoutClick && (
          <button
            type="button"
            onClick={onLogoutClick}
            className="w-9 h-9 rounded-lg flex items-center justify-center text-red-500 hover:bg-red-50 dark:hover:bg-red-950/40 transition-colors cursor-pointer border-none bg-transparent"
            title="Sign Out"
          >
            <LogOut size={18} />
          </button>
        )}
      </div>
    </header>
  );
}
