
import React, { useState, useEffect, useMemo } from 'react';
import { 
  CheckCircle2, Circle, ChevronDown, ChevronUp, 
  Ruler, Hammer, CalendarClock, Sprout, 
  Fish, Warehouse, Recycle, ArrowRight,
  TrendingUp, Scaling, Trophy, Lock,
  ClipboardList, Map, Activity, Sun, Droplets, Thermometer,
  Factory, Beef, Zap, ArrowLeft, RefreshCw, BarChart3, LayoutGrid, Calculator, Trash2, Plus,
  DollarSign, PieChart, ShoppingCart, Wallet
} from 'lucide-react';
import { Language, FarmTier, SystemComponent, SimulationInput, SimulationResult, SimulationGroupInput } from '../types';
import { TIER_2_COMPONENTS, TIER_3_COMPONENTS, REFERENCE_DATA } from '../constants';
import { EcofarmCalculator } from '../services/EcofarmCalculator';

interface PlannerProps {
  language: Language;
  farmTier: FarmTier;
  initialUnitId?: string | null;
}

interface Task {
  id: string;
  text: string;
  isCompleted: boolean;
  cost?: number;
}

interface Step {
  id: string;
  title: string;
  icon: React.ElementType;
  description: string;
  tasks: Task[];
}

interface Phase {
  id: string;
  title: string;
  duration: string;
  status: 'active' | 'locked' | 'completed';
  steps: Step[];
}

interface BudgetItem {
  item: string;
  qty: number;
  unitCost: number;
  total: number;
  note?: string;
  category: 'Structure' | 'Hydraulics' | 'Biofilter' | 'Garden' | 'Animals' | 'Tools' | 'Labor';
}

// --- JATOBA IMPLEMENTATION DATA (Tier 1) ---

const JATOBA_ROADMAP: Phase[] = [
  {
    id: 'p1',
    title: 'Phase 1: Foundation & Tank',
    duration: 'Week 1',
    status: 'active',
    steps: [
      {
        id: 's1',
        title: 'Site Preparation',
        icon: Map,
        description: 'Prepare the 50-100m² area in Jatobá.',
        tasks: [
          { id: 't1_1', text: 'Clear 50m² area (remove debris/rocks)', isCompleted: true },
          { id: 't1_2', text: 'Level ground for tank placement', isCompleted: true },
          { id: 't1_3', text: 'Check proximity to water source (well/cistern)', isCompleted: true },
        ]
      },
      {
        id: 's2',
        title: 'Tank Construction',
        icon: Fish,
        description: 'Install the 500L-1000L fish tank.',
        tasks: [
          { id: 't2_1', text: 'Purchase Fibrocimento Tank (500L)', isCompleted: false },
          { id: 't2_2', text: 'Excavate 20cm base for stability', isCompleted: false },
          { id: 't2_3', text: 'Position tank and verify level', isCompleted: false },
        ]
      }
    ]
  },
  {
    id: 'p2',
    title: 'Phase 2: Hydraulics & Biofilter',
    duration: 'Weeks 1-2',
    status: 'active',
    steps: [
      {
        id: 's3',
        title: 'Hydraulic Setup',
        icon: Droplets,
        description: 'Pump and overflow plumbing.',
        tasks: [
          { id: 't3_1', text: 'Install submersible pump (30W)', isCompleted: false },
          { id: 't3_2', text: 'Connect PVC DN20 piping', isCompleted: false },
          { id: 't3_3', text: 'Setup overflow pipe to return to tank', isCompleted: false },
        ]
      },
      {
        id: 's4',
        title: 'Biofilter Assembly',
        icon: Recycle,
        description: 'Filtration for water quality.',
        tasks: [
          { id: 't4_1', text: 'Prepare 200L bucket/container', isCompleted: false },
          { id: 't4_2', text: 'Wash and fill with crushed stone (brita)', isCompleted: false },
          { id: 't4_3', text: 'Test water circulation (24h run)', isCompleted: false },
        ]
      }
    ]
  },
  {
    id: 'p3',
    title: 'Phase 3: Garden & Soil',
    duration: 'Weeks 2-3',
    status: 'locked',
    steps: [
      {
        id: 's5',
        title: 'Horta Bed Construction',
        icon: Sprout,
        description: 'Integrated vegetable production.',
        tasks: [
          { id: 't5_1', text: 'Lay out blocks for 3 beds', isCompleted: false },
          { id: 't5_2', text: 'Mix soil (3:1 soil/manure)', isCompleted: false },
          { id: 't5_3', text: 'Install drip hose from tank overflow', isCompleted: false },
        ]
      }
    ]
  },
  {
    id: 'p4',
    title: 'Phase 4: Life & Cycling',
    duration: 'Weeks 3-4',
    status: 'locked',
    steps: [
      {
        id: 's6',
        title: 'System Activation',
        icon: Activity,
        description: 'Cycling and stocking.',
        tasks: [
          { id: 't6_1', text: 'Cycle water for 2 weeks (Nitrogen cycle)', isCompleted: false },
          { id: 't6_2', text: 'Stock 50-100 Tilapia fingerlings', isCompleted: false },
          { id: 't6_3', text: 'Introduce 4 Hens (Galinheiro module)', isCompleted: false },
        ]
      }
    ]
  }
];

const JATOBA_BUDGET: BudgetItem[] = [
  { category: 'Structure', item: 'Fibrocimento Tank 500L', qty: 1, unitCost: 1000, total: 1000, note: 'Or DIY Alvenaria' },
  { category: 'Hydraulics', item: 'Submersible Pump 30W', qty: 1, unitCost: 200, total: 200, note: 'Low energy' },
  { category: 'Hydraulics', item: 'PVC DN20 (50m)', qty: 1, unitCost: 175, total: 175, note: 'Local hardware' },
  { category: 'Hydraulics', item: 'Drip Hose / Fittings', qty: 1, unitCost: 175, total: 175, note: 'Irrigation' },
  { category: 'Biofilter', item: 'Crushed Stone (Brita) 50kg', qty: 1, unitCost: 40, total: 40, note: 'Quarry' },
  { category: 'Biofilter', item: 'Biofilter Container (200L)', qty: 1, unitCost: 60, total: 60, note: 'Recycled drum' },
  { category: 'Garden', item: 'Cement Blocks', qty: 20, unitCost: 2.5, total: 50, note: 'Bed walls' },
  { category: 'Garden', item: 'Soil/Manure Mix', qty: 1, unitCost: 100, total: 100, note: 'Local source' },
  { category: 'Animals', item: 'Laying Hens', qty: 4, unitCost: 40, total: 160, note: 'Local breed' },
  { category: 'Animals', item: 'Coop Materials (DIY)', qty: 1, unitCost: 150, total: 150, note: 'Wood/Mesh' },
  { category: 'Tools', item: 'Basic Tools (Shovel, etc)', qty: 1, unitCost: 120, total: 120, note: 'One-time' },
  { category: 'Labor', item: 'Community Labor (Mutirão)', qty: 1, unitCost: 0, total: 0, note: 'Volunteer' },
];

