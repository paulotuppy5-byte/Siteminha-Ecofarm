# Sisteminha EcoFarm

A smart farming assistant for the Sisteminha Embrapa integrated food production system. Features plant analysis via Gemini AI, crop planning, and educational resources for small-scale farmers.

## Features

- **Dashboard**: Monitor your farm units (Water, Animals, Plants, Waste, Energy).
- **Camera Analyzer**: Identify plants and diagnose diseases using AI.
- **Planner**: Manage tasks and budgets for implementation phases.
- **Education**: Access expert resources and guides.
- **Advisor**: Chat with the EcoFarm AI Agent.

## 🤖 EcoFarm AI Agent - What You Can Ask

The **EcoFarm Agent** is powered by Gemini 2.5 Flash Image and provides expert guidance on integrated farming systems. It uses extended thinking to analyze your farm data and provide actionable recommendations.

### ✅ Supported Question Categories

#### 1. **Aquaculture & Fish Farming**
Get expert advice on tilapia and other fish species management:

- **Water quality parameters**: "What are the ideal water parameters for tilapia?"
  - Returns: Temperature (27-31°C), pH (6.5-8.5), dissolved oxygen (>5.0 mg/L), ammonia, nitrite, nitrate levels
  
- **Feeding management**: "How much should I feed my fish daily?"
  - Calculates based on: Total biomass, body weight percentage (1-3%), feeding frequency
  
- **Disease detection**: "How can I detect diseases using the camera?"
  - Provides visual inspection guide: spots, behavior, fins, eyes, action steps
  
- **Stocking density**, **production cycles** (90 days), **stress indicators**, **biological filtration**

#### 2. **Composting & Nutrient Cycling**
Turn waste into valuable fertilizer:

- **Fish waste composting**: "How do I compost fish waste?"
  - Step-by-step process, C:N ratios, duration (45-90 days)
  - Offers ROI comparison: homemade compost vs. chemical fertilizers
  
- **Material proportions** (greens vs. browns)
- **Pile temperature** (50-65°C optimal)
- **Moisture management** (wrung sponge consistency)
- **Turning schedule** and **health indicators**

#### 3. **Irrigation & Water Management**
Smart irrigation decisions based on real-time weather data:

- **Irrigation timing**: "Should I irrigate today?"
  - Analyzes: Current soil moisture, weather forecast, evapotranspiration
  - Returns: Yes/no recommendation, cost estimate, yield protection benefit
  
- **Crop-specific watering**: "When should I water my corn?"
- **Best irrigation times** and **water volume per hectare**

#### 4. **Financial Analysis & ROI**
Make data-driven investment decisions:

- **Profit margins**: "What's my profit margin this month?"
  - Returns: Monthly OPEX, projected revenue, net profit, percentage margins
  - Breakdown by production unit (fish, vegetables, eggs)
  
- **Harvest revenue**: "How much will I earn from tilapia harvest?"
- **Investment analysis**: "Is a biodigester worth it?"
- **Payback periods** and **comparative ROI** calculations

#### 5. **Crop Management**
Complete planting and cultivation guidance:

- **Planting calendars** (staggered scheduling)
- **Plant spacing** and **companion planting** recommendations
- **Organic fertilization** with homemade compost
- **Pest and disease control** strategies
- **Crop rotation** (maize-bean cycles)

#### 6. **Poultry Management**
Raise chickens for eggs and meat:

- **Daily feed requirements**
- **Expected egg production** rates
- **Coop management** best practices
- **Manure utilization** for composting
- **Suitable breeds** for semi-arid climates

#### 7. **Weather & Climate Integration**
Real-time weather API integration:

- **7-day forecasts**: "Will it rain this week?"
- **Temperature and humidity** monitoring
- **Extreme weather alerts**
- **Climate impact** on production
- **Weather-based recommendations**

#### 8. **System Setup & Implementation**
Step-by-step guidance for building your Sisteminha:

- **Tank construction**: "How do I build a 1000L tank?"
- **Component sizing** and **Bill of Materials (BOM)**
- **Cost estimates** (R$ 2,230 for Tier 1 system)
- **4-week implementation phases**
- **Common troubleshooting**

#### 9. **Solar Energy & Biodigestion**
Renewable energy integration:

- **Regional solar potential** analysis
- **Panel sizing** calculations
- **Animal manure biodigestion**
- **Biogas production** estimates
- **Energy cost savings**

#### 10. **Location-Specific Recommendations**
The agent adapts answers based on your location:

- **Jatobá, PE** (semi-arid): Drought-resistant strategies
- **Salvador, BA** (tropical humid): Different crop recommendations
- **Regional climate data**: Temperature, rainfall, solar irradiance
- **Local EMATER** extension office contacts

---

### 🎯 Agent Special Capabilities

#### **Extended Thinking Mode**
- Uses Gemini 3 Pro's advanced reasoning for multi-step analysis
- Only provides recommendations with >75% confidence threshold
- Shows reasoning chain for transparency

#### **Multi-Tool Integration**
The agent orchestrates multiple data sources:
- `weather_api` - Real-time meteorological data (INMET + OpenMeteo)
- `crop_models` - EMBRAPA-validated growth models
- `soil_db` - Historical soil and yield database
- `excel_gen` - Financial report generation

#### **Automated Verification**
- Validates recommendations against scientific databases
- Cites sources (EMBRAPA, FAO, peer-reviewed studies)
- Session tracking for conversation continuity

#### **Natural Language**
- Responds in **Brazilian Portuguese**
- Conversational and educational tone
- Adapts complexity to user's context

---

### 💬 Example Interactions

**User**: "Quais são os melhores parâmetros de água para criar tilápias?"

**Agent Response**:
> "Para tilápias no Sisteminha, o ideal é temperatura entre 27-31°C, pH entre 6.5 e 8.5, e oxigênio dissolvido acima de 5.0 mg/L. Recomendo medir a amônia semanalmente."

## Technical Architecture

Built with React, TypeScript, and Tailwind CSS.
