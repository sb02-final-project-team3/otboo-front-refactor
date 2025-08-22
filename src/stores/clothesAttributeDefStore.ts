import { create } from 'zustand';
import type {
  ClothesAttributeDefCreateRequest,
  ClothesAttributeDefCursorRequest,
  ClothesAttributeDefDto,
  ClothesAttributeDefUpdateRequest,
} from '../types/clothes';
import type { ErrorResponse } from '../types/common';
import {
  createClothesAttributeDef,
  deleteClothesAttributeDef,
  getClothesAttributeDefs,
  updateClothesAttributeDef,
} from '../api/clothes';

interface Store {
  attributeDefinitions: ClothesAttributeDefDto[];
  isLoading: boolean;
  error: ErrorResponse | null;
  params: ClothesAttributeDefCursorRequest;
  hasNext: boolean;
  totalCount: number;
  fetchClothesAttributeDefs: (subParams?: { keywordLike?: string }) => Promise<void>;
  fetchMore: () => Promise<void>;
  addClothesAttributeDef: (request: ClothesAttributeDefCreateRequest) => Promise<void>;
  updateClothesAttributeDef: (definitionId: string, request: ClothesAttributeDefUpdateRequest) => Promise<void>;
  deleteClothesAttributeDef: (definitionId: string) => Promise<void>;

  clear: () => void;
}

const initialParams: ClothesAttributeDefCursorRequest = {
  keywordLike: undefined,
  cursor: undefined,
  idAfter: undefined,
  sortBy: 'name',
  sortDirection: 'ASCENDING',
  limit: 50,
};

const useClothesAttributeDefinitionStore = create<Store>((set, get) => ({
  attributeDefinitions: [],
  isLoading: false,
  hasNext: false,
  error: null,
  params: initialParams,
  totalCount: 0,
  fetchClothesAttributeDefs: async (subParams) => {
    if (get().isLoading) return;

    set({ isLoading: true, error: null });
    try {
      const mergedParams = { ...get().params, ...subParams };
      if (subParams) set({ params: mergedParams });

      const { data, nextCursor, nextIdAfter, hasNext, totalCount } = await getClothesAttributeDefs(mergedParams);
      set((state) => ({
        attributeDefinitions: [...state.attributeDefinitions, ...data],
        params: {
          ...mergedParams,
          cursor: nextCursor ?? undefined,
          idAfter: nextIdAfter ?? undefined,
        },
        hasNext,
        totalCount,
      }));
    } catch (error) {
      console.error('useClothesAttributeDefinitionStore.fetchClothesAttributeDefs', error);
      set({ error: error as ErrorResponse });
    } finally {
      set({ isLoading: false });
    }
  },
  fetchMore: async () => {
    if (get().hasNext) {
      await get().fetchClothesAttributeDefs();
    }
  },
  addClothesAttributeDef: async (request: ClothesAttributeDefCreateRequest) => {
    if (get().isLoading) return;

    set({ isLoading: true, error: null });
    try {
      const attributeDef = await createClothesAttributeDef(request);
      set((state) => ({ attributeDefinitions: [...state.attributeDefinitions, attributeDef] }));
    } catch (error) {
      console.error('useClothesAttributeDefinitionStore.addClothesAttributeDef', error);
      set({ error: error as ErrorResponse });
    } finally {
      set({ isLoading: false });
    }
  },
  updateClothesAttributeDef: async (definitionId: string, request: ClothesAttributeDefUpdateRequest) => {
    if (get().isLoading) return;

    set({ isLoading: true, error: null });
    try {
      const attributeDef = await updateClothesAttributeDef(definitionId, request);
      set((state) => ({
        attributeDefinitions: state.attributeDefinitions.map((def) => (def.id === definitionId ? attributeDef : def)),
      }));
    } catch (error) {
      console.error('useClothesAttributeDefinitionStore.updateClothesAttributeDef', error);
      set({ error: error as ErrorResponse });
    } finally {
      set({ isLoading: false });
    }
  },
  deleteClothesAttributeDef: async (definitionId: string) => {
    if (get().isLoading) return;

    set({ isLoading: true, error: null });
    try {
      await deleteClothesAttributeDef(definitionId);
      set((state) => ({ attributeDefinitions: state.attributeDefinitions.filter((def) => def.id !== definitionId) }));
    } catch (error) {
      console.error('useClothesAttributeDefinitionStore.deleteClothesAttributeDef', error);
      set({ error: error as ErrorResponse });
    } finally {
      set({ isLoading: false });
    }
  },
  clear: () => {
    set({ attributeDefinitions: [], params: initialParams, error: null });
  },
}));

export default useClothesAttributeDefinitionStore;
