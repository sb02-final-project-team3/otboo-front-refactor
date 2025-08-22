import { useCallback, useState } from 'react';
import { getWeatherLocation } from '../api/weathers';
import type { WeatherAPILocation } from '../types/common';

export default function useWeatherAPILocation(initialLocation?: WeatherAPILocation | null) {
  const [location, setLocation] = useState<WeatherAPILocation | null | undefined>(initialLocation);

  const refetchLocation = useCallback(async () => {
    const geoLocation = navigator.geolocation;

    if (!geoLocation) {
      let longitude: number = 0;
      let latitude: number = 0;
      longitude = Number(prompt('Geolocation API를 사용할 수 없습니다.\n경도를 직접 입력해주세요. \n(예: 126.988)'));
      if (!longitude) {
        return;
      }
      latitude = Number(prompt('위도를 직접 입력해주세요. \n(예: 37.567)'));
      if (!latitude) {
        return;
      }
      if (longitude && latitude) {
        const location = await getWeatherLocation({
          longitude,
          latitude,
        });
        setLocation(location);
      }
    } else {
      geoLocation.getCurrentPosition(async (position) => {
        const location = await getWeatherLocation({
          longitude: position.coords.longitude,
          latitude: position.coords.latitude,
        });
        setLocation(location);
      });
    }
  }, []);

  return { location, refetchLocation, setLocation };
}
