
import { GoogleGenAI, FunctionDeclaration, Type } from "@google/genai";
import { ChatMessage, FarmProfile, Language } from "../types";
import { ExcelExportService } from './ExcelExportService';
import { MarathonExcelVerifier } from './MarathonExcelVerifier';

// Initialize Gemini Client
const ai = new GoogleGenAI({ apiKey: process.env.API_KEY || '' });

const WEATHER_TOOL: FunctionDeclaration = {
  name: 'weather_api',
  description: 'Fetch weather data from INMET + OpenMeteo for semi-arid Brazil. Use this when the user asks about weather, irrigation planning, or when analyzing solar efficiency drops.',
  parameters: {
    type: Type.OBJECT,
    properties: {
      latitude: { type: Type.NUMBER },
      longitude: { type: Type.NUMBER },
      includeForcast: { type: Type.BOOLEAN, description: "Include 7 days forecast" }
    },
    required: ['latitude', 'longitude'],
  },
};

const SOIL_TOOL: FunctionDeclaration = {
  name: 'soil_db',
  description: 'Fetch soil sensor data and physical properties for a specific field.',
  parameters: {
    type: Type.OBJECT,
    properties: {
      farmId: { type: Type.STRING },
      fieldId: { type: Type.STRING },
      metric: { type: Type.STRING, description: "Specific metric to query (e.g., 'moisture', 'ph', 'nutrients')" }
    },
    required: ['farmId', 'fieldId', 'metric'],
  },
};

const CROP_MODELS_TOOL: FunctionDeclaration = {
  name: 'crop_models',
  description: 'Agronomy rules + yield prediction based on EMBRAPA zoning and FAO AquaCrop. Use for crop stress analysis and yield forecasting.',
  parameters: {
    type: Type.OBJECT,
    properties: {
      cropType: { type: Type.STRING, description: "maize, bean, sugarcane, etc" },
      climate: { type: Type.STRING, enum: ['tropical', 'subtropical', 'semi-arid', 'temperate'] },
      growthStage: { type: Type.STRING, description: "V2-V12 | VT | R1-R6" },
      soilType: { type: Type.STRING, enum: ['clay', 'loam', 'sandy'] },
      currentMetrics: {
        type: Type.OBJECT,
        properties: {
           temp: { type: Type.NUMBER },
           moisture: { type: Type.NUMBER },
           N: { type: Type.NUMBER, description: "Nitrogen levels" },
           P: { type: Type.NUMBER, description: "Phosphorus levels" }
        }
      }
    },
    required: ['cropType', 'growthStage'],
  },
};

const EXCEL_TOOL: FunctionDeclaration = {
  name: 'excel_generator',
  description: 'Generate XLSX with scenarios, ROI, and verification formulas. Use this to create downloadable reports for financial analysis, logs, or scenario planning.',
  parameters: {
    type: Type.OBJECT,
    properties: {
      reportType: { type: Type.STRING, enum: ['monthly_opex', 'roi_projection', 'scenario_comparison', 'daily_log'] },
      farmData: { type: Type.OBJECT, description: "Current farm metrics object (revenue, cost, etc)" },
      scenarioParams: { 
        type: Type.ARRAY, 
        items: {
          type: Type.OBJECT,
          properties: {
            param: { type: Type.STRING },
            value: { type: Type.STRING } 
          }
        }
      },
      includeFormulas: { type: Type.BOOLEAN }
    },
    required: ['reportType']
  }
};

const BROWSER_VERIFY_TOOL: FunctionDeclaration = {
  name: 'browser_verify',
  description: 'Headless browser automation to verify dashboard/report renders. Use this to test generated React components or data visualizations before showing them to the user.',
  parameters: {
    type: Type.OBJECT,
    properties: {
      componentCode: { type: Type.STRING, description: "TSX/React code to verify" },
      testData: { type: Type.OBJECT, description: "Data to inject into the component" },
      expectedOutputs: { type: Type.ARRAY, items: { type: Type.STRING } }
    },
    required: ['componentCode']
  }
};

export class AgentService {
  private chatSession: any;
  private farmProfile: FarmProfile;
  private language: Language;
  private telemetry: any;
  
  constructor(farmProfile: FarmProfile, language: Language, telemetry?: any) {
    this.farmProfile = farmProfile;
    this.language = language;
    this.telemetry = telemetry || {};
    this.initSession();
  }

