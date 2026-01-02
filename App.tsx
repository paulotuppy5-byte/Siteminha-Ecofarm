import React, { useState } from 'react';
import Navigation from './components/Navigation';
import Dashboard from './components/Dashboard';
import CameraAnalyzer from './components/CameraAnalyzer';
import Planner from './components/Planner';
import Education from './components/Education';
import Settings from './components/Settings';
import Login from './components/Login';
import SetupWizard from './components/SetupWizard';
import AgentView from './components/AgentView';
import { ViewState, Language, FarmTier, UserProfile, FarmProfile, AppPreferences } from './types';

// Mock Initial State
const INITIAL_USER: UserProfile = {
  id: '',
  name: '',
  email: '',
  isAuthenticated: false,
  isSetupComplete: false
};

const INITIAL_FARM: FarmProfile = {
  scale: 'tier1',
  state: '',
  city: '',
  region: '',
  climate: '',
  waterSources: [],
  selectedUnits: []
};

const App: React.FC = () => {
  // Global State
  const [user, setUser] = useState<UserProfile>(INITIAL_USER);
  const [farmProfile, setFarmProfile] = useState<FarmProfile>(INITIAL_FARM);
  const [preferences, setPreferences] = useState<AppPreferences>({
    language: 'en',
    measurementSystem: 'metric',
    notifications: { dailyReminder: true, productionAlerts: true, harvestNotifications: true }
  });
  
  // Location state for sharing between Dashboard and Agent
  const [coordinates, setCoordinates] = useState<{lat: number, lon: number} | null>(null);

  // Navigation State
  const [currentView, setCurrentView] = useState<ViewState>('camera');
  const [plannerTargetId, setPlannerTargetId] = useState<string | null>(null);

  // --- Handlers ---

  const handleLoginSuccess = () => {
    setUser({
      id: '123',
      name: 'Farmer John',
      email: 'farmer@sisteminha.com',
      isAuthenticated: true,
      isSetupComplete: false // Trigger Setup Wizard
    });
  };

  const handleSetupComplete = (profile: FarmProfile, prefs: AppPreferences) => {
    setFarmProfile(profile);
    setPreferences(prefs);
    setUser(prev => ({ ...prev, isSetupComplete: true }));
  };

  const handleLogout = () => {
    setUser(INITIAL_USER);
    setFarmProfile(INITIAL_FARM);
    setCurrentView('dashboard');
  };

  const handleNavigateToPlanner = (unitId: string) => {
    setPlannerTargetId(unitId);
    setCurrentView('planner');
  };

  // --- View Rendering Logic ---

  if (!user.isAuthenticated) {
    return <Login language={preferences.language} onLoginSuccess={handleLoginSuccess} />;
  }

  if (!user.isSetupComplete) {
    return (
      <SetupWizard 
        language={preferences.language} 
        onLanguageChange={(lang) => setPreferences(prev => ({...prev, language: lang}))}
        onComplete={handleSetupComplete} 
      />
    );
  }

  // Effect to get location once if not set (Mocking what Dashboard does, lifting state up effectively)
  if (!coordinates && navigator.geolocation) {
     navigator.geolocation.getCurrentPosition(
        (pos) => setCoordinates({ lat: pos.coords.latitude, lon: pos.coords.longitude }),
        () => setCoordinates({ lat: -12.97, lon: -38.51 }) // Default Salvador
     );
  }

  const renderView = () => {
    switch (currentView) {
      case 'dashboard':
        return (
          <Dashboard 
            language={preferences.language} 
            farmTier={farmProfile.scale} 
            onNavigateToPlanner={handleNavigateToPlanner}
            farmLocation={{ city: farmProfile.city, state: farmProfile.state }}
          />
        );
      case 'camera':
        return <CameraAnalyzer language={preferences.language} />;
      case 'planner':
        return (
          <Planner 
            language={preferences.language} 
            farmTier={farmProfile.scale} 
            initialUnitId={plannerTargetId}
          />
        );
      case 'agent':
        return (
          <AgentView 
            language={preferences.language}
            farmProfile={farmProfile}
            location={coordinates || undefined}
          />
        );
      case 'education':
        return <Education language={preferences.language} />;
      case 'settings':
        return (
          <Settings 
            language={preferences.language} 
            setLanguage={(lang) => setPreferences(prev => ({...prev, language: lang}))}
            farmProfile={farmProfile}
            user={user}
            onLogout={handleLogout}
            setFarmTier={(tier) => setFarmProfile(prev => ({...prev, scale: tier}))} // Fallback for simple toggle
          />
        );
      default:
        return (
          <Dashboard 
            language={preferences.language} 
            farmTier={farmProfile.scale} 
            onNavigateToPlanner={handleNavigateToPlanner}
            farmLocation={{ city: farmProfile.city, state: farmProfile.state }}
          />
        );
    }
  };

  return (
    <div className="flex flex-col h-screen max-w-md mx-auto bg-white shadow-2xl relative overflow-hidden">
      {/* Main Content Area */}
      <main className="flex-1 overflow-hidden relative">
        {renderView()}
      </main>

      {/* Bottom Navigation */}
      <Navigation 
        currentView={currentView} 
        onNavigate={setCurrentView} 
        language={preferences.language}
      />
    </div>
  );
};

export default App;