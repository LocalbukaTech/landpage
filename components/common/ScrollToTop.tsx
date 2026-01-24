"use client";

import { usePathname } from "next/navigation";
import { useEffect } from "react";

/**
 * Global Scroll Manager
 *
 * Resets the window scroll position to top (0,0) whenever the route (pathname) changes.
 * This ensures users always start at the top of a new page when navigating.
 */
export function ScrollToTop() {
  const pathname = usePathname();

  useEffect(() => {
    window.scrollTo(0, 0);
  }, [pathname]);

  return null;
}
