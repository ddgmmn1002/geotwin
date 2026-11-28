import type { NearbyFacility } from "../types/Facility";
import { Facility_TYPE_NAMES } from "../constants/facilityType";

type FacilityDetailProps = {
  facility: NearbyFacility | undefined;
};

export function FacilityDetail({ facility }: FacilityDetailProps) {
  if (!facility) {
    return (
      <aside>
        <h2>시설 상세 정보</h2>
        <p>시설을 선택해 주세요.</p>
      </aside>
    );
  }

  return (
    <aside>
      <h2>시설 상세 정보</h2>

      <p>시설 ID: {facility.id}</p>
      <p>시설 번호: {facility.facilityNo}</p>

      <p>
        시설 유형: {Facility_TYPE_NAMES[facility.facilityType] ?? "알 수 없음"}
      </p>

      <p>도로명 주소: {facility.roadAddress}</p>
      <p>경도: {facility.longitude}</p>
      <p>위도: {facility.latitude}</p>

      <p>기준점으로부터 거리: {facility.distanceMeters.toFixed(1)}m</p>

      <p>사용 가능 여부: {facility.availability ?? "정보 없음"}</p>

      <p>데이터 기준일: {facility.referenceDate}</p>
    </aside>
  );
}
