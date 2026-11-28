import { useState, useEffect, useCallback } from "react";
import { FacilityList } from "./components/FacilityList";
import { FacilityDetail } from "./components/FacilityDetail";
import { CesiumMap } from "./components/CesiumMap";
import type {
  SearchCenter,
  SearchRadius,
  SearchResult,
  SearchCriteria,
} from "./types/Search";
import type { NearbyFacility } from "./types/Facility";
import { fetchNearbyFacilities } from "./api/facilityApi";

import "./styles/App.css";

const REFERENCE_DATE = "2025-12-31"; //검색 기준일 상수

const EMPTY_FACILITIES: NearbyFacility[] = []; //리렌더링마다 새로운 빈 배열 객체 생성을 할 수 있기 때문에 외부 고정 빈 배열 만들어둠.

function App() {
  const [criteria, setCriteria] = useState<SearchCriteria>({
    searchCenter: null,
    radiusMeters: 300,
  }); //검색 기준(기준점, 검색반경) 상태 관리
  const { searchCenter, radiusMeters } = criteria; //검색 기준 구조분해할당

  const [searchResult, setSearchResult] = useState<SearchResult | null>(null); //검색 결과 상태 관리

  const currentResult =
    searchResult?.criteria === criteria ? searchResult : null; //현재 검색 조건과 검색 결과에 있는 검색 조건이 같은지 확인하고 업데이트.
  const facilities = currentResult?.facilities ?? EMPTY_FACILITIES; //null이거나 undefined인지 확인하고 빈 배열로 바꿈.
  const isLoading = searchCenter !== null && currentResult === null; //현재 조건에 해당하는 결과 없으면 검색 중으로 판단
  const error = currentResult?.error ?? null; //

  //선택 시설 아이디 상태 관리
  const [selectedFacilityId, setSelectedFacilityId] = useState<number | null>(
    null,
  );
  const selectedFacility = facilities.find(
    (facility) => facility.id === selectedFacilityId,
  );

  const handleSearchCenterChange = useCallback((center: SearchCenter) => {
    setSelectedFacilityId(null);
    setCriteria((previous) => ({
      ...previous,
      searchCenter: center,
    })); //상태 변경을 직접 수정하지 않고 setter함수로 새로운 객체를 만들어 변경.
  }, []);
  //일반 함수로 작성하면 리렌더링 시마다 새로운 함수 객체가 생성될 수 있음. CesiumMap에서 함수를 참조하던 초기화 Effect가 의존성 변경을 감지해 다시 실행될 수 있음.

  // 검색 반경 변경
  function handleRadiusChange(radius: SearchRadius) {
    if (radius === radiusMeters) return;
    setSelectedFacilityId(null);
    setCriteria((previous) => ({
      ...previous,
      radiusMeters: radius,
    }));
  }

  // 검색 조건 변경 시 API 호출
  useEffect(() => {
    const { searchCenter, radiusMeters } = criteria;
    if (!searchCenter) return;
    const controller = new AbortController(); //비동기 작업에 취소 신호 전달을 위한 API
    async function searchFacilities(center: SearchCenter) {
      try {
        const data = await fetchNearbyFacilities(
          {
            longitude: center.longitude,
            latitude: center.latitude,
            radiusMeters,
            referenceDate: REFERENCE_DATE,
          },
          controller.signal,
        );
        if (controller.signal.aborted) return;
        setSearchResult({
          criteria,
          facilities: data,
          error: null,
        });
      } catch (error) {
        if (controller.signal.aborted) return;
        setSearchResult({
          criteria,
          facilities: [],
          error:
            error instanceof Error
              ? error.message
              : "시설 검색 중 오류가 발생했습니다.",
        });
      }
    }
    void searchFacilities(searchCenter);
    return () => {
      controller.abort();
    };
  }, [criteria]);

  return (
    <main className="app-layout">
      <FacilityList
        facilities={facilities}
        selectedFacilityId={selectedFacilityId}
        onSelect={setSelectedFacilityId}
        hasSearchCenter={searchCenter !== null}
        isLoading={isLoading}
        error={error}
      />
      <CesiumMap
        facilities={facilities}
        onSelect={setSelectedFacilityId}
        searchCenter={searchCenter}
        onSearchCenterChange={handleSearchCenterChange}
        radiusMeters={radiusMeters}
        onRadiusChange={handleRadiusChange}
      />
      <FacilityDetail facility={selectedFacility} />
    </main>
  );
}

export default App;
