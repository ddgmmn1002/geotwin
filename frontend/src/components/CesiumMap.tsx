import {
  Viewer,
  Cartesian3,
  Cartographic,
  Math as CesiumMath,
  Ion,
  createOsmBuildingsAsync,
  Terrain,
  Color,
  HeightReference,
  ScreenSpaceEventHandler,
  ScreenSpaceEventType,
  Entity,
} from "cesium";
import { useRef, useEffect } from "react";
import "cesium/Build/Cesium/Widgets/widgets.css";
import type { SearchCenter, SearchRadius } from "../types/Search";
import type { Facility } from "../types/Facility";

type CesiumMapProps = {
  facilities: Facility[];
  onSelect: (facilityId: number) => void;
  searchCenter: SearchCenter | null;
  onSearchCenterChange: (center: SearchCenter) => void;
  radiusMeters: SearchRadius;
  onRadiusChange: (radius: SearchRadius) => void;
};
//컴포넌트 매개변수 지정 타입

const INITIAL_CAMERA = {
  longitude: 126.97842,
  latitude: 37.56669,
  height: 3000,
};
//초기 카메라 위치 상수(경도, 위도, 높이)

const SEARCH_ENTITY_ID = "search-area";
const FACILITY_ENTITY_PREFIX = "facility:";
// 시설마커ID 접두어

