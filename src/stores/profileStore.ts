import { create } from 'zustand';
import { getUserProfile } from '../api/users';
import type { ErrorResponse } from '../types/common';
import type { ProfileDto } from '../types/users';

interface Store {
  profile: ProfileDto | null;
  isLoading: boolean;
  error: ErrorResponse | null;

  fetchProfile: (userId: string) => Promise<void>;
  clear: () => void;
}

const useProfileStore = create<Store>((set, get) => ({
  profile: null,
  isLoading: false,
  error: null,
  fetchProfile: async (userId) => {
    if (get().isLoading) return;

    set({ isLoading: true, error: null });
    try {
      const profile = await getUserProfile(userId);
      set({ profile });
    } catch (error) {
      console.error('useUserStore.fetchProfile', error);
      set({ error: error as ErrorResponse });
    } finally {
      set({ isLoading: false });
    }
  },
  clear: () => {
    set({ profile: null, isLoading: false, error: null });
  },
}));

export default useProfileStore;
