import apiClient from './axiosClient';
import type { WeatherDto } from '../types/weathers';
import type { WeatherAPILocation } from '../types/common';

// 날씨 정보 조회
export const getWeathers = async (params: { longitude: number; latitude: number }): Promise<WeatherDto[]> => {
  const response = await apiClient.get<WeatherDto[]>('/api/weathers', { params });
  return response.data;
};

// 날씨 위치 정보 조회
export const getWeatherLocation = async (params: {
  longitude: number;
  latitude: number;
}): Promise<WeatherAPILocation> => {
  const response = await apiClient.get<WeatherAPILocation>('/api/weathers/location', { params });
  return response.data;
};
