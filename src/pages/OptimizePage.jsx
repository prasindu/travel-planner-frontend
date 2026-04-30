import { useState, useEffect } from 'react'
import { ArrowRight, CheckCircle, Loader2, Shuffle, MapPin, ChevronDown, ChevronRight, ChevronLeft, AlertCircle, Route } from 'lucide-react'
import { optimizeRoute } from '../api'
import { useLanguage } from '../context/LanguageContext'

export default function OptimizePage({ startLocation, selectedPlaces, setOptimizedPlaces, setOptimizeResult, onNext, onBack }) {
  const { t } = useLanguage()

  const [loading, setLoading]         = useState(false)
  const [result, setResult]           = useState(null)
  const [error, setError]             = useState(null)
  
  const [endLocation, setEndLocation] = useState('')
  const [isDropdownOpen, setIsDropdownOpen] = useState(false)

  const handleOptimize = async () => {
    const fullRoute = [startLocation, ...selectedPlaces];

    if (fullRoute.length < 3) {
      setOptimizedPlaces(fullRoute)
      setResult({
        originalOrder:  fullRoute,
        optimizedOrder: fullRoute,
        totalDistance:  'N/A',
        skipped: true
      })
      return
    }

    setLoading(true)
    setError(null)
    setResult(null)

    try {
      const data = await optimizeRoute(fullRoute, endLocation)
      setResult(data)
      setOptimizedPlaces(data.optimizedOrder)
      setOptimizeResult && setOptimizeResult(data) 
    } catch (e) {
      setError(t('optimize.error') || 'Optimization failed.')
    } finally {
      setLoading(false)
      setIsDropdownOpen(false)
    }
  }

  useEffect(() => { handleOptimize() }, [])

  const isReordered = result && !result.skipped &&
    JSON.stringify(result.originalOrder) !== JSON.stringify(result.optimizedOrder)

  return (
    <div className="page-enter max-w-3xl mx-auto space-y-8 animate-fade-in">
      
      {/* Header */}
      <div className="text-center pt-8 relative z-10">
        <h1 className="font-display text-4xl md:text-5xl text-white font-bold tracking-tight mb-3">
          {t('optimize.title1')} <span className="text-transparent bg-clip-text bg-gradient-to-r from-lanka-400 to-ocean-400 italic font-light">{t('optimize.title2')}</span>
        </h1>
        <p className="text-white/50 text-sm uppercase tracking-widest">{t('optimize.subtitle')}</p>
      </div>

      {/* 🟢 End Location Selection Section */}
      <div className="card-dark p-6 border-l-4 relative border-l-ocean-500 z-50 shadow-[0_10px_30px_rgba(14,165,233,0.05)]">
        <label className="block text-white/80 text-sm font-semibold uppercase tracking-wider mb-4">
          {t('optimize.endLocationLabel')}
        </label>
        
        <div className="flex flex-col sm:flex-row gap-4 items-start sm:items-center">
          <div className="relative w-full sm:flex-1 z-50">
            <button
              onClick={() => setIsDropdownOpen(!isDropdownOpen)}
              className="w-full flex items-center justify-between input-dark bg-black/20 py-3.5 px-4 text-sm text-left border-white/5 hover:border-white/20 transition-all rounded-xl"
            >
              <span className={endLocation ? "text-white font-medium" : "text-white/40"}>
                {endLocation ? endLocation.split(',')[0] : t('optimize.anywhere')}
              </span>
              <ChevronDown 
                size={18} 
                className={`text-white/40 transition-transform duration-300 ${isDropdownOpen ? 'rotate-180 text-ocean-400' : ''}`} 
              />
            </button>

            {isDropdownOpen && (
              <div className="absolute z-50 w-full mt-2 bg-[#0B0F19]/95 backdrop-blur-xl border border-white/10 rounded-xl shadow-2xl overflow-hidden animate-fade-in">
                <button
                  onClick={() => { setEndLocation(''); setIsDropdownOpen(false); }}
                  className="w-full text-left px-5 py-3.5 text-sm text-white/40 hover:bg-white/5 hover:text-white transition-colors border-b border-white/5"
                >
                  {t('optimize.anywhere')}
                </button>
                
                <div className="max-h-56 overflow-y-auto custom-scrollbar z-10">
                  {selectedPlaces.map(place => (
                    <button
                      key={place}
                      onClick={() => { setEndLocation(place); setIsDropdownOpen(false); }}
                      className={`w-full text-left px-5 py-3.5 text-sm transition-all
                                 ${endLocation === place 
                                   ? 'bg-ocean-500/20 text-ocean-300 border-l-2 border-ocean-500' 
                                   : 'text-white/80 hover:bg-white/5 hover:text-white border-l-2 border-transparent'}`}
                    >
                      {place.split(',')[0]}
                    </button>
                  ))}
                </div>
              </div>
            )}
          </div>
          
          <button 
            onClick={handleOptimize} 
            disabled={loading}
            className="btn-primary py-3.5 px-6 w-full sm:w-auto text-sm font-semibold whitespace-nowrap bg-ocean-500 hover:bg-ocean-600 shadow-lg shadow-ocean-500/25 flex justify-center items-center gap-2 disabled:opacity-50"
          >
            <Shuffle size={16} className={loading ? "animate-spin" : ""} />
            {t('optimize.reoptimizeBtn')}
          </button>
        </div>
        
        <p className="text-white/30 text-xs mt-4 italic">
          {t('optimize.hint')}
        </p>
      </div>

      {/* Loading State */}
      {loading && (
        <div className="card-dark p-12 flex flex-col items-center gap-5 border-dashed border-white/10">
          <div className="relative w-16 h-16">
            <div className="absolute inset-0 rounded-full border-2 border-ocean-500/20 animate-spin-slow" />
            <div className="absolute inset-2 rounded-full border border-lanka-500/30 animate-spin" style={{animationDuration:'1.5s', animationDirection:'reverse'}} />
            <MapPin size={20} className="absolute inset-0 m-auto text-ocean-400" />
          </div>
          <p className="text-white/60 font-medium tracking-wide">{t('optimize.loading')}</p>
        </div>
      )}

      {/* Error State */}
      {error && (
        <div className="card-dark p-6 border-l-4 border-l-red-500 flex items-start gap-4">
          <AlertCircle className="text-red-400 shrink-0 mt-0.5" size={20} />
          <div>
            <p className="text-red-200 text-sm mb-4">{error}</p>
            <button onClick={handleOptimize} className="flex items-center gap-2 btn-primary text-sm py-2 px-5 shadow-red-500/20">
              {t('common.retry')}
            </button>
          </div>
        </div>
      )}

      {/* Result Section */}
      {result && !loading && (
        <div className="space-y-6 animate-fade-in relative z-10">
          
          <div className={`card-dark p-6 flex items-start gap-5 border-l-4 ${isReordered ? 'border-l-lanka-500 bg-lanka-500/5' : 'border-l-forest-500 bg-forest-500/5'}`}>
            <div className={`w-12 h-12 rounded-2xl flex items-center justify-center shrink-0 shadow-inner
                             ${isReordered ? 'bg-lanka-500/20 border border-lanka-500/30' : 'bg-forest-500/20 border border-forest-500/30'}`}>
              {isReordered ? <Shuffle size={20} className="text-lanka-400" /> : <CheckCircle size={20} className="text-forest-400" />}
            </div>
            <div className="flex-1">
              <p className="text-white font-semibold text-base mb-1">
                {result.skipped
                  ? t('optimize.skipped')
                  : isReordered
                  ? t('optimize.reordered')
                  : t('optimize.alreadyOptimal')}
              </p>
              {result.totalDistance && result.totalDistance !== 'N/A' && (
                <p className="text-white/50 text-sm font-medium">
                  {t('optimize.totalDistance')}: <span className="text-white">{result.totalDistance}</span>
                </p>
              )}
            </div>
          </div>

          <div className="card-dark p-6">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 mb-6">
              <p className="text-white/50 text-xs font-bold uppercase tracking-widest flex items-center gap-2">
                <Route size={14} className="text-white/30" />
                {t('optimize.finalRoute')}
              </p>
              {endLocation && (
                <span className="text-ocean-300 text-xs font-semibold bg-ocean-500/10 px-3 py-1 rounded-lg border border-ocean-500/20">
                  {t('optimize.endingAt')}: {endLocation.split(',')[0]}
                </span>
              )}
            </div>
            
            <div className="flex flex-wrap items-center gap-2.5">
              {result.optimizedOrder.map((place, idx) => {
                const isStart = idx === 0;
                const isEnd = endLocation && idx === result.optimizedOrder.length - 1;
                
                return (
                  <span key={idx + place} className="flex items-center gap-2.5">
                    <div className={`border rounded-xl px-4 py-2.5 text-sm font-semibold shadow-sm transition-all
                                     ${isStart ? 'bg-lanka-500/20 border-lanka-500/40 text-lanka-300 shadow-lanka-500/10' 
                                     : isEnd ? 'bg-ocean-500/20 border-ocean-500/40 text-ocean-300 shadow-ocean-500/10'
                                     : 'bg-black/20 border-white/10 text-white/90 hover:bg-white/5 hover:border-white/20'}`}>
                      {(isStart || isEnd) && <MapPin size={14} className="inline mr-2 mb-0.5 opacity-80"/>}
                      {place.split(',')[0]}
                    </div>
                    {idx < result.optimizedOrder.length - 1 && (
                      <ArrowRight size={18} className="text-white/20" />
                    )}
                  </span>
                )
              })}
            </div>
          </div>
          
        </div>
      )}

      {/* Navigation Buttons */}
      <div className="flex items-center justify-between pt-4">
        <button onClick={onBack} className="flex items-center gap-2 text-white/50 hover:text-white transition-colors text-sm px-4 py-2 rounded-lg hover:bg-white/5 font-medium">
          <ChevronLeft size={16} /> {t('common.back')}
        </button>
        <button
          onClick={onNext}
          disabled={!result}
          className="btn-primary py-3 px-6 flex items-center justify-center gap-2 shadow-lanka-500/25 font-semibold
                     disabled:opacity-40 disabled:cursor-not-allowed disabled:shadow-none"
        >
          {t('optimize.nextBtn')} <ChevronRight size={18} />
        </button>
      </div>
    </div>
  )
}