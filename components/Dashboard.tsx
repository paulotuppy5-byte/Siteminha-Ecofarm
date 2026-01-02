import React, { useState, useEffect } from 'react';
import { CloudRain, Sun, Wind, Droplets, Fish, Sprout, Egg, Cloud, MapPin, Loader2, Calendar, X, Star, DollarSign, TrendingUp, Clock, Scale, Zap, Factory, Beef, Recycle, ArrowRight, RefreshCw, BarChart3, Leaf, Plus, Check, LayoutGrid, ChevronRight, ClipboardList, Settings, Search, Edit2, Download } from 'lucide-react';
import { TIER_1_COMPONENTS, TIER_2_COMPONENTS, TIER_3_COMPONENTS, TRANSLATIONS } from '../constants';
import { Language, SystemComponent, FarmTier } from '../types';
import { ExcelExportService } from '../services/ExcelExportService';

interface DashboardProps {
  language: Language;
  farmTier: FarmTier;
  onNavigateToPlanner: (unitId: string) => void;
  farmLocation?: { city: string; state: string };
}

interface LogEntry {
  id: string;
  date: string;
  timestamp: Date;
  action: string;
  value?: string;
  unit?: string;
}

const ACTIVITY_OPTIONS: Record<string, { id: string, label: string, unit?: string }[]> = {
  water: [
    { id: 'ph', label: 'Measure pH', unit: 'pH' },
    { id: 'feed_fish', label: 'Feed Fish (1.5%)', unit: 'kg' },
    { id: 'ammonia', label: 'Check Ammonia', unit: 'mg/L' },
    { id: 'flush', label: 'Flush Sediment' }
  ],
  animal: [
    { id: 'feed', label: 'Refill Feed', unit: 'kg' },
    { id: 'water', label: 'Clean Water', unit: 'L' },
    { id: 'collect', label: 'Collect Production', unit: 'units' },
    { id: 'health', label: 'Health Check' }
  ],
  plant: [
    { id: 'water', label: 'Irrigate', unit: 'L' },
    { id: 'fertilize', label: 'Apply Fertilizer', unit: 'kg' },
    { id: 'prune', label: 'Prune / Weed' },
    { id: 'harvest', label: 'Harvest', unit: 'kg' }
  ],
  waste: [
    { id: 'turn', label: 'Turn Pile' },
    { id: 'water_pile', label: 'Add Moisture', unit: 'L' },
    { id: 'temp', label: 'Measure Temp', unit: '°C' },
    { id: 'add', label: 'Add Biomass', unit: 'kg' }
  ],
  energy: [
    { id: 'pressure', label: 'Check Pressure', unit: 'bar' },
    { id: 'drain', label: 'Drain Condensate', unit: 'L' },
    { id: 'meter', label: 'Record Meter', unit: 'kWh' }
  ],
  processing: [
    { id: 'clean', label: 'Sanitize Equipment' },
    { id: 'run', label: 'Start Batch', unit: 'kg' },
    { id: 'maint', label: 'Lubricate/Service' }
  ]
};

