import apiClient from './axiosClient';
import type {
  UserListRequest,
  UserDto,
  UserCreateRequest,
  UserRoleUpdateRequest,
  ProfileDto,
  ProfileUpdateRequest,
  ChangePasswordRequest,
  UserLockUpdateRequest,
} from '../types/users';
import type { CursorResponse } from '../types/common';

// 계정 목록 조회
export const getUsers = async (params: UserListRequest) => {
  const response = await apiClient.get<CursorResponse<UserDto>>('/api/users', { params });
  return response.data;
};

// 사용자 등록(회원가입)
export const createUser = async (data: UserCreateRequest): Promise<UserDto> => {
  const response = await apiClient.post<UserDto>('/api/users', data);
  return response.data;
};

// 권한 수정
export const updateUserRole = async (userId: string, data: UserRoleUpdateRequest): Promise<UserDto> => {
  const response = await apiClient.patch<UserDto>(`/api/users/${userId}/role`, data);
  return response.data;
};

// 비밀번호 변경
export const changePassword = async (userId: string, data: ChangePasswordRequest): Promise<void> => {
  await apiClient.patch(`/api/users/${userId}/password`, data);
};

// 사용자 잠금 업데이트
export const updateUserLock = async (userId: string, data: UserLockUpdateRequest): Promise<void> => {
  await apiClient.patch(`/api/users/${userId}/lock`, data);
};

// 프로필 조회
export const getUserProfile = async (userId: string): Promise<ProfileDto> => {
  const response = await apiClient.get<ProfileDto>(`/api/users/${userId}/profiles`);
  return response.data;
};

// 프로필 업데이트
export const updateUserProfile = async (
  userId: string,
  data: ProfileUpdateRequest,
  imageFile?: File,
): Promise<ProfileDto> => {
  const formData = new FormData();
  formData.append('request', new Blob([JSON.stringify(data)], { type: 'application/json' }));
  if (imageFile) {
    formData.append('image', imageFile);
  }
  const response = await apiClient.patch<ProfileDto>(`/api/users/${userId}/profiles`, formData, {
    headers: { 'Content-Type': 'multipart/form-data' },
  });
  return response.data;
};
