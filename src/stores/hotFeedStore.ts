import { create } from 'zustand';
import type { ErrorResponse } from '../types/common';
import type { FeedDto } from '../types/feeds';
import { getHotFeedsByDate } from '../api/hotFeeds';
import { increaseFeedView } from '../api/feeds';

interface Store {
  hotFeeds: FeedDto[];
  isLoading: boolean;
  error: ErrorResponse | null;
  fetchHotFeeds: (date: Date) => Promise<void>;
  increaseViewCount: (feedId: string) => Promise<void>;
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
  increaseViewCount: async (feedId: string) => {
    try {
      // API 호출은 백그라운드에서 진행
      increaseFeedView(feedId).catch((error) => {
        console.error('Failed to increase view count:', error);
      });
      // UI는 즉시 업데이트하여 사용자 경험 개선
      set((state) => ({
        hotFeeds: state.hotFeeds.map((feed) =>
          feed.id === feedId ? { ...feed, viewCount: (feed.viewCount || 0) + 1 } : feed,
        ),
      }));
    } catch (error) {
      console.error('useHotFeedStore.increaseViewCount', error);
    }
  },
  clear: () => {
    set({ hotFeeds: [], isLoading: false, error: null });
  },
}));

export default useHotFeedStore;
