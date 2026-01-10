# SISTEMINHA ECOFARM - TECHNICAL DOCUMENTATION
## Complete Prompt Architecture & Application Functionality Guide

## 📋 TABLE OF CONTENTS
- Project Overview & Architecture
- Core Prompts Used to Create the Application
- Feature Implementation Details
- Data Models & Integration
- API Services & Tool Definitions
- User Workflows & Scenarios
- Deployment & Configuration

---

## 🎯 1. PROJECT OVERVIEW

**Sisteminha EcoFarm** is a comprehensive integrated farm management platform designed for circular agriculture systems in Brazil (particularly the semi-arid Northeast region). It combines AI-powered diagnostics with production unit tracking, financial forecasting, and educational resources.

### Core Objectives
- Enable small-to-medium farms (Tier 1-3) to design, implement, and monitor circular food production systems
- Integrate aquaculture (fish), livestock (cattle), renewable energy (biogas, solar), and crop rotation
- Provide real-time diagnostics and profitability analysis through AI agents
- Reduce environmental impact through nutrient cycling and waste valorization
- Support farmers in semi-arid regions with climate-adapted guidance

### Technology Stack
- **Frontend**: React 18 + TypeScript + Tailwind CSS
- **Backend**: Gemini 3 Pro Extended Thinking API
- **Data**: Browser-based (SQLite via Room/Realm for mobile)
- **Mobile**: React Native compatibility (offline-first)
- **Export**: Excel (.xlsx) with embedded formulas, CSV, PDF

---

## 🤖 2. CORE PROMPTS USED TO CREATE THE APPLICATION

The application was designed around a library of system-level prompts that define features, tiers, and tools used by the AI agent. These prompts encapsulate business rules, formulas, and workflows for soil assessment, production scaling, planning, logging, and diagnostics.

### PROMPT 1: Initial Project Specification
**Purpose**: Define the overall scope and architecture

**Key Elements**:
- 7 core features (Plant ID, Farm Analysis, Sisteminha Integration, Resource Optimization, Food Security, Educational Content, Community Sharing)
- Target users: Small-scale farmers (100-1000 m²), urban gardeners, families seeking food security
- Technical specs: Android-first, offline functionality, local data storage
- Success metrics: >85% plant ID accuracy, <2 second camera analysis

**Used In**: Application architecture foundation

### PROMPT 2: Farming Area Analysis & Soil Assessment
**Purpose**: Create soil testing and area optimization module

**Key Implementation**:
- Ball test, ribbon test, and texture assessment for soil classification
- Auto-recommendation of components based on climate/soil
- Integration with camera analyzer for real-time soil photo logging
- Outputs: Soil type (clay/loam/sand), drainage assessment, pH estimates

**Used In**: `CameraAnalyzer.tsx` - Soil Analysis Mode

### PROMPT 3: Production Units Architecture (Tier Scaling)
**Purpose**: Define modular product tiers and scaling framework

**Tier Structure**:
```
Tier 1 (Family/Sisteminha): 100-1000 m²
  - Single fish tank + basic livestock + gardens
  - Focus: Food security

Tier 2 (Small Commercial): 1-5 hectares
  - Multiple systems + market access
  - Focus: Revenue generation

Tier 3 (Circular/Industrial): 5-20+ hectares
  - Integrated cattle + biogas + solar + aquaculture + crops
  - Focus: Energy independence & waste valorization
```

**Key Formulas**:
- **DMI** (Dry Matter Intake) = Σ ingredient_ms per day
- **Area Required** = Total_MS / Productivity_Y
- **FCR** (Feed Conversion Ratio) = Feed_consumed / Weight_gain
- **Max Capacity** = Available_area / Area_per_animal

**Used In**: `EcofarmCalculator.ts`, `Planner.tsx`

### PROMPT 4: Login & Initial Setup Wizard
**Purpose**: Onboard new users with farm profile configuration

**4-Step Flow**:
1. **Farm Scale Selection**: Choose Tier 1/2/3 (with descriptions & investment ranges)
2. **Location & Climate Analysis**: Dynamic climate insights based on state/region
3. **Language & Settings**: Portuguese/English, metric/imperial units
4. **Production Units**: Toggle which systems to monitor (Cattle, Biogas, Solar, etc.)

**Dynamic Features**:
- State dropdown → Climate zones filter → City auto-select
- Climate color-coding (Tropical=orange, Subtropical=gold, Temperate=green, Semi-arid=darker orange)
- Region-specific crop recommendations & EMATER contact links

