package com.geotwin.backend.entity;

import jakarta.persistence.*;
import lombok.AccessLevel;
import lombok.Getter;
import lombok.NoArgsConstructor;

import java.time.LocalDate;

@NoArgsConstructor(access = AccessLevel.PROTECTED)
@Getter
@Entity
@Table(name = "facilities", schema = "public")
public class Facility {

    @Id @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(name = "facility_no")
    private String facilityNo;

    @Column(name = "facility_type")
    private String facilityType;

    @Column(name = "road_address")
    private String roadAddress;

    @Column(name = "lot_address")
    private String lotAddress;

    private Double latitude;

    private Double longitude;

    private String availability;

    @Column(name = "reference_date")
    private LocalDate referenceDate;

}
