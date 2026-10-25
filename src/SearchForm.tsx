import { useState, useEffect } from 'react';
import { Search, MapPin, Calendar, PlaneTakeoff, Sun, ArrowRight, ThermometerSun, X, Heart, Moon, ArrowRightLeft } from 'lucide-react';
import { searchAirport, searchFlights } from './services/flightApi';
import { findNearestAirport, STATIC_AIRPORTS } from './data/airportsData';
import type { Airport, FlightItem } from './types/flight';
import FlightMap from './FlightMap';

export default function SearchForm() {
  const today = new Date().toISOString().split('T')[0];

  const [showFavoritesOnly, setShowFavoritesOnly] = useState(false);

  // ORIGINE
  const [originQuery, setOriginQuery] = useState(() => localStorage.getItem('skymate_origin') || '');
  const [originSuggestions, setOriginSuggestions] = useState<Airport[]>([]);
  const [showOriginSuggestions, setShowOriginSuggestions] = useState(false);
  const [selectedOriginSkyId, setSelectedOriginSkyId] = useState(() => localStorage.getItem('skymate_skyid') || '');

  // DESTINATION
  const [destQuery, setDestQuery] = useState('');
  const [destSuggestions, setDestSuggestions] = useState<Airport[]>([]);
  const [showDestSuggestions, setShowDestSuggestions] = useState(false);
  const [selectedDestSkyId, setSelectedDestSkyId] = useState('');

  const [departureDate, setDepartureDate] = useState('');
  const [returnDate, setReturnDate] = useState('');
  const [minTemp, setMinTemp] = useState<number>(() => {
    const saved = localStorage.getItem('skymate_mintemp');
    return saved ? Number(saved) : 15;
  });

  const [isLoading, setIsLoading] = useState(false);
  const [errorMsg, setErrorMsg] = useState('');
  const [items, setItems] = useState<FlightItem[]>([]);
  const [selectedItem, setSelectedItem] = useState<FlightItem | null>(null);

  const [favorites, setFavorites] = useState<FlightItem[]>(() => {
    const saved = localStorage.getItem('skymate_fav_items');
    return saved ? JSON.parse(saved) : [];
  });

  const [isDarkMode, setIsDarkMode] = useState<boolean>(() => {
    const saved = localStorage.getItem('skymate_darkmode');
    return saved !== null ? JSON.parse(saved) : false;
  });

  const [toastMessage, setToastMessage] = useState<string | null>(null);

  const triggerToast = (msg: string) => {
    setToastMessage(msg);
    setTimeout(() => setToastMessage(null), 3000);
  };

  useEffect(() => {
    document.body.style.backgroundColor = isDarkMode ? '#111827' : '#f3f4f6';
    localStorage.setItem('skymate_darkmode', JSON.stringify(isDarkMode));

    if (!selectedOriginSkyId && navigator.geolocation) {
      navigator.geolocation.getCurrentPosition((position) => {
        const nearest = findNearestAirport(position.coords.latitude, position.coords.longitude);
        setOriginQuery(`${nearest.city} (${nearest.skyId})`);
        setSelectedOriginSkyId(nearest.skyId);
        localStorage.setItem('skymate_origin', `${nearest.city} (${nearest.skyId})`);
        localStorage.setItem('skymate_skyid', nearest.skyId);
        triggerToast(`Localisé près de : ${nearest.city}`);
      }, () => {
        setOriginQuery("Paris (CDG)");
        setSelectedOriginSkyId("CDG");
      });
    }
  }, [isDarkMode, selectedOriginSkyId]);

  useEffect(() => {
    if (originQuery.length < 2) return;
    if (selectedOriginSkyId && originQuery.includes(selectedOriginSkyId)) return;
    const delay = setTimeout(async () => {
      const res = await searchAirport(originQuery);
      setOriginSuggestions(res.data);
    }, 450);
    return () => clearTimeout(delay);
  }, [originQuery, selectedOriginSkyId]);

  useEffect(() => {
    if (destQuery.length < 2) return;
    if (selectedDestSkyId && destQuery.includes(selectedDestSkyId)) return;
    const delay = setTimeout(async () => {
      const res = await searchAirport(destQuery);
      setDestSuggestions(res.data);
    }, 450);
    return () => clearTimeout(delay);
  }, [destQuery, selectedDestSkyId]);

  const handleSwapLocations = () => {
    const tempQuery = originQuery;
    const tempSkyId = selectedOriginSkyId;
    setOriginQuery(destQuery);
    setSelectedOriginSkyId(selectedDestSkyId);
    setDestQuery(tempQuery);
    setSelectedDestSkyId(tempSkyId);
  };

  const applyVibe = (vibe: string) => {
    const vibesMap: Record<string, string[]> = {
      'soleil': ['ACE', 'FUE', 'PMI', 'IBZ', 'TFS', 'LPA', 'DPS', 'CUN'],
      'culture': ['FCO', 'ATH', 'MXP', 'VCE', 'PRG', 'VIE', 'IST'],
      'nature': ['KEF', 'YVR', 'SJO', 'FNC', 'PDL']
    };
    const skyIds = vibesMap[vibe];
    const randomSkyId = skyIds[Math.floor(Math.random() * skyIds.length)];
    const apt = STATIC_AIRPORTS.find(a => a.skyId === randomSkyId);
    if (apt) {
      setDestQuery(`${apt.city} (${apt.skyId})`);
      setSelectedDestSkyId(apt.skyId);
      triggerToast(`Filtre appliqué : Direction ${apt.city} !`);
    }
  };

  const handleSearch = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true); setErrorMsg(''); setItems([]); setShowFavoritesOnly(false);
    try {
      const res = await searchFlights(selectedOriginSkyId || "CDG", selectedDestSkyId, departureDate);
      const finalResults = res.data.filter((d) => d.weather.temp >= minTemp);

      if (finalResults.length === 0) setErrorMsg("Aucun résultat trouvé pour ces critères.");
      else setItems(finalResults);
    } catch {
      setErrorMsg("Erreur lors de la recherche.");
    } finally {
      setIsLoading(false);
    }
  };
  
  const generateBookingUrl = (destCity: string) => {
    let baseUrl = 'https://www.skyscanner.fr/';
    
    if (selectedOriginSkyId) {
        const origin = selectedOriginSkyId.toLowerCase();
        const destination = selectedDestSkyId ? selectedDestSkyId.toLowerCase() : destCity.toLowerCase().replace(/\s+/g, '-');
        
        const formatSkyDate = (dateStr: string) => {
            if (!dateStr) return '';
            const d = new Date(dateStr);
            const yy = d.getFullYear().toString().slice(-2);
            const mm = String(d.getMonth() + 1).padStart(2, '0');
            const dd = String(d.getDate()).padStart(2, '0');
            return `${yy}${mm}${dd}`;
        };

        const dep = formatSkyDate(departureDate);
        const ret = formatSkyDate(returnDate);

        if (dep && ret) baseUrl = `https://www.skyscanner.fr/transport/vols/${origin}/${destination}/${dep}/${ret}/`;
        else if (dep) baseUrl = `https://www.skyscanner.fr/transport/vols/${origin}/${destination}/${dep}/`;
        else baseUrl = `https://www.skyscanner.fr/transport/vols/${origin}/${destination}/`;
    }
    return baseUrl;
  };

  const toggleFavorite = (item: FlightItem, e: React.MouseEvent) => {
    e.stopPropagation();
    const isAlreadyFav = favorites.some(fav => fav.id === item.id);
    const updated = isAlreadyFav ? favorites.filter(fav => fav.id !== item.id) : [...favorites, item];
    setFavorites(updated);
    localStorage.setItem('skymate_fav_items', JSON.stringify(updated));
    triggerToast(isAlreadyFav ? "Retiré des favoris" : "Ajouté aux favoris ❤️");
  };

  const displayedItems = showFavoritesOnly ? favorites : items;

  return (
    <div className={`min-h-screen w-full transition-colors duration-300 ${isDarkMode ? 'bg-gray-900 text-white' : 'bg-[#f3f4f6] text-gray-900'} py-10 px-4`}>
      <div className="max-w-6xl mx-auto mb-20 relative">

        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-8">
          <div>
            <h1 className="text-4xl font-black flex items-center gap-3"><PlaneTakeoff className="text-blue-600" size={36} /> Skymate</h1>
            <p className={`${isDarkMode ? 'text-gray-400' : 'text-gray-500'} text-sm mt-1`}>Trouvez l'inspiration pour vos prochaines évasions.</p>
          </div>
          <div className="flex items-center gap-3">
            <button onClick={() => setShowFavoritesOnly(!showFavoritesOnly)} className={`flex items-center gap-2 px-4 py-3 rounded-2xl border font-bold text-sm transition-all ${showFavoritesOnly ? 'bg-red-500 text-white border-red-500' : (isDarkMode ? 'bg-gray-800 border-gray-700 text-gray-200' : 'bg-white border-gray-200 text-gray-700')}`}>
              <Heart size={18} fill={showFavoritesOnly || favorites.length > 0 ? "currentColor" : "none"} className={showFavoritesOnly ? "text-white" : "text-red-500"} />
              Mes Favoris ({favorites.length})
            </button>
            <button onClick={() => setIsDarkMode(!isDarkMode)} className={`p-3 rounded-2xl border ${isDarkMode ? 'bg-gray-800 border-gray-700 text-yellow-400' : 'bg-white border-gray-200 text-gray-700'}`}>
              <Moon size={20} />
            </button>
          </div>
        </div>

        {!showFavoritesOnly && (
          <div className="mb-8 animate-fade-in">
            <FlightMap 
              flights={items} 
              isDarkMode={isDarkMode}
              onSelectDestination={(apt) => {
                setDestQuery(`${apt.city} (${apt.skyId})`);
                setSelectedDestSkyId(apt.skyId);
                triggerToast(`Destination choisie: ${apt.city}`);
              }} 
            />
          </div>
        )}

        <form onSubmit={handleSearch} className={`${isDarkMode ? 'bg-gray-800 border-gray-700' : 'bg-white border-gray-100'} p-6 rounded-3xl shadow-xl flex flex-col gap-6 border mb-8`}>
          
          <div className="flex flex-wrap gap-3">
            <span className="text-sm font-bold text-gray-400 self-center mr-2">Inspirations :</span>
            <button type="button" onClick={() => applyVibe('soleil')} className="px-4 py-2 rounded-xl bg-orange-100 text-orange-800 font-bold hover:bg-orange-200 transition-colors text-sm">☀️ Soleil & Plage</button>
            <button type="button" onClick={() => applyVibe('culture')} className="px-4 py-2 rounded-xl bg-purple-100 text-purple-800 font-bold hover:bg-purple-200 transition-colors text-sm">🏛️ Culture</button>
            <button type="button" onClick={() => applyVibe('nature')} className="px-4 py-2 rounded-xl bg-green-100 text-green-800 font-bold hover:bg-green-200 transition-colors text-sm">🏔️ Nature</button>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-12 gap-4 items-center">
            
            <div className={`lg:col-span-5 flex items-center ${isDarkMode ? 'bg-gray-700/50 border-gray-600' : 'bg-gray-50 border-gray-200'} border rounded-2xl p-4 relative`}>
              <MapPin className="text-blue-500 mr-3" size={24} />
              <div className="flex-1">
                <label className="text-xs font-bold text-gray-400 uppercase block">De</label>
                <input type="text" placeholder="Départ..." value={originQuery} onChange={(e) => { setOriginQuery(e.target.value); setSelectedOriginSkyId(''); setShowOriginSuggestions(true); }} onFocus={() => setShowOriginSuggestions(true)} onBlur={() => setTimeout(() => setShowOriginSuggestions(false), 200)} className="w-full bg-transparent font-bold focus:outline-none" required />
                {showOriginSuggestions && originSuggestions.length > 0 && (
                  <div className={`absolute top-full left-0 w-full mt-2 z-50 rounded-xl shadow-2xl border overflow-hidden ${isDarkMode ? 'bg-gray-700 border-gray-600' : 'bg-white border-gray-200'}`}>
                    {originSuggestions.map((apt) => (
                      <div key={apt.skyId} onClick={() => { setOriginQuery(`${apt.city} (${apt.skyId})`); setSelectedOriginSkyId(apt.skyId); setShowOriginSuggestions(false); }} className="p-3 cursor-pointer flex justify-between">
                        <div><p className="font-bold text-sm">{apt.city}</p></div>
                        <span className="text-xs px-2 py-1 rounded bg-blue-100 text-blue-800">{apt.skyId}</span>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </div>

            <div className="lg:col-span-2 flex justify-center">
              <button type="button" onClick={handleSwapLocations} className={`p-3 rounded-full border ${isDarkMode ? 'bg-gray-700 border-gray-600 text-blue-400' : 'bg-gray-100 text-blue-600'}`}><ArrowRightLeft size={18} /></button>
            </div>

            <div className={`lg:col-span-5 flex items-center ${isDarkMode ? 'bg-gray-700/50 border-gray-600' : 'bg-gray-50 border-gray-200'} border rounded-2xl p-4 relative`}>
              <MapPin className="text-green-500 mr-3" size={24} />
              <div className="flex-1">
                <label className="text-xs font-bold text-gray-400 uppercase block">Vers</label>
                <input type="text" placeholder="Partout (ou sélectionnez sur la carte)" value={destQuery} onChange={(e) => { setDestQuery(e.target.value); setSelectedDestSkyId(''); setShowDestSuggestions(true); }} onFocus={() => setShowDestSuggestions(true)} onBlur={() => setTimeout(() => setShowDestSuggestions(false), 200)} className="w-full bg-transparent font-bold focus:outline-none" />
                {showDestSuggestions && destSuggestions.length > 0 && (
                  <div className={`absolute top-full left-0 w-full mt-2 z-50 rounded-xl shadow-2xl border overflow-hidden ${isDarkMode ? 'bg-gray-700 border-gray-600' : 'bg-white border-gray-200'}`}>
                    {destSuggestions.map((apt) => (
                      <div key={apt.skyId} onClick={() => { setDestQuery(`${apt.city} (${apt.skyId})`); setSelectedDestSkyId(apt.skyId); setShowDestSuggestions(false); }} className="p-3 cursor-pointer flex justify-between">
                        <div><p className="font-bold text-sm">{apt.city}</p></div>
                        <span className="text-xs px-2 py-1 rounded bg-green-100 text-green-800">{apt.skyId}</span>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className={`flex items-center ${isDarkMode ? 'bg-gray-700/50 border-gray-600' : 'bg-gray-50 border-gray-200'} border rounded-2xl p-4`}>
              <Calendar className="text-blue-500 mr-3" size={24} />
              <div className="flex-1"><label className="text-xs font-bold text-gray-400 uppercase">Aller</label><input type="date" min={today} value={departureDate} onChange={(e) => setDepartureDate(e.target.value)} required className="w-full bg-transparent font-bold focus:outline-none" /></div>
            </div>
            <div className={`flex items-center ${isDarkMode ? 'bg-gray-700/50 border-gray-600' : 'bg-gray-50 border-gray-200'} border rounded-2xl p-4`}>
              <Calendar className="text-blue-500 mr-3" size={24} />
              <div className="flex-1"><label className="text-xs font-bold text-gray-400 uppercase">Retour</label><input type="date" min={departureDate || today} value={returnDate} onChange={(e) => setReturnDate(e.target.value)} className="w-full bg-transparent font-bold focus:outline-none" /></div>
            </div>
          </div>

          <div className="flex justify-between items-center pt-4 border-t border-gray-700/20">
            <div className={`w-1/2 flex items-center gap-4 ${isDarkMode ? 'bg-gray-700/40 border-gray-600' : 'bg-orange-50/50 border-orange-100'} p-4 rounded-2xl border`}>
              <ThermometerSun className="text-orange-500" size={24} />
              <div className="flex-1">
                <div className="flex justify-between"><label className="text-xs font-bold text-gray-400 uppercase">Temp Minimum</label><span className="font-bold text-orange-500">{minTemp}°C</span></div>
                <input type="range" min="0" max="40" value={minTemp} onChange={(e) => setMinTemp(Number(e.target.value))} className="w-full h-2 bg-orange-200 rounded-lg accent-orange-500" />
              </div>
            </div>
            <button type="submit" disabled={isLoading} className="bg-blue-600 hover:bg-blue-700 text-white font-bold py-4 px-10 rounded-2xl flex items-center gap-3">
              {isLoading ? 'Recherche...' : <><Search size={22} /> Explorer</>}
            </button>
          </div>
        </form>

        {errorMsg && <div className="mt-6 p-4 bg-red-500/10 text-red-500 rounded-2xl text-center border border-red-500/20">{errorMsg}</div>}

        {!isLoading && (
          <div>
            <div className="flex justify-between items-center mb-6">
              <h2 className="text-2xl font-extrabold">{showFavoritesOnly ? 'Favoris ❤️' : 'Résultats'} <span className="text-blue-600">({displayedItems.length})</span></h2>
            </div>

            <div className="grid gap-8 md:grid-cols-2 lg:grid-cols-3">
              {displayedItems.map((item) => (
                <div key={item.id} className={`${isDarkMode ? 'bg-gray-800 border-gray-700' : 'bg-white border-gray-100'} rounded-3xl shadow-md overflow-hidden flex flex-col group border`}>
                  <div className="h-56 relative overflow-hidden">
                    <img src={item.imageUrl} alt={item.city} className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700" />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent"></div>
                    <button onClick={(e) => toggleFavorite(item, e)} className="absolute top-4 left-4 p-2 bg-white/90 rounded-full text-red-500"><Heart size={18} fill={favorites.some(f => f.id === item.id) ? "currentColor" : "none"} /></button>
                    <div className="absolute top-4 right-4 bg-white/90 px-3 py-1.5 rounded-full flex items-center gap-2 text-sm font-bold text-gray-800"><Sun size={16} className="text-yellow-500" /> {item.weather.temp}°C</div>
                    <div className="absolute bottom-4 left-5 text-white">
                      <h3 className="text-2xl font-extrabold">{item.city}</h3>
                      <p className="font-medium flex items-center gap-2 mt-1">
                        <img src={`https://flagcdn.com/w20/${item.countryCode}.png`} alt={item.countryCode} className="w-5 h-auto rounded-sm shadow-sm" />
                        {item.country}
                      </p>
                    </div>
                  </div>
                  <div className="p-6 flex flex-col flex-1">
                    <p className="text-sm text-gray-500 dark:text-gray-400 line-clamp-2 mb-4">{item.description}</p>
                    <div className="flex justify-between items-end mb-4 mt-auto">
                      <div><p className="text-xs text-gray-400 uppercase">Compagnie</p><div className="flex items-center gap-2 font-medium"><PlaneTakeoff size={18} className="text-blue-500"/> {item.airline}</div></div>
                    </div>
                    <button onClick={() => setSelectedItem(item)} className="w-full py-3 font-bold rounded-xl flex items-center justify-center gap-2 border bg-blue-600 text-white hover:bg-blue-700 transition-colors">Voir les disponibilités <ArrowRight size={18} /></button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {selectedItem && (
          <div className="fixed inset-0 bg-black/60 z-50 flex items-center justify-center p-4">
            <div className={`rounded-3xl p-8 max-w-md w-full relative border shadow-2xl ${isDarkMode ? 'bg-gray-800 border-gray-700' : 'bg-white'}`}>
              <button onClick={() => setSelectedItem(null)} className={`absolute top-4 right-4 p-2 rounded-full transition-colors ${isDarkMode ? 'hover:bg-gray-700' : 'hover:bg-gray-100'}`}>
                <X size={20} />
              </button>
              
              <h2 className="text-2xl font-black mb-1">Prêt pour {selectedItem.city} ? 🌴</h2>
              <p className="text-sm text-gray-500 dark:text-gray-400 mb-6">Voici le résumé de votre évasion avant de vérifier les disponibilités.</p>
              
              <div className={`p-5 rounded-2xl mb-5 flex flex-col gap-4 ${isDarkMode ? 'bg-gray-700/50' : 'bg-blue-50/50'}`}>
                <div className="flex justify-between items-center">
                  <span className="text-xs text-gray-500 dark:text-gray-400 font-bold uppercase tracking-wider">Trajet</span>
                  <span className="font-bold text-sm text-right">
                    {originQuery ? originQuery.split(' ')[0] : 'Paris'} ➡️ {selectedItem.city}
                  </span>
                </div>

                {(departureDate || returnDate) && (
                  <div className="flex justify-between items-center">
                    <span className="text-xs text-gray-500 dark:text-gray-400 font-bold uppercase tracking-wider">Dates</span>
                    <span className="font-bold text-sm text-right text-blue-600">
                      {departureDate ? new Date(departureDate).toLocaleDateString('fr-FR') : 'Aller simple'} 
                      {returnDate ? ` - ${new Date(returnDate).toLocaleDateString('fr-FR')}` : ''}
                    </span>
                  </div>
                )}

                <div className="flex justify-between items-center">
                  <span className="text-xs text-gray-500 dark:text-gray-400 font-bold uppercase tracking-wider">Compagnie</span>
                  <span className="font-bold text-sm flex items-center gap-2">
                    <PlaneTakeoff size={14} className="text-blue-500"/> {selectedItem.airline}
                  </span>
                </div>
              </div>

              <a 
                href={generateBookingUrl(selectedItem.city)} 
                target="_blank" 
                rel="noreferrer"
                className="w-full py-4 bg-green-500 hover:bg-green-600 transition-colors text-white font-black text-lg rounded-2xl flex justify-center items-center gap-2 shadow-lg shadow-green-500/30"
              >
                Vérifier les prix en direct <ArrowRight size={20} />
              </a>
            </div>
          </div>
        )}

        {toastMessage && <div className="fixed bottom-6 right-6 z-50 bg-gray-900 text-white px-5 py-3 rounded-2xl font-bold text-sm shadow-xl">{toastMessage}</div>}
      </div>
    </div>
  );
}