import React, { useState } from 'react';
import { 
  ChevronRight, ChevronLeft, Check, LayoutGrid, Tractor, Factory, 
  MapPin, Globe, Bell, Ruler, Thermometer, Droplets
} from 'lucide-react';
import { Language, FarmProfile, AppPreferences, FarmTier } from '../types';
import { TRANSLATIONS, TIER_1_COMPONENTS, TIER_2_COMPONENTS, TIER_3_COMPONENTS } from '../constants';

interface SetupWizardProps {
  language: Language;
  onLanguageChange: (lang: Language) => void;
  onComplete: (profile: FarmProfile, prefs: AppPreferences) => void;
}

const SetupWizard: React.FC<SetupWizardProps> = ({ language, onLanguageChange, onComplete }) => {
  const t = TRANSLATIONS[language];
  const [step, setStep] = useState(1);

  // State
  const [tier, setTier] = useState<FarmTier>('tier1');
  const [state, setState] = useState('');
  const [city, setCity] = useState('');
  const [region, setRegion] = useState('');
  const [climate, setClimate] = useState('');
  const [units, setUnits] = useState<string[]>([]); // Initialize empty, populate based on tier later
  
  const [prefs, setPrefs] = useState<AppPreferences>({
    language: language,
    measurementSystem: 'metric',
    notifications: {
      dailyReminder: true,
      productionAlerts: true,
      harvestNotifications: true
    }
  });

  // Helper to pre-select units when tier changes
  const handleTierSelect = (selectedTier: FarmTier) => {
    setTier(selectedTier);
    let defaultUnits: string[] = [];
    if (selectedTier === 'tier1') defaultUnits = TIER_1_COMPONENTS.map(c => c.id);
    if (selectedTier === 'tier2') defaultUnits = TIER_2_COMPONENTS.map(c => c.id);
    if (selectedTier === 'tier3') defaultUnits = TIER_3_COMPONENTS.map(c => c.id);
    setUnits(defaultUnits);
  };

  const nextStep = () => setStep(s => Math.min(s + 1, 4));
  const prevStep = () => setStep(s => Math.max(s - 1, 1));

  const handleFinish = () => {
    const profile: FarmProfile = {
      scale: tier,
      state,
      city,
      region: region as any,
      climate: climate as any,
      waterSources: [],
      selectedUnits: units
    };
    onComplete(profile, prefs);
  };

  // --- STEPS RENDERERS ---

  const renderStep1 = () => (
    <div className="space-y-4 animate-fade-in">
      <h2 className="text-xl font-bold text-gray-800 text-center mb-6">{t.setupStep1}</h2>
      
      {[
        { id: 'tier1', name: t.tier1Name, desc: t.tier1Desc, icon: LayoutGrid, color: 'bg-green-100 text-green-700 border-green-200' },
        { id: 'tier2', name: t.tier2Name, desc: t.tier2Desc, icon: Tractor, color: 'bg-blue-100 text-blue-700 border-blue-200' },
        { id: 'tier3', name: t.tier3Name, desc: t.tier3Desc, icon: Factory, color: 'bg-indigo-100 text-indigo-700 border-indigo-200' }
      ].map((opt) => {
        const Icon = opt.icon;
        const isSelected = tier === opt.id;
        return (
          <button
            key={opt.id}
            onClick={() => handleTierSelect(opt.id as FarmTier)}
            className={`w-full p-4 rounded-xl border-2 text-left transition-all ${
              isSelected 
                ? `border-embrapa-green bg-white shadow-md ring-1 ring-embrapa-green` 
                : 'border-transparent bg-white shadow-sm hover:bg-gray-50'
            }`}
          >
            <div className="flex items-center gap-4">
              <div className={`p-3 rounded-full ${opt.color}`}>
                <Icon size={24} />
              </div>
              <div className="flex-1">
                <h3 className={`font-bold ${isSelected ? 'text-embrapa-green' : 'text-gray-800'}`}>{opt.name}</h3>
                <p className="text-xs text-gray-500 mt-1">{opt.desc}</p>
              </div>
              {isSelected && <div className="bg-embrapa-green text-white p-1 rounded-full"><Check size={14} /></div>}
            </div>
          </button>
        );
      })}
    </div>
  );

  const renderStep2 = () => (
    <div className="space-y-6 animate-fade-in">
      <h2 className="text-xl font-bold text-black text-center mb-2">{t.setupStep2}</h2>
      <p className="text-center text-gray-600 text-sm mb-6">This helps us provide region-specific insights.</p>

      <div className="space-y-4">
        <div>
          <label className="block text-xs font-bold text-black uppercase mb-1">State (UF)</label>
          <select 
            value={state}
            onChange={(e) => setState(e.target.value)}
            className="w-full p-3 bg-white border border-gray-200 rounded-xl focus:outline-none focus:border-embrapa-green text-black font-medium"
          >
            <option value="">Select State...</option>
            <option value="BA">Bahia</option>
            <option value="SP">São Paulo</option>
            <option value="MG">Minas Gerais</option>
            <option value="PE">Pernambuco</option>
            {/* ... other states */}
          </select>
        </div>
        
        <div>
          <label className="block text-xs font-bold text-black uppercase mb-1">City</label>
          <div className="relative">
             <MapPin className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-500" size={18} />
             <input 
               type="text" 
               value={city}
               onChange={(e) => setCity(e.target.value)}
               placeholder="Your municipality"
               className="w-full pl-10 p-3 bg-white border border-gray-200 rounded-xl focus:outline-none focus:border-embrapa-green text-black font-medium placeholder-gray-500"
             />
          </div>
        </div>

        <div>
          <label className="block text-xs font-bold text-black uppercase mb-2">Climate Zone</label>
          <div className="grid grid-cols-2 gap-3">
            {['Tropical', 'Subtropical', 'Temperate', 'Semi-Arid'].map(c => (
              <button
                key={c}
                onClick={() => setClimate(c)}
                className={`p-3 rounded-lg border text-sm font-bold transition-all ${
                  climate === c 
                    ? 'bg-embrapa-light border-embrapa-green text-embrapa-green' 
                    : 'bg-white border-gray-200 text-black'
                }`}
              >
                {c}
              </button>
            ))}
          </div>
        </div>
      </div>
    </div>
  );

  const renderStep3 = () => (
    <div className="space-y-6 animate-fade-in">
      <h2 className="text-xl font-bold text-gray-800 text-center mb-6">{t.setupStep3}</h2>

      <div className="bg-white p-4 rounded-xl border border-gray-200 shadow-sm">
         <div className="flex items-center gap-3 mb-4">
            <Globe size={20} className="text-embrapa-green" />
            <h3 className="font-bold text-gray-700">Language</h3>
         </div>
         <div className="flex gap-2">
            <button 
              onClick={() => { onLanguageChange('en'); setPrefs(p => ({...p, language: 'en'})) }}
              className={`flex-1 py-2 rounded-lg text-sm font-bold border ${language === 'en' ? 'bg-embrapa-green text-white border-embrapa-green' : 'bg-gray-50 text-gray-600 border-gray-200'}`}
            >
              English
            </button>
            <button 
              onClick={() => { onLanguageChange('pt'); setPrefs(p => ({...p, language: 'pt'})) }}
              className={`flex-1 py-2 rounded-lg text-sm font-bold border ${language === 'pt' ? 'bg-embrapa-green text-white border-embrapa-green' : 'bg-gray-50 text-gray-600 border-gray-200'}`}
            >
              Português
            </button>
         </div>
      </div>

      <div className="bg-white p-4 rounded-xl border border-gray-200 shadow-sm">
         <div className="flex items-center gap-3 mb-4">
            <Ruler size={20} className="text-embrapa-green" />
            <h3 className="font-bold text-gray-700">Measurement System</h3>
         </div>
         <div className="flex gap-2">
            <button 
              onClick={() => setPrefs(p => ({...p, measurementSystem: 'metric'}))}
              className={`flex-1 py-2 rounded-lg text-sm font-bold border ${prefs.measurementSystem === 'metric' ? 'bg-embrapa-green text-white border-embrapa-green' : 'bg-gray-50 text-gray-600 border-gray-200'}`}
            >
              Metric (°C, kg)
            </button>
            <button 
              onClick={() => setPrefs(p => ({...p, measurementSystem: 'imperial'}))}
              className={`flex-1 py-2 rounded-lg text-sm font-bold border ${prefs.measurementSystem === 'imperial' ? 'bg-embrapa-green text-white border-embrapa-green' : 'bg-gray-50 text-gray-600 border-gray-200'}`}
            >
              Imperial (°F, lbs)
            </button>
         </div>
      </div>

      <div className="bg-white p-4 rounded-xl border border-gray-200 shadow-sm">
         <div className="flex items-center gap-3 mb-4">
            <Bell size={20} className="text-embrapa-green" />
            <h3 className="font-bold text-gray-700">Notifications</h3>
         </div>
         <div className="space-y-3">
           {Object.entries(prefs.notifications).map(([key, val]) => (
             <label key={key} className="flex items-center justify-between cursor-pointer">
                <span className="text-sm text-gray-600 capitalize">{key.replace(/([A-Z])/g, ' $1')}</span>
                <input 
                  type="checkbox" 
                  checked={val}
                  onChange={() => setPrefs(p => ({...p, notifications: {...p.notifications, [key]: !val}}))}
                  className="w-5 h-5 accent-embrapa-green rounded"
                />
             </label>
           ))}
         </div>
      </div>
    </div>
  );

  const renderStep4 = () => {
    // Get components list based on currently selected Tier
    const availableComponents = tier === 'tier1' ? TIER_1_COMPONENTS : (tier === 'tier2' ? TIER_2_COMPONENTS : TIER_3_COMPONENTS);
    
    return (
      <div className="space-y-4 animate-fade-in flex flex-col h-full">
        <div className="text-center">
          <h2 className="text-xl font-bold text-gray-800">{t.setupStep4}</h2>
          <p className="text-sm text-gray-500">{t.selectUnits}</p>
        </div>

        <div className="flex-1 overflow-y-auto pr-1 custom-scrollbar">
           <div className="grid grid-cols-2 gap-3">
             {availableComponents.map(comp => {
               const isSelected = units.includes(comp.id);
               return (
                 <div 
                   key={comp.id}
                   onClick={() => {
                      if (isSelected) setUnits(units.filter(id => id !== comp.id));
                      else setUnits([...units, comp.id]);
                   }}
                   className={`flex flex-col p-3 rounded-xl border transition-all cursor-pointer h-full ${isSelected ? 'bg-white border-embrapa-green shadow-sm' : 'bg-gray-50 border-transparent opacity-70'}`}
                 >
                   <div className="flex items-start justify-between mb-2">
                     <div className={`w-5 h-5 rounded border flex items-center justify-center ${isSelected ? 'bg-embrapa-green border-embrapa-green' : 'border-gray-300 bg-white'}`}>
                        {isSelected && <Check size={12} className="text-white" />}
                     </div>
                     <span className="text-[10px] text-gray-400 uppercase font-bold">{comp.category}</span>
                   </div>
                   
                   <h4 className={`font-bold text-sm leading-tight ${isSelected ? 'text-gray-800' : 'text-gray-500'}`}>{comp.name}</h4>
                 </div>
               )
             })}
           </div>
        </div>
      </div>
    );
  };

  return (
    <div className="min-h-screen bg-[#FCFCF9] flex flex-col relative overflow-hidden">
      {/* Progress Bar */}
      <div className="bg-white p-6 pb-2 pt-10 sticky top-0 z-20">
         <div className="flex justify-between items-center mb-4">
           {step > 1 ? (
             <button onClick={prevStep} className="p-2 -ml-2 text-gray-500 hover:text-gray-800"><ChevronLeft /></button>
           ) : <div className="w-10"></div>}
           <span className="font-bold text-gray-400 text-xs tracking-widest">STEP {step} OF 4</span>
           <div className="w-10"></div>
         </div>
         <div className="w-full h-1 bg-gray-100 rounded-full overflow-hidden">
            <div className="h-full bg-embrapa-green transition-all duration-300" style={{ width: `${(step/4)*100}%` }}></div>
         </div>
      </div>

      {/* Main Content */}
      <div className="flex-1 p-6 pb-32 overflow-y-auto">
         {step === 1 && renderStep1()}
         {step === 2 && renderStep2()}
         {step === 3 && renderStep3()}
         {step === 4 && renderStep4()}
      </div>

      {/* Bottom Actions */}
      <div className="fixed bottom-0 left-0 w-full bg-white p-6 border-t border-gray-100 z-20">
        <div className="max-w-md mx-auto">
          {step < 4 ? (
            <button 
              onClick={nextStep}
              className="w-full bg-embrapa-green text-white font-bold py-4 rounded-xl shadow-lg shadow-embrapa-green/30 hover:bg-[#1a7a72] transition-all flex items-center justify-center gap-2"
            >
              {t.next} <ChevronRight size={20} />
            </button>
          ) : (
            <button 
              onClick={handleFinish}
              className="w-full bg-gradient-to-r from-embrapa-green to-teal-600 text-white font-bold py-4 rounded-xl shadow-lg hover:shadow-xl transition-all flex items-center justify-center gap-2"
            >
              {t.finish} <Check size={20} />
            </button>
          )}
        </div>
      </div>
    </div>
  );
};

export default SetupWizard;