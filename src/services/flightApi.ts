// src/services/flightApi.ts

const RAPIDAPI_KEY = import.meta.env.VITE_RAPIDAPI_KEY || '';

// Base d'aéroports mondiaux étendue pour le mode démo
const MOCK_AIRPORTS = [
  // France
  { skyId: "CDG", entityId: "95565050", name: "Paris Charles de Gaulle", city: "Paris", country: "France" },
  { skyId: "ORY", entityId: "95565051", name: "Paris Orly", city: "Paris", country: "France" },
  { skyId: "LYS", entityId: "95565053", name: "Lyon Saint-Exupéry", city: "Lyon", country: "France" },
  { skyId: "MRS", entityId: "95565054", name: "Marseille Provence", city: "Marseille", country: "France" },
  // Europe
  { skyId: "BCN", entityId: "95565056", name: "Barcelone El Prat", city: "Barcelone", country: "Espagne" },
  { skyId: "MAD", entityId: "95565057", name: "Madrid Barajas", city: "Madrid", country: "Espagne" },
  { skyId: "LIS", entityId: "95565058", name: "Lisbonne Humberto Delgado", city: "Lisbonne", country: "Portugal" },
  { skyId: "LHR", entityId: "95565059", name: "Londres Heathrow", city: "Londres", country: "Royaume-Uni" },
  { skyId: "FCO", entityId: "95565060", name: "Rome Fiumicino", city: "Rome", country: "Italie" },
  // Asie & International (Tokyo, NY, etc.)
  { skyId: "HND", entityId: "95565061", name: "Tokyo Haneda", city: "Tokyo", country: "Japon" },
  { skyId: "NRT", entityId: "95565062", name: "Tokyo Narita", city: "Tokyo", country: "Japon" },
  { skyId: "JFK", entityId: "95565063", name: "New York John F. Kennedy", city: "New York", country: "États-Unis" },
  { skyId: "DXB", entityId: "95565064", name: "Dubaï International", city: "Dubaï", country: "Émirats Arabes Unis" }
];

const MOCK_FLIGHTS = [
  { id: "1", city: "Barcelone", country: "Espagne", price: 45, weather: { temp: 22, condition: "Ensoleillé" }, imageUrl: "https://images.unsplash.com/photo-1539037116277-4db20889f2d4?auto=format&fit=crop&q=80&w=800", airline: "Vueling", bookingUrl: "https://www.skyscanner.fr/" },
  { id: "2", city: "Lisbonne", country: "Portugal", price: 52, weather: { temp: 24, condition: "Dégagé" }, imageUrl: "https://images.unsplash.com/photo-1509824227185-9c5a01ceba0d?auto=format&fit=crop&q=80&w=800", airline: "easyJet", bookingUrl: "https://www.skyscanner.fr/" },
  { id: "3", city: "Athènes", country: "Grèce", price: 89, weather: { temp: 28, condition: "Grand Soleil" }, imageUrl: "https://images.unsplash.com/photo-1603565816030-6b389eeb23cb?auto=format&fit=crop&q=80&w=800", airline: "Transavia", bookingUrl: "https://www.skyscanner.fr/" },
  { id: "4", city: "Rome", country: "Italie", price: 35, weather: { temp: 20, condition: "Nuageux" }, imageUrl: "https://images.unsplash.com/photo-1552832230-c0197dd311b5?auto=format&fit=crop&q=80&w=800", airline: "Ryanair", bookingUrl: "https://www.skyscanner.fr/" },
  { id: "5", city: "Marrakech", country: "Maroc", price: 110, weather: { temp: 32, condition: "Très chaud" }, imageUrl: "https://images.unsplash.com/photo-1539020140153-e479b8c22e70?auto=format&fit=crop&q=80&w=800", airline: "Air France", bookingUrl: "https://www.skyscanner.fr/" },
  { id: "6", city: "Tokyo", country: "Japon", price: 650, weather: { temp: 18, condition: "Ensoleillé" }, imageUrl: "https://images.unsplash.com/photo-1503899036084-c55cdd92da26?auto=format&fit=crop&q=80&w=800", airline: "ANA / Japan Airlines", bookingUrl: "https://www.skyscanner.fr/" }
];

export interface ApiResponse<T> {
  data: T;
  isMock: boolean;
  error?: string;
}

export async function searchAirport(query: string): Promise<ApiResponse<any[]>> {
  if (!query || query.length < 2) return { data: [], isMock: false };

  // 1. Tente l'API réelle si une clé existe
  if (RAPIDAPI_KEY) {
    try {
      const response = await fetch(`https://sky-scrapper.p.rapidapi.com/api/v1/flights/searchAirport?query=${encodeURIComponent(query)}`, {
        method: 'GET',
        headers: {
          'x-rapidapi-key': RAPIDAPI_KEY,
          'x-rapidapi-host': 'sky-scrapper.p.rapidapi.com'
        }
      });

      if (response.status === 429) {
        return { data: [], isMock: false, error: "QUOTA_EXCEEDED" };
      }

      if (response.ok) {
        const data = await response.json();
        if (data?.data?.length) {
          const formatted = data.data.map((item: any) => ({
            skyId: item.skyId || item.navigation?.entityId,
            entityId: item.navigation?.entityId || "999",
            name: item.presentation?.title || item.skyId,
            city: item.presentation?.suggestionTitle || item.skyId,
            country: item.presentation?.subtitle || ""
          }));
          return { data: formatted, isMock: false };
        }
      }
    } catch (err) {
      console.warn("Erreur réseau API, passage en mode démo:", err);
    }
  }

  // 2. Mode Démo / Fallback
  await new Promise(resolve => setTimeout(resolve, 200));
  const term = query.toLowerCase();
  const filtered = MOCK_AIRPORTS.filter(a =>
    a.name.toLowerCase().includes(term) ||
    a.city.toLowerCase().includes(term) ||
    a.country.toLowerCase().includes(term) ||
    a.skyId.toLowerCase().includes(term)
  );

  return { data: filtered, isMock: true };
}

export async function searchFlightsEverywhere(originSkyId: string, originEntityId: string, date: string): Promise<ApiResponse<any[]>> {
  if (RAPIDAPI_KEY) {
    try {
      const response = await fetch(`https://sky-scrapper.p.rapidapi.com/api/v1/flights/searchFlightsEverywhere?originSkyId=${originSkyId}&originEntityId=${originEntityId}&fromDate=${date}`, {
        method: 'GET',
        headers: {
          'x-rapidapi-key': RAPIDAPI_KEY,
          'x-rapidapi-host': 'sky-scrapper.p.rapidapi.com'
        }
      });

      if (response.status === 429) {
        return { data: [], isMock: false, error: "QUOTA_EXCEEDED" };
      }

      if (response.ok) {
        const data = await response.json();
        if (data?.data?.results?.length) {
          return { data: data.data.results, isMock: false };
        }
      }
    } catch (err) {
      console.warn("Erreur vols, passage en mode démo:", err);
    }
  }

  await new Promise(resolve => setTimeout(resolve, 600));
  return { data: MOCK_FLIGHTS, isMock: true };
}