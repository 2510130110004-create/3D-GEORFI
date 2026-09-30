import React from 'react';
import { X, Sun, Moon, ArrowRight, Check, Ship, Wind } from 'lucide-react';

interface SideBySideCompareModalProps {
  isOpen: boolean;
  onClose: () => void;
  onJumpToTime: (timeHours: number) => void;
}

export const SideBySideCompareModal: React.FC<SideBySideCompareModalProps> = ({
  isOpen,
  onClose,
  onJumpToTime,
}) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-sm">
      <div className="w-full max-w-4xl max-h-[92vh] bg-slate-900 border border-slate-800 rounded-2xl shadow-2xl p-6 relative flex flex-col overflow-hidden">
        {/* Header */}
        <div className="flex items-center justify-between pb-4 border-b border-slate-800 shrink-0">
          <div>
            <div className="flex items-center gap-2 text-xs text-slate-400">
              <span>Ringkasan Super Cepat Geografi Kelas X</span>
              <span aria-hidden="true">·</span>
              <span>Mudah Dipahami & Dihafal</span>
            </div>
            <h3 className="text-xl font-bold text-white font-display mt-0.5 flex items-center gap-2">
              <Wind className="w-5 h-5 text-cyan-400" />
              Tabel Perbandingan: Angin Laut vs Angin Darat
            </h3>
          </div>
          <button
            onClick={onClose}
            className="p-1 text-slate-400 hover:text-white rounded-lg hover:bg-slate-800 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Scrollable Content */}
        <div className="py-4 space-y-5 overflow-y-auto pr-2 text-xs sm:text-sm">
          {/* Mnemonic Golden Rule */}
          <div className="p-3.5 bg-gradient-to-r from-cyan-950/40 via-slate-900 to-indigo-950/40 border border-cyan-800/40 rounded-xl flex items-center gap-3">
            <span className="text-2xl">💡</span>
            <div>
              <strong className="text-cyan-300 font-bold block text-sm">Rumus Emas / Jembatan Keledai:</strong>
              <p className="text-slate-300 text-xs">
                <strong>"Nama Angin = Asal Datangnya Angin"</strong>. Angin Laut bertiup <em>DARI LAUT</em> ke darat. Angin Darat bertiup <em>DARI DARAT</em> ke laut!
              </p>
            </div>
          </div>

          {/* Side by Side Comparison Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {/* ANGIN LAUT (SIANG HARI) */}
            <div className="p-5 rounded-2xl bg-slate-950/80 border-2 border-cyan-500/40 space-y-4">
              <div className="flex items-center justify-between pb-3 border-b border-slate-800">
                <div className="flex items-center gap-2">
                  <div className="p-2 bg-amber-500/20 text-amber-400 rounded-lg">
                    <Sun className="w-5 h-5" />
                  </div>
                  <div>
                    <span className="text-[11px] font-mono text-cyan-400 uppercase tracking-wider">Terjadi Siang Hari</span>
                    <h4 className="text-lg font-bold text-white font-display">ANGIN LAUT</h4>
                  </div>
                </div>
                <button
                  onClick={() => {
                    onJumpToTime(13.5);
                    onClose();
                  }}
                  className="px-2.5 py-1 text-xs font-semibold bg-cyan-400 hover:bg-cyan-300 text-slate-900 rounded-md transition-colors"
                >
                  Lihat 3D Siang
                </button>
              </div>

              <ul className="space-y-2.5 text-xs text-slate-300">
                <li className="flex items-start gap-2">
                  <Check className="w-4 h-4 text-cyan-400 shrink-0 mt-0.5" />
                  <span><strong>Suhu:</strong> Daratan <strong>LEBIH PANAS</strong> (~34°C) karena kalor jenis tanah rendah, lautan lebih dingin (~27°C).</span>
                </li>
                <li className="flex items-start gap-2">
                  <Check className="w-4 h-4 text-cyan-400 shrink-0 mt-0.5" />
                  <span><strong>Tekanan:</strong> Di atas darat <strong>RENDAH (L)</strong> karena udara panas memuai dan naik; di atas laut <strong>TINGGI (H)</strong>.</span>
                </li>
                <li className="flex items-start gap-2">
                  <Check className="w-4 h-4 text-cyan-400 shrink-0 mt-0.5" />
                  <span><strong>Arah Angin Permukaan:</strong> Bertiup dari <strong>LAUT menuju DARAT</strong> (🌊 $\to$ 🏝️).</span>
                </li>
                <li className="flex items-start gap-2">
                  <Check className="w-4 h-4 text-cyan-400 shrink-0 mt-0.5" />
                  <span><strong>Arus Balik di Langit Atas:</strong> Bertiup sebaliknya dari <strong>Darat menuju Laut</strong>.</span>
                </li>
                <li className="flex items-start gap-2">
                  <Ship className="w-4 h-4 text-emerald-400 shrink-0 mt-0.5" />
                  <span><strong>Aktivitas Nelayan:</strong> Nelayan tradisional <strong>PULANG</strong> ke pantai membawa ikan hasil tangkapan.</span>
                </li>
              </ul>
            </div>

            {/* ANGIN DARAT (MALAM HARI) */}
            <div className="p-5 rounded-2xl bg-slate-950/80 border-2 border-emerald-500/40 space-y-4">
              <div className="flex items-center justify-between pb-3 border-b border-slate-800">
                <div className="flex items-center gap-2">
                  <div className="p-2 bg-indigo-500/20 text-indigo-400 rounded-lg">
                    <Moon className="w-5 h-5" />
                  </div>
                  <div>
                    <span className="text-[11px] font-mono text-emerald-400 uppercase tracking-wider">Terjadi Malam Hari</span>
                    <h4 className="text-lg font-bold text-white font-display">ANGIN DARAT</h4>
                  </div>
                </div>
                <button
                  onClick={() => {
                    onJumpToTime(2.0);
                    onClose();
                  }}
                  className="px-2.5 py-1 text-xs font-semibold bg-emerald-400 hover:bg-emerald-300 text-slate-900 rounded-md transition-colors"
                >
                  Lihat 3D Malam
                </button>
              </div>

              <ul className="space-y-2.5 text-xs text-slate-300">
                <li className="flex items-start gap-2">
                  <Check className="w-4 h-4 text-emerald-400 shrink-0 mt-0.5" />
                  <span><strong>Suhu:</strong> Daratan <strong>LEBIH DINGIN</strong> (~22°C) karena cepat melepas panas, lautan tetap hangat (~27°C).</span>
                </li>
                <li className="flex items-start gap-2">
                  <Check className="w-4 h-4 text-emerald-400 shrink-0 mt-0.5" />
                  <span><strong>Tekanan:</strong> Di atas darat <strong>TINGGI (H)</strong> karena udara dingin memadat; di atas laut <strong>RENDAH (L)</strong>.</span>
                </li>
                <li className="flex items-start gap-2">
                  <Check className="w-4 h-4 text-emerald-400 shrink-0 mt-0.5" />
                  <span><strong>Arah Angin Permukaan:</strong> Bertiup dari <strong>DARAT menuju LAUT</strong> (🏝️ $\to$ 🌊).</span>
                </li>
                <li className="flex items-start gap-2">
                  <Check className="w-4 h-4 text-emerald-400 shrink-0 mt-0.5" />
                  <span><strong>Arus Balik di Langit Atas:</strong> Bertiup sebaliknya dari <strong>Laut menuju Darat</strong>.</span>
                </li>
                <li className="flex items-start gap-2">
                  <Ship className="w-4 h-4 text-cyan-400 shrink-0 mt-0.5" />
                  <span><strong>Aktivitas Nelayan:</strong> Nelayan tradisional <strong>BERANGKAT MELAUT</strong> menuju samudra lepas.</span>
                </li>
              </ul>
            </div>
          </div>

          {/* Quick FAQ / Kenapa Udara Bergerak */}
          <div className="p-4 bg-slate-950/60 border border-slate-800 rounded-xl space-y-2">
            <h5 className="font-bold text-white text-xs sm:text-sm">
              ❓ Pertanyaan Ujian: "Mengapa Udara Bergerak Membentuk Angin?"
            </h5>
            <p className="text-xs text-slate-300 leading-relaxed">
              Udara bergerak semata-mata karena adanya <strong>Perbedaan Tekanan Udara (Gaya Gradien Tekanan)</strong>. Sifat alamiah zat fluida selalu mengalir dari tempat yang <strong>bertekanan TINGGI ($H$)</strong> ke tempat yang <strong>bertekanan RENDAH ($L$)</strong>, persis seperti air yang selalu mengalir dari tempat tinggi ke tempat yang lebih rendah!
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};
