import React, { useState } from 'react';
import { MeteorologicalState } from '../types/geography';
import { Sparkles, ArrowRight, Lightbulb, ChevronDown, ChevronUp } from 'lucide-react';

interface StudentSummaryCardProps {
  meteoState: MeteorologicalState;
  onOpenCompare: () => void;
  onOpenStepStory: () => void;
}

export const StudentSummaryCard: React.FC<StudentSummaryCardProps> = ({
  meteoState,
  onOpenCompare,
  onOpenStepStory,
}) => {
  const [isMobileExpanded, setIsMobileExpanded] = useState(false);
  const isSeaBreeze = meteoState.windType === 'sea_breeze';
  const isLandBreeze = meteoState.windType === 'land_breeze';

  return (
    <div className="absolute top-2 sm:top-3 left-1/2 -translate-x-1/2 z-20 w-[95%] sm:w-11/12 max-w-2xl bg-slate-950/95 border border-slate-800/90 rounded-2xl p-2.5 sm:p-3.5 shadow-2xl backdrop-blur-md text-xs">
      {/* Header bar */}
      <div className="flex items-center justify-between gap-2">
        <div className="flex items-center gap-2 min-w-0">
          <div className="p-1 sm:p-1.5 rounded-lg bg-cyan-950/80 border border-cyan-800/60 text-cyan-400 shrink-0">
            <Lightbulb className="w-3.5 h-3.5 sm:w-4 sm:h-4" />
          </div>
          <div className="min-w-0 truncate">
            <h3 className="text-xs sm:text-sm font-bold text-white font-display truncate">
              {isSeaBreeze ? '🌊 Angin Laut' : isLandBreeze ? '🏝️ Angin Darat' : '⚖️ Angin Tenang'}
              <span className="text-[11px] font-normal text-cyan-300 ml-1.5 hidden sm:inline">
                ({isSeaBreeze ? 'Laut → Darat' : isLandBreeze ? 'Darat → Laut' : 'Peralihan'})
              </span>
            </h3>
          </div>
        </div>

        {/* Buttons */}
        <div className="flex items-center gap-1.5 shrink-0">
          <button
            onClick={onOpenCompare}
            className="flex items-center gap-1 px-2 py-1 bg-slate-900 hover:bg-slate-800 text-cyan-300 rounded-lg border border-slate-700/80 text-[10px] sm:text-[11px] font-semibold transition-colors"
          >
            <Sparkles className="w-3 h-3 text-cyan-400" />
            <span className="hidden sm:inline">Tabel Siang vs Malam</span>
            <span className="sm:hidden">Tabel</span>
          </button>

          <button
            onClick={onOpenStepStory}
            className="flex items-center gap-1 px-2 py-1 bg-cyan-400 hover:bg-cyan-300 text-slate-950 rounded-lg text-[10px] sm:text-[11px] font-bold transition-colors shadow-sm"
          >
            <span>6 Langkah</span>
            <ArrowRight className="w-3 h-3 hidden sm:inline" />
          </button>

          {/* Mobile expand toggle button */}
          <button
            onClick={() => setIsMobileExpanded(!isMobileExpanded)}
            className="sm:hidden p-1 text-slate-400 hover:text-white rounded-lg bg-slate-900 border border-slate-800"
            title="Buka penjelasan singkat"
          >
            {isMobileExpanded ? <ChevronUp className="w-3.5 h-3.5" /> : <ChevronDown className="w-3.5 h-3.5" />}
          </button>
        </div>
      </div>

      {/* Explanation text (Always visible on desktop sm:, toggleable on mobile) */}
      <div className={`${isMobileExpanded ? 'block' : 'hidden sm:grid'} grid-cols-1 sm:grid-cols-2 gap-2 pt-2.5 mt-2 border-t border-slate-800/80 text-[11px] sm:text-[11.5px] leading-relaxed`}>
        <div className="p-2 rounded-lg bg-slate-900/60 border border-slate-800/80">
          <strong className="text-slate-200 block mb-0.5">🔍 Mengapa ini terjadi?</strong>
          <span className="text-slate-300">
            {isSeaBreeze && 'Daratan lebih cepat panas daripada laut. Udara darat naik, lalu udara sejuk dari laut menyapu masuk menggantikannya.'}
            {isLandBreeze && 'Daratan mendingin cepat di malam hari sedangkan laut tetap hangat. Udara sejuk darat meniup menuju ke laut.'}
            {!isSeaBreeze && !isLandBreeze && 'Suhu daratan dan lautan seimbang, perbedaan tekanan sangat kecil sehingga angin tenang.'}
          </span>
        </div>

        <div className="p-2 rounded-lg bg-emerald-950/20 border border-emerald-800/40">
          <strong className="text-emerald-300 block mb-0.5">💡 Trik Hafalan Ujian:</strong>
          <span className="text-slate-300">
            {isSeaBreeze && '"Angin LAUT = Datang dari LAUT ke darat" (Siang hari, nelayan pulang bawa ikan).'}
            {isLandBreeze && '"Angin DARAT = Datang dari DARAT ke laut" (Malam hari, nelayan berangkat melaut).'}
            {!isSeaBreeze && !isLandBreeze && 'Terjadi saat fajar dan senja sebagai masa peralihan.'}
          </span>
        </div>
      </div>
    </div>
  );
};
