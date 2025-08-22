import { useEffect } from 'react';

import type { WeatherDto } from '../../types/weathers';
import { Box } from '@mui/material';
import ClothesCard from '../clothes/ClothesCard';
import useRecommendationStore from '../../stores/recommendationStore';
import type { ClothesDto } from '../../types/clothes';

interface Props {
  weather?: WeatherDto | null;
}

export default function ClothesRecommentation({ weather }: Props) {
  const { recommendation, fetchRecommendation } = useRecommendationStore();

  useEffect(() => {
    if (weather) {
      fetchRecommendation(weather.id);
    }
  }, [weather, fetchRecommendation]);

  return (
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
          <ClothesCard clothes={ootd as unknown as ClothesDto} />
        </Box>
      ))}
    </Box>
  );
}