**Used In**: `Login.tsx`, `SetupWizard.tsx`

### PROMPT 5: Dashboard & Production Unit Cards
**Purpose**: Real-time monitoring of all production units

**Card Implementation**:
- Expandable modals showing full specs, production data, sales opportunities
- Key metrics per unit: Status, % Complete, Efficiency, Last Update
- "Log Activity" & "Manage" quick-action buttons
- Weather integration with 5-day forecast (temperature, precipitation, icons)

**Data Structure**:
```typescript
SystemComponent {
  id: string
  name: string
  status: 'planning' | 'active' | 'maintenance' | 'live'
  progress: number (0-100)
  efficiency: number (percentage)
  lastChecked: timestamp
  specifications: {...}
  production: {...}
  salesOpportunities: [...]
}
```

**Used In**: `Dashboard.tsx`

### PROMPT 6: System Planner & Implementation Roadmap
**Purpose**: Step-by-step construction guides for all units

**4-Phase Model**: Foundation → Integration → Optimization → Expansion

**Phase 1 Details (Sisteminha Example)**:
- Step 1: Soil analysis (7 days)
- Step 2: Fish tank build (14-21 days, 40 checklist items)
- Step 3: Compost area (7-14 days, 25 items)
- Step 4: Chicken coop (7-14 days, 30 items)

**Features**:
- Expandable step-by-step checklists
- Sub-phases with specific tasks
- Cost breakdown by category
- Critical path dependencies
- Risk mitigation guidance

**Used In**: `Planner.tsx`

### PROMPT 7: Production Data Capture & Excel Export
**Purpose**: Comprehensive daily/weekly/monthly logging system

**6 Production Units (188+ data points)**:
- **Cattle Confinement**: Inventory, feeding, health, manure, facility, economics
- **Biogas Biodigester**: Feedstock, conditions, production, utilization, output, maintenance
- **Sugarcane Processing**: Field status, harvest, processing, output, byproducts, economics
- **Solar Array**: Status, generation, inverter, consumption, economic
- **Aquaculture**: Stock, feeding, water quality, health, system, economics
- **Maize/Bean Rotation**: Planting, management, growth, harvest, residue, economics, rotation

**Auto-Calculated Metrics**:
- FCR, ADG (Average Daily Gain), Mortality%, Capacity Factor
- Profitability by unit + whole farm
- Nutrient cycling efficiency
- Carbon avoided (kg CO2)

**Excel Schema**: Daily Log → Weekly Summary → Monthly Report → Formulas/Calculations

**Used In**: `ExcelExportService.ts`, `Dashboard.tsx` (Log Activity)

### PROMPT 8: AI Agent with Extended Thinking
**Purpose**: Autonomous farm diagnostics & recommendations

**System Signature Pattern**:
```
[SESSION_ID: uuid]
[TIMESTAMP: ISO8601]
[FARM_ID: farmId]
[THINKING_DEPTH: extended]
[CONFIDENCE_THRESHOLD: 0.75]
[TOOLS_AVAILABLE: weather_api, soil_db, crop_models, excel_gen, browser_verify]
```

**5 Core Tools**:

1. **weather_api**: INMET + OpenMeteo integration
   - Returns: temp, humidity, rainfall, soil moisture, ETc
   - Used for: Irrigation timing, frost/extreme weather alerts

2. **soil_db**: Historical moisture & yield database
   - Returns: Wilting points, critical stress thresholds
   - Used for: Crop stress analysis, historical comparisons

3. **crop_models**: EMBRAPA + FAO AquaCrop models
   - Returns: Stress factors, yield forecasts (pessimistic/nominal/optimistic)
   - Used for: Growth stage analysis, irrigation recommendations

4. **excel_generator**: Dynamic scenario reports
   - Returns: XLSX with embedded formulas, verification code
   - Used for: Payback analysis, what-if scenarios, financial exports

5. **browser_verify**: Component verification
   - Returns: Render success, errors, suggested fixes
   - Used for: Dashboard component testing before deployment

**Used In**: `AgentService.ts`, `AgentView.tsx`

### PROMPT 9: Modular Ecofarm Calculator (Tier Scaling)
**Purpose**: Feed & land requirement simulations across tiers

