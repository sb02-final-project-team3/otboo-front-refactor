import FavoriteIcon from '@mui/icons-material/Favorite';
import FavoriteBorderIcon from '@mui/icons-material/FavoriteBorder';
import VisibilityIcon from '@mui/icons-material/Visibility';
import { Avatar, Box, Card, CardContent, CardHeader, CardMedia, Typography } from '@mui/material';
import dayjs from 'dayjs';
import type { FeedDto } from '../../types/feeds';
import { WeatherIcons } from '../weathers/WeeklyWeather';
import { useCallback, useMemo } from 'react';
import { useNavigate } from 'react-router';
import { ROUTE_OBJECTS } from '../../router';

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
        subheader={dayjs(feed.createdAt).format('M월 D일 HH:mm')}
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
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
            <Box sx={{ display: 'flex', alignItems: 'center' }}>
              {feed.likedByMe ? (
                <FavoriteIcon color="primary" onClick={(e) => handleClickLike(e)} />
              ) : (
                <FavoriteBorderIcon onClick={(e) => handleClickLike(e)} />
              )}
            </Box>
            <Box sx={{ display: 'flex', alignItems: 'center' }}>
              <Typography fontWeight="bold" color="default" fontSize={14}>
                좋아요 {feed.likeCount}개
              </Typography>
            </Box>
          </Box>

          <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.5 }}>
            <VisibilityIcon sx={{ fontSize: 16, color: 'grey.600' }} />
            <Typography fontWeight="semibold" color="text.secondary" fontSize={14}>
              {feed.viewCount || 0}
            </Typography>
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
