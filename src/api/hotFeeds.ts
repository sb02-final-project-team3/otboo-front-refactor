import type { FeedDto } from '../types/feeds';
import apiClient from './axiosClient';

export const getHotFeedsByDate = async (date: string): Promise<FeedDto[]> => {
  const response = await apiClient.get<FeedDto[]>(`/api/hot-feeds/feeds/date/${date}`);
  return response.data;
};
