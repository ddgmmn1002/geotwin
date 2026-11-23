package com.geotwin.backend.mapper;

import com.geotwin.backend.dto.FacilityResponse;
import com.geotwin.backend.entity.Facility;
import org.springframework.stereotype.Component;

@Component
public class FacilityMapper {
    public FacilityResponse toResponse(Facility facility) {
        return new FacilityResponse(
                facility.getId(),
                facility.getFacilityNo(),
                facility.getFacilityType(),
                facility.getRoadAddress(),
                facility.getLotAddress(),
                facility.getLatitude(),
                facility.getLongitude(),
                facility.getAvailability(),
                facility.getReferenceDate()
        );
    }
}
