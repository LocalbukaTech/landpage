import {api} from '../client';
import type {ApiResponse} from '../types';

// ============================================
// Admin Auth Types (existing)
// ============================================

export interface Admin {
  id: string;
  first_name: string;
  last_name: string;
  email: string;
  created_at: string;
  updated_at: string;
}

export interface LoginResponse {
  token: {
    access_token: string;
    refresh_token?: string;
    token_type?: string;
  };
  admin: Admin;
}

export interface LoginPayload {
  email: string;
  password: string;
}

// ============================================
// User Auth Types
// ============================================

export interface User {
  id: string;
  email: string;
  fullName: string;
  referrerName?: string;
  isVerified: boolean;
  created_at: string;
  updated_at: string;
  // Optional fields that might come from API or for compatibility
  image_url?: string;
  first_name?: string;
  last_name?: string;
}

// Signin
export interface SigninPayload {
  email: string;
  password: string;
}

export interface SigninResponse {
  token: {
    access_token: string;
    refresh_token?: string;
    token_type?: string;
  };
  user: User;
}

// Signup
export interface SignupPayload {
  email: string;
  fullName: string;
  referrerName?: string;
  password: string;
}

export interface SignupResponse {
  message: string;
  user: User;
}

// Verify
export interface VerifyPayload {
  email: string;
  code: string;
}

export interface VerifyResponse {
  token: {
    access_token: string;
    refresh_token?: string;
    token_type?: string;
  };
  user: User;
  message: string;
}

// Resend Code
export interface ResendCodePayload {
  email: string;
}

export interface ResendCodeResponse {
  message: string;
}

// ============================================
// Admin Auth Service (existing)
// ============================================

export const authService = {
  login: (data: LoginPayload) =>
    api.post<ApiResponse<LoginResponse>>('/auth/login', data),
};

// ============================================
// User Auth Service
// ============================================

export const userAuthService = {
  signin: (data: SigninPayload) =>
    api.post<ApiResponse<SigninResponse>>('/auth/signin', data),

  signup: (data: SignupPayload) =>
    api.post<ApiResponse<SignupResponse>>('/auth/signup', data),

  verify: (data: VerifyPayload) =>
    api.post<ApiResponse<VerifyResponse>>('/auth/verify', data),

  resendCode: (data: ResendCodePayload) =>
    api.post<ApiResponse<ResendCodeResponse>>('/auth/signup/otp', data),
};
