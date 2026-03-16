"use client";

import Image from "next/image";
import { Settings, Bell, LogOut } from "lucide-react";

export function AdminHeader() {
    return (
        <header className="h-14 border-b border-zinc-200 bg-white flex items-center justify-end px-6 gap-3 sticky top-0 z-40">
            {/* Settings */}
            <button className="w-9 h-9 flex items-center justify-center rounded-full hover:bg-zinc-100 transition-colors text-zinc-500">
                <Settings size={20} />
            </button>

            {/* Notifications */}
            <button className="w-9 h-9 flex items-center justify-center rounded-full hover:bg-zinc-100 transition-colors text-zinc-500">
                <Bell size={20} />
            </button>

            {/* Avatar */}
            <Image
                src="/images/localBuka_logo.png"
                alt="Admin Avatar"
                width={32}
                height={32}
                className="h-8 w-8 rounded-full object-cover border border-zinc-200"
            />

            {/* Logout */}
            <button className="w-9 h-9 flex items-center justify-center rounded-full hover:bg-red-50 transition-colors text-red-400 hover:text-red-500">
                <LogOut size={20} />
            </button>
        </header>
    );
}
