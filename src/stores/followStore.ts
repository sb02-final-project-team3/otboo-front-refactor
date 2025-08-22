import { create } from 'zustand';
import { createFollow, cancelFollow, getFollowSummary, getFollowings, getFollowers } from '../api/follows';
import type { CursorRequest, ErrorResponse } from '../types/common';
import type { FollowCreateRequest, FollowDto, FollowSummaryDto } from '../types/follows';

interface Store {
  followSummary: FollowSummaryDto | null;
  followings: FollowDto[];
  followers: FollowDto[];
  isLoading: boolean;
  error: ErrorResponse | null;
  paramsForFetchFollowings: CursorRequest & { followerId: string };
  paramsForFetchFollowers: CursorRequest & { followeeId: string };
  hasNextForFetchFollowings: boolean;
  hasNextForFetchFollowers: boolean;
  totalCountForFetchFollowings: number;
  totalCountForFetchFollowers: number;

  fetchFollowings: (subParams: { followerId: string; nameLike?: string }) => Promise<void>;
  fetchMoreFollowings: () => Promise<void>;
  fetchFollowers: (subParams: { followeeId: string; nameLike?: string }) => Promise<void>;
  fetchMoreFollowers: () => Promise<void>;
  fetchFollowSummary: (userId: string) => Promise<void>;
  createFollow: (request: FollowCreateRequest) => Promise<void>;
  cancelFollow: (followId: string) => Promise<void>;

  clear: () => void;
  clearFollowings: () => void;
  clearFollowers: () => void;
}

const initialParamsForFetchFollowings: CursorRequest & { followerId: string } = {
  followerId: '',
  cursor: undefined,
  idAfter: undefined,
  limit: 20,
};

const initialParamsForFetchFollowers: CursorRequest & { followeeId: string } = {
  followeeId: '',
  cursor: undefined,
  idAfter: undefined,
  limit: 20,
};

const useFollowStore = create<Store>((set, get) => ({
  followSummary: null,
  followings: [],
  followers: [],
  isLoading: false,
  error: null,
  paramsForFetchFollowings: initialParamsForFetchFollowings,
  paramsForFetchFollowers: initialParamsForFetchFollowers,
  hasNextForFetchFollowings: false,
  hasNextForFetchFollowers: false,
  totalCountForFetchFollowings: 0,
  totalCountForFetchFollowers: 0,
  fetchFollowings: async (subParams) => {
    if (get().isLoading) return;

    set({ isLoading: true, error: null });
    try {
      const { followerId } = subParams;
      const followerIdChanged = followerId !== get().paramsForFetchFollowings.followerId;
      const mergedParams = followerIdChanged
        ? { ...initialParamsForFetchFollowings, ...subParams }
        : { ...get().paramsForFetchFollowings, ...subParams };

      const { data, nextCursor, nextIdAfter, hasNext, totalCount } = await getFollowings(mergedParams);
      set((state) => ({
        followings: [...state.followings, ...data],
        paramsForFetchFollowings: {
          ...mergedParams,
          cursor: nextCursor ?? undefined,
          idAfter: nextIdAfter ?? undefined,
        },
        hasNextForFetchFollowings: hasNext,
        totalCountForFetchFollowings: totalCount,
      }));
    } catch (error) {
      console.error('useFollowStore.fetchFollowings', error);
      set({ error: error as ErrorResponse });
    } finally {
      set({ isLoading: false });
    }
  },
  fetchMoreFollowings: async () => {
    if (get().hasNextForFetchFollowings) {
      await get().fetchFollowings(get().paramsForFetchFollowings);
    }
  },
  fetchFollowers: async (subParams) => {
    if (get().isLoading) return;

    set({ isLoading: true, error: null });
    try {
      const { followeeId } = subParams;
      const followeeIdChanged = followeeId !== get().paramsForFetchFollowers.followeeId;
      const mergedParams = followeeIdChanged
        ? { ...initialParamsForFetchFollowers, ...subParams }
        : { ...get().paramsForFetchFollowers, ...subParams };

      const { data, nextCursor, nextIdAfter, hasNext, totalCount } = await getFollowers(mergedParams);
      set((state) => ({
        followers: [...state.followers, ...data],
        paramsForFetchFollowers: {
          ...mergedParams,
          cursor: nextCursor ?? undefined,
          idAfter: nextIdAfter ?? undefined,
        },
        hasNextForFetchFollowers: hasNext,
        totalCountForFetchFollowers: totalCount,
      }));
    } catch (error) {
      console.error('useFollowStore.fetchFollowers', error);
      set({ error: error as ErrorResponse });
    } finally {
      set({ isLoading: false });
    }
  },
  fetchMoreFollowers: async () => {
    if (get().hasNextForFetchFollowers) {
      await get().fetchFollowers(get().paramsForFetchFollowers);
    }
  },
  fetchFollowSummary: async (userId) => {
    if (get().isLoading) return;

    set({ isLoading: true, error: null });
    try {
      const followSummary = await getFollowSummary(userId);
      set({ followSummary });
    } catch (error) {
      console.error('useFollowStore.fetchFollowSummary', error);
      set({ error: error as ErrorResponse });
    } finally {
      set({ isLoading: false });
    }
  },
  createFollow: async (request: FollowCreateRequest) => {
    if (get().isLoading) return;

    set({ isLoading: true, error: null });
    try {
      const follow = await createFollow(request);
      set((state) => ({ followings: [...state.followings, follow] }));
    } catch (error) {
      console.error('useFollowStore.createFollow', error);
      set({ error: error as ErrorResponse });
    } finally {
      set({ isLoading: false });
    }
  },
  cancelFollow: async (followId: string) => {
    if (get().isLoading) return;

    set({ isLoading: true, error: null });
    try {
      await cancelFollow(followId);
      set((state) => ({ followings: state.followings.filter((follow) => follow.id !== followId) }));
    } catch (error) {
      console.error('useFollowStore.cancelFollow', error);
      set({ error: error as ErrorResponse });
    } finally {
      set({ isLoading: false });
    }
  },
  clear: () => {
    set({
      followSummary: null,
      followings: [],
      followers: [],
      error: null,
      paramsForFetchFollowings: initialParamsForFetchFollowings,
      paramsForFetchFollowers: initialParamsForFetchFollowers,
    });
  },
  clearFollowings: () => {
    set({
      followings: [],
      paramsForFetchFollowings: initialParamsForFetchFollowings,
      hasNextForFetchFollowings: false,
    });
  },
  clearFollowers: () => {
    set({ followers: [], paramsForFetchFollowers: initialParamsForFetchFollowers, hasNextForFetchFollowers: false });
  },
}));

export default useFollowStore;
