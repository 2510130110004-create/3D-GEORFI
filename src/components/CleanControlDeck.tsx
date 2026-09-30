import React from 'react';
import { MeteorologicalState } from '../types/geography';
import { Play, Pause, Sun, Moon, Wind, Lightbulb, BookOpen } from 'lucide-react';

interface CleanControlDeckProps {
  meteoState: MeteorologicalState;
  onSetTime: (hours: number) => void;
  isPlaying: boolean;
  onTogglePlay: () => void;
  onToggleDayNight: () => void;
  onOpenTheory: () => void;
}

/**
 * Ultra-clean, simplified educational control deck:
 * - Single row / unified card at the bottom
 * - High contrast, friendly colors
 * - No clutter, only what is truly essential
 */
export const CleanControlDeck: React.FC<CleanControlDeckProps> = ({
  meteoState,
  onSetTime,
  isPlaying,
  onTogglePlay,
  onToggleDayNight,
  onOpenTheory,
}) => {
  const isSeaBreeze = meteoState.windType === 'sea_breeze';
  const isLandBreeze = meteoState.windType === 'land_breeze';

  return (
    <footer className="w-full bg-slate-950/95 border-t border-slate-800 px-3 sm:px-6 py-2.5 flex flex-col gap-2 shrink-0 select-none z-20">
      {/* Baris 1: Inti Materi Langsung (1 Kalimat Jelas & Mudah Dipahami) */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-1.5 px-1 pb-1.5 border-b border-slate-800 text-xs">
        <div className="flex items-center gap-2">
          <span className={`inline-flex items-center gap-1 px-2 py-0.5 rounded-full font-bold text-[11px] ${
            isSeaBreeze
              ? 'bg-amber-500/20 text-amber-300 border border-amber-500/40'
              : isLandBreeze
              ? 'bg-cyan-500/20 text-cyan-300 border border-cyan-500/40'
              : 'bg-slate-800 text-slate-300 border border-slate-700'
          }`}>
            <Wind className="w-3 h-3" />
            {meteoState.windNameId.toUpperCase()}
          </span>

          <span className="text-slate-300 font-medium text-[11.5px] leading-snug">
            {isSeaBreeze && 'Daratan panas → Udara naik → Angin sejuk bertiup dari Laut ke Darat (Nelayan pulang).'}
            {isLandBreeze && 'Daratan dingin → Tekanan darat tinggi → Angin bertiup dari Darat ke Laut (Nelayan melaut).'}
            {!isSeaBreeze && !isLandBreeze && 'Suhu darat dan laut seimbang → Tekanan sama → Angin tenang (Peralihan).'}
          </span>
        </div>

        {/* Tombol Cepat Buka Materi */}
        <button
          onClick={onOpenTheory}
          className="self-end sm:self-auto flex items-center gap-1 text-[11px] font-semibold text-cyan-400 hover:text-cyan-300 bg-cyan-950/40 hover:bg-cyan-950/80 border border-cyan-800/50 px-2 py-0.5 rounded-md transition-colors whitespace-nowrap"
        >
          <Lightbulb className="w-3 h-3" />
          <span>Trik Hafalan & Penjelasan</span>
        </button>
      </div>

      {/* Baris 2: Kontrol Waktu & Tombol Pintas Siang ↔ Malam */}
      <div className="flex items-center justify-between gap-2 pt-0.5">
        {/* Tombol Pintas Siang vs Malam yang Jelas & Berwarna */}
        <button
          onClick={onToggleDayNight}
          className={`flex items-center gap-1.5 px-3 py-1.5 rounded-xl font-bold text-xs shadow-md transition-all whitespace-nowrap ${
            meteoState.isDaytime
              ? 'bg-amber-500 hover:bg-amber-400 text-slate-950'
              : 'bg-indigo-600 hover:bg-indigo-500 text-white'
          }`}
          title="Klik untuk beralih langsung antara Siang (Angin Laut) dan Malam (Angin Darat)"
        >
          {meteoState.isDaytime ? (
            <>
              <Sun className="w-4 h-4 fill-slate-950" />
              <span>SIANG (Ubah ke Malam)</span>
            </>
          ) : (
            <>
              <Moon className="w-4 h-4 fill-white" />
              <span>MALAM (Ubah ke Siang)</span>
            </>
          )}
        </button>

        {/* Play/Pause & Digital Clock */}
        <div className="flex items-center gap-1.5 shrink-0">
          <button
            onClick={onTogglePlay}
            className="flex items-center justify-center w-7 h-7 sm:w-8 sm:h-8 rounded-lg bg-slate-800 hover:bg-slate-700 text-white font-bold transition-colors border border-slate-700"
            title={isPlaying ? 'Jeda' : 'Jalankan 24 Jam'}
          >
            {isPlaying ? <Pause className="w-3.5 h-3.5" /> : <Play className="w-3.5 h-3.5 ml-0.5" />}
          </button>

          <span className="font-mono text-xs sm:text-sm font-bold text-white bg-slate-950 px-2 py-1 rounded-lg border border-slate-800 tabular-nums">
            {meteoState.timeString} <span className="text-[10px] text-slate-400 font-normal">WIB</span>
          </span>
        </div>

        {/* 24-Hour Scrubber Slider */}
        <div className="flex-1 flex items-center gap-1.5 min-w-0">
          <input
            type="range"
            min={0}
            max={24}
            step={0.1}
            value={meteoState.timeHours}
            onChange={(e) => onSetTime(parseFloat(e.target.value))}
            className="w-full accent-cyan-400 h-2 bg-gradient-to-r from-indigo-950 via-cyan-600 to-indigo-950 rounded-lg cursor-pointer"
          />
        </div>
      </div>
    </footer>
  );
};
