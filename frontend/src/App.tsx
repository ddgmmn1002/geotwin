import { useState } from "react";
import { FacilityList } from "./components/FacilityList";
import { FacilityDetail } from "./components/FacilityDetail";
import { CesiumMap } from "./components/CesiumMap";

import "./styles/App.css";
import { mockFacilities } from "./datas/mockFacilities";

function App() {
  const [selectedFacilityId, setSelectedFacilityId] = useState<number | null>(
    null,
  );
  const selectedFacility = mockFacilities.find(
    (facility) => selectedFacilityId === facility.id,
  );

  return (
    <main className="app-layout">
      <FacilityList
        facilities={mockFacilities}
        selectedFacilityId={selectedFacilityId}
        onSelect={setSelectedFacilityId}
      />
      <CesiumMap onSelect={setSelectedFacilityId} />
      <FacilityDetail facility={selectedFacility} />
    </main>
  );
}

export default App;
