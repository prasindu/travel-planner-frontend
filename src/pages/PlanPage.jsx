import { useState } from 'react'
import { MapPin, ArrowRight, Trash2, ChevronRight, ChevronLeft, Clock, GripVertical, Route } from 'lucide-react'
import { useLanguage } from '../context/LanguageContext' // <-- Import Language Hook

export default function PlanPage({ selectedPlaces, setSelectedPlaces, startTime, setStartTime, onNext, onBack }) {
  const { t } = useLanguage() // <-- Initialize Translation Function

  // Array reordering logic
  const moveUp = (idx) => {
    if (idx === 0) return
    const arr = [...selectedPlaces]
    ;[arr[idx - 1], arr[idx]] = [arr[idx], arr[idx - 1]]
    setSelectedPlaces(arr)
  }

  const moveDown = (idx) => {
    if (idx === selectedPlaces.length - 1) return
    const arr = [...selectedPlaces]
    ;[arr[idx], arr[idx + 1]] = [arr[idx + 1], arr[idx]]
    setSelectedPlaces(arr)
  }

  const remove = (idx) => {
    setSelectedPlaces(prev => prev.filter((_, i) => i !== idx))
  }

  const colors = [
    'bg-lanka-500 shadow-lanka-500/20', 
    'bg-ocean-500 shadow-ocean-500/20', 
    'bg-forest-500 shadow-forest-500/20', 
    'bg-purple-500 shadow-purple-500/20', 
    'bg-yellow-500 shadow-yellow-500/20', 
    'bg-pink-500 shadow-pink-500/20'
  ]

  return (
    <div className="page-enter max-w-2xl mx-auto space-y-8 animate-fade-in">
      
      {/* Header */}
      <div className="text-center pt-8 relative z-10">
        <h1 className="font-display text-4xl md:text-5xl text-white font-bold tracking-tight mb-3">
          {t('plan.title1')} <span className="text-transparent bg-clip-text bg-gradient-to-r from-lanka-400 to-ocean-400 italic font-light">{t('plan.title2')}</span>
        </h1>
        <p className="text-white/50 text-sm uppercase tracking-widest">{t('plan.subtitle')}</p>
      </div>

      {/* Start Time Section */}
      <div className="card-dark p-6 border-l-4 border-l-lanka-500 shadow-[0_10px_30px_rgba(245,158,11,0.05)] relative z-10">
        <label className="flex items-center gap-2 text-white/80 text-xs uppercase tracking-wider font-semibold mb-4">
          <Clock size={16} className="text-lanka-400" />
          {t('plan.startTime')}
        </label>
        <input
          type="time"
          value={startTime}
          onChange={e => setStartTime(e.target.value)}
          className="input-dark w-full text-lg font-medium bg-black/20 py-3.5 px-4 rounded-xl border-white/5 hover:border-white/10 transition-colors"
        />
      </div>

      {/* Places List Section */}
      <div className="card-dark p-6 relative z-10">
        <h2 className="flex items-center gap-2 text-white/80 text-xs uppercase tracking-wider font-semibold mb-5">
          <MapPin size={16} className="text-ocean-400" />
          {t('plan.placesList')} ({selectedPlaces.length})
        </h2>

        {selectedPlaces.length === 0 ? (
          <div className="text-center py-10 text-white/30 border border-dashed border-white/5 rounded-2xl bg-black/10">
            <MapPin size={36} className="mx-auto mb-3 opacity-20" />
            <p className="text-sm font-medium">{t('plan.noPlaces')}</p>
          </div>
        ) : (
          <div className="space-y-3">
            {selectedPlaces.map((place, idx) => (
              <div
                key={place}
                className="flex items-center gap-4 bg-black/20 border border-white/5 rounded-2xl px-5 py-3.5 group hover:border-white/20 transition-all duration-300 hover:shadow-lg hover:bg-black/40"
              >
                {/* Visual Grip Icon */}
                <GripVertical size={16} className="text-white/10 group-hover:text-white/30 cursor-grab hidden sm:block" />

                {/* Index Badge */}
                <div className={`w-8 h-8 rounded-xl ${colors[idx % colors.length]} flex items-center justify-center text-white text-xs font-bold shrink-0 shadow-lg`}>
                  {idx + 1}
                </div>

                {/* Place Name */}
                <div className="flex-1 min-w-0">
                  <p className="text-white font-medium text-sm truncate">{place.split(',')[0]}</p>
                  <div className="flex gap-2 mt-1">
                    {idx === 0 && <span className="text-[10px] font-bold uppercase tracking-wider text-forest-400 bg-forest-500/10 px-2 py-0.5 rounded-md">{t('plan.startBadge')}</span>}
                    {idx === selectedPlaces.length - 1 && selectedPlaces.length > 1 && (
                      <span className="text-[10px] font-bold uppercase tracking-wider text-lanka-400 bg-lanka-500/10 px-2 py-0.5 rounded-md">{t('plan.endBadge')}</span>
                    )}
                  </div>
                </div>

                {/* Controls (Up / Down / Delete) */}
                <div className="flex items-center gap-1 opacity-100 sm:opacity-0 sm:group-hover:opacity-100 transition-opacity">
                  <div className="flex flex-col gap-0.5 mr-1">
                    <button 
                      onClick={() => moveUp(idx)} 
                      disabled={idx === 0}
                      className="w-7 h-5 flex items-center justify-center rounded hover:bg-white/10 text-white/40 hover:text-white disabled:opacity-20 transition-all text-xs"
                      title="Move Up"
                    >
                      ▲
                    </button>
                    <button 
                      onClick={() => moveDown(idx)} 
                      disabled={idx === selectedPlaces.length - 1}
                      className="w-7 h-5 flex items-center justify-center rounded hover:bg-white/10 text-white/40 hover:text-white disabled:opacity-20 transition-all text-xs"
                      title="Move Down"
                    >
                      ▼
                    </button>
                  </div>
                  <div className="w-px h-6 bg-white/10 mx-1"></div>
                  <button 
                    onClick={() => remove(idx)}
                    className="w-8 h-8 flex items-center justify-center rounded-lg hover:bg-red-500/20 text-white/40 hover:text-red-400 transition-all"
                    title="Remove Place"
                  >
                    <Trash2 size={14} />
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Route Preview Section */}
      {selectedPlaces.length >= 2 && (
        <div className="card-dark p-6 relative z-10">
          <p className="text-white/50 text-xs font-bold uppercase tracking-widest mb-4 flex items-center gap-2">
            <Route size={14} className="text-white/30" />
            {t('plan.routePreview')}
          </p>
          
          <div className="flex flex-wrap items-center gap-2.5">
            {selectedPlaces.map((place, idx) => (
              <span key={place} className="flex items-center gap-2.5">
                <span className="text-white/90 text-sm font-semibold bg-black/20 border border-white/5 px-3 py-1.5 rounded-lg">
                  {place.split(',')[0]}
                </span>
                {idx < selectedPlaces.length - 1 && (
                  <ChevronRight size={14} className="text-ocean-400" />
                )}
              </span>
            ))}
          </div>
          
          <div className="flex items-center gap-4 mt-5 pt-4 border-t border-white/5 text-white/40 text-xs font-medium">
            <span>{selectedPlaces.length - 1} {t('plan.segments')}</span>
            <span className="flex items-center gap-1.5"><Clock size={12} className="text-lanka-400" /> Start: {startTime}</span>
          </div>
        </div>
      )}

      {/* Navigation Buttons */}
      <div className="flex items-center justify-between pt-2">
        <button onClick={onBack} className="flex items-center gap-2 text-white/50 hover:text-white transition-colors text-sm px-4 py-2 rounded-lg hover:bg-white/5 font-medium">
          <ChevronLeft size={16} /> {t('common.back')}
        </button>
        <button
          onClick={onNext}
          disabled={selectedPlaces.length < 2}
          className="btn-primary py-3 px-6 flex items-center justify-center gap-2 shadow-lanka-500/25 font-semibold
                     disabled:opacity-40 disabled:cursor-not-allowed disabled:shadow-none"
        >
          {t('plan.nextBtn')} <ChevronRight size={18} />
        </button>
      </div>
      
    </div>
  )
}