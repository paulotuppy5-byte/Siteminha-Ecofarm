
import { SystemComponent, Translation, Language, EducationModule, FarmTier, Ingredient, Species } from './types';
import { Leaf, Droplets, Fish, Layers, Sprout, ClipboardCheck, Recycle, Zap, Factory, Beef, Sun, Wheat, Tractor, LayoutGrid, Calculator } from 'lucide-react';

export const TRANSLATIONS: Record<Language, Translation> = {
  en: {
    dashboard: 'Home',
    camera: 'Scan',
    planner: 'Plan',
    education: 'Learn',
    settings: 'Settings',
    agent: 'Advisor',
    welcome: 'Farm Overview',
    mySystem: 'Production Units',
    scanPlant: 'Identify & Diagnose',
    analyzing: 'Analyzing with AI...',
    uploadTip: 'Take a photo of a leaf or plant',
    health: 'Health Status',
    recommendations: 'Recommendations',
    waterLevel: 'Water Quality',
    fishTank: 'Fish Tank',
    chickens: 'Poultry',
    compost: 'Compost',
    vegetables: 'Garden',
    selectLanguage: 'Language / Idioma',
    preferences: 'Preferences & About',
    aboutApp: 'About App',
    version: 'Version',
    poweredBy: 'Powered By',
    designedFor: 'Designed For',
    rightsReserved: 'All rights reserved',
    farmScale: 'Farm Scale',
    tier1Name: 'Tier 1: Family (Sisteminha)',
    tier1Desc: '100-1000m² • Food Security',
    tier2Name: 'Tier 2: Small Commercial',
    tier2Desc: '1-5 hectares • Market Focus',
    tier3Name: 'Tier 3: Circular Farm',
    tier3Desc: '5-20 hectares • Industrial Ecology',
    circularEconomy: 'Circular Economy Flow',
    energyIndep: 'Energy Independence',
    wasteRecycled: 'Waste Recycled',
    financialOverview: 'Financial Dashboard',
    netProfit: 'Net Profit (YTD)',
    roi: 'Current ROI',
    analysisMode: 'Analysis Mode',
    plantHealth: 'Plant Health',
    soilType: 'Soil Type',
    soilTestIntro: 'Estimate your soil type using simple visual and tactile tests. No lab required.',
    startTest: 'Start Soil Test',
    testStep1: 'The Ball Test',
    testStep2: 'The Ribbon Test',
    testStep3: 'The Texture Test',
    soilResult: 'Soil Estimation',
    loginTitle: 'Sisteminha EcoFarm',
    loginSubtitle: 'Agricultural Intelligence for Everyone',
    signInGoogle: 'Sign in with Google',
    signInEmail: 'Sign in with Email',
    createAccount: 'Create Account',
    forgotPassword: 'Forgot Password?',
    setupWelcome: 'Lets set up your farm',
    setupStep1: 'Farm Scale',
    setupStep2: 'Location',
    setupStep3: 'Preferences',
    setupStep4: 'Production Units',
    next: 'Next',
    back: 'Back',
    finish: 'Finish Setup',
    selectUnits: 'Select active units',
    calculator: 'Simulator',
    calcIntro: 'Plan your animal stocking rate based on area and diet.',
    totalArea: 'Total Area (ha)',
    productivity: 'Productivity (kg MS/ha/yr)',
    animals: 'Animals',
    simulationResults: 'Simulation Results',
    areaUsage: 'Area Usage',
    feedRequired: 'Feed Required (Cycle)',
    financials: 'Financial Projections'
  },
  pt: {
    dashboard: 'Início',
    camera: 'Scan',
    planner: 'Planejar',
    education: 'Aprender',
    settings: 'Ajustes',
    agent: 'Consultor',
    welcome: 'Visão Geral',
    mySystem: 'Unidades de Produção',
    scanPlant: 'Identificar e Diagnosticar',
    analyzing: 'Analisando com IA...',
    uploadTip: 'Tire uma foto de uma folha ou planta',
    health: 'Estado de Saúde',
    recommendations: 'Recomendações',
    waterLevel: 'Qualidade da Água',
    fishTank: 'Tanque de Peixes',
    chickens: 'Galinheiro',
    compost: 'Compostagem',
    vegetables: 'Horta',
    selectLanguage: 'Idioma / Language',
    preferences: 'Preferências',
    aboutApp: 'Sobre o App',
    version: 'Versão',
    poweredBy: 'Tecnologia',
    designedFor: 'Projetado para',
    rightsReserved: 'Todos os direitos reservados',
    farmScale: 'Escala da Fazenda',
    tier1Name: 'Nível 1: Família (Sisteminha)',
    tier1Desc: '100-1000m² • Segurança Alimentar',
    tier2Name: 'Nível 2: Comercial Peq.',
    tier2Desc: '1-5 hectares • Foco Mercado',
    tier3Name: 'Nível 3: Fazenda Circular',
    tier3Desc: '5-20 hectares • Ecologia Industrial',
    circularEconomy: 'Fluxo de Economia Circular',
    energyIndep: 'Indep. Energética',
    wasteRecycled: 'Resíduos Reciclados',
    financialOverview: 'Painel Financeiro',
    netProfit: 'Lucro Líquido',
    roi: 'ROI Atual',
    analysisMode: 'Modo de Análise',
    plantHealth: 'Saúde da Planta',
    soilType: 'Tipo de Solo',
    soilTestIntro: 'Estime o tipo do seu solo usando testes visuais e táteis simples. Sem laboratório.',
    startTest: 'Iniciar Teste',
    testStep1: 'Teste da Bola',
    testStep2: 'Teste da Fita',
    testStep3: 'Teste de Textura',
    soilResult: 'Estimativa do Solo',
    loginTitle: 'Sisteminha EcoFarm',
    loginSubtitle: 'Inteligência Agrícola para Todos',
    signInGoogle: 'Entrar com Google',
    signInEmail: 'Entrar com Email',
    createAccount: 'Criar Conta',
    forgotPassword: 'Esqueci a Senha?',
    setupWelcome: 'Vamos configurar sua fazenda',
    setupStep1: 'Escala',
    setupStep2: 'Localização',
    setupStep3: 'Preferências',
    setupStep4: 'Unidades',
    next: 'Próximo',
    back: 'Voltar',
    finish: 'Concluir',
    selectUnits: 'Selecione unidades ativas',
    calculator: 'Simulador',
    calcIntro: 'Planeje a lotação animal baseada em área e dieta.',
    totalArea: 'Área Total (ha)',
    productivity: 'Produtividade (kg MS/ha/ano)',
    animals: 'Animais',
    simulationResults: 'Resultados da Simulação',
    areaUsage: 'Uso de Área',
    feedRequired: 'Ração Necessária (Ciclo)',
    financials: 'Projeções Financeiras'
  }
};

