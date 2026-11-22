import 'cesium/Build/Cesium/Widgets/widgets.css';
import { Viewer, Cartesian3, Math as CesiumMath, Ion, createOsmBuildingsAsync, Terrain } from "cesium";
import { useEffect, useRef } from "react";
import { FacilityList } from './components/FacilityList';
import { FacilityDetail } from './components/FacilityDetail';
import "./style/App.css";

function App() {
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!containerRef.current) return;

    Ion.defaultAccessToken = import.meta.env.VITE_CESIUM_ION_TOKEN;
    const viewer = new Viewer(containerRef.current, {
      baseLayerPicker: false,
      geocoder: false,
      animation: false,
      timeline: false,
      terrain: Terrain.fromWorldTerrain()
    });
    viewer.scene.debugShowFramesPerSecond = true;

    viewer.camera.setView({
      destination: Cartesian3.fromDegrees(126.97842, 37.56669, 3000),
      orientation: {
        heading: 0,
        pitch: CesiumMath.toRadians(-90),
        roll: 0
      }
    });

    let cancelled = false;

    async function loadBuildings() {
      try {
        const tileset = await createOsmBuildingsAsync();
        if(cancelled){
          tileset.destroy();
          return;
        }
        viewer.scene.primitives.add(tileset);
      } catch (error) {
        if(!cancelled) {
          console.error('3D 건물 로딩 실패,', error);
        }
      }
    }
    void loadBuildings();

    return () => {
      cancelled = true;
      viewer.destroy();
    }
  }, [])

  return (
    <main className='app-layout'>
      <FacilityList/>
      <div ref={containerRef} className='map-container'/>
      <FacilityDetail/>
    </main>
  )
}

export default App

