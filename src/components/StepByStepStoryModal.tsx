import React, { useState } from 'react';
import { X, ChevronLeft, ChevronRight, CheckCircle2, Sun, Moon } from 'lucide-react';

interface StepByStepStoryModalProps {
  isOpen: boolean;
  onClose: () => void;
  onJumpToTime: (timeHours: number) => void;
}

export const StepByStepStoryModal: React.FC<StepByStepStoryModalProps> = ({
  isOpen,
  onClose,
  onJumpToTime,
}) => {
  const [cycleType, setCycleType] = useState<'siang' | 'malam'>('siang');
  const [currentStepIdx, setCurrentStepIdx] = useState(0);

  if (!isOpen) return null;

  const siangSteps = [
    {
      num: '1',
      title: 'Matahari Bersinar Terik',
      subtitle: 'Radiasi Surya Memanaskan Bumi',
      icon: '☀️',
      text: 'Sejak pagi hingga siang, matahari memancarkan energi panas gelombang pendek secara merata ke daratan dan lautan di wilayah pesisir.',
      keyPoint: 'Sumber energi awal: Radiasi Sinar Matahari.',
    },
    {
      num: '2',
      title: 'Daratan Memanas Jauh Lebih Cepat',
      subtitle: 'Pengaruh Kapasitas Kalor Jenis Tanah Rendah',
      icon: '🏖️',
      text: 'Tanah dan bebatuan di daratan memiliki kalor jenis rendah, sehingga suhunya melonjak cepat hingga 34°C. Air laut lambat menyerap panas sehingga tetap sejuk di 27°C.',
      keyPoint: 'Hasil: Suhu Daratan > Suhu Lautan.',
    },
    {
      num: '3',
      title: 'Udara Darat Memuai & Naik',
      subtitle: 'Konveksi Vertikal ke Atmosfer',
      icon: '🔥',
      text: 'Udara di atas daratan ikut dipanaskan oleh permukaan tanah. Udara panas memuai, molekulnya merenggang (massa jenis turun), lalu membubung naik ke langit seperti balon udara!',
      keyPoint: 'Udara panas naik meninggalkan kekosongan massa udara di darat.',
    },
    {
      num: '4',
      title: 'Terbentuk Perbedaan Tekanan',
      subtitle: 'Tekanan Rendah (L) di Darat vs Tekanan Tinggi (H) di Laut',
      icon: '⚖️',
      text: 'Karena udara darat naik, permukaan daratan menjadi Pusat Tekanan Rendah (Low / L). Sebaliknya, udara di atas laut yang lebih dingin dan padat bertekanan Tinggi (High / H).',
      keyPoint: 'Udara selalu mengalir dari Tekanan TINGGI ke RENDAH.',
    },
    {
      num: '5',
      title: 'Angin Laut Meniup Menyapu Pantai',
      subtitle: 'Aliran Udara dari Laut ke Darat',
      icon: '🌊',
      text: 'Udara dingin dan segar dari atas lautan bergerak menyapu permukaan masuk ke daratan untuk mengisi kekosongan. Inilah yang kita rasakan sebagai ANGIN LAUT!',
      keyPoint: 'Arah tiupan: LAUT → DARAT (Siang hari).',
    },
    {
      num: '6',
      title: 'Nelayan Berlayar Pulang',
      subtitle: 'Pemanfaatan Nyata Bagi Kehidupan Pesisir',
      icon: '🛶',
      text: 'Nelayan tradisional di laut membentangkan layar perahu mereka. Tiupan Angin Laut mendorong perahu mereka kembali pulang merapat ke tepi pantai membawa ikan segar!',
      keyPoint: 'Aplikasi sehari-hari: Waktu kepulangan nelayan.',
    },
  ];

  const malamSteps = [
    {
      num: '1',
      title: 'Matahari Terbenam',
      subtitle: 'Pendinginan Radiatif Bumi di Malam Hari',
      icon: '🌙',
      text: 'Tanpa sinar matahari, bumi mulai melepaskan energi panasnya kembali ke angkasa luar melalui radiasi gelombang panjang.',
      keyPoint: 'Matahari hilang $\to$ Proses pendinginan dimulai.',
    },
    {
      num: '2',
      title: 'Daratan Mendingin Cepat',
      subtitle: 'Tanah Cepat Dingin, Laut Menyimpan Panas',
      icon: '❄️',
      text: 'Daratan kehilangan panasnya dengan sangat cepat sehingga suhunya turun dingin ke 22°C. Air laut yang memiliki kapasitas kalor tinggi tetap menyimpan kehangatan di 27°C.',
      keyPoint: 'Hasil: Lautan Lebih Hangat daripada Daratan.',
    },
    {
      num: '3',
      title: 'Udara Hangat Laut Naik',
      subtitle: 'Konveksi Vertikal di Atas Samudra',
      icon: '💨',
      text: 'Udara di atas permukaan laut yang relatif hangat memuai dan perlahan naik ke lapisan troposfer atas.',
      keyPoint: 'Udara hangat laut membubung naik ke atmosfer.',
    },
    {
      num: '4',
      title: 'Pusat Tekanan Udara Berbalik',
      subtitle: 'Tekanan Tinggi (H) di Darat vs Tekanan Rendah (L) di Laut',
      icon: '⚖️',
      text: 'Udara daratan yang dingin memadat dan membentuk Pusat Tekanan Tinggi (High / H). Di atas laut yang udaranya naik menjadi Pusat Tekanan Rendah (Low / L).',
      keyPoint: 'Kondisi tekanan berbalik 180° dibanding siang hari!',
    },
    {
      num: '5',
      title: 'Angin Darat Meniup ke Laut',
      subtitle: 'Aliran Udara dari Darat ke Laut',
      icon: '🏝️',
      text: 'Massa udara dingin dan padat dari daratan terdorong mengalir menuju ke lautan. Inilah fenomena ANGIN DARAT yang bertiup kencang di malam hari.',
      keyPoint: 'Arah tiupan: DARAT → LAUT (Malam hari).',
    },
    {
      num: '6',
      title: 'Nelayan Berangkat Melaut',
      subtitle: 'Mengarungi Samudra Lepas',
      icon: '⛵',
      text: 'Para nelayan tradisional memanfaatkan dorongan hembusan Angin Darat untuk meluncurkan perahu layar mereka dari pantai menuju perairan tengah samudra untuk menjaring ikan.',
      keyPoint: 'Aplikasi sehari-hari: Waktu keberangkatan nelayan.',
    },
  ];

  const steps = cycleType === 'siang' ? siangSteps : malamSteps;
  const currentStep = steps[currentStepIdx];
  const isFirst = currentStepIdx === 0;
  const isLast = currentStepIdx === steps.length - 1;

  const handleCycleSwitch = (type: 'siang' | 'malam') => {
    setCycleType(type);
    setCurrentStepIdx(0);
    onJumpToTime(type === 'siang' ? 13.5 : 2.0);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-sm">
      <div className="w-full max-w-xl bg-slate-900 border border-slate-800 rounded-2xl shadow-2xl p-6 relative overflow-hidden flex flex-col">
        {/* Header */}
        <div className="flex items-center justify-between pb-4 border-b border-slate-800">
          <div>
            <div className="text-xs text-slate-400">Cerita Bergambar 6 Langkah</div>
            <h3 className="text-base font-bold text-white font-display">
              Alur Sebab-Akibat yang Mudah Dipahami
            </h3>
          </div>
          <button
            onClick={onClose}
            className="p-1 text-slate-400 hover:text-white rounded-lg hover:bg-slate-800 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Switcher Siang vs Malam */}
        <div className="grid grid-cols-2 gap-2 my-3 p-1 bg-slate-950 rounded-xl border border-slate-800">
          <button
            onClick={() => handleCycleSwitch('siang')}
            className={`flex items-center justify-center gap-1.5 py-1.5 rounded-lg text-xs font-semibold transition-colors ${
              cycleType === 'siang'
                ? 'bg-cyan-500/20 text-cyan-300 border border-cyan-500/40 shadow-sm'
                : 'text-slate-400 hover:text-white'
            }`}
          >
            <Sun className="w-3.5 h-3.5 text-amber-400" />
            <span>Alur Siang (Angin Laut)</span>
          </button>
          <button
            onClick={() => handleCycleSwitch('malam')}
            className={`flex items-center justify-center gap-1.5 py-1.5 rounded-lg text-xs font-semibold transition-colors ${
              cycleType === 'malam'
                ? 'bg-emerald-500/20 text-emerald-300 border border-emerald-500/40 shadow-sm'
                : 'text-slate-400 hover:text-white'
            }`}
          >
            <Moon className="w-3.5 h-3.5 text-cyan-300" />
            <span>Alur Malam (Angin Darat)</span>
          </button>
        </div>

        {/* 6 Step Progress bar */}
        <div className="grid grid-cols-6 gap-1.5 mb-4">
          {steps.map((st, idx) => (
            <button
              key={st.num}
              onClick={() => setCurrentStepIdx(idx)}
              className={`h-1.5 rounded-full transition-all ${
                idx === currentStepIdx
                  ? cycleType === 'siang' ? 'bg-cyan-400' : 'bg-emerald-400'
                  : idx < currentStepIdx
                  ? 'bg-slate-600'
                  : 'bg-slate-800'
              }`}
            />
          ))}
        </div>

        {/* Step Card Content */}
        <div className="p-5 rounded-2xl bg-slate-950/80 border border-slate-800 space-y-3">
          <div className="flex items-center justify-between">
            <span className="text-3xl">{currentStep.icon}</span>
            <span className="font-mono text-xs font-bold text-slate-400">
              Langkah {currentStepIdx + 1} dari 6
            </span>
          </div>

          <div>
            <div className="text-[11px] font-mono uppercase tracking-wider text-cyan-400 font-semibold">
              {currentStep.subtitle}
            </div>
            <h4 className="text-lg font-bold text-white font-display mt-0.5">
              {currentStep.title}
            </h4>
          </div>

          <p className="text-xs sm:text-sm text-slate-300 leading-relaxed">
            {currentStep.text}
          </p>

          <div className="p-2.5 rounded-lg bg-slate-900 border border-slate-800 text-xs text-cyan-300 font-medium">
            💡 {currentStep.keyPoint}
          </div>
        </div>

        {/* Footer Navigation */}
        <div className="flex items-center justify-between pt-4 mt-3 border-t border-slate-800">
          <button
            onClick={() => setCurrentStepIdx(currentStepIdx - 1)}
            disabled={isFirst}
            className={`flex items-center gap-1 px-3 py-1.5 rounded-lg border text-xs font-semibold transition-colors ${
              isFirst
                ? 'opacity-30 border-transparent text-slate-500 cursor-not-allowed'
                : 'border-slate-700 text-slate-300 hover:bg-slate-800'
            }`}
          >
            <ChevronLeft className="w-4 h-4" />
            Langkah Sebelumnya
          </button>

          {isLast ? (
            <button
              onClick={onClose}
              className="flex items-center gap-1 px-4 py-1.5 rounded-lg bg-cyan-400 hover:bg-cyan-300 text-slate-950 text-xs font-bold transition-colors shadow-sm"
            >
              <CheckCircle2 className="w-4 h-4" />
              Selesai Paham
            </button>
          ) : (
            <button
              onClick={() => setCurrentStepIdx(currentStepIdx + 1)}
              className="flex items-center gap-1 px-4 py-1.5 rounded-lg bg-cyan-400 hover:bg-cyan-300 text-slate-950 text-xs font-bold transition-colors shadow-sm"
            >
              Langkah Berikutnya
              <ChevronRight className="w-4 h-4" />
            </button>
          )}
        </div>
      </div>
    </div>
  );
};
