import React, { useState } from 'react';
import { LayerVisibility } from '../types/geography';
import { Layers, Eye, EyeOff, Thermometer, Gauge, Wind, Cloud, Ship, ChevronDown } from 'lucide-react';

interface LayerControlBarProps {
  layers: LayerVisibility;
  onUpdateLayers: (patch: Partial<LayerVisibility>) => void;
}

export const LayerControlBar: React.FC<LayerControlBarProps> = ({
  layers,
  onUpdateLayers,
}) => {
  const [isExpanded, setIsExpanded] = useState(false);

  return (
    <div className="absolute top-4 left-6 z-20 hidden md:block">
      <div className="bg-slate-950/90 border border-slate-800 rounded-xl shadow-xl backdrop-blur-md overflow-hidden text-xs">
        <button
          onClick={() => setIsExpanded(!isExpanded)}
          className="flex items-center justify-between gap-3 px-3 py-2 w-full font-semibold text-slate-200 hover:text-white transition-colors"
        >
          <div className="flex items-center gap-2">
            <Layers className="w-3.5 h-3.5 text-cyan-400" />
            <span>Lapisan Visualisasi 3D</span>
          </div>
          <ChevronDown className={`w-3.5 h-3.5 text-slate-400 transition-transform ${isExpanded ? 'rotate-180' : ''}`} />
        </button>

        {isExpanded && (
          <div className="p-3 border-t border-slate-800 space-y-2 w-64">
            <label className="flex items-center justify-between cursor-pointer text-slate-300 hover:text-white">
              <span className="flex items-center gap-2">
                <Wind className="w-3.5 h-3.5 text-cyan-400" />
                Aliran Angin & Partikel Konveksi
              </span>
              <input
                type="checkbox"
                checked={layers.showConvectionParticles}
                onChange={(e) => onUpdateLayers({ showConvectionParticles: e.target.checked })}
                className="accent-cyan-400 cursor-pointer"
              />
            </label>

            <label className="flex items-center justify-between cursor-pointer text-slate-300 hover:text-white">
              <span className="flex items-center gap-2">
                <Gauge className="w-3.5 h-3.5 text-amber-400" />
                Pusat Tekanan Udara (H & L)
              </span>
              <input
                type="checkbox"
                checked={layers.showPressureIndicators}
                onChange={(e) => onUpdateLayers({ showPressureIndicators: e.target.checked })}
                className="accent-cyan-400 cursor-pointer"
              />
            </label>

            <label className="flex items-center justify-between cursor-pointer text-slate-300 hover:text-white">
              <span className="flex items-center gap-2">
                <Thermometer className="w-3.5 h-3.5 text-rose-400" />
                Pewarnaan Termal Permukaan
              </span>
              <input
                type="checkbox"
                checked={layers.showTemperatureColors}
                onChange={(e) => onUpdateLayers({ showTemperatureColors: e.target.checked })}
                className="accent-cyan-400 cursor-pointer"
              />
            </label>

            <label className="flex items-center justify-between cursor-pointer text-slate-300 hover:text-white">
              <span className="flex items-center gap-2">
                <Cloud className="w-3.5 h-3.5 text-slate-300" />
                Awan Konveksi Kumulus
              </span>
              <input
                type="checkbox"
                checked={layers.showClouds}
                onChange={(e) => onUpdateLayers({ showClouds: e.target.checked })}
                className="accent-cyan-400 cursor-pointer"
              />
            </label>

            <label className="flex items-center justify-between cursor-pointer text-slate-300 hover:text-white">
              <span className="flex items-center gap-2">
                <Ship className="w-3.5 h-3.5 text-emerald-400" />
                Perahu Nelayan Tradisional
              </span>
              <input
                type="checkbox"
                checked={layers.showFishermanBoats}
                onChange={(e) => onUpdateLayers({ showFishermanBoats: e.target.checked })}
                className="accent-cyan-400 cursor-pointer"
              />
            </label>
          </div>
        )}
      </div>
    </div>
  );
};
