package com.geotwin.backend.controller;

import com.geotwin.backend.dto.FacilityResponse;
import com.geotwin.backend.dto.NearbyFacilityResponse;
import com.geotwin.backend.service.FacilityService;
import lombok.RequiredArgsConstructor;
import org.springframework.format.annotation.DateTimeFormat;
import org.springframework.web.bind.annotation.*;

import java.time.LocalDate;
import java.util.List;

@RequiredArgsConstructor
@RestController
@RequestMapping("/api/facilities")
public class FacilirtyController {
    private final FacilityService facilityService;

    @GetMapping("/{id}")
    public FacilityResponse findById(@PathVariable Long id) {
        return facilityService.findById(id);
    }

    @GetMapping
    public List<FacilityResponse> findAll(){
        return facilityService.findAll();
    }

    @GetMapping("/nearby")
    public List<NearbyFacilityResponse> findNearest(
            @RequestParam
            Double longitude,
            @RequestParam
            Double latitude,
            @RequestParam
            Double radiusMeters,
            @RequestParam
            @DateTimeFormat(iso = DateTimeFormat.ISO.DATE)
            LocalDate referenceDate
    ){
        return facilityService.findNearest(longitude, latitude, radiusMeters, referenceDate);
    }
}
