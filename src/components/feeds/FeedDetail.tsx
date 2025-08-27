import FavoriteIcon from '@mui/icons-material/Favorite';
import FavoriteBorderIcon from '@mui/icons-material/FavoriteBorder';
import VisibilityIcon from '@mui/icons-material/Visibility';
import MoreVertIcon from '@mui/icons-material/MoreVert';
import { Avatar, Box, Grid, TextField, Typography, IconButton, Menu, MenuItem, Button } from '@mui/material';
import dayjs from 'dayjs';
import { useCallback, useMemo, useState } from 'react';
import { useNavigate } from 'react-router';
import { ROUTE_OBJECTS } from '../../router';
import type { FeedDto, FeedUpdateRequest } from '../../types/feeds';
import { type CommentDto } from '../../types/feeds';
import OotdDetail from '../clothes/OotdDetail';
import CommentList from '../comments/CommentList';
import { WeatherIcons } from '../weathers/WeeklyWeather';
import useAuthStore from '../../stores/authStore';

interface Props {
  feed: FeedDto;
  comments: CommentDto[];
  onAddComment: (comment: string) => Promise<void>;
  fetchMore: () => Promise<void>;
  onClickLike?: (feedId: string, isLiked: boolean) => Promise<void>;
  onUpdate?: (feedId: string, updateRequest: FeedUpdateRequest) => Promise<void>;
  onDelete?: (feedId: string) => Promise<void>;
}

