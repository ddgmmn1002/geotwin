import { Facility_TYPE_NAMES } from "../constants/facilityType";
import type { Facility } from "../types/Facility";

type FacilityListProps = {
  facilities: Facility[];
  selectedFacilityId: number | null;
  onSelect: (facilityId: number) => void;
};

export function FacilityList({
  facilities,
  selectedFacilityId,
  onSelect,
}: FacilityListProps) {
  return (
    <aside className="facility-list">
      <h2>시설 목록</h2>
      {facilities.map((facility) => (
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
            {Facility_TYPE_NAMES[facility.facilityType] ?? "알 수 없음"}
          </strong>
          <p>{facility.facilityNo}</p>
          <p>{facility.roadAddress}</p>
        </button>
      ))}
    </aside>
  );
}
