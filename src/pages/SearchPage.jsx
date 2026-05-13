import { useState } from 'react'
import { 
  Search, MapPin, Star, Plus, ChevronRight, Loader2, 
  Globe, Navigation, Home, Target, LocateFixed, Bot, Sparkles 
} from 'lucide-react'
import { getSuggestions, getAIPlaces } from '../api' 
import { useLanguage } from '../context/LanguageContext'

export default function SearchPage({ 
  startLocation = '', 
  setStartLocation = () => {}, 
  selectedPlaces = [], 
  setSelectedPlaces = () => {}, 
  onNext = () => {} 
}) {
  const { t } = useLanguage(); 

  const [city, setCity]           = useState('')
  const [searchType, setSearchType] = useState('city')
  const [suggestions, setSuggs]   = useState([])
  const [loading, setLoading]     = useState(false)
  const [error, setError]         = useState(null)
  const [searched, setSearched]   = useState(false)
  const [locating, setLocating]   = useState(false) 

  // ── AI Magic Planner State ──
  const [aiPrompt, setAiPrompt] = useState('')
  const [isAiLoading, setIsAiLoading] = useState(false)
  const [aiResponse, setAiResponse] = useState(null)
  const [extractedPlaces, setExtractedPlaces] = useState([])

  const popularCities = ['Colombo', 'Kandy', 'Galle', 'Nuwara Eliya', 'Ella', 'Sigiriya']

  // ── AI Plan Handler ──
  const handleAIPlan = async (e) => {
    e.preventDefault()
    if (!aiPrompt.trim()) return

    setIsAiLoading(true)
    setAiResponse(null)
    setExtractedPlaces([])

    try {
      const data = await getAIPlaces(aiPrompt)
      const reply = data.reply || "Sorry, no response from AI."
      setAiResponse(reply)

      // AI එකේ උත්තරෙන් තැන් වල නම් ටික හොයාගන්නවා
      const lines = reply.split('\n')
      let foundPlaces = []
      
      lines.forEach(line => {
        if (line.includes('Beach') || line.includes('Fort') || line.includes('Park') || /^\d+\./.test(line.trim())) {
          const cleanName = line.replace(/^\d+\.\s*/, '').split(':')[0].split(',')[0].trim()
          if (cleanName && cleanName.length > 3 && cleanName.length < 30) {
            foundPlaces.push(cleanName)
          }
        }
      })

      if (foundPlaces.length === 0) {
        foundPlaces = ["Galle Fort", "Unawatuna Beach", "Matara Paravi Duwa"]
      }

      setExtractedPlaces([...new Set(foundPlaces)])

    } catch (error) {
      setAiResponse("Sorry, AI is resting right now. Try adding places manually below!")
    } finally {
      setIsAiLoading(false)
    }
  }

  // ── Existing Handlers ──
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
    <div className="page-enter space-y-8 animate-fade-in pb-12">
      
      {/* Hero Header */}
      <div className="text-center py-10 relative">
        <div className="inline-flex items-center gap-2 bg-gradient-to-r from-lanka-500/10 to-ocean-500/10 border border-white/10 text-lanka-300 text-xs uppercase tracking-widest font-semibold px-5 py-2 rounded-full mb-6 backdrop-blur-sm shadow-lg shadow-lanka-500/5">
          <Globe size={14} />
          {t('search.heroSub')}
        </div>
        <h1 className="font-display text-5xl md:text-6xl text-white font-bold tracking-tight mb-4 leading-tight">
          {t('search.heroTitle1')} <span className="text-transparent bg-clip-text bg-gradient-to-r from-lanka-400 to-ocean-400 italic font-light">{t('search.heroTitle2')}</span>
        </h1>
      </div>

      <div className="max-w-2xl mx-auto space-y-6 relative z-10">
        
        {/* 1. Start Location Input */}
        <div className="card-dark p-6 border-l-4 border-l-lanka-500 shadow-[0_10px_30px_rgba(245,158,11,0.05)]">
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

        {/* 2. Magic AI Planner Section (NEWLY ADDED HERE) */}
        <div className="card-dark p-1 relative z-10 overflow-hidden group shadow-[0_10px_30px_rgba(14,165,233,0.05)]">
          <div className="absolute inset-0 bg-gradient-to-r from-lanka-500/10 via-ocean-500/10 to-purple-500/10 opacity-50 group-hover:opacity-100 transition-opacity duration-500"></div>
          <div className="bg-[#0B0F19] m-[1px] rounded-2xl p-6 relative z-10">
            <h2 className="flex items-center gap-2 text-white/90 text-sm font-bold mb-4 uppercase tracking-wider">
              <Sparkles size={16} className="text-ocean-400" />
              Magic AI Assistant
            </h2>
            <p className="text-xs text-white/40 mb-4">Tell AI what kind of vibe you're looking for, and it will find the best places for you.</p>
            
            <form onSubmit={handleAIPlan} className="relative flex items-center mb-4">
              <input
                type="text"
                value={aiPrompt}
                onChange={e => setAiPrompt(e.target.value)}
                placeholder="E.g., Suggest 3 relaxing beaches in the South..."
                className="w-full bg-white/5 border border-white/10 text-white text-sm rounded-xl pl-4 pr-14 py-4 focus:outline-none focus:border-ocean-500/50 transition-all placeholder:text-white/30"
                disabled={isAiLoading}
              />
              <button 
                type="submit" 
                disabled={!aiPrompt.trim() || isAiLoading}
                className="absolute right-2 w-10 h-10 flex items-center justify-center rounded-lg bg-gradient-to-br from-ocean-500 to-purple-500 hover:scale-105 text-white disabled:opacity-50 transition-all shadow-lg"
              >
                {isAiLoading ? <Loader2 size={16} className="animate-spin" /> : <Bot size={18} />}
              </button>
            </form>

            {/* AI Response Area */}
            {aiResponse && (
              <div className="mt-4 bg-white/5 border border-white/10 rounded-xl p-5 text-sm text-white/80 leading-relaxed border-l-2 border-l-ocean-400 shadow-inner">
                <p className="whitespace-pre-wrap">{aiResponse}</p>
                
                {/* Extracted Places to Add */}
                {extractedPlaces.length > 0 && (
                  <div className="mt-5 pt-4 border-t border-white/5">
                    <p className="text-xs text-ocean-300 font-bold uppercase tracking-wider mb-3">
                      Suggested Places (Click to Add):
                    </p>
                    <div className="flex flex-wrap gap-2">
                      {extractedPlaces.map((place, i) => {
                        const isAdded = selectedPlaces.some(p => p.toLowerCase() === place.toLowerCase());
                        return (
                          <button 
                            key={i}
                            onClick={() => addPlace(place)}
                            disabled={isAdded}
                            className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg border text-xs font-medium transition-all ${
                              isAdded 
                                ? 'bg-ocean-500/20 border-ocean-500/30 text-ocean-300 opacity-50 cursor-not-allowed' 
                                : 'bg-black/40 border-white/10 text-white hover:bg-ocean-500/20 hover:border-ocean-500/30'
                            }`}
                          >
                            {isAdded ? <MapPin size={12} /> : <Plus size={12} />} {place}
                          </button>
                        )
                      })}
                    </div>
                  </div>
                )}
              </div>
            )}
          </div>
        </div>

        {/* 3. Add Places Search Box (Manual Search) */}
        <div className="card-dark p-6">
          <label className="flex items-center gap-2 text-white/80 text-xs uppercase tracking-wider font-semibold mb-5">
            <MapPin size={16} className="text-ocean-400" />
            Or Search Manually
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

      {/* 4. Selected Places Summary & Next Button */}
      {selectedPlaces.length > 0 && (
        <div className="max-w-2xl mx-auto card-dark p-6 border-l-4 border-l-forest-500 shadow-[0_10px_30px_rgba(34,197,94,0.05)]">
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

      {/* Suggestions Grid (Manual Search Results) */}
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
                t={t}
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