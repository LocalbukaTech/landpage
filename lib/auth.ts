import Cookies from 'js-cookie';
import type {Admin} from './api/services/auth.service';

const TOKEN_KEY = 'localbuka_admin_token';
const ADMIN_KEY = 'localbuka_admin_user';

// Token management
export const setAuthToken = (token: string) => {
  // Set cookie with 3 days expiry (matching typical JWT expiry)
  Cookies.set(TOKEN_KEY, token, {
    expires: 3,
    secure: process.env.NODE_ENV === 'production',
    sameSite: 'strict',
  });
};

export const getAuthToken = (): string | undefined => {
  return Cookies.get(TOKEN_KEY);
};

export const removeAuthToken = () => {
  Cookies.remove(TOKEN_KEY);
};

// Admin user management
export const setAdminUser = (admin: Admin) => {
  Cookies.set(ADMIN_KEY, JSON.stringify(admin), {
    expires: 3,
    secure: process.env.NODE_ENV === 'production',
    sameSite: 'strict',
  });
};

export const getAdminUser = (): Admin | null => {
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

// Combined logout
export const logout = () => {
  removeAuthToken();
  removeAdminUser();
};

// Check if authenticated
export const isAuthenticated = (): boolean => {
  return !!getAuthToken();
};
