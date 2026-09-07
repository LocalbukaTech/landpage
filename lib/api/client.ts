import axios, {
  AxiosError,
  AxiosInstance,
  AxiosRequestConfig,
  AxiosResponse,
} from 'axios';
import Cookies from 'js-cookie';
import { isValidJwtToken } from '../jwt';

// Base URL for all API requests
export const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'https://servernew-production.up.railway.app';

// Token cookie key
const TOKEN_KEY = 'localbuka_admin_token';
const ADMIN_USER_KEY = 'localbuka_admin_user';

// Create axios instance with default config
const apiClient: AxiosInstance = axios.create({
  baseURL: API_BASE_URL,
  timeout: 300000, // 5 minutes
  headers: {
    'Content-Type': 'application/json',
  },
});

// Request interceptor - Add auth token, modify requests
apiClient.interceptors.request.use(
  (config) => {
    if (typeof window === 'undefined') {
      return config;
    }
    
    // Determine which token to use based on current page path (case-insensitive)
    const currentPath = window.location.pathname.toLowerCase();
    const isAdminSection = currentPath.startsWith('/secure-admin');
    
    const token = isAdminSection 
      ? Cookies.get(TOKEN_KEY)  // Admin token for admin sections
      : Cookies.get('localbuka_user_token');  // User token for user sections

    if (token && isValidJwtToken(token)) {
      config.headers.Authorization = `Bearer ${token}`;
    }

    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Response interceptor - Handle responses and errors globally
apiClient.interceptors.response.use(
  (response: AxiosResponse) => {
    return response;
  },
  (error: AxiosError) => {
    // Handle different error scenarios
    if (error.response) {
      // Server responded with error status
      const status = error.response.status;

      switch (status) {
        case 401:
        case 403:
          // Unauthorized / Forbidden - evict credentials and redirect if in protected admin section
          if (typeof window !== 'undefined') {
            const currentPath = window.location.pathname.toLowerCase();
            const isAdminSection = currentPath.startsWith('/secure-admin');
            const isLoginPage = currentPath === '/secure-admin/login';

            if (isAdminSection) {
              Cookies.remove(TOKEN_KEY);
              Cookies.remove(ADMIN_USER_KEY);
              if (!isLoginPage) {
                window.location.href = '/secure-admin/login';
              }
            } else {
              Cookies.remove('localbuka_user_token');
              Cookies.remove('localbuka_user');
            }
          }
          break;
        case 404:
          // Not found
          console.error('Resource not found');
          break;
        case 500:
          // Server error
          console.error('Internal server error');
          break;
        default:
          console.error(`Error: ${status}`);
      }
    } else if (error.request) {
      // Request made but no response received
      console.error('Network error - no response received');
    } else {
      // Something else happened
      console.error('Error setting up request:', error.message);
    }

    return Promise.reject(error);
  }
);

// Generic request function
export const request = async <T = any>(
  config: AxiosRequestConfig
): Promise<T> => {
  const response = await apiClient.request<T>(config);
  return response.data;
};

// HTTP method helpers
export const api = {
  get: <T = any>(url: string, config?: AxiosRequestConfig): Promise<T> => {
    return request<T>({...config, method: 'GET', url});
  },

  post: <T = any>(
    url: string,
    data?: any,
    config?: AxiosRequestConfig
  ): Promise<T> => {
    return request<T>({...config, method: 'POST', url, data});
  },

  put: <T = any>(
    url: string,
    data?: any,
    config?: AxiosRequestConfig
  ): Promise<T> => {
    return request<T>({...config, method: 'PUT', url, data});
  },

  patch: <T = any>(
    url: string,
    data?: any,
    config?: AxiosRequestConfig
  ): Promise<T> => {
    return request<T>({...config, method: 'PATCH', url, data});
  },

  delete: <T = any>(url: string, config?: AxiosRequestConfig): Promise<T> => {
    return request<T>({...config, method: 'DELETE', url});
  },
};

export default apiClient;
