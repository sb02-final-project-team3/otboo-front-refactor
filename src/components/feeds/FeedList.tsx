import { Box, Grid } from '@mui/material';
import FeedCard from './FeedCard';
import FeedListFilter from './FeedListFilter';
import type { FeedDto } from '../../types/feeds';
import type { PrecipitationType, SkyStatus } from '../../types/common';
import useInfiniteScroll from '../../hooks/useInfiniteScroll';

interface Props {
  feeds: FeedDto[];
  onClickFeed?: (feed: FeedDto) => void;
  onClickLike?: (feedId: string, isLiked: boolean) => Promise<void>;
  onChangeFilter?: (filter: {
    keywordLike?: string;
    skyStatusEqual?: SkyStatus;
    precipitationTypeEqual?: PrecipitationType;
    sortBy?: 'createdAt' | 'likeCount';
  }) => void;
  fetchMore: () => Promise<void>;
}

export default function FeedList({ feeds, onClickFeed, onClickLike, onChangeFilter = () => {}, fetchMore }: Props) {
  const { infiniteScrollRef } = useInfiniteScroll(fetchMore);

  return (
    <Box ref={infiniteScrollRef} sx={{ width: '100%', height: '100%', maxHeight: '100%', overflow: 'auto' }}>
      <FeedListFilter onChangeFilter={onChangeFilter} />
      <Grid container spacing={2}>
        {feeds.map((feed) => (
          <Grid key={feed.id} size={{ xs: 12, md: 4, lg: 3 }} onClick={() => onClickFeed?.(feed)}>
            <FeedCard feed={feed} onClickLike={onClickLike} />
          </Grid>
        ))}
      </Grid>
    </Box>
  );
}
