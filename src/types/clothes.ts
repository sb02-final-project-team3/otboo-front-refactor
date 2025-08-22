import type { ClothesAttributeWithDefDto, CursorRequest, SortableCursorRequest } from './common';

export interface ClothesCursorRequest extends CursorRequest {
  typeEqual?: ClothesType;
  ownerId: string;
}

// 의상 속성
export interface ClothesAttributeDto {
  definitionId: string;
  value: string;
}

// 옷 등록 요청
export interface ClothesCreateRequest {
  ownerId: string;
  name: string;
  type: ClothesType;
  attributes: ClothesAttributeDto[];
}

// 옷 수정 요청
export interface ClothesUpdateRequest {
  name?: string;
  type?: ClothesType;
  attributes?: ClothesAttributeDto[];
}

// 옷 타입
export type ClothesType =
  | 'TOP'
  | 'BOTTOM'
  | 'DRESS'
  | 'OUTER'
  | 'UNDERWEAR'
  | 'ACCESSORY'
  | 'SHOES'
  | 'SOCKS'
  | 'HAT'
  | 'BAG'
  | 'SCARF'
  | 'ETC';

export const ClothesTypeLabel: Record<ClothesType, string> = {
  TOP: '상의',
  BOTTOM: '하의',
  DRESS: '원피스',
  OUTER: '아우터',
  UNDERWEAR: '속옷',
  ACCESSORY: '액세서리',
  SHOES: '신발',
  SOCKS: '양말',
  HAT: '모자',
  BAG: '가방',
  SCARF: '스카프',
  ETC: '기타',
};

// 옷 응답 DTO
export interface ClothesDto {
  id: string;
  ownerId: string;
  name: string;
  imageUrl?: string;
  type: ClothesType;
  attributes: ClothesAttributeWithDefDto[];
}

// 의상 속성 정의 등록 요청
export interface ClothesAttributeDefCreateRequest {
  name: string;
  selectableValues: string[];
}

// 의상 속성 정의 수정 요청
export interface ClothesAttributeDefUpdateRequest {
  name: string;
  selectableValues: string[];
}
// 의상 속성 정의 응답 DTO
export interface ClothesAttributeDefDto {
  id: string;
  name: string;
  selectableValues: string[];
}

export interface ClothesAttributeDefCursorRequest extends SortableCursorRequest {
  keywordLike?: string;
}
