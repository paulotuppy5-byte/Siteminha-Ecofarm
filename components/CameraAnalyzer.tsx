import React, { useState, useRef } from 'react';
import { Camera, Upload, AlertCircle, CheckCircle, HelpCircle, Loader2, ArrowRight, Sprout, Layers, Hand, Move, Droplets, ChevronRight, RotateCcw } from 'lucide-react';
import { analyzePlantImage } from '../services/geminiService';
import { PlantAnalysisResult, Language, SoilAnalysisResult } from '../types';
import { TRANSLATIONS } from '../constants';

interface CameraAnalyzerProps {
  language: Language;
}

type AnalyzerMode = 'plant' | 'soil';
type RibbonLength = 'none' | 'short' | 'medium' | 'long';
type SoilFeel = 'gritty' | 'smooth' | 'sticky' | 'neither';

const CameraAnalyzer: React.FC<CameraAnalyzerProps> = ({ language }) => {
  const [mode, setMode] = useState<AnalyzerMode>('soil');
  const t = TRANSLATIONS[language];

  // Plant Scan State
  const [image, setImage] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState<PlantAnalysisResult | null>(null);
  const [error, setError] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  // Soil Test State
  const [soilStep, setSoilStep] = useState<number>(2);
  const [formsBall, setFormsBall] = useState<boolean | null>(true);
  const [ribbonLength, setRibbonLength] = useState<RibbonLength | null>(null);
  const [soilFeel, setSoilFeel] = useState<SoilFeel | null>(null);
  const [soilResult, setSoilResult] = useState<SoilAnalysisResult | null>(null);

  // --- Plant Logic ---

  const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onloadend = () => {
      const base64String = reader.result as string;
      setImage(base64String);
      setResult(null);
      handleAnalyze(base64String);
    };
    reader.readAsDataURL(file);
  };

  const handleAnalyze = async (imgBase64: string) => {
    setLoading(true);
    setError(null);
    try {
      const data = await analyzePlantImage(imgBase64, language);
      setResult(data);
    } catch (err) {
      setError("Failed to analyze image. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  const triggerCamera = () => {
    fileInputRef.current?.click();
  };

  // --- Soil Logic ---

  const determineSoilType = () => {
    let type = "Unknown";
    let chars = "";
    let management = [];
    let crops = [];

    // Decision Tree Logic
    if (formsBall === false) {
      type = "Sand";
      chars = language === 'pt' ? "Granulado, não retém água." : "Gritty, does not hold water.";
      management = language === 'pt' ? ["Adicionar muita matéria orgânica", "Usar cobertura morta"] : ["Add lots of organic matter", "Use mulch heavily"];
      crops = ["Carrots", "Potatoes", "Watermelon"];
    } else {
      // Forms a ball
      if (ribbonLength === 'none') {
        type = "Loamy Sand";
        chars = language === 'pt' ? "Forma bola mas quebra fácil." : "Forms ball but breaks easily.";
        management = ["Add organic compost"];
        crops = ["Radishes", "Peppers"];
      } else if (ribbonLength === 'short') {
        // < 2.5cm
        if (soilFeel === 'gritty') type = "Sandy Loam";
        else if (soilFeel === 'smooth') type = "Silt Loam";
        else type = "Loam";
        
        chars = language === 'pt' ? "Equilibrado, boa drenagem." : "Balanced, good drainage.";
        management = ["Maintain organic matter", "Ideal for most crops"];
        crops = ["Tomatoes", "Corn", "Beans", "Lettuce"];
      } else if (ribbonLength === 'medium') {
        // 2.5 - 5cm
        if (soilFeel === 'gritty') type = "Sandy Clay Loam";
        else if (soilFeel === 'smooth') type = "Silty Clay Loam";
        else type = "Clay Loam";
        
        chars = language === 'pt' ? "Retém nutrientes, pesado." : "Holds nutrients, can be heavy.";
        management = ["Avoid compacting", "Plant cover crops"];
        crops = ["Broccoli", "Cabbage", "Wheat"];
      } else {
        // > 5cm
        if (soilFeel === 'gritty') type = "Sandy Clay";
        else if (soilFeel === 'smooth') type = "Silty Clay";
        else type = "Clay";
        
        chars = language === 'pt' ? "Muito denso, drena mal." : "Very dense, drains poorly.";
        management = ["Add gypsum", "Raised beds recommended", "Avoid working when wet"];
        crops = ["Rice", "Leafy Greens (in raised beds)"];
      }
    }

    setSoilResult({
      type,
      characteristics: chars,
      management,
      suitableCrops: crops
    });
    setSoilStep(4);
  };

  const resetSoilTest = () => {
    setSoilStep(0);
    setFormsBall(null);
    setRibbonLength(null);
    setSoilFeel(null);
    setSoilResult(null);
  };

  // --- UI Helpers ---

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'Healthy': return 'bg-green-100 text-green-800 border-green-200';
      case 'Disease Detected': return 'bg-red-100 text-red-800 border-red-200';
      case 'Nutrient Deficiency': return 'bg-yellow-100 text-yellow-800 border-yellow-200';
      default: return 'bg-gray-100 text-gray-800 border-gray-200';
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'Healthy': return <CheckCircle className="w-5 h-5" />;
      case 'Disease Detected': return <AlertCircle className="w-5 h-5" />;
      case 'Nutrient Deficiency': return <AlertCircle className="w-5 h-5" />;
      default: return <HelpCircle className="w-5 h-5" />;
    }
  };

  return (
    <div className="flex flex-col h-full bg-gray-50 pb-20">
      <div className="bg-embrapa-green p-4 text-white shadow-md z-10">
        <h2 className="text-xl font-bold mb-3">{t.analysisMode}</h2>
        <div className="flex p-1 bg-black/20 rounded-lg">
          <button 
            onClick={() => setMode('plant')}
            className={`flex-1 py-2 rounded-md text-sm font-bold flex items-center justify-center gap-2 transition-all ${mode === 'plant' ? 'bg-white text-embrapa-green shadow-sm' : 'text-white/80 hover:bg-white/10'}`}
          >
            <Sprout size={16} /> {t.plantHealth}
          </button>
          <button 
            onClick={() => setMode('soil')}
            className={`flex-1 py-2 rounded-md text-sm font-bold flex items-center justify-center gap-2 transition-all ${mode === 'soil' ? 'bg-white text-embrapa-soil shadow-sm' : 'text-white/80 hover:bg-white/10'}`}
          >
            <Layers size={16} /> {t.soilType}
          </button>
        </div>
      </div>

      <div className="flex-1 overflow-y-auto p-4 space-y-6">
        
        {/* === PLANT SCAN MODE === */}
        {mode === 'plant' && (
          <div className="space-y-6 animate-fade-in">
            {/* Image Preview / Upload Area */}
            <div className="relative w-full aspect-[4/3] bg-gray-200 rounded-xl overflow-hidden shadow-inner border-2 border-dashed border-gray-400 flex items-center justify-center group">
              {image ? (
                <img src={image} alt="Captured plant" className="w-full h-full object-cover" />
              ) : (
                <div className="text-center p-6" onClick={triggerCamera}>
                  <div className="bg-white p-4 rounded-full inline-block mb-3 shadow-md group-active:scale-95 transition-transform">
                    <Camera className="w-8 h-8 text-embrapa-green" />
                  </div>
                  <p className="text-gray-600 font-medium">{t.uploadTip}</p>
                  <p className="text-xs text-gray-400 mt-2">Supports JPG, PNG</p>
                </div>
              )}
              
              <input
                type="file"
                accept="image/*"
                capture="environment"
                className="hidden"
                ref={fileInputRef}
                onChange={handleFileChange}
              />
              
              {image && !loading && (
                <button 
                  onClick={triggerCamera}
                  className="absolute bottom-3 right-3 bg-white/90 text-gray-700 p-2 rounded-full shadow hover:bg-white"
                >
                  <Upload className="w-5 h-5" />
                </button>
              )}
            </div>

            {/* Loading State */}
            {loading && (
              <div className="flex flex-col items-center justify-center p-8 bg-white rounded-xl shadow-sm border border-gray-100 animate-pulse">
                <Loader2 className="w-10 h-10 text-embrapa-green animate-spin mb-3" />
                <p className="text-embrapa-green font-medium">{t.analyzing}</p>
              </div>
            )}

            {/* Results */}
            {result && !loading && (
              <div className="space-y-4 animate-fade-in">
                <div className={`p-5 rounded-xl border ${getStatusColor(result.healthStatus)} shadow-sm`}>
                  <div className="flex items-center justify-between mb-2">
                    <h3 className="font-bold text-lg flex items-center gap-2">
                      {getStatusIcon(result.healthStatus)}
                      {result.healthStatus}
                    </h3>
                    <span className="text-xs font-mono px-2 py-1 bg-white/50 rounded-full">
                      {Math.round(result.confidence)}% Conf.
                    </span>
                  </div>
                  <p className="text-sm opacity-90">{result.plantName}</p>
                </div>

                <div className="bg-white p-5 rounded-xl shadow-sm border border-gray-100">
                  <h4 className="font-bold text-gray-800 mb-2 border-b pb-2">Diagnosis</h4>
                  <p className="text-gray-600 leading-relaxed text-sm mb-4">
                    {result.diagnosis}
                  </p>

                  <h4 className="font-bold text-gray-800 mb-2 border-b pb-2">{t.recommendations}</h4>
                  <ul className="space-y-2">
                    {result.recommendations.map((rec, idx) => (
                      <li key={idx} className="flex items-start gap-2 text-sm text-gray-600 bg-gray-50 p-2 rounded">
                        <ArrowRight className="w-4 h-4 text-embrapa-green flex-shrink-0 mt-0.5" />
                        {rec}
                      </li>
                    ))}
                  </ul>

                  <div className="mt-4 pt-4 border-t flex items-center justify-between">
                    <span className="text-sm font-medium text-gray-500">Harvest Ready?</span>
                    <span className={`px-3 py-1 rounded-full text-xs font-bold ${result.harvestReady ? 'bg-green-100 text-green-700' : 'bg-gray-100 text-gray-600'}`}>
                      {result.harvestReady ? 'YES' : 'NO'}
                    </span>
                  </div>
                </div>
              </div>
            )}

            {error && (
              <div className="bg-red-50 text-red-600 p-4 rounded-xl border border-red-100 text-center text-sm">
                {error}
              </div>
            )}
          </div>
        )}

        {/* === SOIL TEST MODE === */}
        {mode === 'soil' && (
          <div className="animate-fade-in pb-10">
            {/* Step 0: Intro */}
            {soilStep === 0 && (
              <div className="text-center space-y-6 pt-4">
                <div className="bg-embrapa-soil/10 w-24 h-24 rounded-full flex items-center justify-center mx-auto">
                  <Layers className="w-12 h-12 text-embrapa-soil" />
                </div>
                <div>
                  <h3 className="text-2xl font-bold text-gray-800 mb-2">Soil Estimator</h3>
                  <p className="text-gray-600 max-w-xs mx-auto">{t.soilTestIntro}</p>
                </div>
                <div className="bg-white p-4 rounded-xl border border-gray-100 text-left text-sm text-gray-600 shadow-sm">
                  <p className="font-bold mb-2">Instructions:</p>
                  <ol className="list-decimal pl-4 space-y-1">
                    <li>Take a handful of soil from the top 10cm.</li>
                    <li>Add water until it's moist like putty.</li>
                    <li>Follow the on-screen steps.</li>
                  </ol>
                </div>
                <button 
                  onClick={() => setSoilStep(1)}
                  className="w-full bg-embrapa-soil text-white py-4 rounded-xl font-bold shadow-lg hover:bg-amber-900 transition-colors flex items-center justify-center gap-2"
                >
                  {t.startTest} <ArrowRight size={20} />
                </button>
              </div>
            )}

            {/* Step 1: Ball Test */}
            {soilStep === 1 && (
              <div className="space-y-6">
                <div className="flex items-center gap-2 text-embrapa-soil font-bold uppercase tracking-wider text-sm">
                  <span className="bg-embrapa-soil text-white w-6 h-6 rounded-full flex items-center justify-center text-xs">1</span>
                  {t.testStep1}
                </div>
                
                <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100 text-center">
                  <Hand className="w-16 h-16 text-gray-400 mx-auto mb-4" />
                  <h3 className="text-lg font-bold text-gray-800 mb-2">Squeeze the Soil</h3>
                  <p className="text-gray-600 text-sm mb-6">Squeeze a handful of moist soil firmly. Does it hold together in a ball, or does it crumble apart?</p>
                  
                  <div className="grid grid-cols-2 gap-3">
                    <button 
                      onClick={() => { setFormsBall(false); determineSoilType(); }}
                      className="p-4 rounded-xl border border-gray-200 hover:border-embrapa-soil hover:bg-amber-50 transition-all text-center"
                    >
                      <div className="font-bold text-gray-700">Crumbles</div>
                      <div className="text-xs text-gray-400 mt-1">Falls apart</div>
                    </button>
                    <button 
                      onClick={() => { setFormsBall(true); setSoilStep(2); }}
                      className="p-4 rounded-xl border border-gray-200 hover:border-embrapa-soil hover:bg-amber-50 transition-all text-center"
                    >
                      <div className="font-bold text-gray-700">Holds Shape</div>
                      <div className="text-xs text-gray-400 mt-1">Stays in a ball</div>
                    </button>
                  </div>
                </div>
              </div>
            )}

            {/* Step 2: Ribbon Test */}
            {soilStep === 2 && (
              <div className="space-y-6">
                <div className="flex items-center gap-2 text-embrapa-soil font-bold uppercase tracking-wider text-sm">
                  <span className="bg-embrapa-soil text-white w-6 h-6 rounded-full flex items-center justify-center text-xs">2</span>
                  {t.testStep2}
                </div>
                
                <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100 text-center">
                  <Move className="w-16 h-16 text-gray-400 mx-auto mb-4" />
                  <h3 className="text-lg font-bold text-gray-800 mb-2">Form a Ribbon</h3>
                  <p className="text-gray-600 text-sm mb-6">Squeeze the soil between your thumb and forefinger to push out a ribbon. How long does it get before breaking?</p>
                  
                  <div className="space-y-3">
                    <button 
                      onClick={() => { setRibbonLength('none'); determineSoilType(); }}
                      className="w-full p-4 rounded-xl border border-gray-200 hover:border-embrapa-soil hover:bg-amber-50 transition-all text-left flex justify-between items-center"
                    >
                      <span className="font-bold text-gray-700">No Ribbon</span>
                      <span className="text-xs text-gray-400">Breaks immediately</span>
                    </button>
                    <button 
                      onClick={() => { setRibbonLength('short'); setSoilStep(3); }}
                      className="w-full p-4 rounded-xl border border-gray-200 hover:border-embrapa-soil hover:bg-amber-50 transition-all text-left flex justify-between items-center"
                    >
                      <span className="font-bold text-gray-700">Short Ribbon</span>
                      <span className="text-xs text-gray-400">&lt; 2.5 cm</span>
                    </button>
                    <button 
                      onClick={() => { setRibbonLength('medium'); setSoilStep(3); }}
                      className="w-full p-4 rounded-xl border border-gray-200 hover:border-embrapa-soil hover:bg-amber-50 transition-all text-left flex justify-between items-center"
                    >
                      <span className="font-bold text-gray-700">Medium Ribbon</span>
                      <span className="text-xs text-gray-400">2.5 - 5 cm</span>
                    </button>
                    <button 
                      onClick={() => { setRibbonLength('long'); setSoilStep(3); }}
                      className="w-full p-4 rounded-xl border border-gray-200 hover:border-embrapa-soil hover:bg-amber-50 transition-all text-left flex justify-between items-center"
                    >
                      <span className="font-bold text-gray-700">Long Ribbon</span>
                      <span className="text-xs text-gray-400">&gt; 5 cm</span>
                    </button>
                  </div>
                </div>
              </div>
            )}

            {/* Step 3: Texture Test */}
            {soilStep === 3 && (
              <div className="space-y-6">
                <div className="flex items-center gap-2 text-embrapa-soil font-bold uppercase tracking-wider text-sm">
                  <span className="bg-embrapa-soil text-white w-6 h-6 rounded-full flex items-center justify-center text-xs">3</span>
                  {t.testStep3}
                </div>
                
                <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100 text-center">
                  <Droplets className="w-16 h-16 text-gray-400 mx-auto mb-4" />
                  <h3 className="text-lg font-bold text-gray-800 mb-2">Feel the Texture</h3>
                  <p className="text-gray-600 text-sm mb-6">Wet a small pinch of soil excessively in your palm and rub it. What is the dominant feeling?</p>
                  
                  <div className="grid grid-cols-1 gap-3">
                    <button 
                      onClick={() => { setSoilFeel('gritty'); setTimeout(determineSoilType, 100); }}
                      className="p-4 rounded-xl border border-gray-200 hover:border-embrapa-soil hover:bg-amber-50 transition-all text-left"
                    >
                      <div className="font-bold text-gray-700">Gritty</div>
                      <div className="text-xs text-gray-400">Feels like sand/sugar</div>
                    </button>
                    <button 
                      onClick={() => { setSoilFeel('smooth'); setTimeout(determineSoilType, 100); }}
                      className="p-4 rounded-xl border border-gray-200 hover:border-embrapa-soil hover:bg-amber-50 transition-all text-left"
                    >
                      <div className="font-bold text-gray-700">Smooth / Floury</div>
                      <div className="text-xs text-gray-400">Feels like flour or talc</div>
                    </button>
                    <button 
                      onClick={() => { setSoilFeel('neither'); setTimeout(determineSoilType, 100); }}
                      className="p-4 rounded-xl border border-gray-200 hover:border-embrapa-soil hover:bg-amber-50 transition-all text-left"
                    >
                      <div className="font-bold text-gray-700">Neither / Sticky</div>
                      <div className="text-xs text-gray-400">Feels sticky or generic</div>
                    </button>
                  </div>
                </div>
              </div>
            )}

            {/* Step 4: Result */}
            {soilStep === 4 && soilResult && (
              <div className="space-y-6 animate-slide-up">
                 <div className="bg-gradient-to-br from-amber-700 to-amber-900 text-white p-6 rounded-2xl shadow-lg text-center relative overflow-hidden">
                    <div className="absolute top-0 right-0 w-32 h-32 bg-white/10 rounded-full -mr-10 -mt-10"></div>
                    <Layers className="w-16 h-16 mx-auto mb-3 relative z-10 text-amber-200" />
                    <h3 className="text-sm uppercase tracking-widest text-amber-200 mb-1">{t.soilResult}</h3>
                    <h2 className="text-3xl font-bold mb-4">{soilResult.type}</h2>
                    <p className="text-amber-100 italic">"{soilResult.characteristics}"</p>
                 </div>

                 <div className="bg-white p-5 rounded-xl border border-gray-100 shadow-sm">
                    <h4 className="font-bold text-gray-800 mb-3 flex items-center gap-2">
                       <Sprout size={18} className="text-embrapa-green" /> Suitable Crops
                    </h4>
                    <div className="flex flex-wrap gap-2 mb-6">
                       {soilResult.suitableCrops.map((crop, i) => (
                          <span key={i} className="px-3 py-1 bg-green-50 text-green-700 rounded-full text-sm font-medium border border-green-100">
                             {crop}
                          </span>
                       ))}
                    </div>

                    <h4 className="font-bold text-gray-800 mb-3 flex items-center gap-2">
                       <CheckCircle size={18} className="text-embrapa-green" /> Management Tips
                    </h4>
                    <ul className="space-y-2">
                       {soilResult.management.map((tip, i) => (
                          <li key={i} className="flex items-start gap-2 text-sm text-gray-600 bg-gray-50 p-2 rounded">
                             <ArrowRight className="w-4 h-4 text-embrapa-green flex-shrink-0 mt-0.5" />
                             {tip}
                          </li>
                       ))}
                    </ul>
                 </div>

                 <button 
                   onClick={resetSoilTest}
                   className="w-full py-4 text-gray-500 font-bold hover:text-gray-800 flex items-center justify-center gap-2"
                 >
                   <RotateCcw size={18} /> Restart Test
                 </button>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
};

export default CameraAnalyzer;