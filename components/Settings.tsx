import React from 'react';
import { Globe, Info, Sparkles, Sprout, Scaling, LayoutGrid, Tractor, Factory, User, Bell, Shield, BookOpen, MapPin, Ruler, LogOut } from 'lucide-react';
import { Language, FarmTier, FarmProfile, UserProfile, AppPreferences } from '../types';
import { TRANSLATIONS } from '../constants';

interface SettingsProps {
  language: Language;
  setLanguage: (lang: Language) => void;
  farmProfile: FarmProfile;
  user: UserProfile;
  onLogout: () => void;
  setFarmTier: (tier: FarmTier) => void;
}

const Settings: React.FC<SettingsProps> = ({ language, setLanguage, farmProfile, user, onLogout, setFarmTier }) => {
  const t = TRANSLATIONS[language];

  // Helper to get Tier info
  const getTierInfo = (tierId: string) => {
    if (tierId === 'tier1') return { name: t.tier1Name, icon: LayoutGrid, color: 'text-green-600' };
    if (tierId === 'tier2') return { name: t.tier2Name, icon: Tractor, color: 'text-blue-600' };
    return { name: t.tier3Name, icon: Factory, color: 'text-indigo-600' };
  };

  const tierInfo = getTierInfo(farmProfile.scale);
  const TierIcon = tierInfo.icon;

  const handleCycleTier = () => {
    const tiers: FarmTier[] = ['tier1', 'tier2', 'tier3'];
    const currentIndex = tiers.indexOf(farmProfile.scale);
    const nextIndex = (currentIndex + 1) % tiers.length;
    setFarmTier(tiers[nextIndex]);
  };

  return (
    <div className="flex flex-col h-full bg-gray-50 pb-20 animate-fade-in">
      {/* Header */}
      <div className="bg-white p-6 shadow-sm border-b border-gray-100 z-10 sticky top-0">
        <h2 className="text-2xl font-bold text-gray-800">{t.settings}</h2>
        <p className="text-gray-500 text-sm">Manage your farm profile and app preferences</p>
      </div>

      <div className="p-4 space-y-6 overflow-y-auto">
        
        {/* Account Section */}
        <section className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
           <div className="p-4 flex items-center gap-4">
              <div className="w-16 h-16 bg-embrapa-light rounded-full flex items-center justify-center text-embrapa-green font-bold text-2xl border-2 border-white shadow-sm">
                 {user.avatar ? <img src={user.avatar} alt="Profile" className="w-full h-full rounded-full" /> : user.name.charAt(0)}
              </div>
              <div>
                 <h3 className="font-bold text-lg text-gray-800">{user.name}</h3>
                 <p className="text-sm text-gray-500">{user.email}</p>
                 <div className="flex items-center gap-1 mt-1 text-xs text-green-600 bg-green-50 px-2 py-0.5 rounded-full inline-flex">
                    <Shield size={10} /> Authenticated
                 </div>
              </div>
           </div>
        </section>

        {/* Farm Configuration */}
        <section className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
          <div className="p-4 border-b border-gray-50 bg-gray-50/50">
            <h3 className="font-bold text-gray-700 flex items-center gap-2">
              <Sprout size={18} className="text-embrapa-green" />
              Farm Configuration
            </h3>
          </div>
          <div className="divide-y divide-gray-50">
             <div className="p-4 flex items-center justify-between">
                <div className="flex items-center gap-3">
                   <div className="p-2 bg-gray-100 rounded-lg"><TierIcon size={20} className={tierInfo.color} /></div>
                   <div>
                      <p className="text-xs text-gray-500 uppercase font-bold">Scale</p>
                      <p className="text-sm font-bold text-gray-800">{tierInfo.name}</p>
                   </div>
                </div>
                <button onClick={handleCycleTier} className="text-xs text-embrapa-green font-bold">Edit</button>
             </div>
             
             <div className="p-4 flex items-center justify-between">
                <div className="flex items-center gap-3">
                   <div className="p-2 bg-gray-100 rounded-lg"><MapPin size={20} className="text-gray-500" /></div>
                   <div>
                      <p className="text-xs text-gray-500 uppercase font-bold">Location</p>
                      <p className="text-sm font-bold text-gray-800">{farmProfile.city || 'Not set'}, {farmProfile.state || ''}</p>
                   </div>
                </div>
                <button className="text-xs text-embrapa-green font-bold">Edit</button>
             </div>
             
             <div className="p-4 flex items-center justify-between">
                <div className="flex items-center gap-3">
                   <div className="p-2 bg-gray-100 rounded-lg"><LayoutGrid size={20} className="text-gray-500" /></div>
                   <div>
                      <p className="text-xs text-gray-500 uppercase font-bold">Production Units</p>
                      <p className="text-sm font-bold text-gray-800">{farmProfile.selectedUnits.length} Active</p>
                   </div>
                </div>
                <button className="text-xs text-embrapa-green font-bold">Manage</button>
             </div>
          </div>
        </section>

        {/* Preferences Section */}
        <section className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
          <div className="p-4 border-b border-gray-50 bg-gray-50/50">
            <h3 className="font-bold text-gray-700 flex items-center gap-2">
              <Globe size={18} className="text-embrapa-green" />
              {t.preferences}
            </h3>
          </div>
          <div className="p-4 space-y-4">
             <div>
                <label className="block text-xs font-bold text-gray-400 uppercase mb-2">Interface Language</label>
                <div className="flex gap-2">
                  <button 
                    onClick={() => setLanguage('en')}
                    className={`flex-1 py-2 rounded-lg border text-sm font-bold transition-all ${language === 'en' ? 'bg-embrapa-green text-white border-embrapa-green' : 'bg-white text-gray-600 border-gray-200'}`}
                  >
                    English
                  </button>
                  <button 
                    onClick={() => setLanguage('pt')}
                    className={`flex-1 py-2 rounded-lg border text-sm font-bold transition-all ${language === 'pt' ? 'bg-embrapa-green text-white border-embrapa-green' : 'bg-white text-gray-600 border-gray-200'}`}
                  >
                    Português
                  </button>
                </div>
             </div>

             <div>
                <label className="block text-xs font-bold text-gray-400 uppercase mb-2">Units</label>
                <div className="flex items-center justify-between p-3 border border-gray-200 rounded-lg">
                   <div className="flex items-center gap-2 text-gray-700 font-medium">
                      <Ruler size={18} /> Metric (Default)
                   </div>
                   <div className="w-3 h-3 bg-embrapa-green rounded-full"></div>
                </div>
             </div>
          </div>
        </section>

        {/* Notifications */}
        <section className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
          <div className="p-4 border-b border-gray-50 bg-gray-50/50">
             <h3 className="font-bold text-gray-700 flex items-center gap-2">
               <Bell size={18} className="text-embrapa-green" />
               Notifications
             </h3>
          </div>
          <div className="p-4 space-y-3">
             <div className="flex justify-between items-center">
                <span className="text-sm text-gray-700">Daily Reminders</span>
                <div className="w-10 h-6 bg-embrapa-green rounded-full relative"><div className="w-4 h-4 bg-white rounded-full absolute top-1 right-1"></div></div>
             </div>
             <div className="flex justify-between items-center">
                <span className="text-sm text-gray-700">Production Alerts</span>
                <div className="w-10 h-6 bg-embrapa-green rounded-full relative"><div className="w-4 h-4 bg-white rounded-full absolute top-1 right-1"></div></div>
             </div>
          </div>
        </section>

        {/* About App */}
        <section className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
          <div className="p-4 border-b border-gray-50 bg-gray-50/50">
             <h3 className="font-bold text-gray-700 flex items-center gap-2">
              <Info size={18} className="text-embrapa-green" />
              {t.aboutApp}
            </h3>
          </div>
          <div className="p-5 space-y-4">
            <div className="flex justify-between items-center pb-3 border-b border-gray-50">
              <span className="text-gray-600 text-sm">{t.version}</span>
              <span className="font-mono text-sm font-bold text-gray-800 bg-gray-100 px-2 py-1 rounded">2.1.0 (Beta)</span>
            </div>
            
            <div className="space-y-2">
               <p className="text-xs font-bold text-gray-400 uppercase tracking-wider">{t.poweredBy}</p>
               <div className="flex items-center gap-2 bg-gradient-to-r from-blue-50 to-indigo-50 text-blue-800 px-3 py-2 rounded-lg text-sm font-medium border border-blue-100">
                  <Sparkles size={16} className="text-blue-500" />
                  Gemini 2.5 Flash Image
               </div>
            </div>
          </div>
        </section>

        {/* Logout */}
        <button 
          onClick={onLogout}
          className="w-full bg-white border border-red-100 text-red-500 font-bold py-3 rounded-xl hover:bg-red-50 transition-colors flex items-center justify-center gap-2"
        >
           <LogOut size={18} /> Log Out
        </button>
        
        <div className="text-center text-xs text-gray-400 mt-4">
          © 2025 EcoFarm. {t.rightsReserved}.
        </div>
      </div>
    </div>
  );
};

export default Settings;