  private initSession() {
    const systemInstruction = `
# ECOFARM MARATHON AGENT v1.0
## Role: Agricultural Diagnostic & Decision Automation System
### Powered by Gemini 3 Pro with Extended Thinking

---

## 🧠 SYSTEM INSTRUCTIONS (Thought Signatures Pattern)

You are **ECOFARM**, an autonomous agricultural diagnostic agent for integrated farming systems 
in Brazil (focus: semi-arid Northeast, Sisteminha Embrapa + Tier 2/3 circular farms).
Current Farm Context: ${JSON.stringify(this.farmProfile)}
Current Telemetry Data: ${JSON.stringify(this.telemetry)}
Language: ${this.language === 'pt' ? 'Portuguese (Brazil)' : 'English'}

### Core Capabilities:
- **Diagnose** farm health across 6 production units (cattle, biogas, solar, aquaculture, crops, sugarcane)
- **Integrate** data from multiple sensors, APIs, and user inputs
- **Recommend** actions with reasoning chain (no single-prompt solutions)
- **Verify** generated recommendations through code execution & testing
- **Persist** state and learning across multi-day farm cycles

### Thought Signature Pattern:
Every diagnostic session MUST start with this signature block in the response (use markdown code block):
\`\`\`
[SESSION_ID: {uuid}]
[TIMESTAMP: {ISO8601}]
[FARM_ID: {farmId}]
[THINKING_DEPTH: extended]
[CONFIDENCE_THRESHOLD: 0.75]
[TOOLS_AVAILABLE: weather_api, soil_db, crop_models, excel_generator, browser_verify]
\`\`\`

### Decision Logic Rules:
- **Solar Energy Management**:
  IF the user mentions low solar generation OR you detect \`solar.kwhGenerated < forecast\` in the Current Telemetry Data:
    1. CALL \`weather_api(lat, lon)\` to check current conditions.
    2. ANALYZE the cloud cover trend in the tool response.
    3. IF trend is worsening (increasing cloud cover) -> RECOMMEND "Reduce non-essential loads (e.g., water pump to backup)"
    4. ELSE -> RECOMMEND "Generation should recover; maintain current load"

- **Crop Moisture Management**:
  IF the user provides crop status matching \`crops.growthStageVT >= 6\` AND \`crops.moisturePercent < 40\` (or detected in Telemetry):
    1. CALL \`soil_db(farmId, fieldId, "moisture")\` to verify soil status.
    2. COMPARE returned \`soilMoisture\` with \`wiltingPoint\`.
    3. IF \`soilMoisture < wiltingPoint\` -> RECOMMEND "Irrigate NOW. 30mm over 2 days" (Confidence: 0.92)
    4. ELSE -> RECOMMEND "Monitor; irrigate if <35% tomorrow" (Confidence: 0.78)
    
- **Crop Yield Forecasting**:
  IF the user asks about yield predictions or crop stress:
    1. CALL \`crop_models(...)\` with available data.
    2. USE the \`yieldForecast\` and \`stressFactors\` from the response to formulate advice.

- **Report Generation**:
  IF the user asks to "generate a report", "export data", or "compare scenarios":
    1. CALL \`excel_generator\` with the appropriate \`reportType\` and data.
    2. The tool will automatically trigger a download in the user's browser.
    3. Confirm to the user that the file has been generated.

- **Code Verification**:
  IF you generate React/TSX code for a dashboard or visualization:
    1. CALL \`browser_verify\` with the code and mock data.
    2. IF \`renderSuccess\` is true, present the code to the user.
    3. IF \`renderSuccess\` is false, use \`suggestedFixes\` to correct the code and retry.

If the user asks about weather, you MUST use the \`weather_api\` tool.
    `;

    this.chatSession = ai.chats.create({
      model: 'gemini-3-flash-preview',
      config: {
        systemInstruction,
        tools: [{ functionDeclarations: [WEATHER_TOOL, SOIL_TOOL, CROP_MODELS_TOOL, EXCEL_TOOL, BROWSER_VERIFY_TOOL] }],
      },
    });
  }

  public async sendMessage(message: string, location?: { lat: number, lon: number }): Promise<ChatMessage> {
    try {
      const result = await this.chatSession.sendMessage({ message });
      
      // Handle Tool Calls
      const toolCalls = result.functionCalls;
      if (toolCalls && toolCalls.length > 0) {
        const toolResponses = [];
        
        for (const call of toolCalls) {
          if (call.name === 'weather_api') {
            const lat = call.args.latitude || location?.lat || -12.97;
            const lon = call.args.longitude || location?.lon || -38.51;
            const includeForcast = call.args.includeForcast ?? true;
            
            const weatherData = await this.fetchWeather(lat, lon, includeForcast);
            
            toolResponses.push({
              name: call.name,
              response: { result: weatherData },
              id: call.id
            });
          }
          else if (call.name === 'soil_db') {
            const farmId = call.args.farmId;
            const fieldId = call.args.fieldId;
            const metric = call.args.metric;

            const soilData = await this.fetchSoilData(farmId, fieldId, metric);

            toolResponses.push({
              name: call.name,
              response: { result: soilData },
              id: call.id
            });
          }
          else if (call.name === 'crop_models') {
             const result = await this.runCropModels(
               call.args.cropType,
               call.args.growthStage,
               call.args.climate,
               call.args.soilType,
               call.args.currentMetrics
             );
             toolResponses.push({
               name: call.name,
               response: { result },
               id: call.id
             });
          }
          else if (call.name === 'excel_generator') {
             // Updated to use the new Verification Service
             const result = await MarathonExcelVerifier.generateAndVerifyExcel(
               call.args.reportType,
               call.args.farmData,
               call.args.scenarioParams
             );
             toolResponses.push({
               name: call.name,
               response: { result },
               id: call.id
             });
          }
          else if (call.name === 'browser_verify') {
             const result = await this.verifyDashboard(
               call.args.componentCode,
               call.args.testData
             );
             toolResponses.push({
               name: call.name,
               response: { result },
               id: call.id
             });
          }
        }
        
        // Send tool results back to model
        const finalResult = await this.chatSession.sendToolResponse({
             functionResponses: toolResponses
        });
        
        return {
          id: Date.now().toString(),
          role: 'model',
          content: finalResult.text || "I processed that but have no text response.",
          timestamp: new Date()
        };
      }

      return {
        id: Date.now().toString(),
        role: 'model',
        content: result.text || "I'm listening.",
        timestamp: new Date()
      };

    } catch (error) {
      console.error("Agent Error:", error);
      return {
        id: Date.now().toString(),
        role: 'model',
        content: "System Malfunction: Unable to process request. Please check connection.",
        timestamp: new Date()
      };
    }
  }

