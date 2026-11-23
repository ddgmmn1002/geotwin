package com.geotwin.backend.dto;

import java.time.LocalDate;

public record FacilityResponse(
        Long id,
        String facilityNo,
        String facilityType,
        String roadAddress,
        String lotAddress,
        Double latitude,
        Double longitude,
        String availability,
        LocalDate referenceDate
) { }
