# 🌱 Sisteminha EcoFarm
## AI-Powered Circular Agriculture Platform

[![Gemini 3 Pro](https://img.shields.io/badge/Powered%20by-Gemini%203%20Pro-blue)](https://ai.google.dev)
[![Status](https://img.shields.io/badge/Status-Beta-orange)](https://github.com/PauloTuppy/Sisteminha-EcoFarm)
[![License](https://img.shields.io/badge/License-MIT-green)](LICENSE)
[![Made in Brazil](https://img.shields.io/badge/Made%20in-Brazil-brightgreen)](https://pt.wikipedia.org/wiki/Brasil)

**Autonomous farm management system for integrated circular agriculture across 2-20 hectares.** Powered by Gemini 3 Pro with Extended Thinking, featuring Marathon Agent pattern for multi-step diagnostics, real-time weather integration, and closed-loop resource optimization.

---

## 🎯 What is Sisteminha EcoFarm?

Sisteminha EcoFarm is an intelligent farm management platform designed for **family and commercial farms in semi-arid Northeast Brazil** implementing circular agriculture principles. It orchestrates multiple production units (cattle, biogas, solar, aquaculture, crops, sugarcane) as an integrated ecosystem, eliminating waste and maximizing profitability.

**Key Innovation:** Uses Gemini 3 Pro's Extended Thinking mode to run autonomous multi-step diagnostics ("Marathon Agent" pattern), analyzing weather → soil → crop health → financial impact in real-time with >90% confidence thresholds.

---

## ✨ Core Features

### 🧠 Marathon Agent + Extended Thinking
- **Multi-step autonomous diagnostics** without single-prompt solutions
- **Thought Signature pattern:** Structured reasoning with confidence tracking
- **5 integrated tools:** weather_api, crop_models, soil_db, excel_generator, browser_verify
- **Verification pipeline:** Generated recommendations tested before presentation

### 🌤️ Real-Time Climate Intelligence
- INMET + OpenMeteo API integration for 7-day forecasts
- Soil moisture prediction with irrigation decision logic
- Weather-triggered alerts for frost, hail, extreme temperatures
- Climate zone mapping (tropical, subtropical, semi-arid, temperate)

### ♻️ Circular Economy Mapper
- Auto-generates nutrient flows: Manure → Biogas → Digestate → Compost → Fields
- Energy flows: Solar → Aquaculture pumps → Biogas heating → System
- Waste valorization tracking (kg/year reduction)
- **Metrics:** Energy independence %, Nutrient recycling %, Waste-zero progress

### 💰 Financial Intelligence Dashboard
- Monthly OPEX/Revenue by unit with drill-down
- ROI & payback period calculation (typical: 5-12 months)
- Scenario comparison (e.g., "Irrigate today vs. delay 2 days")
- Export Excel reports with formulas & verification

### 📊 Production Unit Management
**6 integrated production modules:**
1. **Cattle Confinement:** ADG, FCR, health monitoring, feed optimization
2. **Biogas Biodigester:** m³ production, energy equivalent, carbon avoided
3. **Solar Array:** kWh generation, capacity factor, grid injection
4. **Commercial Aquaculture:** Biomass tracking, FCR, survival rate
5. **Maize/Bean Rotation:** Yield forecasting, nitrogen fixation, crop health
6. **Sugarcane Processing:** Harvest scheduling, bagasse allocation, juice metrics

### 🎓 Knowledge Hub
- **89+ verified EMBRAPA resources** (videos, articles, research papers)
- 7 educational modules with learning pathways
- DIY construction guides (fish tanks, biogas digesters, coops)
- Regional EMATER contact integration

### 📱 Offline-First Mobile
- Daily task logging without connectivity
- Quick activity capture ("Log feed", "Log harvest", "Log energy")
- Auto-sync when online
- Lightweight database (SQLite)

### 🏗️ Modular Tier System
| Tier | Scale | Investment | Users | Features |
|------|-------|-----------|-------|----------|
| **Tier 1** | 100-1000 m² | R$ 3-10k | Family | Basic monitoring, dashboards, exports |
| **Tier 2** | 1-5 hectares | R$ 20-40k | Cooperatives | + Multi-unit coordination, capacity planning |
| **Tier 3** | 5-20 hectares | R$ 150-300k | Agribusiness | + ML forecasting, benchmarking, marketplace |

---

## 🚀 Quick Start

### Prerequisites
- **Node.js** 16+
- **npm** or **yarn**
- **Gemini API Key** ([get one](https://aistudio.google.com))

### Installation

```bash
# Clone the repository
git clone https://github.com/PauloTuppy/Sisteminha-EcoFarm.git
cd Sisteminha-EcoFarm

# Install dependencies
npm install

# Set up environment variables
cp .env.example .env.local
# Edit .env.local and add your Gemini API key:
# VITE_GEMINI_API_KEY=your_api_key_here

# Start development server
npm run dev
```

### Access the App
Open https://ai.studio/apps/drive/1VCRNH3tKq73mKpp-dN45WHu9gA4Zu8PL?fullscreenApplet=true in your browser.

---

## 📋 Project Structure

```
Sisteminha-EcoFarm/
├── components/          # React UI components
│   ├── Dashboard.tsx   # Main production overview
│   ├── Planner.tsx     # Implementation roadmap
│   ├── AgentView.tsx   # Marathon Agent chat interface
│   └── ...             # Other components
├── services/           # Business logic layer
│   ├── AgentService.ts         # Gemini 3 Marathon Agent
│   ├── EcofarmCalculator.ts    # Math formulas (MS, area, costs)
│   ├── ExcelExportService.ts   # XLSX generation
│   └── geminiService.ts        # API integration
├── types.ts            # TypeScript interfaces
├── constants.ts        # Reference data (species, labs, farms)
└── index.html          # Entry point
```

---

## 🔧 How the Marathon Agent Works

### Thought Signature Pattern
```
[SESSION_ID: uuid]
[TIMESTAMP: ISO8601]
[FARM_ID: farmId]
[THINKING_DEPTH: extended] ← Gemini 3 Extended Thinking
[CONFIDENCE_THRESHOLD: 0.75] ← Only recommend if >75% confident
[TOOLS_AVAILABLE: weather_api, soil_db, crop_models, excel_gen, browser_verify]
```

### Example: Irrigation Decision
```
User: "Should I irrigate today?"

[AGENT THINKING]
Step 1: Ingest state (crops: Maize VT, 45% soil moisture, 5 ha)
Step 2: Call weather_api → Rain forecasted: 0mm (next 7 days)
Step 3: Call crop_models → Wilting point: 25%, critical: 35%
Step 4: Call soil_db → Historical: Similar conditions 2 yrs ago → delayed → 10% yield loss
Step 5: Logic: No rain + will hit critical in 48h + cost R$12 << benefit R$1,000

[RECOMMENDATION]
✅ YES - Irrigate TODAY (confidence: 92%)
   Cost: R$12 | Benefit: ~R$1,000 yield protection
   Action: Start pump at 06:00, target 30mm over 10 hours

[VERIFICATION]
✅ Verified via crop_models (EMBRAPA Maize VT)
✅ Verified via soil_db (3-year historical average)
✅ Verified via weather_api (INMET forecast)
```

---

## 📊 Key Metrics & Formulas

### Feed & Area Calculations
```
DMI (Dry Matter Intake) = Σ(ingredientsMSKgPerDay[i])

MS Total = DMI × Period Days × Number of Animals

Area Equivalent = MS Total / Productivity (kg MS/ha/year)
```

### Financial Models
```
Monthly OPEX = Feed Cost + Labor + Energy + Maintenance

Profit Margin = (Revenue - OPEX) / Revenue × 100

ROI = Net Profit / Initial Investment × 100

Payback Period = Initial Investment / (Monthly Profit × 12) months
```

### Circular Metrics
```
Energy Independence = (Solar kWh + Biogas kWh) / Total Demand × 100

Nutrient Recycling = Nutrient output (digestate, compost) / Purchased fertilizer × 100

Waste Valorization = Total waste converted to products / Total waste × 100
```

---

## 🌍 Brazil-Specific Features

### Climate Adaptation (Semi-Arid Northeast)
- **Evaporation management:** Shade cloth recommendations, mulching
- **Water scarcity:** Rainwater harvesting, well depth assessment
- **Seasonal adjustment:** Dry season rotation planning
- **Drought resilience:** Alternative crop selection

### Regulatory Compliance
- **CONAMA:** Environmental standards tracking
- **MAPA:** Agricultural certification pathways
- **ANEEL:** Renewable energy grid connection (solar)
- **ANA:** Water usage monitoring
- **LGPD:** Personal data protection

### Government Program Integration
- **PRONAF:** Low-interest rural credit (Brasília: 2024-2025)
- **BNDES:** Medium-scale farm financing (R$50k-300k)
- **Cooperatives:** Multi-farm coordination tools
- **EMATER:** Local agricultural extension agent network

### Regional Customization
- **Pernambuco/Bahia:** Semi-arid crop calendars
- **São Paulo/Minas Gerais:** Subtropical implementation plans
- **Rio Grande do Sul:** Temperate zone protocols
- **Local suppliers:** Integration with regional hardware networks

---

## 📚 Documentation

- **[Setup Wizard Guide](./docs/SETUP.md)** - 4-step farm configuration
- **[System Planner](./docs/PLANNER.md)** - 16-week implementation roadmap
- **[API Reference](./docs/API.md)** - Gemini 3 tool definitions
- **[Architecture](./docs/ARCHITECTURE.md)** - System design & data flow
- **[Knowledge Hub](./docs/KNOWLEDGE_HUB.md)** - 89+ educational resources

---

## 💡 Use Cases

### Family Farm (Tier 1: 100-1000 m²)
```
Setup: 1 fish tank + 1 coop + garden beds + compost
Investment: R$ 3-10k
Payback: 6-12 months
Monthly production: R$ 150-250 (family food + market surplus)
```

### Small Commercial (Tier 2: 1-5 hectares)
```
Setup: 3 fish tanks + 2 coops + biodigester + solar array
Investment: R$ 20-40k
Payback: 4-8 months
Monthly production: R$ 1,500-3,500 (wholesale markets)
```

### Circular Farm (Tier 3: 5-20 hectares)
```
Setup: Cattle + multiple aquaculture + biogas + sugarcane + crops + solar
Investment: R$ 150-300k
Payback: 6-12 months
Monthly production: R$ 10,000-30,000 (regional export)
```

---

## 🤝 Contributing

Contributions are welcome! Please follow these steps:

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

### Development Guidelines
- Write TypeScript with strict mode
- Add unit tests for new features
- Follow React hooks best practices
- Document Gemini 3 tool usage

---

## 📜 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

---

## 🙏 Acknowledgments

- **EMBRAPA** (Brazilian Agricultural Research) - Sisteminha Embrapa framework
- **Google** - Gemini 3 Pro API and Extended Thinking mode
- **Open-Meteo** - Free weather API
- **Community** - Brazilian farmers and agricultural extension agents

---

## 📞 Contact & Support

- **Email:** [paulo@sisteminha.app](mailto:paulo@sisteminha.app)
- **GitHub Issues:** [Report bugs](https://github.com/PauloTuppy/Sisteminha-EcoFarm/issues)
- **Discussions:** [Ask questions](https://github.com/PauloTuppy/Sisteminha-EcoFarm/discussions)
- **Website:** [sisteminha.app](https://sisteminha.app)

---

## 🚀 Roadmap

### Phase 1 (Q1 2026)
- ✅ MVP with Gemini 3 Marathon Agent
- ✅ Weather + Crop models integration
- ✅ Excel export with verification
- 🔄 Mobile app (React Native)

### Phase 2 (Q2-Q3 2026)
- 📈 ML yield forecasting
- 🌐 Multi-farm benchmarking
- 📊 Marketplace for inputs/outputs
- 🤖 Drone integration

### Phase 3 (Q4 2026+)
- 🔗 Blockchain for certification
- 🌍 International expansion
- 📱 IoT sensor ecosystem
- 💰 DeFi for farmer financing

---

**Made with ❤️ for circular agriculture in Brazil**
