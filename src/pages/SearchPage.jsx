import { useState } from 'react'
import { Search, MapPin, Star, Plus, ChevronRight, Loader2, Globe, Navigation, Home, Target, LocateFixed } from 'lucide-react'
import { getSuggestions } from '../api' 
import { useLanguage } from '../context/LanguageContext' // <-- Import Language Hook

export default function SearchPage({ 
  startLocation = '', 
  setStartLocation = () => {}, 
  selectedPlaces = [], 
  setSelectedPlaces = () => {}, 
  onNext = () => {} 
}) {
  const { t } = useLanguage(); // <-- Initialize Translation Function

  const [city, setCity]           = useState('')
  const [searchType, setSearchType] = useState('city')
  const [suggestions, setSuggs]   = useState([])
  const [loading, setLoading]     = useState(false)
  const [error, setError]         = useState(null)
  const [searched, setSearched]   = useState(false)
  const [locating, setLocating]   = useState(false) 

  const popularCities = ['Colombo', 'Kandy', 'Galle', 'Nuwara Eliya', 'Ella', 'Sigiriya']

  const handleSearch = async (searchQuery = city, type = searchType) => {
    if (!searchQuery.trim()) return
    setLoading(true)
    setError(null)
    setSuggs([])
    try {
      const data = await getSuggestions(searchQuery, type)
      setSuggs(data.suggestions || [])
      setSearched(true)
    } catch (e) {
      setError('Backend server connect error.')
    } finally {
      setLoading(false)
    }
  }

  const handleCurrentLocation = () => {
    if (!navigator.geolocation) {
      setError("Geolocation not supported.");
      return;
    }
    setLocating(true);
    setError(null);

    navigator.geolocation.getCurrentPosition(
      async (position) => {
        const { latitude, longitude } = position.coords;
        try {
          const response = await fetch(`https://nominatim.openstreetmap.org/reverse?format=json&lat=${latitude}&lon=${longitude}&accept-language=en`);
          const data = await response.json();
          if (data && data.address) {
            const placeName = data.address.city || data.address.town || data.address.village || data.address.suburb;
            if (placeName) {
              setStartLocation(`${placeName}, Sri Lanka`); 
            } else {
              setStartLocation(`${latitude},${longitude}`);
            }
          } else {
            setStartLocation(`${latitude},${longitude}`);
          }
        } catch (err) {
          setStartLocation(`${latitude},${longitude}`);
        } finally {
          setLocating(false);
        }
      },
      (err) => {
        setLocating(false);
        setError("Location access denied.");
      }
    );
  }

  const addPlace = (name) => {
    if (!selectedPlaces.includes(name)) setSelectedPlaces(prev => [...prev, name])
  }
  const removePlace = (name) => {
    setSelectedPlaces(prev => prev.filter(p => p !== name))
  }

  return (
    <div className="page-enter space-y-8 animate-fade-in">
      
      {/* Hero Header - Professional Glass UI */}
      <div className="text-center py-10 relative">
        <div className="inline-flex items-center gap-2 bg-gradient-to-r from-lanka-500/10 to-ocean-500/10 border border-white/10 text-lanka-300 text-xs uppercase tracking-widest font-semibold px-5 py-2 rounded-full mb-6 backdrop-blur-sm">
          <Globe size={14} />
          {t('search.heroSub')}
        </div>
        <h1 className="font-display text-5xl md:text-6xl text-white font-bold tracking-tight mb-4 leading-tight">
          {t('search.heroTitle1')} <span className="text-transparent bg-clip-text bg-gradient-to-r from-lanka-400 to-ocean-400 italic font-light">{t('search.heroTitle2')}</span>
        </h1>
      </div>

      <div className="max-w-2xl mx-auto space-y-6 relative z-10">
        
        {/* 1. Start Location Input */}
        <div className="card-dark p-6 border-l-4 border-l-lanka-500">
          <label className="flex items-center justify-between text-white/80 text-xs uppercase tracking-wider font-semibold mb-4">
            <span className="flex items-center gap-2">
              <Home size={16} className="text-lanka-400" />
              {t('search.startPointTitle')}
            </span>
          </label>
          <div className="relative flex items-center">
            <Navigation size={18} className="absolute left-4 top-1/2 -translate-y-1/2 text-white/30" />
            <input
              value={startLocation}
              onChange={e => setStartLocation(e.target.value)}
              placeholder={t('search.startPlaceholder')}
              className="input-dark pl-12 pr-12 w-full py-4 text-sm"
            />
            <button 
              onClick={handleCurrentLocation}
              disabled={locating}
              className="absolute right-3 top-1/2 -translate-y-1/2 p-2 text-lanka-400 hover:text-white transition-colors bg-lanka-500/10 hover:bg-lanka-500/20 rounded-lg disabled:opacity-50"
            >
              {locating ? <Loader2 size={16} className="animate-spin" /> : <LocateFixed size={16} />}
            </button>
          </div>
        </div>

        {/* 2. Add Places Search Box */}
        <div className="card-dark p-6">
          <label className="flex items-center gap-2 text-white/80 text-xs uppercase tracking-wider font-semibold mb-5">
            <MapPin size={16} className="text-ocean-400" />
            {t('search.searchPlacesTitle')}
          </label>

          <div className="flex gap-2 mb-5 bg-black/30 p-1.5 rounded-xl border border-white/5">
            <button
              onClick={() => setSearchType('city')}
              className={`flex-1 py-2.5 text-sm rounded-lg transition-all font-medium ${searchType === 'city' ? 'bg-ocean-500 text-white shadow-lg shadow-ocean-500/20' : 'text-white/50 hover:text-white'}`}
            >
              {t('search.searchCityBtn')}
            </button>
            <button
              onClick={() => setSearchType('specific')}
              className={`flex-1 py-2.5 text-sm rounded-lg transition-all font-medium ${searchType === 'specific' ? 'bg-ocean-500 text-white shadow-lg shadow-ocean-500/20' : 'text-white/50 hover:text-white'}`}
            >
              {t('search.searchSpecificBtn')}
            </button>
          </div>

          <div className="relative">
            {searchType === 'city' ? (
              <Search size={18} className="absolute left-4 top-1/2 -translate-y-1/2 text-white/30" />
            ) : (
              <Target size={18} className="absolute left-4 top-1/2 -translate-y-1/2 text-white/30" />
            )}
            <input
              value={city}
              onChange={e => setCity(e.target.value)}
              onKeyDown={e => e.key === 'Enter' && handleSearch()}
              placeholder={searchType === 'city' ? t('search.searchCityPlaceholder') : t('search.searchSpecificPlaceholder')}
              className="input-dark pl-12 pr-32 w-full py-4 text-sm"
            />
            <button
              onClick={() => handleSearch()}
              disabled={loading || !city.trim()}
              className="absolute right-2 top-1/2 -translate-y-1/2 btn-primary py-2 px-6 text-sm"
            >
              {loading ? <Loader2 size={16} className="animate-spin" /> : t('search.searchBtn')}
            </button>
          </div>

          {searchType === 'city' && (
            <div className="mt-5 flex flex-wrap gap-2">
              {popularCities.map(c => (
                <button
                  key={c}
                  onClick={() => { setCity(c); setSearchType('city'); handleSearch(c, 'city'); }}
                  className="text-xs text-white/50 hover:text-white/90 border border-white/10 hover:border-white/30 hover:bg-white/5 px-4 py-2 rounded-full transition-all duration-200"
                >
                  {c}
                </button>
              ))}
            </div>
          )}
        </div>
      </div>

      {/* Error */}
      {error && (
        <div className="max-w-2xl mx-auto bg-red-500/10 border border-red-500/25 rounded-xl px-5 py-4 text-red-300 text-sm">
          ⚠️ {error}
        </div>
      )}

      {/* 3. Selected Places Summary & Next Button */}
      {selectedPlaces.length > 0 && (
        <div className="max-w-2xl mx-auto card-dark p-6 border-l-4 border-l-forest-500">
          <div className="flex items-center justify-between mb-5">
            <span className="text-xs uppercase tracking-wider font-semibold text-white/80 flex items-center gap-2">
              <MapPin size={16} className="text-forest-400"/>
              {t('search.selectedPlaces')} ({selectedPlaces.length})
            </span>
            
            {selectedPlaces.length >= 1 && startLocation.trim() !== '' ? (
              <button onClick={onNext} className="btn-primary py-2.5 px-5 text-sm flex items-center gap-2 bg-forest-500 hover:bg-forest-600 shadow-forest-500/25">
                {t('search.nextBtn')} <ChevronRight size={16} />
              </button>
            ) : (
              <p className="text-xs text-red-400 font-medium bg-red-500/10 px-3 py-1.5 rounded-lg border border-red-500/20">
                {startLocation.trim() === '' ? t('search.noPlacesErr') : t('search.selectAtLeastOneErr')}
              </p>
            )}
          </div>
          
          <div className="flex flex-wrap gap-2">
            {selectedPlaces.map(p => (
              <div key={p} className="flex items-center gap-2 bg-forest-500/10 border border-forest-500/20 text-forest-200 text-sm px-4 py-2 rounded-xl">
                <MapPin size={12} className="text-forest-400" />
                {p}
                <button onClick={() => removePlace(p)} className="text-forest-400 hover:text-white hover:bg-forest-500/30 w-5 h-5 rounded-full flex items-center justify-center transition-colors ml-1">×</button>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Suggestions Grid */}
      {suggestions.length > 0 && (
        <div className="max-w-5xl mx-auto pt-10 border-t border-white/5">
          <h2 className="font-display text-2xl text-white mb-6 flex items-center gap-3">
            <div className="p-2 bg-ocean-500/20 rounded-lg border border-ocean-500/30">
              <Star size={20} className="text-ocean-400" />
            </div>
            {searchType === 'city' ? `${city} ${t('search.nearbyPlaces')}` : `"${city}" ${t('search.searchResults')}`}
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
            {suggestions.map((place, idx) => (
              <PlaceCard
                key={place.place_id || idx}
                place={place}
                isSelected={selectedPlaces.includes(place.name)}
                onAdd={() => addPlace(place.name)}
                onRemove={() => removePlace(place.name)}
                t={t} // Pass translation function to child
              />
            ))}
          </div>
        </div>
      )}
    </div>
  )
}

function PlaceCard({ place, isSelected, onAdd, onRemove, t }) {
  const [imgErr, setImgErr] = useState(false)

  return (
    <div className={`card-dark p-0 overflow-hidden transition-all duration-300 hover:-translate-y-1.5
                     ${isSelected ? 'ring-2 ring-forest-500/60 shadow-[0_0_20px_rgba(34,197,94,0.15)]' : ''}`}>
      {/* Photo */}
      <div className="h-44 bg-black/40 relative overflow-hidden group">
        {place.photoUrl && !imgErr ? (
          <img
            src={place.photoUrl}
            alt={place.name}
            className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
            onError={() => setImgErr(true)}
          />
        ) : (
          <div className="w-full h-full dot-grid flex items-center justify-center">
            <MapPin size={32} className="text-white/10" />
          </div>
        )}
        
        {place.isOpenNow !== 'N/A' && (
          <div className={`absolute top-3 right-3 text-[10px] uppercase tracking-widest px-2.5 py-1 rounded-full font-bold shadow-lg backdrop-blur-md
                          ${place.isOpenNow ? 'bg-forest-500/80 text-white' : 'bg-red-500/80 text-white'}`}>
            {place.isOpenNow ? t('search.open') : t('search.closed')}
          </div>
        )}
        {isSelected && (
          <div className="absolute inset-0 bg-forest-500/20 flex items-center justify-center backdrop-blur-[2px] transition-all">
            <div className="bg-forest-500 rounded-full w-12 h-12 flex items-center justify-center shadow-2xl scale-in">
              <span className="text-white font-bold text-xl">✓</span>
            </div>
          </div>
        )}
      </div>

      {/* Info */}
      <div className="p-5">
        <h3 className="font-semibold text-white text-base leading-snug mb-1.5 line-clamp-1">{place.name}</h3>
        <p className="text-white/40 text-xs line-clamp-1 mb-4">{place.address}</p>

        <div className="flex items-center justify-between mt-auto">
          <div className="flex items-center gap-1.5 bg-white/5 px-2.5 py-1 rounded-lg border border-white/5">
            <Star size={12} className="text-lanka-400 fill-lanka-400" />
            <span className="text-xs font-semibold text-white">{place.rating}</span>
            <span className="text-white/30 text-[10px]">({place.userRatingsTotal})</span>
          </div>
          <button
            onClick={isSelected ? onRemove : onAdd}
            className={`flex items-center gap-1.5 text-xs font-semibold px-4 py-2 rounded-xl transition-all duration-200 ${
              isSelected
                ? 'bg-red-500/10 text-red-400 border border-red-500/20 hover:bg-red-500/20'
                : 'bg-ocean-500/10 text-ocean-300 border border-ocean-500/20 hover:bg-ocean-500/20 hover:shadow-lg hover:shadow-ocean-500/10'
            }`}
          >
            {isSelected ? `− ${t('search.remove')}` : <><Plus size={14} /> {t('search.add')}</>}
          </button>
        </div>
      </div>
    </div>
  )
}