export const TIER_1_COMPONENTS: SystemComponent[] = [
  { 
    id: '1', 
    name: 'Tilapia Tank', 
    category: 'water', 
    status: 'active', 
    lastChecked: '4h ago',
    specs: ['12 m² Area', '10,000L Volume', '356 Tilapia', 'Temp: 28°C', 'pH: 6.8'],
    production: '30-35 kg / 90 days',
    cycleProgress: 50,
    cycleLabel: 'Day 45 of 90',
    revenueEstimate: 'R$ 360 - 525 / cycle',
    salesOpportunities: [
      { channel: 'Feiras (Fair)', price: 'R$ 15-18/kg', recommended: true },
      { channel: 'Apps/Online', price: 'R$ 18-20/kg' }
    ]
  },
  { 
    id: '2', 
    name: 'Laying Hens', 
    category: 'animal', 
    status: 'active', 
    lastChecked: '2h ago',
    specs: ['10 Rhodes Hens', 'Age: 18 months', 'Coop: 40 sq ft', 'Run: 96 sq ft'],
    production: '8-9 eggs/day (~250/mo)',
    cycleProgress: 100,
    cycleLabel: 'Peak Production',
    revenueEstimate: 'R$ 277 - 310 / month',
    salesOpportunities: [
      { channel: 'Porta-a-porta', price: 'R$ 1.50/ovo', recommended: true }
    ]
  },
  { 
    id: '3', 
    name: 'Vegetable Beds', 
    category: 'plant', 
    status: 'active', 
    lastChecked: '1d ago',
    specs: ['50 m² Area', '5 Beds', '4 Mixed Batches', 'Irrigation: Fish Water'],
    production: '~50 kg / week',
    cycleProgress: 75,
    cycleLabel: 'Harvesting Lote 1',
    revenueEstimate: 'R$ 293 - 1,200 / week',
    salesOpportunities: [
      { channel: 'Cestas Delivery', price: 'R$ 65/cesta', recommended: true }
    ]
  },
  { 
    id: '4', 
    name: 'Compost Pile', 
    category: 'waste', 
    status: 'active', 
    lastChecked: '3d ago',
    specs: ['3 Staggered Piles', 'Temp: 62°C (Active)', 'Input: Fish waste'],
    production: '85-90 kg / 45 days',
    cycleProgress: 33,
    cycleLabel: 'Pile 2 Peak Heat',
    revenueEstimate: '~R$ 130 value / month',
    salesOpportunities: [
      { channel: 'Vizinhos (Varejo)', price: 'R$ 50/saco', recommended: true }
    ]
  }
];

