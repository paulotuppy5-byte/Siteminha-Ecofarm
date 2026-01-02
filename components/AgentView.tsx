
import React, { useState, useRef, useEffect } from 'react';
import { Send, Bot, User, Loader2, Sparkles, AlertCircle } from 'lucide-react';
import { AgentService } from '../services/AgentService';
import { ChatMessage, FarmProfile, Language } from '../types';

interface AgentViewProps {
  language: Language;
  farmProfile: FarmProfile;
  location?: { lat: number; lon: number };
}

// Mock Telemetry to trigger specific agent logic rules
const MOCK_TELEMETRY = {
  solar: { 
    kwhGenerated: 12.5, 
    forecast: 18.0, 
    status: "Warning: Low Production",
    trend: "Cloud cover increasing"
  },
  crops: { 
    fieldId: "F1", 
    crop: "Maize", 
    growthStageVT: 7, 
    moisturePercent: 32 // Triggers moisture logic (<40%)
  }
};

const AgentView: React.FC<AgentViewProps> = ({ language, farmProfile, location }) => {
  const [messages, setMessages] = useState<ChatMessage[]>([
    {
      id: 'welcome',
      role: 'model',
      content: language === 'pt' 
        ? "Olá! Sou o ECOFARM, seu agente de diagnóstico agrícola. Como posso ajudar sua fazenda hoje?" 
        : "Hello! I am ECOFARM, your agricultural diagnostic agent. I see some alerts in your solar and crop units. How can I help?",
      timestamp: new Date()
    }
  ]);
  const [inputText, setInputText] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  
  // Initialize Service with Telemetry
  const agentServiceRef = useRef<AgentService | null>(null);

  useEffect(() => {
    // Re-initialize if profile or language changes, maintaining persistent session logic if needed
    // In a real app, we might check if existing session is valid, but here we refresh context
    agentServiceRef.current = new AgentService(farmProfile, language, MOCK_TELEMETRY);
  }, [farmProfile, language]);

  // Scroll to bottom
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  const handleSend = async () => {
    if (!inputText.trim() || !agentServiceRef.current) return;

    const userMsg: ChatMessage = {
      id: Date.now().toString(),
      role: 'user',
      content: inputText,
      timestamp: new Date()
    };

    setMessages(prev => [...prev, userMsg]);
    setInputText('');
    setIsLoading(true);

    try {
      const response = await agentServiceRef.current.sendMessage(userMsg.content, location);
      setMessages(prev => [...prev, response]);
    } catch (error) {
      setMessages(prev => [...prev, {
        id: Date.now().toString(),
        role: 'model',
        content: "Connection Error. Please try again.",
        timestamp: new Date()
      }]);
    } finally {
      setIsLoading(false);
    }
  };

  const formatTime = (date: Date) => {
    return date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
  };

  const renderContent = (content: string) => {
    // Basic markdown parsing for the signature block
    if (content.includes('```')) {
      const parts = content.split('```');
      return (
        <div>
           {parts.map((part, i) => {
              if (i % 2 === 1) {
                // Code block (Signature)
                return (
                  <div key={i} className="bg-slate-900 text-green-400 font-mono text-xs p-3 rounded-lg my-2 overflow-x-auto whitespace-pre-wrap border border-slate-700 shadow-inner">
                    {part.trim()}
                  </div>
                );
              }
              // Normal text
              return <div key={i} className="whitespace-pre-wrap">{part}</div>;
           })}
        </div>
      );
    }
    return <div className="whitespace-pre-wrap">{content}</div>;
  };

  return (
    <div className="flex flex-col h-full bg-gray-50 pb-20">
      {/* Header */}
      <div className="bg-gradient-to-r from-slate-900 to-slate-800 p-4 shadow-md sticky top-0 z-10 text-white">
        <div className="flex items-center gap-3">
           <div className="p-2 bg-green-500/20 rounded-full border border-green-500/50">
              <Bot size={24} className="text-green-400" />
           </div>
           <div>
              <h2 className="font-bold text-lg leading-none">ECOFARM Agent</h2>
              <div className="flex items-center gap-1.5 mt-1">
                 <span className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></span>
                 <span className="text-xs text-slate-300 font-mono">Gemini 3 Pro Active</span>
              </div>
           </div>
        </div>
      </div>

      {/* Chat Area */}
      <div className="flex-1 overflow-y-auto p-4 space-y-4">
        {messages.map((msg) => {
          const isUser = msg.role === 'user';
          return (
            <div key={msg.id} className={`flex ${isUser ? 'justify-end' : 'justify-start'}`}>
              <div className={`flex gap-2 max-w-[85%] ${isUser ? 'flex-row-reverse' : 'flex-row'}`}>
                
                {/* Avatar */}
                <div className={`w-8 h-8 rounded-full flex items-center justify-center shrink-0 ${isUser ? 'bg-indigo-100 text-indigo-600' : 'bg-slate-800 text-green-400'}`}>
                  {isUser ? <User size={16} /> : <Sparkles size={16} />}
                </div>

                {/* Bubble */}
                <div className={`p-3 rounded-2xl shadow-sm text-sm ${
                  isUser 
                    ? 'bg-indigo-600 text-white rounded-tr-none' 
                    : 'bg-white text-gray-800 border border-gray-200 rounded-tl-none'
                }`}>
                  {renderContent(msg.content)}
                  <p className={`text-[10px] mt-1 text-right ${isUser ? 'text-indigo-200' : 'text-gray-400'}`}>
                    {formatTime(msg.timestamp)}
                  </p>
                </div>
              </div>
            </div>
          );
        })}

        {isLoading && (
          <div className="flex justify-start">
             <div className="flex gap-2 max-w-[85%]">
                <div className="w-8 h-8 rounded-full bg-slate-800 text-green-400 flex items-center justify-center shrink-0">
                   <Loader2 size={16} className="animate-spin" />
                </div>
                <div className="bg-white p-3 rounded-2xl rounded-tl-none border border-gray-200 shadow-sm flex items-center gap-2">
                   <span className="text-xs text-gray-500 font-medium">Analyzing farm data...</span>
                </div>
             </div>
          </div>
        )}
        <div ref={messagesEndRef} />
      </div>

      {/* Input Area */}
      <div className="p-4 bg-white border-t border-gray-200 sticky bottom-16">
        <div className="flex gap-2 relative">
          <input
            type="text"
            value={inputText}
            onChange={(e) => setInputText(e.target.value)}
            onKeyDown={(e) => e.key === 'Enter' && handleSend()}
            placeholder={language === 'pt' ? "Descreva o problema..." : "Describe the issue..."}
            disabled={isLoading}
            className="flex-1 p-3 pr-10 bg-gray-50 border border-gray-200 rounded-xl focus:outline-none focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500 disabled:opacity-60"
          />
          <button 
            onClick={handleSend}
            disabled={!inputText.trim() || isLoading}
            className="bg-slate-900 text-white p-3 rounded-xl hover:bg-slate-800 disabled:opacity-50 transition-colors shadow-lg shadow-slate-900/20"
          >
            <Send size={20} />
          </button>
        </div>
      </div>
    </div>
  );
};

export default AgentView;
