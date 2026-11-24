package com.geotwin.backend.repository;

import com.geotwin.backend.entity.Facility;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;
import com.geotwin.backend.projection.NearbyFacilityProjection;

import java.time.LocalDate;
import java.util.List;

@Repository
public interface FacilityRepository extends JpaRepository<Facility, Long> {

    List<Facility> findByReferenceDate(LocalDate referenceDate, Pageable pageable);

    @Query(value = """
        SELECT
            f.id AS "id",
            f.facility_no AS "facilityNo",
            f.facility_type AS "facilityType",
            f.road_address AS "roadAddress",
            f.lot_address AS "lotAddress",
            f.latitude AS "latitude",
            f.longitude AS "longitude",
            f.availability AS "availability",
            f.reference_date AS "referenceDate",
               ST_Distance(
                   f.location,
                   CAST(ST_SetSRID(ST_MakePoint(:longitude, :latitude), 4326) AS geography)
               ) AS "distanceMeters"
        FROM public.facilities f
        WHERE f.reference_date = :referenceDate
          AND ST_DWithin(
              f.location,
              CAST(ST_SetSRID(ST_MakePoint(:longitude, :latitude), 4326) AS geography),
              :radiusMeters
          )
        ORDER BY "distanceMeters" ASC, f.id ASC
        LIMIT 3
        """, nativeQuery = true)
    List<NearbyFacilityProjection> findNearest(
            @Param("longitude") Double longitude,
            @Param("latitude") Double latitude,
            @Param("radiusMeters") Double radiusMeters,
            @Param("referenceDate") LocalDate referenceDate
    );
}