export const TIER_2_COMPONENTS: SystemComponent[] = [
  { 
    id: 't2_1', 
    name: 'Cattle Confinement', 
    category: 'animal', 
    status: 'active', 
    lastChecked: '1h ago', 
    specs: ['Small Commercial', '30 Head'],
    production: 'Start-up',
    cycleProgress: 60, 
    cycleLabel: 'Fattening',
    revenueEstimate: 'R$ 120k/yr',
    efficiency: 92,
    salesOpportunities: []
  },
  { 
    id: 't2_2', 
    name: 'Biogas Biodigester', 
    category: 'energy', 
    status: 'active', 
    lastChecked: 'Live',
    specs: ['10m³'],
    production: 'Cooking Gas',
    cycleProgress: 88, 
    cycleLabel: 'Active',
    revenueEstimate: 'Savings',
    efficiency: 95,
    salesOpportunities: []
  },
  { 
    id: 't2_3', 
    name: 'Sugarcane Proc.', 
    category: 'processing', 
    status: 'active', 
    lastChecked: '4h ago',
    specs: ['Fodder only'],
    production: 'Feed',
    cycleProgress: 40,
    cycleLabel: 'Harvest',
    revenueEstimate: 'Internal',
    efficiency: 98,
    salesOpportunities: []
  },
  { 
    id: 't2_4', 
    name: 'Solar Array', 
    category: 'energy', 
    status: 'active', 
    lastChecked: 'Live',
    specs: ['5kW'],
    production: 'Energy',
    cycleProgress: 100,
    cycleLabel: 'Peak',
    revenueEstimate: 'Savings',
    efficiency: 100,
    salesOpportunities: []
  },
  { 
    id: 't2_5', 
    name: 'Commercial Aquaculture', 
    category: 'water', 
    status: 'maintenance', 
    lastChecked: '2h ago',
    specs: ['2 Tanks'],
    production: '1 Ton',
    cycleProgress: 20,
    cycleLabel: 'Maint.',
    revenueEstimate: 'R$ 15k',
    efficiency: 85,
    salesOpportunities: []
  },
  { 
    id: 't2_6', 
    name: 'Maize/Bean Rotation', 
    category: 'plant', 
    status: 'planning', 
    lastChecked: '1d ago',
    specs: ['2 Hectares'],
    production: 'Planning',
    cycleProgress: 10,
    cycleLabel: 'Seeding',
    revenueEstimate: 'Feed',
    efficiency: 90,
    salesOpportunities: []
  }
];

