import type { WeatherAPILocation, PrecipitationDto, SkyStatus } from './common';

// 날씨 응답 DTO
export interface WeatherDto {
  id: string;
  createdAt: string;
  forecastedAt: string;
  forecastAt: string;
  location: WeatherAPILocation;
  skyStatus: SkyStatus;
  precipitation: PrecipitationDto;
  humidity: HumidityDto;
  temperature: TemperatureDto;
  windSpeed: WindSpeedDto;
}

export interface HumidityDto {
  current: number;
  comparedToDayBefore: number;
}

export interface TemperatureDto {
  current: number;
  comparedToDayBefore: number;
  min: number;
  max: number;
}

export interface WindSpeedDto {
  speed: number;
  asWord: WindSpeedInWord;
}

export type WindSpeedInWord = 'WEAK' | 'MODERATE' | 'STRONG';

export const WindSpeedInWordLabel: Record<WindSpeedInWord, string> = {
  WEAK: '약한 바람',
  MODERATE: '중간 바람',
  STRONG: '강한 바람',
};
