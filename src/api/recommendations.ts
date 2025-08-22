import apiClient from './axiosClient';
import type { RecommendationDto } from '../types/recommendations';

// 추천 조회
export const getRecommendation = async (params: { weatherId: string }): Promise<RecommendationDto> => {
  const response = await apiClient.get<RecommendationDto>('/api/recommendations', { params });
  return response.data;
};