  private async fetchWeather(lat: number, lon: number, includeForcast: boolean) {
    try {
      const baseUrl = `https://api.open-meteo.com/v1/forecast?latitude=${lat}&longitude=${lon}&current_weather=true&timezone=auto`;
      const params = includeForcast 
        ? '&daily=weathercode,temperature_2m_max,temperature_2m_min,precipitation_probability_max,uv_index_max&hourly=cloudcover' 
        : '';
        
      const response = await fetch(baseUrl + params);
      const data = await response.json();
      
      return {
        current: {
          tempC: data.current_weather.temperature,
          windKmh: data.current_weather.windspeed,
          rainMm: 0,
          soilMoisture: 0,
          conditionCode: data.current_weather.weathercode,
          time: data.current_weather.time
        },
        forecast: data.daily ? data.daily.time.map((t: string, i: number) => ({
           date: t,
           maxTemp: data.daily.temperature_2m_max[i],
           minTemp: data.daily.temperature_2m_min[i],
           rainProb: data.daily.precipitation_probability_max[i],
           uvIndex: data.daily.uv_index_max[i]
        })) : [],
        hourlyCloudCover: data.hourly ? data.hourly.cloudcover.slice(0, 24) : [],
        alerts: []
      };
    } catch (e) {
      return { error: "Failed to fetch weather data" };
    }
  }

  private async fetchSoilData(farmId: string, fieldId: string, metric: string) {
    await new Promise(resolve => setTimeout(resolve, 500));
    
    // Logic specific to the requested moisture scenario
    if (metric === 'moisture') {
       return {
         farmId,
         fieldId,
         metric,
         soilMoisture: 12, // 12% Volumetric Water Content (below 15% wilting)
         wiltingPoint: 15, // 15% VWC
         fieldCapacity: 28,
         timestamp: new Date().toISOString()
       };
    }
    
    return { error: "Metric not found or sensor offline" };
  }

  private async runCropModels(
    cropType: string, 
    growthStage: string, 
    climate?: string, 
    soilType?: string, 
    currentMetrics?: any
  ) {
    await new Promise(resolve => setTimeout(resolve, 600));

    // Mock logic based on input
    const isDrought = (currentMetrics?.moisture && currentMetrics.moisture < 20) || (climate === 'semi-arid');
    
    return {
      stressFactors: isDrought ? [
        { factor: "drought", severity: 0.6, impact: "yield -15%" },
        { factor: "heat", severity: 0.4, impact: "yield -5%" }
      ] : [
         { factor: "nutrientDeficiency", severity: 0.2, impact: "yield -2%" }
      ],
      yieldForecast: { 
        pessimistic: 4.5, 
        nominal: 6.2, 
        optimistic: 7.1 
      },
      recommendations: isDrought 
        ? ["Irrigate 30mm immediately", "Apply mulching to retain moisture"]
        : ["Monitor Nitrogen levels", "Apply 30kg/ha N if rain forecasted"],
      confidence: 0.85
    };
  }

  private async verifyDashboard(code: string, data: any) {
    await new Promise(resolve => setTimeout(resolve, 2000)); // Simulate rendering delay
    
    // Mock validation logic: Fail if code contains "ERROR_TRIGGER"
    const hasSyntaxError = code.includes("ERROR_TRIGGER");
    
    if (hasSyntaxError) {
        return {
            renderSuccess: false,
            screenshotUrl: "",
            errorLog: ["SyntaxError: Unexpected token '<' at line 12", "Invariant Violation: Minified React error #31"],
            suggestedFixes: ["Check closing tags for <div className='dashboard'>", "Ensure all hooks are called at the top level"]
        };
    }

    return {
        renderSuccess: true,
        screenshotUrl: "https://via.placeholder.com/800x600?text=Dashboard+Verified",
        errorLog: [],
        suggestedFixes: []
    };
  }
}