**Core Formulas**:
```
DMI = Σ(ingredient_ms_kg_per_day)
MS_total = DMI × T_days × N_animals
Area = MS_total / Productivity_Y
Max_animals = (Area_available - Area_used_by_others) / Area_per_animal
```

**Tier-Specific Features**:
- **Tier 1**: Single species, simple DMI, no costs
- **Tier 2**: Multiple species, mixed labs, area checklist, max capacity alerts
- **Tier 3**: Multi-species, cost tracking, ROI, financial scenarios

**Lab Options** (per species):
- **Caprino**: C1 (Low cost), C2 (High performance), C3 (Balanced)
- **Nelore**: N1 (Termição), N2 (Optimized)
- **Holandesa**: H1, H2 (Dairy focused)

**Used In**: `EcofarmCalculator.ts`, `Planner.tsx` (Calculator tab)

### PROMPT 10: Knowledge Hub & Educational Resources
**Purpose**: 89+ verified learning resources compiled

**Coverage**:
- 7 instructional videos (YouTube links, 2024-2025)
- 26+ articles & guides (peer-reviewed)
- 6+ research papers (scientific validation)
- 8 DIY construction guides
- 5.5 hours total learning pathway

**Module Topics**:
- Sisteminha Embrapa Overview
- Fish Tank Setup & RAS (Recirculating Aquaculture Systems)
- Nitrogen Cycle & Filtration
- Chicken Coop Construction
- Nutrient Cycling & Composting
- Biogas & Energy
- Crop Management & Rotation

**Used In**: `Education.tsx`, `constants.ts` (EDUCATION_MODULES)

### PROMPT 11: Weather API Integration
**Purpose**: Real-time climate data for decision support

**Features**:
- 7-day forecast display (temperature, precipitation, conditions)
- Location auto-detection (browser geolocation)
- Manual city search (Geocoding API integration)
- Dynamic weather icons (Sun, CloudRain, Cloud)
- Climate zone color coding

**API Endpoints**:
- Open-Meteo Forecast: weather data (free, no auth)
- Open-Meteo Geocoding: location search
- INMET data (optional future integration)

**Used In**: `Dashboard.tsx`

### PROMPT 12: Billing & Product Positioning
**Purpose**: Freemium model & target customer definition

**Pricing Tiers**:
- **Free**: Sisteminha (Tier 1) core features
- **Pro** (R$ 15-30/month): Tier 2 + IoT sensors + analytics
- **Enterprise**: Tier 3 + multi-farm + benchmarking

**Target Users**:
- Individual small farmers (Sisteminha focus)
- Cooperatives managing 5-100 farms
- ATER extension agents
- Agricultural consultants

---

## 📊 3. FEATURE IMPLEMENTATION DETAILS

### A. Plant Identification (Camera Analyzer)
**Modes**: Plant Recognition | Soil Analysis

**Plant Mode**:
- Uses Gemini 3 Flash Image for real-time plant identification
- Detects: Species, health status, pests, diseases, nutrient deficiencies
- Outputs: Visual symptoms, recommended actions

**Soil Mode**:
- **Step 1**: Ball test → Form ball from moist soil
- **Step 2**: Ribbon test → Extend soil into ribbons (classifies texture)
- **Step 3**: Classification → Clay/Loam/Sand determination
- Provides: Soil type, drainage assessment, pH estimate

**Used In**: `CameraAnalyzer.tsx`

### B. Circular Economy Visualization
**For Tier 3 Only**:

```
Cattle Confinement → Manure
    ↓
├→ 50% to Biogas Biodigester
│   ├→ Methane → Energy (kWh)
│   └→ Digestate → Compost input
│
└→ 50% to Compost System
    ├→ Finished compost (45-90 days)
    └→ To crop fields (Maize/Bean)
        ├→ Crop residue → Back to Compost
        ├→ Grain → Cattle feed (closed loop)
        └→ Harvest → Revenue

Solar Array
    ↓ (kWh)
├→ Pump electricity (Aquaculture, Irrigation)
├→ Biogas heating (digester temp control)
├→ Building operations
└→ Grid injection (if surplus)

Aquaculture effluent
    ↓
├→ Direct irrigation (nutrient-rich water)
└→ Crop fields (NPK cycling)
```

**Used In**: `Dashboard.tsx` (Circular Economy Mapper)

### C. Financial Analysis
**Monthly Dashboard**:

