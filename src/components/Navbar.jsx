import { MapPin, Navigation, LayoutDashboard, LogOut, Globe } from 'lucide-react'
import { useLanguage } from '../context/LanguageContext'

export default function Navbar({ currentStep, user, onDashboard, onLogout }) {
  const { t, toggleLanguage } = useLanguage();
  
  // භාෂාවට අනුව steps වල නම් ලබාගැනීම
  const steps = [
    t('nav.steps.search'), 
    t('nav.steps.plan'), 
    t('nav.steps.optimize'), 
    t('nav.steps.itinerary')
  ];

  return (
    <nav className="fixed top-0 left-0 right-0 z-50 border-b border-white/5 bg-[#0B0F19]/70 backdrop-blur-2xl transition-all duration-300">
      <div className="max-w-6xl mx-auto px-6 h-16 flex items-center justify-between">
        
        {/* Logo */}
        <div className="flex items-center gap-3">
          <div className="w-9 h-9 rounded-xl bg-gradient-to-br from-lanka-400 to-lanka-600 shadow-lg shadow-lanka-500/20 flex items-center justify-center">
            <Navigation size={18} className="text-white" />
          </div>
          <div className="hidden sm:block">
            <span className="font-display font-semibold text-white tracking-wide text-lg leading-none block">
              {t('nav.appName')}
            </span>
            <span className="text-white/40 text-[10px] tracking-wider uppercase">
              {t('nav.appDesc')}
            </span>
          </div>
        </div>

        {/* Step indicators */}
        <div className="hidden md:flex items-center gap-1">
          {steps.map((step, idx) => (
            <div key={step} className="flex items-center gap-1">
              <div className={`flex items-center gap-2 px-3 py-1.5 rounded-lg text-sm transition-all duration-300 ${
                idx + 1 === currentStep
                  ? 'bg-lanka-500/20 text-lanka-300 border border-lanka-500/30 font-medium'
                  : idx + 1 < currentStep
                  ? 'text-white/40'
                  : 'text-white/25'
              }`}>
                <span className={`w-4 h-4 rounded-full flex items-center justify-center text-[10px] ${
                  idx + 1 < currentStep ? 'bg-forest-500 text-white' :
                  idx + 1 === currentStep ? 'bg-lanka-500 text-white' :
                  'bg-white/10 text-white/30'
                }`}>
                  {idx + 1 < currentStep ? '✓' : idx + 1}
                </span>
                {step}
              </div>
              {idx < steps.length - 1 && (
                <div className={`w-6 h-px ${idx + 1 < currentStep ? 'bg-forest-500/50' : 'bg-white/10'}`} />
              )}
            </div>
          ))}
        </div>

        {/* Right: user + lang toggle + dashboard + logout */}
        <div className="flex items-center gap-3">
          
          <button 
            onClick={toggleLanguage}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-white/5 hover:bg-white/10 border border-white/5 text-white/70 hover:text-white transition-all text-xs font-medium"
          >
            <Globe size={14} />
            {t('nav.langToggle')}
          </button>

          {user && (
            <>
              <button
                onClick={onDashboard}
                className="hidden sm:flex items-center gap-1.5 text-white/60 hover:text-white text-xs px-3 py-1.5 rounded-lg transition-all hover:bg-white/5"
              >
                <LayoutDashboard size={14} /> {t('nav.dashboard')}
              </button>
              <div className="w-8 h-8 rounded-full bg-lanka-500/30 border border-lanka-500/40 flex items-center justify-center text-lanka-300 text-xs font-bold">
                {user.name?.charAt(0).toUpperCase()}
              </div>
              <button
                onClick={onLogout}
                className="w-8 h-8 flex items-center justify-center rounded-lg bg-red-500/10 text-red-400 hover:bg-red-500/20 transition-all"
                title={t('nav.logout')}
              >
                <LogOut size={14} />
              </button>
            </>
          )}
        </div>
      </div>
    </nav>
  )
}