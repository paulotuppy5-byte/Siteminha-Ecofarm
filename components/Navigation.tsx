import React from 'react';
import { Home, Camera, Calendar, BookOpen, Settings, Bot } from 'lucide-react';
import { ViewState, Language } from '../types';
import { TRANSLATIONS } from '../constants';

interface NavigationProps {
  currentView: ViewState;
  onNavigate: (view: ViewState) => void;
  language: Language;
}

const Navigation: React.FC<NavigationProps> = ({ currentView, onNavigate, language }) => {
  const t = TRANSLATIONS[language];

  const navItems: { view: ViewState; icon: React.ElementType; label: string }[] = [
    { view: 'dashboard', icon: Home, label: t.dashboard },
    { view: 'planner', icon: Calendar, label: t.planner },
    { view: 'camera', icon: Camera, label: t.camera },
    { view: 'agent', icon: Bot, label: t.agent },
    { view: 'education', icon: BookOpen, label: t.education },
    { view: 'settings', icon: Settings, label: t.settings },
  ];

  return (
    <nav className="fixed bottom-0 left-0 w-full bg-white border-t border-gray-200 pb-safe shadow-lg z-50">
      <div className="flex justify-around items-center h-16 max-w-md mx-auto">
        {navItems.map((item) => {
          const isActive = currentView === item.view;
          const Icon = item.icon;
          
          // Special styling for the center Camera button
          if (item.view === 'camera') {
            return (
              <button
                key={item.view}
                onClick={() => onNavigate(item.view)}
                className={`relative -top-5 flex flex-col items-center justify-center w-14 h-14 rounded-full shadow-lg transition-transform ${
                  isActive ? 'bg-embrapa-accent text-embrapa-green scale-110' : 'bg-embrapa-green text-white hover:scale-105'
                }`}
              >
                <Icon size={24} />
              </button>
            );
          }

          return (
            <button
              key={item.view}
              onClick={() => onNavigate(item.view)}
              className={`flex flex-col items-center justify-center w-full h-full space-y-1 ${
                isActive ? 'text-embrapa-green font-semibold' : 'text-gray-500'
              }`}
            >
              <Icon size={20} strokeWidth={isActive ? 2.5 : 2} />
              <span className="text-[10px]">{item.label}</span>
            </button>
          );
        })}
      </div>
    </nav>
  );
};

export default Navigation;