const getUnitIcon = (category: string) => {
  switch (category) {
    case 'animal': return Beef;
    case 'energy': return Factory;
    case 'processing': return Sprout;
    case 'water': return Fish;
    case 'plant': return Sprout;
    default: return Activity;
  }
};

const getUnitColor = (category: string) => {
  switch (category) {
    case 'animal': return 'bg-orange-100 text-orange-600';
    case 'energy': return 'bg-yellow-100 text-yellow-600';
    case 'processing': return 'bg-green-100 text-green-600';
    case 'water': return 'bg-blue-100 text-blue-600';
    case 'plant': return 'bg-emerald-100 text-emerald-600';
    default: return 'bg-gray-100 text-gray-600';
  }
};

// --- TIER 3 IMPLEMENTATION DATA (Complete 6 Units) ---

const TIER_3_ROADMAPS: Record<string, Phase[]> = {
  // UNIT 1: CATTLE (60% Complete)
  't3_1': [ 
    {
      id: 'p1',
      title: 'Phase 1: Foundation',
      duration: 'Weeks 1-2',
      status: 'completed',
      steps: [
        {
          id: 's1',
          title: 'Site Preparation',
          icon: Map,
          description: 'Surveying and drainage.',
          tasks: [
            { id: 't1_1', text: 'Topographic survey of 2ha area', isCompleted: true },
            { id: 't1_2', text: 'Establish drainage slope (3%)', isCompleted: true },
            { id: 't1_3', text: 'Install perimeter fencing (5-strand)', isCompleted: true },
          ]
        },
        {
          id: 's2',
          title: 'Water Infrastructure',
          icon: Droplets,
          description: 'Piping and trough locations.',
          tasks: [
            { id: 't2_1', text: 'Lay main 50mm PVC water line', isCompleted: true },
            { id: 't2_2', text: 'Install 4 concrete water trough bases', isCompleted: true },
          ]
        }
      ]
    },
    {
      id: 'p2',
      title: 'Phase 2: Feeding Infra',
      duration: 'Weeks 3-4',
      status: 'completed',
      steps: [
         {
          id: 's3',
          title: 'Feed Lane Construction',
          icon: Hammer,
          description: 'Concrete aprons and bunks.',
          tasks: [
            { id: 't3_1', text: 'Pour concrete feed apron (4m wide)', isCompleted: true },
            { id: 't3_2', text: 'Construct J-bunk feeders', isCompleted: true },
          ]
         }
      ]
    },
    {
      id: 'p3',
      title: 'Phase 3: Shade & Cooling',
      duration: 'Weeks 5-6',
      status: 'active',
      steps: [
        {
          id: 's4',
          title: 'Shade Structures',
          icon: Sun,
          description: 'Thermal comfort installation.',
          tasks: [
            { id: 't4_1', text: 'Install steel vertical supports', isCompleted: true },
            { id: 't4_2', text: 'Mount UV-resistant shade cloth (80%)', isCompleted: false },
            { id: 't4_3', text: 'Verify 4m² shade per animal', isCompleted: false },
          ]
        },
        {
          id: 's5',
          title: 'Misting System',
          icon: Droplets,
          description: 'Evaporative cooling.',
          tasks: [
            { id: 't5_1', text: 'Install high-pressure mist line', isCompleted: false },
            { id: 't5_2', text: 'Connect timer/thermostat controller', isCompleted: false },
          ]
        }
      ]
    },
    {
      id: 'p4',
      title: 'Phase 4: Manure Mgmt',
      duration: 'Weeks 7-8',
      status: 'locked',
      steps: [
        {
          id: 's6',
          title: 'Collection System',
          icon: Recycle,
          description: 'Integration with Biodigester.',
          tasks: [
            { id: 't6_1', text: 'Install scraper lanes', isCompleted: false },
            { id: 't6_2', text: 'Connect gravity pipe to Biodigester', isCompleted: false },
          ]
        }
      ]
    }
  ],
  // UNIT 2: BIOGAS (88% Complete)
  't3_2': [ 
    {
      id: 'p1',
      title: 'Phase 1: Digester Tank',
      duration: 'Weeks 1-3',
      status: 'completed',
      steps: [
        {
          id: 's1',
          title: 'Excavation & Lining',
          icon: Activity,
          description: '50m³ volume preparation.',
          tasks: [
            { id: 't1_1', text: 'Excavate 8m diameter pit', isCompleted: true },
            { id: 't1_2', text: 'Install HDPE Geomembrane (1.5mm)', isCompleted: true },
            { id: 't1_3', text: 'Leak test (48h water hold)', isCompleted: true },
          ]
        }
      ]
    },
    {
      id: 'p2',
      title: 'Phase 2: Feeding System',
      duration: 'Week 4',
      status: 'completed',
      steps: [
        {
          id: 's2',
          title: 'Inlet Assembly',
          icon: Hammer,
          description: 'Mixing tank and pipework.',
          tasks: [
            { id: 't2_1', text: 'Build brick mixing chamber', isCompleted: true },
            { id: 't2_2', text: 'Install inlet pipe (150mm PVC)', isCompleted: true },
          ]
        }
      ]
    },
    {
      id: 'p3',
      title: 'Phase 3: Gas Collection',
      duration: 'Weeks 5-6',
      status: 'active',
      steps: [
        {
          id: 's3',
          title: 'Dome & Piping',
          icon: Zap,
          description: 'Gas capture and transport.',
          tasks: [
            { id: 't3_1', text: 'Install flexible PVC gas dome', isCompleted: true },
            { id: 't3_2', text: 'Run gas line to generator/stove', isCompleted: true },
            { id: 't3_3', text: 'Install pressure release valve', isCompleted: false },
            { id: 't3_4', text: 'Connect H2S scrubber filter', isCompleted: false },
          ]
        }
      ]
    },
    {
      id: 'p4',
      title: 'Phase 4: Effluent',
      duration: 'Week 7',
      status: 'locked',
      steps: [
        {
          id: 's4',
          title: 'Biofertilizer Out',
          icon: Sprout,
          description: 'Nutrient recovery.',
          tasks: [
            { id: 't4_1', text: 'Construct overflow settling tank', isCompleted: false },
            { id: 't4_2', text: 'Pump connection to irrigation', isCompleted: false },
          ]
        }
      ]
    }
  ],
  // UNIT 3: SUGARCANE (40% Complete)
  't3_3': [
    {
      id: 'p1',
      title: 'Phase 1: Processing Shed',
      duration: 'Weeks 1-3',
      status: 'completed',
      steps: [
        {
          id: 's1',
          title: 'Structure Build',
          icon: Warehouse,
          description: '10x15m covered area.',
          tasks: [
            { id: 't1_1', text: 'Pour reinforced concrete floor', isCompleted: true },
            { id: 't1_2', text: 'Erect steel support pillars', isCompleted: true },
            { id: 't1_3', text: 'Install metal roofing', isCompleted: true },
          ]
        }
      ]
    },
    {
      id: 'p2',
      title: 'Phase 2: Milling Equip.',
      duration: 'Weeks 4-6',
      status: 'active',
      steps: [
        {
          id: 's2',
          title: 'Crusher Installation',
          icon: Factory,
          description: 'Heavy machinery setup.',
          tasks: [
            { id: 't2_1', text: 'Build vibration-dampening base', isCompleted: true },
            { id: 't2_2', text: 'Mount 3-roller sugarcane mill', isCompleted: false },
            { id: 't2_3', text: 'Connect 15HP electric motor', isCompleted: false },
          ]
        }
      ]
    },
    {
      id: 'p3',
      title: 'Phase 3: Juice Processing',
      duration: 'Weeks 7-10',
      status: 'locked',
      steps: [
        {
          id: 's3',
          title: 'Clarification',
          icon: Droplets,
          description: 'Settling tanks.',
          tasks: [{ id: 't3_1', text: 'Install 1000L settling tanks', isCompleted: false }]
        }
      ]
    },
    {
      id: 'p4',
      title: 'Phase 4: Bagasse Mgmt',
      duration: 'Week 11',
      status: 'locked',
      steps: [
        {
          id: 's4',
          title: 'Feed Integration',
          icon: Recycle,
          description: 'Transport to cattle.',
          tasks: [{ id: 't4_1', text: 'Setup chopper for bagasse', isCompleted: false }]
        }
      ]
    }
  ],
  // UNIT 4: SOLAR (100% Complete)
  't3_4': [
    {
      id: 'p1',
      title: 'Phase 1: Installation',
      duration: 'Completed',
      status: 'completed',
      steps: [
        {
          id: 's1',
          title: 'System Setup',
          icon: Sun,
          description: '15kW Array Installation.',
          tasks: [
            { id: 't1_1', text: 'Roof mounting rails', isCompleted: true },
            { id: 't1_2', text: '40x Panel wiring', isCompleted: true },
            { id: 't1_3', text: 'Inverter grid-tie connection', isCompleted: true },
          ]
        }
      ]
    },
    {
      id: 'p2',
      title: 'Phase 2: Maintenance',
      duration: 'Ongoing',
      status: 'active',
      steps: [
        {
          id: 's2',
          title: 'Optimization',
          icon: Activity,
          description: 'Routine checks.',
          tasks: [
            { id: 't2_1', text: 'Clean panels (Weekly)', isCompleted: false },
            { id: 't2_2', text: 'Check inverter logs', isCompleted: true },
          ]
        }
      ]
    }
  ],
  // UNIT 5: AQUACULTURE (20% Complete)
  't3_5': [
    {
      id: 'p1',
      title: 'Phase 1: Excavation',
      duration: 'Weeks 1-2',
      status: 'active',
      steps: [
        {
          id: 's1',
          title: 'Tank Earthworks',
          icon: Map,
          description: '8 Tanks preparation.',
          tasks: [
            { id: 't1_1', text: 'Mark layout for 8 tanks', isCompleted: true },
            { id: 't1_2', text: 'Excavate tank beds (1.5m depth)', isCompleted: false },
            { id: 't1_3', text: 'Compact soil base', isCompleted: false },
          ]
        }
      ]
    },
    {
      id: 'p2',
      title: 'Phase 2: Plumbing',
      duration: 'Weeks 3-4',
      status: 'locked',
      steps: [
        {
          id: 's2',
          title: 'Drainage Network',
          icon: Droplets,
          description: 'Central drainage.',
          tasks: [
            { id: 't2_1', text: 'Install bottom drains', isCompleted: false },
            { id: 't2_2', text: 'Connect to central sump', isCompleted: false },
          ]
        }
      ]
    }
  ],
  // UNIT 6: CROPS (10% Complete)
  't3_6': [
    {
      id: 'p1',
      title: 'Phase 1: Soil Prep',
      duration: 'Weeks 1-2',
      status: 'active',
      steps: [
        {
          id: 's1',
          title: 'Soil Analysis',
          icon: Sprout,
          description: 'Initial corrections.',
          tasks: [
            { id: 't1_1', text: 'Collect samples (10ha)', isCompleted: true },
            { id: 't1_2', text: 'Apply Lime (Calagem)', isCompleted: false },
            { id: 't1_3', text: 'Apply Organic Matter (Manure)', isCompleted: false },
          ]
        }
      ]
    },
    {
      id: 'p2',
      title: 'Phase 2: Planting',
      duration: 'Week 3',
      status: 'locked',
      steps: [
        {
          id: 's2',
          title: 'Seeding',
          icon: Sprout,
          description: 'Maize/Bean intercropping.',
          tasks: [
            { id: 't2_1', text: 'Sow Maize rows (80cm spacing)', isCompleted: false },
            { id: 't2_2', text: 'Sow Bean rows (inter-row)', isCompleted: false },
          ]
        }
      ]
    }
  ]
};

