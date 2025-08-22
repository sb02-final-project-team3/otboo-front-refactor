import { create } from 'zustand';
import type { ErrorResponse } from '../types/common';
import type { RecommendationDto } from '../types/recommendations';
import { getRecommendation } from '../api/recommendations';

interface Store {
  recommendation: RecommendationDto | null;
  isLoading: boolean;
  error: ErrorResponse | null;

  fetchRecommendation: (weatherId: string) => Promise<void>;

  clear: () => void;
}

const useRecommendationStore = create<Store>((set, get) => ({
  recommendation: null,
  isLoading: false,
  error: null,
  fetchRecommendation: async (weatherId) => {
    if (get().isLoading) return;

    set({ isLoading: true, error: null });
    try {
      const recommendation = await getRecommendation({ weatherId });
      set({ recommendation });
    } catch (error) {
      console.error('useRecommendationStore.fetchRecommendation', error);
      set({ error: error as ErrorResponse });
    } finally {
      set({ isLoading: false });
    }
  },
  clear: () => {
    set({ recommendation: null, error: null });
  },
}));

export default useRecommendationStore;
