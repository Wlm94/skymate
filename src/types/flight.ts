export interface Airport {
  skyId: string;
  entityId: string;
  name: string;
  city: string;
  country: string;
}

export interface MapAirport extends Airport {
  lat: number;
  lng: number;
  tier: number;
}

export interface FlightItem {
  id: string;
  city: string;
  country: string;
  countryCode: string;
  description: string;
  weather: {
    temp: number;
    condition: string;
  };
  imageUrl: string;
  airline: string;
  bookingUrl: string;
  lat?: number;
  lng?: number;
}

export interface ApiResponse<T> {
  data: T;
  isMock: boolean;
  source: 'rapidapi' | 'mock';
  error?: string;
}