import React, { useState } from 'react';
import { EDUCATION_MODULES } from '../constants';
import { ChevronRight, ChevronDown, PlayCircle, FileText, ExternalLink, BookOpen } from 'lucide-react';
import { Language } from '../types';

interface EducationProps {
  language: Language;
}

const Education: React.FC<EducationProps> = ({ language }) => {
  const [expandedModuleId, setExpandedModuleId] = useState<string | null>('mod_cattle');

  const openResource = (url: string) => {
    window.open(url, '_blank', 'noopener,noreferrer');
  };

  const toggleModule = (id: string) => {
    setExpandedModuleId(expandedModuleId === id ? null : id);
  };

  return (
    <div className="flex flex-col h-full bg-gray-50 pb-20">
      <div className="bg-white p-6 shadow-sm border-b border-gray-100 sticky top-0 z-10">
        <h2 className="text-2xl font-bold text-gray-800">Knowledge Hub</h2>
        <p className="text-gray-500 text-sm">Expert resources, videos, and research papers.</p>
      </div>

      <div className="p-4 space-y-4 overflow-y-auto">
        {EDUCATION_MODULES.map((module) => {
          const Icon = module.icon;
          const isExpanded = expandedModuleId === module.id;

          return (
            <div key={module.id} className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden transition-all duration-300">
              {/* Module Header */}
              <button 
                onClick={() => toggleModule(module.id)}
                className={`w-full p-4 flex items-center justify-between text-left transition-colors ${isExpanded ? 'bg-gray-50' : 'bg-white hover:bg-gray-50/50'}`}
              >
                <div className="flex items-center gap-3">
                  <div className={`p-2.5 rounded-lg shrink-0 ${isExpanded ? 'bg-embrapa-green text-white' : 'bg-embrapa-light text-embrapa-green'}`}>
                    <Icon size={24} />
                  </div>
                  <div>
                    <h3 className="font-bold text-gray-800 leading-tight">{module.title}</h3>
                    <p className="text-xs text-gray-500 mt-1 line-clamp-1">{module.description}</p>
                  </div>
                </div>
                {isExpanded ? <ChevronDown className="text-gray-400" /> : <ChevronRight className="text-gray-400" />}
              </button>

              {/* Resource List (Collapsible) */}
              {isExpanded && (
                <div className="divide-y divide-gray-50 border-t border-gray-100 animate-fade-in">
                  {module.resources.map((resource, idx) => (
                    <button 
                      key={idx} 
                      onClick={() => openResource(resource.url)}
                      className="w-full text-left p-4 hover:bg-gray-50 transition-colors flex items-center gap-3 group"
                    >
                      <div className={`p-2 rounded-full shrink-0 ${resource.type === 'video' ? 'bg-red-50 text-red-500' : 'bg-blue-50 text-blue-500'}`}>
                        {resource.type === 'video' ? <PlayCircle size={18} /> : <FileText size={18} />}
                      </div>
                      
                      <div className="flex-1 min-w-0">
                        <h4 className="text-sm font-medium text-gray-700 truncate group-hover:text-embrapa-green transition-colors">
                          {resource.title}
                        </h4>
                        <div className="flex items-center gap-2 mt-1">
                          <span className="text-[10px] uppercase tracking-wider text-gray-400 font-semibold border border-gray-200 px-1.5 py-0.5 rounded">
                            {resource.type}
                          </span>
                          {resource.duration && (
                            <span className="text-[10px] text-gray-400 flex items-center gap-1">
                               • {resource.duration}
                            </span>
                          )}
                          {resource.source && (
                            <span className="text-[10px] text-gray-400 truncate">
                               • {resource.source}
                            </span>
                          )}
                        </div>
                      </div>

                      <ExternalLink size={14} className="text-gray-300 group-hover:text-embrapa-green" />
                    </button>
                  ))}
                  
                  {module.resources.length === 0 && (
                    <div className="p-4 text-center text-gray-400 text-sm italic">
                      No resources available yet.
                    </div>
                  )}
                </div>
              )}
            </div>
          );
        })}

        <div className="mt-6 bg-embrapa-light/50 p-5 rounded-xl border border-embrapa-light text-center">
          <BookOpen className="w-8 h-8 text-embrapa-green mx-auto mb-2" />
          <h3 className="font-bold text-embrapa-green mb-1">More Resources Needed?</h3>
          <p className="text-sm text-gray-600 mb-3">Check the official Embrapa portal for technical manuals.</p>
          <button 
            onClick={() => window.open('https://www.embrapa.br', '_blank')}
            className="text-sm font-bold text-embrapa-green underline decoration-2 underline-offset-2 hover:text-green-800"
          >
            Visit Embrapa Portal
          </button>
        </div>
      </div>
    </div>
  );
};

export default Education;