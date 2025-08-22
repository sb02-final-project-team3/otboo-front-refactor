import type { WeatherAPILocation, OauthProvider, SortableCursorRequest, UserRole } from './common';

// 계정 목록 조회 파라미터
export interface UserListRequest extends SortableCursorRequest {
  emailLike?: string;
  roleEqual?: UserRole;
  locked?: boolean;
}

// 사용자 등록(회원가입) 요청
export interface UserCreateRequest {
  name: string;
  email: string;
  password: string;
}

// 사용자 응답 DTO
export interface UserDto {
  id: string;
  createdAt: string;
  email: string;
  name: string;
  role: UserRole;
  linkedOAuthProviders: OauthProvider[];
  locked: boolean;
}

// 권한 수정 요청
export interface UserRoleUpdateRequest {
  role: UserRole;
}

// 비밀번호 변경 요청
export interface ChangePasswordRequest {
  password: string;
}

// 사용자 잠금 업데이트 요청
export interface UserLockUpdateRequest {
  locked: boolean;
}

// 프로필 응답 DTO
export interface ProfileDto {
  userId: string;
  name: string;
  gender: Gender | null;
  birthDate: string | null;
  location: WeatherAPILocation | null;
  temperatureSensitivity: number | null;
  profileImageUrl?: string;
}

// 프로필 업데이트 요청
export interface ProfileUpdateRequest {
  name?: string;
  gender?: Gender;
  birthDate?: string;
  location?: WeatherAPILocation;
  temperatureSensitivity?: number;
}

export type Gender = 'MALE' | 'FEMALE' | 'OTHER';

export const GenderLabel: Record<Gender, string> = {
  MALE: '남성',
  FEMALE: '여성',
  OTHER: '기타',
};
