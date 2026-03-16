"use client";

import { useCallback } from "react";
import { useAuth } from "@/context/AuthContext";

/**
 * Hook that gates protected actions behind authentication.
 *
 * Usage:
 * ```tsx
 * const { requireAuth } = useRequireAuth();
 * const handleSave = () => requireAuth(() => saveToWishlist(id));
 * ```
 */
export function useRequireAuth() {
  const { isAuthenticated, openAuthModal } = useAuth();

  const requireAuth = useCallback(
    (callback: () => void) => {
      if (isAuthenticated) {
        callback();
      } else {
        openAuthModal(callback);
      }
    },
    [isAuthenticated, openAuthModal]
  );

  return { requireAuth, isAuthenticated };
}