export const TIER_3_COMPONENTS: SystemComponent[] = [
  { 
    id: 't3_1', 
    name: 'Cattle Confinement', 
    category: 'animal', 
    status: 'active', 
    lastChecked: '1h ago',
    specs: ['120 Head', 'Breed: Nelore', 'Diet: Cane/Urea', 'Area: 2 Hectares'],
    production: '120kg gain / animal / cycle',
    cycleProgress: 60,
    cycleLabel: 'Day 54 of 90 (Fattening)',
    revenueEstimate: 'R$ 480k / cycle',
    efficiency: 92,
    salesOpportunities: [
      { channel: 'Regional Slaughterhouse', price: 'Market + 5%', recommended: true },
      { channel: 'Export Contract', price: 'Market + 12%' }
    ]
  },
  { 
    id: 't3_2', 
    name: 'Biogas Biodigester', 
    category: 'energy', 
    status: 'active', 
    lastChecked: 'Live',
    specs: ['Vol: 50m³', 'Input: Cattle Manure', 'Methane: 65%'],
    production: '1,200 kWh / month',
    cycleProgress: 88,
    cycleLabel: 'Continuous Output',
    revenueEstimate: 'R$ 1,000 saved / month',
    efficiency: 95,
    salesOpportunities: []
  },
  { 
    id: 't3_3', 
    name: 'Sugarcane Proc.', 
    category: 'processing', 
    status: 'active', 
    lastChecked: '4h ago',
    specs: ['Cap: 5 tons/day', 'Output: Juice/Bagasse', 'Molasses: Feed'],
    production: 'Feed for 120 Cattle',
    cycleProgress: 40,
    cycleLabel: 'Harvest Season',
    revenueEstimate: 'Cost Reduction: 40%',
    efficiency: 98,
    salesOpportunities: [
      { channel: 'Ethanol Plant (Surplus)', price: 'Spot Price' }
    ]
  },
  { 
    id: 't3_4', 
    name: 'Solar Array', 
    category: 'energy', 
    status: 'active', 
    lastChecked: 'Live',
    specs: ['15kW System', 'Panels: 40', 'Battery: 20kWh'],
    production: '2.1 MWh / month',
    cycleProgress: 100,
    cycleLabel: 'Peak Hours',
    revenueEstimate: 'R$ 1,800 saved / month',
    efficiency: 100,
    salesOpportunities: [
      { channel: 'Grid Credit', price: '1:1 Ratio' }
    ]
  },
  { 
    id: 't3_5', 
    name: 'Commercial Aquaculture', 
    category: 'water', 
    status: 'maintenance', 
    lastChecked: '2h ago',
    specs: ['8 Tanks', 'Vol: 200,000L', 'Biofilter: Active'],
    production: '4 Tons / Cycle',
    cycleProgress: 20,
    cycleLabel: 'Fingerling Stage',
    revenueEstimate: 'R$ 60k / cycle',
    efficiency: 85,
    salesOpportunities: [
      { channel: 'Supermarkets', price: 'Contract' }
    ]
  },
  { 
    id: 't3_6', 
    name: 'Maize/Bean Rotation', 
    category: 'plant', 
    status: 'planning', 
    lastChecked: '1d ago',
    specs: ['10 Hectares', 'Soil: Corrected', 'Fertilizer: Digestate'],
    production: 'Est. 60 Tons Silage',
    cycleProgress: 10,
    cycleLabel: 'Seeding',
    revenueEstimate: 'Feed Self-Sufficiency',
    efficiency: 90,
    salesOpportunities: []
  }
];


