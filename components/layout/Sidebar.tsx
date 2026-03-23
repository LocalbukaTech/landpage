"use client";

import { useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  Home,
  UtensilsCrossed,
  PlusCircle,
  Bell,
  Bookmark,
  Users,
  User,
  Search,
} from "lucide-react";
import Image from "next/image";
import { SearchOverlay } from "@/components/layout/SearchOverlay";
import { NotificationOverlay } from "@/components/layout/NotificationOverlay";
import { cn } from "@/lib/utils";
import AdSenseUnit from "@/components/AdSenseUnit";
import { useAuth } from "@/context/AuthContext";

const navItems = [
  { icon: Home, label: "Home", href: "/feeds" },
  { icon: UtensilsCrossed, label: "Buka", href: "/buka" },
  { icon: PlusCircle, label: "Upload", href: "/upload" },
  { icon: Bell, label: "Notification", href: "/notifications" },
  { icon: Bookmark, label: "Saved", href: "/profile?tab=saved" },
  { icon: Users, label: "Community", href: "#" },
  { icon: User, label: "Profile", href: "/profile" },
];

const mobileNavItems = [
  { icon: Home, label: "Home", href: "/feeds" },
  { icon: UtensilsCrossed, label: "Buka", href: "/buka" },
  { icon: PlusCircle, label: "Upload", href: "/upload" },
  { icon: Bell, label: "Inbox", href: "/notifications" },
  { icon: User, label: "Profile", href: "/profile" },
];

const footerLinks = [
  // { label: "Company", href: "https://localbuka.com/" },
  { label: "Terms & Policies", href: "https://localbuka.com/privacy/" },
];

