import Cookies from 'js-cookie';
import type {Admin} from './api/services/auth.service';
import type {User} from './api/services/auth.service';

// ============================================
// Admin Auth Cookie Keys
// ============================================

const TOKEN_KEY = 'localbuka_admin_token';
const ADMIN_KEY = 'localbuka_admin_user';

// ============================================
// User Auth Cookie Keys
// ============================================

const USER_TOKEN_KEY = 'localbuka_user_token';
const USER_KEY = 'localbuka_user';

// ============================================
// Admin Token Management (existing)
// ============================================

export const setAuthToken = (token: string) => {
  // Set cookie with 3 days expiry (matching typical JWT expiry)
  Cookies.set(TOKEN_KEY, token, {
    expires: 3,
    secure: process.env.NODE_ENV === 'production',
    sameSite: 'strict',
  });
};

export const getAuthToken = (): string | undefined => {
  if (typeof window === 'undefined') return undefined;
  return Cookies.get(TOKEN_KEY);
};

export const removeAuthToken = () => {
  Cookies.remove(TOKEN_KEY);
};

// ============================================
// Admin User Management (existing)
// ============================================

export const setAdminUser = (admin: Admin) => {
  Cookies.set(ADMIN_KEY, JSON.stringify(admin), {
    expires: 3,
    secure: process.env.NODE_ENV === 'production',
    sameSite: 'strict',
  });
};

export const getAdminUser = (): Admin | null => {
  if (typeof window === 'undefined') return null;
  const adminStr = Cookies.get(ADMIN_KEY);
  if (!adminStr) return null;
  try {
    return JSON.parse(adminStr);
  } catch {
    return null;
  }
};

export const removeAdminUser = () => {
  Cookies.remove(ADMIN_KEY);
};

// ============================================
// Admin Combined Auth Functions (existing)
// ============================================

export const logout = () => {
  removeAuthToken();
  removeAdminUser();
};

export const isAuthenticated = (): boolean => {
  return !!getAuthToken();
};

// ============================================
// User Token Management
// ============================================

export const setUserAuthToken = (token: string) => {
  Cookies.set(USER_TOKEN_KEY, token, {
    expires: 3,
    secure: process.env.NODE_ENV === 'production',
    sameSite: 'strict',
  });
};

export const getUserAuthToken = (): string | undefined => {
  if (typeof window === 'undefined') return undefined;
  return Cookies.get(USER_TOKEN_KEY);
};

export const removeUserAuthToken = () => {
  Cookies.remove(USER_TOKEN_KEY);
};

// ============================================
// User Management
// ============================================

export const setUser = (user: User) => {
  Cookies.set(USER_KEY, JSON.stringify(user), {
    expires: 3,
    secure: process.env.NODE_ENV === 'production',
    sameSite: 'strict',
  });
};

export const getUser = (): User | null => {
  if (typeof window === 'undefined') return null;
  const userStr = Cookies.get(USER_KEY);
  if (!userStr) return null;
  try {
    return JSON.parse(userStr);
  } catch {
    return null;
  }
};

export const removeUser = () => {
  Cookies.remove(USER_KEY);
};

// ============================================
// User Combined Auth Functions
// ============================================

export const logoutUser = () => {
  removeUserAuthToken();
  removeUser();
};

export const isUserAuthenticated = (): boolean => {
  return !!getUserAuthToken();
};

