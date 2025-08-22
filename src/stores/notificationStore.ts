import { create } from 'zustand';
import type { CursorRequest, ErrorResponse } from '../types/common';
import type { NotificationDto } from '../types/notifications';
import { getNotifications, readNotification } from '../api/notifications';

interface Store {
  notifications: NotificationDto[];
  isLoading: boolean;
  error: ErrorResponse | null;
  params: CursorRequest;
  hasNext: boolean;
  totalCount: number;
  fetchNotifications: () => Promise<void>;
  addNotification: (notification: NotificationDto) => void;
  fetchMore: () => Promise<void>;
  readNotification: (notificationId: string) => Promise<void>;

  clear: () => void;
}

const initialParams: CursorRequest = {
  cursor: undefined,
  idAfter: undefined,
  limit: 20,
};

const useNotificationStore = create<Store>((set, get) => ({
  notifications: [],
  isLoading: false,
  hasNext: false,
  error: null,
  params: initialParams,
  totalCount: 0,
  fetchNotifications: async () => {
    if (get().isLoading) return;

    set({ isLoading: true, error: null });
    try {
      const currentParams = get().params;
      const { data, nextCursor, nextIdAfter, hasNext, totalCount } = await getNotifications(currentParams);
      set((state) => ({
        notifications: [...state.notifications, ...data],
        params: {
          ...currentParams,
          cursor: nextCursor ?? undefined,
          idAfter: nextIdAfter ?? undefined,
        },
        hasNext,
        totalCount,
      }));
    } catch (error) {
      console.error('useNotificationStore.fetchNotifications', error);
      set({ error: error as ErrorResponse });
    } finally {
      set({ isLoading: false });
    }
  },
  addNotification: (notification: NotificationDto) => {
    set((state) => ({
      notifications: [notification, ...state.notifications],
      totalCount: state.totalCount + 1,
    }));
  },
  fetchMore: async () => {
    if (get().hasNext) {
      await get().fetchNotifications();
    }
  },
  readNotification: async (notificationId) => {
    if (get().isLoading) return;

    set({ isLoading: true, error: null });
    try {
      await readNotification(notificationId);
      set((state) => ({
        notifications: state.notifications.filter((notification) => notification.id !== notificationId),
        totalCount: state.totalCount - 1,
      }));
    } catch (error) {
      console.error('useNotificationStore.readNotification', error);
      set({ error: error as ErrorResponse });
    } finally {
      set({ isLoading: false });
    }
  },
  clear: () => {
    set({ notifications: [], params: initialParams, error: null });
  },
}));

export default useNotificationStore;
