import React from 'react';
import { SimulationModel, ViewportSettings, ElementAtomInfo, RenderMode } from '../types';
import { ELEMENT_ATOMS } from '../data/cellData';
import { Play, Pause, Sparkles, Eye, Scissors, Maximize2 } from 'lucide-react';

interface ControlToolbarProps {
  model: SimulationModel;
  settings: ViewportSettings;
  onUpdateSettings: (patch: Partial<ViewportSettings>) => void;
  selectedElement: ElementAtomInfo;
  onSelectElement: (el: ElementAtomInfo) => void;
  orbitalType: 'bohr' | 'quantum';
  onSetOrbitalType: (t: 'bohr' | 'quantum') => void;
  dnaUnzipProgress: number;
  onSetDnaUnzipProgress: (val: number) => void;
}

export const ControlToolbar: React.FC<ControlToolbarProps> = ({
  model,
  settings,
  onUpdateSettings,
  selectedElement,
  onSelectElement,
  orbitalType,
  onSetOrbitalType,
  dnaUnzipProgress,
  onSetDnaUnzipProgress,
}) => {
  return (
    <div className="absolute bottom-6 left-1/2 -translate-x-1/2 z-20 w-11/12 max-w-4xl bg-slate-950/90 border border-slate-800/90 rounded-xl p-3 shadow-2xl backdrop-blur-md flex flex-wrap items-center justify-between gap-3 text-xs">
      {/* SECTION 1: Model-specific primary controls */}
      {model === 'cell' && (
        <div className="flex items-center gap-4 flex-wrap">
          {/* Animal vs Plant switch */}
          <div className="flex items-center bg-slate-900 p-0.5 rounded-lg border border-slate-800">
            <button
              onClick={() => onUpdateSettings({ cellType: 'animal' })}
              className={`px-3 py-1.5 rounded-md font-medium transition-colors whitespace-nowrap ${
                settings.cellType === 'animal'
                  ? 'bg-slate-800 text-cyan-300 shadow-sm'
                  : 'text-slate-400 hover:text-slate-200'
              }`}
            >
              Animal Cell
            </button>
            <button
              onClick={() => onUpdateSettings({ cellType: 'plant' })}
              className={`px-3 py-1.5 rounded-md font-medium transition-colors whitespace-nowrap ${
                settings.cellType === 'plant'
                  ? 'bg-slate-800 text-emerald-300 shadow-sm'
                  : 'text-slate-400 hover:text-slate-200'
              }`}
            >
              Plant Cell
            </button>
          </div>

          {/* Exploded View Slider */}
          <div className="flex items-center gap-2">
            <span className="text-slate-400 flex items-center gap-1 whitespace-nowrap">
              <Maximize2 className="w-3.5 h-3.5 text-slate-400" />
              Explode:
            </span>
            <input
              type="range"
              min={0}
              max={1}
              step={0.05}
              value={settings.explodedView}
              onChange={(e) => onUpdateSettings({ explodedView: parseFloat(e.target.value) })}
              className="w-24 accent-cyan-400 h-1.5 bg-slate-800 rounded-lg cursor-pointer"
            />
            <span className="font-mono text-cyan-300 tabular-nums w-8">
              {Math.round(settings.explodedView * 100)}%
            </span>
          </div>

          {/* Cross-section cutaway slider */}
          <div className="flex items-center gap-2">
            <span className="text-slate-400 flex items-center gap-1 whitespace-nowrap">
              <Scissors className="w-3.5 h-3.5 text-slate-400" />
              Cutaway:
            </span>
            <input
              type="range"
              min={0}
              max={120}
              step={5}
              value={settings.cutawayAngle}
              onChange={(e) => onUpdateSettings({ cutawayAngle: parseInt(e.target.value, 10) })}
              className="w-24 accent-cyan-400 h-1.5 bg-slate-800 rounded-lg cursor-pointer"
            />
            <span className="font-mono text-cyan-300 tabular-nums w-8">
              {settings.cutawayAngle}°
            </span>
          </div>
        </div>
      )}

      {model === 'dna' && (
        <div className="flex items-center gap-4 flex-wrap">
          <div className="flex items-center gap-2">
            <span className="text-slate-400 whitespace-nowrap">Transcription Unzip:</span>
            <input
              type="range"
              min={0}
              max={1}
              step={0.05}
              value={dnaUnzipProgress}
              onChange={(e) => onSetDnaUnzipProgress(parseFloat(e.target.value))}
              className="w-36 accent-cyan-400 h-1.5 bg-slate-800 rounded-lg cursor-pointer"
            />
            <span className="font-mono text-cyan-300 tabular-nums">
              {Math.round(dnaUnzipProgress * 100)}%
            </span>
          </div>
          <span className="text-slate-500 hidden sm:inline">
            Separates hydrogen bonds between A-T and G-C base pairs
          </span>
        </div>
      )}

      {model === 'atom' && (
        <div className="flex items-center gap-3 flex-wrap">
          {/* Element buttons */}
          <div className="flex items-center gap-1 bg-slate-900 p-0.5 rounded-lg border border-slate-800">
            {ELEMENT_ATOMS.map((el) => (
              <button
                key={el.symbol}
                onClick={() => onSelectElement(el)}
                className={`px-2 py-1 rounded font-mono font-medium transition-colors ${
                  selectedElement.symbol === el.symbol
                    ? 'bg-slate-800 text-cyan-300 shadow-sm'
                    : 'text-slate-400 hover:text-slate-200'
                }`}
              >
                {el.symbol}
              </button>
            ))}
          </div>

          {/* Model representation toggle */}
          <div className="flex items-center bg-slate-900 p-0.5 rounded-lg border border-slate-800">
            <button
              onClick={() => onSetOrbitalType('bohr')}
              className={`px-2.5 py-1 rounded font-medium transition-colors whitespace-nowrap ${
                orbitalType === 'bohr'
                  ? 'bg-slate-800 text-cyan-300'
                  : 'text-slate-400 hover:text-slate-200'
              }`}
            >
              Bohr Shells
            </button>
            <button
              onClick={() => onSetOrbitalType('quantum')}
              className={`px-2.5 py-1 rounded font-medium transition-colors whitespace-nowrap ${
                orbitalType === 'quantum'
                  ? 'bg-slate-800 text-cyan-300'
                  : 'text-slate-400 hover:text-slate-200'
              }`}
            >
              Quantum Orbitals
            </button>
          </div>
        </div>
      )}

      {/* SECTION 2: Global Visual Modes & Toggles */}
      <div className="flex items-center gap-2 flex-wrap">
        {/* Render mode selector */}
        <div className="flex items-center bg-slate-900 p-0.5 rounded-lg border border-slate-800">
          {(
            [
              { id: 'pbr', label: 'True PBR' },
              { id: 'fluorescence', label: 'Fluorescence' },
              { id: 'cryo_tem', label: 'Cryo-TEM' },
              { id: 'xray', label: 'X-Ray' },
            ] as const
          ).map((m) => (
            <button
              key={m.id}
              onClick={() => onUpdateSettings({ renderMode: m.id as RenderMode })}
              className={`px-2 py-1 rounded text-xs transition-colors whitespace-nowrap ${
                settings.renderMode === m.id
                  ? 'bg-slate-800 text-white font-medium shadow-sm'
                  : 'text-slate-400 hover:text-slate-200'
              }`}
            >
              {m.label}
            </button>
          ))}
        </div>

        {/* Metabolic Particle toggle */}
        <button
          onClick={() => onUpdateSettings({ particlesActive: !settings.particlesActive })}
          title="Toggle ATP/Metabolic Particles"
          className={`p-1.5 rounded-md border transition-colors ${
            settings.particlesActive
              ? 'bg-slate-800 border-cyan-400/50 text-cyan-300'
              : 'bg-slate-900 border-slate-800 text-slate-500 hover:text-slate-300'
          }`}
        >
          <Sparkles className="w-3.5 h-3.5" />
        </button>

        {/* Auto Orbit Toggle */}
        <button
          onClick={() => onUpdateSettings({ autoRotate: !settings.autoRotate })}
          title={settings.autoRotate ? 'Pause Rotation' : 'Auto Rotate'}
          className={`p-1.5 rounded-md border transition-colors ${
            settings.autoRotate
              ? 'bg-slate-800 border-cyan-400/50 text-cyan-300'
              : 'bg-slate-900 border-slate-800 text-slate-500 hover:text-slate-300'
          }`}
        >
          {settings.autoRotate ? <Pause className="w-3.5 h-3.5" /> : <Play className="w-3.5 h-3.5" />}
        </button>
      </div>
    </div>
  );
};
