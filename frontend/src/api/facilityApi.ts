import type { NearbyFacility } from "../types/Facility";
import type { NearbySearchParams } from "../types/Search";

export async function fetchNearbyFacilities(
  params: NearbySearchParams,
  signal?: AbortSignal,
): Promise<NearbyFacility[]> {
  const query = new URLSearchParams({
    longitude: String(params.longitude),
    latitude: String(params.latitude),
    radiusMeters: String(params.radiusMeters),
    referenceDate: params.referenceDate,
  });
  const response = await fetch(`/api/facilities/nearby?${query.toString()}`, {
    signal,
  });

  if (!response.ok) {
    throw new Error(`시설 검색 실패: HTTP ${response.status}`);
  }

  const data = await response.json();

  if (
    !Array.isArray(data) ||
    data.some(
      (facility) =>
        !facility ||
        typeof facility.id !== "number" ||
        typeof facility.longitude !== "number" ||
        typeof facility.latitude !== "number" ||
        !Number.isFinite(facility.distanceMeters),
    )
  ) {
    throw new Error("시설 검색 응답 형식이 올바르지 않습니다.");
  }
  return data;
}
