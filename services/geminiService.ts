
import { GoogleGenAI, Type } from "@google/genai";
import { WeatherData, PredictionResult, RiskLevel } from "../types";

const ai = new GoogleGenAI({ apiKey: process.env.API_KEY || "" });

export const predictFireRisk = async (data: WeatherData): Promise<PredictionResult> => {
  const prompt = `Analyze the following forest weather data and provide a wildfire risk assessment:
    - Temperature: ${data.temperature}°C
    - Relative Humidity: ${data.humidity}%
    - Wind Speed: ${data.windSpeed} km/h
    - Rainfall (24h): ${data.rainfall} mm
    - FFMC (Fine Fuel Moisture Code): ${data.ffmc}
    - DMC (Duff Moisture Code): ${data.dmc}
    - DC (Drought Code): ${data.dc}

    Act as a professional fire behavior scientist. Provide a detailed risk assessment including probability, reasoning, and specific safety recommendations for forest management or residents.`;

  const response = await ai.models.generateContent({
    model: 'gemini-3-pro-preview',
    contents: prompt,
    config: {
      responseMimeType: "application/json",
      responseSchema: {
        type: Type.OBJECT,
        properties: {
          riskLevel: {
            type: Type.STRING,
            description: "One of: Low, Moderate, High, Extreme",
          },
          probability: {
            type: Type.NUMBER,
            description: "Percentage probability of fire ignition (0-100)",
          },
          reasoning: {
            type: Type.STRING,
            description: "Detailed scientific reasoning for the risk level",
          },
          recommendations: {
            type: Type.ARRAY,
            items: { type: Type.STRING },
            description: "Safety and prevention steps",
          },
          spreadIndex: {
            type: Type.NUMBER,
            description: "Projected spread index based on wind and fuel (0-100)",
          },
        },
        required: ["riskLevel", "probability", "reasoning", "recommendations", "spreadIndex"],
      },
    },
  });

  try {
    const result = JSON.parse(response.text);
    return result as PredictionResult;
  } catch (error) {
    console.error("Failed to parse Gemini response:", error);
    // Fallback if parsing fails
    return {
      riskLevel: RiskLevel.MODERATE,
      probability: 50,
      reasoning: "Analysis interrupted. Standard moderate caution advised.",
      recommendations: ["Stay alert for local weather updates."],
      spreadIndex: 40
    };
  }
};
