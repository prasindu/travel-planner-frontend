import { useState } from 'react'
import { Navigation, Mail, Lock, User, Eye, EyeOff, Loader2, AlertCircle, Globe } from 'lucide-react'
import { login, register } from '../api'
import { useLanguage } from '../context/LanguageContext' // <-- Import Language Hook

export default function LoginPage({ onAuthSuccess }) {
  const { t, toggleLanguage, language } = useLanguage(); // <-- Initialize Language Hook

  const [mode, setMode]         = useState('login') // 'login' | 'register'
  const [name, setName]         = useState('')
  const [email, setEmail]       = useState('')
  const [password, setPassword] = useState('')
  const [showPw, setShowPw]     = useState(false)
  const [loading, setLoading]   = useState(false)
  const [error, setError]       = useState(null)

  const handleSubmit = async () => {
    // 1. Frontend Validations (Simple translations for errors)
    if (!email || !password) {
      return setError(language === 'si' ? 'කරුණාකර ඊමේල් ලිපිනය සහ මුරපදය ඇතුළත් කරන්න.' : 'Please enter your email and password.')
    }
    if (mode === 'register' && !name) {
      return setError(language === 'si' ? 'කරුණාකර ඔබගේ නම ඇතුළත් කරන්න.' : 'Please enter your name.')
    }
    if (mode === 'register' && password.length < 6) {
      return setError(language === 'si' ? 'මුරපදය අකුරු/ඉලක්කම් 6කට වඩා වැඩි විය යුතුය.' : 'Password must be at least 6 characters long.')
    }

    setLoading(true)
    setError(null)
    
    try {
      let data
      if (mode === 'login') {
        data = await login(email, password)
      } else {
        data = await register(name, email, password)
      }

      if (data.success) {
        localStorage.setItem('lt_token', data.token)
        localStorage.setItem('lt_user', JSON.stringify(data.user))
        onAuthSuccess(data.user)
      }
    } catch (e) {
      // 2. Format Backend Errors
      let msg = e?.response?.data?.error

      if (msg) {
        if (msg.includes('shorter than the minimum allowed length')) {
          msg = language === 'si' ? 'මුරපදය අකුරු/ඉලක්කම් 6කට වඩා වැඩි විය යුතුය.' : 'Password must be at least 6 characters long.'
        } else if (msg.includes('duplicate key') || msg.includes('already exists')) {
          msg = language === 'si' ? 'මෙම ඊමේල් ලිපිනයෙන් දැනටමත් ගිණුමක් ඇත. කරුණාකර ඇතුල් වන්න.' : 'An account with this email already exists. Please log in.'
        } else if (msg.includes('Invalid credentials') || msg.includes('not found') || msg.includes('Invalid email or password')) {
          msg = language === 'si' ? 'ඊමේල් ලිපිනය හෝ මුරපදය වැරදියි.' : 'Invalid email or password.'
        }
      }

      setError(msg || (mode === 'login' 
        ? (language === 'si' ? 'ඇතුල් වීම අසාර්ථකයි.' : 'Login failed. Please check your credentials.') 
        : (language === 'si' ? 'ලියාපදිංචි වීම අසාර්ථකයි.' : 'Registration failed. Please try again.')))
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="min-h-screen dot-grid bg-[#0B0F19] text-white selection:bg-lanka-500/30 flex flex-col items-center justify-center px-4 relative animate-fade-in">

      {/* Language Toggle (Top Right) */}
      <div className="absolute top-6 right-6 z-50">
        <button 
          onClick={toggleLanguage}
          className="flex items-center gap-1.5 px-4 py-2 rounded-xl bg-white/5 hover:bg-white/10 border border-white/10 text-white/80 hover:text-white transition-all text-xs font-semibold backdrop-blur-md shadow-lg"
        >
          <Globe size={16} />
          {t('nav.langToggle')}
        </button>
      </div>

      {/* Ambient glows */}
      <div className="fixed inset-0 pointer-events-none overflow-hidden z-0">
        <div className="absolute -top-40 -right-40 w-[500px] h-[500px] bg-lanka-500/10 rounded-full blur-[120px]" />
        <div className="absolute -bottom-40 -left-40 w-[500px] h-[500px] bg-ocean-500/10 rounded-full blur-[120px]" />
      </div>

      <div className="relative z-10 w-full max-w-md space-y-8 mt-10 sm:mt-0">

        {/* Logo & Branding */}
        <div className="text-center">
          <div className="inline-flex items-center justify-center w-16 h-16 rounded-2xl bg-gradient-to-br from-lanka-400 to-lanka-600 shadow-xl shadow-lanka-500/30 mb-6">
            <Navigation size={28} className="text-white" />
          </div>
          <h1 className="font-display text-4xl text-white tracking-tight mb-2">{t('nav.appName')}</h1>
          <p className="text-white/40 text-sm uppercase tracking-widest">{t('nav.appDesc')}</p>
        </div>

        {/* Form Container */}
        <div className="card-dark p-2 rounded-[2rem]">
          
          {/* Mode Toggle */}
          <div className="flex bg-black/20 p-1.5 rounded-3xl mb-4 border border-white/5">
            {['login', 'register'].map(m => (
              <button
                key={m}
                onClick={() => { 
                  setMode(m); 
                  setError(null);
                  setName('');
                  setEmail('');
                  setPassword('');
                }}
                className={`flex-1 py-3 rounded-[1.25rem] text-sm font-semibold transition-all duration-300 ${
                  mode === m
                    ? 'bg-gradient-to-r from-lanka-500 to-ocean-500 text-white shadow-lg shadow-ocean-500/25 scale-[1.02]'
                    : 'text-white/40 hover:text-white/70'
                }`}
              >
                {m === 'login' ? t('auth.loginTitle') : t('auth.registerTitle')}
              </button>
            ))}
          </div>

          {/* Form Fields */}
          <div className="px-6 pb-6 pt-2 space-y-5">
            <p className="text-white/50 text-sm text-center font-medium mb-2">
              {mode === 'login' ? t('auth.loginSub') : t('auth.registerSub')}
            </p>

            {/* Name (register only) */}
            {mode === 'register' && (
              <div className="relative group">
                <User size={18} className="absolute left-4 top-1/2 -translate-y-1/2 text-white/30 group-focus-within:text-lanka-400 transition-colors" />
                <input
                  value={name}
                  onChange={e => setName(e.target.value)}
                  placeholder={t('auth.fullName')}
                  className="input-dark pl-11 w-full py-3.5 text-sm bg-black/20 border-white/5 hover:border-white/10"
                />
              </div>
            )}

            {/* Email */}
            <div className="relative group">
              <Mail size={18} className="absolute left-4 top-1/2 -translate-y-1/2 text-white/30 group-focus-within:text-lanka-400 transition-colors" />
              <input
                type="email"
                value={email}
                onChange={e => setEmail(e.target.value)}
                onKeyDown={e => e.key === 'Enter' && handleSubmit()}
                placeholder={t('auth.email')}
                className="input-dark pl-11 w-full py-3.5 text-sm bg-black/20 border-white/5 hover:border-white/10"
              />
            </div>

            {/* Password */}
            <div className="relative group">
              <Lock size={18} className="absolute left-4 top-1/2 -translate-y-1/2 text-white/30 group-focus-within:text-lanka-400 transition-colors" />
              <input
                type={showPw ? 'text' : 'password'}
                value={password}
                onChange={e => setPassword(e.target.value)}
                onKeyDown={e => e.key === 'Enter' && handleSubmit()}
                placeholder={t('auth.password')}
                className="input-dark pl-11 pr-12 w-full py-3.5 text-sm bg-black/20 border-white/5 hover:border-white/10"
              />
              <button
                onClick={() => setShowPw(!showPw)}
                className="absolute right-4 top-1/2 -translate-y-1/2 text-white/30 hover:text-white/70 transition-colors"
              >
                {showPw ? <EyeOff size={18} /> : <Eye size={18} />}
              </button>
            </div>

            {/* Error Message Display */}
            {error && (
              <div className="flex items-start gap-3 text-red-300 text-sm bg-red-500/10 border border-red-500/20 rounded-xl px-4 py-3 animate-fade-in">
                <AlertCircle size={18} className="shrink-0 mt-0.5" />
                <span className="leading-tight font-medium">{error}</span>
              </div>
            )}

            {/* Submit */}
            <button
              onClick={handleSubmit}
              disabled={loading}
              className="btn-primary w-full py-3.5 flex items-center justify-center gap-2 disabled:opacity-50 mt-4 text-sm font-semibold shadow-lanka-500/25"
            >
              {loading
                ? <><Loader2 size={18} className="animate-spin" /> {t('auth.processing')}</>
                : mode === 'login' ? t('auth.submitLogin') : t('auth.submitRegister')
              }
            </button>
          </div>
        </div>

        {/* Footer Text */}
        <p className="text-center text-white/30 text-[10px] uppercase tracking-widest font-medium mt-8">
          {t('auth.footer')}
        </p>
      </div>
    </div>
  )
}