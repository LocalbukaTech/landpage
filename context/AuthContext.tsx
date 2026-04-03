"use client";

import React, { createContext, useContext, useState, useEffect, useCallback, useRef } from "react";
import { getUser, getUserAuthToken, logoutUser, setUser as persistUser, setUserAuthToken } from "@/lib/auth";
import type { User } from "@/lib/api/services/auth.service";

interface AuthContextValue {
  user: User | null;
  isAuthenticated: boolean;
  /** Open the auth modal. Optionally pass a callback to run after successful auth. */
  openAuthModal: (onSuccess?: () => void) => void;
  closeAuthModal: () => void;
  isAuthModalOpen: boolean;
  /** Update user state after sign-in/sign-up/verify */
  loginUser: (user: User, token: string) => void;
  /** Update user state (e.g. after profile edit) */
  updateUser: (user: User) => void;
  logout: () => void;
  /** Pending callback stored from openAuthModal */
  pendingAction: React.MutableRefObject<(() => void) | null>;
}

const AuthContext = createContext<AuthContextValue | undefined>(undefined);

export function AuthProvider({
  children,
  initialUser = null,
  initialToken = null,
}: {
  children: React.ReactNode;
  initialUser?: User | null;
  initialToken?: string | null;
}) {
  const [user, setUser] = useState<User | null>(initialUser);
  const [isAuthModalOpen, setIsAuthModalOpen] = useState(false);
  const pendingAction = useRef<(() => void) | null>(null);

  // Hydrate from cookies on mount if not provided by server
  useEffect(() => {
    if (!user) {
      const stored = getUser();
      if (stored) setUser(stored);
    }
  }, [user]);

  const isAuthenticated = !!user && (!!initialToken || !!getUserAuthToken());

  const openAuthModal = useCallback((onSuccess?: () => void) => {
    pendingAction.current = onSuccess || null;
    setIsAuthModalOpen(true);
  }, []);

  const closeAuthModal = useCallback(() => {
    setIsAuthModalOpen(false);
    pendingAction.current = null;
  }, []);

  const updateUser = useCallback((u: User) => {
    persistUser(u);
    setUser(u);
  }, []);

  const loginUser = useCallback((u: User, token: string) => {
    setUserAuthToken(token);
    persistUser(u);
    setUser(u);
    setIsAuthModalOpen(false);

    // Execute the pending action after a short delay so state settles
    const action = pendingAction.current;
    pendingAction.current = null;
    if (action) {
      setTimeout(action, 100);
    }
  }, []);

  const logout = useCallback(() => {
    logoutUser();
    setUser(null);
  }, []);

  return (
    <AuthContext.Provider
      value={{
        user,
        isAuthenticated,
        openAuthModal,
        closeAuthModal,
        isAuthModalOpen,
        loginUser,
        updateUser,
        logout,
        pendingAction,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error("useAuth must be used within <AuthProvider>");
  return ctx;
}
