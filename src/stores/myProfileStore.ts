import { create } from 'zustand';
import type { ErrorResponse } from '../types/common';
import type { ProfileDto, ProfileUpdateRequest } from '../types/users';
import { getUserProfile, updateUserProfile } from '../api/users';
import useAuthStore from './authStore';

interface Store {
  myProfile: ProfileDto | null;
  isLoading: boolean;
  error: ErrorResponse | null;

  fetchMyProfile: () => Promise<void>;
  updateProfile: (userId: string, request: ProfileUpdateRequest, imageFile?: File) => Promise<void>;
  clear: () => void;
}

const useMyProfileStore = create<Store>((set, get) => ({
  myProfile: null,
  isLoading: false,
  error: null,
  fetchMyProfile: async () => {
    if (get().isLoading) return;

    set({ isLoading: true, error: null });
    try {
      const { authentication, isAuthenticated } = useAuthStore.getState();
      if (!isAuthenticated || !authentication) {
        throw new Error('Not authenticated');
      }
      const myProfile = await getUserProfile(authentication.userId);
      set({ myProfile });
    } catch (error) {
      console.error('useMyProfileStore.fetchMyProfile', error);
      set({ error: error as ErrorResponse });
    } finally {
      set({ isLoading: false });
    }
  },
  updateProfile: async (userId, request, imageFile) => {
    if (get().isLoading) return;

    set({ isLoading: true, error: null });
    try {
      const updatedProfile = await updateUserProfile(userId, request, imageFile);
      set({ myProfile: updatedProfile });
    } catch (error) {
      console.error('useProfileStore.updateProfile', error);
      set({ error: error as ErrorResponse });
    } finally {
      set({ isLoading: false });
    }
  },

  clear: () => {
    set({ myProfile: null, isLoading: false, error: null });
  },
}));

export default useMyProfileStore;