const Dashboard: React.FC<DashboardProps> = ({ language, farmTier, onNavigateToPlanner, farmLocation }) => {
  const t = TRANSLATIONS[language];
  
  // Weather & Location State
  const [weatherData, setWeatherData] = useState<any>(null);
  const [loadingWeather, setLoadingWeather] = useState(true);
  const [coordinates, setCoordinates] = useState<{lat: number, lon: number} | null>(null);
  const [locationName, setLocationName] = useState<string>(language === 'pt' ? 'Detectando...' : 'Locating...');
  
  // Location Search State
  const [showLocationModal, setShowLocationModal] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [searchResults, setSearchResults] = useState<any[]>([]);
  const [searchingLocation, setSearchingLocation] = useState(false);

  // Component & Logging State
  const [localComponents, setLocalComponents] = useState<SystemComponent[]>([]);
  const [selectedComponent, setSelectedComponent] = useState<SystemComponent | null>(null);
  const [showLogModal, setShowLogModal] = useState(false);
  const [activitySuccess, setActivitySuccess] = useState<string | null>(null);
  const [viewAllUnits, setViewAllUnits] = useState(false);
  
  const [logs, setLogs] = useState<Record<string, LogEntry[]>>({});
  const [loggingAction, setLoggingAction] = useState<{id: string, label: string, unit?: string} | null>(null);
  const [logValue, setLogValue] = useState('');

  // Initialize components based on Tier
  useEffect(() => {
    let initialComponents: SystemComponent[] = [];
    if (farmTier === 'tier1') initialComponents = TIER_1_COMPONENTS;
    else if (farmTier === 'tier2') initialComponents = TIER_2_COMPONENTS;
    else initialComponents = TIER_3_COMPONENTS;
    
    setLocalComponents(initialComponents);
  }, [farmTier]);

  // Initial Location Detection (Updated to use Farm Profile)
  useEffect(() => {
    const initLocation = async () => {
      // 1. Try to use Farm Profile Location if available
      if (farmLocation?.city || farmLocation?.state) {
         const query = `${farmLocation.city}, ${farmLocation.state}`;
         try {
           const response = await fetch(
             `https://geocoding-api.open-meteo.com/v1/search?name=${encodeURIComponent(query)}&count=1&language=${language === 'pt' ? 'pt' : 'en'}&format=json`
           );
           const data = await response.json();
           
           if (data.results && data.results.length > 0) {
             const result = data.results[0];
             setCoordinates({ lat: result.latitude, lon: result.longitude });
             setLocationName(`${result.name}, ${result.admin1 || result.country_code}`);
             return; // Success, exit
           }
         } catch (error) {
           console.error("Geocoding profile location failed:", error);
         }
      }

      // 2. Fallback to Browser Geolocation
      if (navigator.geolocation) {
        navigator.geolocation.getCurrentPosition(
          (position) => {
            setCoordinates({ 
              lat: position.coords.latitude, 
              lon: position.coords.longitude 
            });
            setLocationName(language === 'pt' ? 'Minha Localização' : 'My Location');
          },
          () => {
            // 3. Last resort fallback
            setCoordinates({ lat: -12.97, lon: -38.51 });
            setLocationName('Salvador, BA');
          }
        );
      } else {
        setCoordinates({ lat: -12.97, lon: -38.51 });
        setLocationName('Salvador, BA');
      }
    };

    initLocation();
  }, [farmLocation?.city, farmLocation?.state]);

  // Fetch Weather when Coordinates Change
  useEffect(() => {
    if (!coordinates) return;

    const fetchWeather = async () => {
      setLoadingWeather(true);
      try {
        const response = await fetch(
          `https://api.open-meteo.com/v1/forecast?latitude=${coordinates.lat}&longitude=${coordinates.lon}&daily=weathercode,temperature_2m_max,temperature_2m_min,precipitation_probability_max&current_weather=true&timezone=auto`
        );
        const data = await response.json();
        setWeatherData(data);
      } catch (error) {
        console.error("Weather API Error:", error);
      } finally {
        setLoadingWeather(false);
      }
    };

    fetchWeather();
  }, [coordinates]);

  // Location Search Function
  const handleSearchLocation = async () => {
    if (!searchQuery.trim()) return;
    setSearchingLocation(true);
    try {
      // Open-Meteo Geocoding API with proper encoding
      const response = await fetch(
        `https://geocoding-api.open-meteo.com/v1/search?name=${encodeURIComponent(searchQuery)}&count=5&language=${language === 'pt' ? 'pt' : 'en'}&format=json`
      );
      const data = await response.json();
      setSearchResults(data.results || []);
    } catch (error) {
      console.error("Geocoding Error:", error);
      setSearchResults([]);
    } finally {
      setSearchingLocation(false);
    }
  };

  const selectLocation = (result: any) => {
    setCoordinates({ lat: result.latitude, lon: result.longitude });
    setLocationName(`${result.name}, ${result.admin1 || result.country_code}`);
    setShowLocationModal(false);
    setSearchQuery('');
    setSearchResults([]);
  };

  const handleQuickLog = (actionLabel: string) => {
    saveLogEntry(actionLabel, undefined, undefined);
  };

  const handleSaveWithInput = () => {
    if (!loggingAction) return;
    saveLogEntry(loggingAction.label, logValue, loggingAction.unit);
  };

  const saveLogEntry = (action: string, value?: string, unit?: string) => {
     if (!selectedComponent) return;

     const now = new Date();
     const timeString = language === 'pt' ? 'Agora mesmo' : 'Just now';
     
     const newLog: LogEntry = {
       id: Date.now().toString(),
       date: now.toLocaleString(language === 'pt' ? 'pt-BR' : 'en-US', { month: 'short', day: 'numeric', hour: '2-digit', minute: '2-digit'}),
       timestamp: now,
       action,
       value,
       unit
     };

     setLogs(prev => ({
       ...prev,
       [selectedComponent.id]: [newLog, ...(prev[selectedComponent.id] || [])]
     }));

     // Update the specific component in the list
     setLocalComponents(prev => prev.map(comp => {
       if (selectedComponent && comp.id === selectedComponent.id) {
          return { ...comp, lastChecked: timeString, status: 'active' }; 
       }
       return comp;
     }));
     
     // Update the currently selected component view
     setSelectedComponent(prev => prev ? ({ ...prev, lastChecked: timeString, status: 'active' }) : null);

     setActivitySuccess(`Logged: ${action}`);
     
     // Reset UI
     setShowLogModal(false);
     setLoggingAction(null);
     setLogValue('');
     setTimeout(() => setActivitySuccess(null), 3000);
  };

  const handleExportData = () => {
    if (!selectedComponent) return;

    const farmName = "EcoFarm_Demo";
    
    // Generate Mock Data based on category
    if (selectedComponent.category === 'animal' && selectedComponent.name.includes('Cattle')) {
      const dailyLogs = Array.from({length: 30}, (_, i) => ({
        date: new Date(Date.now() - i * 86400000).toISOString().slice(0,10),
        shift: 'Morning',
        totalHead: 120,
        animalsFed: 120,
        feedCostBRL: 450 + Math.random() * 50,
        weightGainKg: 1.2 + Math.random() * 0.5,
        notes: i % 5 === 0 ? 'Vet check' : 'Routine'
      }));
      const weeklyData = Array.from({length: 4}, (_, i) => ({
        weekStarting: new Date(Date.now() - i * 7 * 86400000).toISOString().slice(0,10),
        avgWeightKg: 450 + i * 5,
        weightGainKg: 7 + Math.random(),
        daysInConfinement: (i+1)*7,
        mortalityRatePct: 0,
        healthScore: 9
      }));
      ExcelExportService.exportCattleData(dailyLogs, weeklyData, farmName);
    }
    else if (selectedComponent.category === 'energy' && selectedComponent.name.includes('Biogas')) {
      const dailyLogs = Array.from({length: 30}, (_, i) => ({
        date: new Date(Date.now() - i * 86400000).toISOString().slice(0,10),
        cattleManureKg: 500,
        biogasVolumeM3: 20 + Math.random() * 5,
        ch4Percentage: 65,
        maintenanceCostBRL: 0
      }));
      ExcelExportService.exportBiogasData(dailyLogs, farmName);
    }
    else if (selectedComponent.category === 'water' || selectedComponent.name.includes('Tilapia') || selectedComponent.name.includes('Aquaculture')) {
       const dailyLogs = Array.from({length: 30}, (_, i) => ({
        date: new Date(Date.now() - i * 86400000).toISOString().slice(0,10),
        tankId: 'A1',
        totalFishCount: 1000,
        feedAmountKg: 15,
        feedCostBRL: 45,
        ph: 7.2,
        ammoniaMgL: 0.01
      }));
      const growthData = Array.from({length: 4}, (_, i) => ({
        date: new Date(Date.now() - i * 7 * 86400000).toISOString().slice(0,10),
        tankId: 'A1',
        averageWeightG: 100 + i * 20,
        dailyGrowthG: 2.5,
        survivalRatePct: 98
      }));
      ExcelExportService.exportAquacultureData(dailyLogs, growthData, farmName);
    }
    else if (selectedComponent.category === 'plant') {
       const plantingData = [{
         season: '2025-Summer',
         fieldId: 'F1',
         crop: selectedComponent.name,
         plantingDate: '2025-01-15',
         areaM2: 10000,
         seedQuantityKg: 200,
         totalSeedCostBRL: 1500
       }];
       const harvestData = [{
         season: '2025-Summer',
         fieldId: 'F1',
         crop: selectedComponent.name,
         harvestDate: '2025-05-20',
         grainHarvestedKg: 8000,
         grainRevenueBRL: 12000,
         harvestingCostBRL: 2000,
         areaM2: 10000
       }];
       ExcelExportService.exportCropsData(plantingData, harvestData, farmName);
    } 
    else if (selectedComponent.category === 'energy' && selectedComponent.name.includes('Solar')) {
       const dailyLogs = Array.from({length: 30}, (_, i) => ({
        date: new Date(Date.now() - i * 86400000).toISOString().slice(0,10),
        totalKwhGenerated: 25 + Math.random() * 5,
        peakPowerKw: 4.8,
        revenueFromGridBRL: 12,
        energyConsumedKwh: 10
      }));
      ExcelExportService.exportSolarData(dailyLogs, farmName);
    }
    else {
      // Generic fallback
       const dailyLogs = Array.from({length: 30}, (_, i) => ({
        date: new Date(Date.now() - i * 86400000).toISOString().slice(0,10),
        status: 'Active',
        notes: 'Routine check'
      }));
      ExcelExportService.exportCattleData(dailyLogs, [], farmName); // Fallback to basic sheet
    }

    setActivitySuccess('Report Downloaded');
    setTimeout(() => setActivitySuccess(null), 3000);
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'active': return 'bg-green-500';
      case 'planning': return 'bg-yellow-500';
      case 'maintenance': return 'bg-red-500';
      case 'warning': return 'bg-orange-500';
      default: return 'bg-gray-500';
    }
  };

  const getCategoryColor = (category: string) => {
    switch (category) {
      case 'water': return 'bg-blue-100 text-blue-600 border-blue-200';
      case 'animal': return 'bg-orange-100 text-orange-600 border-orange-200';
      case 'plant': return 'bg-green-100 text-green-600 border-green-200';
      case 'waste': return 'bg-amber-100 text-amber-600 border-amber-200';
      case 'energy': return 'bg-yellow-100 text-yellow-600 border-yellow-200';
      case 'processing': return 'bg-purple-100 text-purple-600 border-purple-200';
      default: return 'bg-gray-100 text-gray-600 border-gray-200';
    }
  };

  const getCategoryTheme = (category: string) => {
    switch (category) {
      case 'water': return 'bg-blue-50 text-blue-900';
      case 'animal': return 'bg-orange-50 text-orange-900';
      case 'plant': return 'bg-green-50 text-green-900';
      case 'waste': return 'bg-amber-50 text-amber-900';
      case 'energy': return 'bg-yellow-50 text-yellow-900';
      case 'processing': return 'bg-purple-50 text-purple-900';
      default: return 'bg-gray-50 text-gray-900';
    }
  };

  const getCategoryIcon = (category: string, size = 20) => {
    switch (category) {
      case 'water': return <Fish size={size} />;
      case 'animal': return farmTier === 'tier3' ? <Beef size={size} /> : <Egg size={size} />;
      case 'plant': return <Sprout size={size} />;
      case 'waste': return <Recycle size={size} />;
      case 'energy': return <Zap size={size} />;
      case 'processing': return <Factory size={size} />;
      default: return <Sprout size={size} />;
    }
  };

  const getWeatherIcon = (code: number, className = "w-6 h-6") => {
    if (code <= 1) return <Sun className={`${className} text-yellow-300`} />;
    if (code <= 48) return <Cloud className={`${className} text-gray-300`} />;
    return <CloudRain className={`${className} text-blue-300`} />;
  };

  const getWeatherDescription = (code: number) => {
    const isPt = language === 'pt';
    if (code === 0) return isPt ? 'Céu Limpo' : 'Clear Sky';
    if (code <= 3) return isPt ? 'Parc. Nublado' : 'Partly Cloudy';
    if (code >= 51) return isPt ? 'Chuva' : 'Rain';
    return isPt ? 'Nublado' : 'Cloudy';
  };

  const getDayName = (dateStr: string) => {
    const date = new Date(dateStr);
    const utcDate = new Date(date.getUTCFullYear(), date.getUTCMonth(), date.getUTCDate());
    return utcDate.toLocaleDateString(language === 'pt' ? 'pt-BR' : 'en-US', { weekday: 'short' });
  };

  const renderComponentCard = (comp: SystemComponent, isGrid = false) => (
    <button 
      key={comp.id} 
      onClick={() => setSelectedComponent(comp)}
      className={`${isGrid ? 'w-full' : 'snap-start flex-shrink-0 w-48'} flex flex-col justify-between text-left bg-white p-4 rounded-xl shadow-sm border border-gray-100 relative overflow-hidden group hover:shadow-md transition-all active:scale-95`}
    >
      <div className={`absolute left-0 top-0 bottom-0 w-1.5 ${getStatusColor(comp.status)}`}></div>
      
      {/* Click Hint */}
      <div className="absolute top-2 right-2 opacity-0 group-hover:opacity-100 transition-opacity">
        <ChevronRight size={16} className="text-gray-300" />
      </div>

      <div className="w-full">
        <div className="flex justify-between items-start mb-3">
          <div className={`p-2.5 rounded-full ${getCategoryColor(comp.category)}`}>
            {getCategoryIcon(comp.category)}
          </div>
          <span className="text-[10px] text-gray-400 bg-gray-50 px-1.5 py-0.5 rounded whitespace-nowrap">{comp.lastChecked}</span>
        </div>
        <h3 className="font-bold text-gray-800 text-sm leading-tight line-clamp-2 mb-1 h-9">{comp.name}</h3>
        <p className="text-xs text-gray-500 capitalize truncate">{comp.status} • {comp.cycleProgress}%</p>
      </div>
      
      {/* Circular Metric for Tier 3 components */}
      {comp.efficiency && (
        <div className="mt-3 pt-3 border-t border-gray-50 flex items-center gap-1">
          <RefreshCw size={10} className="text-gray-400" />
          <span className="text-[10px] font-mono text-gray-600">{comp.efficiency}% Eff.</span>
        </div>
      )}
    </button>
  );

  return (
    <div className="flex flex-col h-full bg-gray-50 pb-20 relative overflow-x-hidden">
      {/* Toast Notification */}
      {activitySuccess && (
        <div className="fixed top-6 left-1/2 transform -translate-x-1/2 z-[60] animate-slide-down">
          <div className="bg-gray-800 text-white px-6 py-3 rounded-full shadow-xl flex items-center gap-3">
             <div className="bg-green-500 rounded-full p-1">
               <Check size={14} className="text-white" />
             </div>
             <span className="font-bold text-sm">{activitySuccess.includes('Download') ? activitySuccess : `Logged: ${activitySuccess}`}</span>
          </div>
        </div>
      )}

      {/* Header with Weather */}
      <div className={`text-white p-6 rounded-b-[2rem] shadow-lg mb-6 relative overflow-hidden transition-all duration-500 ${farmTier === 'tier3' ? 'bg-gradient-to-r from-slate-800 to-indigo-900' : 'bg-gradient-to-r from-embrapa-green to-teal-700'}`}>
         {/* Decorative circles */}
        <div className="absolute top-0 right-0 w-32 h-32 bg-white/10 rounded-full -mr-10 -mt-10"></div>
        <div className="absolute bottom-0 left-0 w-24 h-24 bg-white/5 rounded-full -ml-10 -mb-5"></div>

        <div className="relative z-10">
          <div className="flex justify-between items-center mb-6">
            <div>
              <h1 className="text-2xl font-bold">{t.welcome}</h1>
              <div className="flex items-center gap-2 text-white opacity-90 text-sm">
                 <span className={`px-2 py-0.5 rounded text-[10px] uppercase font-bold tracking-wider ${farmTier === 'tier3' ? 'bg-indigo-500' : 'bg-green-600'}`}>
                    {farmTier === 'tier3' ? 'Tier 3' : (farmTier === 'tier2' ? 'Tier 2' : 'Tier 1')}
                 </span>
                 <button 
                  onClick={() => setShowLocationModal(true)}
                  className="flex items-center gap-1 hover:bg-white/10 px-2 py-0.5 rounded transition-colors group"
                 >
                    <MapPin size={12} /> 
                    <span className="truncate max-w-[120px] font-medium text-white">{locationName}</span>
                    <Edit2 size={10} className="opacity-50 group-hover:opacity-100 text-white" />
                 </button>
              </div>
            </div>
            <div className="bg-white/20 backdrop-blur-sm p-2 rounded-lg">
                {loadingWeather ? <Loader2 className="w-6 h-6 animate-spin" /> : (weatherData && getWeatherIcon(weatherData.current_weather.weathercode))}
            </div>
          </div>

          <div className="grid grid-cols-3 gap-4 text-center mb-6">
            <div className="bg-white/10 rounded-xl p-2 backdrop-blur-sm">
              <div className="flex justify-center mb-1">
                 {loadingWeather ? <Loader2 className="w-4 h-4 animate-spin" /> : getWeatherIcon(weatherData?.current_weather.weathercode, "w-4 h-4")}
              </div>
              <span className="text-lg font-bold">{loadingWeather ? '--' : Math.round(weatherData?.current_weather.temperature)}°C</span>
              <p className="text-[10px] opacity-80">{loadingWeather ? '--' : getWeatherDescription(weatherData?.current_weather.weathercode)}</p>
            </div>
            <div className="bg-white/10 rounded-xl p-2 backdrop-blur-sm">
              <div className="flex justify-center mb-1"><Wind className="w-4 h-4" /></div>
              <span className="text-lg font-bold">{loadingWeather ? '--' : Math.round(weatherData?.current_weather.windspeed)}km/h</span>
              <p className="text-[10px] opacity-80">Wind</p>
            </div>
            <div className="bg-white/10 rounded-xl p-2 backdrop-blur-sm">
              <div className="flex justify-center mb-1"><Droplets className="w-4 h-4" /></div>
              <span className="text-lg font-bold">{loadingWeather ? '--' : `${weatherData?.daily.precipitation_probability_max[0]}%`}</span>
              <p className="text-[10px] opacity-80">Rain Prob.</p>
            </div>
          </div>

          {/* 5-Day Forecast */}
          {!loadingWeather && weatherData && (
             <div className="border-t border-white/20 pt-4">
                <h3 className="text-[10px] font-bold uppercase tracking-widest opacity-70 mb-3 text-center">
                  {language === 'pt' ? 'Previsão 5 Dias' : '5-Day Forecast'}
                </h3>
                <div className="flex justify-between items-center">
                   {weatherData.daily.time.slice(0, 5).map((time: string, index: number) => (
                      <div key={time} className="flex flex-col items-center text-center">
                         <span className="text-[10px] font-bold opacity-80 mb-1">{getDayName(time)}</span>
                         <div className="mb-1">
                           {getWeatherIcon(weatherData.daily.weathercode[index], "w-5 h-5")}
                         </div>
                         <div className="flex flex-col leading-none">
                            <span className="text-xs font-bold">{Math.round(weatherData.daily.temperature_2m_max[index])}°</span>
                            <span className="text-[9px] opacity-70">{Math.round(weatherData.daily.temperature_2m_min[index])}°</span>
                         </div>
                         {weatherData.daily.precipitation_probability_max[index] > 0 ? (
                           <div className="flex items-center gap-0.5 mt-1">
                              <Droplets size={8} className="text-blue-200" />
                              <span className="text-[8px] font-bold text-blue-100">{weatherData.daily.precipitation_probability_max[index]}%</span>
                           </div>
                         ) : (
                           <div className="h-[14px] mt-1"></div> // Spacer
                         )}
                      </div>
                   ))}
                </div>
             </div>
          )}
        </div>
      </div>

      <div className="px-5 space-y-6">

        {/* System Status - Horizontal Carousel or Grid */}
        <section>
          <div className="flex justify-between items-center mb-3">
            <h2 className="text-lg font-bold text-gray-800">{t.mySystem}</h2>
            <button 
              onClick={() => setViewAllUnits(!viewAllUnits)}
              className="text-xs text-embrapa-green font-semibold uppercase tracking-wide flex items-center gap-1 bg-white px-2 py-1 rounded-lg border border-gray-200 shadow-sm"
            >
              {viewAllUnits ? <X size={14} /> : <LayoutGrid size={14} />}
              {viewAllUnits ? (language === 'pt' ? 'Fechar' : 'Close') : (language === 'pt' ? 'Ver Tudo' : 'View All')}
            </button>
          </div>
          
          {viewAllUnits ? (
            <div className="grid grid-cols-2 gap-3 animate-fade-in">
              {localComponents.map(comp => renderComponentCard(comp, true))}
            </div>
          ) : (
            <div className="flex gap-4 overflow-x-auto pb-4 -mx-5 px-5 no-scrollbar snap-x snap-mandatory">
              {localComponents.map(comp => renderComponentCard(comp, false))}
              {/* Spacer for right padding in scroll */}
              <div className="w-2 flex-shrink-0"></div>
            </div>
          )}
        </section>

        {/* Circular Economy Flow (Only for Tier 3) */}
        {farmTier === 'tier3' && (
          <section className="bg-white p-4 rounded-xl shadow-sm border border-gray-100">
            <div className="flex items-center gap-2 mb-4">
              <RefreshCw size={18} className="text-indigo-600" />
              <h2 className="text-lg font-bold text-gray-800">{t.circularEconomy}</h2>
            </div>
            
            {/* Visual Flow Chart */}
            <div className="relative h-40 bg-slate-50 rounded-lg p-2 border border-slate-100 overflow-hidden">
               {/* Connecting Lines */}
               <svg className="absolute inset-0 w-full h-full pointer-events-none text-gray-300" strokeWidth="2" stroke="currentColor">
                  <path d="M 60 50 L 120 50" strokeDasharray="4 2" />
                  <path d="M 160 50 L 220 50" strokeDasharray="4 2" />
                  <path d="M 260 50 L 260 90 L 60 90 L 60 70" strokeDasharray="4 2" />
               </svg>

               <div className="grid grid-cols-3 gap-2 relative z-10 h-full">
                  <div className="flex flex-col items-center justify-center">
                    <div className="w-12 h-12 rounded-full bg-green-100 text-green-700 flex items-center justify-center border-2 border-green-200 shadow-sm">
                      <Sprout size={20} />
                    </div>
                    <span className="text-[10px] font-bold mt-1 text-gray-600">CROPS</span>
                    <span className="text-[9px] text-green-600">Feed Source</span>
                  </div>

                  <div className="flex flex-col items-center justify-center">
                    <div className="w-12 h-12 rounded-full bg-orange-100 text-orange-700 flex items-center justify-center border-2 border-orange-200 shadow-sm">
                      <Beef size={20} />
                    </div>
                    <span className="text-[10px] font-bold mt-1 text-gray-600">LIVESTOCK</span>
                    <span className="text-[9px] text-orange-600">Manure</span>
                  </div>

                  <div className="flex flex-col items-center justify-center">
                    <div className="w-12 h-12 rounded-full bg-yellow-100 text-yellow-700 flex items-center justify-center border-2 border-yellow-200 shadow-sm">
                      <Zap size={20} />
                    </div>
                    <span className="text-[10px] font-bold mt-1 text-gray-600">BIODIGESTER</span>
                    <span className="text-[9px] text-yellow-600">Energy & Fertilizer</span>
                  </div>
               </div>
            </div>

            <div className="grid grid-cols-2 gap-4 mt-4">
              <div className="bg-indigo-50 p-3 rounded-lg border border-indigo-100">
                <span className="text-xs text-indigo-800 font-medium block mb-1">{t.energyIndep}</span>
                <span className="text-xl font-bold text-indigo-900">82%</span>
                <div className="w-full bg-indigo-200 h-1.5 rounded-full mt-2">
                  <div className="bg-indigo-600 h-1.5 rounded-full" style={{ width: '82%' }}></div>
                </div>
              </div>
              <div className="bg-green-50 p-3 rounded-lg border border-green-100">
                <span className="text-xs text-green-800 font-medium block mb-1">{t.wasteRecycled}</span>
                <span className="text-xl font-bold text-green-900">95%</span>
                <div className="w-full bg-green-200 h-1.5 rounded-full mt-2">
                  <div className="bg-green-600 h-1.5 rounded-full" style={{ width: '95%' }}></div>
                </div>
              </div>
            </div>
          </section>
        )}
        
        {/* Financial Snapshot Card */}
        <section className={`p-5 rounded-2xl shadow-lg text-white mb-8 ${farmTier === 'tier3' ? 'bg-gradient-to-br from-slate-900 to-indigo-900' : 'bg-gradient-to-br from-gray-900 to-gray-800'}`}>
          <div className="flex items-center gap-2 mb-4">
            <div className="bg-yellow-500 p-1.5 rounded-lg text-gray-900">
              <DollarSign size={18} />
            </div>
            <h2 className="text-lg font-bold">{t.financialOverview}</h2>
          </div>
          
          <div className="grid grid-cols-2 gap-4">
            <div className="bg-white/10 rounded-xl p-3 backdrop-blur-sm">
              <p className="text-xs text-gray-300 mb-1">{t.netProfit}</p>
              <div className="flex items-center gap-1">
                <TrendingUp size={16} className="text-green-400" />
                <span className="text-lg font-bold text-green-400">
                  {farmTier === 'tier3' ? 'R$ 842k' : 'R$ 22.2k'}
                </span>
              </div>
            </div>
            <div className="bg-white/10 rounded-xl p-3 backdrop-blur-sm">
              <p className="text-xs text-gray-300 mb-1">{t.roi}</p>
              <div className="flex items-center gap-1">
                <Scale size={16} className="text-yellow-400" />
                <span className="text-lg font-bold text-yellow-400">
                  {farmTier === 'tier3' ? '210%' : '169%'}
                </span>
              </div>
            </div>
          </div>
          <div className="mt-4 pt-3 border-t border-white/10 flex justify-between items-center text-xs text-gray-400">
             <span>{farmTier === 'tier3' ? 'Diversified Income' : 'Payback: 3-8 months'}</span>
             <span>{farmTier === 'tier3' ? '5 Revenue Streams' : 'Based on full production'}</span>
          </div>
        </section>
      </div>

      {/* Component Details Modal */}
      {selectedComponent && (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-sm z-50 flex items-end sm:items-center justify-center p-0 sm:p-4 animate-fade-in">
          <div className="bg-white w-full max-w-md h-[90vh] sm:h-auto sm:max-h-[85vh] rounded-t-3xl sm:rounded-2xl shadow-2xl overflow-hidden flex flex-col animate-slide-up relative">
            
            {/* Enhanced Header */}
            <div className={`relative p-6 ${getCategoryTheme(selectedComponent.category)}`}>
               {/* Close Button */}
               <button 
                  onClick={() => setSelectedComponent(null)}
                  className="absolute top-4 right-4 p-2 bg-black/5 hover:bg-black/10 rounded-full text-current transition-colors"
                >
                  <X size={20} />
                </button>

               <div className="flex items-center gap-4 mt-2">
                  <div className="p-3 bg-white/40 backdrop-blur-md rounded-xl shadow-sm">
                     {getCategoryIcon(selectedComponent.category, 32)}
                  </div>
                  <div>
                     <h2 className="text-2xl font-bold leading-none mb-2">{selectedComponent.name}</h2>
                     <div className="flex items-center gap-2">
                        <span className={`px-2 py-0.5 rounded text-[10px] font-bold uppercase tracking-wide border border-black/5 ${getStatusColor(selectedComponent.status)} text-white shadow-sm`}>
                          {selectedComponent.status}
                        </span>
                        <span className="text-xs font-medium opacity-80">
                          Last check: {selectedComponent.lastChecked}
                        </span>
                     </div>
                  </div>
               </div>
            </div>

            {/* Body */}
            <div className="flex-1 overflow-y-auto p-6 space-y-6 bg-gray-50/50">
               {/* Stats Row */}
               <div className="grid grid-cols-2 gap-4">
                  <div className="bg-white p-4 rounded-xl border border-gray-100 shadow-sm">
                     <p className="text-xs text-gray-500 uppercase font-bold mb-1">Production</p>
                     <p className="text-sm font-bold text-gray-800">{selectedComponent.production}</p>
                  </div>
                  <div className="bg-white p-4 rounded-xl border border-gray-100 shadow-sm">
                     <p className="text-xs text-gray-500 uppercase font-bold mb-1">Revenue/Value</p>
                     <p className="text-sm font-bold text-green-600">{selectedComponent.revenueEstimate}</p>
                  </div>
               </div>

               {/* Recent Activity Section */}
               <div>
                  <h3 className="text-xs font-bold text-gray-400 uppercase tracking-wider mb-3">Recent Activity</h3>
                  <div className="space-y-2">
                    {(logs[selectedComponent.id] || []).length > 0 ? (
                       logs[selectedComponent.id].slice(0, 5).map((log, i) => (
                         <div key={i} className="flex items-center justify-between p-3 bg-white border border-gray-100 rounded-xl shadow-sm">
                            <div className="flex items-center gap-3">
                               <div className="p-2 bg-gray-50 rounded-full text-gray-500">
                                  <ClipboardList size={14} />
                               </div>
                               <div>
                                  <p className="text-sm font-bold text-gray-700">{log.action}</p>
                                  <p className="text-[10px] text-gray-400">{log.date}</p>
                               </div>
                            </div>
                            {log.value && (
                               <span className="text-sm font-bold text-embrapa-green bg-green-50 px-2 py-1 rounded">
                                  {log.value} <span className="text-xs font-normal">{log.unit}</span>
                               </span>
                            )}
                         </div>
                       ))
                    ) : (
                       <div className="text-center p-4 text-gray-400 text-sm italic bg-white rounded-xl border border-gray-100 border-dashed">
                          No recent logs recorded.
                       </div>
                    )}
                  </div>
               </div>

               {/* Cycle Progress */}
               <div className="bg-white p-5 rounded-xl border border-gray-100 shadow-sm">
                  <div className="flex justify-between items-center mb-2">
                    <h3 className="font-bold text-gray-800 flex items-center gap-2 text-sm">
                      <Clock size={16} className="text-embrapa-green" />
                      Cycle Progress
                    </h3>
                    <span className="text-xs font-bold text-gray-500">{selectedComponent.cycleLabel}</span>
                  </div>
                  <div className="w-full bg-gray-100 h-3 rounded-full overflow-hidden mb-1">
                    <div className="bg-embrapa-green h-full rounded-full transition-all duration-1000" style={{ width: `${selectedComponent.cycleProgress}%` }}></div>
                  </div>
                  <div className="text-right text-xs text-gray-400">{selectedComponent.cycleProgress}% Complete</div>
               </div>

               {/* Specs */}
               <div>
                  <h3 className="text-xs font-bold text-gray-400 uppercase tracking-wider mb-3">Specifications</h3>
                  <div className="flex flex-wrap gap-2">
                     {selectedComponent.specs.map((spec, i) => (
                        <span key={i} className="px-3 py-1.5 bg-white border border-gray-200 rounded-lg text-sm text-gray-600 font-medium shadow-sm">
                           {spec}
                        </span>
                     ))}
                  </div>
               </div>

               {/* Sales / Circular */}
               <div>
                  <h3 className="text-xs font-bold text-gray-400 uppercase tracking-wider mb-3">
                     {selectedComponent.category === 'energy' ? 'Circular Benefits' : 'Market Opportunities'}
                  </h3>
                  {selectedComponent.salesOpportunities.length > 0 ? (
                    <div className="space-y-2">
                      {selectedComponent.salesOpportunities.map((opp, idx) => (
                        <div key={idx} className="flex items-center justify-between p-3 bg-white border border-gray-100 rounded-xl shadow-sm">
                          <div className="flex items-center gap-3">
                            {opp.recommended ? <div className="bg-yellow-100 p-1.5 rounded-full"><Star size={12} className="text-yellow-600 fill-yellow-600" /></div> : <div className="w-6" />}
                            <span className={`text-sm ${opp.recommended ? 'font-bold text-gray-800' : 'text-gray-600'}`}>{opp.channel}</span>
                          </div>
                          <span className="text-sm font-bold text-green-600 bg-green-50 px-2 py-1 rounded">{opp.price}</span>
                        </div>
                      ))}
                    </div>
                  ) : (
                     <div className="p-4 bg-blue-50 border border-blue-100 rounded-xl text-blue-700 text-sm flex items-center gap-2">
                        <RefreshCw size={16} />
                        <span>Input for other systems (Circular Economy)</span>
                     </div>
                  )}
               </div>
            </div>

            {/* Footer Actions */}
            <div className="p-4 bg-white border-t border-gray-100 flex gap-2 shadow-[0_-4px_6px_-1px_rgba(0,0,0,0.05)] z-10">
               <button 
                 onClick={() => setShowLogModal(true)}
                 className="flex-1 py-3.5 rounded-xl border-2 border-gray-100 text-gray-700 font-bold text-sm hover:border-gray-200 hover:bg-gray-50 transition-all flex items-center justify-center gap-2"
               >
                 <ClipboardList size={18} /> Log
               </button>
               
               {/* Export Button */}
               <button 
                 onClick={handleExportData}
                 className="flex-none w-14 py-3.5 rounded-xl border-2 border-indigo-100 text-indigo-600 font-bold hover:bg-indigo-50 transition-all flex items-center justify-center"
                 title="Export Report"
               >
                 <Download size={20} />
               </button>

               <button 
                 onClick={() => {
                   onNavigateToPlanner(selectedComponent.id);
                   setSelectedComponent(null);
                 }}
                 className="flex-1 py-3.5 rounded-xl bg-embrapa-green text-white font-bold text-sm shadow-lg shadow-green-900/20 hover:bg-green-800 transition-all flex items-center justify-center gap-2"
               >
                 <Calendar size={18} /> Manage
               </button>
            </div>

            {/* Log Activity Overlay Modal */}
            {showLogModal && (
              <div className="absolute inset-0 bg-white/95 backdrop-blur-sm z-[60] flex flex-col animate-fade-in">
                 <div className="p-5 border-b border-gray-100 flex justify-between items-center">
                    <h3 className="font-bold text-gray-800">
                       {loggingAction ? `Log: ${loggingAction.label}` : `Quick Log: ${selectedComponent.name}`}
                    </h3>
                    <button 
                      onClick={() => {
                        if(loggingAction) {
                           setLoggingAction(null); 
                           setLogValue('');
                        } else {
                           setShowLogModal(false);
                        }
                      }} 
                      className="p-2 bg-gray-100 rounded-full"
                    >
                       <X size={18} className="text-gray-600" />
                    </button>
                 </div>
                 
                 <div className="flex-1 p-5 overflow-y-auto">
                    {!loggingAction ? (
                      <>
                        <p className="text-sm text-gray-500 mb-4">Select an action to record for today:</p>
                        <div className="grid grid-cols-1 gap-3">
                           {(ACTIVITY_OPTIONS[selectedComponent.category] || ACTIVITY_OPTIONS['plant']).map((opt) => (
                             <button 
                               key={opt.id}
                               onClick={() => {
                                 if (opt.unit || ['ph', 'temp', 'feed', 'feed_fish', 'harvest', 'collect'].includes(opt.id)) {
                                    setLoggingAction(opt);
                                 } else {
                                    handleQuickLog(opt.label);
                                 }
                               }}
                               className="flex items-center justify-between p-4 bg-white border border-gray-200 rounded-xl hover:border-embrapa-green hover:bg-green-50 transition-all group shadow-sm"
                             >
                                <span className="font-bold text-gray-700 group-hover:text-embrapa-green">{opt.label}</span>
                                <div className="bg-gray-100 p-2 rounded-full group-hover:bg-embrapa-green group-hover:text-white transition-colors">
                                   <Plus size={16} />
                                </div>
                             </button>
                           ))}
                        </div>
                      </>
                    ) : (
                      <div className="animate-slide-up space-y-4">
                         <div>
                            <label className="block text-sm font-bold text-gray-700 mb-2">
                               Enter Value {loggingAction.unit ? `(${loggingAction.unit})` : ''}
                            </label>
                            <div className="flex gap-2">
                              <input 
                                type="number" 
                                autoFocus
                                value={logValue}
                                onChange={(e) => setLogValue(e.target.value)}
                                placeholder="0.00"
                                className="flex-1 p-4 bg-gray-50 border border-gray-200 rounded-xl text-xl font-bold focus:outline-none focus:border-embrapa-green"
                              />
                              {loggingAction.unit && (
                                <div className="flex items-center justify-center bg-gray-100 px-4 rounded-xl font-bold text-gray-500">
                                   {loggingAction.unit}
                                </div>
                              )}
                            </div>
                         </div>
                         
                         <button 
                           onClick={handleSaveWithInput}
                           disabled={!logValue}
                           className="w-full py-4 bg-embrapa-green text-white font-bold rounded-xl shadow-lg disabled:opacity-50 disabled:shadow-none"
                         >
                            Save Log
                         </button>
                      </div>
                    )}
                 </div>
              </div>
            )}
          </div>
        </div>
      )}

      {/* Location Search Modal */}
      {showLocationModal && (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-sm z-50 flex items-start justify-center p-4 pt-20 animate-fade-in">
          <div className="bg-white w-full max-w-sm rounded-2xl shadow-2xl overflow-hidden flex flex-col animate-slide-up">
            <div className="p-4 border-b border-gray-100 flex justify-between items-center bg-gray-50">
              <h3 className="font-bold text-gray-900">{language === 'pt' ? 'Mudar Localização' : 'Change Location'}</h3>
              <button onClick={() => setShowLocationModal(false)} className="p-1 bg-gray-200 rounded-full text-gray-600">
                <X size={16} />
              </button>
            </div>
            
            <div className="p-4 space-y-4">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={18} />
                <input 
                  type="text" 
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  onKeyDown={(e) => e.key === 'Enter' && handleSearchLocation()}
                  placeholder={language === 'pt' ? "Buscar cidade (ex: São Paulo)" : "Search city (e.g. New York)"}
                  className="w-full pl-10 pr-4 py-3 bg-white border border-gray-300 rounded-xl focus:outline-none focus:border-embrapa-green focus:ring-2 focus:ring-embrapa-green/20 text-gray-900 placeholder-gray-500"
                />
                <button 
                  onClick={handleSearchLocation}
                  disabled={searchingLocation}
                  className="absolute right-2 top-1/2 -translate-y-1/2 bg-embrapa-green text-white p-1.5 rounded-lg disabled:opacity-50"
                >
                  {searchingLocation ? <Loader2 size={16} className="animate-spin" /> : <ArrowRight size={16} />}
                </button>
              </div>

              <div className="max-h-60 overflow-y-auto">
                {searchResults.length > 0 ? (
                  <div className="space-y-2">
                    {searchResults.map((result) => (
                      <button
                        key={result.id}
                        onClick={() => selectLocation(result)}
                        className="w-full text-left p-3 hover:bg-gray-50 rounded-xl border border-transparent hover:border-gray-100 transition-all flex items-center gap-3"
                      >
                        <div className="bg-gray-100 p-2 rounded-full text-gray-500">
                          <MapPin size={16} />
                        </div>
                        <div>
                          <p className="font-bold text-gray-900 text-sm">{result.name}</p>
                          <p className="text-xs text-gray-600">{result.admin1}, {result.country}</p>
                        </div>
                      </button>
                    ))}
                  </div>
                ) : (
                  searchQuery && !searchingLocation && searchResults.length === 0 && (
                     <div className="text-center py-8 text-gray-400 text-sm">
                       {language === 'pt' ? 'Nenhuma cidade encontrada.' : 'No cities found.'}
                     </div>
                  )
                )}
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Dashboard;