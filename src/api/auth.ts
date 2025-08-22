import type { ResetPasswordRequest, SignInRequest } from '../types/auth';
import apiClient from './axiosClient';

// 로그인
export const signIn = async (data: SignInRequest): Promise<string> => {
  const response = await apiClient.post<string>('/api/auth/sign-in', data);
  return response.data;
};

// 로그아웃
export const signOut = async (): Promise<void> => {
  await apiClient.post('/api/auth/sign-out');
};

// 내 정보(엑세스 토큰) 조회
export const getAccessToken = async (): Promise<string> => {
  const response = await apiClient.get<string>('/api/auth/me');
  return response.data;
};

// 토큰 재발급
export const refreshToken = async (): Promise<string> => {
  const response = await apiClient.post<string>('/api/auth/refresh');
  return response.data;
};

// 비밀번호 초기화
export const resetPassword = async (data: ResetPasswordRequest): Promise<void> => {
  await apiClient.post('/api/auth/reset-password', data);
};

export const getCsrfToken = async (): Promise<void> => {
  await apiClient.get('/api/auth/csrf-token');
};
