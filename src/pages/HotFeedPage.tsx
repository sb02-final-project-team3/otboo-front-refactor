import { Box, Paper, Typography } from '@mui/material';
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';
import { DatePicker } from '@mui/x-date-pickers/DatePicker';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import dayjs, { type Dayjs } from 'dayjs';
import { useCallback, useEffect, useState } from 'react';
import useFeedStore from '../stores/feedStore';
import useHotFeedStore from '../stores/hotFeedStore';
import FeedGrid from '../components/feeds/FeedGrid';

export default function HotFeedPage() {
  const { hotFeeds, fetchHotFeeds, clear, isLoading } = useHotFeedStore();
  const { likeFeed, unlikeFeed } = useFeedStore();
  const [selectedDate, setSelectedDate] = useState<Dayjs | null>(dayjs());

  useEffect(() => {
    if (selectedDate) {
      fetchHotFeeds(selectedDate.format('YYYY-MM-DD'));
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
        fetchHotFeeds(selectedDate.format('YYYY-MM-DD'));
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
          sx={{ p: 4, width: '100%', height: '100%', display: 'flex', flexDirection: 'column', gap: 2 }}
        >
          <Typography variant="h5" component="h1">
            날짜별 인기 피드
          </Typography>
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
            <FeedGrid feeds={hotFeeds} onClickLike={handleClickLike} fetchMore={async () => {}} />
          )}
        </Paper>
      </Box>
    </LocalizationProvider>
  );
}
