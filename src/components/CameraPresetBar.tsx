import React from 'react';
import { Camera, Compass, Map, Eye } from 'lucide-react';

export type CameraPresetType = 'overview' | 'side_circulation' | 'beach_perspective' | 'top_map';

interface CameraPresetBarProps {
  currentPreset: CameraPresetType;
  onSelectPreset: (preset: CameraPresetType) => void;
}

export const CameraPresetBar: React.FC<CameraPresetBarProps> = ({
  currentPreset,
  onSelectPreset,
}) => {
  return (
    <div className="absolute top-4 left-1/2 -translate-x-1/2 z-20 hidden md:flex items-center gap-1 bg-slate-950/90 border border-slate-800 p-1 rounded-xl shadow-xl backdrop-blur-md text-xs">
      <span className="text-[10px] text-slate-500 font-semibold px-2 uppercase tracking-wider">
        Sudut Kamera:
      </span>

      <button
        onClick={() => onSelectPreset('side_circulation')}
        className={`flex items-center gap-1.5 px-2.5 py-1.5 rounded-lg transition-colors font-medium whitespace-nowrap ${
          currentPreset === 'side_circulation'
            ? 'bg-slate-800 text-cyan-300 shadow-sm border border-cyan-400/40'
            : 'text-slate-400 hover:text-slate-200'
        }`}
      >
        <Eye className="w-3.5 h-3.5 text-cyan-400" />
        Sirkulasi Konveksi (Samping)
      </button>

      <button
        onClick={() => onSelectPreset('beach_perspective')}
        className={`flex items-center gap-1.5 px-2.5 py-1.5 rounded-lg transition-colors font-medium whitespace-nowrap ${
          currentPreset === 'beach_perspective'
            ? 'bg-slate-800 text-cyan-300 shadow-sm border border-cyan-400/40'
            : 'text-slate-400 hover:text-slate-200'
        }`}
      >
        <Compass className="w-3.5 h-3.5 text-amber-400" />
        Perspektif Pantai & Nelayan
      </button>

      <button
        onClick={() => onSelectPreset('top_map')}
        className={`flex items-center gap-1.5 px-2.5 py-1.5 rounded-lg transition-colors font-medium whitespace-nowrap ${
          currentPreset === 'top_map'
            ? 'bg-slate-800 text-cyan-300 shadow-sm border border-cyan-400/40'
            : 'text-slate-400 hover:text-slate-200'
        }`}
      >
        <Map className="w-3.5 h-3.5 text-emerald-400" />
        Peta Atas (Isobar)
      </button>

      <button
        onClick={() => onSelectPreset('overview')}
        className={`flex items-center gap-1.5 px-2.5 py-1.5 rounded-lg transition-colors font-medium whitespace-nowrap ${
          currentPreset === 'overview'
            ? 'bg-slate-800 text-cyan-300 shadow-sm border border-cyan-400/40'
            : 'text-slate-400 hover:text-slate-200'
        }`}
      >
        <Camera className="w-3.5 h-3.5 text-indigo-400" />
        Sudut Sinematik
      </button>
    </div>
  );
};
