import { Box, Card, CardContent, CardMedia, Typography } from '@mui/material';
import SunnyIcon from '@mui/icons-material/WbSunny';
import WbCloudyIcon from '@mui/icons-material/WbCloudy';
import CloudQueueIcon from '@mui/icons-material/CloudQueue';
import { SkyStatusLabel, type SkyStatus } from '../../types/common';
import type { WeatherDto } from '../../types/weathers';
import dayjs from 'dayjs';

interface Props {
  weathers: WeatherDto[];
  onClickWeather: (weather: WeatherDto) => void;
  activeWeather?: WeatherDto | null;
}

export const WeatherIcons: Record<SkyStatus, React.ReactNode> = {
  CLEAR: <SunnyIcon sx={{ color: 'warning.main' }} />,
  CLOUDY: <WbCloudyIcon sx={{ color: 'grey.600' }} />,
  MOSTLY_CLOUDY: <CloudQueueIcon sx={{ color: 'grey.600' }} />,
};

export default function WeeklyWeather({ weathers, onClickWeather, activeWeather }: Props) {
  return (
    <Box sx={{ display: 'flex', flexDirection: 'row', gap: 1, overflowX: 'auto', p: 2, flexWrap: 'nowrap' }}>
      {weathers.map((weather) => (
        <Card
          key={weather.id}
          sx={{
            minWidth: '150px',
            width: 'calc(100% / 6)',
            height: 'fit-content',
            flex: '0 0 auto',
            transition: 'transform 0.2s',
            border: activeWeather?.id === weather.id ? 2 : 0,
            borderColor: 'primary.light',
            '&:hover': {
              cursor: 'pointer',
              transform: 'scale(1.02)',
              boxShadow: 2,
            },
          }}
          onClick={() => onClickWeather(weather)}
        >
          <CardContent>
            <Typography variant="h6" textAlign="center">
              {dayjs(weather.forecastAt).format('M월 D일')}
            </Typography>
          </CardContent>
          <CardMedia
            component="div"
            sx={{
              display: 'flex',
              justifyContent: 'center',
              flexDirection: 'column',
              alignItems: 'center',
            }}
          >
            {WeatherIcons[weather.skyStatus]}
            <Typography variant="caption" color="text.secondary">
              {SkyStatusLabel[weather.skyStatus]}
            </Typography>
          </CardMedia>
          <CardContent>
            <Box sx={{ display: 'flex', flexDirection: 'row', gap: 1, justifyContent: 'center' }}>
              <Typography fontWeight="bold" color="primary">
                {weather.temperature.min}°C
              </Typography>{' '}
              /{' '}
              <Typography fontWeight="bold" color="error">
                {weather.temperature.max}°C
              </Typography>
            </Box>
          </CardContent>
        </Card>
      ))}
    </Box>
  );
}
