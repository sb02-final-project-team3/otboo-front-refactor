import type {
  OotdDto,
  PrecipitationDto,
  SortableCursorRequest,
  TemperatureDto,
  SkyStatus,
  PrecipitationType,
} from './common';

// 피드 목록 조회 파라미터
export interface FeedCursorRequest extends SortableCursorRequest {
  keywordLike?: string;
  skyStatusEqual?: SkyStatus;
  precipitationTypeEqual?: PrecipitationType;
  authorIdEqual?: string;
}

// 피드 등록 요청
export interface FeedCreateRequest {
  authorId: string;
  weatherId: string;
  clothesIds: string[];
  content: string;
}

// 피드 수정 요청
export interface FeedUpdateRequest {
  content: string;
}

// 피드 응답 DTO
export interface FeedDto {
  id: string;
  createdAt: string;
  updatedAt: string;
  author: AuthorDto;
  weather: WeatherSummaryDto;
  ootds: OotdDto[];
  content: string;
  likeCount: number;
  commentCount: number;
  likedByMe: boolean;
}

export interface AuthorDto {
  userId: string;
  name: string;
  profileImageUrl?: string;
}

export interface WeatherSummaryDto {
  weatherId: string;
  skyStatus: SkyStatus;
  precipitation: PrecipitationDto;
  temperature: TemperatureDto;
}

export interface ClothesAttributeWithDefDto {
  definitionId: string;
  definitionName: string;
  selectableValues: string[];
  value: string;
}

// 피드 댓글 등록 요청
export interface CommentCreateRequest {
  feedId: string;
  authorId: string;
  content: string;
}

// 피드 댓글 응답 DTO
export interface CommentDto {
  id: string;
  createdAt: string;
  feedId: string;
  author: AuthorDto;
  content: string;
}
