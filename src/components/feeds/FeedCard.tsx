import FavoriteIcon from '@mui/icons-material/Favorite';
import FavoriteBorderIcon from '@mui/icons-material/FavoriteBorder';
import { Avatar, Box, Card, CardContent, CardHeader, CardMedia, Typography } from '@mui/material';
import dayjs from 'dayjs';
import 'dayjs/locale/ko'; // 한국어 로케일 import
import relativeTime from 'dayjs/plugin/relativeTime'; // relativeTime 플러그인 import

import type { FeedDto } from '../../types/feeds';
import { WeatherIcons } from '../weathers/WeeklyWeather';
import { useCallback, useMemo } from 'react';
import { useNavigate } from 'react-router';
import { ROUTE_OBJECTS } from '../../router';

dayjs.extend(relativeTime); // 플러그인 활성화
dayjs.locale('ko'); // 한국어 설정

interface Props {
  feed: FeedDto;
  onClickLike?: (feedId: string, isLiked: boolean) => Promise<void>;
}

export default function FeedCard({ feed, onClickLike = async () => {} }: Props) {
  const navigate = useNavigate();

  const handleClickProfile = useCallback(
    (e: React.MouseEvent<HTMLDivElement>) => {
      e.stopPropagation();
      navigate(`${ROUTE_OBJECTS.profile.path}?userId=${feed.author.userId}`);
    },
    [feed.author.userId, navigate],
  );

  const ootdImages = useMemo(() => {
    return feed.ootds
      .map((ootd) => ootd.imageUrl)
      .filter((imageUrl) => imageUrl !== null && imageUrl !== undefined && imageUrl !== '')
      .slice(0, 4);
  }, [feed.ootds]);

  const handleClickLike = useCallback(
    async (e: React.MouseEvent<SVGSVGElement>) => {
      e.stopPropagation();
      await onClickLike(feed.id, !feed.likedByMe);
    },
    [feed.id, feed.likedByMe, onClickLike],
  );

  const subheaderText = useMemo(() => {
    const viewCountText = `조회수 ${feed.viewCount || 0}회`;
    const dateText = dayjs(feed.createdAt).fromNow(); // "3일 전" 과 같은 상대 시간
    return `${viewCountText} • ${dateText}`;
  }, [feed.viewCount, feed.createdAt]);

  return (
    <Card
      sx={{
        transition: 'transform 0.2s',
        '&:hover': {
          boxShadow: 2,
          transform: 'translateY(-4px)',
          cursor: 'pointer',
        },
      }}
    >
      <CardHeader
        avatar={
          <Avatar
            src={feed.author.profileImageUrl}
            onClick={handleClickProfile}
            sx={{ cursor: 'pointer', '&:hover': { opacity: 0.8 } }}
          />
        }
        title={
          <Typography
            fontWeight="bold"
            color="default"
            fontSize={16}
            onClick={handleClickProfile}
            sx={{ cursor: 'pointer', '&:hover': { opacity: 0.8, textDecoration: 'underline' } }}
          >
            {feed.author.name}
          </Typography>
        }
        subheader={subheaderText}
      />
      <Box
        sx={{
          display: 'grid',
          gridTemplateColumns:
            ootdImages.length === 1 ? '1fr' : ootdImages.length === 2 ? 'repeat(2, 1fr)' : 'repeat(2, 1fr)',
          gridTemplateRows: ootdImages.length <= 2 ? '1fr' : 'repeat(2, 1fr)',
          gap: 1,
          height: 300,
        }}
      >
        {ootdImages.map((imageUrl) => (
          <CardMedia key={imageUrl} image={imageUrl} sx={{ height: '100%', objectFit: 'contain' }} />
        ))}
      </Box>
      <CardContent>
        <Box sx={{ display: 'flex', flexDirection: 'column', gap: 1 }}>
          <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
            {/* 좋아요 정보 (왼쪽) */}
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
              {feed.likedByMe ? (
                <FavoriteIcon color="primary" onClick={(e) => handleClickLike(e)} />
              ) : (
                <FavoriteBorderIcon onClick={(e) => handleClickLike(e)} />
              )}

              <Typography fontWeight="bold" color="default" fontSize={14}>
                좋아요 {feed.likeCount}개
              </Typography>
            </Box>
          </Box>

          <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
            <Box sx={{ display: 'flex', alignItems: 'center' }}>{WeatherIcons[feed.weather.skyStatus]}</Box>
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.5 }}>
              <Typography fontWeight="bold" color="primary">
                {feed.weather.temperature.min}°C
              </Typography>
              <Typography fontWeight="bold" color="error">
                {feed.weather.temperature.max}°C
              </Typography>
            </Box>
          </Box>
        </Box>
      </CardContent>
    </Card>
  );
}
