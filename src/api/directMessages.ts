import apiClient from './axiosClient';
import type { DirectMessageCursorRequest, DirectMessageDto } from '../types/directMessages';
import type { CursorResponse } from '../types/common';

// DM 목록 조회
export const getDirectMessages = async (params: DirectMessageCursorRequest) => {
  const response = await apiClient.get<CursorResponse<DirectMessageDto>>('/api/direct-messages', { params });
  return response.data;
};
