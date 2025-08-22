import type { CursorRequest, UserSummary } from './common';

// 팔로우 생성 요청
export interface FollowCreateRequest {
  followeeId: string;
  followerId: string;
}

// 팔로우 응답 DTO
export interface FollowDto {
  id: string;
  followee: UserSummary;
  follower: UserSummary;
}

// 팔로우 요약 정보
export interface FollowSummaryDto {
  followeeId: string;
  followerCount: number;
  followingCount: number;
  followedByMe: boolean;
  followedByMeId?: string;
  followingMe: boolean;
}

// 팔로잉/팔로워 목록 조회 파라미터
export interface FollowListRequest extends CursorRequest {
  nameLike?: string;
}
