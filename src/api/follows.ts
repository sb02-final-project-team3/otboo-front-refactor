import apiClient from './axiosClient';
import type { FollowCreateRequest, FollowDto, FollowSummaryDto } from '../types/follows';
import type { CursorRequest, CursorResponse } from '../types/common';

// 팔로우 생성
export const createFollow = async (data: FollowCreateRequest): Promise<FollowDto> => {
  const response = await apiClient.post<FollowDto>('/api/follows', data);
  return response.data;
};

// 팔로우 취소
export const cancelFollow = async (followId: string): Promise<void> => {
  await apiClient.delete(`/api/follows/${followId}`);
};

// 팔로우 요약 정보 조회
export const getFollowSummary = async (userId: string): Promise<FollowSummaryDto> => {
  const response = await apiClient.get<FollowSummaryDto>('/api/follows/summary', { params: { userId } });
  return response.data;
};

// 팔로잉 목록 조회
export const getFollowings = async (params: CursorRequest & { followerId: string; nameLike?: string }) => {
  const response = await apiClient.get<CursorResponse<FollowDto>>('/api/follows/followings', {
    params,
  });
  return response.data;
};

// 팔로워 목록 조회
export const getFollowers = async (params: CursorRequest & { followeeId: string; nameLike?: string }) => {
  const response = await apiClient.get<CursorResponse<FollowDto>>('/api/follows/followers', {
    params,
  });
  return response.data;
};