export const EDUCATION_MODULES: EducationModule[] = [
  {
    id: 'mod_cattle',
    title: 'Cattle Confinement',
    description: 'Intensive livestock management, feedlot optimization, and health tracking.',
    icon: Beef,
    resources: [
      {
        title: 'Cattle Confinement Techniques',
        type: 'video',
        url: 'https://www.youtube.com/watch?v=rWOE6oMkvTs',
        duration: '15 min',
        source: 'YouTube'
      },
      {
        title: 'Feedlot Project Guide',
        type: 'video',
        url: 'https://www.youtube.com/watch?v=8k84Huf900M',
        duration: '22 min',
        source: 'YouTube'
      },
      {
        title: 'FAO: Livestock & Environment',
        type: 'article',
        url: 'https://www.fao.org/gleam/en/',
        source: 'FAO'
      }
    ]
  },
  {
    id: 'mod_biogas',
    title: 'Biogas & Energy',
    description: 'Converting manure into energy (biogas) and organic fertilizer (digestate).',
    icon: Factory,
    resources: [
      {
        title: 'Biogas Production in Brazil: Barriers and Strategies',
        type: 'article',
        url: 'https://liu.diva-portal.org/smash/get/diva2:1897662/FULLTEXT01.pdf',
        source: 'DIVA Portal'
      },
      {
        title: 'Determinação do Potencial de Geração de Biogás',
        type: 'article',
        url: 'https://portaldeperiodicos.animaeducacao.com.br/index.php/gestao_ambiental/article/download/8713/4864/21937',
        source: 'Anima Educação'
      },
      {
        title: 'Biogas Digester: 10 Steps DIY',
        type: 'guide',
        url: 'https://www.instructables.com/Biogas-Digester/',
        source: 'Instructables'
      }
    ]
  },
  {
    id: 'mod_sugar',
    title: 'Sugarcane Integration',
    description: 'Processing for feed (bagasse), molasses, and energy integration.',
    icon: Sprout,
    resources: [
      {
        title: 'Sugarcane Processing Guide',
        type: 'article',
        url: 'https://niftem.ac.in/newsite/pmfme/wp-content/uploads/2022/08/sugarcanewriteup.pdf',
        source: 'NIFTEM'
      },
      {
        title: 'Sugar Production Tech',
        type: 'article',
        url: 'https://www.ctc-n.org/sites/default/files/resources/4f7cd73d-af10-4c0f-a3fe-64851661b3dc.pdf',
        source: 'CTC-N'
      }
    ]
  },
  {
    id: 'mod_solar',
    title: 'Solar Energy Systems',
    description: 'Grid-tied and off-grid solar solutions for farm autonomy.',
    icon: Sun,
    resources: [
      {
        title: 'Solar Farms Overview',
        type: 'video',
        url: 'https://www.youtube.com/watch?v=63MMw7IGkms',
        duration: '12 min',
        source: 'YouTube'
      },
      {
        title: 'Rural Solar Installation',
        type: 'video',
        url: 'https://www.youtube.com/watch?v=HSxePCjSi10',
        duration: '18 min',
        source: 'YouTube'
      },
      {
        title: 'Off-grid Systems Explained',
        type: 'video',
        url: 'https://www.youtube.com/watch?v=1L25SHOrxUU',
        duration: '25 min',
        source: 'YouTube'
      },
      {
        title: 'Solar Farm Guide',
        type: 'guide',
        url: 'https://bydenergia.com/en/solar-farm/',
        source: 'BYD Energy'
      }
    ]
  },
  {
    id: 'mod_aqua',
    title: 'Commercial Aquaculture',
    description: 'High-density Tilapia farming, water quality, and RAS.',
    icon: Fish,
    resources: [
      {
        title: 'Tilapia Farming Pro',
        type: 'video',
        url: 'https://www.youtube.com/watch?v=pmDkUM7eEtY',
        duration: '14 min',
        source: 'YouTube'
      },
      {
        title: 'Step-by-Step Commercial RAS',
        type: 'video',
        url: 'https://www.youtube.com/watch?v=MrrbeSZmKCY',
        duration: '30 min',
        source: 'YouTube'
      },
      {
        title: 'Sisteminha Embrapa: Produção Sustentável',
        type: 'video',
        url: 'https://www.youtube.com/watch?v=LgqIu7ZH2C4',
        duration: '40 min',
        source: 'YouTube'
      }
    ]
  },
  {
    id: 'mod_crops',
    title: 'Crop Rotation (Maize/Bean)',
    description: 'Soil health, nitrogen fixation, and feed self-sufficiency.',
    icon: Wheat,
    resources: [
      {
        title: 'Bean-Maize Rotation Benefits',
        type: 'article',
        url: 'https://pmc.ncbi.nlm.nih.gov/articles/PMC7792662/',
        source: 'PMC Research'
      },
      {
        title: 'Legume-Maize Nitrogen Cycle',
        type: 'article',
        url: 'https://pmc.ncbi.nlm.nih.gov/articles/PMC6561941/',
        source: 'PMC Research'
      }
    ]
  },
  {
    id: 'mod_embrapa',
    title: 'Sisteminha Embrapa Foundation',
    description: 'The core principles of the integrated system for family farming.',
    icon: Sprout,
    resources: [
      {
        title: 'Official Embrapa Portal',
        type: 'article',
        url: 'https://www.embrapa.br/meio-norte/sisteminha',
        source: 'Embrapa'
      },
      {
        title: 'Estrutura do Sisteminha',
        type: 'video',
        url: 'https://www.youtube.com/watch?v=UAxYoKuhmcs',
        duration: '25 min',
        source: 'YouTube'
      }
    ]
  }
];

