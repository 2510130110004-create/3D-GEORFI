import React from 'react';
import { MeteorologicalState } from '../types/geography';
import { Play, Pause, Sun, Moon, Wind, ArrowRight } from 'lucide-react';

interface TimeSliderControlProps {
  meteoState: MeteorologicalState;
  onSetTime: (hours: number) => void;
  isPlaying: boolean;
  onTogglePlay: () => void;
  playbackSpeed: number;
  onSetSpeed: (speed: number) => void;
  onToggleDayNight?: () => void;
}

export const TimeSliderControl: React.FC<TimeSliderControlProps> = ({
  meteoState,
  onSetTime,
  isPlaying,
  onTogglePlay,
  playbackSpeed,
  onSetSpeed,
  onToggleDayNight,
}) => {
  const isSeaBreeze = meteoState.windType === 'sea_breeze';
  const isLandBreeze = meteoState.windType === 'land_breeze';

  return (
    <div className="absolute bottom-3 sm:bottom-5 left-1/2 -translate-x-1/2 z-20 w-[95%] sm:w-11/12 max-w-4xl bg-slate-950/95 border border-slate-800/90 rounded-2xl p-2.5 sm:p-3.5 shadow-2xl backdrop-blur-md flex flex-col gap-2">
      {/* ========================================================================= */}
      {/* MOBILE COMPACT STATUS (Visible on mobile screens)                         */}
      {/* ========================================================================= */}
      <div className="sm:hidden flex items-center justify-between px-1 text-xs">
        <div className="flex items-center gap-1.5 font-semibold text-white">
          <Wind className={`w-3.5 h-3.5 ${isSeaBreeze ? 'text-cyan-400' : isLandBreeze ? 'text-emerald-400' : 'text-slate-400'}`} />
          <span className="text-cyan-300 font-bold">{meteoState.windNameId}</span>
          <span className="text-[11px] text-slate-400">({meteoState.timeString})</span>
        </div>
        <div className="text-[10px] text-slate-400 font-mono">
          Darat <strong className="text-white">{meteoState.landTempC}°C</strong> · Laut <strong className="text-white">{meteoState.seaTempC}°C</strong>
        </div>
      </div>

      {/* ========================================================================= */}
      {/* DESKTOP TELEMETRY CARDS (Visible on sm: and up)                           */}
      {/* ========================================================================= */}
      <div className="hidden sm:grid grid-cols-3 gap-2.5 items-center text-xs">
        {/* Darat Card */}
        <div className={`p-2 rounded-xl border transition-colors ${
          meteoState.landTempC > meteoState.seaTempC
            ? 'bg-rose-950/20 border-rose-800/40'
            : 'bg-cyan-950/20 border-cyan-800/40'
        }`}>
          <div className="flex items-center justify-between mb-0.5 text-[11px]">
            <span className="font-semibold text-slate-200">🏝️ DARATAN</span>
            <span className={`font-mono font-bold ${
              meteoState.landTempC > meteoState.seaTempC ? 'text-rose-400' : 'text-cyan-400'
            }`}>
              {meteoState.landTempC > meteoState.seaTempC ? 'LEBIH PANAS' : 'LEBIH DINGIN'}
            </span>
          </div>
          <div className="flex items-center justify-between text-[11px] text-slate-400">
            <span>Suhu: <strong className="text-white font-mono">{meteoState.landTempC}°C</strong></span>
            <span>Tekanan: <strong className="text-white font-mono">{meteoState.landPressureHpa} hPa</strong> ({meteoState.landTempC > meteoState.seaTempC ? 'L' : 'H'})</span>
          </div>
        </div>

        {/* Center Wind Banner */}
        <div className="p-2 rounded-xl bg-slate-900 border border-slate-800 text-center flex flex-col justify-center items-center">
          <div className="flex items-center gap-1.5 font-display text-xs font-bold text-white">
            <Wind className={`w-3.5 h-3.5 ${isSeaBreeze ? 'text-cyan-400' : isLandBreeze ? 'text-emerald-400' : 'text-slate-400'}`} />
            <span>{meteoState.windNameId}</span>
            <span className="text-[10px] font-mono text-slate-400">({meteoState.surfaceWindSpeedMs} m/s)</span>
          </div>
          <div className="text-[11px] text-cyan-300 font-medium flex items-center gap-1">
            <span>{isSeaBreeze ? '🌊 Laut' : isLandBreeze ? '🏝️ Darat' : 'Tenang'}</span>
            <ArrowRight className="w-3 h-3" />
            <span>{isSeaBreeze ? '🏝️ Darat' : isLandBreeze ? '🌊 Laut' : 'Peralihan'}</span>
          </div>
        </div>

        {/* Laut Card */}
        <div className={`p-2 rounded-xl border transition-colors ${
          meteoState.seaTempC > meteoState.landTempC
            ? 'bg-rose-950/20 border-rose-800/40'
            : 'bg-cyan-950/20 border-cyan-800/40'
        }`}>
          <div className="flex items-center justify-between mb-0.5 text-[11px]">
            <span className="font-semibold text-slate-200">🌊 LAUTAN</span>
            <span className={`font-mono font-bold ${
              meteoState.seaTempC > meteoState.landTempC ? 'text-rose-400' : 'text-cyan-400'
            }`}>
              {meteoState.seaTempC > meteoState.landTempC ? 'LEBIH HANGAT' : 'LEBIH DINGIN'}
            </span>
          </div>
          <div className="flex items-center justify-between text-[11px] text-slate-400">
            <span>Suhu: <strong className="text-white font-mono">{meteoState.seaTempC}°C</strong></span>
            <span>Tekanan: <strong className="text-white font-mono">{meteoState.seaPressureHpa} hPa</strong> ({meteoState.seaTempC > meteoState.landTempC ? 'L' : 'H'})</span>
          </div>
        </div>
      </div>

      {/* ========================================================================= */}
      {/* 24-HOUR SCRUBBER & ESSENTIAL CONTROLS                                     */}
      {/* ========================================================================= */}
      <div className="flex items-center justify-between gap-2 pt-1 border-t border-slate-800/80">
        {/* Play / Pause & Time Indicator */}
        <div className="flex items-center gap-2">
          <button
            onClick={onTogglePlay}
            className="flex items-center justify-center w-7 h-7 sm:w-8 sm:h-8 rounded-lg bg-cyan-400 hover:bg-cyan-300 text-slate-950 font-bold transition-colors shadow-sm shrink-0"
            title={isPlaying ? 'Jeda' : 'Jalankan Siklus 24 Jam'}
          >
            {isPlaying ? <Pause className="w-3.5 h-3.5" /> : <Play className="w-3.5 h-3.5 ml-0.5" />}
          </button>

          <div className="flex items-center gap-1 font-mono text-xs sm:text-sm font-bold text-white bg-slate-900 px-2 py-1 rounded-lg border border-slate-800 shrink-0">
            {meteoState.isDaytime ? (
              <Sun className="w-3.5 h-3.5 text-amber-400" />
            ) : (
              <Moon className="w-3.5 h-3.5 text-cyan-300" />
            )}
            <span className="tabular-nums">{meteoState.timeString}</span>
          </div>

          {/* Desktop speed selector */}
          <div className="hidden md:flex items-center bg-slate-900 p-0.5 rounded-lg border border-slate-800 text-[11px]">
            {[1, 2, 5].map((spd) => (
              <button
                key={spd}
                onClick={() => onSetSpeed(spd)}
                className={`px-1.5 py-0.5 rounded font-mono font-medium transition-colors ${
                  playbackSpeed === spd
                    ? 'bg-slate-800 text-cyan-300'
                    : 'text-slate-400 hover:text-slate-200'
                }`}
              >
                {spd}x
              </button>
            ))}
          </div>
        </div>

        {/* 24-Hour Slider Bar */}
        <div className="flex-1 flex items-center gap-1.5 px-1 min-w-0">
          <input
            type="range"
            min={0}
            max={24}
            step={0.1}
            value={meteoState.timeHours}
            onChange={(e) => onSetTime(parseFloat(e.target.value))}
            className="w-full accent-cyan-400 h-2 bg-gradient-to-r from-slate-900 via-sky-600 to-slate-900 rounded-lg cursor-pointer"
          />
        </div>

        {/* Quick Toggle: Day ↔ Night (Essential on Mobile & Desktop) */}
        {onToggleDayNight && (
          <button
            onClick={onToggleDayNight}
            className="flex items-center gap-1 px-2.5 py-1 rounded-lg bg-slate-900 hover:bg-slate-800 text-cyan-300 font-semibold text-xs border border-cyan-500/30 whitespace-nowrap shrink-0 transition-colors"
            title="Beralih langsung antara Siang (Angin Laut) dan Malam (Angin Darat)"
          >
            <span>{meteoState.isDaytime ? '🌙 Ke Malam' : '☀️ Ke Siang'}</span>
          </button>
        )}

        {/* Desktop Quick Presets */}
        <div className="hidden lg:flex items-center gap-1 bg-slate-900/90 p-0.5 rounded-lg border border-slate-800 text-[11px] whitespace-nowrap">
          <button
            onClick={() => onSetTime(2.0)}
            className="px-1.5 py-0.5 rounded hover:bg-slate-800 text-slate-300 hover:text-white transition-colors"
          >
            02:00
          </button>
          <button
            onClick={() => onSetTime(13.5)}
            className="px-1.5 py-0.5 rounded hover:bg-slate-800 text-slate-300 hover:text-white transition-colors"
          >
            13:30
          </button>
        </div>
      </div>
    </div>
  );
};
