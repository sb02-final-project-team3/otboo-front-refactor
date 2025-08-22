import { Avatar, Box, Card, CardHeader, Typography } from '@mui/material';
import { useCallback } from 'react';
import { useNavigate } from 'react-router';
import useInfiniteScroll from '../../hooks/useInfiniteScroll';
import { ROUTE_OBJECTS } from '../../router';
import type { UserSummary } from '../../types/common';

interface Props {
  userSummaries: UserSummary[];
  fetchMore: () => Promise<void>;
  onClose?: () => void;
}

export default function UserSummaryList({ userSummaries, fetchMore, onClose }: Props) {
  const { infiniteScrollRef } = useInfiniteScroll(fetchMore);

  const navigate = useNavigate();

  const handleClickProfile = useCallback(
    (userId: string) => {
      navigate(`${ROUTE_OBJECTS.profile.path}?userId=${userId}`);
      onClose?.();
    },
    [navigate, onClose],
  );

  return (
    <Box ref={infiniteScrollRef}>
      {userSummaries.map((userSummary) => (
        <Card
          sx={{
            '&:hover': {
              cursor: 'pointer',
            },
          }}
          onClick={() => handleClickProfile(userSummary.userId)}
        >
          <CardHeader
            avatar={
              <Avatar src={userSummary.profileImageUrl} sx={{ cursor: 'pointer', '&:hover': { opacity: 0.8 } }} />
            }
            title={
              <Typography
                fontWeight="bold"
                color="default"
                fontSize={16}
                sx={{ cursor: 'pointer', '&:hover': { opacity: 0.8, textDecoration: 'underline' } }}
              >
                {userSummary.name}
              </Typography>
            }
          />
        </Card>
      ))}
    </Box>
  );
}
