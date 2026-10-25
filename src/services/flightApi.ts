import type { FlightItem, ApiResponse, Airport } from '../types/flight';
import { STATIC_AIRPORTS } from '../data/airportsData';

interface SkyCarrier { name: string; }
interface SkyLeg { carriers: { marketing: SkyCarrier[]; }; }
interface SkyItinerary { id: string; legs: SkyLeg[]; }
interface SkyScrapperResponse { data?: { itineraries?: SkyItinerary[]; }; }

const CACHE_DURATION_MS = 1000 * 60 * 60;
const RAPID_API_KEYS = [
  import.meta.env.VITE_RAPIDAPI_KEY_1,
  import.meta.env.VITE_RAPIDAPI_KEY_2,
  import.meta.env.VITE_RAPIDAPI_KEY_3,
  import.meta.env.VITE_RAPIDAPI_KEY_4,
  import.meta.env.VITE_RAPIDAPI_KEY_5
].filter((key): key is string => typeof key === 'string' && key.length > 0);

let currentApiKeyIndex = 0;

function getNextApiKey(): string | null {
  if (RAPID_API_KEYS.length === 0) return null;
  const key = RAPID_API_KEYS[currentApiKeyIndex];
  currentApiKeyIndex = (currentApiKeyIndex + 1) % RAPID_API_KEYS.length;
  return key;
}

function getCacheKey(origin: string, dest: string, date: string): string {
  return `skymate_flight_${origin}_${dest}_${date}`;
}

function getFromCache(key: string): FlightItem[] | null {
  const cached = localStorage.getItem(key);
  if (!cached) return null;
  try {
    const parsedCache = JSON.parse(cached) as { timestamp: number; data: FlightItem[] };
    if (Date.now() - parsedCache.timestamp < CACHE_DURATION_MS) return parsedCache.data;
    localStorage.removeItem(key);
  } catch { localStorage.removeItem(key); }
  return null;
}

function saveToCache(key: string, data: FlightItem[]): void {
  localStorage.setItem(key, JSON.stringify({ timestamp: Date.now(), data }));
}

function getCountryCode(country: string): string {
  const map: Record<string, string> = {
    // Europe
    "france": "fr", "espagne": "es", "italie": "it", "grèce": "gr", "portugal": "pt",
    "royaume-uni": "gb", "allemagne": "de", "suisse": "ch", "belgique": "be", "pays-bas": "nl",
    "irlande": "ie", "danemark": "dk", "norvège": "no", "suède": "se", "finlande": "fi",
    "islande": "is", "rép. tchèque": "cz", "pologne": "pl", "hongrie": "hu", "roumanie": "ro",
    "malte": "mt", "autriche": "at",
    
    // Amériques
    "états-unis": "us", "états-unis (hawaï)": "us", "canada": "ca", "mexique": "mx", 
    "brésil": "br", "argentine": "ar", "colombie": "co", "chili": "cl", "pérou": "pe", 
    "costa rica": "cr", "rép. dominicaine": "do", "cuba": "cu", "porto rico": "pr", "bahamas": "bs",
    
    // Asie & Océanie
    "japon": "jp", "thaïlande": "th", "inde": "in", "corée du sud": "kr", "chine": "cn", 
    "hong kong": "hk", "taïwan": "tw", "singapour": "sg", "indonésie": "id", "malaisie": "my", 
    "vietnam": "vn", "philippines": "ph", "australie": "au", "nouvelle-zélande": "nz", "fidji": "fj",
    "maldives": "mv",
    
    // Moyen-Orient & Afrique
    "turquie": "tr", "maroc": "ma", "émirats arabes unis": "ae", "égypte": "eg", "tunisie": "tn", 
    "sénégal": "sn", "côte d'ivoire": "ci", "nigeria": "ng", "kenya": "ke", "afrique du sud": "za", 
    "maurice": "mu", "seychelles": "sc", "tanzanie": "tz", "qatar": "qa", "arabie saoudite": "sa", 
    "jordanie": "jo", "cap-vert": "cv", "la réunion": "re", "guadeloupe": "gp", "martinique": "mq",
    "polynésie française": "pf", "nouvelle-calédonie": "nc"
  };
  
  return map[country.toLowerCase()] || "fr";
}

async function getRealWeather(city: string) {
  const weatherKey = import.meta.env.VITE_OPENWEATHER_KEY;
  const weatherCityMapping: Record<string, string> = {
    "Lanzarote": "Arrecife", "Fuerteventura": "Puerto del Rosario",
    "Palma": "Palma de Mallorca", "Ibiza": "Ibiza town",
    "Tenerife": "Santa Cruz de Tenerife", "Las Palmas": "Las Palmas de Gran Canaria"
  };
  const searchCity = weatherCityMapping[city] || city;

  if (!weatherKey) return { temp: 20, condition: "Clair" };
  try {
    const res = await fetch(`https://api.openweathermap.org/data/2.5/weather?q=${searchCity}&units=metric&lang=fr&appid=${weatherKey}`);
    if (!res.ok) throw new Error("Météo introuvable");
    const data = await res.json() as { main: { temp: number }; weather: Array<{ description: string }> };
    return { temp: Math.round(data.main.temp), condition: data.weather[0]?.description.charAt(0).toUpperCase() + data.weather[0]?.description.slice(1) || "Clair" };
  } catch {
    return { temp: 20, condition: "Ensoleillé" };
  }
}

