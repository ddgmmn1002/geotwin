export type Facility = {
    id: number;
    facilityNo: string;
    facilityType: string;
    longitude: number;
    latitude: number;
    roadAddress: string;
    availability: string | null;
    referenceDate: string;
}

export type NearbyFacility = Facility & {
    distanceMeters: number;
};