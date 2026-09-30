import React, { useState } from 'react';
import { GeoQuizQuestion } from '../types/geography';
import { X, CheckCircle, AlertCircle, ChevronRight, RotateCcw } from 'lucide-react';

const GEO_QUIZ_QUESTIONS: GeoQuizQuestion[] = [
  {
    id: 1,
    question: 'Pada siang hari yang terik, permukaan manakah yang mengalami peningkatan suhu lebih cepat, dan apa penyebab fisisnya?',
    options: [
      'Daratan, karena tanah dan batuan memiliki kapasitas kalor jenis yang lebih rendah daripada air laut',
      'Lautan, karena air menyerap seluruh radiasi matahari tanpa melepaskannya',
      'Keduanya memanas dengan laju yang persis sama karena menerima intensitas sinar matahari yang sama',
      'Lautan, karena air memiliki transparansi yang memusatkan panas di permukaan',
    ],
    correctIndex: 0,
    explanation: 'Daratan memiliki kapasitas kalor jenis (c ≈ 800 J/kg°C) yang jauh lebih rendah daripada air (c ≈ 4184 J/kg°C). Akibatnya, daratan menyerap panas dan menaikkan suhunya jauh lebih cepat di siang hari.',
    pedagogicalCore: 'Hubungan Kalor Jenis Batuan vs Air Laut',
  },
  {
    id: 2,
    question: 'Mengapa udara di atas daratan yang memanas pada siang hari menyebabkan terbentuknya pusat tekanan udara rendah (L)?',
    options: [
      'Karena udara dingin turun dan menekan permukaan',
      'Karena udara hangat memuai, massa jenisnya berkurang (lebih ringan), lalu membubung naik ke atmosfer',
      'Karena udara di atas darat mengembun menjadi air hujan yang berat',
      'Karena angin laut menarik molekul oksigen ke laut',
    ],
    correctIndex: 1,
    explanation: 'Pemanasan daratan membuat molekul udara mengembang (memuai). Kerapatannya turun drastis sehingga udara naik (updraft konveksi), meninggalkan daerah bertekanan udara relatif lebih rendah di permukaan.',
    pedagogicalCore: 'Pemuaian Udara & Pembentukan Tekanan Rendah',
  },
  {
    id: 3,
    question: 'Berdasarkan hukum pergerakan udara akibat perbedaan tekanan, ke manakah arah tiupan angin permukaan pada siang hari (Angin Laut)?',
    options: [
      'Darat → Laut',
      'Laut → Darat',
      'Atas → Bawah tanpa aliran horizontal',
      'Tidak bergerak karena seimbang',
    ],
    correctIndex: 1,
    explanation: 'Udara selalu mengalir dari daerah bertekanan tinggi (H) ke daerah bertekanan rendah (L). Pada siang hari, tekanan di atas laut relatif lebih tinggi daripada daratan, sehingga angin bertiup dari LAUT ke DARAT (Angin Laut).',
    pedagogicalCore: 'Gaya Gradien Tekanan Menghasilkan Angin Laut',
  },
  {
    id: 4,
    question: 'Pada malam hari, mengapa arah angin berbalik bertiup dari daratan menuju ke lautan (Angin Darat)?',
    options: [
      'Karena daratan mendingin lebih cepat sedangkan laut tetap hangat, menciptakan tekanan tinggi di darat dan tekanan rendah di laut',
      'Karena gravitasi bulan menarik udara darat ke lautan',
      'Karena tumbuhan di daratan menghasilkan oksigen bertekanan tinggi',
      'Karena ombak laut mendorong udara kembali ke pantai',
    ],
    correctIndex: 0,
    explanation: 'Daratan melepaskan radiasi panas lebih cepat di malam hari sehingga menjadi dingin (Tekanan Tinggi / H). Lautan yang menyimpan panas tetap relatif hangat (Tekanan Rendah / L). Udara mengalir dari darat ke laut (Angin Darat).',
    pedagogicalCore: 'Mekanisme Pembalikan Angin Darat di Malam Hari',
  },
  {
    id: 5,
    question: 'Bagaimanakah nelayan tradisional Indonesia memanfaatkan fenomena angin lokal ini dalam rutinitas mata pencaharian mereka?',
    options: [
      'Berangkat melaut di siang hari dengan angin laut, dan pulang di malam hari dengan angin darat',
      'Berangkat melaut di malam hari dengan bantuan Angin Darat, dan kembali pulang di siang hari dibantu Angin Laut',
      'Berlayar hanya pada sore hari saat tidak ada angin',
      'Menunggu badai siklon tropis untuk mempercepat perahu',
    ],
    correctIndex: 1,
    explanation: 'Nelayan memanfaatkan tiupan Angin Darat (malam hari) untuk mendorong perahu layar meluncur ke tengah laut, dan memanfaatkan Angin Laut (siang hari) untuk berlayar pulang merapat ke pantai.',
    pedagogicalCore: 'Aplikasi Kearifan Lokal Nelayan Tradisional',
  },
  {
    id: 6,
    question: 'Apa yang terjadi pada lapisan atmosfer atas saat angin laut bertiup di permukaan bumi (Sirkulasi Konveksi Tertutup)?',
    options: [
      'Tidak ada pergerakan udara di atmosfer atas',
      'Terjadi arus balik (return flow) di lapisan atas dari arah daratan menuju ke lautan',
      'Udara di atmosfer atas bergerak searah dengan angin permukaan',
      'Udara langsung keluar menuju luar angkasa',
    ],
    correctIndex: 1,
    explanation: 'Untuk menjaga kekekalan massa atmosfer, sirkulasi konveksi membentuk loop tertutup. Udara yang naik di atas daratan mengalir kembali di atmosfer atas menuju ke laut untuk kemudian turun kembali (subsidence).',
    pedagogicalCore: 'Sirkulasi Sel Tertutup (Closed Loop Return Flow)',
  },
];

