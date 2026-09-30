import React, { useState } from 'react';
import { GUIDED_TOUR_STEPS } from '../data/cellData';
import { X, ChevronLeft, ChevronRight, CheckCircle2, ArrowRight } from 'lucide-react';

interface GuidedTourModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSelectOrganelle: (id: string) => void;
}

export const GuidedTourModal: React.FC<GuidedTourModalProps> = ({
  isOpen,
  onClose,
  onSelectOrganelle,
}) => {
  const [currentStepIdx, setCurrentStepIdx] = useState(0);

  if (!isOpen) return null;

  const currentStep = GUIDED_TOUR_STEPS[currentStepIdx];
  const isFirst = currentStepIdx === 0;
  const isLast = currentStepIdx === GUIDED_TOUR_STEPS.length - 1;

  const handleStepChange = (newIdx: number) => {
    setCurrentStepIdx(newIdx);
    onSelectOrganelle(GUIDED_TOUR_STEPS[newIdx].organelleId);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-sm">
      <div className="w-full max-w-xl bg-slate-900 border border-slate-800 rounded-2xl shadow-2xl p-6 relative overflow-hidden">
        {/* Header */}
        <div className="flex items-center justify-between pb-4 border-b border-slate-800">
          <div className="flex items-center gap-2">
            <span className="text-xs font-semibold text-cyan-400">
              Grade 10 Curriculum Tour
            </span>
            <span className="text-slate-600">·</span>
            <span className="text-xs font-mono text-slate-400">
              Module {currentStep.step} of {GUIDED_TOUR_STEPS.length}
            </span>
          </div>
          <button
            onClick={onClose}
            className="p-1 text-slate-400 hover:text-white rounded-lg hover:bg-slate-800 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Step Progress Line */}
        <div className="grid grid-cols-7 gap-1.5 my-4">
          {GUIDED_TOUR_STEPS.map((s, idx) => (
            <button
              key={s.step}
              onClick={() => handleStepChange(idx)}
              className={`h-1.5 rounded-full transition-all ${
                idx === currentStepIdx
                  ? 'bg-cyan-400'
                  : idx < currentStepIdx
                  ? 'bg-cyan-700'
                  : 'bg-slate-800'
              }`}
            />
          ))}
        </div>

        {/* Content */}
        <div className="py-2 space-y-4">
          <div>
            <div className="text-xs text-cyan-400 font-medium mb-1">
              {currentStep.tagline}
            </div>
            <h3 className="text-xl font-bold text-white font-display">
              {currentStep.title}
            </h3>
          </div>

          <p className="text-sm text-slate-300 leading-relaxed">
            {currentStep.body}
          </p>

          <button
            onClick={() => onSelectOrganelle(currentStep.organelleId)}
            className="inline-flex items-center gap-2 text-xs font-medium text-cyan-300 hover:text-cyan-200 transition-colors"
          >
            <ArrowRight className="w-3.5 h-3.5 text-cyan-400" />
            {currentStep.actionLabel}
          </button>
        </div>

        {/* Footer controls */}
        <div className="flex items-center justify-between pt-5 mt-4 border-t border-slate-800">
          <button
            onClick={() => handleStepChange(currentStepIdx - 1)}
            disabled={isFirst}
            className={`flex items-center gap-1.5 px-3 py-1.5 text-xs font-medium rounded-lg border transition-colors ${
              isFirst
                ? 'opacity-30 border-transparent text-slate-500 cursor-not-allowed'
                : 'border-slate-700 text-slate-300 hover:bg-slate-800'
            }`}
          >
            <ChevronLeft className="w-4 h-4" />
            Previous
          </button>

          {isLast ? (
            <button
              onClick={onClose}
              className="flex items-center gap-1.5 px-4 py-2 text-xs font-semibold text-slate-900 bg-cyan-400 hover:bg-cyan-300 rounded-lg transition-colors shadow-sm"
            >
              <CheckCircle2 className="w-4 h-4" />
              Complete Tour
            </button>
          ) : (
            <button
              onClick={() => handleStepChange(currentStepIdx + 1)}
              className="flex items-center gap-1.5 px-4 py-2 text-xs font-semibold text-slate-900 bg-cyan-400 hover:bg-cyan-300 rounded-lg transition-colors shadow-sm"
            >
              Next Organelle
              <ChevronRight className="w-4 h-4" />
            </button>
          )}
        </div>
      </div>
    </div>
  );
};
