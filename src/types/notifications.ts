// 알림 응답 DTO
export interface NotificationDto {
  id: string;
  createdAt: string;
  receiverId: string;
  title: string;
  content: string;
  level: NotificationLevel;
}

export type NotificationLevel = 'INFO' | 'WARNING' | 'ERROR';