export function CesiumMap({
  facilities,
  onSelect,
  searchCenter,
  onSearchCenterChange,
  radiusMeters,
  onRadiusChange,
}: CesiumMapProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  const viewerRef = useRef<Viewer | null>(null);
  //세슘, 뷰어 생성할 html

  // 1. Viewer 초기화
  useEffect(() => {
    if (!containerRef.current) return;
    //세슘 생성할 컨테이너html 있는지 확인

    Ion.defaultAccessToken = import.meta.env.VITE_CESIUM_ION_TOKEN;
    //환경변수 대신 토큰 사용할 방법 찾기. (브라우저에 노출될 위험이 있음.)

    const viewer = new Viewer(containerRef.current, {
      baseLayerPicker: false, //베이스맵 선택 UI 제거
      geocoder: false, //주소검색 UI 제거
      animation: false, //시간 애니메이션 위젯 제거
      timeline: false, //타임라인 제거
      terrain: Terrain.fromWorldTerrain(), //Terrain 객체 생성.
    });
    //뷰어 인스턴스 생성.지도가 표시될 html과 초기 설정 객체를 전달하여 인스턴스 생성

    viewerRef.current = viewer;

    viewer.scene.debugShowFramesPerSecond = import.meta.env.DEV;
    //개발 모드에서FPS 표시

    viewer.camera.setView({
      destination: Cartesian3.fromDegrees(
        INITIAL_CAMERA.longitude,
        INITIAL_CAMERA.latitude,
        INITIAL_CAMERA.height,
      ), //카메라 위치 설정
      orientation: {
        heading: 0,
        pitch: CesiumMath.toRadians(-90),
        roll: 0,
      }, //카메라 각도 설정
    });

    const handler = new ScreenSpaceEventHandler(viewer.scene.canvas);
    //마우스클릭 이벤트를 처리하는 객체를 cesium canvas에 생성.
    handler.setInputAction(
      (movement: ScreenSpaceEventHandler.PositionedEvent) => {
        const pickedObjects = viewer.scene.drillPick(movement.position);

        const facilityEntity = pickedObjects
          .map((picked) => picked.id)
          .find(
            (id): id is Entity =>
              id instanceof Entity && id.id.startsWith(FACILITY_ENTITY_PREFIX),
          );

        // 시설 마커 클릭
        if (facilityEntity) {
          const facilityId = Number(
            facilityEntity.id.slice(FACILITY_ENTITY_PREFIX.length),
          );

          onSelect(facilityId);
          return;
        }

        // 일반 지도 클릭
        const ray = viewer.camera.getPickRay(movement.position);
        if (!ray) return;
        const position = viewer.scene.globe.pick(ray, viewer.scene);
        if (!position) return;
        const cartographic = Cartographic.fromCartesian(position);
        if (!cartographic) return;

        const center: SearchCenter = {
          longitude: CesiumMath.toDegrees(cartographic.longitude),
          latitude: CesiumMath.toDegrees(cartographic.latitude),
        };

        onSearchCenterChange(center);
      },
      ScreenSpaceEventType.LEFT_CLICK,
    );

    let cancelled = false;
    async function loadBuildings() {
      try {
        const tileset = await createOsmBuildingsAsync();
        //건물 타일 셋을 추가하기 전에 뷰어 확인
        if (cancelled) {
          tileset.destroy();
          return;
        }
        viewer.scene.primitives.add(tileset); //뷰어에 렌더링 객체 추가
      } catch (error) {
        //예외 처리
        if (!cancelled) {
          console.error("3D 건물 로딩 실패", error);
        }
      }
    }
    void loadBuildings();
    //비동기 건물 로딩.

    //클린업 함수 실행. 지도 리소스를 정리.
    return () => {
      cancelled = true;
      handler.destroy();
      viewer.destroy();
      viewerRef.current = null;
    };
  }, [onSelect, onSearchCenterChange]);

  // 2. 검색 기준점 및 반경 갱신
  useEffect(() => {
    const viewer = viewerRef.current;
    if (!viewer || viewer.isDestroyed()) return;
    //뷰어 객체 확인

    viewer.entities.removeById(SEARCH_ENTITY_ID);
    //기존 검색 영역 고정ID (상수)로 제거
    if (!searchCenter) return;

    viewer.entities.add({
      id: SEARCH_ENTITY_ID,

      position: Cartesian3.fromDegrees(
        searchCenter.longitude,
        searchCenter.latitude,
      ),

      point: {
        pixelSize: 14,
        color: Color.DODGERBLUE,
        outlineColor: Color.WHITE,
        outlineWidth: 2,
        heightReference: HeightReference.CLAMP_TO_GROUND,
      },
      //선택 지점 포인트 만들기

      ellipse: {
        semiMajorAxis: radiusMeters,
        semiMinorAxis: radiusMeters,
        material: Color.DODGERBLUE.withAlpha(0.2),
        //불투명도 0.2
        height: 0,
        heightReference: HeightReference.CLAMP_TO_GROUND,
        // heightReference로 지형에 대한 높이 적용 방식 지정.
      },
      //선택 반경 타원 만들기.
    });
  }, [searchCenter, radiusMeters]);

  // 3. 검색 결과 시설 마커 갱신
  useEffect(() => {
    const viewer = viewerRef.current;

    if (!viewer || viewer.isDestroyed()) return;

    // 기존 시설 마커만 제거
    const previousEntities = viewer.entities.values.filter((entity) =>
      entity.id.startsWith(FACILITY_ENTITY_PREFIX),
    );

    previousEntities.forEach((entity) => {
      viewer.entities.remove(entity);
    });

    // 새로운 검색 결과 마커 생성
    facilities.forEach((facility) => {
      viewer.entities.add({
        id: `${FACILITY_ENTITY_PREFIX}${facility.id}`,
        position: Cartesian3.fromDegrees(facility.longitude, facility.latitude),
        point: {
          pixelSize: 12,
          color: Color.RED,
          outlineColor: Color.WHITE,
          outlineWidth: 2,
          heightReference: HeightReference.CLAMP_TO_GROUND,
        },
      });
    });
  }, [facilities]);

  return (
    <div className="map-container" style={{ position: "relative" }}>
      <div ref={containerRef} style={{ position: "absolute", inset: 0 }} />
      <div className="search-controls">
        <span>검색 반경</span>
        <button
          type="button"
          className={radiusMeters === 300 ? "active" : ""}
          onClick={() => onRadiusChange(300)}
        >
          300m
        </button>
        <button
          type="button"
          className={radiusMeters === 500 ? "active" : ""}
          onClick={() => onRadiusChange(500)}
        >
          500m
        </button>
        {searchCenter && (
          <div className="search-coordinates">
            경도: {searchCenter.longitude.toFixed(6)}
            <br />
            위도: {searchCenter.latitude.toFixed(6)}
          </div>
          //소수점 아래 6자리까지 반올림해서 반환.
        )}
      </div>
    </div>
  );
}
