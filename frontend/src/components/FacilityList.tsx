import { Facility_TYPE_NAMES } from "../constants/facilityType";
import type { NearbyFacility } from "../types/Facility";

type FacilityListProps = {
  facilities: NearbyFacility[];
  selectedFacilityId: number | null;
  onSelect: (facilityId: number) => void;
  hasSearchCenter: boolean;
  isLoading: boolean;
  error: string | null;
};

export function FacilityList({
  facilities,
  selectedFacilityId,
  onSelect,
  hasSearchCenter,
  isLoading,
  error,
}: FacilityListProps) {
  return (
    <aside className="facility-list">
      <h2>주변 소방용수시설</h2>

      {!hasSearchCenter && <p>지도에서 검색 기준점을 선택해 주세요.</p>}

      {isLoading && <p role="status">주변 시설을 검색하고 있습니다.</p>}

      {error && <p role="alert">{error}</p>}

      {hasSearchCenter && !isLoading && !error && facilities.length === 0 && (
        <p>검색 반경 내 시설이 없습니다.</p>
      )}

      {!isLoading && !error && facilities.length > 0 && (
        <p>검색 결과: {facilities.length}건</p>
      )}

      {facilities.map((facility, index) => (
        <button
          key={facility.id}
          type="button"
          className={
            facility.id === selectedFacilityId
              ? "facility-item selected"
              : "facility-item"
          }
          onClick={() => onSelect(facility.id)}
        >
          <strong>
            {index + 1}.{" "}
            {Facility_TYPE_NAMES[facility.facilityType] ?? "알 수 없음"}
          </strong>

          <p>{facility.facilityNo}</p>
          <p>{facility.roadAddress}</p>
          <p>기준점으로부터 {facility.distanceMeters.toFixed(1)}m</p>
        </button>
      ))}
    </aside>
  );
}
