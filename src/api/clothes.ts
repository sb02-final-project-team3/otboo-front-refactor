import apiClient from './axiosClient';
import type {
  ClothesDto,
  ClothesCreateRequest,
  ClothesUpdateRequest,
  ClothesAttributeDefDto,
  ClothesAttributeDefCreateRequest,
  ClothesAttributeDefUpdateRequest,
  ClothesCursorRequest,
  ClothesAttributeDefCursorRequest,
} from '../types/clothes';
import type { CursorResponse } from '../types/common';

// 옷 목록 조회
export const getClothes = async (params: ClothesCursorRequest) => {
  const response = await apiClient.get<CursorResponse<ClothesDto>>('/api/clothes', { params });
  return response.data;
};

// 옷 등록
export const createClothes = async (data: ClothesCreateRequest, imageFile?: File): Promise<ClothesDto> => {
  // 이미지가 있을 경우 multipart/form-data, 없으면 json
  const formData = new FormData();
  formData.append('request', new Blob([JSON.stringify(data)], { type: 'application/json' }));
  if (imageFile) {
    formData.append('image', imageFile);
  }
  const response = await apiClient.post<ClothesDto>('/api/clothes', formData, {
    headers: { 'Content-Type': 'multipart/form-data' },
  });
  return response.data;
};

// 옷 수정
export const updateClothes = async (
  clothesId: string,
  data: ClothesUpdateRequest,
  imageFile?: File,
): Promise<ClothesDto> => {
  const formData = new FormData();
  formData.append('request', new Blob([JSON.stringify(data)], { type: 'application/json' }));
  if (imageFile) {
    formData.append('image', imageFile);
  }
  const response = await apiClient.patch<ClothesDto>(`/api/clothes/${clothesId}`, formData, {
    headers: { 'Content-Type': 'multipart/form-data' },
  });
  return response.data;
};

// 옷 삭제
export const deleteClothes = async (clothesId: string): Promise<void> => {
  await apiClient.delete(`/api/clothes/${clothesId}`);
};

// 의상 속성 정의 목록 조회
export const getClothesAttributeDefs = async (params: ClothesAttributeDefCursorRequest) => {
  const response = await apiClient.get<CursorResponse<ClothesAttributeDefDto>>('/api/clothes/attribute-defs', {
    params,
  });
  return response.data;
};

// 의상 속성 정의 등록
export const createClothesAttributeDef = async (
  data: ClothesAttributeDefCreateRequest,
): Promise<ClothesAttributeDefDto> => {
  const response = await apiClient.post<ClothesAttributeDefDto>('/api/clothes/attribute-defs', data);
  return response.data;
};

// 의상 속성 정의 수정
export const updateClothesAttributeDef = async (
  definitionId: string,
  data: ClothesAttributeDefUpdateRequest,
): Promise<ClothesAttributeDefDto> => {
  const response = await apiClient.patch<ClothesAttributeDefDto>(`/api/clothes/attribute-defs/${definitionId}`, data);
  return response.data;
};

// 의상 속성 정의 삭제
export const deleteClothesAttributeDef = async (definitionId: string): Promise<void> => {
  await apiClient.delete(`/api/clothes/attribute-defs/${definitionId}`);
};

export const getClothesByUrl = async (url: string): Promise<ClothesDto> => {
  const response = await apiClient.get<ClothesDto>(`/api/clothes/extractions`, { params: { url } });
  return response.data;
};
