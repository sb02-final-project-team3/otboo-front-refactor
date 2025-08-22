import {
  Avatar,
  Box,
  Button,
  Dialog,
  DialogContent,
  DialogTitle,
  Grid,
  ImageList,
  ImageListItem,
  Paper,
  Tab,
  Tabs,
  TextField,
  Typography,
} from '@mui/material';
import { useCallback, useEffect, useMemo, useState } from 'react';
import { useSearchParams } from 'react-router';
import ClothesCard from '../components/clothes/ClothesCard';
import ClothesDetail from '../components/clothes/ClothesDetail';
import DirectMessageList from '../components/directmessage/DirectMessageList';
import FeedDetail from '../components/feeds/FeedDetail';
import { WeatherIcons } from '../components/weathers/WeeklyWeather';
import useInfiniteScroll from '../hooks/useInfiniteScroll';
import useAuthStore from '../stores/authStore';
import useClothesStore from '../stores/clothesStore';
import useCommentStore from '../stores/commentStore';
import useDirectMessageStore from '../stores/directMessageStore';
import useFeedStore from '../stores/feedStore';
import useFollowStore from '../stores/followStore';
import useProfileStore from '../stores/profileStore';
import { ClothesTypeLabel, type ClothesDto, type ClothesType } from '../types/clothes';
import type { FeedDto } from '../types/feeds';
import UserSummaryList from '../components/profiles/UserSummaryList';

