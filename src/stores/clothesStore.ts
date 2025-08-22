import { create } from 'zustand';
import type { ErrorResponse } from '../types/common';
import type {
  ClothesCreateRequest,
  ClothesCursorRequest,
  ClothesDto,
  ClothesType,
  ClothesUpdateRequest,
} from '../types/clothes';
import { createClothes, deleteClothes, getClothes, updateClothes } from '../api/clothes';

interface Store {
  clothesList: ClothesDto[];
  isLoading: boolean;
  error: ErrorResponse | null;
  params: ClothesCursorRequest;
  hasNext: boolean;
  totalCount: number;

  fetchClothes: (subParams: { typeEqual?: ClothesType; ownerId: string }) => Promise<void>;
  fetchMore: () => Promise<void>;
  addClothes: (request: ClothesCreateRequest, imageFile?: File) => Promise<void>;
  updateClothes: (clothesId: string, request: ClothesUpdateRequest, imageFile?: File) => Promise<void>;
  deleteClothes: (clothesId: string) => Promise<void>;

  clear: () => void;
}

const initialParams: ClothesCursorRequest = {
  typeEqual: undefined,
  ownerId: '',
  cursor: undefined,
  idAfter: undefined,
  limit: 20,
};

const useClothesStore = create<Store>((set, get) => ({
  clothesList: [],
  isLoading: false,
  hasNext: false,
  error: null,
  params: initialParams,
  totalCount: 0,
  fetchClothes: async (subParams) => {
    if (get().isLoading) return;

    set({ isLoading: true, error: null });
    try {
      const mergedParams = { ...get().params, ...subParams };
      set({ params: mergedParams });

      const { data, nextCursor, nextIdAfter, hasNext, totalCount } = await getClothes(mergedParams);
      set((state) => ({
        clothesList: [...state.clothesList, ...data],
        params: {
          ...mergedParams,
          cursor: nextCursor ?? undefined,
          idAfter: nextIdAfter ?? undefined,
        },
        hasNext,
        totalCount,
      }));
    } catch (error) {
      console.error('useClothesStore.fetchClothes', error);
      set({ error: error as ErrorResponse });
    } finally {
      set({ isLoading: false });
    }
  },
  fetchMore: async () => {
    if (get().hasNext) {
      await get().fetchClothes({ ownerId: get().params.ownerId });
    }
  },
  addClothes: async (request: ClothesCreateRequest, imageFile?: File) => {
    if (get().isLoading) return;

    set({ isLoading: true, error: null });
    try {
      const clothes = await createClothes(request, imageFile);
      set((state) => ({ clothesList: [clothes, ...state.clothesList] }));
    } catch (error) {
      console.error('useClothesStore.addClothes', error);
      set({ error: error as ErrorResponse });
    } finally {
      set({ isLoading: false });
    }
  },
  updateClothes: async (clothesId: string, request: ClothesUpdateRequest, imageFile?: File) => {
    if (get().isLoading) return;

    set({ isLoading: true, error: null });
    try {
      const clothes = await updateClothes(clothesId, request, imageFile);
      set((state) => ({ clothesList: state.clothesList.map((c) => (c.id === clothes.id ? clothes : c)) }));
    } catch (error) {
      console.error('useClothesStore.updateClothes', error);
      set({ error: error as ErrorResponse });
    } finally {
      set({ isLoading: false });
    }
  },
  deleteClothes: async (clothesId: string) => {
    if (get().isLoading) return;

    set({ isLoading: true, error: null });
    try {
      await deleteClothes(clothesId);
      set((state) => ({ clothesList: state.clothesList.filter((c) => c.id !== clothesId) }));
    } catch (error) {
      console.error('useClothesStore.deleteClothes', error);
      set({ error: error as ErrorResponse });
    } finally {
      set({ isLoading: false });
    }
  },
  clear: () => {
    set({ clothesList: [], params: initialParams, error: null });
  },
}));

export default useClothesStore;
