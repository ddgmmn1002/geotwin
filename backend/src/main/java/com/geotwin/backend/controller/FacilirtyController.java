package com.geotwin.backend.controller;

import com.geotwin.backend.dto.FacilityResponse;
import com.geotwin.backend.service.FacilityService;
import lombok.RequiredArgsConstructor;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

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
}