interface GeoQuizModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSetSimulationTime: (hours: number) => void;
}

export const GeoQuizModal: React.FC<GeoQuizModalProps> = ({
  isOpen,
  onClose,
  onSetSimulationTime,
}) => {
  const [currentIdx, setCurrentIdx] = useState(0);
  const [selectedAnswers, setSelectedAnswers] = useState<Record<number, number>>({});
  const [showExplanation, setShowExplanation] = useState(false);
  const [isFinished, setIsFinished] = useState(false);

  if (!isOpen) return null;

  const currentQ = GEO_QUIZ_QUESTIONS[currentIdx];
  const totalQuestions = GEO_QUIZ_QUESTIONS.length;
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
      setShowExplanation(selectedAnswers[GEO_QUIZ_QUESTIONS[currentIdx + 1].id] !== undefined);
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
    const q = GEO_QUIZ_QUESTIONS.find((item) => item.id === parseInt(qId, 10));
    return q && q.correctIndex === ans ? acc + 1 : acc;
  }, 0);

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-sm">
      <div className="w-full max-w-xl bg-slate-900 border border-slate-800 rounded-2xl shadow-2xl p-6 relative overflow-hidden">
        {/* Header */}
        <div className="flex items-center justify-between pb-4 border-b border-slate-800">
          <div>
            <div className="flex items-center gap-2 text-xs text-slate-400">
              <span>Uji Kompetensi Geografi Kelas X</span>
              <span aria-hidden="true">·</span>
              <span>Dinamika Atmosfer & Angin Lokal</span>
            </div>
            <h3 className="text-lg font-bold text-white font-display mt-0.5">
              Kuis Kausalitas Angin Darat & Laut
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
                Soal {currentIdx + 1} dari {totalQuestions}
              </span>
              <span className="text-slate-400 font-medium">
                {currentQ.pedagogicalCore}
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
                    className={`w-full text-left p-3 rounded-lg border text-xs sm:text-sm font-medium transition-colors flex items-center justify-between gap-2 ${btnStyle}`}
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
                  <strong className="text-cyan-400 font-semibold mr-1">Pembahasan Geografis:</strong>
                  {currentQ.explanation}
                </div>
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
                {currentIdx < totalQuestions - 1 ? 'Soal Berikutnya' : 'Lihat Skor Akhir'}
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
              Kuis Selesai!
            </h4>

            <div className="text-4xl font-extrabold text-cyan-400 font-mono tabular-nums">
              {score} / {totalQuestions}
            </div>

            <p className="text-sm text-slate-300 max-w-sm mx-auto leading-relaxed">
              {score >= 5
                ? 'Luar biasa! Kamu telah menguasai konsep sebab-akibat (Radiasi → Kalor Jenis → Suhu → Tekanan → Angin) secara utuh!'
                : score >= 3
                ? 'Pemahamanmu cukup baik. Gunakan slider waktu dan panel Rantai Kausalitas untuk memperdalam konsep tekanan udara.'
                : 'Jangan berkecil hati. Buka modul Teori Lengkap dan amati pergerakan partikel konveksi pada waktu siang dan malam.'}
            </p>

            <div className="flex items-center justify-center gap-3 pt-4">
              <button
                onClick={handleRestart}
                className="flex items-center gap-1.5 px-4 py-2 text-xs font-medium text-slate-300 hover:text-white bg-slate-800 hover:bg-slate-700 rounded-lg transition-colors border border-slate-700"
              >
                <RotateCcw className="w-4 h-4" />
                Ulangi Kuis
              </button>
              <button
                onClick={onClose}
                className="px-5 py-2 text-xs font-semibold text-slate-900 bg-cyan-400 hover:bg-cyan-300 rounded-lg transition-colors"
              >
                Kembali ke Simulasi 3D
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
