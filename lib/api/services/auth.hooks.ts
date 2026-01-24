import {useMutation} from '@tanstack/react-query';
import {
  authService,
  userAuthService,
  type LoginPayload,
  type LoginResponse,
  type SigninPayload,
  type SigninResponse,
  type SignupPayload,
  type SignupResponse,
  type VerifyPayload,
  type VerifyResponse,
  type ResendCodePayload,
  type ResendCodeResponse,
} from './auth.service';
import {
  setAuthToken,
  setAdminUser,
  setUserAuthToken,
  setUser,
} from '@/lib/auth';
import type {ApiResponse} from '../types';

// ============================================
// Admin Auth Hook (existing)
// ============================================

export const useLoginMutation = () => {
  return useMutation({
    mutationFn: (data: LoginPayload) => authService.login(data),
    onSuccess: (response: ApiResponse<LoginResponse>) => {
      const {token, admin} = response.data;
      setAuthToken(token.access_token);
      setAdminUser(admin);
    },
  });
};

// ============================================
// User Auth Hooks
// ============================================

export const useSigninMutation = () => {
  return useMutation({
    mutationFn: (data: SigninPayload) => userAuthService.signin(data),
    onSuccess: (response: ApiResponse<SigninResponse>) => {
      const {token, user} = response.data;
      setUserAuthToken(token.access_token);
      setUser(user);
    },
  });
};

export const useSignupMutation = () => {
  return useMutation({
    mutationFn: (data: SignupPayload) => userAuthService.signup(data),
  });
};

export const useVerifyMutation = () => {
  return useMutation({
    mutationFn: (data: VerifyPayload) => userAuthService.verify(data),
    onSuccess: (response: ApiResponse<VerifyResponse>) => {
      const {token, user} = response.data;
      setUserAuthToken(token.access_token);
      setUser(user);
    },
  });
};

export const useResendCodeMutation = () => {
  return useMutation({
    mutationFn: (data: ResendCodePayload) => userAuthService.resendCode(data),
  });
};
