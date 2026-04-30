import { useState, useEffect } from 'react'
import { Bus, Train, Car, ChevronDown, ChevronUp, Loader2, ChevronLeft, ChevronRight, 
         MapPin, Clock, AlertCircle, CheckCircle, RefreshCw, Save } from 'lucide-react'
import { getItinerary } from '../api'
import { useLanguage } from '../context/LanguageContext' // <-- Import Language Hook

export default function ItineraryPage({ optimizedPlaces, startTime, onBack, onSaveTrip }) {
  const { t } = useLanguage() // <-- Initialize Translation Function
  
  const [data, setData]         = useState(null)
  const [loading, setLoading]   = useState(false)
  const [error, setError]       = useState(null)
  const [activeTabs, setTabs]   = useState({})
  const [expanded, setExpanded] = useState({})

  const fetchItinerary = async () => {
    setLoading(true)
    setError(null)
    try {
      const res = await getItinerary(optimizedPlaces, startTime)
      setData(res)
      const tabs = {}
      res.stepByStep.forEach((_, i) => { tabs[i] = 'car' })
      setTabs(tabs)
    } catch (e) {
      setError(t('itinerary.error'))
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => { fetchItinerary() }, [])

  const setTab = (idx, tab) => setTabs(prev => ({ ...prev, [idx]: tab }))
  const toggleExpand = (idx) => setExpanded(prev => ({ ...prev, [idx]: !prev[idx] }))

  return (
    <div className="page-enter max-w-3xl mx-auto space-y-8 animate-fade-in">
      
      {/* Header */}
      <div className="text-center pt-8 relative z-10">
        <h1 className="font-display text-4xl md:text-5xl text-white font-bold tracking-tight mb-3">
          {t('itinerary.title1')} <span className="text-transparent bg-clip-text bg-gradient-to-r from-lanka-400 to-ocean-400 italic font-light">{t('itinerary.title2')}</span>
        </h1>
        <p className="text-white/50 text-sm uppercase tracking-widest">{t('itinerary.subtitle')}</p>
      </div>

      {/* Loading State */}
      {loading && (
        <div className="card-dark p-16 flex flex-col items-center gap-6 border-dashed border-white/10">
          <div className="relative w-24 h-24">
            <div className="absolute inset-0 rounded-full border-2 border-lanka-500/20 animate-spin-slow" />
            <div className="absolute inset-3 rounded-full border border-ocean-500/30 animate-spin" style={{animationDuration:'2s', animationDirection:'reverse'}} />
            <MapPin size={28} className="absolute inset-0 m-auto text-lanka-400 drop-shadow-[0_0_10px_rgba(245,158,11,0.5)]" />
          </div>
          <div className="text-center">
            <p className="text-white font-medium text-lg mb-2">{t('itinerary.loadingTitle')}</p>
            <p className="text-white/40 text-xs">{t('itinerary.loadingSub')}</p>
          </div>
          <div className="flex gap-6 text-xs text-white/40 bg-black/20 px-6 py-3 rounded-full border border-white/5">
            <span className="flex items-center gap-1.5"><Bus size={14} className="text-lanka-400/70"/> {t('itinerary.busRoutes')}</span>
            <span className="flex items-center gap-1.5"><Train size={14} className="text-ocean-400/70"/> {t('itinerary.trainSchedules')}</span>
            <span className="flex items-center gap-1.5"><Car size={14} className="text-forest-400/70"/> {t('itinerary.driving')}</span>
          </div>
        </div>
      )}

      {/* Error State */}
      {error && (
        <div className="card-dark p-6 border-l-4 border-l-red-500 flex items-start gap-4">
          <AlertCircle className="text-red-400 shrink-0 mt-0.5" size={20} />
          <div>
            <p className="text-red-200 text-sm mb-4">{error}</p>
            <button onClick={fetchItinerary} className="flex items-center gap-2 btn-primary text-sm py-2 px-5 shadow-red-500/20">
              <RefreshCw size={14} /> {t('common.retry')}
            </button>
          </div>
        </div>
      )}

      {/* Data View */}
      {data && !loading && (
        <div className="space-y-6 relative z-10">
          
          {/* Top Stats Grid */}
          <div className="grid grid-cols-3 gap-4">
            <div className="card-dark p-5 text-center flex flex-col items-center justify-center">
              <p className="text-white/40 text-xs uppercase tracking-wider mb-2 font-semibold">{t('itinerary.totalStops')}</p>
              <p className="text-3xl font-display text-lanka-400 drop-shadow-md">{data.journey.totalStops}</p>
            </div>
            <div className="card-dark p-5 text-center flex flex-col items-center justify-center">
              <p className="text-white/40 text-xs uppercase tracking-wider mb-2 font-semibold">{t('itinerary.segments')}</p>
              <p className="text-3xl font-display text-ocean-400 drop-shadow-md">{data.journey.totalSegments}</p>
            </div>
            <div className="card-dark p-5 text-center flex flex-col items-center justify-center">
              <p className="text-white/40 text-xs uppercase tracking-wider mb-2 font-semibold">{t('itinerary.startTime')}</p>
              <p className="text-3xl font-display text-forest-400 drop-shadow-md">{data.journey.startTime}</p>
            </div>
          </div>

          {/* Segments */}
          {data.stepByStep.map((seg, idx) => (
            <SegmentCard
              key={idx}
              seg={seg}
              idx={idx}
              activeTab={activeTabs[idx] || 'car'}
              setTab={(tab) => setTab(idx, tab)}
              expanded={expanded[idx]}
              toggleExpand={() => toggleExpand(idx)}
              t={t} // Pass translation function
            />
          ))}

          {/* Done + Save Block */}
          <div className="card-dark p-8 text-center border-t-4 border-t-forest-500 relative overflow-hidden">
            <div className="absolute -top-10 -right-10 w-32 h-32 bg-forest-500/10 rounded-full blur-2xl pointer-events-none" />
            <CheckCircle size={36} className="text-forest-400 mx-auto mb-4 drop-shadow-[0_0_15px_rgba(34,197,94,0.4)]" />
            <p className="text-white font-display text-2xl mb-2">{t('itinerary.readyTitle')}</p>
            
            <div className="flex flex-wrap items-center justify-center gap-1.5 text-white/50 text-xs font-medium mb-6 bg-white/5 p-3 rounded-xl border border-white/5 mx-auto max-w-lg">
              {data.journey.allStops.map((s, i) => (
                <span key={i} className="flex items-center gap-1.5">
                  <span className="text-white/80">{s.split(',')[0]}</span>
                  {i < data.journey.allStops.length - 1 && <ChevronRight size={10} className="text-white/30"/>}
                </span>
              ))}
            </div>

            {onSaveTrip && (
              <button
                onClick={onSaveTrip}
                className="btn-primary inline-flex items-center gap-2 py-3 px-8 bg-gradient-to-r from-forest-500 to-forest-600 hover:from-forest-400 hover:to-forest-500 shadow-lg shadow-forest-500/25 text-sm font-semibold"
              >
                <Save size={16} />
                {t('itinerary.saveBtn')}
              </button>
            )}
          </div>
        </div>
      )}

      {/* Bottom Nav */}
      <div className="flex items-center justify-between pb-10">
        <button onClick={onBack} className="flex items-center gap-2 text-white/50 hover:text-white transition-colors text-sm px-4 py-2 rounded-lg hover:bg-white/5">
          <ChevronLeft size={16} /> {t('common.back')}
        </button>
        {data && (
          <button onClick={fetchItinerary} className="flex items-center gap-2 text-white/50 hover:text-ocean-300 transition-colors text-sm px-4 py-2 rounded-lg hover:bg-ocean-500/10">
            <RefreshCw size={14} /> {t('common.refresh')}
          </button>
        )}
      </div>
    </div>
  )
}

// ─── SegmentCard Component ────────────────────────────────────────────────────────
function SegmentCard({ seg, idx, activeTab, setTab, expanded, toggleExpand, t }) {
  const tabs = [
    { key: 'bus',   label: 'Bus',   icon: Bus,   color: 'text-lanka-400',  bg: 'bg-lanka-500/10',  border: 'border-lanka-500/30'  },
    { key: 'train', label: 'Train', icon: Train, color: 'text-ocean-400',  bg: 'bg-ocean-500/10',  border: 'border-ocean-500/30'  },
    { key: 'car',   label: 'Car',   icon: Car,   color: 'text-forest-400', bg: 'bg-forest-500/10', border: 'border-forest-500/30' },
  ]
  const current = seg.options[activeTab]
  const isAvailable = current?.summary !== 'Not available'

  return (
    <div className="card-dark overflow-hidden group hover:border-white/20 transition-colors duration-300">
      
      {/* Segment Header */}
      <div className="px-6 py-4 border-b border-white/5 flex items-center justify-between bg-white/[0.01]">
        <div className="flex items-center gap-4">
          <div className="w-9 h-9 rounded-xl bg-white/5 border border-white/10 flex items-center justify-center text-white/70 text-sm font-bold shadow-inner">
            {idx + 1}
          </div>
          <div>
            <p className="text-white font-semibold text-base">{seg.title}</p>
            <p className="text-white/40 text-[10px] uppercase tracking-widest">{t('itinerary.segment')} {seg.stepNo}</p>
          </div>
        </div>
        <MapPin size={18} className="text-white/20" />
      </div>

      {/* Tabs */}
      <div className="flex border-b border-white/5 bg-black/20">
        {tabs.map(({ key, label, icon: Icon, color, bg }) => {
          const avail = seg.options[key]?.summary !== 'Not available'
          const isActive = activeTab === key
          return (
            <button key={key} onClick={() => setTab(key)}
              className={`flex-1 flex flex-col items-center justify-center gap-1.5 py-3.5 text-xs font-semibold transition-all duration-300 relative ${
                isActive ? `${color} ${bg}` : 'text-white/40 hover:text-white/70 hover:bg-white/5'
              }`}>
              <Icon size={16} />
              {label}
              {isActive && <div className={`absolute bottom-0 left-0 right-0 h-0.5 ${color.replace('text-', 'bg-')}`} />}
              <div className={`absolute top-2 right-2 w-1.5 h-1.5 rounded-full ${avail ? 'bg-forest-400' : 'bg-white/10'}`} />
            </button>
          )
        })}
      </div>

      {/* Content */}
      <div className="p-6">
        <div className={`flex items-start gap-3 p-4 rounded-xl mb-4 border ${isAvailable ? 'bg-white/5 border-white/10' : 'bg-black/30 border-white/5'}`}>
          {isAvailable
            ? <CheckCircle size={18} className="text-forest-400 mt-0.5 shrink-0" />
            : <AlertCircle size={18} className="text-white/20 mt-0.5 shrink-0" />}
          <p className={`text-sm leading-relaxed ${isAvailable ? 'text-white/90' : 'text-white/30'}`}>
            {current?.summary || t('itinerary.notAvailable')}
          </p>
        </div>

        {isAvailable && current?.details?.length > 0 && (
          <>
            <button onClick={toggleExpand} className="flex items-center gap-2 text-white/50 hover:text-white text-xs font-medium transition-all mb-4 bg-white/5 px-3 py-1.5 rounded-lg border border-white/5 hover:border-white/10">
              {expanded ? <ChevronUp size={14} /> : <ChevronDown size={14} />}
              {expanded ? t('itinerary.hideDetails') : t('itinerary.showDetails')}
            </button>
            
            {expanded && (
              <div className="space-y-3 animate-fade-in">
                {activeTab === 'bus'   && current.details.map((bus, i)  => <BusDetail   key={i} bus={bus} />)}
                {activeTab === 'train' && current.details.map((step, i) => <TrainDetail key={i} step={step} t={t} />)}
                {activeTab === 'car'   && current.details.map((step, i) => <CarDetail   key={i} step={step} />)}
              </div>
            )}
          </>
        )}
      </div>
    </div>
  )
}

function BusDetail({ bus }) {
  return (
    <div className="flex items-start gap-4 bg-black/20 rounded-xl p-4 border border-white/5 hover:border-white/10 transition-colors">
      <div className="p-2 bg-lanka-500/10 rounded-lg shrink-0 border border-lanka-500/20">
        <Bus size={16} className="text-lanka-400" />
      </div>
      <div className="flex-1 min-w-0">
        <div className="flex items-center gap-2 flex-wrap mb-2">
          <span className="bg-lanka-500/20 text-lanka-300 px-2 py-0.5 rounded text-xs font-bold border border-lanka-500/30">{bus.routeNo}</span>
          {bus.serviceType && <span className="bg-ocean-500/20 text-ocean-300 px-2 py-0.5 rounded text-xs font-semibold border border-ocean-500/30">{bus.serviceType}</span>}
        </div>
        <p className="text-white/70 text-sm font-medium">{bus.operator}</p>
        
        {(bus.terminal || bus.arrivalStop) && (
          <div className="mt-3 p-2.5 bg-white/5 rounded-lg text-xs text-white/80 border border-white/5 flex items-center gap-2">
            <MapPin size={12} className="text-lanka-400 shrink-0"/>
            <span className="truncate">{bus.terminal} {bus.arrivalStop ? ` → ${bus.arrivalStop}` : ''}</span>
          </div>
        )}
        
        {bus.instruction && (
          <p className="text-white/50 text-xs italic mt-3 leading-relaxed border-l-2 border-white/10 pl-2">"{bus.instruction}"</p>
        )}
        
        <div className="flex items-center gap-4 mt-3 pt-3 border-t border-white/5 text-xs text-white/40 font-medium">
          {bus.departureTime && bus.departureTime !== 'N/A' && (
            <span className="flex items-center gap-1.5"><Clock size={12} /> {bus.departureTime}</span>
          )}
          {bus.ticketPrice && <span className="bg-white/5 px-2 py-0.5 rounded">{bus.ticketPrice}</span>}
        </div>
      </div>
    </div>
  )
}

function TrainDetail({ step, t }) {
  return (
    <div className="flex items-start gap-4 bg-black/20 rounded-xl p-4 border border-white/5 hover:border-white/10 transition-colors">
      <div className="p-2 bg-ocean-500/10 rounded-lg shrink-0 border border-ocean-500/20">
        <Train size={16} className="text-ocean-400" />
      </div>
      <div className="flex-1 min-w-0">
        <div className="flex items-center gap-2 mb-2">
          <span className="bg-ocean-500/20 text-ocean-300 px-2 py-0.5 rounded text-xs font-bold border border-ocean-500/30">{step.trainName}</span>
          {step.trainNumber !== 'N/A' && <span className="text-white/40 text-[10px] uppercase tracking-wider">#{step.trainNumber}</span>}
        </div>
        <p className="text-white/90 text-sm font-medium flex items-center gap-2">
          {step.fromStation} <ChevronRight size={12} className="text-white/30" /> {step.toStation}
        </p>
        <div className="flex flex-wrap items-center gap-x-4 gap-y-2 mt-3 pt-3 border-t border-white/5 text-xs text-white/50">
          {step.departureTime && <span className="flex items-center gap-1.5"><Clock size={12}/> {step.departureTime} → {step.arrivalTime}</span>}
          {step.stopsCount && <span className="bg-white/5 px-2 py-0.5 rounded">{step.stopsCount} {t('itinerary.stops')}</span>}
          {step.duration && <span>{step.duration}</span>}
        </div>
      </div>
    </div>
  )
}

function CarDetail({ step }) {
  return (
    <div className="flex items-start gap-4 bg-black/20 rounded-xl p-4 border border-white/5 hover:border-white/10 transition-colors">
      <div className="w-6 h-6 rounded-md bg-forest-500/10 text-forest-400 border border-forest-500/20 flex items-center justify-center text-xs font-bold shrink-0 mt-0.5">
        {step.stepNo}
      </div>
      <div className="flex-1 min-w-0">
        <p className="text-white/80 text-sm leading-relaxed">{step.instruction}</p>
        <div className="flex items-center gap-4 mt-3 pt-3 border-t border-white/5 text-xs text-forest-300/60 font-medium">
          <span className="bg-forest-500/10 px-2 py-0.5 rounded border border-forest-500/10">{step.distance}</span>
          <span>{step.duration}</span>
        </div>
      </div>
    </div>
  )
}