import { Box, Dialog, DialogContent, Paper } from '@mui/material';
import { useCallback, useEffect, useState } from 'react';
import FeedDetail from '../components/feeds/FeedDetail';
import FeedList from '../components/feeds/FeedList';
import useCommentStore from '../stores/commentStore';
import useFeedStore from '../stores/feedStore';
import type { FeedDto, FeedUpdateRequest } from '../types/feeds';
import type { PrecipitationType, SkyStatus } from '../types/common';
import useAuthStore from '../stores/authStore';

export default function FeedPage() {
  const { authentication } = useAuthStore();
  const {
    feeds,
    fetchFeeds,
    likeFeed,
    unlikeFeed,
    clear,
    fetchMore: fetchMoreFeeds,
    params: feedParams,
    deleteFeed,
    updateFeed,
  } = useFeedStore();
  const {
    comments,
    createComment,
    fetchComments,
    fetchMore: fetchMoreComments,
    clear: clearComments,
  } = useCommentStore();
  const [selectedFeed, setSelectedFeed] = useState<FeedDto | null>(null);

  useEffect(() => {
    clear();
    fetchFeeds();
    return () => {
      clear();
    };
  }, [clear, fetchFeeds]);

  const handleClickLike = useCallback(
    async (feedId: string, isLiked: boolean) => {
      if (isLiked) {
        await likeFeed(feedId);
      } else {
        await unlikeFeed(feedId);
      }
      if (selectedFeed) {
        setSelectedFeed((state) => {
          if (state?.id === feedId) {
            return { ...state, likedByMe: isLiked, likeCount: isLiked ? state.likeCount + 1 : state.likeCount - 1 };
          }
          return state;
        });
      }
    },
    [likeFeed, unlikeFeed, selectedFeed],
  );

  const handleChangeFilter = useCallback(
    (filter: {
      keywordLike?: string;
      skyStatusEqual?: SkyStatus;
      precipitationTypeEqual?: PrecipitationType;
      sortBy?: 'createdAt' | 'likeCount';
    }) => {
      const debounceTimer = setTimeout(() => {
        clear();
        const { keywordLike, skyStatusEqual, precipitationTypeEqual, sortBy } = feedParams;
        fetchFeeds({ keywordLike, skyStatusEqual, precipitationTypeEqual, sortBy, ...filter });
      }, 300);

      return () => clearTimeout(debounceTimer);
    },
    [fetchFeeds, feedParams],
  );

  const handleAddComment = useCallback(
    async (comment: string) => {
      console.log('handleAddComment', comment);
      if (!selectedFeed || !authentication) return;
      await createComment(selectedFeed.id, {
        feedId: selectedFeed.id,
        authorId: authentication.userId,
        content: comment,
      });
    },
    [createComment, selectedFeed, authentication],
  );

  useEffect(() => {
    if (selectedFeed) {
      fetchComments(selectedFeed.id);
    } else {
      clearComments();
    }
  }, [selectedFeed?.id, fetchComments, clearComments]);

  const handleDeleteFeed = useCallback(
    async (feedId: string) => {
      await deleteFeed(feedId);
      setSelectedFeed(null);
    },
    [deleteFeed],
  );

  const handleUpdateFeed = useCallback(
    async (feedId: string, updateRequest: FeedUpdateRequest) => {
      const updatedFeed = await updateFeed(feedId, updateRequest);
      if (updatedFeed) {
        setSelectedFeed((state) => (state?.id === feedId ? updatedFeed : state));
      }
    },
    [updateFeed],
  );

  return (
    <Box
      sx={{
        width: '100%',
        height: '100%',
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
      }}
    >
      <Paper elevation={1} sx={{ p: 4, width: '100%', height: '100%' }}>
        <FeedList
          feeds={feeds}
          onClickFeed={setSelectedFeed}
          onClickLike={handleClickLike}
          onChangeFilter={handleChangeFilter}
          fetchMore={fetchMoreFeeds}
        />
      </Paper>
      <Dialog
        key={selectedFeed?.id}
        open={selectedFeed !== null}
        onClose={() => setSelectedFeed(null)}
        sx={{
          '& .MuiDialog-paper': {
            width: '70%',
            height: '80%',
            maxWidth: '80%',
            overflow: 'auto',
          },
        }}
      >
        <DialogContent sx={{ height: '100%' }}>
          {selectedFeed && (
            <FeedDetail
              feed={selectedFeed}
              comments={comments}
              onAddComment={handleAddComment}
              fetchMore={fetchMoreComments}
              onClickLike={handleClickLike}
              onUpdate={handleUpdateFeed}
              onDelete={handleDeleteFeed}
            />
          )}
        </DialogContent>
      </Dialog>
    </Box>
  );
}
