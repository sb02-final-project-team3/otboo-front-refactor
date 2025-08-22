import type { ClothesType } from './clothes';

// API 공통 에러 응답 타입
export interface ErrorResponse {
  exceptionName: string;
  message: string;
  details?: Record<string, string>;
  requestId?: string;
}

export interface CursorResponse<T> {
  data: T[];
  nextCursor: string | null;
  nextIdAfter: string | null;
  hasNext: boolean;
  totalCount: number;
  sortBy: string;
  sortDirection: 'ASCENDING' | 'DESCENDING';
}

export interface CursorRequest {
  cursor?: string;
  idAfter?: string;
  limit: number;
}

export interface SortableCursorRequest extends CursorRequest {
  sortBy: string;
  sortDirection: 'ASCENDING' | 'DESCENDING';
}

export type OauthProvider = 'google' | 'kakao';

// 유저 요약 정보
export interface UserSummary {
  userId: string;
  name: string;
  profileImageUrl?: string;
}

export interface PrecipitationDto {
  type: PrecipitationType;
  amount: number;
  probability: number;
}

export type PrecipitationType = 'NONE' | 'RAIN' | 'RAIN_SNOW' | 'SNOW' | 'SHOWER';

export const PrecipitationTypeLabel: Record<PrecipitationType, string> = {
  NONE: '없음',
  RAIN: '비',
  RAIN_SNOW: '비/눈',
  SNOW: '눈',
  SHOWER: '소나기',
};

export interface TemperatureDto {
  current: number;
  comparedToDayBefore: number;
  min: number;
  max: number;
}

export interface OotdDto {
  clothesId: string;
  name: string;
  imageUrl?: string;
  type: ClothesType;
  attributes: ClothesAttributeWithDefDto[];
}

// 의상 속성 + 정의 정보
export interface ClothesAttributeWithDefDto {
  definitionId: string;
  definitionName: string;
  selectableValues: string[];
  value: string;
}

// 위치 정보
export interface WeatherAPILocation {
  latitude: number;
  longitude: number;
  x: number;
  y: number;
  locationNames: string[];
}

export type UserRole = 'USER' | 'ADMIN';

export const UserRoleLabel: Record<UserRole, string> = {
  USER: '사용자',
  ADMIN: '관리자',
};

export type SkyStatus = 'CLEAR' | 'MOSTLY_CLOUDY' | 'CLOUDY';

export const SkyStatusLabel: Record<SkyStatus, string> = {
  CLEAR: '맑음',
  MOSTLY_CLOUDY: '구름 많음',
  CLOUDY: '흐림',
};
