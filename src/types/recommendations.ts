import type { OotdDto } from './common';

// 추천 응답 DTO
export interface RecommendationDto {
  weatherId: string;
  userId: string;
  clothes: OotdDto[];
}
