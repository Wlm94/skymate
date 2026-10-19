import { useState, useEffect } from 'react';
import { Search, MapPin, DollarSign, Calendar, PlaneTakeoff, Sun, ArrowRight, ArrowDownUp, ThermometerSun, X, Heart, Moon, Hotel, AlertCircle, Info } from 'lucide-react';
import { searchAirport, searchFlightsEverywhere } from './services/flightApi';

export default function SearchForm() {
  // Date du jour pour bloquer les dates passées
  const today = new Date().toISOString().split('T')[0];

  const [activeTab, setActiveTab] = useState<'flights' | 'hotels'>('flights');
  const [showFavoritesOnly, setShowFavoritesOnly] = useState(false);

  // States autocomplétion
  const [originQuery, setOriginQuery] = useState('');
  const [airportSuggestions, setAirportSuggestions] = useState<any[]>([]);
  const [showSuggestions, setShowSuggestions] = useState(false);
  const [selectedSkyId, setSelectedSkyId] = useState('');

  // States filtres
  const [budget, setBudget] = useState(''); 
  const [departureDate, setDepartureDate] = useState('');
  const [returnDate, setReturnDate] = useState(''); 
  const [minTemp, setMinTemp] = useState<number>(15);
  
  // States UI & API Status
  const [isLoading, setIsLoading] = useState(false);
  const [errorMsg, setErrorMsg] = useState('');
  const [isDemoMode, setIsDemoMode] = useState(false);
  const [items, setItems] = useState<any[]>([]);
  const [sortOrder, setSortOrder] = useState<'asc' | 'desc'>('asc');
  
  const [selectedItem, setSelectedItem] = useState<any | null>(null);
  const [favorites, setFavorites] = useState<string[]>([]);
  const [isDarkMode, setIsDarkMode] = useState(false);

  useEffect(() => {
    const savedFavs = localStorage.getItem('skymate_favs');
    if (savedFavs) setFavorites(JSON.parse(savedFavs));

    const savedDarkMode = localStorage.getItem('skymate_darkmode');
    if (savedDarkMode !== null) setIsDarkMode(JSON.parse(savedDarkMode));

    const savedOrigin = localStorage.getItem('skymate_origin');
    if (savedOrigin) setOriginQuery(savedOrigin);

    const savedSkyId = localStorage.getItem('skymate_skyid');
    if (savedSkyId) setSelectedSkyId(savedSkyId);

    const savedBudget = localStorage.getItem('skymate_budget');
    if (savedBudget) setBudget(savedBudget);

    const savedMinTemp = localStorage.getItem('skymate_mintemp');
    if (savedMinTemp) setMinTemp(Number(savedMinTemp));
  }, []);

  useEffect(() => {
    document.body.style.backgroundColor = isDarkMode ? '#111827' : '#f3f4f6';
    localStorage.setItem('skymate_darkmode', JSON.stringify(isDarkMode));
  }, [isDarkMode]);

  // Autocomplétion dynamique avec gestion d'erreurs
  useEffect(() => {
    if (originQuery.length < 2) {
      setAirportSuggestions([]);
      return;
    }
    if (selectedSkyId && originQuery.includes(selectedSkyId)) return;

    const delayDebounceFn = setTimeout(async () => {
      const res = await searchAirport(originQuery);
      if (res.error === "QUOTA_EXCEEDED") {
        setErrorMsg("Quota d'appels API dépassé. Veuillez patienter quelques minutes.");
        setAirportSuggestions([]);
      } else {
        setAirportSuggestions(res.data);
        setIsDemoMode(res.isMock);
      }
    }, 300);

    return () => clearTimeout(delayDebounceFn);
  }, [originQuery, selectedSkyId]);

  const toggleFavorite = (id: string, e: React.MouseEvent) => {
    e.stopPropagation();
    let updated = favorites.includes(id) 
      ? favorites.filter(favId => favId !== id) 
      : [...favorites, id];
    setFavorites(updated);
    localStorage.setItem('skymate_favs', JSON.stringify(updated));
  };

  const handleSearch = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setErrorMsg('');
    setItems([]);
    setShowFavoritesOnly(false);
    
    try {
      if (activeTab === 'flights') {
        const res = await searchFlightsEverywhere(selectedSkyId || "MOCK", "999", departureDate);
        
        if (res.error === "QUOTA_EXCEEDED") {
          setErrorMsg("Service momentanément indisponible (limite d'API atteinte). Veuillez réessayer plus tard.");
          setIsLoading(false);
          return;
        }

        setIsDemoMode(res.isMock);
        let finalResults = res.data.filter((dest: any) => dest.weather.temp >= minTemp);
        if (budget) finalResults = finalResults.filter((dest: any) => dest.price <= Number(budget));
        finalResults.sort((a, b) => a.price - b.price);
        
        if (finalResults.length === 0) setErrorMsg("Aucun résultat trouvé pour ces critères.");
        else setItems(finalResults);
      } else {
        const hotelResults = [
          { id: 'h1', city: "Barcelone", country: "Espagne", price: 65, weather: { temp: 22 }, imageUrl: "https://images.unsplash.com/photo-1583422409516-15eba5344c7e?w=800&q=80", airline: "Hôtel 4* Piscine & Spa", bookingUrl: "https://www.booking.com/" },
          { id: 'h2', city: "Lisbonne", country: "Portugal", price: 55, weather: { temp: 24 }, imageUrl: "https://images.unsplash.com/photo-1509824227185-9c5a01ceba0d?w=800&q=80", airline: "Appartement Vue Mer", bookingUrl: "https://www.booking.com/" },
          { id: 'h3', city: "Tokyo", country: "Japon", price: 120, weather: { temp: 18 }, imageUrl: "https://images.unsplash.com/photo-1503899036084-c55cdd92da26?w=800&q=80", airline: "Hôtel Ryokan Traditionnel", bookingUrl: "https://www.booking.com/" }
        ];
        setIsDemoMode(true);
        setItems(hotelResults);
      }
    } catch (err) {
      setErrorMsg("Une erreur s'est produite lors de la recherche.");
    } finally {
      setIsLoading(false);
    }
  };

  const toggleSort = () => {
    const newOrder = sortOrder === 'asc' ? 'desc' : 'asc';
    setSortOrder(newOrder);
    const sorted = [...items].sort((a, b) => newOrder === 'asc' ? a.price - b.price : b.price - a.price);
    setItems(sorted);
  };

  const displayedItems = showFavoritesOnly ? items.filter(item => favorites.includes(item.id)) : items;

  return (
    <div className={`min-h-screen w-full transition-colors duration-300 ${isDarkMode ? 'bg-gray-900 text-white' : 'bg-[#f3f4f6] text-gray-900'} py-10 px-4`}>
      <div className="max-w-6xl mx-auto mb-20 relative">
        
        {/* HEADER */}
        <div className="flex justify-between items-center mb-8">
          <div>
            <h1 className="text-4xl font-black tracking-tight flex items-center gap-3">
              <PlaneTakeoff className="text-blue-600" size={36} /> Skymate
            </h1>
            <p className={`${isDarkMode ? 'text-gray-400' : 'text-gray-500'} text-sm mt-1 flex items-center gap-2`}>
              Trouvez vos vols et séjours au meilleur prix.
              {isDemoMode && (
                <span className="bg-amber-500/10 text-amber-500 text-xs px-2.5 py-0.5 rounded-full font-bold border border-amber-500/20 flex items-center gap-1">
                  <Info size={12} /> Mode Démo
                </span>
              )}
            </p>
          </div>
          <button 
            onClick={() => setIsDarkMode(!isDarkMode)}
            className={`p-3 rounded-2xl border transition-colors ${isDarkMode ? 'bg-gray-800 border-gray-700 text-yellow-400' : 'bg-white border-gray-200 text-gray-700'} shadow-sm`}
          >
            <Moon size={20} />
          </button>
        </div>

        {/* ONGLETS */}
        <div className="flex gap-2 mb-4">
          <button 
            onClick={() => { setActiveTab('flights'); setItems([]); setShowFavoritesOnly(false); }}
            className={`px-6 py-3 rounded-2xl font-bold flex items-center gap-2 transition-all ${activeTab === 'flights' ? 'bg-blue-600 text-white shadow-lg shadow-blue-600/30' : `${isDarkMode ? 'bg-gray-800 text-gray-300 border-gray-700' : 'bg-white text-gray-600 border-gray-200'} border`}`}
          >
            <PlaneTakeoff size={18} /> Vols & Évasions
          </button>
          <button 
            onClick={() => { setActiveTab('hotels'); setItems([]); setShowFavoritesOnly(false); }}
            className={`px-6 py-3 rounded-2xl font-bold flex items-center gap-2 transition-all ${activeTab === 'hotels' ? 'bg-blue-600 text-white shadow-lg shadow-blue-600/30' : `${isDarkMode ? 'bg-gray-800 text-gray-300 border-gray-700' : 'bg-white text-gray-600 border-gray-200'} border`}`}
          >
            <Hotel size={18} /> Hôtels & Séjours
          </button>
        </div>
        
        {/* FORMULAIRE */}
        <form onSubmit={handleSearch} className={`${isDarkMode ? 'bg-gray-800 border-gray-700' : 'bg-white border-gray-100'} p-6 md:p-8 rounded-3xl shadow-xl flex flex-col gap-6 border transition-colors`}>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            
            {/* DÉPART */}
            <div className={`flex items-center ${isDarkMode ? 'bg-gray-700/50 border-gray-600' : 'bg-gray-50 border-gray-200'} border rounded-2xl p-4 relative`}>
              <MapPin className="text-blue-500 mr-3" size={24} />
              <div className="flex-1">
                <label className="text-xs font-bold text-gray-400 uppercase tracking-wider block">Départ de</label>
                <input 
                  type="text" placeholder="Ex: Paris, Tokyo..." value={originQuery} 
                  onChange={(e) => {
                      const val = e.target.value;
                      setOriginQuery(val);
                      setSelectedSkyId('');
                      setShowSuggestions(true);
                      localStorage.setItem('skymate_origin', val);
                  }}
                  onFocus={() => setShowSuggestions(true)}
                  onBlur={() => setTimeout(() => setShowSuggestions(false), 200)}
                  className={`w-full bg-transparent font-bold focus:outline-none ${isDarkMode ? 'text-white placeholder-gray-400' : 'text-gray-800 placeholder-gray-300'}`} required
                />
                
                {/* SUGGESTIONS / AUTOCOMPLÉTION */}
                {showSuggestions && originQuery.length >= 2 && (
                    <div className={`absolute top-full left-0 w-full mt-2 z-50 rounded-xl shadow-2xl border overflow-hidden ${isDarkMode ? 'bg-gray-700 border-gray-600' : 'bg-white border-gray-200'}`}>
                        {airportSuggestions.length > 0 ? (
                            airportSuggestions.map((apt) => (
                                <div 
                                    key={apt.skyId}
                                    onClick={() => {
                                        const formatted = `${apt.city} (${apt.skyId})`;
                                        setOriginQuery(formatted);
                                        setSelectedSkyId(apt.skyId);
                                        setShowSuggestions(false);
                                        localStorage.setItem('skymate_origin', formatted);
                                        localStorage.setItem('skymate_skyid', apt.skyId);
                                    }}
                                    className={`p-3 cursor-pointer flex justify-between items-center transition-colors ${isDarkMode ? 'hover:bg-gray-600 text-white' : 'hover:bg-blue-50 text-gray-900'}`}
                                >
                                    <div>
                                        <p className="font-bold text-sm">{apt.city}</p>
                                        <p className="text-xs opacity-70">{apt.name}</p>
                                    </div>
                                    <span className={`font-mono text-xs px-2 py-1 rounded-md ${isDarkMode ? 'bg-gray-800 text-blue-400' : 'bg-blue-100 text-blue-800'}`}>
                                        {apt.skyId}
                                    </span>
                                </div>
                            ))
                        ) : (
                            <div className="p-4 text-center text-xs opacity-60">
                              Aucun aéroport trouvé pour "{originQuery}"
                            </div>
                        )}
                    </div>
                )}
              </div>
            </div>

            {/* BUDGET */}
            <div className={`flex items-center ${isDarkMode ? 'bg-gray-700/50 border-gray-600' : 'bg-gray-50 border-gray-200'} border rounded-2xl p-4`}>
              <DollarSign className="text-blue-500 mr-3" size={24} />
              <div className="flex-1">
                <label className="text-xs font-bold text-gray-400 uppercase tracking-wider block">Budget Max</label>
                <input 
                  type="number" placeholder="Optionnel" value={budget} 
                  onChange={(e) => { setBudget(e.target.value); localStorage.setItem('skymate_budget', e.target.value); }} 
                  className={`w-full bg-transparent font-bold focus:outline-none ${isDarkMode ? 'text-white placeholder-gray-400' : 'text-gray-800 placeholder-gray-300'}`} 
                />
              </div>
            </div>

            {/* DATES SÉCURISÉES */}
            <div className={`flex items-center ${isDarkMode ? 'bg-gray-700/50 border-gray-600' : 'bg-gray-50 border-gray-200'} border rounded-2xl p-4`}>
              <Calendar className="text-blue-500 mr-3" size={24} />
              <div className="flex-1">
                <label className="text-xs font-bold text-gray-400 uppercase tracking-wider block">Aller</label>
                <input 
                  type="date" 
                  min={today}
                  value={departureDate} 
                  onChange={(e) => {
                    const newDate = e.target.value;
                    setDepartureDate(newDate);
                    if (returnDate && newDate > returnDate) {
                      setReturnDate(''); // Réinitialise le retour si antérieur
                    }
                  }} 
                  className={`w-full bg-transparent font-bold focus:outline-none ${isDarkMode ? 'text-white' : 'text-gray-800'}`} 
                  required 
                />
              </div>
            </div>

            <div className={`flex items-center ${isDarkMode ? 'bg-gray-700/50 border-gray-600' : 'bg-gray-50 border-gray-200'} border rounded-2xl p-4`}>
              <Calendar className="text-blue-500 mr-3" size={24} />
              <div className="flex-1">
                <label className="text-xs font-bold text-gray-400 uppercase tracking-wider block">Retour</label>
                <input 
                  type="date" 
                  min={departureDate || today}
                  value={returnDate} 
                  onChange={(e) => setReturnDate(e.target.value)} 
                  className={`w-full bg-transparent font-bold focus:outline-none text-sm ${isDarkMode ? 'text-white' : 'text-gray-800'}`} 
                />
              </div>
            </div>
          </div>

          <div className="flex flex-col md:flex-row items-center justify-between gap-6 pt-4 border-t border-gray-700/20">
            <div className={`w-full md:w-1/2 flex items-center gap-4 ${isDarkMode ? 'bg-gray-700/40 border-gray-600' : 'bg-orange-50/50 border-orange-100'} p-4 rounded-2xl border`}>
                <div className="bg-orange-100 p-2 rounded-xl"><ThermometerSun className="text-orange-500" size={24} /></div>
                <div className="flex-1">
                    <div className="flex justify-between mb-1">
                        <label className="text-xs font-bold text-gray-400 uppercase tracking-wider block">Température Minimum</label>
                        <span className="font-bold text-orange-500">{minTemp}°C</span>
                    </div>
                    <input 
                      type="range" min="0" max="40" step="1" value={minTemp} 
                      onChange={(e) => { setMinTemp(Number(e.target.value)); localStorage.setItem('skymate_mintemp', String(e.target.value)); }} 
                      className="w-full h-2 bg-orange-200 rounded-lg appearance-none cursor-pointer accent-orange-500" 
                    />
                </div>
            </div>

            <button type="submit" disabled={isLoading} className={`${isLoading ? 'bg-gray-400' : 'bg-blue-600 hover:bg-blue-700'} text-white font-bold py-4 px-10 rounded-2xl flex items-center justify-center gap-3 transition-all shadow-lg shadow-blue-600/30 w-full md:w-auto`}>
              {isLoading ? <span className="animate-pulse">Recherche...</span> : <><Search size={22} /><span className="text-lg">Explorer</span></>}
            </button>
          </div>
        </form>

        {/* MESSAGES D'ERREURS / ALERTES API */}
        {errorMsg && (
            <div className="mt-6 p-4 bg-red-500/10 text-red-500 rounded-2xl font-medium text-center border border-red-500/20 flex items-center justify-center gap-2 animate-fade-in">
                <AlertCircle size={20} />
                <span>{errorMsg}</span>
            </div>
        )}

        {/* SKELETON LOADERS */}
        {isLoading && (
            <div className="mt-12 grid gap-8 md:grid-cols-2 lg:grid-cols-3">
                {[1, 2, 3].map((n) => (
                    <div key={n} className={`${isDarkMode ? 'bg-gray-800 border-gray-700' : 'bg-white border-gray-100'} rounded-3xl p-4 border animate-skeleton flex flex-col gap-4 h-80`}>
                        <div className={`w-full h-48 ${isDarkMode ? 'bg-gray-700' : 'bg-gray-200'} rounded-2xl`}></div>
                        <div className={`w-3/4 h-6 ${isDarkMode ? 'bg-gray-700' : 'bg-gray-200'} rounded-lg`}></div>
                        <div className={`w-1/2 h-4 ${isDarkMode ? 'bg-gray-700' : 'bg-gray-200'} rounded-lg`}></div>
                    </div>
                ))}
            </div>
        )}

        {/* RÉSULTATS */}
        {!isLoading && items.length > 0 && (
            <div className="mt-12">
                <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-6 gap-4">
                  <h2 className="text-2xl font-extrabold flex items-center gap-2">
                    Résultats {showFavoritesOnly ? 'favoris' : 'trouvés'} 
                    <span className="text-blue-600">({displayedItems.length})</span>
                  </h2>
                  
                  <div className="flex gap-2">
                    <button 
                      onClick={() => setShowFavoritesOnly(!showFavoritesOnly)}
                      className={`flex items-center gap-2 px-4 py-2 rounded-lg shadow-sm border font-medium text-sm transition-colors ${showFavoritesOnly ? 'bg-red-50 text-red-600 border-red-200' : isDarkMode ? 'bg-gray-800 border-gray-700 text-gray-300' : 'bg-white border-gray-200 text-gray-600'}`}
                    >
                      <Heart size={16} fill={showFavoritesOnly ? "currentColor" : "none"} className={showFavoritesOnly ? "text-red-500" : ""} /> 
                      Favoris
                    </button>
                    
                    <button onClick={toggleSort} className={`flex items-center gap-2 px-4 py-2 rounded-lg shadow-sm border font-medium text-sm transition-colors ${isDarkMode ? 'bg-gray-800 border-gray-700 text-gray-300' : 'bg-white border-gray-200 text-gray-600'}`}>
                      <ArrowDownUp size={16} /> Prix : {sortOrder === 'asc' ? 'Moins cher' : 'Plus cher'}
                    </button>
                  </div>
                </div>
                
                <div className="grid gap-8 md:grid-cols-2 lg:grid-cols-3">
                    {displayedItems.map((item, index) => {
                        const isFav = favorites.includes(item.id);
                        return (
                            <div 
                                key={item.id} 
                                className={`${isDarkMode ? 'bg-gray-800 border-gray-700' : 'bg-white border-gray-100'} rounded-3xl shadow-md hover:shadow-2xl hover:-translate-y-2 transition-all duration-300 overflow-hidden flex flex-col group border animate-fade-in-up`}
                                style={{ animationDelay: `${index * 100}ms` }}
                            >
                                <div className="h-56 overflow-hidden relative">
                                    <img src={item.imageUrl} alt={item.city} className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700" />
                                    <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent"></div>
                                    
                                    <button onClick={(e) => toggleFavorite(item.id, e)} className="absolute top-4 left-4 p-2.5 bg-white/90 backdrop-blur-sm rounded-full shadow-md text-red-500 hover:scale-110 transition-transform">
                                        <Heart size={18} fill={isFav ? "currentColor" : "none"} />
                                    </button>

                                    <div className="absolute top-4 right-4 bg-white/90 backdrop-blur-sm px-3 py-1.5 rounded-full flex items-center gap-2 text-sm font-bold text-gray-800 shadow-sm">
                                      <Sun size={16} className="text-yellow-500" /> {item.weather.temp}°C
                                    </div>
                                    <div className="absolute bottom-4 left-5 text-white">
                                        <h3 className="text-2xl font-extrabold">{item.city}</h3>
                                        <p className="text-white/80 font-medium">{item.country}</p>
                                    </div>
                                </div>
                                
                                <div className="p-6 flex flex-col gap-5 flex-1">
                                    <div className="flex justify-between items-end">
                                        <div>
                                            <p className="text-xs font-bold text-gray-400 uppercase tracking-wider mb-1">Formule</p>
                                            <div className="flex items-center gap-2 font-medium">
                                                <PlaneTakeoff size={18} className="text-blue-500" />
                                                <span>{item.airline}</span>
                                            </div>
                                        </div>
                                        <div className="text-right">
                                            <p className="text-xs font-bold text-gray-400 uppercase tracking-wider mb-1">À partir de</p>
                                            <div className="text-3xl font-black text-blue-600">{item.price}€</div>
                                        </div>
                                    </div>
                                    
                                    <button onClick={() => setSelectedItem(item)} className={`mt-auto w-full py-3 font-bold rounded-xl flex items-center justify-center gap-2 transition-colors border ${isDarkMode ? 'bg-gray-700/50 border-gray-600 text-white hover:bg-blue-600 hover:border-blue-600' : 'bg-gray-50 border-gray-200 text-gray-800 hover:bg-blue-600 hover:text-white hover:border-blue-600'} group/btn`}>
                                        <span>Voir les détails</span>
                                        <ArrowRight size={18} className="group-hover/btn:translate-x-1 transition-transform" />
                                    </button>
                                </div>
                            </div>
                        );
                    })}
                </div>
            </div>
        )}

        {/* MODAL RÉSERVATION */}
        {selectedItem && (
            <div className="fixed inset-0 bg-black/60 backdrop-blur-sm z-50 flex items-center justify-center p-4 animate-fade-in">
                <div className={`${isDarkMode ? 'bg-gray-800 text-white border-gray-700' : 'bg-white text-gray-900 border-transparent'} rounded-3xl p-6 md:p-8 max-w-lg w-full relative shadow-2xl animate-modal-pop border`}>
                    <button onClick={() => setSelectedItem(null)} className={`absolute top-4 right-4 p-2 ${isDarkMode ? 'bg-gray-700 text-gray-300' : 'bg-gray-100 text-gray-600'} rounded-full transition-colors`}><X size={20} /></button>
                    <h2 className="text-2xl font-black mb-2">Prêt pour {selectedItem.city} ? 🌴</h2>
                    <p className={`${isDarkMode ? 'text-gray-400' : 'text-gray-500'} mb-6`}>Voici le récapitulatif de votre sélection.</p>
                    <div className={`${isDarkMode ? 'bg-gray-700/50 border-gray-600' : 'bg-blue-50 border-blue-100'} rounded-2xl p-5 mb-6 border`}>
                        <div className="flex justify-between items-center mb-4"><span className="text-sm font-bold uppercase opacity-70">Prestation</span><span className="font-extrabold text-lg">{selectedItem.airline}</span></div>
                        <div className="flex justify-between items-center mb-4"><span className="text-sm font-bold uppercase opacity-70">Température</span><div className="flex items-center gap-1 font-extrabold text-lg text-yellow-500"><Sun size={18} /> {selectedItem.weather.temp}°C</div></div>
                        <div className="h-px w-full bg-current opacity-10 my-4"></div>
                        <div className="flex justify-between items-center"><span className="text-sm font-bold uppercase opacity-70">Prix total</span><span className="text-3xl font-black text-blue-600">{selectedItem.price}€</span></div>
                    </div>
                    <a href={selectedItem.bookingUrl} target="_blank" rel="noreferrer" className="w-full py-4 bg-green-500 hover:bg-green-600 text-white font-black text-lg rounded-2xl flex items-center justify-center gap-2 transition-all shadow-lg shadow-green-500/30">Réserver maintenant <ArrowRight size={20} /></a>
                </div>
            </div>
        )}
      </div>
    </div>
  );
}