import { useState, useEffect } from 'react'
import {
  MapPin, Plus, Calendar, Clock, Route, Trash2,
  Play, Loader2, AlertCircle, ChevronRight, Navigation,
  LayoutDashboard, LogOut, Globe, User
} from 'lucide-react'
import { getMyTrips, deleteTrip } from '../api'
import { useLanguage } from '../context/LanguageContext' 

export default function DashboardPage({ user, onNewTrip, onStartTrip, onLogout, onProfile }) { 
  const { t, language, toggleLanguage } = useLanguage(); 
  
  const [trips, setTrips]     = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError]     = useState(null)
  const [deleting, setDeleting] = useState(null)

  useEffect(() => { fetchTrips() }, [])

  const fetchTrips = async () => {
    setLoading(true)
    setError(null)
    try {
      const data = await getMyTrips()
      setTrips(data.trips || [])
    } catch {
      setError(t('common.retry') + ' / Trips load failed.')
    } finally {
      setLoading(false)
    }
  }

  const handleDelete = async (id, e) => {
    e.stopPropagation()
    const confirmMsg = language === 'si' ? 'මෙම ගමන මකා දැමීමට අවශ්‍යද?' : 'Are you sure you want to delete this trip?'
    if (!window.confirm(confirmMsg)) return
    
    setDeleting(id)
    try {
      await deleteTrip(id)
      setTrips(prev => prev.filter(t => t._id !== id))
    } catch {
      alert('Delete failed.')
    } finally {
      setDeleting(null)
    }
  }

  const statusColor = (status) => {
    if (status === 'active')    return 'bg-lanka-500/20 text-lanka-300 border-lanka-500/30'
    if (status === 'completed') return 'bg-forest-500/20 text-forest-300 border-forest-500/30'
    return 'bg-white/8 text-white/50 border-white/10'
  }
  
  const statusLabel = (status) => {
    return t(`dashboard.status.${status}`) || status
  }

  const formatDate = (dateStr) => {
    const d = new Date(dateStr)
    const locale = language === 'si' ? 'si-LK' : 'en-US'
    return d.toLocaleDateString(locale, { year: 'numeric', month: 'long', day: 'numeric' })
  }

  const isTripToday = (dateStr) => {
    const trip = new Date(dateStr)
    const today = new Date()
    return trip.toDateString() === today.toDateString()
  }

  const isTripFuture = (dateStr) => new Date(dateStr) >= new Date()

  return (
    <div className="min-h-screen dot-grid animate-fade-in">
      
      {/* Ambient glows - Premium Look */}
      <div className="fixed inset-0 pointer-events-none overflow-hidden z-0">
        <div className="absolute -top-40 -right-40 w-96 h-96 bg-lanka-500/10 rounded-full blur-[100px]" />
        <div className="absolute -bottom-40 -left-40 w-96 h-96 bg-ocean-500/10 rounded-full blur-[100px]" />
      </div>

      {/* ── Dashboard Navbar (Main Navbar එකේ UI එකටම සමානයි) ── */}
      <nav className="fixed top-0 left-0 right-0 z-50 border-b border-white/5 bg-[#0B0F19]/80 backdrop-blur-2xl transition-all duration-300">
        <div className="max-w-4xl mx-auto px-6 h-16 flex items-center justify-between">
          
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-xl bg-gradient-to-br from-lanka-400 to-lanka-600 shadow-lg shadow-lanka-500/20 flex items-center justify-center">
              <Navigation size={18} className="text-white" />
            </div>
            <div className="hidden sm:block">
              <span className="font-display font-semibold text-white tracking-wide text-lg leading-none block">
                {t('nav.appName')}
              </span>
            </div>
          </div>

          <div className="flex items-center gap-3">
            
            {/* Language Toggle */}
            <button 
              onClick={toggleLanguage}
              className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-white/5 hover:bg-white/10 border border-white/5 text-white/70 hover:text-white transition-all text-xs font-medium"
            >
              <Globe size={14} />
              {t('nav.langToggle')}
            </button>

            {/* Profile Button (Clickable Avatar) */}
            <button
              onClick={onProfile}
              title="Profile & Settings"
              className="w-8 h-8 rounded-full bg-lanka-500/30 border border-lanka-500/40 flex items-center justify-center text-lanka-300 text-xs font-bold hover:bg-lanka-500/50 hover:text-white hover:shadow-[0_0_10px_rgba(245,158,11,0.3)] transition-all cursor-pointer"
            >
              {user?.name?.charAt(0).toUpperCase() || 'U'}
            </button>
            
            {/* Logout Button */}
            <button
              onClick={onLogout}
              className="w-8 h-8 flex items-center justify-center rounded-lg bg-red-500/10 text-red-400 hover:bg-red-500/20 transition-all"
              title={t('nav.logout')}
            >
              <LogOut size={14} />
            </button>
            
          </div>
        </div>
      </nav>

      <main className="relative z-10 pt-28 pb-16 px-4 max-w-4xl mx-auto">

        {/* Header Section */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-5 mb-10">
          <div>
            <h1 className="font-display text-4xl text-white mb-2 flex items-center gap-3">
              <div className="p-2.5 bg-lanka-500/10 rounded-xl border border-lanka-500/20 shadow-inner">
                <LayoutDashboard size={28} className="text-lanka-400" />
              </div>
              {t('dashboard.title')}
            </h1>
            <p className="text-white/40 text-sm ml-16">{t('dashboard.subtitle')}</p>
          </div>
          <button
            onClick={onNewTrip}
            className="btn-primary flex items-center justify-center gap-2 py-3 px-6 shadow-lanka-500/25"
          >
            <Plus size={18} />
            {t('dashboard.newTripBtn')}
          </button>
        </div>

        {/* Loading State */}
        {loading && (
          <div className="flex flex-col items-center justify-center py-20 gap-4">
            <div className="relative">
              <div className="w-16 h-16 rounded-full border-2 border-lanka-500/20" />
              <Loader2 size={32} className="absolute inset-0 m-auto text-lanka-400 animate-spin" />
            </div>
          </div>
        )}

        {/* Error State */}
        {error && (
          <div className="card-dark p-5 flex items-center gap-3 border-l-4 border-l-red-500">
            <AlertCircle size={20} className="text-red-400 shrink-0" />
            <p className="text-red-200 text-sm">{error}</p>
          </div>
        )}

        {/* Empty State */}
        {!loading && trips.length === 0 && (
          <div className="card-dark p-16 text-center border-dashed border-white/10">
            <div className="w-24 h-24 bg-white/5 rounded-full flex items-center justify-center mx-auto mb-6">
              <Route size={40} className="text-white/20" />
            </div>
            <p className="text-white/70 text-2xl font-display mb-2">{t('dashboard.noTrips')}</p>
            <p className="text-white/40 text-sm mb-8">{t('dashboard.noTripsSub')}</p>
            <button onClick={onNewTrip} className="btn-primary inline-flex items-center gap-2 py-3 px-6">
              <Plus size={18} /> {t('dashboard.createTripBtn')}
            </button>
          </div>
        )}

        {/* Trips Grid */}
        {!loading && trips.length > 0 && (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {trips.map(trip => (
              <div
                key={trip._id}
                className={`card-dark overflow-hidden transition-all duration-300 hover:-translate-y-1.5 hover:shadow-2xl cursor-pointer relative group
                           ${trip.status === 'active' ? 'ring-2 ring-lanka-500/50 shadow-[0_0_20px_rgba(239,68,68,0.1)]' : 'hover:border-white/20'}`}
              >
                {/* Today badge */}
                {isTripToday(trip.tripDate) && trip.status === 'planned' && (
                  <div className="absolute top-4 right-4 bg-gradient-to-r from-lanka-500 to-ocean-500 text-white text-[10px] uppercase tracking-widest px-3 py-1 rounded-full font-bold shadow-lg z-10">
                    Today!
                  </div>
                )}

                <div className="p-6 flex flex-col h-full">
                  {/* Title + Status */}
                  <div className="flex items-start justify-between gap-3 mb-5">
                    <h3 className="text-white font-semibold text-xl leading-snug line-clamp-2 group-hover:text-lanka-400 transition-colors">
                      {trip.title}
                    </h3>
                    {!isTripToday(trip.tripDate) && (
                      <span className={`shrink-0 text-[10px] uppercase tracking-wider px-2.5 py-1.5 rounded-lg border font-bold ${statusColor(trip.status)}`}>
                        {statusLabel(trip.status)}
                      </span>
                    )}
                  </div>

                  {/* Meta Details */}
                  <div className="space-y-2.5 mb-6 bg-white/5 p-3.5 rounded-xl border border-white/5">
                    <div className="flex items-center gap-3 text-white/70 text-xs">
                      <Calendar size={14} className="text-ocean-400" />
                      {formatDate(trip.tripDate)}
                    </div>
                    <div className="flex items-center gap-3 text-white/70 text-xs">
                      <Clock size={14} className="text-lanka-400" />
                      {trip.startTime}
                    </div>
                    <div className="flex items-center gap-3 text-white/70 text-xs">
                      <MapPin size={14} className="text-forest-400" />
                      {trip.optimizedOrder?.length || 0} {t('dashboard.places')}
                      {trip.totalDistance && trip.totalDistance !== 'N/A' && <span className="opacity-50">· {trip.totalDistance}</span>}
                    </div>
                  </div>

                  {/* Route preview */}
                  <div className="flex flex-wrap items-center gap-2 mb-6">
                    {(trip.optimizedOrder || []).slice(0, 3).map((p, i) => (
                      <span key={i} className="flex items-center gap-2">
                        <span className="text-white/60 text-xs font-medium bg-black/30 px-2 py-1 rounded-md border border-white/5">{p.split(',')[0]}</span>
                        {i < Math.min(trip.optimizedOrder.length - 1, 2) && (
                          <ChevronRight size={12} className="text-white/20" />
                        )}
                      </span>
                    ))}
                    {trip.optimizedOrder?.length > 3 && (
                      <span className="text-white/40 text-[10px] font-bold uppercase tracking-wider bg-white/5 px-2 py-1 rounded-md">+{trip.optimizedOrder.length - 3}</span>
                    )}
                  </div>

                  {/* Actions (pushed to bottom) */}
                  <div className="flex gap-3 mt-auto pt-2">
                    {(isTripToday(trip.tripDate) || trip.status === 'active') && trip.status !== 'completed' && (
                      <button
                        onClick={() => onStartTrip(trip)}
                        className="btn-primary flex-1 py-3 text-sm flex items-center justify-center gap-2 shadow-lanka-500/20"
                      >
                        {trip.status === 'active'
                          ? <><Navigation size={16} /> {t('dashboard.continueBtn')}</>
                          : <><Play size={16} /> {t('dashboard.startBtn')}</>
                        }
                      </button>
                    )}

                    {trip.status !== 'active' && !isTripToday(trip.tripDate) && (
                      <button
                        onClick={() => onStartTrip(trip)}
                        className="flex-1 py-3 text-sm flex items-center justify-center gap-2
                                   bg-white/5 border border-white/10 text-white/70 hover:text-white hover:bg-white/10 
                                   rounded-xl transition-all font-medium"
                      >
                        <MapPin size={16} /> {t('dashboard.viewBtn')}
                      </button>
                    )}

                    <button
                      onClick={(e) => handleDelete(trip._id, e)}
                      disabled={deleting === trip._id}
                      className="w-12 h-12 flex items-center justify-center rounded-xl border border-white/10 bg-white/5
                                 text-white/40 hover:text-red-400 hover:border-red-500/30 hover:bg-red-500/10 
                                 transition-all disabled:opacity-40"
                    >
                      {deleting === trip._id
                        ? <Loader2 size={16} className="animate-spin" />
                        : <Trash2 size={16} />
                      }
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </main>
    </div>
  )
}