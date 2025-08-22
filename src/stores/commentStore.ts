import { create } from 'zustand';
import type { CursorRequest, ErrorResponse } from '../types/common';
import type { CommentCreateRequest, CommentDto } from '../types/feeds';
import { createFeedComment, getFeedComments } from '../api/feeds';

interface Store {
  comments: CommentDto[];
  isLoading: boolean;
  error: ErrorResponse | null;
  params: { feedId: string } & CursorRequest;
  hasNext: boolean;
  fetchComments: (feedId: string) => Promise<void>;
  fetchMore: () => Promise<void>;
  createComment: (feedId: string, request: CommentCreateRequest) => Promise<void>;
  clear: () => void;
}

const initialParams: { feedId: string } & CursorRequest = {
  feedId: '',
  cursor: undefined,
  idAfter: undefined,
  limit: 20,
};

const useCommentStore = create<Store>((set, get) => ({
  comments: [],
  isLoading: false,
  hasNext: false,
  error: null,
  params: initialParams,
  totalCount: 0,
  fetchComments: async (feedId) => {
    if (get().isLoading) return;

    set({ isLoading: true, error: null });
    try {
      const feedIdChanged = feedId !== get().params.feedId;
      const mergedParams = feedIdChanged ? { ...initialParams, feedId } : get().params;
      if (feedIdChanged) set({ params: mergedParams, comments: [] });

      const { data, nextCursor, nextIdAfter, hasNext, totalCount } = await getFeedComments(feedId, mergedParams);
      set((state) => ({
        comments: [...state.comments, ...data],
        params: {
          ...mergedParams,
          cursor: nextCursor ?? undefined,
          idAfter: nextIdAfter ?? undefined,
        },
        hasNext,
        totalCount,
      }));
    } catch (error) {
      console.error('useCommentStore.fetchComments', error);
      set({ error: error as ErrorResponse });
    } finally {
      set({ isLoading: false });
    }
  },
  fetchMore: async () => {
    if (get().hasNext) {
      await get().fetchComments(get().params.feedId);
    }
  },
  createComment: async (feedId: string, request: CommentCreateRequest) => {
    if (get().isLoading) return;

    set({ isLoading: true, error: null });
    try {
      const comment = await createFeedComment(feedId, request);
      set((state) => ({ comments: [...state.comments, comment] }));
    } catch (error) {
      console.error('useCommentStore.createComment', error);
      set({ error: error as ErrorResponse });
    } finally {
      set({ isLoading: false });
    }
  },
  clear: () => {
    set({ comments: [], params: initialParams, error: null });
  },
}));

export default useCommentStore;
