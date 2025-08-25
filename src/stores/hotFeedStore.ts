import { create } from 'zustand';
import type { ErrorResponse } from '../types/common';
import type { FeedDto } from '../types/feeds';
import { getHotFeedsByDate } from '../api/hotFeeds';

interface Store {
  hotFeeds: FeedDto[];
  isLoading: boolean;
  error: ErrorResponse | null;
  fetchHotFeeds: (date: string) => Promise<void>;
  clear: () => void;
}

const useHotFeedStore = create<Store>((set, get) => ({
  hotFeeds: [],
  isLoading: false,
  error: null,
  fetchHotFeeds: async (date) => {
    if (get().isLoading) {
      return;
    }

    set({ isLoading: true, error: null });
    try {
      const hotFeeds = await getHotFeedsByDate(date);
      set({ hotFeeds });
    } catch (error) {
      console.error('useHotFeedStore.fetchHotFeeds', error);
      set({ error: error as ErrorResponse });
    } finally {
      set({ isLoading: false });
    }
  },
  clear: () => {
    set({ hotFeeds: [], isLoading: false, error: null });
  },
}));

export default useHotFeedStore;
