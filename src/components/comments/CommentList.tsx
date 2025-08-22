import { Avatar, Box, Link, Typography } from '@mui/material';
import dayjs from 'dayjs';
import { useCallback } from 'react';
import { useNavigate } from 'react-router';
import useInfiniteScroll from '../../hooks/useInfiniteScroll';
import { ROUTE_OBJECTS } from '../../router';
import type { CommentDto } from '../../types/feeds';

interface Props {
  comments: CommentDto[];
  fetchMore?: () => Promise<void>;
}

export default function CommentList({ comments, fetchMore = () => Promise.resolve() }: Props) {
  const { infiniteScrollRef } = useInfiniteScroll(fetchMore);
  const navigate = useNavigate();

  const handleClickProfile = useCallback(
    (userId: string) => {
      navigate(`${ROUTE_OBJECTS.profile.path}?userId=${userId}`);
    },
    [navigate],
  );

  return (
    <Box
      sx={{
        display: 'flex',
        flexDirection: 'column',
        gap: 1,
        height: '100%',
        maxHeight: '99%',
        overflow: 'auto',
        width: '100%',
      }}
      ref={infiniteScrollRef}
    >
      {comments.map((comment) => (
        <Box key={comment.id} sx={{ display: 'flex', alignItems: 'top', gap: 1 }}>
          <Box sx={{ display: 'flex', alignItems: 'top' }}>
            <Avatar src={comment.author.profileImageUrl} />
          </Box>
          <Box sx={{ display: 'flex', alignItems: 'top' }}>
            <Box>
              <Typography sx={{ maxHeight: '100px', overflow: 'hidden' }}>
                <Link
                  onClick={(e) => {
                    e.stopPropagation();
                    handleClickProfile(comment.author.userId);
                  }}
                  sx={{
                    textDecoration: 'none',
                    color: 'inherit',
                    cursor: 'pointer',
                    '&:hover': { color: 'primary.main', textDecoration: 'underline' },
                  }}
                >
                  <Typography component="span" fontWeight="bold">
                    {comment.author.name}
                  </Typography>
                </Link>{' '}
                {comment.content}
              </Typography>
              <Typography fontSize={14} fontWeight={'semibold'} color={'text.secondary'}>
                {dayjs(comment.createdAt).format('YYYY년 M월 D일 HH:mm')}
              </Typography>
            </Box>
          </Box>
        </Box>
      ))}
    </Box>
  );
}
