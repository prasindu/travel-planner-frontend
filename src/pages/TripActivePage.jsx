import { useState, useEffect, useCallback } from 'react'
import {
  MapPin, ChevronRight, ChevronLeft, Navigation, Check,
  AlertTriangle, RefreshCw, Loader2, Map, List,
  Bus, Train, Car // <-- New Icons imported
} from 'lucide-react'
import { updateTripStatus, getItinerary, getWeather } from '../api' // <-- Added getItinerary & getWeather
import { useLanguage } from '../context/LanguageContext'

// ── Weather helpers ───────────────────────────────────────────
const getWeatherIcon = (condition) => {
  const icons = { Clear: '☀️', Clouds: '☁️', Rain: '🌧️', Drizzle: '🌦️', Thunderstorm: '⛈️', Snow: '❄️', Mist: '🌫️' }
  return icons[condition] || '🌤️'
}

// ── Google Maps URL builder ───────────────────────────────────
const buildMapsUrl = (places, currentIdx) => {
  if (!places || places.length < 2) return null
  const origin = encodeURIComponent(places[currentIdx] + ', Sri Lanka') 
  const dest   = encodeURIComponent(places[places.length - 1] + ', Sri Lanka')
  const remainingPlaces = places.slice(currentIdx + 1, -1)
  const wps    = remainingPlaces.length > 0 ? remainingPlaces.map(p => encodeURIComponent(p + ', Sri Lanka')).join('|') : ''
  const key    = import.meta.env.VITE_GOOGLE_MAPS_KEY || ''
  return `https://www.google.com/maps/embed/v1/directions?key=${key}&origin=${origin}&destination=${dest}${wps ? `&waypoints=${wps}` : ''}&mode=driving`
}

// ── Build Google Maps navigation URL for current stop ─────────
const buildNavUrl = (from, to) => {
  const f = encodeURIComponent(from + ', Sri Lanka')
  const t = encodeURIComponent(to  + ', Sri Lanka')
  return `https://www.google.com/maps/dir/?api=1&origin=${f}&destination=${t}&travelmode=driving`
}

