"use client";

import { User, Shield, Target } from "lucide-react";
import Link from "next/link";

interface SettingsSidebarProps {
  activeSection: string;
  onSectionChange: (section: string) => void;
}

const sidebarItems = [
  { id: "account", label: "Account Information", icon: User },
  { id: "notifications", label: "Notifications & Privacy", icon: Shield },
  { id: "rewards", label: "Rewards & Support", icon: Target },
];

const footerLinks = [
  { label: "Company", href: "https://localbuka.com/" },
  { label: "Program", href: "/program" },
  { label: "Terms & Policies", href: "https://localbuka.com/privacy" },
];

export function SettingsSidebar({ activeSection, onSectionChange }: SettingsSidebarProps) {
  return (
    <div className="flex flex-col justify-between h-full">
      <nav className="flex flex-col gap-1">
        {sidebarItems.map((item) => {
          const isActive = activeSection === item.id;
          return (
            <button
              key={item.id}
              onClick={() => onSectionChange(item.id)}
              className={`flex items-center gap-3 px-3 py-3 rounded-lg text-sm font-medium transition-colors cursor-pointer bg-transparent border-0 text-left ${
                isActive
                  ? "text-[#FBBE15]"
                  : "text-white hover:text-zinc-300"
              }`}
            >
              <item.icon size={18} />
              <span>{item.label}</span>
            </button>
          );
        })}
      </nav>

      <footer className="flex flex-col gap-2 pt-6 mt-auto">
        {footerLinks.map((link) => (
          <Link
            key={link.label}
            href={link.href}
            className="text-xs text-zinc-400 hover:text-zinc-300 transition-colors font-semibold"
          >
            {link.label}
          </Link>
        ))}
        <span className="text-[11px] text-zinc-600 mt-1">© 2025 Localbuka</span>
      </footer>
    </div>
  );
}
