import { Box, Grid } from '@mui/material';
import useInfiniteScroll from '../../hooks/useInfiniteScroll';
import type { FeedDto } from '../../types/feeds';
import FeedCard from './FeedCard';

interface Props {
  // The 'feeds' prop might be an object now, so you might need to adjust its type
  // For now, we'll handle it inside the component
  feeds: any;
  onClickFeed?: (feed: FeedDto) => void;
  onClickLike?: (feedId: string, isLiked: boolean) => Promise<void>;
  fetchMore: () => Promise<void>;
}

export default function FeedGrid({ feeds, onClickFeed, onClickLike, fetchMore }: Props) {
  const { infiniteScrollRef } = useInfiniteScroll(fetchMore);
  const feedItems = feeds?.content || [];

  return (
    <Box ref={infiniteScrollRef} sx={{ width: '100%', height: '100%', maxHeight: '100%', overflow: 'auto' }}>
      <Grid container spacing={2}>
        {Array.isArray(feedItems) &&
          feedItems.map((feed: FeedDto) => (
            <Grid item key={feed.id} xs={12} md={4} lg={3} onClick={() => onClickFeed?.(feed)}>
              <FeedCard feed={feed} onClickLike={onClickLike} />
            </Grid>
          ))}
      </Grid>
    </Box>
  );
}
