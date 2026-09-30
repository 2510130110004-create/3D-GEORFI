import React from 'react';
import { SimulationModel } from '../types';
import { X, ArrowUpRight } from 'lucide-react';

interface ReferenceModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSelectModel: (m: SimulationModel) => void;
}

export const ReferenceModal: React.FC<ReferenceModalProps> = ({
  isOpen,
  onClose,
  onSelectModel,
}) => {
  if (!isOpen) return null;

  const guides = [
    {
      id: 'cell' as SimulationModel,
      title: 'Eukaryotic Cytology & Organellar Architecture',
      image: '/src/assets/images/cell_biology_overview_1790779984929.jpg',
      category: 'Cell Biology · Grade 10 Standard',
      description:
        'Cross-sectional visualization of eukaryotic cellular compartments. Highlights the nuclear envelope with nuclear pores, mitochondrial cristae bioenergetics, and the endomembrane protein synthesis highway.',
      keyConcepts: [
        'Endosymbiotic origin of mitochondria and chloroplasts',
        'Fluid mosaic plasma membrane permeability',
        'Rough ER ribosome docks vs Smooth ER lipid synthesis',
      ],
    },
    {
      id: 'dna' as SimulationModel,
      title: 'B-DNA Double Helix & Molecular Base-Pairing',
      image: '/src/assets/images/dna_helix_scientific_1790780014204.jpg',
      category: 'Molecular Genetics · Grade 10 Standard',
      description:
        'Structural model of the antiparallel double helix. Features Watson-Crick complementary base-pairing (A=T with 2 hydrogen bonds, G≡C with 3 hydrogen bonds) along the sugar-phosphate backbone.',
      keyConcepts: [
        'Chargaff’s rule: %A = %T and %G = %C',
        'Antiparallel orientation (5′ to 3′ strands)',
        'Major and minor groove protein binding sites',
      ],
    },
    {
      id: 'atom' as SimulationModel,
      title: 'Atomic Structure & Quantum Orbital Mechanics',
      image: '/src/assets/images/atomic_orbitals_model_1790780030925.jpg',
      category: 'Physical Chemistry · Grade 10 Standard',
      description:
        'Dual-paradigm atomic visualizer. Contrasts classical quantized Bohr planetary shells (K, L, M) with Schrödinger 3D quantum wave probability density clouds (1s, 2s, 2p lobes).',
      keyConcepts: [
        'Valence electrons determine group reactivity',
        'Octet rule and covalent/ionic bond formation',
        'Bohr orbits vs quantum probability boundary surfaces',
      ],
    },
  ];

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-sm">
      <div className="w-full max-w-4xl max-h-[90vh] bg-slate-900 border border-slate-800 rounded-2xl shadow-2xl p-6 relative flex flex-col overflow-hidden">
        {/* Header */}
        <div className="flex items-center justify-between pb-4 border-b border-slate-800 shrink-0">
          <div>
            <div className="flex items-center gap-2 text-xs text-slate-400">
              <span>Scientific Visual Library</span>
              <span aria-hidden="true">·</span>
              <span>PBR Pedagogical Field Guides</span>
            </div>
            <h3 className="text-xl font-bold text-white font-display mt-0.5">
              Grade 10 Scientific References
            </h3>
          </div>
          <button
            onClick={onClose}
            className="p-1 text-slate-400 hover:text-white rounded-lg hover:bg-slate-800 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Guides Grid */}
        <div className="py-4 space-y-6 overflow-y-auto pr-1">
          {guides.map((g) => (
            <div
              key={g.id}
              className="grid grid-cols-1 md:grid-cols-12 gap-5 p-4 bg-slate-950/60 border border-slate-800 rounded-xl hover:border-slate-700 transition-colors items-center"
            >
              {/* Resilient Image Slot with CSS Fallback */}
              <div className="md:col-span-5 relative aspect-video bg-slate-800 rounded-lg overflow-hidden border border-slate-800">
                <img
                  src={g.image}
                  alt={g.title}
                  referrerPolicy="no-referrer"
                  className="w-full h-full object-cover"
                  onError={(e) => {
                    // Fallback to stylized abstract background if local image fails
                    (e.target as HTMLElement).style.display = 'none';
                  }}
                />
              </div>

              {/* Guide Metadata */}
              <div className="md:col-span-7 flex flex-col justify-between space-y-3">
                <div>
                  <div className="text-xs text-slate-400 mb-1">{g.category}</div>
                  <h4 className="text-base font-semibold text-white font-display">
                    {g.title}
                  </h4>
                  <p className="text-xs text-slate-300 mt-1.5 leading-relaxed">
                    {g.description}
                  </p>
                </div>

                <div className="space-y-1">
                  <div className="text-xs font-semibold text-slate-400">
                    Core Learning Points:
                  </div>
                  <ul className="text-xs text-slate-300 space-y-0.5 list-disc list-inside">
                    {g.keyConcepts.map((pt, i) => (
                      <li key={i}>{pt}</li>
                    ))}
                  </ul>
                </div>

                <div className="pt-2">
                  <button
                    onClick={() => {
                      onSelectModel(g.id);
                      onClose();
                    }}
                    className="inline-flex items-center gap-1.5 px-3 py-1.5 text-xs font-medium text-slate-900 bg-cyan-400 hover:bg-cyan-300 rounded-lg transition-colors font-semibold"
                  >
                    <span>Launch 3D Simulation</span>
                    <ArrowUpRight className="w-3.5 h-3.5" />
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};
