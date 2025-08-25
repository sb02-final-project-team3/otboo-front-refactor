import { create } from 'zustand';
import type { ErrorResponse } from '../types/common';
import type { FeedDto } from '../types/feeds';
import { getHotFeedsByDate } from '../api/hotFeeds';

interface Store {
  hotFeeds: FeedDto[];
  isLoading: boolean;
  error: ErrorResponse | null;
  fetchHotFeeds: (date: Date) => Promise<void>;
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
      const year = date.getFullYear();
      const month = (date.getMonth() + 1).toString().padStart(2, '0');
      const day = date.getDate().toString().padStart(2, '0');
      const formattedDate = `${year}${month}${day}`;

      const hotFeeds = await getHotFeedsByDate(formattedDate);
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
