import { GoogleGenAI } from "@google/genai";
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
       Estime o estágio de crescimento e prontidão para colheita.
       Retorne APENAS um JSON válido (sem markdown) com este formato:
       {
         "plantName": "Nome da planta",
         "healthStatus": "Healthy" | "Disease Detected" | "Nutrient Deficiency" | "Unknown",
         "confidence": 0-100,
         "diagnosis": "Breve explicação do problema ou estado",
         "recommendations": ["Ação 1", "Ação 2"],
         "harvestReady": boolean
       }`
    : `Analyze this agricultural image for "Sisteminha Embrapa". 
       Identify the plant.
       Check for pests, diseases, or nutrient deficiencies.
       Estimate growth stage and harvest readiness.
       Return ONLY valid JSON (no markdown) with this format:
       {
         "plantName": "Plant Name",
         "healthStatus": "Healthy" | "Disease Detected" | "Nutrient Deficiency" | "Unknown",
         "confidence": 0-100,
         "diagnosis": "Brief explanation of issue or state",
         "recommendations": ["Action 1", "Action 2"],
         "harvestReady": boolean
       }`;

  try {
    const response = await ai.models.generateContent({
      model: 'gemini-2.5-flash-image',
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
    });

    const text = response.text || '';
    // Clean up markdown code blocks if present
    const jsonString = text.replace(/```json/g, '').replace(/```/g, '').trim();
    
    return JSON.parse(jsonString) as PlantAnalysisResult;
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