export default function ProfilePage() {
  const [searchParams] = useSearchParams();
  const userId = searchParams.get('userId');

  const { authentication } = useAuthStore();
  const { profile, fetchProfile } = useProfileStore();
  const {
    followSummary,
    fetchFollowSummary,
    createFollow,
    cancelFollow,
    fetchFollowers,
    fetchFollowings,
    fetchMoreFollowers,
    fetchMoreFollowings,
    followers,
    followings,
    clearFollowers,
    clearFollowings,
    clear: clearFollow,
  } = useFollowStore();
  const { feeds, fetchFeeds, fetchMore: fetchMoreFeeds, clear: clearFeeds } = useFeedStore();
  const {
    comments,
    createComment,
    fetchMore: fetchMoreComments,
    fetchComments,
    clear: clearComments,
  } = useCommentStore();
  const {
    directMessages,
    fetchDirectMessages,
    fetchMore: fetchMoreDirectMessages,
    clear: clearDirectMessages,
  } = useDirectMessageStore();
  const { clothesList, fetchClothes, clear: clearClothes, fetchMore: fetchMoreClothes } = useClothesStore();

  const { infiniteScrollRef: feedInfiniteScrollRef } = useInfiniteScroll(fetchMoreFeeds);
  const { infiniteScrollRef: clothesInfiniteScrollRef } = useInfiniteScroll(fetchMoreClothes);

  const [selectedFeed, setSelectedFeed] = useState<FeedDto | null>(null);

  useEffect(() => {
    if (userId) {
      clearFeeds();
      clearComments();
      clearDirectMessages();
      clearClothes();
      clearFollow();

      fetchProfile(userId);
      fetchFollowSummary(userId);
      fetchFeeds({ authorIdEqual: userId });
    }
  }, [userId, fetchProfile, fetchFollowSummary, fetchFeeds]);

  if (!userId) {
    return <div>User not found</div>;
  }

  const handleClickFollow = useCallback(async () => {
    if (!authentication || !followSummary) {
      return;
    }
    if (followSummary.followedByMe) {
      await cancelFollow(followSummary.followedByMeId!);
    } else {
      await createFollow({ followeeId: userId, followerId: authentication.userId });
    }
    fetchFollowSummary(userId);
  }, [followSummary, cancelFollow, createFollow, authentication, userId, fetchFollowSummary]);

  const [dmOpen, setDmOpen] = useState(false);
  const handleClickDm = useCallback(() => {
    setDmOpen(true);
  }, []);

  useEffect(() => {
    if (userId) {
      fetchDirectMessages(userId);
    }
  }, [userId, fetchDirectMessages]);

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
      clearComments()
    }
  }, [selectedFeed, fetchComments, clearComments]);

  const [type, setType] = useState<ClothesType>('TOP');
  const [selectedClothes, setSelectedClothes] = useState<ClothesDto | null>(null);
  useEffect(() => {
    if (userId) {
      clearClothes();
      fetchClothes({ ownerId: userId, typeEqual: type });
    }
  }, [type, userId, fetchClothes, clearClothes]);
  const handleChange = useCallback((_event: React.SyntheticEvent, newValue: ClothesType) => {
    setType(newValue);
  }, []);

  const [selectedFollowType, setSelectedFollowType] = useState<'followers' | 'followings' | null>(null);

  const fetchMoreFollows = useCallback(async () => {
    if (selectedFollowType === 'followers') {
      await fetchMoreFollowers();
    } else if (selectedFollowType === 'followings') {
      await fetchMoreFollowings();
    }
  }, [selectedFollowType, fetchMoreFollowers, fetchMoreFollowings]);

  useEffect(() => {
    if (selectedFollowType === 'followers') {
      fetchFollowers({ followeeId: userId });
    } else if (selectedFollowType === 'followings') {
      fetchFollowings({ followerId: userId });
    } else {
      clearFollowers();
      clearFollowings();
    }
  }, [selectedFollowType, fetchFollowers, fetchFollowings, userId, clearFollowers, clearFollowings]);

  const userSummaries = useMemo(() => {
    if (selectedFollowType === 'followers') {
      return followers.map((follower) => follower.follower);
    } else if (selectedFollowType === 'followings') {
      return followings.map((following) => following.followee);
    }
  }, [selectedFollowType, followers, followings]);

  const handleSearchUser = useCallback(
    (search: string) => {
      if (selectedFollowType === 'followers') {
        clearFollowers();
        fetchFollowers({ followeeId: userId, nameLike: search });
      } else if (selectedFollowType === 'followings') {
        clearFollowings();
        fetchFollowings({ followerId: userId, nameLike: search });
      }
    },
    [selectedFollowType, fetchFollowers, fetchFollowings, userId],
  );

  const handleChangeFilter = useCallback(
    (filter: { nameLike?: string }) => {
      const debounceTimer = setTimeout(() => {
        handleSearchUser(filter.nameLike ?? '');
      }, 300);

      return () => clearTimeout(debounceTimer);
    },
    [handleSearchUser],
  );

  return (
    <Box
      sx={{
        width: '100%',
        height: '100%',
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
      }}
    >
      <Paper elevation={1} sx={{ p: 4, width: '100%', height: '100%' }}>
        <Grid container spacing={2} sx={{ height: '100%', overflow: 'hidden' }}>
          <Grid size={{ xs: 12, md: 6 }} sx={{ height: '100%' }}>
            <Box sx={{ height: '100%', display: 'flex', flexDirection: 'column' }}>
              <Box sx={{ display: 'flex', flexDirection: 'row', gap: 2 }}>
                <Box>
                  <Avatar src={profile?.profileImageUrl} sx={{ width: 100, height: 100, mb: 2 }} />
                </Box>
                <Box>
                  <Typography fontWeight="bold" color="default" fontSize={18}>
                    {profile?.name}
                  </Typography>
                  <Box sx={{ display: 'flex', flexDirection: 'row', gap: 1 }}>
                    <Box
                      sx={{
                        display: 'flex',
                        flexDirection: 'row',
                        gap: 0.5,
                        '&:hover': { cursor: 'pointer' },
                      }}
                      onClick={() => {
                        if (followSummary?.followerCount && followSummary.followerCount > 0) {
                          setSelectedFollowType('followers');
                        }
                      }}
                    >
                      <Typography fontWeight="bold" color="grey.600" fontSize={16}>
                        팔로워
                      </Typography>
                      <Typography fontWeight="bold" color="default" fontSize={16}>
                        {followSummary?.followerCount}
                      </Typography>
                    </Box>
                    <Box
                      sx={{
                        display: 'flex',
                        flexDirection: 'row',
                        gap: 0.5,
                        '&:hover': { cursor: 'pointer' },
                      }}
                      onClick={() => {
                        if (followSummary?.followingCount && followSummary.followingCount > 0) {
                          setSelectedFollowType('followings');
                        }
                      }}
                    >
                      <Typography fontWeight="bold" color="grey.600" fontSize={16} sx={{ ml: 1 }}>
                        팔로우
                      </Typography>
                      <Typography fontWeight="bold" color="default" fontSize={16}>
                        {followSummary?.followingCount}
                      </Typography>
                    </Box>
                  </Box>
                  {userId !== authentication?.userId && (
                    <Box sx={{ display: 'flex', flexDirection: 'row', gap: 1, mt: 2 }}>
                      {followSummary?.followedByMe ? (
                        <Button variant="outlined" color="error" size="small" onClick={handleClickFollow}>
                          팔로우 취소
                        </Button>
                      ) : (
                        <Button variant="contained" color="primary" size="small" onClick={handleClickFollow}>
                          팔로우
                        </Button>
                      )}
                      <Button variant="outlined" color="primary" size="small" onClick={handleClickDm}>
                        메시지 보내기
                      </Button>
                    </Box>
                  )}
                </Box>
              </Box>
              <Box
                sx={{
                  mt: 2,
                  flex: 1,
                  height: '100%',
                  width: '100%',
                  maxHeight: '100%',
                  overflow: 'auto',
                }}
                ref={feedInfiniteScrollRef}
              >
                <ImageList cols={3} rowHeight={200} sx={{ flex: 1, height: '100%', width: '100%' }}>
                  {feeds.map((feed) => (
                    <ImageListItem
                      key={feed.id}
                      sx={{
                        position: 'relative',
                        '&:hover': {
                          cursor: 'pointer',
                          '& .overlay': {
                            opacity: 1,
                          },
                        },
                        '&:active': { opacity: 0.5 },
                      }}
                      onClick={() => setSelectedFeed(feed)}
                    >
                      <img
                        src={feed.ootds[0]?.imageUrl || 'https://placehold.co/500x400?text=No+Image'}
                        alt={feed.ootds[0]?.name}
                      />
                      <Box
                        className="overlay"
                        sx={{
                          position: 'absolute',
                          top: 0,
                          left: 0,
                          width: '100%',
                          height: '100%',
                          backgroundColor: 'rgba(0, 0, 0, 0.5)',
                          opacity: 0,
                          transition: 'opacity 0.2s',
                        }}
                      >
                        <Box sx={{ display: 'flex', flexDirection: 'column', gap: 1, p: 2 }}>
                          <Typography fontWeight="bold" color="white" fontSize={16}>
                            {feed.ootds[0]?.name}
                          </Typography>
                          <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                            <Typography color="white" fontSize={14} fontWeight="bold">
                              좋아요 {feed.likeCount}개
                            </Typography>
                          </Box>

                          <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                            <Box sx={{ display: 'flex', alignItems: 'center' }}>
                              {WeatherIcons[feed.weather.skyStatus]}
                            </Box>
                            <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.5 }}>
                              <Typography fontWeight="bold" color="white">
                                {feed.weather.temperature.min}°C
                              </Typography>
                              <Typography fontWeight="bold" color="white">
                                {feed.weather.temperature.max}°C
                              </Typography>
                            </Box>
                          </Box>
                        </Box>
                      </Box>
                    </ImageListItem>
                  ))}
                </ImageList>
                <Dialog
                  open={selectedFollowType !== null}
                  onClose={() => setSelectedFollowType(null)}
                  sx={{
                    '& .MuiDialog-paper': {
                      width: '20%',
                      height: '50%',
                      maxWidth: '80%',
                      overflow: 'auto',
                    },
                  }}
                >
                  <DialogTitle>{selectedFollowType === 'followers' ? '팔로워' : '팔로잉'}</DialogTitle>
                  <DialogContent sx={{ height: '100%' }}>
                    <Box>
                      <TextField
                        label="사용자 검색"
                        size="small"
                        fullWidth
                        onChange={(e) => {
                          handleChangeFilter({ nameLike: e.target.value });
                        }}
                      />
                    </Box>
                    {userSummaries && (
                      <UserSummaryList
                        userSummaries={userSummaries}
                        fetchMore={fetchMoreFollows}
                        onClose={() => setSelectedFollowType(null)}
                      />
                    )}
                  </DialogContent>
                </Dialog>
                <Dialog
                  open={dmOpen}
                  onClose={() => setDmOpen(false)}
                  sx={{
                    '& .MuiDialog-paper': {
                      width: '30%',
                      height: '50%',
                      maxWidth: '80%',
                      overflow: 'auto',
                    },
                  }}
                >
                  <DialogTitle>{profile?.name}님과의 메시지</DialogTitle>
                  <DialogContent sx={{ height: '100%' }}>
                    <DirectMessageList
                      directMessages={directMessages}
                      receiverId={userId}
                      fetchMore={fetchMoreDirectMessages}
                    />
                  </DialogContent>
                </Dialog>
                <Dialog
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
                      />
                    )}
                  </DialogContent>
                </Dialog>
              </Box>
            </Box>
          </Grid>
          <Grid size={{ xs: 12, md: 6 }}>
            <Typography fontWeight="bold" color="default" fontSize={18}>
              옷장
            </Typography>
            <Box sx={{ flexGrow: 1, bgcolor: 'background.paper', display: 'flex', height: '100%' }}>
              <Tabs
                orientation="vertical"
                value={type}
                onChange={handleChange}
                sx={{
                  borderRight: 1,
                  borderColor: 'divider',
                  '& .MuiTab-root': {
                    minWidth: '150px',
                  },
                  overflow: 'auto',
                }}
              >
                {Object.entries(ClothesTypeLabel).map(([key, value]) => (
                  <Tab key={key} label={value} value={key} />
                ))}
              </Tabs>
              <Box
                ref={clothesInfiniteScrollRef}
                sx={{
                  display: 'flex',
                  flexDirection: 'row',
                  justifyContent: 'left',
                  flexWrap: 'wrap',
                  gap: 1,
                  p: 2,
                  width: '100%',
                  height: 'calc(100vh - 200px)',
                  overflow: 'auto',
                }}
              >
                <Grid container spacing={2} sx={{ width: '100%' }}>
                  {clothesList
                    .filter((c) => c.type === type)
                    .map((c) => (
                      <Grid key={c.id} size={{ xs: 12, md: 4 }}>
                        <ClothesCard clothes={c} onSelect={setSelectedClothes} />
                      </Grid>
                    ))}
                </Grid>
              </Box>
              <Dialog
                open={selectedClothes !== null}
                onClose={() => {
                  setSelectedClothes(null);
                }}
                sx={{
                  '& .MuiDialog-paper': {
                    width: '30%',
                    height: 'calc(80vh)',
                    maxHeight: '80%',
                    overflow: 'auto',
                  },
                }}
              >
                <DialogContent
                  sx={{
                    width: '100%',
                    height: '100%',
                    overflow: 'auto',
                  }}
                >
                  {selectedClothes && <ClothesDetail clothes={selectedClothes} />}
                </DialogContent>
              </Dialog>
            </Box>
          </Grid>
        </Grid>
      </Paper>
    </Box>
  );
}
