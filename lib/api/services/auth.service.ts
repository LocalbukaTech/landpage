import {api} from '../client';
import type {ApiResponse} from '../types';

export interface Admin {
  id: string;
  first_name: string;
  last_name: string;
  email: string;
  created_at: string;
  updated_at: string;
}

export interface LoginResponse {
  token: string;
  admin: Admin;
}

export interface LoginPayload {
  email: string;
  password: string;
}

export const authService = {
  login: (data: LoginPayload) =>
    api.post<ApiResponse<LoginResponse>>('/auth/login', data),
};
