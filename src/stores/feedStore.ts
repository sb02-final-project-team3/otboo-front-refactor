import { create } from 'zustand';

import { createFeed, deleteFeed, getFeeds, likeFeed, unlikeFeed, updateFeed, increaseFeedView } from '../api/feeds';
import type { ErrorResponse, PrecipitationType, SkyStatus } from '../types/common';
import type { FeedCreateRequest, FeedCursorRequest, FeedDto, FeedUpdateRequest } from '../types/feeds';

interface Store {
  feeds: FeedDto[];
  isLoading: boolean;
  error: ErrorResponse | null;
  params: FeedCursorRequest;
  hasNext: boolean;
  totalCount: number;
  fetchFeeds: (subParams?: {
    keywordLike?: string;
    skyStatusEqual?: SkyStatus;
    precipitationTypeEqual?: PrecipitationType;
    authorIdEqual?: string;
  }) => Promise<void>;
  fetchMore: () => Promise<void>;
  createFeed: (request: FeedCreateRequest) => Promise<void>;
  updateFeed: (feedId: string, request: FeedUpdateRequest) => Promise<FeedDto | null>;
  deleteFeed: (feedId: string) => Promise<void>;
  likeFeed: (feedId: string) => Promise<void>;
  unlikeFeed: (feedId: string) => Promise<void>;
  increaseViewCount: (feedId: string) => Promise<void>;

  clear: () => void;
}

const initialParams: FeedCursorRequest = {
  keywordLike: undefined,
  skyStatusEqual: undefined,
  precipitationTypeEqual: undefined,
  cursor: undefined,
  idAfter: undefined,
  sortBy: 'createdAt',
  sortDirection: 'DESCENDING',
  limit: 20,
};

const useFeedStore = create<Store>((set, get) => ({
  feeds: [],
  isLoading: false,
  hasNext: false,
  error: null,
  params: initialParams,
  totalCount: 0,
  fetchFeeds: async (subParams) => {
    if (get().isLoading) return;

    set({ isLoading: true, error: null });
    try {
      const mergedParams = { ...get().params, ...subParams };
      if (subParams) set({ params: mergedParams });

      const { data, nextCursor, nextIdAfter, hasNext, totalCount } = await getFeeds(mergedParams);
      set((state) => ({
        feeds: [...state.feeds, ...data],
        params: {
          ...mergedParams,
          cursor: nextCursor ?? undefined,
          idAfter: nextIdAfter ?? undefined,
        },
        hasNext,
        totalCount,
      }));
    } catch (error) {
      console.error('useFeedStore.fetchFeeds', error);
      set({ error: error as ErrorResponse });
    } finally {
      set({ isLoading: false });
    }
  },
  fetchMore: async () => {
    if (get().hasNext) {
      await get().fetchFeeds();
    }
  },
  createFeed: async (request: FeedCreateRequest) => {
    if (get().isLoading) return;

    set({ isLoading: true, error: null });
    try {
      await createFeed(request);
    } catch (error) {
      console.error('useFeedStore.createFeed', error);
      set({ error: error as ErrorResponse });
    } finally {
      set({ isLoading: false });
    }
  },
  updateFeed: async (feedId: string, request: FeedUpdateRequest): Promise<FeedDto | null> => {
    if (get().isLoading) return null;

    set({ isLoading: true, error: null });
    try {
      const updatedFeed = await updateFeed(feedId, request);
      set((state) => ({ feeds: state.feeds.map((feed) => (feed.id === feedId ? updatedFeed : feed)) }));
      return updatedFeed;
    } catch (error) {
      console.error('useFeedStore.updateFeed', error);
      set({ error: error as ErrorResponse });
      return null;
    } finally {
      set({ isLoading: false });
    }
  },
  deleteFeed: async (feedId: string) => {
    if (get().isLoading) return;

    set({ isLoading: true, error: null });
    try {
      await deleteFeed(feedId);
      set((state) => ({ feeds: state.feeds.filter((feed) => feed.id !== feedId) }));
    } catch (error) {
      console.error('useFeedStore.deleteFeed', error);
      set({ error: error as ErrorResponse });
    } finally {
      set({ isLoading: false });
    }
  },
  likeFeed: async (feedId: string) => {
    if (get().isLoading) return;

    set({ isLoading: true, error: null });
    try {
      await likeFeed(feedId);
      set((state) => ({
        feeds: state.feeds.map((feed) =>
          feed.id === feedId ? { ...feed, likedByMe: true, likeCount: feed.likeCount + 1 } : feed,
        ),
      }));
    } catch (error) {
      console.error('useFeedStore.likeFeed', error);
      set({ error: error as ErrorResponse });
    } finally {
      set({ isLoading: false });
    }
  },
  unlikeFeed: async (feedId: string) => {
    if (get().isLoading) return;

    set({ isLoading: true, error: null });
    try {
      await unlikeFeed(feedId);
      set((state) => ({
        feeds: state.feeds.map((feed) =>
          feed.id === feedId ? { ...feed, likedByMe: false, likeCount: feed.likeCount - 1 } : feed,
        ),
      }));
    } catch (error) {
      console.error('useFeedStore.unlikeFeed', error);
      set({ error: error as ErrorResponse });
    } finally {
      set({ isLoading: false });
    }
  },
  increaseViewCount: async (feedId: string) => {
    try {
      // API 호출은 하되, 상태를 즉시 업데이트하여 사용자 경험을 개선합니다.
      // API 호출이 실패하더라도 UI에 큰 영향을 주지 않으므로 에러 처리는 콘솔 로그로 충분합니다.
      increaseFeedView(feedId).catch((error) => {
        console.error('Failed to increase view count:', error);
      });
      set((state) => ({
        feeds: state.feeds.map((feed) =>
          feed.id === feedId ? { ...feed, viewCount: (feed.viewCount || 0) + 1 } : feed,
        ),
      }));
    } catch (error) {
      console.error('useFeedStore.increaseViewCount', error);
    }
  },
  clear: () => {
    set({ feeds: [], params: initialParams, error: null });
  },
}));

export default useFeedStore;
