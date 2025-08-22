import { create } from 'zustand';
import type { ErrorResponse } from '../types/common';
import type { DirectMessageCursorRequest, DirectMessageDto } from '../types/directMessages';
import { getDirectMessages } from '../api/directMessages';

interface Store {
  directMessages: DirectMessageDto[];
  addedDirectMessages: DirectMessageDto[];
  isLoading: boolean;
  error: ErrorResponse | null;
  params: DirectMessageCursorRequest;
  hasNext: boolean;
  totalCount: number;
  fetchDirectMessages: (userId: string) => Promise<void>;
  fetchMore: () => Promise<void>;
  addDirectMessage: (message: DirectMessageDto) => Promise<void>;
  clear: () => void;
}

const initialParams: DirectMessageCursorRequest = {
  userId: '',
  cursor: undefined,
  idAfter: undefined,
  limit: 15,
};

const useDirectMessageStore = create<Store>((set, get) => ({
  directMessages: [],
  addedDirectMessages: [],
  isLoading: false,
  hasNext: false,
  error: null,
  params: initialParams,
  totalCount: 0,
  fetchDirectMessages: async (userId) => {
    if (get().isLoading) return;

    set({ isLoading: true, error: null });
    try {
      const userIdChanged = userId !== get().params.userId;
      const mergedParams = userIdChanged ? { ...initialParams, userId } : get().params;
      if (userIdChanged) set({ params: mergedParams });

      const { data, nextCursor, nextIdAfter, hasNext, totalCount } = await getDirectMessages(mergedParams);
      set((state) => ({
        directMessages: [...state.directMessages, ...data],
        params: {
          ...mergedParams,
          cursor: nextCursor ?? undefined,
          idAfter: nextIdAfter ?? undefined,
        },
        hasNext,
        totalCount,
      }));
    } catch (error) {
      console.error('useDirectMessageStore.fetchDirectMessages', error);
      set({ error: error as ErrorResponse });
    } finally {
      set({ isLoading: false });
    }
  },
  fetchMore: async () => {
    if (get().hasNext) {
      await get().fetchDirectMessages(get().params.userId);
    }
  },
  addDirectMessage: async (message: DirectMessageDto) => {
    set((state) => ({
      addedDirectMessages: [...state.addedDirectMessages, message],
    }));
  },
  clear: () => {
    set({ directMessages: [], addedDirectMessages: [], params: initialParams, error: null });
  },
}));

export default useDirectMessageStore;
