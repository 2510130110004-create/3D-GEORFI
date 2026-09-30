import React from 'react';
import { SimulationModel, ElementAtomInfo } from '../types';
import { CELL_ORGANELLES, DNA_BASE_PAIRS } from '../data/cellData';
import { X, Sparkles, ChevronRight, Compass } from 'lucide-react';

interface OrganelleDrawerProps {
  model: SimulationModel;
  selectedId: string | null;
  onClose: () => void;
  onSelectOrganelle: (id: string) => void;
  selectedElement: ElementAtomInfo;
  orbitalType: 'bohr' | 'quantum';
}

export const OrganelleDrawer: React.FC<OrganelleDrawerProps> = ({
  model,
  selectedId,
  onClose,
  onSelectOrganelle,
  selectedElement,
  orbitalType,
}) => {
  if (model === 'atom') {
    return (
      <aside className="w-84 lg:w-96 h-full bg-slate-950/95 border-l border-slate-800 p-6 flex flex-col justify-between overflow-y-auto z-20 backdrop-blur-md">
        <div>
          <div className="flex items-start justify-between mb-4">
            <div>
              <div className="flex items-center gap-2 text-xs text-slate-400 mb-1">
                <span>Period {selectedElement.period}</span>
                <span aria-hidden="true">·</span>
                <span>Group {selectedElement.group}</span>
                <span aria-hidden="true">·</span>
                <span>Atomic No. {selectedElement.atomicNumber}</span>
              </div>
              <h2 className="text-2xl font-bold text-white font-display">
                {selectedElement.name} ({selectedElement.symbol})
              </h2>
              <div className="text-xs text-cyan-400 mt-0.5">
                {selectedElement.category}
              </div>
            </div>
            <button
              onClick={onClose}
              className="p-1 text-slate-400 hover:text-white rounded hover:bg-slate-800 transition-colors"
            >
              <X className="w-4 h-4" />
            </button>
          </div>

          <div className="space-y-5 text-sm">
            {/* Subatomic breakdown */}
            <div className="grid grid-cols-3 gap-2 p-3 bg-slate-900/80 border border-slate-800/80 rounded-lg text-center font-mono">
              <div>
                <div className="text-xs text-red-400">Protons (p⁺)</div>
                <div className="text-lg font-bold text-white tabular-nums">{selectedElement.protons}</div>
              </div>
              <div>
                <div className="text-xs text-slate-400">Neutrons (n⁰)</div>
                <div className="text-lg font-bold text-white tabular-nums">{selectedElement.neutrons}</div>
              </div>
              <div>
                <div className="text-xs text-cyan-400">Electrons (e⁻)</div>
                <div className="text-lg font-bold text-white tabular-nums">{selectedElement.electrons}</div>
              </div>
            </div>

            {/* Electron Configuration */}
            <div>
              <div className="text-xs font-semibold uppercase tracking-wider text-slate-400 mb-1">
                Electron Shell Configuration
              </div>
              <div className="p-3 bg-slate-900/60 border border-slate-800 rounded-lg flex items-center justify-between">
                <span className="text-xs text-slate-400">Shells [K, L, M]</span>
                <span className="font-mono text-sm font-semibold text-cyan-300">
                  {selectedElement.electronConfiguration.join(' , ')}
                </span>
              </div>
              <div className="text-xs text-slate-400 mt-1">
                Valence Electrons: <strong className="text-slate-200">{selectedElement.valenceElectrons}</strong> (determines chemical reactivity and bonding capacity).
              </div>
            </div>

            {/* Orbital Visualization Context */}
            <div>
              <div className="text-xs font-semibold uppercase tracking-wider text-slate-400 mb-1">
                {orbitalType === 'bohr' ? 'Bohr Planetary Model' : 'Quantum Probability Orbitals'}
              </div>
              <p className="text-xs text-slate-300 leading-relaxed">
                {orbitalType === 'bohr'
                  ? 'Displays discrete concentric circular orbits (quantized principal quantum numbers n=1, 2, 3). Demonstrates stable energy levels before electron absorption or photon emission.'
                  : 'Displays three-dimensional probability density clouds (Schrödinger wave mechanics). The 1s/2s spherical shells and 2px, 2py, 2pz dumbbell lobes represent 90% probability boundary surfaces.'}
              </p>
            </div>

            {/* Grade 10 Fact */}
            <div className="p-3.5 bg-slate-900/90 border-l-2 border-cyan-400 rounded-r-lg">
              <div className="flex items-center gap-1.5 text-xs font-semibold text-cyan-300 mb-1">
                <Sparkles className="w-3.5 h-3.5" />
                Grade 10 Curriculum Fact
              </div>
              <p className="text-xs text-slate-300 leading-relaxed">
                {selectedElement.grade10Fact}
              </p>
            </div>
          </div>
        </div>

        <div className="pt-4 border-t border-slate-800 text-xs text-slate-500 text-center">
          Rotate with mouse drag · Scroll to zoom
        </div>
      </aside>
    );
  }

  if (model === 'dna') {
    const baseInfo = DNA_BASE_PAIRS.find((b) => b.id === selectedId) || DNA_BASE_PAIRS[0];

    return (
      <aside className="w-84 lg:w-96 h-full bg-slate-950/95 border-l border-slate-800 p-6 flex flex-col justify-between overflow-y-auto z-20 backdrop-blur-md">
        <div>
          <div className="flex items-start justify-between mb-4">
            <div>
              <div className="flex items-center gap-2 text-xs text-slate-400 mb-1">
                <span>Deoxyribonucleic Acid</span>
                <span aria-hidden="true">·</span>
                <span>B-DNA Conformation</span>
              </div>
              <h2 className="text-2xl font-bold text-white font-display">
                {baseInfo.name}
              </h2>
              <div className="text-xs text-emerald-400 mt-0.5">
                {baseInfo.pair}
              </div>
            </div>
            <button
              onClick={onClose}
              className="p-1 text-slate-400 hover:text-white rounded hover:bg-slate-800 transition-colors"
            >
              <X className="w-4 h-4" />
            </button>
          </div>

          <div className="space-y-5 text-sm">
            {/* Hydrogen bonds */}
            <div className="p-3.5 bg-slate-900/80 border border-slate-800 rounded-lg">
              <div className="flex items-center justify-between">
                <span className="text-xs text-slate-400">Hydrogen Bond Density</span>
                <span className="font-mono text-sm font-bold text-cyan-300">
                  {baseInfo.bonds} Hydrogen Bonds
                </span>
              </div>
              <div className="w-full bg-slate-800 h-1.5 rounded-full mt-2 overflow-hidden">
                <div
                  className="bg-cyan-400 h-full rounded-full"
                  style={{ width: baseInfo.bonds === 3 ? '100%' : '66%' }}
                />
              </div>
            </div>

            {/* Description */}
            <div>
              <div className="text-xs font-semibold uppercase tracking-wider text-slate-400 mb-1">
                Molecular Character
              </div>
              <p className="text-xs text-slate-300 leading-relaxed">
                {baseInfo.description}
              </p>
            </div>

            {/* Chargaff Rule & Hydrogen Bond Note */}
            <div>
              <div className="text-xs font-semibold uppercase tracking-wider text-slate-400 mb-1">
                Complementary Base Pairing Rule
              </div>
              <p className="text-xs text-slate-300 leading-relaxed">
                Purines (double-ring) always pair with pyrimidines (single-ring), maintaining a uniform 2.0 nm diameter across the double helix. Adenine forms 2 hydrogen bonds with Thymine; Guanine forms 3 hydrogen bonds with Cytosine.
              </p>
            </div>

            {/* Grade 10 Exam Fact */}
            <div className="p-3.5 bg-slate-900/90 border-l-2 border-emerald-400 rounded-r-lg">
              <div className="flex items-center gap-1.5 text-xs font-semibold text-emerald-300 mb-1">
                <Sparkles className="w-3.5 h-3.5" />
                Grade 10 Exam Key Fact
              </div>
              <p className="text-xs text-slate-300 leading-relaxed">
                {baseInfo.grade10Fact}
              </p>
            </div>

            {/* Quick selector between 4 bases */}
            <div>
              <div className="text-xs font-semibold text-slate-400 mb-2">
                Examine All Nitrogenous Bases
              </div>
              <div className="grid grid-cols-2 gap-2">
                {DNA_BASE_PAIRS.map((b) => (
                  <button
                    key={b.id}
                    onClick={() => onSelectOrganelle(b.id)}
                    className={`px-2.5 py-1.5 text-xs font-medium rounded-md border text-left flex items-center justify-between transition-colors ${
                      baseInfo.id === b.id
                        ? 'bg-slate-800 border-cyan-400 text-white'
                        : 'bg-slate-900/60 border-slate-800 text-slate-400 hover:text-slate-200'
                    }`}
                  >
                    <span>{b.name}</span>
                    <span
                      className="w-2 h-2 rounded-full"
                      style={{ backgroundColor: b.color }}
                    />
                  </button>
                ))}
              </div>
            </div>
          </div>
        </div>

        <div className="pt-4 border-t border-slate-800 text-xs text-slate-500 text-center">
          Drag to orbit · Scroll to inspect major and minor grooves
        </div>
      </aside>
    );
  }

  // Model === 'cell'
  const organelle = CELL_ORGANELLES.find((o) => o.id === selectedId) || CELL_ORGANELLES[0];
  const currentIndex = CELL_ORGANELLES.findIndex((o) => o.id === organelle.id);
  const nextOrganelle = CELL_ORGANELLES[(currentIndex + 1) % CELL_ORGANELLES.length];

  return (
    <aside className="w-84 lg:w-96 h-full bg-slate-950/95 border-l border-slate-800 p-6 flex flex-col justify-between overflow-y-auto z-20 backdrop-blur-md">
      <div>
        <div className="flex items-start justify-between mb-4">
          <div>
            <div className="flex items-center gap-2 text-xs text-slate-400 mb-1">
              <span>{organelle.category}</span>
              <span aria-hidden="true">·</span>
              <span className="italic">{organelle.scientificName}</span>
            </div>
            <h2 className="text-2xl font-bold text-white font-display">
              {organelle.name}
            </h2>
          </div>
          <button
            onClick={onClose}
            className="p-1 text-slate-400 hover:text-white rounded hover:bg-slate-800 transition-colors"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        <div className="space-y-4 text-sm">
          {/* Grade 10 Analogy */}
          <div className="p-3 bg-cyan-950/30 border border-cyan-800/40 rounded-lg">
            <div className="text-xs font-semibold text-cyan-400 mb-0.5">
              Grade 10 Memory Analogy
            </div>
            <div className="text-xs font-medium text-cyan-200">
              {organelle.analogy}
            </div>
          </div>

          {/* Primary Function */}
          <div>
            <div className="text-xs font-semibold uppercase tracking-wider text-slate-400 mb-1">
              Biological Function
            </div>
            <p className="text-xs text-slate-300 leading-relaxed">
              {organelle.primaryFunction}
            </p>
          </div>

          {/* Biochemical Process or Formula */}
          {organelle.biochemicalProcess && (
            <div className="p-3 bg-slate-900/80 border border-slate-800 rounded-lg">
              <div className="text-xs font-semibold text-slate-400 mb-1">
                {organelle.biochemicalProcess}
              </div>
              {organelle.formula && (
                <div className="font-mono text-xs text-cyan-300 break-all leading-normal bg-slate-950/60 p-2 rounded border border-slate-800/80">
                  {organelle.formula}
                </div>
              )}
            </div>
          )}

          {/* Dimensions / Physical Scale */}
          <div>
            <div className="text-xs font-semibold uppercase tracking-wider text-slate-400 mb-1">
              Physical Dimensions & Scale
            </div>
            <p className="text-xs font-mono text-slate-300">
              {organelle.dimensions}
            </p>
          </div>

          {/* Grade 10 Exam Key Fact */}
          <div className="p-3.5 bg-slate-900/90 border-l-2 border-cyan-400 rounded-r-lg">
            <div className="flex items-center gap-1.5 text-xs font-semibold text-cyan-300 mb-1">
              <Sparkles className="w-3.5 h-3.5" />
              Grade 10 Exam Fact
            </div>
            <p className="text-xs text-slate-300 leading-relaxed">
              {organelle.grade10KeyFact}
            </p>
          </div>
        </div>
      </div>

      <div className="pt-4 border-t border-slate-800 space-y-2">
        <button
          onClick={() => onSelectOrganelle(nextOrganelle.id)}
          className="w-full flex items-center justify-between px-3 py-2 text-xs font-medium text-slate-300 hover:text-white bg-slate-900 hover:bg-slate-800 border border-slate-800 rounded-lg transition-colors"
        >
          <span className="flex items-center gap-1.5">
            <Compass className="w-3.5 h-3.5 text-cyan-400" />
            Next: {nextOrganelle.name}
          </span>
          <ChevronRight className="w-3.5 h-3.5 text-slate-400" />
        </button>

        <div className="text-xs text-slate-500 text-center">
          Click any 3D organelle in viewport to inspect
        </div>
      </div>
    </aside>
  );
};
