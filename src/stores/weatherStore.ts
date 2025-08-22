import { create } from 'zustand';
import { getWeathers } from '../api/weathers';
import type { ErrorResponse, WeatherAPILocation } from '../types/common';
import type { WeatherDto } from '../types/weathers';

interface Store {
  weathers: WeatherDto[];
  isLoading: boolean;
  error: ErrorResponse | null;

  fetchWeathers: (location: WeatherAPILocation) => Promise<void>;

  clear: () => void;
}

const useWeatherStore = create<Store>((set, get) => ({
  weathers: [],
  isLoading: false,
  error: null,
  fetchWeathers: async (location) => {
    if (get().isLoading) return;

    set({ isLoading: true, error: null });
    try {
      const weathers = await getWeathers({ longitude: location.longitude, latitude: location.latitude });
      set({ weathers });
    } catch (error) {
      console.error('useWeatherStore.fetchWeathers', error);
      set({ error: error as ErrorResponse });
    } finally {
      set({ isLoading: false });
    }
  },
  clear: () => {
    set({ weathers: [], isLoading: false, error: null });
  },
}));

export default useWeatherStore;
