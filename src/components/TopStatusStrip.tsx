import React from 'react';
import { MeteorologicalState } from '../types/geography';
import { Wind, ArrowRight } from 'lucide-react';

interface TopStatusStripProps {
  meteoState: MeteorologicalState;
}

/**
 * Ultra-slim, docked top status strip:
 * Positioned cleanly outside the 3D canvas so NO menus ever cover the 3D objects!
 */
export const TopStatusStrip: React.FC<TopStatusStripProps> = ({ meteoState }) => {
  const isSeaBreeze = meteoState.windType === 'sea_breeze';
  const isLandBreeze = meteoState.windType === 'land_breeze';
  const isLandWarmer = meteoState.landTempC > meteoState.seaTempC;

  return (
    <div className="h-10 shrink-0 bg-slate-950/90 border-b border-slate-800/80 px-3 sm:px-6 flex items-center justify-between text-xs select-none z-20">
      {/* 1. Status Daratan */}
      <div className="flex items-center gap-1.5 sm:gap-2">
        <span className="font-bold text-slate-200 flex items-center gap-1">
          <span>🏝️</span>
          <span className="hidden xs:inline">DARATAN:</span>
        </span>
        <span className={`font-mono font-bold ${isLandWarmer ? 'text-amber-400' : 'text-cyan-400'}`}>
          {meteoState.landTempC}°C
        </span>
        <span className="text-[11px] text-slate-400 hidden sm:inline">
          ({isLandWarmer ? 'Panas · Tekanan Rendah / L' : 'Dingin · Tekanan Tinggi / H'})
        </span>
        <span className="text-[10px] font-bold text-slate-300 sm:hidden">
          ({isLandWarmer ? 'L' : 'H'})
        </span>
      </div>

      {/* 2. Status Arah Angin Utama (Tengah) */}
      <div className="flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-slate-900 border border-cyan-500/40 text-cyan-300 font-bold text-[11px] sm:text-xs">
        <Wind className="w-3.5 h-3.5 text-cyan-400 shrink-0" />
        <span className="truncate">{meteoState.windNameId.toUpperCase()}</span>
        <span className="text-[10px] text-slate-300 font-normal hidden md:inline">
          ({isSeaBreeze ? 'Laut → Darat' : isLandBreeze ? 'Darat → Laut' : 'Tenang'})
        </span>
      </div>

      {/* 3. Status Lautan */}
      <div className="flex items-center gap-1.5 sm:gap-2">
        <span className="font-bold text-slate-200 flex items-center gap-1">
          <span>🌊</span>
          <span className="hidden xs:inline">LAUTAN:</span>
        </span>
        <span className={`font-mono font-bold ${!isLandWarmer ? 'text-amber-400' : 'text-cyan-400'}`}>
          {meteoState.seaTempC}°C
        </span>
        <span className="text-[11px] text-slate-400 hidden sm:inline">
          ({!isLandWarmer ? 'Hangat · Tekanan Rendah / L' : 'Sejuk · Tekanan Tinggi / H'})
        </span>
        <span className="text-[10px] font-bold text-slate-300 sm:hidden">
          ({!isLandWarmer ? 'L' : 'H'})
        </span>
      </div>
    </div>
  );
};
