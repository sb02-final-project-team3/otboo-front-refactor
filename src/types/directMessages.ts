import type { CursorRequest, UserSummary } from './common';

// DM 목록 조회 파라미터
export interface DirectMessageCursorRequest extends CursorRequest {
  userId: string;
}

// DM 응답 DTO
export interface DirectMessageDto {
  id: string;
  createdAt: string;
  sender: UserSummary;
  receiver: UserSummary;
  content: string;
}

// DM 전송 요청
export interface DirectMessageCreateRequest {
  receiverId: string;
  senderId: string;
  content: string;
}
