import { useState, useEffect } from 'react'
import Navbar from './components/Navbar'
import HomePage from './pages/HomePage'
import SearchPage from './pages/SearchPage'
import PlanPage from './pages/PlanPage'
import OptimizePage from './pages/OptimizePage'
import ItineraryPage from './pages/ItineraryPage'
import LoginPage from './pages/LoginPage'
import DashboardPage from './pages/DashboardPage'
import TripActivePage from './pages/TripActivePage'
import SaveTripModal from './components/SaveTripModal'
import ProfilePage from './pages/ProfilePage' 
import { LanguageProvider } from './context/LanguageContext' 
import AIChatWidget from './components/AIChatWidget'

export default function App() {
  // ── Auth State ─────────────────────────────────────────────
  const [user, setUser]         = useState(() => {
    try { return JSON.parse(localStorage.getItem('lt_user')) } catch { return null }
  })

  // ── App View ──────────────────────────────────────────────
  // 'home' | 'login' | 'dashboard' | 'planner' | 'active-trip' | 'profile'
  const [view, setView]         = useState(() => {
    const token = localStorage.getItem('lt_token')
    return token ? 'dashboard' : 'home'
  })

  // ── Active Trip ────────────────────────────────────────────
  const [activeTrip, setActiveTrip] = useState(null)

  // ── Planner State ─────────────────────────────────────────
  const [step, setStep]               = useState(1)
  const [startLocation, setStartLoc]  = useState('')
  const [selectedPlaces, setSelected] = useState([])
  const [startTime, setStartTime]     = useState('06:00')
  const [optimizedPlaces, setOptimized] = useState([])
  const [optimizeResult, setOptResult]  = useState(null)

  // ── Save Trip Modal ────────────────────────────────────────
  const [showSave, setShowSave]       = useState(false)

  // ── Auth Handlers ─────────────────────────────────────────
  const handleAuthSuccess = (userData) => {
    setUser(userData)
    setView('dashboard')
  }

  const handleLogout = () => {
    localStorage.removeItem('lt_token')
    localStorage.removeItem('lt_user')
    setUser(null)
    setView('home')
  }

  // ── New Trip: reset state and go to planner ────────────────
  const handleNewTrip = () => {
    setStep(1)
    setStartLoc('')
    setSelected([])
    setStartTime('06:00')
    setOptimized([])
    setOptResult(null)
    setView('planner')
  }

  // ── Start / View a saved trip ─────────────────────────────
  const handleStartTrip = (trip) => {
    setActiveTrip(trip)
    setView('active-trip')
  }

  // ── Trip completed ─────────────────────────────────────────
  const handleTripComplete = () => {
    setActiveTrip(null)
    setView('dashboard')
  }

  // ── View Rendering Logic ───────────────────────────────────
  let currentView;

  if (view === 'home') {
    currentView = <HomePage onGetStarted={() => setView('login')} />
  }
  else if (view === 'login') {
    currentView = <LoginPage onAuthSuccess={handleAuthSuccess} />
  } 
  else if (view === 'active-trip' && activeTrip) {
    currentView = (
      <TripActivePage
        trip={activeTrip}
        onBack={() => setView('dashboard')}
        onComplete={handleTripComplete}
      />
    )
  } 
  else if (view === 'dashboard') {
    currentView = (
      <DashboardPage
        user={user}
        onNewTrip={handleNewTrip}
        onStartTrip={handleStartTrip}
        onLogout={handleLogout}
        onProfile={() => setView('profile')} 
      />
    )
  } 
  
  else if (view === 'profile') {
    currentView = (
      <ProfilePage
        user={user}
        onBack={() => setView('dashboard')}
        onLogout={handleLogout}
      />
    )
  }
  else {
    // PLANNER FLOW (Search -> Plan -> Optimize -> Itinerary)
    currentView = (
      <div className="min-h-screen dot-grid bg-[#0B0F19] text-white selection:bg-lanka-500/30">
        <Navbar
          currentStep={step}
          user={user}
          onDashboard={() => setView('dashboard')}
          onProfile={() => setView('profile')} //
          onLogout={handleLogout}
        />

        {/* Ambient glow - Updated for Premium Look */}
        <div className="fixed inset-0 pointer-events-none overflow-hidden z-0">
          <div className="absolute -top-40 -right-40 w-96 h-96 bg-lanka-500/10 rounded-full blur-[100px]" />
          <div className="absolute -bottom-40 -left-40 w-96 h-96 bg-ocean-500/10 rounded-full blur-[100px]" />
        </div>

        <main className="relative z-10 pt-24 pb-16 px-4">
          {step === 1 && (
            <SearchPage
              startLocation={startLocation}
              setStartLocation={setStartLoc}
              selectedPlaces={selectedPlaces}
              setSelectedPlaces={setSelected}
              onNext={() => setStep(2)}
            />
          )}
          {step === 2 && (
            <PlanPage
              startLocation={startLocation}
              selectedPlaces={selectedPlaces}
              setSelectedPlaces={setSelected}
              startTime={startTime}
              setStartTime={setStartTime}
              onNext={() => setStep(3)}
              onBack={() => setStep(1)}
            />
          )}
          {step === 3 && (
            <OptimizePage
              startLocation={startLocation}
              selectedPlaces={selectedPlaces}
              setOptimizedPlaces={(places) => setOptimized(places)}
              setOptimizeResult={(result) => setOptResult(result)}
              onNext={() => setStep(4)}
              onBack={() => setStep(2)}
            />
          )}
          {step === 4 && (
            <ItineraryPage
              optimizedPlaces={optimizedPlaces}
              startTime={startTime}
              onBack={() => setStep(3)}
              onSaveTrip={() => setShowSave(true)}
            />
          )}
        </main>

        {/* Save Trip Modal */}
        {showSave && (
          <div className="relative z-50">
            <SaveTripModal
              optimizedPlaces={optimizedPlaces}
              startLocation={startLocation}
              startTime={startTime}
              totalDistance={optimizeResult?.totalDistance}
              onSaved={(savedTrip) => {
                setShowSave(false)
                setView('dashboard')
              }}
              onClose={() => setShowSave(false)}
            />
          </div>
        )}
      </div>
    )
  }

  
  return (
    <LanguageProvider>
      {currentView}
      
      {}
      {view !== 'home' && view !== 'login' && <AIChatWidget />}
    </LanguageProvider>
  )
}