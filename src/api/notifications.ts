import type { CursorRequest, CursorResponse } from '../types/common';
import type { NotificationDto } from '../types/notifications';
import apiClient from './axiosClient';

// 알림 목록 조회
export const getNotifications = async (params: CursorRequest) => {
  const response = await apiClient.get<CursorResponse<NotificationDto>>('/api/notifications', { params });
  return response.data;
};

// 알림 읽음 처리(삭제)
export const readNotification = async (notificationId: string): Promise<void> => {
  await apiClient.delete(`/api/notifications/${notificationId}`);
};