const TIER_2_ROADMAPS = TIER_3_ROADMAPS; // Reuse for simplicity in demo

const Planner: React.FC<PlannerProps> = ({ language, farmTier, initialUnitId }) => {
  // Navigation State
  const [viewMode, setViewMode] = useState<'roadmap' | 'budget' | 'financials' | 'calculator'>('roadmap');
  const [selectedUnitId, setSelectedUnitId] = useState<string | null>(initialUnitId || null);

  // Roadmap State
  const [phases, setPhases] = useState<Phase[]>(JATOBA_ROADMAP);
  const [activePhaseId, setActivePhaseId] = useState<string>('p1');
  const [expandedStepId, setExpandedStepId] = useState<string | null>(null);

  // Calculator State
  const [simInput, setSimInput] = useState<SimulationInput>({
    tier: 1,
    availableAreaHa: 5,
    systemProductivityY: 10000,
    inventory: [
      { speciesId: 'caprino', count: 40, selectedLabId: 'lab_c1', daysInSystem: 365 }
    ],
    ingredientCosts: {},
    productionParams: {
      'nelore': { dailyOutput: 1.1 }, // kg gain
      'holstein': { dailyOutput: 25 }, // liters
      'caprino': { dailyOutput: 2.5 } // liters
    }
  });
  const [simResult, setSimResult] = useState<SimulationResult | null>(null);

  const calculator = useMemo(() => new EcofarmCalculator(), []);

  // Initialize
  useEffect(() => {
    if (initialUnitId) {
      setSelectedUnitId(initialUnitId);
      setViewMode('roadmap');
    }
  }, [initialUnitId]);

  useEffect(() => {
    // Reset calculator inputs when tier changes
    const tierNum = farmTier === 'tier1' ? 1 : (farmTier === 'tier2' ? 2 : 3);
    setSimInput(prev => ({ 
      ...prev, 
      tier: tierNum,
      // If switching to Tier 1, restrict inventory to just Goats
      inventory: tierNum === 1 
        ? [{ speciesId: 'caprino', count: 40, selectedLabId: 'lab_c1', daysInSystem: 365 }]
        : prev.inventory
    }));

    // Update Roadmap Data
    if (farmTier === 'tier1') {
      setPhases(JATOBA_ROADMAP);
      setSelectedUnitId(null);
    } else {
      if (selectedUnitId) {
        const roadmapSet = farmTier === 'tier2' ? TIER_2_ROADMAPS : TIER_3_ROADMAPS;
        // Map Tier 2 IDs to Tier 3 IDs for data reuse
        const mappedId = selectedUnitId.startsWith('t2_') ? selectedUnitId.replace('t2_', 't3_') : selectedUnitId;
        
        if (roadmapSet[mappedId]) {
            setPhases(roadmapSet[mappedId]);
            // Set active phase to the first one that is active or last one completed
            const currentPhase = roadmapSet[mappedId].find(p => p.status === 'active') || roadmapSet[mappedId][0];
            setActivePhaseId(currentPhase.id);
        } else {
            // Fallback
            setPhases([{ id: 'p1', title: 'Phase 1: Planning', duration: 'Weeks 1-4', status: 'active', steps: [{ id: 's1', title: 'Initial Assessment', icon: Ruler, description: 'Feasibility study.', tasks: [{id: 't1', text: 'Analyze requirements', isCompleted: false}]}]}]);
        }
      }
    }
  }, [farmTier, selectedUnitId]);

  // Run calculation when input changes
  useEffect(() => {
    const res = calculator.process(simInput);
    setSimResult(res);
  }, [simInput, calculator]);

  // --- Handlers ---

  const toggleTask = (phaseId: string, stepId: string, taskId: string) => {
    setPhases(prev => prev.map(phase => {
      if (phase.id !== phaseId) return phase;
      return {
        ...phase,
        steps: phase.steps.map(step => {
          if (step.id !== stepId) return step;
          return {
            ...step,
            tasks: step.tasks.map(task => {
              if (task.id !== taskId) return task;
              return { ...task, isCompleted: !task.isCompleted };
            })
          };
        })
      };
    }));
  };

  const toggleStep = (stepId: string) => {
    setExpandedStepId(prev => prev === stepId ? null : stepId);
  };

  const calculatePhaseProgress = (phase: Phase) => {
    let totalTasks = 0;
    let completedTasks = 0;
    phase.steps.forEach(step => {
      totalTasks += step.tasks.length;
      completedTasks += step.tasks.filter(t => t.isCompleted).length;
    });
    if (totalTasks === 0) return 0;
    return Math.round((completedTasks / totalTasks) * 100);
  };

  const calculateProgress = (step: Step) => {
    if (step.tasks.length === 0) return 0;
    const completed = step.tasks.filter(t => t.isCompleted).length;
    return Math.round((completed / step.tasks.length) * 100);
  };

  const activePhase = phases.find(p => p.id === activePhaseId) || phases[0];

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'active': return 'bg-green-500';
      case 'planning': return 'bg-yellow-500';
      case 'maintenance': return 'bg-red-500';
      case 'live': return 'bg-blue-500';
      default: return 'bg-gray-400';
    }
  };

  // --- RENDERERS ---

  const renderTier3UnitList = () => {
    const units: SystemComponent[] = farmTier === 'tier2' ? TIER_2_COMPONENTS : TIER_3_COMPONENTS;
    const totalProgress = units.reduce((acc, unit) => acc + (unit.cycleProgress || 0), 0);
    const avgProgress = Math.round(totalProgress / units.length);

    return (
      <div className="space-y-6 animate-fade-in">
        {/* Global Implementation Status Card */}
        <div className="bg-gradient-to-br from-indigo-900 to-slate-800 rounded-xl p-6 text-white shadow-lg relative overflow-hidden">
          <div className="absolute top-0 right-0 w-32 h-32 bg-white/10 rounded-full -mr-10 -mt-10 blur-xl"></div>
          <div className="relative z-10">
            <div className="flex justify-between items-start mb-4">
              <div>
                <h3 className="text-sm font-bold text-indigo-200 uppercase tracking-wider mb-1">Global System Status</h3>
                <div className="flex items-baseline gap-2">
                  <span className="text-3xl font-bold">{avgProgress}%</span>
                  <span className="text-sm text-indigo-300">Complete</span>
                </div>
              </div>
              <div className="p-2 bg-white/10 rounded-lg"><LayoutGrid className="text-indigo-200" size={24} /></div>
            </div>
            <div className="w-full bg-white/20 h-3 rounded-full overflow-hidden mb-2">
               <div className="bg-indigo-400 h-full rounded-full" style={{ width: `${avgProgress}%` }}></div>
            </div>
            <div className="flex justify-between text-xs text-indigo-300">
               <span>Foundation</span>
               <span className="text-white font-bold">Integration</span>
               <span>Optimization</span>
            </div>
          </div>
        </div>

        {/* Units Grid/List */}
        <div className="space-y-4">
          <h3 className="font-bold text-gray-700 flex items-center gap-2"><LayoutGrid size={18} /> Production Units</h3>
          {units.map((unit) => {
            const Icon = getUnitIcon(unit.category);
            const colorClass = getUnitColor(unit.category);
            return (
              <button key={unit.id} onClick={() => setSelectedUnitId(unit.id)} className="w-full bg-white rounded-xl shadow-sm border border-gray-100 p-4 relative overflow-hidden group hover:shadow-md transition-all text-left">
                <div className={`absolute left-0 top-0 bottom-0 w-1.5 ${getStatusColor(unit.status)}`}></div>
                <div className="flex justify-between items-start mb-2">
                  <div className={`p-2 rounded-lg ${colorClass}`}><Icon size={20} /></div>
                  <div className="text-right">
                    <span className="text-[10px] text-gray-400 block">{unit.lastChecked}</span>
                    <span className={`text-[10px] font-bold ${unit.status === 'live' ? 'text-blue-600 bg-blue-50' : 'text-gray-500'} px-1.5 py-0.5 rounded uppercase`}>{unit.status}</span>
                  </div>
                </div>
                <h3 className="font-bold text-gray-800 text-base mb-1">{unit.name}</h3>
                <div className="flex items-center gap-4 mt-3">
                  <div className="flex-1">
                    <div className="flex justify-between text-xs mb-1">
                      <span className="text-gray-500">Implementation</span>
                      <span className="font-bold text-gray-700">{unit.cycleProgress}%</span>
                    </div>
                    <div className="w-full bg-gray-100 h-1.5 rounded-full overflow-hidden">
                      <div className={`h-full rounded-full ${getStatusColor(unit.status)}`} style={{ width: `${unit.cycleProgress}%` }}></div>
                    </div>
                  </div>
                </div>
                <div className="absolute right-4 bottom-4 opacity-0 group-hover:opacity-100 transition-opacity"><ArrowRight size={16} className="text-gray-400" /></div>
              </button>
            );
          })}
        </div>
      </div>
    );
  };

  const renderBudget = () => {
    const totalCost = JATOBA_BUDGET.reduce((acc, item) => acc + item.total, 0);
    const categories = Array.from(new Set(JATOBA_BUDGET.map(b => b.category)));

    return (
      <div className="space-y-6 animate-fade-in pb-20">
        <div className="bg-white p-6 rounded-xl shadow-lg border border-gray-100">
           <div className="flex justify-between items-start mb-6">
              <div>
                 <h2 className="text-xl font-bold text-gray-800">Project Budget</h2>
                 <p className="text-sm text-gray-500">Dec 2025 Estimates (Jatobá, PE)</p>
              </div>
              <div className="text-right">
                 <p className="text-xs font-bold text-gray-400 uppercase">Total Estimate</p>
                 <p className="text-2xl font-bold text-embrapa-green">R$ {totalCost.toLocaleString()}</p>
              </div>
           </div>

           <div className="space-y-6">
              {categories.map(cat => (
                <div key={cat}>
                   <h3 className="text-xs font-bold text-gray-500 uppercase mb-2 border-b border-gray-100 pb-1">{cat}</h3>
                   <div className="space-y-2">
                      {JATOBA_BUDGET.filter(b => b.category === cat).map((item, idx) => (
                         <div key={idx} className="flex justify-between items-center text-sm">
                            <div className="flex-1">
                               <p className="font-bold text-gray-700">{item.item}</p>
                               <p className="text-xs text-gray-400">{item.qty}x @ R${item.unitCost} {item.note && `• ${item.note}`}</p>
                            </div>
                            <span className="font-mono text-gray-600">R$ {item.total}</span>
                         </div>
                      ))}
                   </div>
                </div>
              ))}
           </div>
           
           <div className="mt-6 pt-4 border-t border-dashed border-gray-200 text-xs text-gray-400 text-center">
              Prices based on local suppliers (Mercado de Construção Jatobá) and online averages.
           </div>
        </div>
      </div>
    );
  };

  const renderFinancials = () => {
    // Basic Financial Assumptions
    const monthlyOpEx = 98;
    const monthlyRevenue = 250;
    const monthlyProfit = monthlyRevenue - monthlyOpEx;
    const startupCost = 2230;
    const paybackMonths = Math.ceil(startupCost / monthlyProfit);

    return (
      <div className="space-y-6 animate-fade-in pb-20">
        <div className="grid grid-cols-2 gap-4">
           <div className="bg-white p-4 rounded-xl shadow-sm border border-gray-100">
              <div className="flex items-center gap-2 mb-2 text-red-500">
                 <Wallet size={18} />
                 <span className="font-bold text-xs uppercase">Monthly Cost</span>
              </div>
              <p className="text-2xl font-bold text-gray-800">R$ {monthlyOpEx}</p>
              <p className="text-xs text-gray-400 mt-1">Energy, Feed, Maint.</p>
           </div>
           <div className="bg-white p-4 rounded-xl shadow-sm border border-gray-100">
              <div className="flex items-center gap-2 mb-2 text-green-500">
                 <TrendingUp size={18} />
                 <span className="font-bold text-xs uppercase">Est. Revenue</span>
              </div>
              <p className="text-2xl font-bold text-gray-800">R$ {monthlyRevenue}</p>
              <p className="text-xs text-gray-400 mt-1">Fish, Veg, Eggs</p>
           </div>
        </div>

        <div className="bg-gradient-to-br from-slate-800 to-slate-900 rounded-xl p-6 text-white shadow-lg">
           <div className="flex justify-between items-start mb-4">
              <div>
                 <h3 className="text-sm font-bold text-slate-300 uppercase tracking-wider">ROI Projection</h3>
                 <p className="text-3xl font-bold mt-1 text-emerald-400">~{paybackMonths} Months</p>
                 <p className="text-xs text-slate-400">Estimated Payback Period</p>
              </div>
              <div className="p-2 bg-white/10 rounded-lg"><PieChart className="text-emerald-400" size={24} /></div>
           </div>
           
           <div className="w-full bg-slate-700 h-2 rounded-full mb-4 overflow-hidden">
              <div className="bg-emerald-500 h-full w-1/4"></div>
           </div>

           <div className="space-y-2 text-sm">
              <div className="flex justify-between border-b border-white/10 pb-1">
                 <span className="text-slate-300">Tilapia Sales (Harvest)</span>
                 <span className="font-mono">R$ 300 / 6mo</span>
              </div>
              <div className="flex justify-between border-b border-white/10 pb-1">
                 <span className="text-slate-300">Vegetables (Monthly)</span>
                 <span className="font-mono">R$ 80 / mo</span>
              </div>
              <div className="flex justify-between border-b border-white/10 pb-1">
                 <span className="text-slate-300">Eggs (Monthly)</span>
                 <span className="font-mono">R$ 120 / mo</span>
              </div>
           </div>
        </div>
        
        <div className="bg-blue-50 border border-blue-100 p-4 rounded-xl">
           <h4 className="font-bold text-blue-800 text-sm mb-2 flex items-center gap-2">
              <Activity size={16} /> Economic Viability
           </h4>
           <p className="text-sm text-blue-700 leading-relaxed">
              This basic system generates ~R$ 150 net profit monthly, primarily contributing to 
              <strong> household food security</strong> (saving grocery costs) rather than large commercial profit.
              Payback is accelerated if labor is DIY.
           </p>
        </div>
      </div>
    );
  };

  const renderCalculator = () => {
    if (!simResult) return null;

    return (
      <div className="space-y-6 animate-fade-in pb-20">
        <div className="bg-indigo-50 border border-indigo-100 p-4 rounded-xl">
           <h3 className="text-indigo-900 font-bold mb-1">EcoFarm {farmTier === 'tier1' ? 'Goat' : (farmTier === 'tier2' ? 'Mix' : 'Pro')} Calculator</h3>
           <p className="text-indigo-700 text-xs">{farmTier === 'tier1' ? 'Simple DMI & Area calculation.' : 'Capacity planning & Diet optimization.'}</p>
        </div>

        {/* Global Settings */}
        <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-4">
           <h4 className="font-bold text-gray-800 mb-3 text-sm uppercase flex items-center gap-2">
              <Ruler size={16} /> Farm Parameters
           </h4>
           <div className="grid grid-cols-2 gap-4">
             <div>
                <label className="text-xs text-gray-500 font-bold">Total Area (ha)</label>
                <input 
                  type="number" 
                  className="w-full p-2 bg-gray-50 rounded border border-gray-200 mt-1 font-mono font-bold"
                  value={simInput.availableAreaHa}
                  onChange={(e) => setSimInput({...simInput, availableAreaHa: parseFloat(e.target.value) || 0})}
                />
             </div>
             <div>
                <label className="text-xs text-gray-500 font-bold">Productivity (kg MS/ha)</label>
                <input 
                  type="number" 
                  className="w-full p-2 bg-gray-50 rounded border border-gray-200 mt-1 font-mono font-bold"
                  value={simInput.systemProductivityY}
                  onChange={(e) => setSimInput({...simInput, systemProductivityY: parseFloat(e.target.value) || 0})}
                />
             </div>
           </div>
        </div>

        {/* Inventory Management */}
        <div className="space-y-3">
           <div className="flex justify-between items-center">
              <h4 className="font-bold text-gray-800 text-sm uppercase flex items-center gap-2"><Beef size={16} /> Animal Inventory</h4>
              {simInput.tier > 1 && (
                 <button 
                  onClick={() => {
                     // Add default Nelore if not present, else Holstein
                     const speciesId = simInput.inventory.find(i => i.speciesId === 'nelore') ? 'holstein' : 'nelore';
                     const labId = speciesId === 'nelore' ? 'lab_n1' : 'lab_h1';
                     setSimInput({...simInput, inventory: [...simInput.inventory, { speciesId, count: 10, selectedLabId: labId }]})
                  }}
                  className="text-xs bg-indigo-100 text-indigo-700 px-2 py-1 rounded font-bold flex items-center gap-1"
                 >
                    <Plus size={14} /> Add Group
                 </button>
              )}
           </div>
           
           {simInput.inventory.map((group, idx) => {
              const speciesRef = REFERENCE_DATA.species.find(s => s.id === group.speciesId);
              if(!speciesRef) return null;
              
              return (
                 <div key={idx} className="bg-white rounded-xl shadow-sm border border-gray-100 p-4 relative">
                    <div className="flex justify-between mb-3">
                       <span className="font-bold text-indigo-900">{speciesRef.name}</span>
                       {simInput.tier > 1 && (
                         <button 
                           onClick={() => setSimInput({...simInput, inventory: simInput.inventory.filter((_, i) => i !== idx)})}
                           className="text-red-400 hover:text-red-600"
                         >
                            <Trash2 size={16} />
                         </button>
                       )}
                    </div>
                    
                    <div className="grid grid-cols-2 gap-3 mb-3">
                       <div>
                          <label className="text-[10px] text-gray-400 uppercase font-bold">Heads</label>
                          <input 
                             type="number" 
                             className="w-full p-2 bg-gray-50 rounded border border-gray-200 font-bold"
                             value={group.count}
                             onChange={(e) => {
                                const newInv = [...simInput.inventory];
                                newInv[idx].count = parseInt(e.target.value) || 0;
                                setSimInput({...simInput, inventory: newInv});
                             }}
                          />
                       </div>
                       <div>
                          <label className="text-[10px] text-gray-400 uppercase font-bold">Diet (Lab)</label>
                          <select 
                             className="w-full p-2 bg-gray-50 rounded border border-gray-200 text-sm"
                             value={group.selectedLabId}
                             onChange={(e) => {
                                const newInv = [...simInput.inventory];
                                newInv[idx].selectedLabId = e.target.value;
                                setSimInput({...simInput, inventory: newInv});
                             }}
                          >
                             {speciesRef.labs.map(l => <option key={l.id} value={l.id}>{l.name}</option>)}
                          </select>
                       </div>
                    </div>

                    {/* Results Preview for this Group */}
                    {simResult.resultsBySpecies[idx] && (
                       <div className="bg-gray-50 p-2 rounded text-xs flex justify-between text-gray-600">
                          <span>Req: <strong>{simResult.resultsBySpecies[idx].totalAreaRequiredHa} ha</strong></span>
                          <span>DMI: <strong>{simResult.resultsBySpecies[idx].dmiPerAnimal} kg</strong></span>
                       </div>
                    )}
                 </div>
              )
           })}
        </div>

        {/* Global Results */}
        <div className="bg-white rounded-xl shadow-lg border border-gray-100 overflow-hidden">
           <div className={`p-4 text-white ${simResult.farmTotals.status === 'OK' ? 'bg-green-600' : 'bg-red-500'}`}>
              <div className="flex justify-between items-center mb-1">
                 <h4 className="font-bold uppercase tracking-wider text-sm flex items-center gap-2">
                    <Activity size={18} /> Analysis
                 </h4>
                 <span className="bg-white/20 px-2 py-0.5 rounded text-xs font-bold">{simResult.farmTotals.status}</span>
              </div>
              <div className="flex items-end gap-2">
                 <span className="text-3xl font-bold">{simResult.farmTotals.totalAreaUsedHa} ha</span>
                 <span className="text-white/80 mb-1 text-sm">used of {simResult.farmTotals.availableAreaHa} ha</span>
              </div>
              <div className="w-full bg-black/20 h-2 rounded-full mt-3 overflow-hidden">
                 <div className="bg-white h-full" style={{ width: `${Math.min(100, simResult.farmTotals.utilizationPct)}%` }}></div>
              </div>
           </div>

           {/* Capacity Analysis */}
           {simInput.tier > 1 && (
             <div className="p-4 bg-gray-50 border-b border-gray-100">
                <h5 className="text-xs font-bold text-gray-500 uppercase mb-2">Capacity Insight</h5>
                <p className="text-sm text-gray-700">
                   You have <strong>{simResult.farmTotals.remainingAreaHa} ha</strong> remaining. 
                   You could add:
                </p>
                <div className="flex gap-2 mt-2 flex-wrap">
                   {simResult.capacityAnalysis.map(cap => (
                      <span key={cap.speciesId} className="bg-white border border-gray-200 px-2 py-1 rounded text-xs text-gray-600">
                         + <strong>{cap.potentialAdditionalAnimals}</strong> {cap.speciesId}
                      </span>
                   ))}
                </div>
             </div>
           )}

           {/* Shopping List */}
           <div className="p-4">
              <h5 className="text-xs font-bold text-gray-500 uppercase mb-3">Feed Requirements (Total Cycle)</h5>
              <div className="space-y-2">
                 {(() => {
                    // Aggregate ingredients
                    const totals: Record<string, number> = {};
                    simResult.resultsBySpecies.forEach(r => {
                       Object.entries(r.feedSuggestions).forEach(([ing, qty]) => {
                          totals[ing] = (totals[ing] || 0) + qty;
                       });
                    });
                    return Object.entries(totals).map(([ing, qty]) => (
                       <div key={ing} className="flex justify-between text-sm border-b border-dashed border-gray-100 last:border-0 pb-1 last:pb-0">
                          <span className="text-gray-600">{ing}</span>
                          <span className="font-bold text-gray-800">{Math.round(qty).toLocaleString()} kg</span>
                       </div>
                    ));
                 })()}
              </div>
           </div>
        </div>
      </div>
    );
  };

  return (
    <div className="flex flex-col h-full bg-gray-50 pb-20">
      <div className="bg-white p-6 shadow-sm border-b border-gray-100 z-10 sticky top-0">
        <div className="flex justify-between items-start mb-4">
          <div className="flex items-center gap-2">
             {selectedUnitId && (
               <button onClick={() => setSelectedUnitId(null)} className="mr-1 -ml-2 p-1 rounded-full hover:bg-gray-100 transition-colors">
                 <ArrowLeft size={20} className="text-gray-600" />
               </button>
             )}
             <div>
               <h2 className="text-2xl font-bold text-gray-800">
                 {viewMode === 'calculator' ? 'System Simulator' : (
                   selectedUnitId 
                     ? (farmTier === 'tier2' ? TIER_2_COMPONENTS : TIER_3_COMPONENTS).find(u => u.id === selectedUnitId)?.name 
                     : ((farmTier === 'tier3' || farmTier === 'tier2') ? 'Global Planner' : 'System Planner')
                 )}
               </h2>
               <p className="text-gray-500 text-sm">
                 {viewMode === 'calculator' 
                   ? 'Simulate Area & Feed Requirements' 
                   : (selectedUnitId ? 'Implementation Roadmap' : 'Overview & Implementation')}
               </p>
             </div>
          </div>
          
          <div className="flex bg-gray-100 p-1 rounded-lg">
             <button 
               onClick={() => setViewMode('roadmap')}
               className={`px-3 py-1.5 rounded-md text-xs font-bold flex items-center gap-1 transition-all ${viewMode === 'roadmap' ? 'bg-white shadow text-embrapa-green' : 'text-gray-500'}`}
             >
               <Map size={14} /> Plan
             </button>
             {farmTier === 'tier1' && (
               <>
                 <button 
                   onClick={() => setViewMode('budget')}
                   className={`px-3 py-1.5 rounded-md text-xs font-bold flex items-center gap-1 transition-all ${viewMode === 'budget' ? 'bg-white shadow text-embrapa-green' : 'text-gray-500'}`}
                 >
                   <ShoppingCart size={14} /> BOM
                 </button>
                 <button 
                   onClick={() => setViewMode('financials')}
                   className={`px-3 py-1.5 rounded-md text-xs font-bold flex items-center gap-1 transition-all ${viewMode === 'financials' ? 'bg-white shadow text-embrapa-green' : 'text-gray-500'}`}
                 >
                   <DollarSign size={14} /> $$$
                 </button>
               </>
             )}
             <button 
               onClick={() => setViewMode('calculator')}
               className={`px-3 py-1.5 rounded-md text-xs font-bold flex items-center gap-1 transition-all ${viewMode === 'calculator' ? 'bg-white shadow text-embrapa-green' : 'text-gray-500'}`}
             >
               <Calculator size={14} /> Calc
             </button>
          </div>
        </div>
        
        {/* Phase Selector Tabs (Roadmap Mode) */}
        {(farmTier === 'tier1' || selectedUnitId) && viewMode === 'roadmap' && (
          <div className="flex gap-2 mt-2 overflow-x-auto no-scrollbar pb-1">
            {phases.map(phase => (
              <button
                key={phase.id}
                onClick={() => setActivePhaseId(phase.id)}
                className={`flex-shrink-0 px-4 py-2 rounded-full text-xs font-bold whitespace-nowrap transition-colors ${
                  activePhaseId === phase.id
                    ? 'bg-embrapa-green text-white shadow-md'
                    : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
                }`}
              >
                {phase.title.split(':')[0]}
              </button>
            ))}
          </div>
        )}
      </div>

      <div className="p-4 space-y-4 overflow-y-auto">
        {viewMode === 'calculator' && renderCalculator()}
        {viewMode === 'budget' && renderBudget()}
        {viewMode === 'financials' && renderFinancials()}
        {viewMode === 'roadmap' && (
           (farmTier === 'tier3' || farmTier === 'tier2') && !selectedUnitId ? (
              renderTier3UnitList()
            ) : (
              <>
                {/* Active Phase Summary */}
                <div className="bg-embrapa-accent/10 p-5 rounded-xl border border-embrapa-accent/30 animate-fade-in">
                  <div className="flex justify-between items-start mb-4">
                    <div>
                      <h3 className="font-bold text-embrapa-soil text-lg">{activePhase.title}</h3>
                      <p className="text-xs text-gray-600 font-medium bg-white/50 px-2 py-1 rounded inline-block mt-1">
                        Duration: {activePhase.duration}
                      </p>
                    </div>
                    {activePhase.status === 'locked' ? (
                        <Lock className="text-gray-400" />
                    ) : (
                        <div className="text-right">
                          <span className="text-2xl font-bold text-embrapa-soil">{calculatePhaseProgress(activePhase)}%</span>
                          <p className="text-[10px] text-gray-500 uppercase tracking-wide">Complete</p>
                        </div>
                    )}
                  </div>
                  
                  <div className="w-full bg-white h-2 rounded-full overflow-hidden">
                    <div 
                      className="bg-embrapa-soil h-full transition-all duration-500" 
                      style={{ width: `${calculatePhaseProgress(activePhase)}%` }}
                    ></div>
                  </div>
                </div>

                {/* Steps List */}
                <div className="space-y-3">
                  {activePhase.steps.map((step) => {
                    const progress = calculateProgress(step);
                    const isExpanded = expandedStepId === step.id;
                    const Icon = step.icon;

                    return (
                      <div 
                        key={step.id} 
                        className={`bg-white rounded-xl border transition-all duration-300 overflow-hidden ${
                          isExpanded ? 'shadow-md border-embrapa-green/30' : 'shadow-sm border-gray-100'
                        }`}
                      >
                        <button 
                          onClick={() => toggleStep(step.id)}
                          className="w-full p-4 flex items-center gap-4 text-left"
                        >
                          <div className={`p-3 rounded-full shrink-0 transition-colors ${
                            progress === 100 ? 'bg-green-100 text-green-600' : 'bg-gray-100 text-gray-500'
                          }`}>
                            {progress === 100 ? <CheckCircle2 size={24} /> : <Icon size={24} />}
                          </div>
                          
                          <div className="flex-1">
                            <div className="flex justify-between items-center mb-1">
                              <h4 className={`font-bold ${isExpanded ? 'text-embrapa-green' : 'text-gray-800'}`}>
                                {step.title}
                              </h4>
                              <span className="text-xs font-bold text-gray-400">{progress}%</span>
                            </div>
                            <p className="text-xs text-gray-500 line-clamp-1">{step.description}</p>
                            {!isExpanded && (
                              <div className="w-full bg-gray-100 h-1 mt-2 rounded-full overflow-hidden">
                                <div className="bg-embrapa-green h-full" style={{ width: `${progress}%` }}></div>
                              </div>
                            )}
                          </div>
                          
                          {isExpanded ? <ChevronUp className="text-gray-300" /> : <ChevronDown className="text-gray-300" />}
                        </button>

                        {isExpanded && (
                          <div className="bg-gray-50 px-4 pb-4 pt-1 animate-fade-in border-t border-gray-100">
                            <div className="space-y-2 mt-2">
                              {step.tasks.map(task => (
                                <div 
                                  key={task.id} 
                                  className="flex items-start gap-3 p-2 rounded hover:bg-white transition-colors cursor-pointer"
                                  onClick={() => toggleTask(activePhase.id, step.id, task.id)}
                                >
                                  <div className={`mt-0.5 transition-colors ${task.isCompleted ? 'text-embrapa-green' : 'text-gray-300'}`}>
                                    {task.isCompleted ? <CheckCircle2 size={20} /> : <Circle size={20} />}
                                  </div>
                                  <span className={`text-sm leading-snug select-none ${task.isCompleted ? 'text-gray-400 line-through' : 'text-gray-700'}`}>
                                    {task.text}
                                  </span>
                                </div>
                              ))}
                            </div>
                          </div>
                        )}
                      </div>
                    );
                  })}
                </div>
              </>
            )
        )}
      </div>
    </div>
  );
};

export default Planner;
