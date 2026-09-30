import React from 'react';
import { SimulationModel, CellType } from '../types';
import { CELL_ORGANELLES } from '../data/cellData';
import { Layers } from 'lucide-react';

interface OrganelleQuickListProps {
  model: SimulationModel;
  cellType: CellType;
  selectedId: string | null;
  onSelectOrganelle: (id: string) => void;
}

export const OrganelleQuickList: React.FC<OrganelleQuickListProps> = ({
  model,
  cellType,
  selectedId,
  onSelectOrganelle,
}) => {
  if (model !== 'cell') return null;

  const visibleOrganelles = CELL_ORGANELLES.filter((o) => {
    if (cellType === 'animal' && o.plantOnly) return false;
    if (cellType === 'plant' && o.animalOnly) return false;
    return true;
  });

  return (
    <div className="absolute top-20 left-6 z-20 hidden md:block max-w-xs">
      <div className="bg-slate-950/80 border border-slate-800/80 rounded-xl p-3 backdrop-blur-md shadow-xl">
        <div className="flex items-center gap-1.5 text-xs font-semibold text-slate-400 mb-2 pb-1.5 border-b border-slate-800/80">
          <Layers className="w-3.5 h-3.5 text-cyan-400" />
          <span>Structures & Organelles</span>
        </div>

        <div className="space-y-1 max-h-72 overflow-y-auto pr-1">
          {visibleOrganelles.map((org) => {
            const isSelected = selectedId === org.id;
            return (
              <button
                key={org.id}
                onClick={() => onSelectOrganelle(org.id)}
                className={`w-full flex items-center justify-between px-2.5 py-1.5 rounded-lg text-xs font-medium transition-colors text-left ${
                  isSelected
                    ? 'bg-slate-800 text-cyan-300 border border-cyan-400/40 shadow-sm'
                    : 'text-slate-400 hover:text-slate-200 hover:bg-slate-900/60'
                }`}
              >
                <div className="flex items-center gap-2 truncate">
                  <span
                    className="w-2 h-2 rounded-full shrink-0"
                    style={{ backgroundColor: org.color }}
                  />
                  <span className="truncate">{org.name}</span>
                </div>
              </button>
            );
          })}
        </div>
      </div>
    </div>
  );
};