export function Sidebar() {
  const pathname = usePathname();
  const [isSearchOpen, setIsSearchOpen] = useState(false);
  const [isNotificationOpen, setIsNotificationOpen] = useState(false);
  const { user, isAuthenticated } = useAuth();
  const userAvatar = isAuthenticated && user?.avatar ? user.avatar : null;

  const isCollapsed = isSearchOpen || isNotificationOpen;

  const handleNavClick = (label: string) => {
    if (label === "Search") {
      setIsSearchOpen(true);
      setIsNotificationOpen(false);
    } else if (label === "Notification" || label === "Inbox") {
      setIsNotificationOpen(true);
      setIsSearchOpen(false);
    } else {
      setIsSearchOpen(false);
      setIsNotificationOpen(false);
    }
  };

  return (
    <>
      {/* ── Desktop Sidebar ── */}
      <aside 
        className={cn(
          "hidden md:flex flex-col justify-between p-6 min-h-screen border-r border-white/5 bg-[#1a1a1a] transition-[width] duration-300 z-50 sticky top-0 h-screen overflow-y-auto scrollbar-hide",
          isCollapsed ? "w-[80px] px-3 items-center" : "w-[240px]"
        )}
      >
        <div className={cn("flex flex-col gap-6", isCollapsed ? "w-full items-center" : "")}>
          {/* Logo */}
          <Link 
            href='/' 
            className={cn(
              "flex items-center gap-1 py-2 text-2xl font-bold italic",
              isCollapsed ? "justify-center" : ""
            )}
          >
            {!isCollapsed && (
              <span 
                className='text-xl md:text-2xl text-white font-normal font-display'
              >
                LocalBuka
              </span>
            )}
            <Image
              src='/images/localBuka_logo.png'
              alt='LocalBuka'
              width={40}
              height={40}
              className='h-8 w-8 rounded-full'
              priority
            />
          </Link>

          {/* Search */}
          <div 
            className={cn(
              "relative flex items-center cursor-pointer bg-[#2a2a2a] rounded-lg transition-all",
              isCollapsed ? "w-10 h-10 justify-center mx-auto" : "w-full"
            )}
            onClick={() => handleNavClick("Search")}
            role="button"
            tabIndex={0}
            onKeyDown={(e) => {
              if (e.key === "Enter" || e.key === " ") {
                handleNavClick("Search");
              }
            }}
          >
            {isCollapsed ? (
              <div 
                className="w-[18px] h-[18px]"
                style={{
                  backgroundImage: `url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='24' height='24' viewBox='0 0 24 24' fill='none' stroke='%2371717a' stroke-width='2' stroke-linecap='round' stroke-linejoin='round'%3E%3Ccircle cx='11' cy='11' r='8'%3E%3C/circle%3E%3Cline x1='21' y1='21' x2='16.65' y2='16.65'%3E%3C/line%3E%3C/svg%3E")`,
                  backgroundSize: 'cover'
                }}
              />
            ) : (
              <>
                <Search className="absolute left-3 text-zinc-400" size={18} />
                <span className="w-full py-2.5 px-3 pl-10 text-sm text-zinc-400 rounded-lg">Search</span>
              </>
            )}
          </div>

          {/* Navigation */}
          <nav className={cn("flex flex-col gap-1 mt-4", isCollapsed ? "w-full" : "")}>
            {navItems.map((item) => {
              const isActive = item.href === "/" 
                ? pathname === "/" 
                : pathname?.startsWith(item.href);
              
              const isNotificationItem = item.label === "Notification";
              const activeState = isNotificationItem && isNotificationOpen 
                ? true 
                : isActive && !isNotificationOpen;

              return (
                <div key={item.label}>
                  {isNotificationItem ? (
                    <button
                      onClick={() => handleNavClick("Notification")}
                      className={cn(
                        "w-full flex items-center gap-3.5 p-3 rounded-lg text-[15px] font-medium transition-colors cursor-pointer border-none bg-transparent",
                        activeState ? "text-[#fbbe15]" : "text-white hover:bg-white/5",
                        isCollapsed ? "justify-center py-3" : ""
                      )}
                    >
                      <item.icon size={22} strokeWidth={activeState ? 2.5 : 2} />
                      {!isCollapsed && <span>{item.label}</span>}
                    </button>
                  ) : (
                    <Link
                      href={item.href}
                      className={cn(
                        "flex items-center gap-3.5 p-3 rounded-lg text-[15px] font-medium transition-colors",
                        activeState ? "text-[#fbbe15]" : "text-white hover:bg-white/5",
                        isCollapsed ? "justify-center py-3" : ""
                      )}
                      onClick={() => handleNavClick(item.label)}
                    >
                      {item.label === "Profile" && userAvatar ? (
                        <Image
                          src={userAvatar}
                          alt="Profile"
                          width={22}
                          height={22}
                          className={cn(
                            "rounded-full object-cover",
                            activeState ? "ring-2 ring-[#fbbe15]" : ""
                          )}
                          style={{ width: 22, height: 22 }}
                        />
                      ) : (
                        <item.icon size={22} strokeWidth={activeState ? 2.5 : 2} />
                      )}
                      {!isCollapsed && <span>{item.label}</span>}
                    </Link>
                  )}
                </div>
              );
            })}
          </nav>
        </div>

        {/* Ad Unit and Login/Footer */}
        <div className="flex flex-col gap-6 pt-4 mt-auto">
          {!isCollapsed && (
            <div className="px-2">
              <AdSenseUnit />
            </div>
          )}
          
          {!isCollapsed && (
            <>
              
              
              <footer className="flex flex-col gap-2">
                <div className="flex flex-col gap-x-3 gap-y-1">
                  {footerLinks.map((link) => (
                    <Link key={link.label} href={link.href} className="text-[12px] text-zinc-500 hover:text-zinc-300 transition-colors whitespace-nowrap">
                      {link.label}
                    </Link>
                  ))}
                </div>
                <span className="text-[11px] text-zinc-600 mt-1">© 2025 Localbuka</span>
              </footer>
            </>
          )}
        </div>
      </aside>

      {/* ── Mobile Top Header ── */}
      <div className="md:hidden fixed top-0 left-0 right-0 h-14 bg-[#1a1a1a] border-b border-white/5 flex items-center justify-between px-4 z-50">
        <div className="w-8" />
        <div className="flex items-center gap-2">
           <span className="text-xl text-white font-normal" style={{ fontFamily: 'var(--font-hakuna), sans-serif' }}>
              LocalBuka
           </span>
           <Image
              src='/images/localBuka_logo.png'
              alt='LocalBuka'
              width={24}
              height={24}
              className='h-6 w-6 rounded-full'
           />
        </div>
        <button onClick={() => handleNavClick("Search")} className="w-8 flex justify-end text-white">
          <Search size={22} />
        </button>
      </div>

      {/* ── Mobile Bottom Nav ── */}
      <div className="md:hidden fixed bottom-0 left-0 right-0 h-16 bg-[#1a1a1a] border-t border-white/5 flex items-center justify-around z-50 pb-safe">
        {mobileNavItems.map((item) => {
          const isActive = item.href === "/" 
            ? pathname === "/" 
            : pathname?.startsWith(item.href);
          
          const isNotificationItem = item.label === "Inbox";
          const activeState = isNotificationItem && isNotificationOpen 
            ? true 
            : isActive && !isNotificationOpen;

          if (item.label === "Upload") {
             return (
              <Link 
                key={item.label} 
                href={item.href}
                className="flex flex-col items-center gap-1"
              >
                 <PlusCircle size={32} className="fill-[#fbbe15] text-[#1a1a1a]" />
              </Link>
             )
          }

          if (isNotificationItem) {
             return (
              <button
                key={item.label}
                onClick={() => handleNavClick("Notification")}
                className={cn(
                  "flex flex-col items-center gap-1 w-12",
                  activeState ? "text-white" : "text-zinc-500"
                )}
              >
                <item.icon size={22} strokeWidth={activeState ? 2.5 : 2} />
                <span className="text-[10px] font-medium">{item.label}</span>
              </button>
             )
          }

          return (
            <Link
              key={item.label}
              href={item.href}
              className={cn(
                "flex flex-col items-center gap-1 w-12",
                activeState ? "text-white" : "text-zinc-500"
              )}
              onClick={() => handleNavClick(item.label)}
            >
              {item.label === "Profile" && userAvatar ? (
                <Image
                  src={userAvatar}
                  alt="Profile"
                  width={22}
                  height={22}
                  className={cn(
                    "rounded-full object-cover",
                    activeState ? "ring-2 ring-white" : ""
                  )}
                  style={{ width: 22, height: 22 }}
                />
              ) : (
                <item.icon size={22} strokeWidth={activeState ? 2.5 : 2} />
              )}
              <span className="text-[10px] font-medium">{item.label}</span>
            </Link>
          );
        })}
      </div>

      {/* Overlays */}
      <SearchOverlay 
        isOpen={isSearchOpen} 
        onClose={() => setIsSearchOpen(false)} 
      />
      
      <NotificationOverlay 
        isOpen={isNotificationOpen} 
        onClose={() => setIsNotificationOpen(false)} 
      />
    </>
  );
}
