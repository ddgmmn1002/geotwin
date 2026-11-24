package com.geotwin.backend.projection;


import java.time.LocalDate;

public interface NearbyFacilityProjection {

    Long getId();
    String getFacilityNo();
    String getFacilityType();
    String getRoadAddress();
    String getLotAddress();
    Double getLatitude();
    Double getLongitude();
    String getAvailability();
    LocalDate getReferenceDate();
    Double getDistanceMeters();
}
