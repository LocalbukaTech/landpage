"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import Image from "next/image";
import {
  LayoutDashboard,
  User,
  Building2,
  ShieldAlert,
  Megaphone,
  LineChart,
} from "lucide-react";
import { FaUsers } from "react-icons/fa6";
import { cn } from "@/lib/utils";

const adminNavItems = [
  { icon: LayoutDashboard, label: "Dashboard", href: "/secure-admin/dashboard" },
  { icon: User, label: "User Management", href: "/secure-admin/user-management" },
  { icon: Building2, label: "Buka Management", href: "/secure-admin/buka-management" },
  { icon: ShieldAlert, label: "Content Moderation", href: "/secure-admin/content-moderation" },
  { icon: Megaphone, label: "Ad Placements", href: "/secure-admin/ad-placements" },
  { icon: LineChart, label: "Analytics & Reporting", href: "/secure-admin/analytics" },
  { icon: FaUsers, label: "Roles", href: "/secure-admin/roles" },
];

export function AdminSidebar() {
  const pathname = usePathname();

  return (
    <aside className="w-[260px] min-h-screen bg-white border-r border-gray-100 flex flex-col pt-6 font-sans">
      {/* Logo Area */}
      <Link href="/secure-admin/user-management" className="flex items-center gap-2 px-6 mb-10">
        <span 
          className="text-2xl text-black font-normal"
          style={{ fontFamily: 'var(--font-hakuna), sans-serif' }}
        >
          LocalBuka
        </span>
        <div className="w-8 h-8 rounded-full bg-[#fbbe15] flex items-center justify-center">
          <Image
            src="/images/localBuka_logo.png"
            alt="LocalBuka"
            width={24}
            height={24}
            className="rounded-full"
          />
        </div>
      </Link>

      {/* Navigation */}
      <nav className="flex flex-col gap-2 px-4 flex-1">
        {adminNavItems.map((item) => {
          const isActive = pathname?.startsWith(item.href);

          return (
            <Link
              key={item.label}
              href={item.href}
              className={cn(
                "flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-medium transition-colors",
                isActive 
                  ? "bg-[#FCF7E8] text-[#695009]" // Yellow tint background with #695009 text
                  : "text-gray-500 hover:bg-gray-50 hover:text-gray-900"
              )}
            >
              <item.icon 
                size={20} 
                className={isActive ? "text-[#695009]" : "text-gray-400"}
              />
              {item.label}
            </Link>
          );
        })}
      </nav>
    </aside>
  );
}
