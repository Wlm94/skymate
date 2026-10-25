import { useEffect, useRef, useState } from 'react';
import { getGlobalAirports } from './data/airportsData';
import type { FlightItem, MapAirport } from './types/flight';

interface LBounds {
  pad: (buffer: number) => LBounds;
  contains: (latlng: [number, number]) => boolean;
}

interface LMap {
  remove: () => void;
  setView: (center: [number, number], zoom: number) => LMap;
  getZoom: () => number;
  getBounds: () => LBounds;
  on: (event: string, callback: () => void) => LMap;
  off: (event: string, callback?: () => void) => LMap;
  fire: (event: string) => LMap;
}

interface LLayerGroup {
  addTo: (map: LMap) => LLayerGroup;
  clearLayers: () => void;
}

interface LMarker {
  on: (event: string, callback: () => void) => LMarker;
  addTo: (group: LLayerGroup) => LMarker;
}

interface Leaflet {
  map: (element: HTMLElement) => LMap;
  tileLayer: (url: string, options: Record<string, string | number>) => { addTo: (map: LMap) => void };
  layerGroup: () => LLayerGroup;
  divIcon: (options: Record<string, string | number | number[] | null | undefined>) => unknown;
  marker: (latlng: [number, number], options: { icon: unknown }) => LMarker;
}

declare global {
  interface Window {
    L?: Leaflet;
  }
}

interface FlightMapProps {
  flights: FlightItem[];
  onSelectDestination: (airport: MapAirport) => void;
  isDarkMode: boolean;
}

export default function FlightMap({ flights, onSelectDestination, isDarkMode }: FlightMapProps) {
  const mapRef = useRef<HTMLDivElement>(null);
  const mapInstanceRef = useRef<LMap | null>(null);
  const markerGroupRef = useRef<LLayerGroup | null>(null);
  
  const [isLoadingAirports, setIsLoadingAirports] = useState(true);
  const airportsRef = useRef<MapAirport[]>([]);

  useEffect(() => {
    getGlobalAirports().then((airportsList) => {
      airportsRef.current = airportsList;
      setIsLoadingAirports(false);
      if (mapInstanceRef.current) {
        mapInstanceRef.current.fire('moveend');
      }
    });
  }, []);

  useEffect(() => {
    if (!document.getElementById('leaflet-css')) {
      const link = document.createElement('link');
      link.id = 'leaflet-css';
      link.rel = 'stylesheet';
      link.href = 'https://unpkg.com/leaflet@1.9.4/dist/leaflet.css';
      document.head.appendChild(link);
    }

    const loadLeaflet = () => new Promise<void>((resolve) => {
      if (window.L) return resolve();
      const script = document.createElement('script');
      script.src = 'https://unpkg.com/leaflet@1.9.4/dist/leaflet.js';
      script.onload = () => resolve();
      document.body.appendChild(script);
    });

    loadLeaflet().then(() => {
      if (!mapRef.current || !window.L) return;

      if (!mapInstanceRef.current) {
        const map = window.L.map(mapRef.current).setView([35, -20], 2.5);
        mapInstanceRef.current = map;

        const tileUrl = 'https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png';
        window.L.tileLayer(tileUrl, { 
          maxZoom: 18, 
          minZoom: 2,
          attribution: '© OpenStreetMap',
          className: isDarkMode ? 'map-tiles-dark' : '' 
        }).addTo(map);

        markerGroupRef.current = window.L.layerGroup().addTo(map);
      }

      const map = mapInstanceRef.current;
      const markerGroup = markerGroupRef.current;

      if (!map || !markerGroup) return;

      map.off('moveend');
      map.off('zoomend');

      const updateMarkers = () => {
        markerGroup.clearLayers(); 
        
        const currentZoom = map.getZoom();
        const bounds = map.getBounds().pad(0.2); 
        
        let maxTierToShow = 1;
        if (currentZoom >= 4 && currentZoom < 6) maxTierToShow = 2;
        if (currentZoom >= 6) maxTierToShow = 3;

        const visibleAirports = airportsRef.current.filter(airport => {
          if (airport.tier > maxTierToShow) return false;
          return bounds.contains([airport.lat, airport.lng]); 
        });

        visibleAirports.forEach((airport) => {
          const foundFlight = flights.find(f => f.city.toLowerCase() === airport.city.toLowerCase());
          
          const capitalize = (str: string) => str.charAt(0).toUpperCase() + str.slice(1).toLowerCase();
          const cleanCityName = capitalize(airport.city);

          // CORRECTION DE L'ERREUR DE PRIX ICI
          const label = foundFlight ? `✈️ ${cleanCityName}` : `📍 ${cleanCityName}`;
          const bgColor = foundFlight ? '#2563eb' : (isDarkMode ? '#374151' : '#ffffff');
          const textColor = foundFlight ? 'white' : (isDarkMode ? 'white' : '#1f2937');
          const borderColor = foundFlight ? '#2563eb' : (isDarkMode ? '#4b5563' : '#e5e7eb');

          if (!window.L) return;

          const customIcon = window.L.divIcon({
            className: 'custom-map-pin',
            html: `
              <div style="background-color: ${bgColor}; color: ${textColor}; padding: 6px 12px; border-radius: 16px; font-weight: 700; font-size: 11px; box-shadow: 0 4px 6px rgba(0,0,0,0.2); border: 2px solid ${borderColor}; text-align: center; cursor: pointer; white-space: nowrap; width: max-content; transition: transform 0.2s;">
                ${label}
              </div>
            `,
            iconSize: undefined, 
            iconAnchor: [0, 15] 
          });

          const marker = window.L.marker([airport.lat, airport.lng], { icon: customIcon });
          marker.on('click', () => onSelectDestination(airport));
          marker.addTo(markerGroup);
        });
      };

      map.on('moveend', updateMarkers);
      map.on('zoomend', updateMarkers);
      
      updateMarkers(); 
    });

  }, [flights, isDarkMode, onSelectDestination]);

  return (
    <div className="w-full rounded-3xl overflow-hidden border border-gray-700/30 shadow-xl relative">
      <div className="absolute top-4 left-4 z-[400] bg-white/90 dark:bg-gray-800/90 backdrop-blur-md px-4 py-2 rounded-xl text-sm font-bold shadow-md border dark:border-gray-600 text-gray-800 dark:text-white transition-all">
        {isLoadingAirports ? (
          <span>⏳ Connexion à la base de données de 6500 aéroports...</span>
        ) : (
          <>🗺️ Cliquez sur une ville pour la définir comme destination <span className="text-blue-500 ml-1 font-black">(Zoomez pour voir plus d'aéroports)</span></>
        )}
      </div>
      <div ref={mapRef} className="w-full h-[450px] z-10" />
    </div>
  );
}