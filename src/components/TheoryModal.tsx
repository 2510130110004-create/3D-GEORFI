import React from 'react';
import { X, BookOpen, Sun, Moon, ArrowRight, ShieldCheck } from 'lucide-react';

interface TheoryModalProps {
  isOpen: boolean;
  onClose: () => void;
  onJumpToTime: (timeHours: number) => void;
}

export const TheoryModal: React.FC<TheoryModalProps> = ({
  isOpen,
  onClose,
  onJumpToTime,
}) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-sm">
      <div className="w-full max-w-4xl max-h-[90vh] bg-slate-900 border border-slate-800 rounded-2xl shadow-2xl p-6 relative flex flex-col overflow-hidden">
        {/* Header */}
        <div className="flex items-center justify-between pb-4 border-b border-slate-800 shrink-0">
          <div>
            <div className="flex items-center gap-2 text-xs text-slate-400">
              <span>Materi Geografi Kelas X SMA</span>
              <span aria-hidden="true">·</span>
              <span>Dinamika Atmosfer & Cuaca</span>
            </div>
            <h3 className="text-xl font-bold text-white font-display mt-0.5 flex items-center gap-2">
              <BookOpen className="w-5 h-5 text-cyan-400" />
              Teori Lengkap Proses Terjadinya Angin Darat & Angin Laut
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
        <div className="py-4 space-y-6 overflow-y-auto pr-2 text-sm text-slate-300 leading-relaxed">
          {/* Infographic Banner */}
          <div className="rounded-xl overflow-hidden border border-slate-800 bg-slate-950">
            <img
              src="/src/assets/images/angin_darat_laut_diagram_1790780586548.jpg"
              alt="Diagram Ilmiah Siklus Konveksi Angin Darat dan Angin Laut"
              referrerPolicy="no-referrer"
              className="w-full h-auto object-cover max-h-72"
              onError={(e) => {
                (e.target as HTMLElement).style.display = 'none';
              }}
            />
            <div className="p-3 text-xs text-slate-400 flex items-center justify-between">
              <span>Gambar 1. Sirkulasi Sel Konveksi Lokal di Wilayah Pesisir Pantai</span>
              <span className="text-cyan-400 font-medium">Kurikulum Geografi SMA</span>
            </div>
          </div>

          {/* Section 1: Kapasitas Kalor Jenis */}
          <div className="space-y-2">
            <h4 className="text-base font-bold text-white font-display flex items-center gap-2">
              <span className="text-cyan-400 font-mono">01.</span>
              Akar Penyebab: Perbedaan Kapasitas Kalor Jenis
            </h4>
            <p>
              Mengapa daratan dan lautan memiliki suhu yang berbeda meskipun menerima radiasi sinar matahari yang sama?
              Kuncinya terletak pada <strong>Kapasitas Kalor Jenis ($c$)</strong>:
            </p>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-3 pt-1">
              <div className="p-3.5 bg-slate-950/80 border border-slate-800 rounded-xl space-y-1">
                <div className="font-semibold text-rose-400 text-xs">🏖️ Daratan (Tanah & Batuan)</div>
                <div className="font-mono text-xs text-slate-400">c ≈ 800 J/kg·°C</div>
                <p className="text-xs text-slate-300">
                  Memiliki kalor jenis <strong>rendah</strong>. Hanya membutuhkan sedikit energi untuk menaikkan suhu 1°C. Akibatnya:
                  <strong className="text-slate-100"> cepat panas di siang hari dan cepat dingin di malam hari</strong>.
                </p>
              </div>
              <div className="p-3.5 bg-slate-950/80 border border-slate-800 rounded-xl space-y-1">
                <div className="font-semibold text-cyan-400 text-xs">🌊 Lautan (Air)</div>
                <div className="font-mono text-xs text-slate-400">c ≈ 4184 J/kg·°C (5x lebih besar)</div>
                <p className="text-xs text-slate-300">
                  Memiliki kalor jenis <strong>sangat tinggi</strong> serta transparansi yang menyebarkan panas ke kedalaman. Akibatnya:
                  <strong className="text-slate-100"> lambat panas di siang hari dan lambat dingin di malam hari</strong>.
                </p>
              </div>
            </div>
          </div>

          {/* Section 2: Angin Laut (Siang Hari) */}
          <div className="p-4 bg-slate-950/90 border-l-4 border-cyan-400 rounded-r-xl space-y-2">
            <div className="flex items-center justify-between">
              <h4 className="text-base font-bold text-white font-display flex items-center gap-2">
                <Sun className="w-4 h-4 text-amber-400" />
                Mekanisme Angin Laut (Terjadi Siang Hari)
              </h4>
              <button
                onClick={() => {
                  onJumpToTime(13.5);
                  onClose();
                }}
                className="text-xs text-cyan-400 hover:text-cyan-300 flex items-center gap-1 font-semibold"
              >
                Simulasikan 13:30 Siang
                <ArrowRight className="w-3.5 h-3.5" />
              </button>
            </div>
            <ol className="list-decimal list-inside space-y-1 text-xs text-slate-300">
              <li>Matahari memanaskan daratan dan lautan sejak pagi.</li>
              <li>Daratan memanas jauh lebih cepat $\implies$ <strong>Suhu daratan &gt; Suhu laut</strong>.</li>
              <li>Udara di atas daratan memuai, massa jenisnya turun, dan membubung naik (updraft konveksi).</li>
              <li>Daerah daratan menjadi <strong>Pusat Tekanan Rendah (Thermal Low / L)</strong>.</li>
              <li>Lautan yang relatif dingin memiliki udara padat bertekanan lebih tinggi <strong>(High Pressure / H)</strong>.</li>
              <li>Gaya Gradien Tekanan mendorong massa udara dari laut menuju darat $\implies$ <strong>ANGIN LAUT</strong>.</li>
            </ol>
          </div>

          {/* Section 3: Angin Darat (Malam Hari) */}
          <div className="p-4 bg-slate-950/90 border-l-4 border-emerald-400 rounded-r-xl space-y-2">
            <div className="flex items-center justify-between">
              <h4 className="text-base font-bold text-white font-display flex items-center gap-2">
                <Moon className="w-4 h-4 text-cyan-300" />
                Mekanisme Angin Darat (Terjadi Malam Hari)
              </h4>
              <button
                onClick={() => {
                  onJumpToTime(2.0);
                  onClose();
                }}
                className="text-xs text-emerald-400 hover:text-emerald-300 flex items-center gap-1 font-semibold"
              >
                Simulasikan 02:00 Malam
                <ArrowRight className="w-3.5 h-3.5" />
              </button>
            </div>
            <ol className="list-decimal list-inside space-y-1 text-xs text-slate-300">
              <li>Matahari terbenam; bumi mengalami pendinginan radiatif (radiational cooling).</li>
              <li>Daratan kehilangan panas jauh lebih cepat daripada lautan $\implies$ <strong>Suhu daratan &lt; Suhu laut</strong>.</li>
              <li>Udara di atas laut yang relatif hangat memuai dan naik ke atmosfer atas.</li>
              <li>Tekanan di atas laut menjadi relatif lebih rendah <strong>(Low Pressure / L)</strong>.</li>
              <li>Udara di atas daratan menjadi dingin, memadat, dan membentuk <strong>Tekanan Tinggi (High Pressure / H)</strong>.</li>
              <li>Udara bergerak dari darat menuju laut $\implies$ <strong>ANGIN DARAT</strong>.</li>
            </ol>
          </div>

          {/* Section 4: Sel Sirkulasi Tertutup (Arus Balik) */}
          <div className="space-y-2">
            <h4 className="text-base font-bold text-white font-display flex items-center gap-2">
              <span className="text-cyan-400 font-mono">03.</span>
              Konsep Krusial: Sirkulasi Konveksi Tertutup & Arus Balik
            </h4>
            <p>
              Banyak siswa salah mengira angin hanya bergerak satu arah di permukaan. Faktanya, atmosfer selalu menjaga keseimbangan massa melalui <strong>sirkulasi sel tertutup (closed-loop convection)</strong>:
            </p>
            <ul className="list-disc list-inside text-xs text-slate-300 space-y-1">
              <li>Saat <strong>Angin Laut</strong> bertiup di permukaan (Laut $\to$ Darat), di lapisan atmosfer atas (ketinggian ~1-2 km) terjadi <strong>Arus Balik (Return Flow)</strong> yang bertiup dari Darat $\to$ Laut!</li>
              <li>Saat <strong>Angin Darat</strong> bertiup di permukaan (Darat $\to$ Laut), di lapisan atmosfer atas terjadi arus balik dari Laut $\to$ Darat.</li>
            </ul>
          </div>

          {/* Section 5: Sosio-Geografi & Nelayan Tradisional */}
          <div className="p-4 bg-indigo-950/30 border border-indigo-800/40 rounded-xl space-y-2">
            <h4 className="text-sm font-bold text-indigo-300 font-display flex items-center gap-2">
              <ShieldCheck className="w-4 h-4 text-indigo-400" />
              Penerapan Nyata: Kearifan Lokal Nelayan Tradisional Indonesia
            </h4>
            <p className="text-xs text-slate-300">
              Sebelum adanya mesin motor modern, para nelayan tradisional Nusantara sangat bergantung pada kearifan membaca angin lokal:
            </p>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-1 text-xs">
              <div className="p-2.5 bg-slate-900/80 rounded-lg border border-slate-800">
                <span className="font-semibold text-white">🌙 Malam Hari (20:00 - 04:00):</span>
                <p className="text-slate-300 mt-0.5">
                  Berangkat melaut memanfaatkan dorongan <strong>Angin Darat</strong> untuk mendorong perahu layar menuju perairan lepas tempat berkumpulnya ikan.
                </p>
              </div>
              <div className="p-2.5 bg-slate-900/80 rounded-lg border border-slate-800">
                <span className="font-semibold text-white">☀️ Siang Hari (10:00 - 15:00):</span>
                <p className="text-slate-300 mt-0.5">
                  Pulang ke pantai membawa hasil tangkapan dibantu dorongan <strong>Angin Laut</strong> yang bertiup kembali menuju daratan.
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
