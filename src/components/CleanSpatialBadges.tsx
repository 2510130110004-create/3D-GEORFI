import React from 'react';
import { MeteorologicalState } from '../types/geography';
import { Wind } from 'lucide-react';

interface CleanSpatialBadgesProps {
  meteoState: MeteorologicalState;
}

/**
 * Minimalist, crystal-clear spatial badges pinned directly over Land and Sea.
 * Designed so any student instantly understands the temperature, pressure,
 * and resulting wind direction with zero confusion.
 */
export const CleanSpatialBadges: React.FC<CleanSpatialBadgesProps> = ({ meteoState }) => {
  const isSeaBreeze = meteoState.windType === 'sea_breeze';
  const isLandBreeze = meteoState.windType === 'land_breeze';
  const isLandWarmer = meteoState.landTempC > meteoState.seaTempC;

  return (
    <div className="pointer-events-none absolute inset-0 z-10 overflow-hidden font-sans select-none">
      {/* 1. BADGE DARATAN (Left Side) */}
      <div className="absolute top-[22%] sm:top-[28%] left-[16%] sm:left-[22%] -translate-x-1/2 bg-slate-950/90 border border-slate-700/80 rounded-xl p-2 sm:p-2.5 shadow-2xl backdrop-blur-md min-w-[120px] sm:min-w-[145px]">
        <div className="flex items-center gap-1.5 font-bold text-xs sm:text-sm text-emerald-400 mb-1">
          <span>🏝️ DARATAN</span>
        </div>
        <div className="space-y-0.5 text-[10px] sm:text-[11px]">
          <div className="flex justify-between text-slate-300">
            <span>Suhu:</span>
            <strong className={`font-mono ${isLandWarmer ? 'text-amber-400' : 'text-cyan-300'}`}>
              {meteoState.landTempC}°C ({isLandWarmer ? 'Panas' : 'Dingin'})
            </strong>
          </div>
          <div className="flex justify-between text-slate-300">
            <span>Tekanan:</span>
            <strong className="font-mono text-white">
              {meteoState.landPressureHpa} hPa ({isLandWarmer ? 'Rendah / L' : 'Tinggi / H'})
            </strong>
          </div>
        </div>
      </div>

      {/* 2. BADGE LAUTAN (Right Side) */}
      <div className="absolute top-[22%] sm:top-[28%] right-[16%] sm:right-[22%] translate-x-1/2 bg-slate-950/90 border border-slate-700/80 rounded-xl p-2 sm:p-2.5 shadow-2xl backdrop-blur-md min-w-[120px] sm:min-w-[145px]">
        <div className="flex items-center gap-1.5 font-bold text-xs sm:text-sm text-cyan-400 mb-1">
          <span>🌊 LAUTAN</span>
        </div>
        <div className="space-y-0.5 text-[10px] sm:text-[11px]">
          <div className="flex justify-between text-slate-300">
            <span>Suhu:</span>
            <strong className={`font-mono ${!isLandWarmer ? 'text-amber-400' : 'text-cyan-300'}`}>
              {meteoState.seaTempC}°C ({!isLandWarmer ? 'Hangat' : 'Sejuk'})
            </strong>
          </div>
          <div className="flex justify-between text-slate-300">
            <span>Tekanan:</span>
            <strong className="font-mono text-white">
              {meteoState.seaPressureHpa} hPa ({!isLandWarmer ? 'Rendah / L' : 'Tinggi / H'})
            </strong>
          </div>
        </div>
      </div>

      {/* 3. CENTER WIND DIRECTION PILL (Coastline Center) */}
      <div className="absolute top-[48%] sm:top-[52%] left-1/2 -translate-x-1/2 bg-slate-900/95 border-2 border-cyan-400/80 rounded-full px-3.5 sm:px-5 py-1 sm:py-1.5 shadow-2xl backdrop-blur-md flex items-center gap-2">
        <Wind className={`w-3.5 h-3.5 sm:w-4 sm:h-4 animate-pulse ${
          isSeaBreeze ? 'text-cyan-400' : isLandBreeze ? 'text-emerald-400' : 'text-slate-400'
        }`} />
        <div className="text-center">
          <span className="text-[11px] sm:text-xs font-bold text-white tracking-wide">
            {isSeaBreeze && '💨 ANGIN LAUT (Bertiup: Laut → Darat)'}
            {isLandBreeze && '💨 ANGIN DARAT (Bertiup: Darat → Laut)'}
            {!isSeaBreeze && !isLandBreeze && '⚖️ ANGIN TENANG (Masa Peralihan)'}
          </span>
        </div>
      </div>
    </div>
  );
};
