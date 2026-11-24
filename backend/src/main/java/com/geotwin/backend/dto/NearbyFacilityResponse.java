package com.geotwin.backend.dto;

import com.geotwin.backend.projection.NearbyFacilityProjection;

import java.time.LocalDate;

public record NearbyFacilityResponse (
        Long id,
        String facilityNo,
        String facilityType,
        String roadAddress,
        String lotAddress,
        Double latitude,
        Double longitude,
        String availability,
        LocalDate referenceDate,
        Double distanceMeters
){
    public static NearbyFacilityResponse from( NearbyFacilityProjection projection ) {
        return new NearbyFacilityResponse(
                projection.getId(),
                projection.getFacilityNo(),
                projection.getFacilityType(),
                projection.getRoadAddress(),
                projection.getLotAddress(),
                projection.getLatitude(),
                projection.getLongitude(),
                projection.getAvailability(),
                projection.getReferenceDate(),
                projection.getDistanceMeters()
        );
    }
}
