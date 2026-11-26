import {
  Viewer,
  Cartesian3,
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
import { mockFacilities } from "../datas/mockFacilities";
import "cesium/Build/Cesium/Widgets/widgets.css";

type CesiumMapProps = {
  onSelect: (facilityId: number) => void;
};

const INITIAL_CAMERA = {
  longitude: 126.97842,
  latitude: 37.56669,
  height: 3000,
};

export function CesiumMap({ onSelect }: CesiumMapProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  useEffect(() => {
    if (!containerRef.current) return;

    Ion.defaultAccessToken = import.meta.env.VITE_CESIUM_ION_TOKEN;
    const viewer = new Viewer(containerRef.current, {
      baseLayerPicker: false,
      geocoder: false,
      animation: false,
      timeline: false,
      terrain: Terrain.fromWorldTerrain(),
    });
    viewer.scene.debugShowFramesPerSecond = import.meta.env.DEV;

    viewer.camera.setView({
      destination: Cartesian3.fromDegrees(
        INITIAL_CAMERA.longitude,
        INITIAL_CAMERA.latitude,
        INITIAL_CAMERA.height,
      ),
      orientation: {
        heading: 0,
        pitch: CesiumMath.toRadians(-90),
        roll: 0,
      },
    });

    mockFacilities.forEach((facility) => {
      viewer.entities.add({
        id: String(facility.id),
        position: Cartesian3.fromDegrees(facility.longitude, facility.latitude),
        point: {
          pixelSize: 12,
          color: Color.RED,
          heightReference: HeightReference.CLAMP_TO_GROUND,
        },
      });
    });

    const handler = new ScreenSpaceEventHandler(viewer.scene.canvas);
    handler.setInputAction(
      (movement: ScreenSpaceEventHandler.PositionedEvent) => {
        const pickedObject = viewer.scene.pick(movement.position);
        if (pickedObject?.id instanceof Entity) {
          const selectedFacility = mockFacilities.find(
            (facility) => pickedObject.id.id === String(facility.id),
          );
          if (selectedFacility) {
            onSelect(selectedFacility.id);
          }
        }
      },
      ScreenSpaceEventType.LEFT_CLICK,
    );

    let cancelled = false;
    async function loadBuildings() {
      try {
        const tileset = await createOsmBuildingsAsync();
        if (cancelled) {
          tileset.destroy();
          return;
        }
        viewer.scene.primitives.add(tileset);
      } catch (error) {
        if (!cancelled) {
          console.error("3D 건물 로딩 실패", error);
        }
      }
    }
    void loadBuildings();

    return () => {
      cancelled = true;
      handler.destroy();
      viewer.destroy();
    };
  }, [onSelect]);

  return <div ref={containerRef} className="map-container" />;
}
