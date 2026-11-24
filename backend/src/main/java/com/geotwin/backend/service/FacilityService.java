package com.geotwin.backend.service;

import com.geotwin.backend.dto.FacilityResponse;
import com.geotwin.backend.dto.NearbyFacilityResponse;
import com.geotwin.backend.entity.Facility;
import com.geotwin.backend.mapper.FacilityMapper;
import com.geotwin.backend.repository.FacilityRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.data.domain.Sort;
import org.springframework.http.HttpStatus;
import org.springframework.stereotype.Service;
import org.springframework.web.server.ResponseStatusException;

import java.time.LocalDate;
import java.util.List;

@RequiredArgsConstructor
@Service
public class FacilityService {

    private final FacilityRepository facilityRepository;
    private final FacilityMapper facilityMapper;

    public FacilityResponse findById(Long id){
        Facility facility = facilityRepository.findById(id)
                .orElseThrow(() -> new ResponseStatusException(HttpStatus.NOT_FOUND, "Facility not found" + id));
        return facilityMapper.toResponse(facility);
    }

    public List<FacilityResponse> findAll() {
        LocalDate referenceDate = LocalDate.of(2025,12,31);
        Pageable pageable = PageRequest.of(
                0,
                100,
                Sort.by("id").ascending()
        );
        return facilityRepository.findByReferenceDate(referenceDate,pageable).stream()
                .map(facility -> facilityMapper.toResponse(facility))
                .toList();
    }

    public List<NearbyFacilityResponse> findNearest(
            double longitude,
            double latitude,
            double radiusMeters,
            LocalDate referenceDate
    ) {
        if (!Double.isFinite(longitude)
                || !Double.isFinite(latitude)
                || longitude < -180 || longitude > 180
                || latitude < -90 || latitude > 90
                || (radiusMeters != 300 && radiusMeters != 500)
        ) {
            throw new ResponseStatusException(HttpStatus.BAD_REQUEST, "Invalid coordinates or radius");
        }
        return facilityRepository.findNearest( longitude, latitude, radiusMeters, referenceDate)
                .stream().map((projection) -> NearbyFacilityResponse.from(projection))
                .toList();
    }
}
