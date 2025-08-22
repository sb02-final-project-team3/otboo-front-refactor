import { Box, Typography } from '@mui/material';
import type { WeatherAPILocation } from '../../types/common';
import { useMemo } from 'react';

interface Props {
  location: WeatherAPILocation | null;
}

export default function LocationInfo({ location }: Props) {
  const displayLocation = useMemo(() => {
    if (!location) return '위치 정보 없음';

    const { locationNames } = location;

    return locationNames.join(' ');
  }, [location]);

  return (
    <Box>
      <Typography variant="h6">{displayLocation}</Typography>
    </Box>
  );
}
