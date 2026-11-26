import type { Facility } from "../types/Facility";
import { Facility_TYPE_NAMES } from "../constants/facilityType";

type FacilityDetailProps = { facility: Facility | undefined };

export function FacilityDetail({ facility }: FacilityDetailProps) {
  if (!facility) {
    return (
      <aside>
        <h2>시설 상제 정보</h2>
        <p>시설을 선택해 주세요.</p>
      </aside>
    );
  } else {
    return (
      <aside>
        <h2>시설상세 정보</h2>
        <p>시설ID: {facility.id}</p>
        <p>시설 번호: {facility.facilityNo}</p>
        <p>
          시설 유형:{" "}
          {Facility_TYPE_NAMES[facility.facilityType] ?? "알 수 없음"}
        </p>
        <p>도로명 주소: {facility.roadAddress}</p>
        <p>경도: {facility.longitude}</p>
        <p>위도: {facility.latitude}</p>
        <p>사용 가능 여부: {facility.availability ?? "정보 없음"}</p>
        <p>데이터 기준일: {facility.referenceDate}</p>
      </aside>
    );
  }
}