async function fetchUnsplashImage(city: string): Promise<string> {
  const key = import.meta.env.VITE_UNSPLASH_KEY;
  if (!key) return "https://images.unsplash.com/photo-1436491865332-7a61a109cc05?q=80&w=800";
  try {
    const res = await fetch(`https://api.unsplash.com/search/photos?query=${encodeURIComponent(city)} landmark&orientation=landscape&per_page=1&client_id=${key}`);
    const data = await res.json();
    return data.results[0]?.urls?.regular || "https://images.unsplash.com/photo-1436491865332-7a61a109cc05?q=80&w=800";
  } catch {
    return "https://images.unsplash.com/photo-1436491865332-7a61a109cc05?q=80&w=800";
  }
}

async function fetchWikiDescription(city: string): Promise<string> {
  try {
    const res = await fetch(`https://fr.wikipedia.org/api/rest_v1/page/summary/${encodeURIComponent(city)}`);
    if (!res.ok) return "Découvrez cette destination incroyable au meilleur prix avec Skymate.";
    const data = await res.json();
    return data.extract || "Découvrez cette destination incroyable au meilleur prix avec Skymate.";
  } catch {
    return "Découvrez cette destination incroyable au meilleur prix avec Skymate.";
  }
}

export async function searchFlights(origin: string, dest: string, date: string): Promise<ApiResponse<FlightItem[]>> {
  const cacheKey = getCacheKey(origin, dest, date);
  const cachedData = getFromCache(cacheKey);

  if (cachedData) {
    return { data: cachedData, isMock: false, source: 'rapidapi' };
  }

  const destAirport = STATIC_AIRPORTS.find(a => a.skyId === dest);
  const cityName = destAirport ? destAirport.city : dest;
  const countryName = destAirport ? destAirport.country : "Destination";
  const countryCode = getCountryCode(countryName);

  // On télécharge toutes les métadonnées (Météo, Image, Wikipedia) en parallèle pour gagner du temps
  const [weather, imageUrl, description] = await Promise.all([
    getRealWeather(cityName),
    fetchUnsplashImage(cityName),
    fetchWikiDescription(cityName)
  ]);

  let attempts = 0;
  const maxAttempts = RAPID_API_KEYS.length > 0 ? RAPID_API_KEYS.length : 1;

  while (attempts < maxAttempts) {
    try {
      const apiKey = getNextApiKey();
      if (!apiKey) throw new Error("Aucune clé RapidAPI configurée");

      const formattedDate = new Date(date).toISOString().split('T')[0];
      const url = `https://sky-scrapper.p.rapidapi.com/api/v1/flights/searchFlights?originSkyId=${origin}&destinationSkyId=${dest}&date=${formattedDate}&adults=1&currency=EUR&market=fr-FR&countryCode=FR`;
      const options = { method: 'GET', headers: { 'x-rapidapi-key': apiKey, 'x-rapidapi-host': 'sky-scrapper.p.rapidapi.com' } };

      const res = await fetch(url, options);
      if (!res.ok) {
        if (res.status === 429 || res.status === 403) { attempts++; continue; }
        throw new Error(`Erreur API: ${res.status}`);
      }

      const rawData = (await res.json()) as SkyScrapperResponse;
      if (!rawData?.data?.itineraries || rawData.data.itineraries.length === 0) throw new Error("EMPTY_DATA");

      const flights = rawData.data.itineraries.slice(0, 6).map((itin: SkyItinerary) => ({
        id: itin.id,
        city: cityName, 
        country: countryName,
        countryCode: countryCode,
        description: description,
        weather: weather,
        imageUrl: imageUrl,
        airline: itin.legs[0]?.carriers?.marketing[0]?.name || "Compagnie inconnue",
        bookingUrl: `https://www.skyscanner.fr/transport/vols/${origin.toLowerCase()}/${dest.toLowerCase()}/`
      }));

      saveToCache(cacheKey, flights);
      return { data: flights, isMock: false, source: 'rapidapi' };

    } catch (error) {
      if (error instanceof Error && error.message === "EMPTY_DATA") break; 
    }
  }

  // Fallback si RapidAPI échoue totalement
  const airlines = ["Transavia", "Vueling", "Air France", "EasyJet", "Ryanair"];
  const realisticMockData = [
    {
      id: `fallback_1_${Date.now()}`, city: cityName, country: countryName, countryCode: countryCode, description: description,
      weather: weather, imageUrl: imageUrl, airline: airlines[0],
      bookingUrl: `https://www.skyscanner.fr/transport/vols/${origin.toLowerCase()}/${dest.toLowerCase()}/`
    },
    {
      id: `fallback_2_${Date.now()}`, city: cityName, country: countryName, countryCode: countryCode, description: description,
      weather: weather, imageUrl: imageUrl, airline: airlines[1],
      bookingUrl: `https://www.skyscanner.fr/transport/vols/${origin.toLowerCase()}/${dest.toLowerCase()}/`
    }
  ];
  
  return { data: realisticMockData, isMock: true, source: 'mock', error: 'Vols générés dynamiquement (API indisponible)' };
}

export async function searchAirport(query: string): Promise<ApiResponse<Airport[]>> {
  const lowerQuery = query.toLowerCase();
  const results = STATIC_AIRPORTS.filter(
    (apt) => apt.city.toLowerCase().includes(lowerQuery) || apt.skyId.toLowerCase().includes(lowerQuery)
  ).map(apt => ({ skyId: apt.skyId, entityId: apt.entityId, name: apt.name, city: apt.city, country: apt.country }));
  return { data: results.slice(0, 5), isMock: true, source: 'mock' };
}