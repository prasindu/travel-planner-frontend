import { useEffect, useState, useRef } from 'react'
import {
  Navigation, MapPin, Route, CloudRain, Bus, Train, 
  Sparkles, ArrowRight, Globe, ShieldCheck, Map, Compass,
  Mountain, Palmtree, Landmark, Search, ListChecks, Wand2, PlayCircle,
  MessageSquare, Facebook, Instagram, Twitter, Mail, Heart
} from 'lucide-react'
import { motion, useScroll, useTransform } from 'framer-motion'
import { TypeAnimation } from 'react-type-animation'
import { useLanguage } from '../context/LanguageContext'

export default function HomePage({ onGetStarted }) {
  const { t, toggleLanguage } = useLanguage()
  const [scrolled, setScrolled] = useState(false)
  const [activeVibe, setActiveVibe] = useState('adventure')
  
  // 3D Ticket State
  const ticketRef = useRef(null)
  const [rotation, setRotation] = useState({ x: 0, y: 0 })

  // Parallax Scroll for Hero
  const { scrollY } = useScroll()
  const y1 = useTransform(scrollY, [0, 500], [0, 100])
  const y2 = useTransform(scrollY, [0, 500], [0, -100])

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 24)
    window.addEventListener('scroll', onScroll)
    return () => window.removeEventListener('scroll', onScroll)
  }, [])

  // 3D Mouse Movement
  const handleMouseMove = (e) => {
    if (!ticketRef.current) return
    const rect = ticketRef.current.getBoundingClientRect()
    const x = e.clientX - rect.left - rect.width / 2
    const y = e.clientY - rect.top - rect.height / 2
    setRotation({ x: -y / 20, y: x / 20 }) 
  }
  const handleMouseLeave = () => setRotation({ x: 0, y: 0 })

  // Vibes Data
  const vibes = {
    adventure: { color: 'from-green-500/30 to-emerald-500/30', icon: Mountain, label: 'Adventure', shadow: 'shadow-emerald-500/50' },
    heritage:  { color: 'from-amber-500/30 to-orange-500/30', icon: Landmark, label: 'Heritage', shadow: 'shadow-amber-500/50' },
    relax:     { color: 'from-blue-500/30 to-cyan-500/30', icon: Palmtree, label: 'Relaxing', shadow: 'shadow-blue-500/50' }
  }

  // Animation Variants
  const fadeUp = {
    hidden: { opacity: 0, y: 40 },
    visible: { opacity: 1, y: 0, transition: { duration: 0.6, ease: "easeOut" } }
  }
  const staggerContainer = {
    hidden: { opacity: 0 },
    visible: { opacity: 1, transition: { staggerChildren: 0.15 } }
  }

  const steps = [
    { no: '01', icon: Search, title: 'Search Places', body: 'Look up a city or attraction. See top matches with ratings & photos.' },
    { no: '02', icon: ListChecks, title: 'Build Stop List', body: 'Add places from multiple searches to build your dream itinerary.' },
    { no: '03', icon: Wand2, title: 'AI Optimize', body: 'One tap reorders every stop into the shortest possible journey.' },
    { no: '04', icon: PlayCircle, title: 'Stay Guided', body: 'Get transit directions, live weather checks, and indoor backups.' },
  ]

  const destinations = [
    { name: 'Kandy', img: 'https://images.unsplash.com/photo-1587595431973-160d0d94add1?q=80&w=600&auto=format&fit=crop', tag: 'Culture' },
    { name: 'Ella', img: 'https://images.unsplash.com/photo-1586227740560-8cf2732c1531?q=80&w=600&auto=format&fit=crop', tag: 'Mountains' },
    { name: 'Galle', img: 'https://images.unsplash.com/photo-1588668214407-6ea9a6d8c272?q=80&w=600&auto=format&fit=crop', tag: 'Coastal' },
    { name: 'Sigiriya', img: 'https://images.unsplash.com/photo-1574359411659-15573a27fd0c?q=80&w=600&auto=format&fit=crop', tag: 'Ancient' }
  ]

  return (
    <div className="min-h-screen bg-[#070A11] text-white selection:bg-amber-500/30 overflow-x-hidden font-sans">
      
      {/* ── Cultural Background & Ambient Glow ── */}
      <div className="fixed inset-0 pointer-events-none overflow-hidden z-0">
        <div className="absolute inset-0 opacity-[0.02] bg-[url('https://www.transparenttextures.com/patterns/cubes.png')]" />
        
        {/* Dynamic Glow based on Vibe */}
        <motion.div 
          animate={{ background: `linear-gradient(to bottom right, ${vibes[activeVibe].color})` }}
          transition={{ duration: 1 }}
          className={`absolute top-[-20%] right-[-10%] w-[800px] h-[800px] rounded-full blur-[150px] opacity-60`} 
        />
        <div className="absolute bottom-[-20%] left-[-10%] w-[600px] h-[600px] bg-blue-500/10 rounded-full blur-[150px]" />
      </div>

      {/* ── Navbar ── */}
      <motion.nav 
        initial={{ y: -100 }}
        animate={{ y: 0 }}
        className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
          scrolled ? 'bg-[#070A11]/90 backdrop-blur-xl border-b border-white/5 shadow-2xl py-3' : 'bg-transparent py-5'
        }`}
      >
        <div className="max-w-7xl mx-auto px-6 flex items-center justify-between">
          <div className="flex items-center gap-3 group cursor-pointer" onClick={onGetStarted}>
            <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-amber-500 to-orange-600 shadow-lg flex items-center justify-center group-hover:scale-105 transition-transform">
              <Navigation size={20} className="text-white" />
            </div>
            <span className="font-display font-bold text-white tracking-wide text-xl drop-shadow-md">Lanka Trails</span>
          </div>
          <div className="flex items-center gap-4">
            <button onClick={toggleLanguage} className="hidden sm:flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-white/10 hover:bg-white/20 border border-white/20 text-white transition-all text-xs font-medium backdrop-blur-sm">
              <Globe size={14} /> {t('nav.langToggle', 'සිංහල')}
            </button>
            <button onClick={onGetStarted} className="bg-white text-[#0B0F19] hover:bg-amber-500 hover:text-white transition-colors duration-300 py-2.5 px-6 rounded-full text-sm font-bold shadow-lg">
              Start Planning
            </button>
          </div>
        </div>
      </motion.nav>

      {/* ══════════════════════════════ HERO (LEFT TEXT + VIDEO BACKGROUND) ══════════════════════════════ */}
      <header className="relative w-full min-h-screen flex items-center justify-center pt-28 pb-16 overflow-hidden">
        
        {/* Background Video */}
        <div className="absolute inset-0 z-0">
          <video 
            autoPlay 
            loop 
            muted 
            playsInline 
            className="w-full h-full object-cover"
          >
            <source src="/video.mp4" type="video/mp4" />
          </video>
          
          {/* Gradient Overlay: Dark on the left (text), Transparent on the right (video focus) */}
          <div className="absolute inset-0 bg-gradient-to-r from-[#070A11] via-[#070A11]/70 to-transparent z-10" />
          
          {/* Bottom gradient just to blend with the next section smoothly */}
          <div className="absolute inset-x-0 bottom-0 h-40 bg-gradient-to-t from-[#070A11] to-transparent z-10" />
          
          {/* Dynamic Glow matching the selected vibe */}
          <motion.div 
            animate={{ background: `linear-gradient(to right, ${vibes[activeVibe].color.split(' ')[0].replace('from-', '')}, transparent)` }}
            transition={{ duration: 1 }}
            className={`absolute top-0 left-0 bottom-0 w-[50%] opacity-20 mix-blend-overlay z-10`} 
          />
        </div>

        <div className="relative z-20 w-full max-w-7xl mx-auto px-6 grid lg:grid-cols-[1.1fr_0.9fr] gap-16 items-center">
          
          {/* ── Left: Copy & CTA ── */}
          <motion.div style={{ y: y1 }} className="relative z-10">
            <motion.div 
              initial={{ opacity: 0, scale: 0.8 }} animate={{ opacity: 1, scale: 1 }} transition={{ duration: 0.5 }}
              className="inline-flex items-center gap-2 bg-white/10 border border-white/20 text-amber-400 text-[11px] uppercase tracking-[0.25em] font-bold px-5 py-2 rounded-full mb-8 backdrop-blur-md shadow-lg"
            >
              <Sparkles size={14} /> Sri Lanka's AI Travel Assistant
            </motion.div>

            <h1 className="font-display text-5xl sm:text-6xl lg:text-7xl font-extrabold tracking-tight leading-[1.1] mb-5 drop-shadow-2xl">
              Plan your trip.<br />
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-amber-400 via-orange-300 to-amber-200">
                <TypeAnimation
                  sequence={[
                    'Find the best places.', 2000,
                    'Optimize the route.', 2000,
                    'Check live weather.', 2000,
                    'Catch the right bus.', 2000,
                  ]}
                  wrapper="span"
                  speed={50}
                  repeat={Infinity}
                />
              </span>
            </h1>

            <p className="text-white/80 text-lg mb-8 max-w-lg drop-shadow-md">
              What kind of trip are you looking for? Select your vibe and let our AI curate the perfect Sri Lankan experience.
            </p>

            {/* Vibe Selector */}
            <div className="flex flex-wrap gap-3 mb-10">
              {Object.entries(vibes).map(([key, { icon: Icon, label }]) => (
                <button
                  key={key}
                  onClick={() => setActiveVibe(key)}
                  className={`flex items-center gap-2 px-6 py-3 rounded-full text-sm font-bold transition-all duration-300 border backdrop-blur-md ${
                    activeVibe === key 
                      ? 'bg-white text-black border-white shadow-[0_0_25px_rgba(255,255,255,0.4)] scale-105' 
                      : 'bg-black/30 text-white/80 border-white/20 hover:bg-white/20 hover:text-white'
                  }`}
                >
                  <Icon size={18} className={activeVibe === key ? 'text-black' : 'text-white/80'} /> {label}
                </button>
              ))}
            </div>

            <button onClick={onGetStarted} className={`bg-gradient-to-r from-amber-500 to-orange-500 text-white py-4 px-10 rounded-full font-bold flex items-center justify-center gap-3 transition-all hover:scale-105 shadow-xl w-max ${vibes[activeVibe].shadow}`}>
              Generate Itinerary <Wand2 size={20} />
            </button>
          </motion.div>

          {/* Right side is intentionally empty to let the video shine */}
          <div></div>

        </div>
      </header>

      {/* ══════════════════════════════ 3D TICKET SECTION (CENTERED) ══════════════════════════════ */}
      <section className="relative z-30 max-w-7xl mx-auto px-6 -mt-20 mb-24 flex justify-center perspective-[1200px]">
        <motion.div 
          style={{ y: y2, perspective: '1200px' }}
          initial={{ opacity: 0, y: 50 }} 
          whileInView={{ opacity: 1, y: 0 }} 
          viewport={{ once: true, margin: "-50px" }}
          transition={{ duration: 0.8, delay: 0.2 }}
          className="relative w-full max-w-2xl mx-auto" 
        >
          <div 
            ref={ticketRef}
            onMouseMove={handleMouseMove}
            onMouseLeave={handleMouseLeave}
            className="relative flex bg-[#11151f]/80 backdrop-blur-2xl border border-white/20 rounded-[2rem] shadow-2xl transition-transform duration-200 ease-out z-10"
            style={{ transform: `rotateX(${rotation.x}deg) rotateY(${rotation.y}deg)` }}
          >
            {/* Glossy overlay */}
            <div className="absolute inset-0 bg-gradient-to-br from-white/15 to-transparent rounded-[2rem] pointer-events-none" />

            {/* Perforations */}
            <div className="absolute -top-1.5 left-8 right-8 flex justify-between">
              {Array.from({ length: 14 }).map((_, i) => <span key={`t-${i}`} className="w-1.5 h-1.5 rounded-full bg-[#070A11] shadow-inner" />)}
            </div>
            <div className="absolute -bottom-1.5 left-8 right-8 flex justify-between">
              {Array.from({ length: 14 }).map((_, i) => <span key={`b-${i}`} className="w-1.5 h-1.5 rounded-full bg-[#070A11] shadow-inner" />)}
            </div>

            {/* Ticket Body */}
            <div className="flex-1 p-8 pr-6">
              <div className="flex items-center justify-between mb-4">
                <span className="text-white/60 text-[10px] font-extrabold uppercase tracking-[0.2em] bg-white/10 px-3 py-1 rounded-full backdrop-blur-sm">AI Optimized</span>
                <span className="text-amber-400 text-[11px] font-bold font-mono tracking-wider drop-shadow-md">#LT-2026</span>
              </div>
              
              <h3 className="font-display text-2xl text-white font-bold mb-6 flex items-center gap-3 drop-shadow-sm">
                Colombo <ArrowRight size={20} className="text-white/30" /> Ella
              </h3>

              {/* Simulated Route */}
              <div className="relative h-40 bg-black/30 rounded-xl p-4 border border-white/10 flex items-center justify-center overflow-hidden group">
                <div className="absolute inset-0 bg-[url('https://www.transparenttextures.com/patterns/cartographer.png')] opacity-10" />
                
                {/* Animated Path Line */}
                <svg viewBox="0 0 100 20" className="absolute w-full px-4 overflow-visible">
                  <motion.path
                    initial={{ pathLength: 0 }}
                    animate={{ pathLength: 1 }}
                    transition={{ duration: 2, ease: "easeInOut", repeat: Infinity, repeatType: "reverse", repeatDelay: 1 }}
                    d="M 0 10 Q 25 -10 50 10 T 100 10"
                    fill="none"
                    stroke="#f59e0b"
                    strokeWidth="2"
                    strokeDasharray="5 5"
                  />
                </svg>
                
                <div className="relative z-10 w-full flex justify-between px-2">
                  <div className="flex flex-col items-center">
                    <div className="w-3 h-3 bg-amber-400 rounded-full shadow-[0_0_10px_#f59e0b] mb-2" />
                    <span className="text-[10px] font-bold text-white/80">Start</span>
                  </div>
                  <div className="flex flex-col items-center mt-6">
                    <div className="w-3 h-3 bg-white/90 rounded-full mb-2" />
                    <span className="text-[10px] font-bold text-white/80">Kandy</span>
                  </div>
                  <div className="flex flex-col items-center">
                    <div className="w-4 h-4 bg-blue-400 rounded-full shadow-[0_0_15px_#60a5fa] ring-4 ring-blue-400/30 mb-2 animate-pulse" />
                    <span className="text-[10px] font-bold text-white">Ella</span>
                  </div>
                </div>
              </div>

              <div className="flex justify-between mt-6 pt-5 border-t border-dashed border-white/10">
                <div><p className="text-white/40 text-[9px] uppercase tracking-widest font-bold">Distance</p><p className="text-white font-semibold mt-0.5">249 km</p></div>
                <div><p className="text-white/40 text-[9px] uppercase tracking-widest font-bold">Time</p><p className="text-white font-semibold mt-0.5">6h 15m</p></div>
                <div><p className="text-white/40 text-[9px] uppercase tracking-widest font-bold">Transit</p><p className="text-white font-semibold mt-0.5">Bus / Train</p></div>
              </div>
            </div>

            {/* Perforation Line */}
            <div className="relative w-0 shrink-0">
              <div className="absolute -top-3 -left-3 w-6 h-6 rounded-full bg-[#070A11] shadow-inner" />
              <div className="absolute -bottom-3 -left-3 w-6 h-6 rounded-full bg-[#070A11] shadow-inner" />
              <div className="border-l-2 border-dashed border-white/20 h-full" />
            </div>

            {/* Ticket Stub (Weather) */}
            <div className="w-28 shrink-0 p-5 flex flex-col items-center justify-center text-center bg-white/[0.02] border-l border-white/5">
              <CloudRain size={32} className="text-blue-400 mb-3 animate-bounce drop-shadow-[0_0_10px_rgba(96,165,250,0.5)]" />
              <p className="text-white/50 text-[9px] font-bold uppercase tracking-widest mb-1">Alert</p>
              <p className="text-blue-300 text-[11px] font-bold uppercase tracking-wider">Rain in Ella</p>
              <div className="mt-4 bg-black/30 border border-white/10 rounded-lg p-2.5 w-full">
                <p className="text-white/60 text-[9px] font-medium">Indoor Backup</p>
                <p className="text-white text-[10px] font-bold mt-1">Tea Factory</p>
              </div>
            </div>
          </div>
        </motion.div>
      </section>

      {/* ══════════════════════════ POPULAR DESTINATIONS ══════════════════════════ */}
      <section className="relative z-10 max-w-7xl mx-auto px-6 py-20">
        <motion.div 
          initial="hidden" whileInView="visible" viewport={{ once: true, margin: "-100px" }} variants={fadeUp}
          className="flex flex-col sm:flex-row sm:items-end justify-between gap-6 mb-12"
        >
          <div>
            <p className="text-amber-500 text-[11px] font-bold uppercase tracking-[0.2em] mb-3"><Compass size={14} className="inline mr-1 mb-0.5"/> Discover</p>
            <h2 className="font-display text-3xl md:text-5xl font-bold tracking-tight">Trending Spots</h2>
          </div>
          <button onClick={onGetStarted} className="text-sm font-bold text-white/60 hover:text-white flex items-center gap-2 group transition-colors">
            See all places <ArrowRight size={16} className="group-hover:translate-x-1 transition-transform" />
          </button>
        </motion.div>

        <motion.div 
          initial="hidden" whileInView="visible" viewport={{ once: true }} variants={staggerContainer}
          className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5"
        >
          {destinations.map((dest, i) => (
            <motion.div key={dest.name} variants={fadeUp} onClick={onGetStarted} className="group relative h-80 rounded-3xl overflow-hidden cursor-pointer shadow-lg">
              <div className="absolute inset-0 bg-black/30 group-hover:bg-black/10 transition-colors duration-500 z-10" />
              <div className="absolute inset-0 bg-gradient-to-t from-[#070A11] via-[#070A11]/40 to-transparent z-10" />
              <img src={dest.img} alt={dest.name} className="absolute inset-0 w-full h-full object-cover group-hover:scale-110 transition-transform duration-700 ease-out" />
              
              <div className="absolute bottom-0 left-0 right-0 p-6 z-20">
                <span className="inline-block px-3 py-1 bg-white/10 backdrop-blur-md border border-white/20 rounded-full text-[10px] font-bold text-white uppercase tracking-wider mb-2">
                  {dest.tag}
                </span>
                <h3 className="text-2xl font-bold text-white group-hover:text-amber-400 transition-colors">{dest.name}</h3>
                <div className="h-0 opacity-0 group-hover:h-auto group-hover:opacity-100 group-hover:mt-2 transition-all duration-300 overflow-hidden">
                  <p className="text-white/70 text-sm flex items-center gap-1">Plan Trip <ArrowRight size={14}/></p>
                </div>
              </div>
            </motion.div>
          ))}
        </motion.div>
      </section>

      {/* ══════════════════════════ HOW IT WORKS ══════════════════════════ */}
      <section className="relative z-10 max-w-7xl mx-auto px-6 py-24">
        <motion.div initial="hidden" whileInView="visible" viewport={{ once: true }} variants={fadeUp} className="text-center max-w-2xl mx-auto mb-20">
          <p className="text-blue-400 text-[11px] font-bold uppercase tracking-[0.2em] mb-3">Trip Planning Process</p>
          <h2 className="font-display text-4xl md:text-5xl font-bold tracking-tight mb-4">
            How it <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-400 to-amber-400 italic">works</span>
          </h2>
        </motion.div>

        <div className="relative">
          <div className="hidden lg:block absolute top-[2.75rem] left-[10%] right-[10%] h-px bg-gradient-to-r from-transparent via-white/20 to-transparent" />
          
          <motion.div initial="hidden" whileInView="visible" viewport={{ once: true }} variants={staggerContainer} className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
            {steps.map((s, i) => {
              const Icon = s.icon
              return (
                <motion.div key={s.no} variants={fadeUp} className="relative flex flex-col group">
                  <div className="flex items-center gap-4 mb-6">
                    <div className="relative z-10 w-12 h-12 rounded-2xl bg-white/5 border border-white/10 flex items-center justify-center shadow-lg group-hover:bg-amber-500/20 group-hover:border-amber-500/40 group-hover:scale-110 transition-all duration-300">
                      <Icon size={20} className="text-white group-hover:text-amber-400 transition-colors" />
                    </div>
                    <span className="font-display text-4xl text-white/5 font-extrabold group-hover:text-white/10 transition-colors">{s.no}</span>
                  </div>
                  <div className="bg-[#11151f]/60 backdrop-blur-md flex-1 p-7 rounded-3xl border border-white/5 group-hover:border-white/20 transition-all duration-300">
                    <h3 className="text-white font-bold text-lg mb-3">{s.title}</h3>
                    <p className="text-white/50 text-sm leading-relaxed">{s.body}</p>
                  </div>
                </motion.div>
              )
            })}
          </motion.div>
        </div>
      </section>

      {/* ══════════════════════════ CTA ══════════════════════════════ */}
      <section className="relative z-10 max-w-5xl mx-auto px-6 pb-20 pt-10">
        <motion.div 
          initial={{ opacity: 0, scale: 0.9 }} whileInView={{ opacity: 1, scale: 1 }} viewport={{ once: true }} transition={{ duration: 0.6 }}
          className="relative overflow-hidden p-12 md:p-20 text-center rounded-[3rem] border border-amber-500/30 bg-gradient-to-b from-amber-500/10 to-[#11151f] shadow-2xl"
        >
          <div className="relative z-10">
            <h2 className="font-display text-4xl md:text-5xl font-extrabold tracking-tight mb-5 text-white">
              Ready to start your journey?
            </h2>
            <p className="text-white/60 text-lg mb-10 max-w-lg mx-auto">
              Create a free account, search your favorite spots, and let us map out the perfect itinerary.
            </p>
            <button onClick={onGetStarted} className="bg-white text-black hover:bg-amber-400 hover:text-white transition-all duration-300 py-4 px-10 rounded-full text-base font-bold shadow-[0_0_30px_rgba(255,255,255,0.1)] hover:shadow-[0_0_40px_rgba(245,158,11,0.4)] hover:scale-105 inline-flex items-center gap-3">
              Get Started Now <ArrowRight size={18} />
            </button>
          </div>
        </motion.div>
      </section>

      {/* ══════════════════════════ PREMIUM FOOTER ══════════════════════════════ */}
      <footer className="relative z-10 border-t border-white/10 bg-[#040609] pt-20 pb-10 overflow-hidden">
        {/* Topographic Background Pattern Style */}
        <style>{`
          .topo-footer-bg {
            background-image: url("data:image/svg+xml,%3Csvg width='60' height='60' viewBox='0 0 60 60' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='none' fill-rule='evenodd'%3E%3Cpath d='M36 34v-4h-2v4h-4v2h4v4h2v-4h4v-2h-4zm0-30V0h-2v4h-4v2h4v4h2V6h4V4h-4zM6 34v-4H4v4H0v2h4v4h2v-4h4v-2H6zM6 4V0H4v4H0v2h4v4h2V6h4V4H6z' fill='%23ffffff' fill-opacity='0.03' fill-rule='nonzero'/%3E%3C/g%3E%3C/svg%3E");
          }
        `}</style>
        
        <div className="absolute inset-0 topo-footer-bg pointer-events-none" />

        {/* Massive Background Text Watermark */}
        <div className="absolute top-10 left-0 right-0 overflow-hidden flex justify-center opacity-[0.02] pointer-events-none">
          <h1 className="font-display text-[15vw] font-black whitespace-nowrap leading-none tracking-tighter">LANKA TRAILS</h1>
        </div>

        <div className="max-w-7xl mx-auto px-6 relative z-10">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-12 mb-16">
            
            {/* Column 1: Brand & About */}
            <div className="lg:col-span-1">
              <div className="flex items-center gap-3 mb-6">
                <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-amber-500 to-orange-600 flex items-center justify-center">
                  <Navigation size={20} className="text-white" />
                </div>
                <span className="font-display font-bold text-white text-2xl">Lanka Trails</span>
              </div>
              <p className="text-white/50 text-sm leading-relaxed mb-6">
                Redefining travel in Sri Lanka. AI-powered route optimization, live weather updates, and seamless transit planning all in one place.
              </p>
              <div className="flex gap-4">
                <a href="#" className="w-10 h-10 rounded-full bg-white/5 flex items-center justify-center text-white/60 hover:bg-amber-500 hover:text-white transition-colors"><Facebook size={18} /></a>
                <a href="#" className="w-10 h-10 rounded-full bg-white/5 flex items-center justify-center text-white/60 hover:bg-amber-500 hover:text-white transition-colors"><Instagram size={18} /></a>
                <a href="#" className="w-10 h-10 rounded-full bg-white/5 flex items-center justify-center text-white/60 hover:bg-amber-500 hover:text-white transition-colors"><Twitter size={18} /></a>
              </div>
            </div>

            {/* Column 2: Quick Links */}
            <div>
              <h4 className="text-white font-bold text-lg mb-6">Quick Links</h4>
              <ul className="space-y-4">
                <li><a href="#" className="text-white/50 hover:text-amber-400 text-sm transition-colors">Plan a Trip</a></li>
                <li><a href="#" className="text-white/50 hover:text-amber-400 text-sm transition-colors">Top Destinations</a></li>
                <li><a href="#" className="text-white/50 hover:text-amber-400 text-sm transition-colors">Bus & Train Routes</a></li>
                <li><a href="#" className="text-white/50 hover:text-amber-400 text-sm transition-colors">About Us</a></li>
              </ul>
            </div>

            {/* Column 3: Support */}
            <div>
              <h4 className="text-white font-bold text-lg mb-6">Support</h4>
              <ul className="space-y-4">
                <li><a href="#" className="text-white/50 hover:text-amber-400 text-sm transition-colors">Help Center</a></li>
                <li><a href="#" className="text-white/50 hover:text-amber-400 text-sm transition-colors">Privacy Policy</a></li>
                <li><a href="#" className="text-white/50 hover:text-amber-400 text-sm transition-colors">Terms of Service</a></li>
                <li><a href="#" className="text-white/50 hover:text-amber-400 text-sm transition-colors">Contact Us</a></li>
              </ul>
            </div>

            {/* Column 4: Newsletter (Ticket Stub Style) */}
            <div className="lg:col-span-1">
              <h4 className="text-white font-bold text-lg mb-6">Travel Alerts</h4>
              <div className="bg-white/5 border border-white/10 rounded-2xl p-5 backdrop-blur-sm relative">
                <div className="absolute -top-3 -right-3 text-amber-500/50"><Mail size={40} /></div>
                <p className="text-white/60 text-xs mb-4">Get the latest hidden gems and weather alerts straight to your inbox.</p>
                <div className="flex flex-col gap-3">
                  <input type="email" placeholder="Email Address" className="w-full bg-black/30 border border-white/10 rounded-lg py-2.5 px-4 text-sm text-white focus:outline-none focus:border-amber-500/50" />
                  <button className="w-full bg-amber-500 hover:bg-amber-400 text-black font-bold py-2.5 rounded-lg text-sm transition-colors">Subscribe</button>
                </div>
              </div>
            </div>
          </div>

          {/* Bottom Copyright Bar */}
          <div className="border-t border-white/10 pt-8 flex flex-col md:flex-row items-center justify-between gap-4">
            <p className="text-white/40 text-xs font-medium">© {new Date().getFullYear()} Lanka Trails. All rights reserved.</p>
            <p className="text-white/40 text-xs flex items-center gap-1">Made with <Heart size={14} className="text-red-500" /> in Sri Lanka</p>
          </div>
        </div>
      </footer>

      {/* ── Floating AI Chat Button ── */}
      <motion.button 
        initial={{ y: 100 }} animate={{ y: 0 }} transition={{ delay: 1, type: "spring" }}
        className="fixed bottom-6 right-6 z-50 bg-amber-500 hover:bg-amber-400 text-black p-4 rounded-full shadow-[0_8px_30px_rgba(245,158,11,0.4)] hover:scale-110 transition-transform"
        onClick={onGetStarted} 
      >
        <MessageSquare size={24} />
      </motion.button>
    </div>
  )
}