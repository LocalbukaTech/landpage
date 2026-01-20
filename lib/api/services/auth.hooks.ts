import {useMutation} from '@tanstack/react-query';
import {
  authService,
  type LoginPayload,
  type LoginResponse,
} from './auth.service';
import {setAuthToken, setAdminUser} from '@/lib/auth';
import type {ApiResponse} from '../types';

export const useLoginMutation = () => {
  return useMutation({
    mutationFn: (data: LoginPayload) => authService.login(data),
    onSuccess: (response: ApiResponse<LoginResponse>) => {
      const {token, admin} = response.data;
      setAuthToken(token);
      setAdminUser(admin);
    },
  });
};
