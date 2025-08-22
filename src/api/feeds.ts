import apiClient from './axiosClient';
import type {
  FeedCursorRequest,
  FeedDto,
  FeedCreateRequest,
  FeedUpdateRequest,
  CommentCreateRequest,
  CommentDto,
} from '../types/feeds';
import type { CursorResponse, CursorRequest } from '../types/common';

// 피드 목록 조회
export const getFeeds = async (params: FeedCursorRequest) => {
  const response = await apiClient.get<CursorResponse<FeedDto>>('/api/feeds', { params });
  return response.data;
};

// 피드 등록
export const createFeed = async (data: FeedCreateRequest): Promise<FeedDto> => {
  const response = await apiClient.post<FeedDto>('/api/feeds', data);
  return response.data;
};

// 피드 수정
export const updateFeed = async (feedId: string, data: FeedUpdateRequest): Promise<FeedDto> => {
  const response = await apiClient.patch<FeedDto>(`/api/feeds/${feedId}`, data);
  return response.data;
};

// 피드 삭제
export const deleteFeed = async (feedId: string): Promise<void> => {
  await apiClient.delete(`/api/feeds/${feedId}`);
};

// 피드 좋아요
export const likeFeed = async (feedId: string): Promise<void> => {
  await apiClient.post(`/api/feeds/${feedId}/like`);
};

// 피드 좋아요 취소
export const unlikeFeed = async (feedId: string): Promise<void> => {
  await apiClient.delete(`/api/feeds/${feedId}/like`);
};

// 피드 댓글 목록 조회
export const getFeedComments = async (feedId: string, params: CursorRequest): Promise<CursorResponse<CommentDto>> => {
  const response = await apiClient.get<CursorResponse<CommentDto>>(`/api/feeds/${feedId}/comments`, { params });
  return response.data;
};

// 피드 댓글 등록
export const createFeedComment = async (feedId: string, data: CommentCreateRequest): Promise<CommentDto> => {
  const response = await apiClient.post<CommentDto>(`/api/feeds/${feedId}/comments`, data);
  return response.data;
};
