'use client';

import React, {
  createContext,
  useContext,
  useState,
  useEffect,
  useCallback,
  useRef,
} from 'react';
import {
  getUser,
  getUserAuthToken,
  logoutUser,
  setUser as persistUser,
  setUserAuthToken,
} from '@/lib/auth';
import type {User} from '@/lib/api/services/auth.service';
import {setAnalyticsUser} from '@/lib/analytics';

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
  const [token, setToken] = useState<string | null>(
    () => initialToken ?? getUserAuthToken() ?? null,
  );
  const [isAuthModalOpen, setIsAuthModalOpen] = useState(false);

  // Internal ref — not exposed on context
  const pendingAction = useRef<(() => void) | null>(null);
  // Tracks the pending-action timeout so we can cancel it on unmount
  const pendingTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  // Hydrate user + token from storage on mount (once) when not provided by server
  useEffect(() => {
    if (!user) {
      const stored = getUser();
      if (stored) setUser(stored);
    }
    if (!token) {
      const storedToken = getUserAuthToken();
      if (storedToken) setToken(storedToken);
    }
    // Intentionally runs only on mount — deps are stable initial values
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // Cancel any scheduled pending-action timer when the provider unmounts
  useEffect(() => {
    return () => {
      if (pendingTimerRef.current !== null) {
        clearTimeout(pendingTimerRef.current);
      }
    };
  }, []);

  // Pure state derivation — no storage reads on every render
  const isAuthenticated = !!user && !!token;

  const openAuthModal = useCallback((onSuccess?: () => void) => {
    pendingAction.current = onSuccess ?? null;
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

  const loginUser = useCallback((u: User, accessToken: string) => {
    setUserAuthToken(accessToken);
    persistUser(u);
    setUser(u);
    setToken(accessToken);
    setIsAuthModalOpen(false);

    // Run the pending callback after React has committed state changes.
    // The timer ref ensures we can cancel this if the provider unmounts first.
    const action = pendingAction.current;
    pendingAction.current = null;
    if (action) {
      pendingTimerRef.current = setTimeout(() => {
        pendingTimerRef.current = null;
        action();
      }, 100);
    }
  }, []);

  const logout = useCallback(() => {
    logoutUser();
    setUser(null);
    setToken(null);
    setAnalyticsUser(null);
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
      }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error('useAuth must be used within <AuthProvider>');
  return ctx;
}
