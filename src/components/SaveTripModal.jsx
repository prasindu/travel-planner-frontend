import { useState } from 'react'
import { Save, X, Calendar, MapPin, Clock, Loader2, CheckCircle, AlertCircle, ChevronRight } from 'lucide-react'
import { saveTrip } from '../api'
import { useLanguage } from '../context/LanguageContext' // <-- Import Language Hook

export default function SaveTripModal({ 
  optimizedPlaces, 
  startLocation,
  startTime, 
  totalDistance,
  onSaved, 
  onClose 
}) {
  const { t } = useLanguage() // <-- Initialize Translation Function

  const [title, setTitle]     = useState('')
  const [tripDate, setDate]   = useState('')
  const [notes, setNotes]     = useState('')
  const [loading, setLoading] = useState(false)
  const [error, setError]     = useState(null)
  const [saved, setSaved]     = useState(false)

  const today = new Date().toISOString().split('T')[0]

  const handleSave = async () => {
    if (!title.trim()) return setError(t('saveModal.errName'))
    if (!tripDate)     return setError(t('saveModal.errDate'))

    setLoading(true)
    setError(null)
    try {
      const data = await saveTrip({
        title: title.trim(),
        tripDate,
        startLocation: startLocation || optimizedPlaces[0],
        selectedPlaces: optimizedPlaces,
        optimizedOrder: optimizedPlaces,
        startTime: startTime || '06:00',
        totalDistance: totalDistance || 'N/A',
        notes: notes.trim()
      })

      if (data.success) {
        setSaved(true)
        setTimeout(() => {
          onSaved && onSaved(data.trip)
        }, 1500)
      }
    } catch (e) {
      const msg = e?.response?.data?.error
      setError(msg || t('saveModal.errSave'))
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center px-4 animate-fade-in">
      {/* Backdrop */}
      <div className="absolute inset-0 bg-black/80 backdrop-blur-sm transition-opacity" onClick={onClose} />

      {/* Modal Container */}
      <div className="relative w-full max-w-md bg-[#0B0F19]/95 backdrop-blur-2xl border border-white/10 rounded-[2rem] p-7 space-y-6 shadow-[0_0_50px_rgba(0,0,0,0.5)]">
        
        {/* Decorative Ambient Glow */}
        <div className="absolute top-0 right-0 w-48 h-48 bg-forest-500/10 rounded-full blur-[60px] pointer-events-none" />

        {/* Header */}
        <div className="flex items-center justify-between relative z-10">
          <div className="flex items-center gap-4">
            <div className="w-12 h-12 rounded-2xl bg-gradient-to-br from-forest-500/20 to-forest-600/10 border border-forest-500/20 flex items-center justify-center shadow-inner">
              <Save size={20} className="text-forest-400" />
            </div>
            <div>
              <h2 className="text-white font-display text-xl leading-tight">{t('saveModal.title')}</h2>
              <p className="text-white/40 text-xs font-medium uppercase tracking-wider mt-0.5">{t('saveModal.subtitle')}</p>
            </div>
          </div>
          <button onClick={onClose} className="w-8 h-8 flex items-center justify-center rounded-full bg-white/5 hover:bg-white/10 text-white/40 hover:text-white transition-all border border-transparent hover:border-white/10">
            <X size={18} />
          </button>
        </div>

        {saved ? (
          /* Success State */
          <div className="flex flex-col items-center justify-center gap-4 py-10 animate-scale-in relative z-10">
            <div className="w-20 h-20 rounded-full bg-forest-500/10 border border-forest-500/20 flex items-center justify-center mb-2">
              <CheckCircle size={48} className="text-forest-400 drop-shadow-[0_0_15px_rgba(34,197,94,0.5)]" />
            </div>
            <p className="text-white font-display text-xl tracking-wide">{t('saveModal.success')}</p>
          </div>
        ) : (
          /* Form State */
          <div className="space-y-5 relative z-10">
            {/* Trip Title */}
            <div>
              <label className="text-white/70 text-xs font-bold uppercase tracking-wider mb-2 block ml-1">{t('saveModal.tripName')}</label>
              <input
                value={title}
                onChange={e => setTitle(e.target.value)}
                placeholder={t('saveModal.tripNamePlaceholder')}
                className="input-dark w-full py-3.5 px-4 text-sm bg-black/30 border-white/5 focus:border-forest-500/50 focus:ring-forest-500/20 transition-all rounded-xl"
              />
            </div>

            {/* Trip Date */}
            <div>
              <label className="text-white/70 text-xs font-bold uppercase tracking-wider mb-2 flex items-center gap-1.5 ml-1">
                <Calendar size={14} className="text-ocean-400" />
                {t('saveModal.tripDate')}
              </label>
              <input
                type="date"
                value={tripDate}
                min={today}
                onChange={e => setDate(e.target.value)}
                className="input-dark w-full py-3.5 px-4 text-sm bg-black/30 border-white/5 focus:border-forest-500/50 focus:ring-forest-500/20 transition-all rounded-xl [color-scheme:dark]"
              />
            </div>

            {/* Route Preview */}
            <div className="bg-white/[0.03] border border-white/5 rounded-2xl p-4 shadow-inner">
              <p className="text-white/40 text-[10px] font-bold uppercase tracking-widest mb-3 flex items-center gap-1.5">
                <MapPin size={12} className="text-lanka-400" />
                {t('saveModal.route')}
              </p>
              <div className="flex flex-wrap gap-1.5 mb-3">
                {optimizedPlaces.map((p, i) => (
                  <span key={i} className="flex items-center gap-1.5">
                    <span className="text-white/80 text-xs font-medium bg-black/40 border border-white/5 px-2.5 py-1 rounded-lg">
                      {p.split(',')[0]}
                    </span>
                    {i < optimizedPlaces.length - 1 && (
                      <ChevronRight size={10} className="text-white/20" /> // Use text arrow or lucide-react chevron
                    )}
                  </span>
                ))}
              </div>
              <div className="flex items-center gap-4 pt-3 border-t border-white/5 text-white/40 text-xs font-medium">
                <span className="flex items-center gap-1.5">
                  <Clock size={12} className="text-ocean-400" /> {t('saveModal.start')}: {startTime}
                </span>
                {totalDistance && totalDistance !== 'N/A' && (
                  <span className="flex items-center gap-1.5">
                    <MapPin size={12} className="text-forest-400" /> {totalDistance}
                  </span>
                )}
              </div>
            </div>

            {/* Notes */}
            <div>
              <label className="text-white/70 text-xs font-bold uppercase tracking-wider mb-2 block ml-1">{t('saveModal.notes')}</label>
              <textarea
                value={notes}
                onChange={e => setNotes(e.target.value)}
                rows={2}
                placeholder={t('saveModal.notesPlaceholder')}
                className="input-dark w-full py-3 px-4 text-sm bg-black/30 border-white/5 focus:border-forest-500/50 focus:ring-forest-500/20 transition-all rounded-xl resize-none custom-scrollbar"
              />
            </div>

            {/* Error Message */}
            {error && (
              <div className="flex items-start gap-2.5 text-red-300 text-sm bg-red-500/10 border border-red-500/20 rounded-xl px-4 py-3 animate-fade-in">
                <AlertCircle size={16} className="shrink-0 mt-0.5" />
                <span className="leading-tight font-medium">{error}</span>
              </div>
            )}

            {/* Actions */}
            <div className="flex gap-3 pt-2">
              <button 
                onClick={onClose} 
                className="flex-1 py-3.5 rounded-xl font-semibold text-sm text-white/50 hover:text-white bg-white/5 hover:bg-white/10 border border-white/5 transition-all"
              >
                {t('saveModal.cancel')}
              </button>
              <button
                onClick={handleSave}
                disabled={loading}
                className="flex-[1.5] py-3.5 rounded-xl font-semibold text-sm flex items-center justify-center gap-2 bg-gradient-to-r from-forest-500 to-forest-600 hover:from-forest-400 hover:to-forest-500 text-white shadow-lg shadow-forest-500/25 disabled:opacity-50 disabled:shadow-none transition-all"
              >
                {loading
                  ? <><Loader2 size={16} className="animate-spin" /> {t('saveModal.saving')}</>
                  : <><Save size={16} /> {t('saveModal.saveBtn')}</>
                }
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  )
}