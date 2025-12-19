
export enum RiskLevel {
  LOW = 'Low',
  MODERATE = 'Moderate',
  HIGH = 'High',
  EXTREME = 'Extreme'
}

export interface WeatherData {
  temperature: number; // Celsius
  humidity: number; // Percentage
  windSpeed: number; // km/h
  rainfall: number; // mm
  ffmc: number; // Fine Fuel Moisture Code
  dmc: number; // Duff Moisture Code
  dc: number; // Drought Code
}

export interface PredictionResult {
  riskLevel: RiskLevel;
  probability: number;
  reasoning: string;
  recommendations: string[];
  spreadIndex: number; // 0-100
}

export interface HistoricalDataPoint {
  date: string;
  riskValue: number;
}
