import React from 'react';
import { SimulationModel } from '../types';
import { Camera, RotateCcw, BookOpen, HelpCircle, Layers } from 'lucide-react';

interface NavigationProps {
  currentModel: SimulationModel;
  onSelectModel: (m: SimulationModel) => void;
  onOpenTour: () => void;
  onOpenQuiz: () => void;
  onOpenReference: () => void;
  onResetCamera: () => void;
  onCaptureScreenshot: () => void;
}

export const Navigation: React.FC<NavigationProps> = ({
  currentModel,
  onSelectModel,
  onOpenTour,
  onOpenQuiz,
  onOpenReference,
  onResetCamera,
  onCaptureScreenshot,
}) => {
  return (
    <header className="h-14 border-b border-slate-800 bg-slate-950/90 backdrop-blur-md px-6 flex items-center justify-between shrink-0 z-30">
      {/* Zone 1: Single text element wordmark */}
      <div className="flex items-center gap-2">
        <span className="text-lg font-bold tracking-tight text-white font-display">
          Synapse3D
        </span>
      </div>

      {/* Zone 2: 4-6 clean text navigation / segmented controls */}
      <nav className="flex items-center gap-1 bg-slate-900/80 p-1 border border-slate-800 rounded-lg">
        <button
          onClick={() => onSelectModel('cell')}
          className={`px-3 py-1.5 text-xs font-medium rounded-md transition-colors whitespace-nowrap ${
            currentModel === 'cell'
              ? 'bg-slate-800 text-cyan-300 shadow-sm'
              : 'text-slate-400 hover:text-slate-200'
          }`}
        >
          Eukaryotic Cell
        </button>

        <button
          onClick={() => onSelectModel('dna')}
          className={`px-3 py-1.5 text-xs font-medium rounded-md transition-colors whitespace-nowrap ${
            currentModel === 'dna'
              ? 'bg-slate-800 text-cyan-300 shadow-sm'
              : 'text-slate-400 hover:text-slate-200'
          }`}
        >
          DNA Double Helix
        </button>

        <button
          onClick={() => onSelectModel('atom')}
          className={`px-3 py-1.5 text-xs font-medium rounded-md transition-colors whitespace-nowrap ${
            currentModel === 'atom'
              ? 'bg-slate-800 text-cyan-300 shadow-sm'
              : 'text-slate-400 hover:text-slate-200'
          }`}
        >
          Atomic Orbitals
        </button>

        <div className="w-px h-4 bg-slate-800 mx-1" aria-hidden="true" />

        <button
          onClick={onOpenTour}
          className="flex items-center gap-1.5 px-3 py-1.5 text-xs font-medium text-slate-300 hover:text-white rounded-md hover:bg-slate-800/60 transition-colors whitespace-nowrap"
        >
          <BookOpen className="w-3.5 h-3.5 text-cyan-400" />
          Guided Tour
        </button>

        <button
          onClick={onOpenQuiz}
          className="flex items-center gap-1.5 px-3 py-1.5 text-xs font-medium text-slate-300 hover:text-white rounded-md hover:bg-slate-800/60 transition-colors whitespace-nowrap"
        >
          <HelpCircle className="w-3.5 h-3.5 text-amber-400" />
          Grade 10 Quiz
        </button>

        <button
          onClick={onOpenReference}
          className="flex items-center gap-1.5 px-3 py-1.5 text-xs font-medium text-slate-300 hover:text-white rounded-md hover:bg-slate-800/60 transition-colors whitespace-nowrap"
        >
          <Layers className="w-3.5 h-3.5 text-indigo-400" />
          Field Guides
        </button>
      </nav>

      {/* Zone 3: 1-2 primary actions */}
      <div className="flex items-center gap-2">
        <button
          onClick={onResetCamera}
          title="Reset Camera View"
          className="p-2 text-slate-400 hover:text-slate-200 hover:bg-slate-900 border border-slate-800 rounded-md transition-colors"
        >
          <RotateCcw className="w-4 h-4" />
        </button>

        <button
          onClick={onCaptureScreenshot}
          className="flex items-center gap-1.5 px-3 py-1.5 text-xs font-medium text-slate-900 bg-cyan-400 hover:bg-cyan-300 rounded-md transition-colors shadow-sm whitespace-nowrap font-medium"
        >
          <Camera className="w-3.5 h-3.5" />
          Export Diagram
        </button>
      </div>
    </header>
  );
};
