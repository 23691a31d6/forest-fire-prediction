
import React, { useState, useEffect, useCallback } from 'react';
import { Flame, Wind, Droplets, Thermometer, Info, RefreshCw, AlertTriangle, ShieldCheck } from 'lucide-react';
import { WeatherData, PredictionResult, RiskLevel, HistoricalDataPoint } from './types';
import { RiskGauge } from './components/RiskGauge';
import { HistoricalChart } from './components/HistoricalChart';
import { predictFireRisk } from './services/geminiService';

const INITIAL_WEATHER: WeatherData = {
  temperature: 28,
  humidity: 45,
  windSpeed: 15,
  rainfall: 0,
  ffmc: 85,
  dmc: 30,
  dc: 150
};

const MOCK_HISTORY: HistoricalDataPoint[] = [
  { date: 'Mon', riskValue: 45 },
  { date: 'Tue', riskValue: 52 },
  { date: 'Wed', riskValue: 48 },
  { date: 'Thu', riskValue: 65 },
  { date: 'Fri', riskValue: 70 },
  { date: 'Sat', riskValue: 82 },
  { date: 'Sun', riskValue: 88 },
];

const App: React.FC = () => {
  const [weather, setWeather] = useState<WeatherData>(INITIAL_WEATHER);
  const [prediction, setPrediction] = useState<PredictionResult | null>(null);
  const [loading, setLoading] = useState(false);
  const [history] = useState<HistoricalDataPoint[]>(MOCK_HISTORY);

  const handlePredict = useCallback(async () => {
    setLoading(true);
    try {
      const result = await predictFireRisk(weather);
      setPrediction(result);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  }, [weather]);

  useEffect(() => {
    handlePredict();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const updateField = (field: keyof WeatherData, value: number) => {
    setWeather(prev => ({ ...prev, [field]: value }));
  };

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 p-4 md:p-8">
      <header className="max-w-7xl mx-auto flex flex-col md:flex-row md:items-center justify-between gap-4 mb-8">
        <div>
          <h1 className="text-3xl font-bold flex items-center gap-3">
            <Flame className="text-orange-500 w-8 h-8" />
            <span>PyroGuard <span className="text-orange-500">AI</span></span>
          </h1>
          <p className="text-slate-400 mt-1">Intelligent Wildfire Risk Assessment & Forecasting</p>
        </div>
        <div className="flex gap-2">
          <button 
            onClick={handlePredict}
            disabled={loading}
            className="px-6 py-2.5 bg-orange-600 hover:bg-orange-500 disabled:bg-slate-800 disabled:text-slate-500 rounded-xl font-semibold transition-all flex items-center gap-2"
          >
            {loading ? <RefreshCw className="animate-spin w-4 h-4" /> : <RefreshCw className="w-4 h-4" />}
            Refresh Prediction
          </button>
        </div>
      </header>

      <main className="max-w-7xl mx-auto grid grid-cols-1 lg:grid-cols-12 gap-8">
        {/* Input Section */}
        <section className="lg:col-span-4 space-y-6">
          <div className="bg-slate-900/50 border border-slate-800 p-6 rounded-3xl">
            <h2 className="text-xl font-bold mb-6 flex items-center gap-2">
              <Thermometer className="text-blue-400" />
              Environmental Parameters
            </h2>
            
            <div className="space-y-6">
              <InputSlider 
                label="Temperature (°C)" 
                value={weather.temperature} 
                min={0} max={50} 
                onChange={(val) => updateField('temperature', val)}
                icon={<Thermometer className="w-4 h-4 text-orange-400" />}
              />
              <InputSlider 
                label="Humidity (%)" 
                value={weather.humidity} 
                min={0} max={100} 
                onChange={(val) => updateField('humidity', val)}
                icon={<Droplets className="w-4 h-4 text-blue-400" />}
              />
              <InputSlider 
                label="Wind Speed (km/h)" 
                value={weather.windSpeed} 
                min={0} max={120} 
                onChange={(val) => updateField('windSpeed', val)}
                icon={<Wind className="w-4 h-4 text-slate-400" />}
              />
              <InputSlider 
                label="Rainfall (mm)" 
                value={weather.rainfall} 
                min={0} max={100} 
                onChange={(val) => updateField('rainfall', val)}
                icon={<Droplets className="w-4 h-4 text-cyan-400" />}
              />
              
              <div className="pt-4 border-t border-slate-800">
                <h3 className="text-sm font-bold text-slate-500 mb-4 uppercase tracking-tighter">FWI Components</h3>
                <div className="grid grid-cols-1 gap-4">
                  <InputSlider label="FFMC" value={weather.ffmc} min={0} max={101} onChange={(val) => updateField('ffmc', val)} />
                  <InputSlider label="DMC" value={weather.dmc} min={0} max={200} onChange={(val) => updateField('dmc', val)} />
                  <InputSlider label="DC" value={weather.dc} min={0} max={800} onChange={(val) => updateField('dc', val)} />
                </div>
              </div>
            </div>
          </div>

          <div className="bg-orange-900/10 border border-orange-900/30 p-4 rounded-2xl flex gap-3 items-start">
            <Info className="text-orange-500 w-5 h-5 shrink-0 mt-0.5" />
            <p className="text-xs text-orange-200/70 leading-relaxed">
              <strong>Fine Fuel Moisture Code (FFMC)</strong> represents fuel moisture in surface litter. Higher values indicate drier fuel and higher ignition risk.
            </p>
          </div>
        </section>

        {/* Prediction Display */}
        <section className="lg:col-span-8 space-y-8">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            {prediction && (
              <RiskGauge 
                level={prediction.riskLevel} 
                probability={prediction.probability} 
              />
            )}
            <HistoricalChart data={history} />
          </div>

          {prediction && (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              {/* Analysis Reasoning */}
              <div className="bg-slate-900/50 border border-slate-800 p-8 rounded-3xl relative overflow-hidden group">
                <div className="absolute top-0 right-0 p-4 opacity-10 group-hover:opacity-20 transition-opacity">
                  <AlertTriangle className="w-24 h-24 text-orange-500" />
                </div>
                <h3 className="text-xl font-bold mb-4 flex items-center gap-2 text-orange-400">
                  <AlertTriangle className="w-5 h-5" />
                  AI Reasoning
                </h3>
                <p className="text-slate-300 leading-relaxed italic">
                  "{prediction.reasoning}"
                </p>
                <div className="mt-6 flex items-center gap-4">
                  <div className="bg-slate-800 rounded-lg p-3">
                    <div className="text-xs text-slate-500 uppercase font-bold">Spread Index</div>
                    <div className="text-2xl font-black text-white">{prediction.spreadIndex}/100</div>
                  </div>
                </div>
              </div>

              {/* Recommendations */}
              <div className="bg-slate-900/50 border border-slate-800 p-8 rounded-3xl">
                <h3 className="text-xl font-bold mb-4 flex items-center gap-2 text-emerald-400">
                  <ShieldCheck className="w-5 h-5" />
                  Safety Measures
                </h3>
                <ul className="space-y-3">
                  {prediction.recommendations.map((rec, i) => (
                    <li key={i} className="flex items-start gap-3 text-slate-300">
                      <div className="w-1.5 h-1.5 rounded-full bg-emerald-500 mt-2 shrink-0" />
                      <span>{rec}</span>
                    </li>
                  ))}
                </ul>
              </div>
            </div>
          )}

          {!prediction && !loading && (
            <div className="flex flex-col items-center justify-center py-20 text-slate-500">
              <Flame className="w-16 h-16 mb-4 opacity-20" />
              <p>Adjust parameters and click refresh for a new assessment</p>
            </div>
          )}

          {loading && (
            <div className="flex flex-col items-center justify-center py-20">
              <RefreshCw className="w-12 h-12 mb-4 animate-spin text-orange-500" />
              <p className="text-slate-400 animate-pulse">Gemini AI is analyzing environmental data...</p>
            </div>
          )}
        </section>
      </main>

      <footer className="max-w-7xl mx-auto mt-20 pt-8 border-t border-slate-900 text-center text-slate-500 text-sm">
        <p>&copy; 2024 PyroGuard AI. For educational and demonstrative purposes only.</p>
      </footer>
    </div>
  );
};

interface InputSliderProps {
  label: string;
  value: number;
  min: number;
  max: number;
  onChange: (val: number) => void;
  icon?: React.ReactNode;
}

const InputSlider: React.FC<InputSliderProps> = ({ label, value, min, max, onChange, icon }) => {
  return (
    <div className="space-y-2">
      <div className="flex justify-between items-center">
        <label className="text-xs font-bold text-slate-400 uppercase tracking-wider flex items-center gap-2">
          {icon}
          {label}
        </label>
        <span className="text-sm font-mono text-slate-200 bg-slate-800 px-2 py-0.5 rounded border border-slate-700">
          {value}
        </span>
      </div>
      <input 
        type="range" 
        min={min} 
        max={max} 
        value={value} 
        onChange={(e) => onChange(Number(e.target.value))}
        className="w-full h-1.5 bg-slate-800 rounded-lg appearance-none cursor-pointer accent-orange-500 hover:accent-orange-400 transition-all"
      />
    </div>
  );
};

export default App;
