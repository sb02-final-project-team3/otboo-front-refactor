import { Box, Paper, Typography, Dialog, DialogContent } from '@mui/material';
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';
import { DatePicker } from '@mui/x-date-pickers/DatePicker';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import dayjs, { type Dayjs } from 'dayjs';
import { useCallback, useEffect, useState } from 'react';
import useFeedStore from '../stores/feedStore';
import useHotFeedStore from '../stores/hotFeedStore';
import FeedList from '../components/feeds/FeedList';
import type { FeedDto } from '../types/feeds';
import FeedDetail from '../components/feeds/FeedDetail';
import useCommentStore from '../stores/commentStore';
import useAuthStore from '../stores/authStore';

export default function HotFeedPage() {
  const { hotFeeds, fetchHotFeeds, clear, isLoading } = useHotFeedStore();
  const { likeFeed, unlikeFeed } = useFeedStore();
  const [selectedDate, setSelectedDate] = useState<Dayjs | null>(dayjs());
  const [selectedFeed, setSelectedFeed] = useState<FeedDto | null>(null);

  const {
    comments,
    createComment,
    fetchComments,
    fetchMore: fetchMoreComments,
    clear: clearComments,
  } = useCommentStore();

  const { authentication } = useAuthStore();

  useEffect(() => {
    if (selectedDate) {
      fetchHotFeeds(selectedDate.toDate());
    }
    return () => {
      clear();
    };
  }, [fetchHotFeeds, clear, selectedDate]);

  const handleDateChange = useCallback((newValue: Dayjs | null) => {
    setSelectedDate(newValue);
  }, []);

  const handleClickLike = useCallback(
    async (feedId: string, isLiked: boolean) => {
      if (isLiked) {
        await likeFeed(feedId);
      } else {
        await unlikeFeed(feedId);
      }

      if (selectedDate) {
        fetchHotFeeds(selectedDate.toDate());
      }
    },
    [likeFeed, unlikeFeed, fetchHotFeeds, selectedDate],
  );

  const handleAddComment = useCallback(
    async (comment: string) => {
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
  }, [selectedFeed, fetchComments, clearComments]);

  return (
    <LocalizationProvider dateAdapter={AdapterDayjs}>
      <Box
        sx={{
          width: '100%',
          height: '100%',
          display: 'flex',
          justifyContent: 'center',
          alignItems: 'center',
        }}
      >
        <Paper
          elevation={1}
          sx={{
            p: 4,
            width: '100%',
            maxWidth: '1280px',
            height: '100%',
            display: 'flex',
            flexDirection: 'column',
            gap: 2,
          }}
        >
          <Box>
            <DatePicker
              label="날짜 선택"
              value={selectedDate}
              onChange={handleDateChange}
              minDate={dayjs().subtract(6, 'day')}
              maxDate={dayjs()}
              sx={{ width: '250px' }}
            />
          </Box>
          {isLoading ? (
            <Typography>로딩 중...</Typography>
          ) : (
            <FeedList
              feeds={hotFeeds}
              onClickFeed={setSelectedFeed}
              onClickLike={handleClickLike}
              fetchMore={async () => {}} // HotFeedPage는 무한 스크롤이 없으므로 빈 함수 전달
              // onChangeFilter는 전달하지 않음 (필터를 표시하지 않기 위해)
            />
          )}
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
              />
            )}
          </DialogContent>
        </Dialog>
      </Box>
    </LocalizationProvider>
  );
}