export default function TripActivePage({ trip, onBack, onComplete }) {
  const { t } = useLanguage() 

  const [currentIdx, setCurrentIdx]     = useState(trip.currentStopIndex || 0)
  const [view, setView]                 = useState('map')  // 'map' | 'list'
  
  // States for API Data
  const [weatherData, setWeatherData]   = useState({})     
  const [loadingWx, setLoadingWx]       = useState({})
  const [showAlerts, setShowAlerts]     = useState({})
  
  // New States for Transit Options
  const [transitOptions, setTransitOptions] = useState(null)
  const [loadingTransit, setLoadingTransit] = useState(false)
  const [activeTransitTab, setActiveTransitTab] = useState('car')
  
  const [saving, setSaving]             = useState(false)

  const stops = trip.optimizedOrder || []
  const currentPlace  = stops[currentIdx]
  const nextPlace     = stops[currentIdx + 1]

  // 1. Weather Fetcher using updated ../api
  const fetchWeatherForStop = useCallback(async (place) => {
    if (!place || weatherData[place] || loadingWx[place]) return
    setLoadingWx(prev => ({ ...prev, [place]: true }))
    try {
      const geocodeUrl = `https://maps.googleapis.com/maps/api/geocode/json?address=${encodeURIComponent(place + ', Sri Lanka')}&key=${import.meta.env.VITE_GOOGLE_MAPS_KEY || ''}`
      const geoRes = await fetch(geocodeUrl)
      const geoData = await geoRes.json()

      if (geoData.status === 'OK' && geoData.results[0]) {
        const { lat, lng } = geoData.results[0].geometry.location
        
        // Use standard API function
        const wx = await getWeather({ lat, lng, city: place.split(',')[0], locationName: place, locationType: 'tourist_attraction' })
        
        if (wx && wx.success) {
          setWeatherData(prev => ({ ...prev, [place]: wx }))
          if (wx.rerouteSuggested) {
            setShowAlerts(prev => ({ ...prev, [place]: true }))
          }
        }
      }
    } catch (e) {
      console.log('Weather fetch failed for', place)
    } finally {
      setLoadingWx(prev => ({ ...prev, [place]: false }))
    }
  }, [weatherData, loadingWx])

  // 2. Transit Options Fetcher
  const fetchTransitOptions = useCallback(async (from, to) => {
    if (!from || !to) return
    setLoadingTransit(true)
    try {
      const res = await getItinerary([from, to], "08:00")
      if (res && res.stepByStep && res.stepByStep.length > 0) {
        setTransitOptions(res.stepByStep[0].options)
      } else {
        setTransitOptions(null)
      }
    } catch (error) {
      console.log('Transit fetch failed', error)
      setTransitOptions(null)
    } finally {
      setLoadingTransit(false)
    }
  }, [])

  // 3. Centralized Loading Logic
  useEffect(() => {
    const loadRequiredData = async () => {
      await fetchWeatherForStop(currentPlace)
      if (nextPlace) {
        Promise.all([
          fetchWeatherForStop(nextPlace),
          fetchTransitOptions(currentPlace, nextPlace)
        ]).catch(e => console.log("Failed to load next stop data", e))
      } else {
        setTransitOptions(null)
      }
    }
    loadRequiredData()
  }, [currentIdx])

  const handleNextStop = async () => {
    if (currentIdx >= stops.length - 1) return
    const newIdx = currentIdx + 1
    setCurrentIdx(newIdx)
    try { await updateTripStatus(trip._id, 'active', newIdx) } catch {}
  }

  const handleComplete = async () => {
    setSaving(true)
    try {
      await updateTripStatus(trip._id, 'completed', stops.length - 1)
      onComplete && onComplete()
    } catch {}
    setSaving(false)
  }

  const currentWx    = weatherData[currentPlace]
  const isLastStop   = currentIdx === stops.length - 1
  const progress     = stops.length > 1 ? (currentIdx / (stops.length - 1)) * 100 : 100

  return (
    <div className="min-h-screen dot-grid pb-28 animate-fade-in">
      
      {/* Ambient Glow */}
      <div className="fixed inset-0 pointer-events-none overflow-hidden z-0">
        <div className="absolute -top-40 right-0 w-[500px] h-[500px] bg-lanka-500/10 rounded-full blur-[120px]" />
      </div>

      {/* Sticky Header - Premium Glass */}
      <div className="sticky top-0 z-40 bg-[#0B0F19]/80 backdrop-blur-2xl border-b border-white/5 shadow-sm">
        <div className="max-w-3xl mx-auto px-4 py-3">
          <div className="flex items-center justify-between mb-3">
            <button onClick={onBack} className="flex items-center gap-1 text-white/50 hover:text-white text-sm font-medium transition-colors bg-white/5 px-3 py-1.5 rounded-lg hover:bg-white/10">
              <ChevronLeft size={16} /> {t('common.back')}
            </button>
            <div className="text-center flex-1 px-4">
              <p className="text-white font-semibold text-base line-clamp-1">{trip.title}</p>
              <p className="text-white/40 text-[10px] uppercase tracking-widest font-bold mt-0.5">
                {t('activeTrip.stops')} {currentIdx + 1} / {stops.length}
              </p>
            </div>
            <div className="flex gap-1 bg-black/20 p-1 rounded-xl border border-white/5">
              {['map', 'list'].map(v => (
                <button
                  key={v}
                  onClick={() => setView(v)}
                  className={`p-2 rounded-lg transition-all ${view === v ? 'bg-white/10 text-white shadow-sm' : 'text-white/40 hover:text-white/80'}`}
                >
                  {v === 'map' ? <Map size={16} /> : <List size={16} />}
                </button>
              ))}
            </div>
          </div>

          {/* Progress bar */}
          <div className="h-1.5 bg-black/40 rounded-full overflow-hidden border border-white/5">
            <div
              className="h-full bg-gradient-to-r from-lanka-500 to-ocean-500 rounded-full transition-all duration-700 relative"
              style={{ width: `${progress}%` }}
            >
              <div className="absolute inset-0 bg-white/20 w-full animate-pulse-soft" />
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-3xl mx-auto px-4 pt-6 space-y-6 relative z-10">

        {/* ── CURRENT STOP CARD ──────────────────────────────── */}
        <div className="card-dark p-6 border-t-4 border-t-lanka-500 shadow-[0_10px_30px_rgba(245,158,11,0.05)]">
          <div className="flex items-start justify-between mb-5">
            <div>
              <p className="text-lanka-400 text-xs font-bold uppercase tracking-widest mb-1.5 flex items-center gap-1.5">
                <MapPin size={12} /> {t('activeTrip.currentStop')}
              </p>
              <h2 className="text-white font-display text-3xl leading-tight">{currentPlace?.split(',')[0]}</h2>
              {currentPlace?.includes(',') && (
                <p className="text-white/40 text-sm mt-1">{currentPlace?.split(',').slice(1).join(',').trim()}</p>
              )}
            </div>
            <div className="w-14 h-14 rounded-2xl bg-lanka-500/10 border border-lanka-500/20 flex items-center justify-center text-3xl shadow-inner">
              {getWeatherIcon(currentWx?.weather?.condition)}
            </div>
          </div>

          {/* Weather for current stop */}
          {loadingWx[currentPlace] ? (
            <div className="flex items-center gap-2 text-white/40 text-xs py-3 font-medium">
              <Loader2 size={14} className="animate-spin" /> {t('activeTrip.weatherLoading')}
            </div>
          ) : currentWx && (
            <div className="bg-black/20 border border-white/5 rounded-xl p-4 mb-4 backdrop-blur-sm">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-4">
                  <span className="text-3xl drop-shadow-md">{getWeatherIcon(currentWx.weather.condition)}</span>
                  <div>
                    <p className="text-white font-display text-2xl">{Math.round(currentWx.weather.temperature)}°C</p>
                    <p className="text-white/50 text-xs uppercase tracking-wider font-semibold">{currentWx.weather.condition}</p>
                  </div>
                </div>
                <div className="flex flex-col gap-1.5 text-xs text-white/50 font-medium items-end border-l border-white/10 pl-4">
                  <span>💧 {currentWx.weather.humidity}%</span>
                  <span>💨 {currentWx.weather.windSpeed}m/s</span>
                </div>
              </div>
            </div>
          )}

          {/* Weather Alert for current stop */}
          {currentWx?.rerouteSuggested && showAlerts[currentPlace] && (
            <div className="bg-yellow-500/10 border border-yellow-500/20 rounded-xl p-5 mb-4 animate-fade-in shadow-lg shadow-yellow-500/5">
              <div className="flex items-center gap-2 mb-2">
                <AlertTriangle size={18} className="text-yellow-400 drop-shadow-md" />
                <p className="text-yellow-400 text-sm font-bold uppercase tracking-wider">{t('activeTrip.weatherAlert')}</p>
              </div>
              <p className="text-yellow-200/80 text-sm mb-4 leading-relaxed">{currentWx.message}</p>
              
              {currentWx.alternatives?.length > 0 && (
                <div>
                  <p className="text-white/60 text-[10px] font-bold uppercase tracking-widest mb-3">{t('activeTrip.indoorSuggestions')}</p>
                  <div className="space-y-2.5">
                    {currentWx.alternatives.map((alt, i) => (
                      <div key={i} className="flex items-start gap-2.5 bg-black/30 rounded-lg p-3 border border-white/5">
                        <span className="text-yellow-500 text-sm mt-0.5">›</span>
                        <div>
                          <p className="text-white/90 text-sm font-medium">{alt.name}</p>
                          <p className="text-white/40 text-xs mt-0.5">{alt.address}</p>
                          {alt.rating && <p className="text-yellow-400/80 text-[10px] font-bold mt-1">★ {alt.rating}</p>}
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}
              <button
                onClick={() => setShowAlerts(prev => ({ ...prev, [currentPlace]: false }))}
                className="mt-4 text-yellow-500/70 hover:text-yellow-400 text-xs font-semibold uppercase tracking-wider transition-colors"
              >
                {t('activeTrip.dismiss')} ✕
              </button>
            </div>
          )}

          {/* Navigate button */}
          {nextPlace && (
            <a
              href={buildNavUrl(currentPlace, nextPlace)}
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center justify-center gap-2 w-full py-3.5 rounded-xl 
                         bg-ocean-500/10 border border-ocean-500/20 text-ocean-300 text-sm font-semibold
                         hover:bg-ocean-500/20 hover:shadow-lg hover:shadow-ocean-500/10 transition-all"
            >
              <Navigation size={16} />
              {t('activeTrip.navigateBtn')} → {nextPlace?.split(',')[0]}
            </a>
          )}
        </div>

        {/* ── MAP VIEW ───────────────────────────────────────── */}
        {view === 'map' && (
          <div className="card-dark overflow-hidden p-0 border-white/10 shadow-xl">
            <div className="px-5 py-3.5 border-b border-white/5 flex items-center justify-between bg-white/[0.02]">
              <div className="flex items-center gap-2">
                <Map size={16} className="text-ocean-400" />
                <span className="text-white/80 text-sm font-semibold uppercase tracking-wider">{t('activeTrip.routeMap')}</span>
              </div>
            </div>
            <div className="h-[350px] bg-black/20 relative">
              {import.meta.env.VITE_GOOGLE_MAPS_KEY ? (
                <iframe
                  src={buildMapsUrl(stops, currentIdx)}
                  className="w-full h-full"
                  style={{ border: 0 }}
                  allowFullScreen
                  loading="lazy"
                  referrerPolicy="no-referrer-when-downgrade"
                  title="Trip Route Map"
                />
              ) : (
                <div className="flex flex-col items-center justify-center h-full text-center px-6">
                  <Map size={48} className="text-white/10 mb-4" />
                  <p className="text-white/50 text-sm mb-2 font-medium">{t('activeTrip.noMapEmbed')}</p>
                  <p className="text-white/30 text-xs bg-white/5 px-3 py-1.5 rounded-md">
                    {t('activeTrip.mapKeyMissing')}
                  </p>
                  <a
                    href={`https://www.google.com/maps/dir/${stops.map(s => encodeURIComponent(s + ' Sri Lanka')).join('/')}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="mt-5 text-ocean-400 text-xs font-semibold bg-ocean-500/10 px-4 py-2 rounded-lg border border-ocean-500/20 hover:bg-ocean-500/20"
                  >
                    {t('activeTrip.openMapBtn')}
                  </a>
                </div>
              )}
            </div>
          </div>
        )}

        {/* ── LIST VIEW ──────────────────────────────────────── */}
        {view === 'list' && (
          <div className="card-dark p-5">
            <p className="text-white/50 text-[10px] uppercase tracking-widest font-bold mb-4">{t('activeTrip.allStops')}</p>
            <div className="space-y-2.5">
              {stops.map((place, idx) => {
                const wx = weatherData[place]
                const isPast    = idx < currentIdx
                const isCurrent = idx === currentIdx

                return (
                  <div
                    key={idx}
                    className={`flex items-center gap-4 p-3.5 rounded-xl border transition-all
                               ${isCurrent ? 'bg-lanka-500/10 border-lanka-500/30 shadow-md' :
                                 isPast ? 'bg-black/20 border-white/5 opacity-50' :
                                 'bg-white/5 border-white/10'}`}
                  >
                    <div className={`w-8 h-8 rounded-xl flex items-center justify-center text-xs font-bold shrink-0
                                    ${isCurrent ? 'bg-lanka-500 text-white shadow-lg' :
                                      isPast ? 'bg-forest-500/60 text-white' :
                                      'bg-black/30 text-white/40 border border-white/10'}`}>
                      {isPast ? <Check size={14} /> : idx + 1}
                    </div>

                    <div className="flex-1 min-w-0">
                      <p className={`text-sm font-semibold truncate ${isCurrent ? 'text-white' : 'text-white/70'}`}>
                        {place.split(',')[0]}
                      </p>
                      {isCurrent && <p className="text-lanka-400 text-[10px] uppercase tracking-widest font-bold mt-0.5">{t('activeTrip.youAreHere')}</p>}
                    </div>

                    {wx && (
                      <div className="flex items-center gap-1.5 text-xs text-white/60 font-medium shrink-0 bg-black/20 px-2.5 py-1 rounded-lg border border-white/5">
                        <span className="text-lg leading-none">{getWeatherIcon(wx.weather.condition)}</span>
                        <span>{Math.round(wx.weather.temperature)}°</span>
                        {wx.rerouteSuggested && <AlertTriangle size={12} className="text-yellow-400 ml-1" />}
                      </div>
                    )}
                    {loadingWx[place] && <Loader2 size={14} className="text-white/20 animate-spin shrink-0" />}
                  </div>
                )
              })}
            </div>
          </div>
        )}

        {/* ── NEXT STOP & TRANSIT PREVIEW ──────────────────────────────── */}
        {nextPlace && (
          <div className="card-dark p-5 border-l-4 border-l-ocean-500 bg-ocean-500/5">
            <p className="text-ocean-400 text-[10px] font-bold uppercase tracking-widest mb-3">{t('activeTrip.nextStopTitle')}</p>
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <span className="text-4xl drop-shadow-md">{getWeatherIcon(weatherData[nextPlace]?.weather?.condition)}</span>
                <div>
                  <p className="text-white font-semibold text-lg">{nextPlace.split(',')[0]}</p>
                  {weatherData[nextPlace] && (
                    <p className="text-white/50 text-xs font-medium mt-0.5 flex items-center gap-1.5">
                      <span className="bg-white/10 px-1.5 rounded">{Math.round(weatherData[nextPlace].weather.temperature)}°C</span>
                      <span>{weatherData[nextPlace].weather.condition}</span>
                      {weatherData[nextPlace].rerouteSuggested && <span className="text-yellow-400">⚠️ Rain!</span>}
                    </p>
                  )}
                </div>
              </div>
              {loadingWx[nextPlace] && <Loader2 size={18} className="text-white/20 animate-spin" />}
            </div>

            {/* Added Transit Options Block */}
            {loadingTransit ? (
              <div className="mt-5 pt-5 border-t border-ocean-500/10 flex justify-center p-2">
                 <Loader2 size={18} className="animate-spin text-ocean-400" />
              </div>
            ) : transitOptions && (
              <div className="mt-5 pt-5 border-t border-ocean-500/10 animate-fade-in">
                <p className="text-white/40 text-[10px] uppercase tracking-widest font-bold mb-3">{t('itinerary.howToGetThere', 'HOW TO GET THERE')}</p>
                
                {/* Transit Tabs */}
                <div className="flex bg-black/30 p-1.5 rounded-xl mb-3 border border-white/5">
                  {[
                    { key: 'car', icon: Car, label: t('itinerary.driving', 'Drive'), color: 'text-forest-400', bg: 'bg-forest-500/20' },
                    { key: 'train', icon: Train, label: t('itinerary.trainSchedules', 'Train'), color: 'text-ocean-400', bg: 'bg-ocean-500/20' },
                    { key: 'bus', icon: Bus, label: t('itinerary.busRoutes', 'Bus'), color: 'text-lanka-400', bg: 'bg-lanka-500/20' },
                  ].map(({ key, icon: Icon, label, color, bg }) => {
                    const isAvailable = transitOptions[key]?.summary !== 'Not available';
                    const isActive = activeTransitTab === key;
                    return (
                      <button
                        key={key}
                        onClick={() => setActiveTransitTab(key)}
                        className={`flex-1 flex items-center justify-center gap-2 py-2.5 text-xs font-semibold rounded-lg transition-all relative ${isActive ? `${bg} ${color}` : 'text-white/40 hover:text-white/80 hover:bg-white/5'}`}
                      >
                        <Icon size={14} /> {label}
                        {!isAvailable && !isActive && <div className="absolute top-2 right-3 w-1.5 h-1.5 rounded-full bg-red-500/80" />}
                      </button>
                    )
                  })}
                </div>

                {/* Transit Content Summary */}
                <div className="bg-white/[0.02] border border-white/5 rounded-xl p-4 shadow-inner">
                  {transitOptions[activeTransitTab]?.summary !== 'Not available' ? (
                    <p className="text-white/80 text-xs leading-relaxed">
                      {transitOptions[activeTransitTab]?.summary}
                    </p>
                  ) : (
                    <p className="text-red-400/80 text-xs flex items-center gap-2">
                      <AlertTriangle size={14} /> {t('itinerary.notAvailable', 'Not available for this route.')}
                    </p>
                  )}
                </div>
              </div>
            )}
          </div>
        )}
      </div>

      {/* ── BOTTOM NAV BAR ─────────────────────────────────────── */}
      <div className="fixed bottom-0 left-0 right-0 z-50 bg-[#0B0F19]/90 backdrop-blur-2xl border-t border-white/10 pb-safe">
        <div className="max-w-3xl mx-auto px-4 py-4 flex gap-3">
          {/* Enhanced Refresh Logic to re-fetch Weather AND Transit options */}
          <button
            onClick={() => {
              setWeatherData(prev => { 
                const n = {...prev}
                delete n[currentPlace]
                if(nextPlace) delete n[nextPlace]
                return n 
              })
              fetchWeatherForStop(currentPlace)
              if (nextPlace) {
                fetchWeatherForStop(nextPlace)
                fetchTransitOptions(currentPlace, nextPlace)
              }
            }}
            className="w-14 h-14 flex items-center justify-center rounded-2xl border border-white/10 bg-white/5
                       text-white/60 hover:text-white hover:bg-white/10 transition-all shadow-inner"
          >
            <RefreshCw size={20} />
          </button>

          {/* Main action */}
          {isLastStop ? (
            <button
              onClick={handleComplete}
              disabled={saving}
              className="btn-primary flex-1 h-14 flex items-center justify-center gap-2 rounded-2xl
                         bg-gradient-to-r from-forest-500 to-forest-600 hover:from-forest-400 hover:to-forest-500 
                         disabled:opacity-50 shadow-lg shadow-forest-500/25 text-base font-semibold"
            >
              {saving
                ? <><Loader2 size={18} className="animate-spin" /> {t('activeTrip.saving')}</>
                : <><Check size={20} /> {t('activeTrip.tripComplete')}</>
              }
            </button>
          ) : (
            <button
              onClick={handleNextStop}
              className="btn-primary flex-1 h-14 flex items-center justify-center gap-2 rounded-2xl shadow-lanka-500/25 text-base font-semibold"
            >
              {t('activeTrip.nextStopBtn')} → {nextPlace?.split(',')[0]}
            </button>
          )}
        </div>
      </div>
    </div>
  )
}

