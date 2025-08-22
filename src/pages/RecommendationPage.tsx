import {
  Box,
  Button,
  CircularProgress,
  Dialog,
  DialogContent,
  Grid,
  Paper,
  Stack,
  TextField,
  Typography,
} from '@mui/material';
import dayjs from 'dayjs';
import { useCallback, useEffect, useState } from 'react';
import { useNavigate } from 'react-router';
import OotdCard from '../components/clothes/OotdCard';
import OotdDetail from '../components/clothes/OotdDetail';
import LocationInfo from '../components/location/LocationInfo';
import WeatherDetail from '../components/weathers/WeatherDetail';
import WeeklyWeather from '../components/weathers/WeeklyWeather';
import useWeatherAPILocation from '../hooks/useWeatherAPILocation';
import { ROUTE_OBJECTS } from '../router';
import useAuthStore from '../stores/authStore';
import useFeedStore from '../stores/feedStore';
import useMyProfileStore from '../stores/myProfileStore';
import useRecommendationStore from '../stores/recommendationStore';
import useWeatherStore from '../stores/weatherStore';
import type { OotdDto } from '../types/common';
import type { WeatherDto } from '../types/weathers';
import useAlertStore from '../stores/alertStore';

export default function RecommendationPage() {
  const navigate = useNavigate();
  const [selectedClothes, setSelectedClothes] = useState<OotdDto | null>(null);
  const [selectedWeather, setSelectedWeather] = useState<WeatherDto | null>(null);

  const { recommendation, fetchRecommendation, clear: clearRecommendation } = useRecommendationStore();
  const { weathers, fetchWeathers, isLoading: weatherLoading } = useWeatherStore();
  const { location, setLocation, refetchLocation } = useWeatherAPILocation();
  const { myProfile, fetchMyProfile } = useMyProfileStore();
  const { authentication } = useAuthStore();
  const { openAlert } = useAlertStore();
  useEffect(() => {
    if (authentication) {
      fetchMyProfile();
    }
  }, [fetchMyProfile, authentication]);

  useEffect(() => {
    if (location) {
      fetchWeathers(location);
    }
  }, [location, fetchWeathers]);

  useEffect(() => {
    if (weathers) {
      setSelectedWeather(weathers[0]);
    }
  }, [weathers]);

  useEffect(() => {
    if (myProfile) {
      setLocation(myProfile.location);
    }
  }, [myProfile, setLocation]);

  useEffect(() => {
    if (selectedWeather) {
      fetchRecommendation(selectedWeather.id);
    } else {
      clearRecommendation();
    }
  }, [fetchRecommendation, selectedWeather, clearRecommendation]);

  const handleLocationChange = useCallback(async () => {
    await refetchLocation();
  }, [refetchLocation]);

  const [isAcceptingRecommendation, setIsAcceptingRecommendation] = useState(false);
  const [feedContent, setFeedContent] = useState<string>('');

  const handleAcceptRecommendation = useCallback(() => {
    if (recommendation) {
      setIsAcceptingRecommendation(true);
    }
  }, [recommendation]);

  const { createFeed } = useFeedStore();
  const handleCreateFeed = useCallback(async () => {
    if (recommendation && selectedWeather && authentication) {
      if (feedContent === '') {
        openAlert({
          title: '입력값 오류',
          message: '내용을 입력해주세요.',
          type: 'warning',
        });
        return;
      }
      await createFeed({
        authorId: authentication.userId,
        weatherId: selectedWeather.id,
        clothesIds: recommendation.clothes.map((clothes) => clothes.clothesId),
        content: feedContent,
      });
      setIsAcceptingRecommendation(false);
      setFeedContent('');
      openAlert({
        title: 'OOTD 등록 완료',
        message: 'OOTD가 등록되었습니다.',
        type: 'success',
      });
    }
  }, [recommendation, feedContent, createFeed, authentication]);

  if (location == null || myProfile == undefined) {
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
        <Paper
          elevation={1}
          sx={{
            p: 4,
            width: '100%',
            height: '100%',
            overflow: 'auto',
            display: 'flex',
            flexDirection: 'column',
            gap: 2,
          }}
        >
          <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2, alignItems: 'left' }}>
            <Typography>위치 정보를 설정해주세요.</Typography>
            <Button
              sx={{ width: '100%', maxWidth: '200px' }}
              variant="outlined"
              color="primary"
              size="small"
              onClick={handleLocationChange}
            >
              현재 위치로 설정하기
            </Button>
            <Button
              sx={{ width: '100%', maxWidth: '200px' }}
              variant="outlined"
              color="primary"
              size="small"
              onClick={() => {
                navigate(ROUTE_OBJECTS.profileManagement.path);
              }}
            >
              프로필에서 설정하기
            </Button>
          </Box>
        </Paper>
      </Box>
    );
  }

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
      <Paper elevation={1} sx={{ p: 4, width: '100%', height: '100%', overflow: 'auto' }}>
        <Stack spacing={2}>
          <Box sx={{ display: 'flex', justifyContent: 'start', alignItems: 'center', gap: 2 }}>
            <LocationInfo location={location ?? null} />
            <Button variant="outlined" color="primary" size="small" onClick={handleLocationChange}>
              현재 위치로 설정
            </Button>
          </Box>
          <Typography variant="h6">주간 날씨</Typography>
          {weatherLoading ? (
            <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '100%' }}>
              <CircularProgress />
            </Box>
          ) : (
            <WeeklyWeather weathers={weathers} onClickWeather={setSelectedWeather} activeWeather={selectedWeather} />
          )}

          <Grid container spacing={2} sx={{ height: '100%', overflow: 'auto' }}>
            <Grid size={{ xs: 12, md: 5 }} sx={{ maxHeight: '60%' }}>
              <Typography variant="h6">
                날씨 상세 {selectedWeather && `(${dayjs(selectedWeather.forecastAt).format('M월 D일')})`}
              </Typography>
              <Box sx={{ overflow: 'auto', maxHeight: '100%' }}>
                <WeatherDetail weather={selectedWeather} />
              </Box>
            </Grid>
            <Grid size={{ xs: 12, md: 7 }} sx={{ overflowX: 'auto', maxHeight: '60%' }}>
              <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <Typography variant="h6">추천</Typography>
                <Box sx={{ display: 'flex', gap: 1 }}>
                  <Button
                    variant="outlined"
                    color="primary"
                    size="small"
                    onClick={() => {
                      if (selectedWeather) {
                        fetchRecommendation(selectedWeather.id);
                      }
                    }}
                  >
                    다시 추천 받기
                  </Button>
                  <Button
                    variant="contained"
                    color="primary"
                    size="small"
                    onClick={handleAcceptRecommendation}
                    disabled={recommendation == null || recommendation.clothes.length == 0}
                  >
                    OOTD 등록하기
                  </Button>
                </Box>
              </Box>
              <Box sx={{ overflow: 'auto', maxHeight: '100%' }}>
                <Box
                  sx={{
                    display: 'flex',
                    flexDirection: 'row',
                    justifyContent: 'left',
                    flexWrap: 'no-wrap',
                    gap: 1,
                    p: 2,
                    width: '100%',
                    height: '70%',
                    maxHeight: '100%',
                    overflowX: 'auto',
                  }}
                >
                  {recommendation?.clothes.map((ootd) => (
                    <Box key={ootd.clothesId} sx={{ width: '200px' }}>
                      <OotdCard ootd={ootd} onSelect={setSelectedClothes} />
                    </Box>
                  ))}
                </Box>
              </Box>
              <Dialog
                open={isAcceptingRecommendation}
                onClose={() => setIsAcceptingRecommendation(false)}
                sx={{
                  '& .MuiDialog-paper': {
                    width: '30%',
                    height: 'fit-content',
                    maxHeight: '80%',
                    overflow: 'auto',
                  },
                }}
              >
                <DialogContent sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
                  <TextField
                    label="OOTD에 대해 설명해주세요."
                    value={feedContent}
                    onChange={(e: React.ChangeEvent<HTMLInputElement>) => setFeedContent(e.target.value)}
                    fullWidth
                    multiline
                    rows={4}
                  />
                  <Button variant="contained" color="primary" size="small" onClick={handleCreateFeed}>
                    OOTD 등록하기
                  </Button>
                </DialogContent>
              </Dialog>

              <Dialog
                open={selectedClothes !== null}
                onClose={() => setSelectedClothes(null)}
                sx={{
                  '& .MuiDialog-paper': {
                    width: '30%',
                    height: 'fit-content',
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
                  {selectedClothes && <OotdDetail ootd={selectedClothes} />}
                </DialogContent>
              </Dialog>
            </Grid>
          </Grid>
        </Stack>
      </Paper>
    </Box>
  );
}
