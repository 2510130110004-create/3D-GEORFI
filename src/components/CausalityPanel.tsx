import React, { useState } from 'react';
import { MeteorologicalState } from '../types/geography';
import { ChevronRight, ChevronLeft, GitCommit, ArrowDown, HelpCircle, Ship } from 'lucide-react';

interface CausalityPanelProps {
  meteoState: MeteorologicalState;
  onOpenTheory: () => void;
}

export const CausalityPanel: React.FC<CausalityPanelProps> = ({
  meteoState,
  onOpenTheory,
}) => {
  const [isOpen, setIsOpen] = useState(false);

  if (!isOpen) {
    return (
      <button
        onClick={() => setIsOpen(true)}
        className="absolute top-4 right-6 z-20 hidden md:flex items-center gap-1.5 px-3 py-2 bg-slate-950/90 border border-slate-800 text-xs font-semibold text-cyan-300 rounded-xl shadow-xl backdrop-blur-md hover:bg-slate-900 transition-colors"
      >
        <GitCommit className="w-4 h-4 text-emerald-400" />
        <span>Rantai Kausalitas (6 Langkah)</span>
        <ChevronLeft className="w-4 h-4 text-slate-400" />
      </button>
    );
  }

  const steps = [
    {
      num: '01',
      title: 'WAKTU & RADIASI SURYA',
      desc: meteoState.isDaytime
        ? `Matahari bersinar (Intensitas ${Math.round(meteoState.sunIntensity * 100)}%). Memberikan fluks radiasi gelombang pendek ke daratan dan lautan.`
        : 'Malam hari tanpa radiasi matahari. Terjadi pelepasan radiasi gelombang panjang (pendinginan bumi / radiational cooling).',
    },
    {
      num: '02',
      title: 'PERBEDAAN KAPASITAS KALOR',
      desc: meteoState.causalityStep.heating,
    },
    {
      num: '03',
      title: 'PERBEDAAN SUHU PERMUKAAN',
      desc: meteoState.causalityStep.temperature,
    },
    {
      num: '04',
      title: 'KERAPATAN & TEKANAN UDARA',
      desc: meteoState.causalityStep.pressure,
    },
    {
      num: '05',
      title: 'PERGERAKAN UDARA KONVEKSI',
      desc: meteoState.causalityStep.airMovement,
    },
    {
      num: '06',
      title: 'TERBENTUKNYA ARAH ANGIN',
      desc: meteoState.causalityStep.windResult,
    },
  ];

  return (
    <aside className="absolute top-4 right-6 z-20 w-80 lg:w-96 max-h-[calc(100vh-140px)] bg-slate-950/95 border border-slate-800 rounded-2xl shadow-2xl backdrop-blur-md flex flex-col overflow-hidden">
      {/* Header */}
      <div className="p-4 border-b border-slate-800 flex items-center justify-between shrink-0">
        <div>
          <div className="flex items-center gap-1.5 text-xs text-slate-400">
            <span>Geografi Kelas X</span>
            <span aria-hidden="true">·</span>
            <span>Atmosfer & Sirkulasi</span>
          </div>
          <h3 className="text-base font-bold text-white font-display flex items-center gap-1.5 mt-0.5">
            <GitCommit className="w-4 h-4 text-emerald-400" />
            Rantai Sebab-Akibat Angin
          </h3>
        </div>
        <button
          onClick={() => setIsOpen(false)}
          className="p-1 text-slate-400 hover:text-white rounded-lg hover:bg-slate-800 transition-colors"
        >
          <ChevronRight className="w-5 h-5" />
        </button>
      </div>

      {/* Cause-and-Effect Stepper */}
      <div className="p-4 space-y-3 overflow-y-auto pr-2 flex-1 text-xs">
        {steps.map((st, idx) => (
          <div key={st.num} className="relative">
            <div className="p-3 bg-slate-900/80 border border-slate-800 rounded-xl space-y-1">
              <div className="flex items-center justify-between text-[11px] font-mono font-semibold text-cyan-400">
                <span>{st.num}. {st.title}</span>
              </div>
              <p className="text-slate-300 leading-relaxed text-[11.5px]">
                {st.desc}
              </p>
            </div>
            {idx < steps.length - 1 && (
              <div className="flex justify-center my-1 text-slate-600">
                <ArrowDown className="w-3.5 h-3.5" />
              </div>
            )}
          </div>
        ))}

        {/* Real-world Fisherman Connection */}
        <div className="p-3 bg-emerald-950/30 border border-emerald-800/40 rounded-xl space-y-1 mt-3">
          <div className="flex items-center gap-1.5 font-semibold text-emerald-300 text-xs">
            <Ship className="w-3.5 h-3.5 text-emerald-400" />
            Aplikasi Kehidupan: Nelayan Tradisional
          </div>
          <p className="text-slate-300 leading-relaxed text-[11.5px]">
            {meteoState.fishermanContext}
          </p>
        </div>
      </div>

      {/* Footer link to full theory */}
      <div className="p-3 border-t border-slate-800 shrink-0 bg-slate-900/40">
        <button
          onClick={onOpenTheory}
          className="w-full flex items-center justify-center gap-1.5 px-3 py-2 text-xs font-semibold text-slate-900 bg-cyan-400 hover:bg-cyan-300 rounded-lg transition-colors shadow-sm"
        >
          <HelpCircle className="w-4 h-4" />
          Pelajari Teori Fisika Lengkap
        </button>
      </div>
    </aside>
  );
};
