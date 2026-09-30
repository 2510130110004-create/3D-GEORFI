import React from 'react';
import { AppMode } from '../types/geography';
import { BookOpen, HelpCircle, Download, RotateCcw, Volume2, VolumeX } from 'lucide-react';

interface GeoNavigationProps {
  mode: AppMode;
  onSelectMode: (m: AppMode) => void;
  onOpenGlbExport: () => void;
  onResetCamera: () => void;
  isAudioActive: boolean;
  onToggleAudio: () => void;
  onOpenTheory: () => void;
  onOpenQuiz: () => void;
}

export const GeoNavigation: React.FC<GeoNavigationProps> = ({
  onOpenGlbExport,
  onResetCamera,
  isAudioActive,
  onToggleAudio,
  onOpenTheory,
  onOpenQuiz,
}) => {
  return (
    <header className="h-12 sm:h-14 border-b border-slate-800 bg-slate-950/95 backdrop-blur-md px-3 sm:px-6 flex items-center justify-between shrink-0 z-30">
      {/* Brand & Topic */}
      <div className="flex items-center gap-2">
        <h1 className="text-base sm:text-lg font-bold tracking-tight text-white font-display flex items-center gap-1.5">
          <span>GeoAtmosfer</span>
          <span className="text-xs px-2 py-0.5 rounded-full bg-cyan-950 text-cyan-400 border border-cyan-800/60 font-medium hidden sm:inline">
            Sirkulasi Angin Darat & Laut
          </span>
        </h1>
      </div>

      {/* Main Essential Actions (High contrast, clearly arranged) */}
      <div className="flex items-center gap-2">
        <button
          onClick={onOpenTheory}
          className="flex items-center gap-1.5 px-3 py-1.5 text-xs font-semibold text-slate-100 bg-slate-800 hover:bg-slate-700 border border-slate-700 rounded-xl transition-all shadow-sm"
        >
          <BookOpen className="w-3.5 h-3.5 text-cyan-400" />
          <span>Materi & Trik Hafalan</span>
        </button>

        <button
          onClick={onOpenQuiz}
          className="flex items-center gap-1.5 px-3 py-1.5 text-xs font-bold text-slate-950 bg-cyan-400 hover:bg-cyan-300 rounded-xl transition-all shadow-sm"
        >
          <HelpCircle className="w-3.5 h-3.5" />
          <span>Kuis (6 Soal)</span>
        </button>

        <div className="w-px h-5 bg-slate-800 mx-1 hidden sm:block" />

        {/* Audio Ambiance Toggle */}
        <button
          onClick={onToggleAudio}
          title={isAudioActive ? 'Matikan Suara Angin' : 'Nyalakan Suara Angin & Ombak'}
          className={`p-2 border rounded-xl transition-colors ${
            isAudioActive
              ? 'bg-cyan-950/60 border-cyan-500/60 text-cyan-300'
              : 'text-slate-400 hover:text-white hover:bg-slate-900 border-slate-800'
          }`}
        >
          {isAudioActive ? <Volume2 className="w-4 h-4" /> : <VolumeX className="w-4 h-4" />}
        </button>

        {/* Reset Camera View */}
        <button
          onClick={onResetCamera}
          title="Reset Sudut Kamera"
          className="p-2 text-slate-400 hover:text-white hover:bg-slate-900 border border-slate-800 rounded-xl transition-colors"
        >
          <RotateCcw className="w-4 h-4" />
        </button>

        {/* Export 3D .GLB */}
        <button
          onClick={onOpenGlbExport}
          title="Ekspor Model 3D .GLB"
          className="p-2 text-slate-400 hover:text-white hover:bg-slate-900 border border-slate-800 rounded-xl transition-colors hidden sm:block"
        >
          <Download className="w-4 h-4" />
        </button>
      </div>
    </header>
  );
};
