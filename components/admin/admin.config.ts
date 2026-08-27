import {
  LayoutGrid,
  Newspaper,
  Users2,
  Clock3,
  UserCog,
  Gift,
  UtensilsCrossed,
  ShieldCheck,
  Megaphone,
  TrendingUp,
  KeyRound,
  LucideIcon,
} from 'lucide-react';
import { IconType } from 'react-icons';
import { BsClock } from 'react-icons/bs';
import { FaBlogger } from 'react-icons/fa6';
import { IoIosPeople } from 'react-icons/io';
import { MdSpaceDashboard } from 'react-icons/md';

export interface AdminNavItem {
  name: string;
  href: string;
  icon: LucideIcon | IconType;
}

export const ADMIN_NAV_ITEMS: AdminNavItem[] = [
  {
    name: 'Dashboard',
    href: '/secure-admin/dashboard',
    icon: MdSpaceDashboard,
  },
  {
    name: 'Blog',
    href: '/secure-admin/blog',
    icon: FaBlogger,
  },
  {
    name: 'Teams',
    href: '/secure-admin/teams',
    icon: IoIosPeople,
  },
  {
    name: 'Waitlist',
    href: '/secure-admin/waitlist',
    icon: BsClock,
  },
  {
    name: 'User Management',
    href: '/secure-admin/user-management',
    icon: UserCog,
  },
  {
    name: 'Rewards & Referrals',
    href: '/secure-admin/rewards',
    icon: Gift,
  },
  {
    name: 'Buka Management',
    href: '/secure-admin/buka-management',
    icon: UtensilsCrossed,
  },
  {
    name: 'Content Moderation',
    href: '/secure-admin/content-moderation',
    icon: ShieldCheck,
  },
  {
    name: 'Ad Placements',
    href: '/secure-admin/ad-placements',
    icon: Megaphone,
  },
  {
    name: 'Analytics & Reporting',
    href: '/secure-admin/analytics',
    icon: TrendingUp,
  },
  {
    name: 'Roles',
    href: '/secure-admin/roles',
    icon: KeyRound,
  },
];
