import { create } from 'zustand';
import type { UserDto, UserListRequest } from '../types/users';
import type { ErrorResponse, UserRole } from '../types/common';
import { getUsers } from '../api/users';

interface Store {
  users: UserDto[];
  isLoading: boolean;
  error: ErrorResponse | null;
  params: UserListRequest;
  hasNext: boolean;
  totalCount: number;
  fetchUsers: (subParams?: {
    emailLike?: string;
    roleEqual?: UserRole;
    locked?: boolean;
    sortBy?: string;
    sortDirection?: 'ASCENDING' | 'DESCENDING';
  }) => Promise<void>;
  fetchMore: () => Promise<void>;
  clear: () => void;
}

const initialParams: UserListRequest = {
  emailLike: undefined,
  roleEqual: undefined,
  locked: undefined,
  sortBy: 'email',
  sortDirection: 'ASCENDING',
  cursor: undefined,
  idAfter: undefined,
  limit: 20,
};

const useUserStore = create<Store>((set, get) => ({
  users: [],
  isLoading: false,
  error: null,
  params: initialParams,
  hasNext: false,
  totalCount: 0,
  fetchUsers: async (subParams) => {
    if (get().isLoading) return;

    set({ isLoading: true, error: null });
    try {
      const mergedParams = { ...get().params, ...subParams };
      if (subParams) set({ params: mergedParams });

      const { data, nextCursor, nextIdAfter, hasNext, totalCount } = await getUsers(mergedParams);
      set((state) => ({
        users: [...state.users, ...data],
        params: {
          ...mergedParams,
          cursor: nextCursor ?? undefined,
          idAfter: nextIdAfter ?? undefined,
        },
        hasNext,
        totalCount,
      }));
    } catch (error) {
      console.error('useUserStore.fetchUsers', error);
      set({ error: error as ErrorResponse });
    } finally {
      set({ isLoading: false });
    }
  },
  fetchMore: async () => {
    if (get().hasNext) {
      await get().fetchUsers();
    }
  },
  clear: () => {
    set({ users: [], isLoading: false, error: null, params: initialParams, hasNext: false });
  },
}));

export default useUserStore;
