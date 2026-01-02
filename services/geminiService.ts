import { GoogleGenAI, Type } from "@google/genai";
import { PlantAnalysisResult } from "../types";

// Initialize the client
// The prompt requires using process.env.API_KEY directly in the constructor
const ai = new GoogleGenAI({ apiKey: process.env.API_KEY || '' });

export const analyzePlantImage = async (base64Image: string, language: 'en' | 'pt'): Promise<PlantAnalysisResult> => {
  if (!process.env.API_KEY) {
    throw new Error("API Key is missing.");
  }

  // Ensure base64 string doesn't contain the header
  const cleanBase64 = base64Image.replace(/^data:image\/(png|jpg|jpeg);base64,/, "");

  const prompt = language === 'pt' 
    ? `Analise esta imagem agrícola para o "Sisteminha Embrapa". 
       Identifique a planta.
       Verifique se há pragas, doenças ou deficiências nutricionais visíveis.
       Estime o estágio de crescimento e prontidão para colheita.`
    : `Analyze this agricultural image for "Sisteminha Embrapa". 
       Identify the plant.
       Check for pests, diseases, or nutrient deficiencies.
       Estimate growth stage and harvest readiness.`;

  try {
    const response = await ai.models.generateContent({
      model: 'gemini-3-flash-preview',
      contents: {
        parts: [
          {
            inlineData: {
              data: cleanBase64,
              mimeType: 'image/jpeg',
            },
          },
          {
            text: prompt,
          },
        ],
      },
      config: {
        responseMimeType: 'application/json',
        responseSchema: {
          type: Type.OBJECT,
          properties: {
            plantName: { type: Type.STRING },
            healthStatus: { 
              type: Type.STRING, 
              enum: ['Healthy', 'Disease Detected', 'Nutrient Deficiency', 'Unknown'] 
            },
            confidence: { type: Type.NUMBER },
            diagnosis: { type: Type.STRING },
            recommendations: { 
              type: Type.ARRAY,
              items: { type: Type.STRING }
            },
            harvestReady: { type: Type.BOOLEAN }
          },
          required: ['plantName', 'healthStatus', 'confidence', 'diagnosis', 'recommendations', 'harvestReady']
        }
      }
    });

    const text = response.text || '{}';
    return JSON.parse(text) as PlantAnalysisResult;
  } catch (error) {
    console.error("Gemini Analysis Error:", error);
    // Fallback error result
    return {
      plantName: "Unknown",
      healthStatus: "Unknown",
      confidence: 0,
      diagnosis: "Could not analyze image. Please try again.",
      recommendations: ["Ensure good lighting", "Focus clearly on the leaf"],
      harvestReady: false
    };
  }
};