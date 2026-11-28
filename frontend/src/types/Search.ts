import type { NearbyFacility } from "./Facility";

export type SearchCenter = {
  longitude: number;
  latitude: number;
};
//선택한 지점 좌표 타입
export type SearchRadius = 300 | 500;
//검색반경 타입

export type NearbySearchParams = SearchCenter & {
  radiusMeters: SearchRadius;
  referenceDate: string;
};

export type SearchCriteria = {
  searchCenter: SearchCenter | null;
  radiusMeters: SearchRadius;
};

export type SearchResult = {
  criteria: SearchCriteria;
  facilities: NearbyFacility[];
  error: string | null;
};
