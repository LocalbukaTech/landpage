"use client";

import { useState, useRef, useEffect } from "react";
import { MoreVertical, Check, Ban } from "lucide-react";

interface UserRowActionsProps {
    userId: string;
    onMarkSafe?: (userId: string) => void;
    onBanUser?: (userId: string) => void;
}

export function UserRowActions({ userId, onMarkSafe, onBanUser }: UserRowActionsProps) {
    const [isOpen, setIsOpen] = useState(false);
    const menuRef = useRef<HTMLDivElement>(null);

    // Close on outside click
    useEffect(() => {
        if (!isOpen) return;

        const handleClickOutside = (e: MouseEvent) => {
            if (menuRef.current && !menuRef.current.contains(e.target as Node)) {
                setIsOpen(false);
            }
        };

        document.addEventListener("mousedown", handleClickOutside);
        return () => document.removeEventListener("mousedown", handleClickOutside);
    }, [isOpen]);

    // Close on Escape
    useEffect(() => {
        if (!isOpen) return;

        const handleEscape = (e: KeyboardEvent) => {
            if (e.key === "Escape") setIsOpen(false);
        };

        document.addEventListener("keydown", handleEscape);
        return () => document.removeEventListener("keydown", handleEscape);
    }, [isOpen]);

    return (
        <div ref={menuRef} className="relative">
            <button
                onClick={() => setIsOpen((prev) => !prev)}
                className="w-7 h-7 flex items-center justify-center rounded hover:bg-zinc-100 dark:hover:bg-gray-800 transition-colors text-zinc-400 dark:text-zinc-500 hover:text-zinc-600 dark:hover:text-zinc-200 cursor-pointer"
            >
                <MoreVertical size={16} />
            </button>

            {isOpen && (
                <div className="absolute right-0 top-full mt-1 w-44 bg-white dark:bg-gray-800 rounded-lg border border-zinc-200 dark:border-gray-700 shadow-lg py-1 z-50 animate-in fade-in slide-in-from-top-1 duration-150">
                    <button
                        onClick={() => {
                            onMarkSafe?.(userId);
                            setIsOpen(false);
                        }}
                        className="w-full flex items-center gap-2.5 px-3 py-2 text-sm text-zinc-700 dark:text-zinc-200 hover:bg-zinc-50 dark:hover:bg-gray-700/60 transition-colors cursor-pointer border-none bg-transparent"
                    >
                        <Check size={16} className="text-green-500" />
                        Mark as Safe
                    </button>
                    <button
                        onClick={() => {
                            onBanUser?.(userId);
                            setIsOpen(false);
                        }}
                        className="w-full flex items-center gap-2.5 px-3 py-2 text-sm text-zinc-700 dark:text-zinc-200 hover:bg-zinc-50 dark:hover:bg-gray-700/60 transition-colors cursor-pointer border-none bg-transparent"
                    >
                        <Ban size={16} className="text-red-500" />
                        Ban User
                    </button>
                </div>
            )}
        </div>
    );
}