// --- REFERENCE DATA FOR CALCULATOR ---

export const REFERENCE_DATA: {
  ingredients: Ingredient[];
  species: Species[];
} = {
  ingredients: [
    { id: 'ing_corn', name: 'Ground Corn (Milho)', defaultCost: 1.20, dryMatterPct: 0.88 },
    { id: 'ing_silage', name: 'Corn Silage (Silagem)', defaultCost: 0.30, dryMatterPct: 0.35 },
    { id: 'ing_urea', name: 'Livestock Urea', defaultCost: 4.50, dryMatterPct: 1.00 },
    { id: 'ing_cotton', name: 'Cottonseed (Caroço)', defaultCost: 1.50, dryMatterPct: 0.90 },
    { id: 'ing_ddg', name: 'DDG (Corn Distillers)', defaultCost: 1.80, dryMatterPct: 0.90 },
    { id: 'ing_pulp', name: 'Citrus Pulp', defaultCost: 0.90, dryMatterPct: 0.88 },
    { id: 'ing_cane', name: 'Sugarcane Bagasse', defaultCost: 0.15, dryMatterPct: 0.45 },
    { id: 'ing_soy_mol', name: 'Soy Molasses', defaultCost: 1.10, dryMatterPct: 0.75 }
  ],
  species: [
    {
      id: 'caprino',
      name: 'Goat (Caprino Leiteiro)',
      standardWeight: 60,
      standardDays: 365,
      labs: [
        {
          id: 'lab_c1',
          name: 'Lab C1 (Basic)',
          composition: [
            { ingredientId: 'ing_corn', amountKgMS: 0.5 },
            { ingredientId: 'ing_silage', amountKgMS: 2.0 }
          ]
        },
        {
          id: 'lab_c2',
          name: 'Lab C2 (Performance)',
          composition: [
             { ingredientId: 'ing_corn', amountKgMS: 1.2 },
             { ingredientId: 'ing_silage', amountKgMS: 1.5 }
          ]
        },
        {
          id: 'lab_c3',
          name: 'Lab C3 (Byproducts)',
          composition: [
             { ingredientId: 'ing_cotton', amountKgMS: 0.25 },
             { ingredientId: 'ing_ddg', amountKgMS: 0.70 },
             { ingredientId: 'ing_pulp', amountKgMS: 0.70 },
             { ingredientId: 'ing_cane', amountKgMS: 0.60 },
             { ingredientId: 'ing_soy_mol', amountKgMS: 0.25 }
          ]
        }
      ]
    },
    {
      id: 'nelore',
      name: 'Beef Cattle (Nelore)',
      standardWeight: 450,
      standardDays: 120,
      labs: [
        {
          id: 'lab_n1',
          name: 'Lab N1 (Finishing)',
          composition: [
             { ingredientId: 'ing_silage', amountKgMS: 6.0 },
             { ingredientId: 'ing_corn', amountKgMS: 5.0 },
             { ingredientId: 'ing_urea', amountKgMS: 0.1 }
          ]
        },
        {
           id: 'lab_n2',
           name: 'Lab N2 (Intensive)',
           composition: [
              { ingredientId: 'ing_silage', amountKgMS: 5.0 },
              { ingredientId: 'ing_corn', amountKgMS: 6.5 },
              { ingredientId: 'ing_urea', amountKgMS: 0.15 }
           ]
        }
      ]
    },
    {
      id: 'holstein',
      name: 'Dairy Cow (Holandesa)',
      standardWeight: 550,
      standardDays: 365,
      labs: [
        {
           id: 'lab_h1',
           name: 'Lab H1 (Standard)',
           composition: [
              { ingredientId: 'ing_silage', amountKgMS: 10.0 },
              { ingredientId: 'ing_corn', amountKgMS: 6.0 },
              { ingredientId: 'ing_soy_mol', amountKgMS: 2.0 }
           ]
        },
         {
           id: 'lab_h2',
           name: 'Lab H2 (High Yield)',
           composition: [
              { ingredientId: 'ing_silage', amountKgMS: 11.0 },
              { ingredientId: 'ing_corn', amountKgMS: 7.5 },
              { ingredientId: 'ing_soy_mol', amountKgMS: 2.5 }
           ]
        }
      ]
    }
  ]
};