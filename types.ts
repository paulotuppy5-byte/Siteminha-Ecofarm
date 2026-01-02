
export type Language = 'pt' | 'en';
export type FarmTier = 'tier1' | 'tier2' | 'tier3';
export type ViewState = 'dashboard' | 'camera' | 'planner' | 'education' | 'settings' | 'agent';

export interface UserProfile {
  id: string;
  name: string;
  email: string;
  avatar?: string;
  isAuthenticated: boolean;
  isSetupComplete: boolean;
}

export interface FarmProfile {
  scale: FarmTier;
  state: string;
  city: string;
  region: 'North' | 'Northeast' | 'Central-West' | 'Southeast' | 'South' | '';
  climate: 'Tropical' | 'Subtropical' | 'Temperate' | 'Semi-Arid' | '';
  elevation?: string;
  waterSources: string[];
  selectedUnits: string[]; // IDs of enabled production units
}

export interface AppPreferences {
  language: Language;
  measurementSystem: 'metric' | 'imperial';
  notifications: {
    dailyReminder: boolean;
    productionAlerts: boolean;
    harvestNotifications: boolean;
  };
}

export interface PlantAnalysisResult {
  plantName: string;
  healthStatus: 'Healthy' | 'Disease Detected' | 'Nutrient Deficiency' | 'Unknown';
  confidence: number;
  diagnosis: string;
  recommendations: string[];
  harvestReady: boolean;
}

export interface SoilAnalysisResult {
  type: string;
  characteristics: string;
  management: string[];
  suitableCrops: string[];
}

export interface SalesChannel {
  channel: string;
  price: string;
  recommended?: boolean;
}

export interface SystemComponent {
  id: string;
  name: string;
  category: 'water' | 'animal' | 'plant' | 'waste' | 'energy' | 'processing';
  status: 'active' | 'planning' | 'maintenance' | 'warning' | 'live';
  lastChecked: string;
  specs: string[];
  production: string;
  cycleProgress: number; // 0-100
  cycleLabel: string;
  revenueEstimate: string;
  salesOpportunities: SalesChannel[];
  efficiency?: number; // For circular metrics
}

export type ResourceType = 'video' | 'article' | 'guide';

export interface EducationResource {
  title: string;
  type: ResourceType;
  url: string;
  duration?: string; // For videos
  source?: string;
}

export interface EducationModule {
  id: string;
  title: string;
  description: string;
  icon: any; // React.ElementType
  resources: EducationResource[];
}

export interface Translation {
  dashboard: string;
  camera: string;
  planner: string;
  education: string;
  settings: string;
  agent: string;
  welcome: string;
  mySystem: string;
  scanPlant: string;
  analyzing: string;
  uploadTip: string;
  health: string;
  recommendations: string;
  waterLevel: string;
  fishTank: string;
  chickens: string;
  compost: string;
  vegetables: string;
  selectLanguage: string;
  preferences: string;
  aboutApp: string;
  version: string;
  poweredBy: string;
  designedFor: string;
  rightsReserved: string;
  farmScale: string;
  tier1Name: string;
  tier1Desc: string;
  tier2Name: string;
  tier2Desc: string;
  tier3Name: string;
  tier3Desc: string;
  circularEconomy: string;
  energyIndep: string;
  wasteRecycled: string;
  financialOverview: string;
  netProfit: string;
  roi: string;
  analysisMode: string;
  plantHealth: string;
  soilType: string;
  soilTestIntro: string;
  startTest: string;
  testStep1: string;
  testStep2: string;
  testStep3: string;
  soilResult: string;
  // Login & Setup
  loginTitle: string;
  loginSubtitle: string;
  signInGoogle: string;
  signInEmail: string;
  createAccount: string;
  forgotPassword: string;
  setupWelcome: string;
  setupStep1: string;
  setupStep2: string;
  setupStep3: string;
  setupStep4: string;
  next: string;
  back: string;
  finish: string;
  selectUnits: string;
  // Calculator
  calculator: string;
  calcIntro: string;
  totalArea: string;
  productivity: string;
  animals: string;
  simulationResults: string;
  areaUsage: string;
  feedRequired: string;
  financials: string;
}

// --- Calculator / Simulation Types ---

export interface Ingredient {
  id: string;
  name: string;
  defaultCost: number;
  dryMatterPct: number;
}

export interface LabComponent {
  ingredientId: string;
  amountKgMS: number; // kg MS per day
}

export interface Lab {
  id: string;
  name: string;
  composition: LabComponent[];
}

export interface Species {
  id: string;
  name: string;
  standardWeight: number;
  standardDays: number;
  labs: Lab[];
}

export interface SimulationGroupInput {
  speciesId: string;
  count: number;
  daysInSystem?: number;
  selectedLabId: string;
}

export interface SimulationInput {
  tier: number; // 1, 2, or 3
  availableAreaHa: number;
  systemProductivityY: number; // kg MS/ha/year
  inventory: SimulationGroupInput[];
  // Tier 3 specific
  ingredientCosts?: Record<string, number>; 
  productionParams?: Record<string, { dailyOutput: number }>; // e.g., liters/day or kg/gain/day
}

export interface SpeciesResult {
  speciesId: string;
  speciesName: string;
  dmiPerAnimal: number;
  totalMsPerAnimal: number;
  areaHaPerAnimal: number;
  totalAreaRequiredHa: number;
  totalMsRequiredKg: number;
  feedSuggestions: Record<string, number>; // Ingredient Name -> Total Kg MS needed
  // Tier 3
  financials?: {
    feedCostTotal: number;
    productionTotal: number;
    costPerUnit: number;
  };
}

export interface SimulationResult {
  tier: number;
  resultsBySpecies: SpeciesResult[];
  farmTotals: {
    totalAreaUsedHa: number;
    availableAreaHa: number;
    utilizationPct: number;
    status: 'OK' | 'OVERLOAD';
    remainingAreaHa: number;
  };
  capacityAnalysis: {
    speciesId: string;
    potentialAdditionalAnimals: number;
  }[];
}

// --- Chat Types ---

export interface ChatMessage {
  id: string;
  role: 'user' | 'model';
  content: string;
  timestamp: Date;
  isThinking?: boolean;
}
