
import React from 'react';
import { RiskLevel } from '../types';

interface RiskGaugeProps {
  level: RiskLevel;
  probability: number;
}

export const RiskGauge: React.FC<RiskGaugeProps> = ({ level, probability }) => {
  const getColors = () => {
    switch (level) {
      case RiskLevel.LOW: return { bg: 'bg-emerald-500/20', text: 'text-emerald-400', border: 'border-emerald-500/50' };
      case RiskLevel.MODERATE: return { bg: 'bg-yellow-500/20', text: 'text-yellow-400', border: 'border-yellow-500/50' };
      case RiskLevel.HIGH: return { bg: 'bg-orange-500/20', text: 'text-orange-400', border: 'border-orange-500/50' };
      case RiskLevel.EXTREME: return { bg: 'bg-red-500/20', text: 'text-red-400', border: 'border-red-500/50' };
      default: return { bg: 'bg-slate-500/20', text: 'text-slate-400', border: 'border-slate-500/50' };
    }
  };

  const colors = getColors();

  return (
    <div className={`relative flex flex-col items-center justify-center p-8 rounded-3xl border-2 ${colors.border} ${colors.bg} transition-all duration-500`}>
      <div className="text-sm font-semibold uppercase tracking-widest text-slate-400 mb-2">Fire Risk Level</div>
      <div className={`text-5xl font-black mb-1 ${colors.text}`}>{level.toUpperCase()}</div>
      <div className="flex items-center gap-2">
        <div className="w-32 h-2 bg-slate-800 rounded-full overflow-hidden">
          <div 
            className={`h-full transition-all duration-1000 ease-out ${level === RiskLevel.EXTREME ? 'bg-red-500' : level === RiskLevel.HIGH ? 'bg-orange-500' : 'bg-emerald-500'}`}
            style={{ width: `${probability}%` }}
          />
        </div>
        <span className="text-slate-400 text-sm font-medium">{probability}% Prob.</span>
      </div>
    </div>
  );
};
