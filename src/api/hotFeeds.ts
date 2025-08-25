import type { FeedDto } from '../types/feeds';
import apiClient from './axiosClient';

// 특정 날짜의 인기 피드 목록 조회
export const getHotFeedsByDate = async (date: string): Promise<FeedDto[]> => {
  const response = await apiClient.get<FeedDto[]>(`/feeds/date/${date}`);
  return response.data;
};
