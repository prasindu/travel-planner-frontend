import { useState } from 'react'
import { 
  ChevronLeft, Mail, Lock, Eye, EyeOff, Globe, LogOut, CheckCircle, Shield, Loader2
} from 'lucide-react'

import { changePassword } from '../api' 
import { useLanguage } from '../context/LanguageContext'

export default function ProfilePage({ user, onBack, onLogout }) {
  const { t, language, toggleLanguage } = useLanguage()

  const [currentPw, setCurrentPw] = useState('')
  const [newPw, setNewPw]         = useState('')
  const [showPw1, setShowPw1]     = useState(false)
  const [showPw2, setShowPw2]     = useState(false)
  const [loading, setLoading]     = useState(false)
  const [message, setMessage]     = useState({ type: '', text: '' }) 

  const handlePasswordChange = async () => {
    if (!currentPw || !newPw) {
      return setMessage({ type: 'error', text: language === 'si' ? 'කරුණාකර මුරපද දෙකම ඇතුළත් කරන්න.' : 'Please enter both passwords.' })
    }
    if (newPw.length < 6) {
      return setMessage({ type: 'error', text: language === 'si' ? 'අලුත් මුරපදය අකුරු 6කට වඩා වැඩි විය යුතුය.' : 'New password must be at least 6 characters.' })
    }

    setLoading(true)
    setMessage({ type: '', text: '' })

    try {
      const res = await changePassword(currentPw, newPw)
      if (res.success) {
        setMessage({ type: 'success', text: language === 'si' ? 'මුරපදය සාර්ථකව වෙනස් කරන ලදී.' : 'Password updated successfully!' })
        setCurrentPw('')
        setNewPw('')
      }
    } catch (e) {
      const errorMsg = e?.response?.data?.error || (language === 'si' ? 'මුරපදය වෙනස් කිරීම අසාර්ථකයි.' : 'Failed to change password.')
      setMessage({ type: 'error', text: errorMsg })
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="min-h-screen dot-grid pb-28 animate-fade-in">
      
      {/* Ambient Glow */}
      <div className="fixed inset-0 pointer-events-none overflow-hidden z-0">
        <div className="absolute top-0 right-0 w-[400px] h-[400px] bg-ocean-500/10 rounded-full blur-[100px]" />
        <div className="absolute bottom-0 left-0 w-[300px] h-[300px] bg-lanka-500/5 rounded-full blur-[100px]" />
      </div>

      {/* Sticky Header - Premium Glass */}
      <div className="sticky top-0 z-40 bg-[#0B0F19]/80 backdrop-blur-2xl border-b border-white/5 shadow-sm">
        <div className="max-w-3xl mx-auto px-4 py-3">
          <div className="flex items-center justify-between">
            <button onClick={onBack} className="flex items-center gap-1 text-white/50 hover:text-white text-sm font-medium transition-colors bg-white/5 px-3 py-1.5 rounded-lg hover:bg-white/10">
              <ChevronLeft size={16} /> {t('common.back', 'Back')}
            </button>
            <h1 className="text-white font-semibold text-lg flex-1 text-center pr-10">
              {t('profile.title', 'Profile & Settings')}
            </h1>
          </div>
        </div>
      </div>

      <div className="max-w-xl mx-auto px-4 pt-8 space-y-6 relative z-10">
        
        {/* ── PROFILE INFO CARD ──────────────────────────────── */}
        <div className="card-dark p-8 flex flex-col items-center border-t-4 border-t-ocean-500 shadow-[0_10px_30px_rgba(14,165,233,0.05)]">
          <div className="w-24 h-24 rounded-full bg-gradient-to-tr from-ocean-600 to-ocean-400 flex items-center justify-center text-white text-4xl font-black shadow-lg shadow-ocean-500/30 mb-4 border-4 border-[#0B0F19]">
            {user?.name ? user.name.charAt(0).toUpperCase() : 'U'}
          </div>
          <h2 className="text-white font-display text-2xl font-bold mb-2">{user?.name || 'Traveler'}</h2>
          <div className="flex items-center gap-2 bg-white/5 px-4 py-1.5 rounded-full border border-white/5 text-white/60 text-sm">
            <Mail size={14} />
            <span>{user?.email || 'email@example.com'}</span>
          </div>
        </div>

        {/* ── LANGUAGE SETTINGS ──────────────────────────────── */}
        <div>
          <p className="text-white/40 text-[10px] font-bold uppercase tracking-widest mb-2 px-1">{t('profile.langTitle', 'App Language')}</p>
          <div className="card-dark p-5 flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="p-2 bg-ocean-500/10 rounded-lg border border-ocean-500/20 text-ocean-400">
                <Globe size={18} />
              </div>
              <span className="text-white/90 text-sm font-semibold">{t('profile.selectLang', 'Select Language')}</span>
            </div>
            
            <div className="flex bg-black/40 p-1 rounded-lg border border-white/5">
              <button 
                onClick={() => { if(language !== 'en') toggleLanguage() }}
                className={`px-4 py-1.5 rounded-md text-xs font-bold transition-all ${language === 'en' ? 'bg-ocean-500 text-white shadow-sm' : 'text-white/40 hover:text-white/80'}`}
              >
                English
              </button>
              <button 
                onClick={() => { if(language !== 'si') toggleLanguage() }}
                className={`px-4 py-1.5 rounded-md text-xs font-bold transition-all ${language === 'si' ? 'bg-ocean-500 text-white shadow-sm' : 'text-white/40 hover:text-white/80'}`}
              >
                සිංහල
              </button>
            </div>
          </div>
        </div>

        {/* ── SECURITY / PASSWORD CHANGE ──────────────────────── */}
        <div>
          <p className="text-white/40 text-[10px] font-bold uppercase tracking-widest mb-2 px-1">{t('profile.securityTitle', 'Security')}</p>
          <div className="card-dark p-6">
            <div className="flex items-center gap-3 mb-6">
              <div className="p-2 bg-forest-500/10 rounded-lg border border-forest-500/20 text-forest-400">
                <Shield size={18} />
              </div>
              <span className="text-white/90 text-sm font-semibold">{t('profile.changePw', 'Change Password')}</span>
            </div>

            <div className="space-y-4 mb-6">
              {/* Current Password */}
              <div className="relative group">
                <Lock className="absolute left-4 top-1/2 -translate-y-1/2 text-white/30 group-focus-within:text-ocean-400 transition-colors" size={18} />
                <input 
                  type={showPw1 ? 'text' : 'password'}
                  value={currentPw}
                  onChange={(e) => setCurrentPw(e.target.value)}
                  placeholder={language === 'si' ? 'දැනට ඇති මුරපදය' : 'Current Password'}
                  className="w-full bg-black/20 border border-white/5 rounded-xl py-3.5 pl-12 pr-12 text-sm text-white focus:outline-none focus:border-ocean-500/50 focus:bg-white/5 transition-all placeholder:text-white/20"
                />
                <button 
                  type="button"
                  onClick={() => setShowPw1(!showPw1)} 
                  className="absolute right-4 top-1/2 -translate-y-1/2 text-white/30 hover:text-white/80 transition-colors"
                >
                  {showPw1 ? <EyeOff size={18} /> : <Eye size={18} />}
                </button>
              </div>

              {/* New Password */}
              <div className="relative group">
                <Lock className="absolute left-4 top-1/2 -translate-y-1/2 text-white/30 group-focus-within:text-ocean-400 transition-colors" size={18} />
                <input 
                  type={showPw2 ? 'text' : 'password'}
                  value={newPw}
                  onChange={(e) => setNewPw(e.target.value)}
                  placeholder={language === 'si' ? 'නව මුරපදය' : 'New Password'}
                  className="w-full bg-black/20 border border-white/5 rounded-xl py-3.5 pl-12 pr-12 text-sm text-white focus:outline-none focus:border-ocean-500/50 focus:bg-white/5 transition-all placeholder:text-white/20"
                />
                <button 
                  type="button"
                  onClick={() => setShowPw2(!showPw2)} 
                  className="absolute right-4 top-1/2 -translate-y-1/2 text-white/30 hover:text-white/80 transition-colors"
                >
                  {showPw2 ? <EyeOff size={18} /> : <Eye size={18} />}
                </button>
              </div>
            </div>

            {/* Status Message */}
            {message.text && (
              <div className={`flex items-center gap-2 p-3 rounded-xl mb-6 border text-xs font-medium animate-fade-in
                ${message.type === 'success' ? 'bg-forest-500/10 border-forest-500/30 text-forest-400' : 'bg-red-500/10 border-red-500/30 text-red-400'}`}
              >
                {message.type === 'success' ? <CheckCircle size={16} /> : <Shield size={16} />}
                <span>{message.text}</span>
              </div>
            )}

            <button 
              onClick={handlePasswordChange}
              disabled={loading}
              className="w-full py-3.5 rounded-xl bg-ocean-500/10 border border-ocean-500/20 text-ocean-300 text-sm font-bold
                         hover:bg-ocean-500/20 hover:text-white hover:shadow-lg hover:shadow-ocean-500/10 transition-all flex items-center justify-center gap-2 disabled:opacity-50"
            >
              {loading ? <><Loader2 size={18} className="animate-spin" /> {language === 'si' ? 'වෙනස් කරමින්...' : 'Updating...'}</> : t('profile.updatePwBtn', 'Update Password')}
            </button>
          </div>
        </div>

        {/* ── LOGOUT BUTTON ──────────────────────────────────── */}
        <button 
          onClick={onLogout}
          className="w-full mt-8 py-4 rounded-xl flex items-center justify-center gap-2 text-red-400 bg-red-500/10 border border-red-500/20 hover:bg-red-500/20 hover:text-red-300 transition-all font-bold text-sm"
        >
          <LogOut size={18} />
          {t('nav.logout', 'Log Out')}
        </button>

      </div>
    </div>
  )
}