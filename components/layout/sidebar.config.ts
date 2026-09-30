import {
  Home,
  UtensilsCrossed,
  PlusCircle,
  Bell,
  Bookmark,
  Users,
  User,
  Store,
  Gift,
  TrendingUp,
  type LucideIcon,
} from 'lucide-react';

/**
 * Auth Requirement options for Navigation Items:
 * - 'public': Visible to everyone. Clicking does NOT require login.
 * - 'auth-prompt': Visible to everyone. Clicking when unauthenticated automatically triggers the Auth Modal prompt.
 * - 'auth-only': Only visible when user is logged in (hidden from guests).
 * - 'guest-only': Only visible when user is logged out (e.g. Sign In / Sign Up).
 */
export type AuthRequirement = 'public' | 'auth-prompt' | 'auth-only' | 'guest-only';

export interface NavItemConfig {
  id: string;
  label: string;
  href: string;
  icon: LucideIcon;

  /**
   * Adjust whether authentication is required to view or access this item
   */
  authRequirement: AuthRequirement;

  /**
   * Whether this item appears in the Desktop Sidebar (default: true)
   */
  showInDesktop?: boolean;

  /**
   * Whether this item appears in the Mobile Bottom Navigation Bar (default: false)
   */
  showInMobileBottom?: boolean;

  /**
   * Custom label when rendered in Mobile Bottom Bar (e.g. 'Inbox' instead of 'Notification')
   */
  mobileBottomLabel?: string;

  /**
   * Whether this item appears in the Mobile Left Drawer Menu (default: true)
   */
  showInMobileDrawer?: boolean;

  /**
   * Special interaction behavior:
   * - 'link': standard navigation
   * - 'notification-overlay': toggles desktop notification panel overlay
   * - 'search-overlay': toggles search overlay
   * - 'upload-button': renders the styled action icon (e.g. yellow plus in bottom bar)
   */
  actionType?: 'link' | 'notification-overlay' | 'search-overlay' | 'upload-button';
}

/**
 * Central Navigation Configuration
 * Edit the properties (especially `authRequirement`) here to customize access rules across desktop, mobile bar, and mobile drawer.
 */
export const SIDEBAR_NAV_ITEMS: NavItemConfig[] = [
  {
    id: 'home',
    label: 'Home',
    href: '/',
    icon: Home,
    authRequirement: 'public',
    showInDesktop: true,
    showInMobileBottom: true,
    showInMobileDrawer: true,
  },
  {
    id: 'buka',
    label: 'Buka',
    href: '/buka',
    icon: UtensilsCrossed,
    authRequirement: 'public',
    showInDesktop: true,
    showInMobileBottom: true,
    showInMobileDrawer: true,
  },
  {
    id: 'list-restaurant',
    label: 'List Restaurant',
    href: '/buka/my-restaurant',
    icon: Store,
    // Clicking when logged out prompts Auth Modal before routing
    authRequirement: 'auth-prompt',
    showInDesktop: true,
    showInMobileBottom: false,
    showInMobileDrawer: true,
  },
  {
    id: 'upload',
    label: 'Upload',
    href: '/studio',
    icon: PlusCircle,
    // Can be 'auth-prompt' (guests see button, click asks to login) or 'auth-only' (hidden from guests)
    authRequirement: 'auth-prompt',
    showInDesktop: true,
    showInMobileBottom: true,
    showInMobileDrawer: true,
    actionType: 'upload-button',
  },
  {
    id: 'notifications',
    label: 'Notification',
    href: '/notifications',
    icon: Bell,
    authRequirement: 'auth-prompt',
    showInDesktop: true,
    showInMobileBottom: true,
    mobileBottomLabel: 'Inbox',
    showInMobileDrawer: true,
    actionType: 'notification-overlay',
  },
  {
    id: 'saved',
    label: 'Saved',
    href: '/profile?tab=saved',
    icon: Bookmark,
    authRequirement: 'auth-prompt',
    showInDesktop: true,
    showInMobileBottom: false,
    showInMobileDrawer: true,
  },
  {
    id: 'community',
    label: 'Community',
    href: '#',
    icon: Users,
    authRequirement: 'public',
    showInDesktop: true,
    showInMobileBottom: false,
    showInMobileDrawer: true,
  },
  {
    id: 'rewards',
    label: 'Refer & Earn',
    href: '/rewards',
    icon: Gift,
    authRequirement: 'auth-prompt',
    showInDesktop: true,
    showInMobileBottom: false,
    showInMobileDrawer: true,
  },
  {
    id: 'insights',
    label: 'Insights',
    href: '/insights',
    icon: TrendingUp,
    authRequirement: 'auth-prompt',
    showInDesktop: true,
    showInMobileBottom: false,
    showInMobileDrawer: true,
  },
  {
    id: 'profile',
    label: 'Profile',
    href: '/profile',
    icon: User,
    authRequirement: 'auth-prompt',
    showInDesktop: true,
    showInMobileBottom: true,
    showInMobileDrawer: true,
  },
];

export const FOOTER_LINKS = [
  { label: 'Company', href: '/company' },
  { label: 'Blogs', href: '/blog' },
  { label: 'Terms & Policies', href: '/privacy' },
];

/**
 * Filter items for Desktop Sidebar based on authentication state
 */
export function getDesktopNavItems(isAuthenticated: boolean): NavItemConfig[] {
  return SIDEBAR_NAV_ITEMS.filter((item) => {
    if (item.showInDesktop === false) return false;
    if (item.authRequirement === 'auth-only' && !isAuthenticated) return false;
    if (item.authRequirement === 'guest-only' && isAuthenticated) return false;
    return true;
  });
}

/**
 * Filter items for Mobile Bottom Bar based on authentication state
 */
export function getMobileBottomNavItems(isAuthenticated: boolean): NavItemConfig[] {
  return SIDEBAR_NAV_ITEMS.filter((item) => {
    if (item.showInMobileBottom !== true) return false;
    if (item.authRequirement === 'auth-only' && !isAuthenticated) return false;
    if (item.authRequirement === 'guest-only' && isAuthenticated) return false;
    return true;
  });
}

/**
 * Filter items for Mobile Left Drawer based on authentication state
 */
export function getMobileDrawerNavItems(isAuthenticated: boolean): NavItemConfig[] {
  return SIDEBAR_NAV_ITEMS.filter((item) => {
    if (item.showInMobileDrawer === false) return false;
    if (item.authRequirement === 'auth-only' && !isAuthenticated) return false;
    if (item.authRequirement === 'guest-only' && isAuthenticated) return false;
    return true;
  });
}
