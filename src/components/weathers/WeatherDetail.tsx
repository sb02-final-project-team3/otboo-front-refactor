import { Box, Skeleton, Typography } from '@mui/material';
import { WindSpeedInWordLabel, type WeatherDto } from '../../types/weathers';
import { PrecipitationTypeLabel, SkyStatusLabel } from '../../types/common';

interface Props {
  weather?: WeatherDto | null;
}

function WeatherDetail({ weather }: Props) {
  if (!weather) {
    return (
      <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '100%' }}>
        <Skeleton variant="rectangular" width="100%" height="100%" sx={{ backgroundColor: 'red' }} />
      </Box>
    );
  }

  return (
    <Box
      sx={{
        p: 3,
        borderRadius: 2,
        bgcolor: 'background.paper',
        boxShadow: 1,
      }}
    >
      <Box
        sx={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))',
          gap: 3,
        }}
      >
        <Box
          sx={{
            p: 2,
            borderRadius: 2,
            bgcolor: 'background.default',
            transition: 'transform 0.2s',
            '&:hover': {
              transform: 'translateY(-4px)',
              boxShadow: 2,
            },
          }}
        >
          <Typography variant="subtitle1" color="text.secondary" gutterBottom>
            날씨
          </Typography>
          <Typography variant="h6">{SkyStatusLabel[weather.skyStatus]}</Typography>
        </Box>

        <Box
          sx={{
            p: 2,
            borderRadius: 2,
            bgcolor: 'background.default',
            transition: 'transform 0.2s',
            '&:hover': {
              transform: 'translateY(-4px)',
              boxShadow: 2,
            },
          }}
        >
          <Typography variant="subtitle1" color="text.secondary" gutterBottom>
            기온
          </Typography>
          <Box sx={{ display: 'flex', flexDirection: 'column', gap: 1 }}>
            <Typography variant="h6">{weather.temperature.current?.toFixed(1)}°C</Typography>
            <Box sx={{ display: 'flex', gap: 2, color: 'text.secondary' }}>
              <Typography>최고 {weather.temperature.max?.toFixed(1)}°C</Typography>
              <Typography>최저 {weather.temperature.min?.toFixed(1)}°C</Typography>
            </Box>
            {weather.temperature.comparedToDayBefore !== null && (
              <Typography color={weather.temperature.comparedToDayBefore >= 0 ? 'error' : 'primary'}>
                전일대비 {weather.temperature.comparedToDayBefore > 0 ? '+' : ''}
                {weather.temperature.comparedToDayBefore?.toFixed(1)}°C
              </Typography>
            )}
          </Box>
        </Box>

        <Box
          sx={{
            p: 2,
            borderRadius: 2,
            bgcolor: 'background.default',
            transition: 'transform 0.2s',
            '&:hover': {
              transform: 'translateY(-4px)',
              boxShadow: 2,
            },
          }}
        >
          <Typography variant="subtitle1" color="text.secondary" gutterBottom>
            습도
          </Typography>
          <Typography variant="h6">{weather.humidity.current?.toFixed(1)}%</Typography>
          {weather.humidity.comparedToDayBefore !== null && (
            <Typography color={weather.humidity.comparedToDayBefore >= 0 ? 'error' : 'primary'}>
              전일대비 {weather.humidity.comparedToDayBefore > 0 ? '+' : ''}
              {weather.humidity.comparedToDayBefore?.toFixed(1)}%
            </Typography>
          )}
        </Box>

        <Box
          sx={{
            p: 2,
            borderRadius: 2,
            bgcolor: 'background.default',
            transition: 'transform 0.2s',
            '&:hover': {
              transform: 'translateY(-4px)',
              boxShadow: 2,
            },
          }}
        >
          <Typography variant="subtitle1" color="text.secondary" gutterBottom>
            강수
          </Typography>
          <Typography variant="h6">{PrecipitationTypeLabel[weather.precipitation.type]}</Typography>
          <Box sx={{ color: 'text.secondary' }}>
            <Typography>
              {weather.precipitation.amount?.toFixed(1)}mm / {(weather.precipitation.probability * 100).toFixed(1)}%
            </Typography>
          </Box>
        </Box>

        <Box
          sx={{
            p: 2,
            borderRadius: 2,
            bgcolor: 'background.default',
            transition: 'transform 0.2s',
            '&:hover': {
              transform: 'translateY(-4px)',
              boxShadow: 2,
            },
          }}
        >
          <Typography variant="subtitle1" color="text.secondary" gutterBottom>
            바람
          </Typography>
          <Typography variant="h6">{weather.windSpeed.speed?.toFixed(1)}m/s</Typography>
          <Typography color="text.secondary">{WindSpeedInWordLabel[weather.windSpeed.asWord]}</Typography>
        </Box>
      </Box>
    </Box>
  );
}

export default WeatherDetail;