```
REVENUE (by unit):
├─ Cattle: kg_meat × market_price_per_kg
├─ Fish: kg_harvest × price
├─ Vegetables: kg_harvest × market_price
├─ Eggs: count × price_per_egg
├─ Biogas: m³ × energy_cost_saved
└─ Total Monthly Revenue

EXPENSES (by unit):
├─ Feed costs
├─ Utilities (water, fuel)
├─ Labor (if hired)
├─ Maintenance & repairs
└─ Total Monthly OPEX

PROFITABILITY:
├─ Net Profit = Revenue - OPEX
├─ Profit Margin % = (Net / Revenue) × 100
├─ ROI by unit
└─ Payback period
```

**Scenarios**:
- Irrigate today vs. delay 2 days → Yield impact (±10%)
- Change lab (N1→N2) → DMI changes → Area changes → Cost impact
- Expand from 50 to 100 animals → Available area constraint check

**Used In**: `Dashboard.tsx` (Financial Snapshot), `Planner.tsx` (Budget tab)

### D. Log Activity & Monitoring
**Quick-Log Buttons** (Mobile-optimized):

- 🐟 **Aquaculture**: pH check, Temperature record, Feed measurement, Mortality count, Water quality
- 🐄 **Cattle**: Feed distribution, Health observation, Weight estimate, Manure collection
- ☀️ **Solar**: Generation status, Inverter condition, Battery charge, Grid connectivity
- 🚡 **Biogas**: Feedstock input, Temperature, Pressure, Utilization, Maintenance
- 🌾 **Crops**: Growth stage, Soil moisture, Pest/disease signs, Irrigation needs
- 🔗 **Compost**: Material added, Temperature, Moisture, Curing stage

---

## 📄 4. DATA MODELS & INTEGRATION

### Core Entity Relationships
```typescript
User (1) ---> (many) Farms
Farm (1) ---> (many) SystemComponents
SystemComponent (1) ---> (many) ProductionLogs
ProductionLog (1) ---> (many) ActivityRecords
ActivityRecords ---> CalculatedMetrics
```

### Database Schema (Browser IndexedDB / SQLite Mobile)

**Users Table**: user_id (PK), email, password_hash, name, language, units_system

**Farms Table**: farm_id (PK), user_id (FK), name, tier (1|2|3), location, area_m2, coordinates, climate_zone, created_at

**SystemComponents Table**: component_id (PK), farm_id (FK), type (cattle|biogas|solar|aquaculture|crops|compost), status, specifications_json, last_updated

**ProductionLogs Table**: log_id (PK), component_id (FK), date, metrics_json (188+ data points), timestamp

**Education Module**: module_id, title, category, duration_minutes, resource_url, verified_by_embrapa

---

## 📧 5. API SERVICES & TOOL DEFINITIONS

### External API Integrations

**1. Weather & Climate APIs**
- **Open-Meteo**: Free weather forecasting (no API key required)
  - Endpoints: /forecast, /geocoding
  - Update frequency: Hourly
  - Data: Temperature, precipitation, soil moisture, ET₀

**2. Geolocation Services**
- **Browser Geolocation API**: User location (with permission)
- **Open-Meteo Geocoding**: Reverse lookup (city name from coordinates)

**3. AI/ML Models**
- **Gemini 3 Flash**: Plant/soil image analysis
- **Gemini 3 Pro Extended Thinking**: Farm diagnostics & recommendations
- **Vertex AI**: Optional future integration for batch processing

**4. Export/File Generation**
- **ExcelJS**: XLSX file creation with formulas
- **PDFKit**: PDF report generation

### Internal Tool Definitions

**Available Tools for AI Agent**:
1. `getWeatherForecast(lat, lon, days)` => WeatherData[]
2. `getSoilDatabase(farm_id, field_id, metric)` => HistoricalData
3. `runCropModel(crop, stage, conditions, irrigation)` => YieldForecast
4. `generateExcelReport(farm_id, template)` => ExcelBuffer
5. `verifyComponent(component_type)` => RenderStatus

---

## 🚅 6. USER WORKFLOWS & SCENARIOS

### Workflow 1: Onboarding a New Farmer (Tier 1)
**Duration**: 15 minutes

1. **Authentication**: Email/password signup
2. **Farm Profile**:
   - Tier selection: Choose "Tier 1 - Sisteminha"
   - Location: Input state => Auto-detect climate zone
   - Area: Enter available space (100-1000 m2)
