import React, { useState } from 'react';
import { GRADE_10_QUIZ } from '../data/cellData';
import { X, CheckCircle, AlertCircle, ChevronRight, RotateCcw, ExternalLink } from 'lucide-react';

interface QuizModalProps {
  isOpen: boolean;
  onClose: () => void;
  onInspectOrganelle: (id: string) => void;
}

export const QuizModal: React.FC<QuizModalProps> = ({
  isOpen,
  onClose,
  onInspectOrganelle,
}) => {
  const [currentIdx, setCurrentIdx] = useState(0);
  const [selectedAnswers, setSelectedAnswers] = useState<Record<number, number>>({});
  const [showExplanation, setShowExplanation] = useState(false);
  const [isFinished, setIsFinished] = useState(false);

  if (!isOpen) return null;

  const currentQ = GRADE_10_QUIZ[currentIdx];
  const totalQuestions = GRADE_10_QUIZ.length;
  const selectedOption = selectedAnswers[currentQ.id];
  const isAnswered = selectedOption !== undefined;

  const handleSelectOption = (index: number) => {
    if (isAnswered) return;
    setSelectedAnswers((prev) => ({ ...prev, [currentQ.id]: index }));
    setShowExplanation(true);
  };

  const handleNext = () => {
    if (currentIdx < totalQuestions - 1) {
      setCurrentIdx((prev) => prev + 1);
      setShowExplanation(selectedAnswers[GRADE_10_QUIZ[currentIdx + 1].id] !== undefined);
    } else {
      setIsFinished(true);
    }
  };

  const handleRestart = () => {
    setCurrentIdx(0);
    setSelectedAnswers({});
    setShowExplanation(false);
    setIsFinished(false);
  };

  const score = Object.entries(selectedAnswers).reduce((acc, [qId, ans]) => {
    const q = GRADE_10_QUIZ.find((item) => item.id === parseInt(qId, 10));
    return q && q.correctIndex === ans ? acc + 1 : acc;
  }, 0);

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-sm">
      <div className="w-full max-w-xl bg-slate-900 border border-slate-800 rounded-2xl shadow-2xl p-6 relative overflow-hidden">
        {/* Header */}
        <div className="flex items-center justify-between pb-4 border-b border-slate-800">
          <div>
            <div className="flex items-center gap-2 text-xs text-slate-400">
              <span>Grade 10 Assessment</span>
              <span aria-hidden="true">·</span>
              <span>Cell Biology & Chemistry</span>
            </div>
            <h3 className="text-lg font-bold text-white font-display mt-0.5">
              Concept Check Challenge
            </h3>
          </div>
          <button
            onClick={onClose}
            className="p-1 text-slate-400 hover:text-white rounded-lg hover:bg-slate-800 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {!isFinished ? (
          <div className="py-4 space-y-4">
            {/* Progress & Standard */}
            <div className="flex items-center justify-between text-xs">
              <span className="text-cyan-400 font-mono">
                Question {currentIdx + 1} of {totalQuestions}
              </span>
              <span className="text-slate-400">
                {currentQ.curriculumStandard}
              </span>
            </div>

            {/* Question Text */}
            <h4 className="text-base font-semibold text-slate-100 leading-snug">
              {currentQ.question}
            </h4>

            {/* Options */}
            <div className="space-y-2 pt-1">
              {currentQ.options.map((option, idx) => {
                let btnStyle = 'border-slate-800 bg-slate-900/80 text-slate-300 hover:bg-slate-800/80';
                if (isAnswered) {
                  if (idx === currentQ.correctIndex) {
                    btnStyle = 'border-emerald-500 bg-emerald-950/40 text-emerald-200';
                  } else if (idx === selectedOption) {
                    btnStyle = 'border-rose-500 bg-rose-950/40 text-rose-200';
                  } else {
                    btnStyle = 'border-slate-800/50 opacity-40 text-slate-500';
                  }
                }

                return (
                  <button
                    key={idx}
                    onClick={() => handleSelectOption(idx)}
                    disabled={isAnswered}
                    className={`w-full text-left p-3 rounded-lg border text-xs sm:text-sm font-medium transition-colors flex items-center justify-between ${btnStyle}`}
                  >
                    <span>{option}</span>
                    {isAnswered && idx === currentQ.correctIndex && (
                      <CheckCircle className="w-4 h-4 text-emerald-400 shrink-0" />
                    )}
                    {isAnswered && idx === selectedOption && idx !== currentQ.correctIndex && (
                      <AlertCircle className="w-4 h-4 text-rose-400 shrink-0" />
                    )}
                  </button>
                );
              })}
            </div>

            {/* Explanation card */}
            {showExplanation && (
              <div className="p-3.5 bg-slate-950/70 border border-slate-800 rounded-lg space-y-2">
                <div className="text-xs text-slate-300 leading-relaxed">
                  <strong className="text-cyan-400 font-semibold mr-1">Explanation:</strong>
                  {currentQ.explanation}
                </div>
                <button
                  onClick={() => onInspectOrganelle(currentQ.targetId)}
                  className="flex items-center gap-1.5 text-xs font-medium text-cyan-400 hover:text-cyan-300 transition-colors"
                >
                  <ExternalLink className="w-3.5 h-3.5" />
                  Locate and Inspect Structure in 3D
                </button>
              </div>
            )}

            {/* Bottom button */}
            <div className="flex items-center justify-end pt-3 border-t border-slate-800">
              <button
                onClick={handleNext}
                disabled={!isAnswered}
                className={`flex items-center gap-1.5 px-4 py-2 text-xs font-semibold rounded-lg transition-colors shadow-sm ${
                  isAnswered
                    ? 'bg-cyan-400 text-slate-900 hover:bg-cyan-300'
                    : 'bg-slate-800 text-slate-500 cursor-not-allowed'
                }`}
              >
                {currentIdx < totalQuestions - 1 ? 'Next Question' : 'View Results'}
                <ChevronRight className="w-4 h-4" />
              </button>
            </div>
          </div>
        ) : (
          /* Finished summary */
          <div className="py-6 text-center space-y-4">
            <div className="inline-flex p-3 bg-cyan-950/50 border border-cyan-800/40 rounded-full text-cyan-400 mb-1">
              <CheckCircle className="w-8 h-8" />
            </div>

            <h4 className="text-2xl font-bold text-white font-display">
              Quiz Completed!
            </h4>

            <div className="text-4xl font-extrabold text-cyan-400 font-mono tabular-nums">
              {score} / {totalQuestions}
            </div>

            <p className="text-sm text-slate-300 max-w-sm mx-auto leading-relaxed">
              {score >= 7
                ? 'Outstanding mastery of Grade 10 cytology, DNA base pairing, and atomic structure!'
                : score >= 5
                ? 'Solid foundational understanding. Use the 3D cutaway and organelle drawer to review key details.'
                : 'Good effort! Review the Guided Tour modules and inspect each organelle in 3D to solidify your concepts.'}
            </p>

            <div className="flex items-center justify-center gap-3 pt-4">
              <button
                onClick={handleRestart}
                className="flex items-center gap-1.5 px-4 py-2 text-xs font-medium text-slate-300 hover:text-white bg-slate-800 hover:bg-slate-700 rounded-lg transition-colors border border-slate-700"
              >
                <RotateCcw className="w-4 h-4" />
                Retake Quiz
              </button>
              <button
                onClick={onClose}
                className="px-5 py-2 text-xs font-semibold text-slate-900 bg-cyan-400 hover:bg-cyan-300 rounded-lg transition-colors"
              >
                Return to Simulation
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
