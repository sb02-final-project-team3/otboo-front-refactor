import { Box, Paper, Typography } from '@mui/material';
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';
import { DatePicker } from '@mui/x-date-pickers/DatePicker';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import dayjs, { type Dayjs } from 'dayjs';
import { useCallback, useEffect, useState } from 'react';
import useFeedStore from '../stores/feedStore';
import useHotFeedStore from '../stores/hotFeedStore';
import FeedList from '../components/feeds/FeedList';

export default function HotFeedPage() {
  const { hotFeeds, fetchHotFeeds, clear, isLoading } = useHotFeedStore();
  const { likeFeed, unlikeFeed } = useFeedStore();
  const [selectedDate, setSelectedDate] = useState<Dayjs | null>(dayjs());

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
              onClickLike={handleClickLike}
              fetchMore={async () => {}} // HotFeedPage는 무한 스크롤이 없으므로 빈 함수 전달
            />
          )}
        </Paper>
      </Box>
    </LocalizationProvider>
  );
}
