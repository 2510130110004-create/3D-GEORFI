import React from 'react';
import { MeteorologicalState } from '../types/geography';
import { Tag } from 'lucide-react';

interface Interactive3DLabelsProps {
  meteoState: MeteorologicalState;
  isVisible: boolean;
  onToggleVisibility: () => void;
  onSelectFeature?: (featureId: string) => void;
}

export const Interactive3DLabels: React.FC<Interactive3DLabelsProps> = ({
  meteoState,
  isVisible,
  onToggleVisibility,
}) => {
  const isSeaBreeze = meteoState.windType === 'sea_breeze';
  const isLandBreeze = meteoState.windType === 'land_breeze';

  return (
    <>
      {/* Toggle button in top bar or corner */}
      <div className="absolute top-18 right-6 z-20 hidden lg:block">
        <button
          onClick={onToggleVisibility}
          className={`flex items-center gap-1.5 px-3 py-1.5 rounded-xl border text-xs font-semibold backdrop-blur-md transition-colors shadow-lg ${
            isVisible
              ? 'bg-cyan-950/80 border-cyan-500/60 text-cyan-300'
              : 'bg-slate-950/80 border-slate-800 text-slate-400 hover:text-white'
          }`}
          title="Tampilkan atau sembunyikan label nama dan fungsi objek 3D"
        >
          <Tag className="w-3.5 h-3.5" />
          <span>Label Penjelasan Objek 3D {isVisible ? '(Aktif)' : '(Nonaktif)'}</span>
        </button>
      </div>

      {/* Floating 3D Object Badges (Positioned cleanly over respective visual zones) */}
      {isVisible && (
        <div className="pointer-events-none absolute inset-0 z-10 overflow-hidden text-[11px] font-sans">
          {/* 1. Label Daratan (Left Side) */}
          <div className="absolute top-[48%] left-[18%] -translate-x-1/2 -translate-y-1/2 bg-slate-900/90 border border-slate-700/80 text-slate-100 px-2.5 py-1.5 rounded-lg shadow-xl backdrop-blur-md">
            <div className="font-bold flex items-center gap-1 text-emerald-400">
              <span>🏝️ DARATAN</span>
            </div>
            <div className="text-[10px] text-slate-300">
              {isSeaBreeze ? 'Suhu Panas (~34°C) · Tekanan Rendah (L)' : 'Suhu Dingin (~22°C) · Tekanan Tinggi (H)'}
            </div>
          </div>

          {/* 2. Label Lautan (Right Side) */}
          <div className="absolute top-[52%] left-[78%] -translate-x-1/2 -translate-y-1/2 bg-slate-900/90 border border-slate-700/80 text-slate-100 px-2.5 py-1.5 rounded-lg shadow-xl backdrop-blur-md">
            <div className="font-bold flex items-center gap-1 text-cyan-400">
              <span>🌊 LAUTAN</span>
            </div>
            <div className="text-[10px] text-slate-300">
              {isSeaBreeze ? 'Suhu Stabil (~27°C) · Tekanan Tinggi (H)' : 'Suhu Hangat (~27°C) · Tekanan Rendah (L)'}
            </div>
          </div>

          {/* 3. Label Angin Permukaan (Center Coastline) */}
          <div className="absolute top-[68%] left-[50%] -translate-x-1/2 -translate-y-1/2 bg-slate-950/95 border border-cyan-500/60 text-white px-3 py-1.5 rounded-xl shadow-2xl backdrop-blur-md text-center">
            <div className="font-bold text-cyan-300 flex items-center justify-center gap-1 text-xs">
              <span>💨 {meteoState.windNameId.toUpperCase()}</span>
            </div>
            <div className="text-[10px] text-slate-300 font-medium">
              {isSeaBreeze ? 'Meniup dari Laut ke Darat (Siang)' : isLandBreeze ? 'Meniup dari Darat ke Laut (Malam)' : 'Angin Peralihan Tenang'}
            </div>
          </div>

          {/* 4. Label Kantong Angin BMKG (Near Beach) */}
          <div className="absolute top-[58%] left-[44%] -translate-x-1/2 -translate-y-1/2 bg-slate-900/90 border border-slate-700/80 text-slate-200 px-2 py-1 rounded-md shadow-lg hidden md:block">
            <span className="font-semibold text-amber-400">🚩 Kantong Angin: </span>
            <span className="text-[10px]">Berkibar searah tiupan angin</span>
          </div>

          {/* 5. Label Perahu Nelayan (Right Bay) */}
          <div className="absolute top-[64%] left-[68%] -translate-x-1/2 -translate-y-1/2 bg-slate-900/90 border border-slate-700/80 text-slate-200 px-2.5 py-1 rounded-md shadow-lg hidden md:block">
            <span className="font-semibold text-emerald-400">🛶 Perahu Nelayan: </span>
            <span className="text-[10px]">
              {isSeaBreeze ? 'Berlayar pulang merapat ke pantai' : 'Berlayar pergi ke laut lepas'}
            </span>
          </div>
        </div>
      )}
    </>
  );
};
