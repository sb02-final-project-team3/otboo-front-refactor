import { type ErrorResponse } from 'react-router';
import { create } from 'zustand';
import { getAccessToken, getCsrfToken, refreshToken, signIn, signOut } from '../api/auth';
import { type UserRole } from '../types/common';

interface JwtPayload {
  exp: number;
  sub: string;
  userId: string;
  email: string;
  name: string;
  role: UserRole;
}

const parseAccessToken = (token: string): JwtPayload => {
  const base64Url = token.split('.')[1];
  const base64 = base64Url.replace(/-/g, '+').replace(/_/g, '/');
  const jsonPayload = decodeURIComponent(
    atob(base64)
      .split('')
      .map(function (c) {
        return '%' + ('00' + c.charCodeAt(0).toString(16)).slice(-2);
      })
      .join(''),
  );

  return JSON.parse(jsonPayload);
};

interface Authentication {
  userId: string;
  email: string;
  name: string;
  role: UserRole;
  accessToken: string;
}

interface Store {
  authentication: Authentication | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  error: ErrorResponse | null;
  signIn: (email: string, password: string) => Promise<void>;
  signOut: () => Promise<void>;
  fetchMe: () => Promise<void>;
  fetchRefreshToken: (callback?: (accessToken: string) => Promise<void>) => Promise<void>;
  fetchCsrfToken: () => Promise<void>;
  clear: () => void;
  clearError: () => void;
}

const useAuthStore = create<Store>((set, get) => ({
  authentication: null,
  isAuthenticated: false,
  isLoading: false,
  error: null,
  signIn: async (email: string, password: string) => {
    if (get().isLoading) return;

    set({ isLoading: true, error: null });
    try {
      const accessToken = await signIn({ email, password });
      const { userId, email: emailFromToken, name, role } = parseAccessToken(accessToken);
      set({
        isAuthenticated: true,
        authentication: {
          userId,
          email: emailFromToken,
          name,
          role,
          accessToken,
        },
      });
    } catch (error) {
      console.error('useAuthStore.signIn', error);
      set({ error: error as ErrorResponse });
    } finally {
      set({ isLoading: false });
    }
  },
  signOut: async () => {
    if (get().isLoading) return;

    set({ isLoading: true, error: null });
    try {
      await signOut();
      set({ isAuthenticated: false, authentication: null });
    } catch (error) {
      console.error('useAuthStore.signIn', error);
      set({ error: error as ErrorResponse });
    } finally {
      set({ isLoading: false });
    }
  },
  fetchMe: async () => {
    set({ error: null });
    try {
      const accessToken = await getAccessToken();
      const { userId, email: emailFromToken, name, role } = parseAccessToken(accessToken);
      set({
        isAuthenticated: true,
        authentication: {
          userId,
          email: emailFromToken,
          name,
          role,
          accessToken,
        },
      });
    } catch (error) {
      set({ isAuthenticated: false, authentication: null });
      throw error;
    }
  },
  fetchRefreshToken: async (callback?: (accessToken: string) => Promise<void>) => {
    if (get().isLoading) return;

    set({ isLoading: true, error: null });
    try {
      const accessToken = await refreshToken();
      const { userId, email: emailFromToken, name, role } = parseAccessToken(accessToken);
      set({
        isAuthenticated: true,
        authentication: {
          userId,
          email: emailFromToken,
          name,
          role,
          accessToken,
        },
      });
      set({ isLoading: false });
      if (callback) {
        await callback(accessToken);
      }
    } catch (error) {
      console.error('useAuthStore.fetchRefreshToken', error);
      set({ error: error as ErrorResponse, isAuthenticated: false, authentication: null, isLoading: false });
      throw error;
    }
  },
  fetchCsrfToken: async () => {
    try {
      await getCsrfToken();
    } catch (error) {
      console.error('useAuthStore.fetchCsrfToken', error);
    }
  },
  clear: () => {
    set({ isAuthenticated: false, authentication: null, isLoading: false, error: null });
  },
  clearError: () => {
    set({ error: null });
  },
}));

export default useAuthStore;