export default function FeedDetail({
  feed,
  comments,
  onAddComment,
  fetchMore,
  onClickLike,
  onUpdate,
  onDelete,
}: Props) {
  const navigate = useNavigate();
  const [comment, setComment] = useState('');
  const [isEditing, setIsEditing] = useState(false);
  const [updateRequest, setUpdateRequest] = useState<FeedUpdateRequest | null>(null);
  const { authentication } = useAuthStore();
  const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);
  const open = Boolean(anchorEl);

  const handleClick = (event: React.MouseEvent<HTMLElement>) => {
    setAnchorEl(event.currentTarget);
  };

  const handleClose = () => {
    setAnchorEl(null);
  };

  const handleEdit = () => {
    setIsEditing(true);
    handleClose();
  };

  const handleDelete = async () => {
    await onDelete?.(feed.id);
    handleClose();
  };

  const handleChangeContent = (content: string) => {
    setUpdateRequest({ content });
  };

  const handleSave = useCallback(async () => {
    if (!updateRequest) return;
    await onUpdate?.(feed.id, updateRequest);
    setIsEditing(false);
  }, [updateRequest, onUpdate, feed.id]);

  const isAuthor = useMemo(
    () => feed.author.userId === authentication?.userId,
    [feed.author.userId, authentication?.userId],
  );

  return (
    <Box sx={{ height: '100%' }}>
      <Grid container spacing={2} sx={{ height: '100%' }}>
        <Grid size={{ xs: 12, md: 8 }} height={'100%'}>
          <Box
            sx={{
              height: '100%',
              maxHeight: '100%',
              overflowX: 'auto',
              display: 'flex',
              flexWrap: 'nowrap',
              gap: 1,
              justifyContent: feed.ootds.length === 1 ? 'center' : 'flex-start',
            }}
          >
            {feed.ootds.map((ootd) => (
              <Box sx={{ width: '50%', height: '100%', border: '1px solid', borderRadius: 1, borderColor: 'divider' }}>
                <OotdDetail key={ootd.clothesId} ootd={ootd} />
              </Box>
            ))}
          </Box>
        </Grid>

        <Grid size={{ xs: 12, md: 4 }} sx={{ height: '100%' }}>
          <Box sx={{ height: '100%', display: 'flex', flexDirection: 'column', gap: 1 }}>
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, flexShrink: 0 }}>
              <Avatar
                src={feed.author.profileImageUrl}
                onClick={() => navigate(`${ROUTE_OBJECTS.profile.path}?userId=${feed.author.userId}`)}
                sx={{ cursor: 'pointer', '&:hover': { opacity: 0.8 } }}
              />
              <Typography
                fontWeight="bold"
                color="default"
                fontSize={16}
                onClick={() => navigate(`${ROUTE_OBJECTS.profile.path}?userId=${feed.author.userId}`)}
                sx={{ cursor: 'pointer', '&:hover': { opacity: 0.8, textDecoration: 'underline' } }}
              >
                {feed.author.name}
              </Typography>
              <Typography color="text.secondary" fontWeight={'semibold'} fontSize={14} sx={{ marginLeft: 'auto' }}>
                {dayjs(feed.createdAt).format('YYYY년 M월 D일 HH:mm')}
              </Typography>
              {isAuthor && (
                <IconButton
                  aria-label="more"
                  aria-controls={open ? 'long-menu' : undefined}
                  aria-expanded={open ? 'true' : undefined}
                  aria-haspopup="true"
                  onClick={handleClick}
                  size="small"
                >
                  <MoreVertIcon />
                </IconButton>
              )}
              <Menu
                id="long-menu"
                MenuListProps={{
                  'aria-labelledby': 'long-button',
                }}
                anchorEl={anchorEl}
                open={open}
                onClose={handleClose}
                PaperProps={{
                  style: {
                    maxHeight: 48 * 4.5,
                    padding: 2,
                    width: 'fit-content',
                  },
                }}
              >
                <MenuItem onClick={handleEdit}>수정하기</MenuItem>
                <MenuItem onClick={handleDelete} color="error">
                  삭제하기
                </MenuItem>
              </Menu>
            </Box>

            <Box sx={{ display: 'flex', alignItems: 'top', gap: 1, minHeight: 80, flexShrink: 0 }}>
              {isEditing ? (
                <Box
                  sx={{
                    display: 'flex',
                    flexDirection: 'column',
                    alignItems: 'stretch',
                    gap: 1,
                    minHeight: 80,
                    flexShrink: 0,
                    width: '100%',
                  }}
                >
                  <TextField
                    fullWidth
                    multiline
                    rows={3}
                    value={updateRequest?.content ?? feed.content}
                    onChange={(e) => handleChangeContent(e.target.value)}
                  />
                  <Button variant="contained" color="primary" onClick={handleSave} sx={{ width: '100%' }}>
                    저장
                  </Button>
                </Box>
              ) : (
                <Typography color="text.secondary" fontWeight={'semibold'} fontSize={16}>
                  {feed.content}
                </Typography>
              )}
            </Box>

            <Box sx={{ display: 'flex', alignItems: 'top', gap: 1, flexShrink: 0 }}>
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

            <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, flexShrink: 0 }}>
              <Box sx={{ display: 'flex', alignItems: 'center' }}>
                {feed.likedByMe ? (
                  <FavoriteIcon
                    color="primary"
                    onClick={() => onClickLike?.(feed.id, false)}
                    sx={{ cursor: 'pointer' }}
                  />
                ) : (
                  <FavoriteBorderIcon onClick={() => onClickLike?.(feed.id, true)} sx={{ cursor: 'pointer' }} />
                )}
              </Box>
              <Box sx={{ display: 'flex', alignItems: 'center' }}>
                <Typography fontWeight="bold" color="default" fontSize={14}>
                  좋아요 {feed.likeCount}개
                </Typography>
              </Box>
              <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.5, ml: 2 }}>
                <VisibilityIcon sx={{ fontSize: 18, color: 'text.secondary' }} />
                <Typography fontWeight="semibold" color="text.secondary" fontSize={14}>
                  조회수 {feed.viewCount || 0}
                </Typography>
              </Box>
            </Box>
            <Box sx={{ flex: 1, minHeight: 0, overflow: 'hidden' }}>
              <CommentList comments={comments} fetchMore={fetchMore} />
            </Box>

            <Box sx={{ flexShrink: 0 }}>
              <TextField
                fullWidth
                multiline
                rows={2}
                placeholder="댓글을 입력하세요."
                value={comment}
                onChange={(e) => setComment(e.target.value)}
                onKeyDown={(e: React.KeyboardEvent<HTMLInputElement>) => {
                  if (e.key === 'Enter' && e.nativeEvent.isComposing === false && e.currentTarget.value !== '') {
                    onAddComment(comment).then(() => {
                      setComment('');
                    });
                  }
                }}
              />
            </Box>
          </Box>
        </Grid>
      </Grid>
    </Box>
  );
}