3. **Initial Setup Wizard**:
   - Language: Portuguese / English
   - Production units: Toggle Aquaculture, Livestock, Gardens
4. **Dashboard Ready**: Cards appear for selected systems

### Workflow 2: Daily Farm Monitoring
**Touch points**:
- Open app => Dashboard shows all unit cards + weather (5-day forecast)
- Tap "Log Activity" on Aquaculture card
- Quick form: pH (7.2), Temp (28C), Feed (250g), Mortality (0)
- Auto-calculation: FCR updated, alerts if threshold breached
- Card updates in real-time

### Workflow 3: Soil Analysis Using Camera
**Steps**:
1. Dashboard => Tap "Camera" => Select "Soil Analysis"
2. Ball test: Take photo of moistened soil ball
3. Ribbon test: Extend soil, photo of ribbon length
4. AI evaluates: Soil type = Loam, Drainage = Good, pH estimate = 6.5
5. Recommendation appears: "Add 2 kg compost per m2, consider lime for pH"
6. Save to farm record

### Workflow 4: Planning New Sisteminha (Tier 1 => Tier 2)
**Timeline**: 6 months

1. **Planner Tab**: "Expand to Tier 2"
2. **Input Data**:
   - Current: 1 fish tank (100m2), chickens (20)
   - Target: Add 500m2 with cattle
3. **Calculator**:
   - DMI for cattle: 50 animals x 10kg MS/day = 500 kg/day MS requirement
   - Total area needed: 500 / 8 = 62.5 m2 pasture
   - Available: 500m2 => Feasible
4. **Roadmap Generated**:
   - Phase 1 (Months 1-2): Cattle facility + pasture prep
   - Phase 2 (Months 3-4): Integration with manure => biogas feedstock
   - Phase 3 (Months 5-6): Optimize nutrient cycling
5. **Budget**: Estimated R$8,000 investment
6. **ROI Scenario**: "Break-even in 18 months if cattle meat sells at R$25/kg"

### Workflow 5: AI Agent Diagnostics
**Triggered by**:
- User asks: "Why is my aquaculture pH dropping?"
- Or: "What should I do if frost hits tomorrow?"

**Agent Process**:
1. Call `getWeatherForecast()` => Frost risk: YES
2. Call `getSoilDatabase()` => Aquaculture pH history
3. Analyze: pH drops correlate with temperature drops + high feed input
4. Recommendation: "Stop feeding 24h before frost. Increase aeration to release CO2."
5. Confidence: 0.89

---

## 🚀 7. DEPLOYMENT & CONFIGURATION

### Local Development Setup

```bash
# Install dependencies
npm install

# Set environment variables
echo "VITE_GEMINI_API_KEY=sk-xxx" > .env.local
echo "VITE_OPENMETEO_API=https://api.open-meteo.com/v1" >> .env.local

# Run development server
npm run dev

# Build for production
npm run build
```

### Environment Variables

| Variable | Purpose | Required |
|---|---|---|
| VITE_GEMINI_API_KEY | Gemini 3 API authentication | Yes |
| VITE_OPENMETEO_API | Weather API endpoint | No |
| VITE_APP_ENV | Environment (dev/staging/prod) | Yes |

### Browser Compatibility

- **Minimum**: Chrome 90+, Firefox 88+, Safari 14+, Edge 90+
- **Recommended**: Latest 2 versions
- **Mobile**: iOS Safari 14+, Chrome Android 90+

### Offline Mode

- Service Worker caches core assets
- IndexedDB stores farm data locally
- Sync queue: Changes made offline queue for upload when online
- Connectivity check every 10 seconds

### Performance Targets

- **LCP** (Largest Contentful Paint): < 2.5s
- **FID** (First Input Delay): < 100ms
- **CLS** (Cumulative Layout Shift): < 0.1
- **TTL** (Time to Interactive): < 3.5s
- **Plant ID camera analysis**: < 2s on device

---

## 🚗 Support & Contributing

**Documentation**: Full API docs available in `/docs` directory

**Issues**: Report bugs via GitHub Issues with [BUG] prefix

**Feature Requests**: Use [FEATURE] prefix

**Community**: Join discussions on GitHub Discussions

---

## 📜 License

MIT License - See LICENSE file for details

**Built with ♥ for circular agriculture in semi-arid Brazil**


<!-- Vercel Deployment Build Trigger - Build with updated Vite config -->
