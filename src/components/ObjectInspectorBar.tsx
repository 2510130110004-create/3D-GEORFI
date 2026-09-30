import React from 'react';

export type FocusObjectId =
  | 'all'
  | 'land'
  | 'sea'
  | 'wind'
  | 'boat'
  | 'windsock'
  | 'lighthouse'
  | 'cloud'
  | 'sun_moon';

export interface Object3DInfo {
  id: FocusObjectId;
  name: string;
  icon: string;
  shortDesc: string;
  camPos: [number, number, number];
  lookAt: [number, number, number];
  geographyRole: string;
}

export const OBJECTS_3D_LIST: Object3DInfo[] = [
  {
    id: 'all',
    name: 'Panorama Semua Objek',
    icon: '🌐',
    shortDesc: 'Tampilan keseluruhan pulau, laut, angin, dan atmosfer.',
    camPos: [0, 10.0, 24.0],
    lookAt: [0, 2.5, 0],
    geographyRole: 'Siklus lengkap sirkulasi termal antara daratan dan lautan.',
  },
  {
    id: 'land',
    name: 'Daratan & Perbukitan',
    icon: '🏝️',
    shortDesc: 'Daratan berbatu dan perbukitan berpasir pantai.',
    camPos: [-6.5, 4.2, 9.5],
    lookAt: [-6.0, 1.8, 0],
    geographyRole: 'Kalor jenis rendah (cepat panas di siang hari, cepat dingin di malam hari).',
  },
  {
    id: 'sea',
    name: 'Lautan & Teluk Samudra',
    icon: '🌊',
    shortDesc: 'Air laut jernih bergelombang dengan paparan benua.',
    camPos: [7.5, 3.8, 10.5],
    lookAt: [6.5, 0.2, 0],
    geographyRole: 'Kalor jenis tinggi (suhu stabil, lambat menyerap maupun melepas panas).',
  },
  {
    id: 'wind',
    name: 'Aliran Sirkulasi Angin',
    icon: '💨',
    shortDesc: 'Pita streamline angin permukaan dan arus balik atmosfer atas.',
    camPos: [0, 4.5, 19.0],
    lookAt: [0, 2.8, 0],
    geographyRole: 'Mengalir dari daerah tekanan tinggi (H) ke tekanan rendah (L).',
  },
  {
    id: 'boat',
    name: 'Perahu Cadik Nelayan',
    icon: '🛶',
    shortDesc: 'Perahu kayu tradisional dengan cadik bambu dan layar berkibar.',
    camPos: [5.2, 1.6, 2.2],
    lookAt: [4.0, 0.3, -1.8],
    geographyRole: 'Memanfaatkan angin darat untuk melaut malam hari, dan angin laut untuk pulang siang hari.',
  },
  {
    id: 'windsock',
    name: 'Kantong Angin BMKG',
    icon: '🚩',
    shortDesc: 'Indikator arah dan kecepatan hembusan angin di tepi pantai.',
    camPos: [-0.6, 1.5, 6.2],
    lookAt: [-0.6, 1.8, 3.2],
    geographyRole: 'Alat meteorologi nyata untuk mengamati arah tiupan angin fisik di pesisir.',
  },
  {
    id: 'lighthouse',
    name: 'Mercusuar Pesisir',
    icon: '🗼',
    shortDesc: 'Menara suar pemandu navigasi di tebing tanjung pantai.',
    camPos: [-9.5, 5.2, -1.2],
    lookAt: [-10.5, 4.0, -4.5],
    geographyRole: 'Memandu kapal dan perahu nelayan saat melaut di tengah gelapnya malam.',
  },
  {
    id: 'cloud',
    name: 'Awan Kumulus Konveksi',
    icon: '☁️',
    shortDesc: 'Gumpalan awan kumulus hasil kondensasi uap air konvektif.',
    camPos: [-4.2, 7.5, 7.0],
    lookAt: [-4.5, 5.2, 0],
    geographyRole: 'Terbentuk saat udara panas memuai naik ke lapisan atmosfer yang lebih dingin.',
  },
  {
    id: 'sun_moon',
    name: 'Matahari & Bulan',
    icon: '☀️',
    shortDesc: 'Benda langit pengatur radiasi energi dan siklus harian bumi.',
    camPos: [0, 8.5, 23.0],
    lookAt: [0, 10.0, -10.0],
    geographyRole: 'Radiasi surya memicu pemanasan siang hari; ketiadaannya memicu pendinginan malam.',
  },
];

interface ObjectInspectorBarProps {
  activeObjectId: FocusObjectId;
  onSelectObject: (id: FocusObjectId) => void;
  onOpenStudio: (id: FocusObjectId) => void;
}

/**
 * Clean, compact horizontal selector bar allowing students to inspect
 * each 3D object one by one with smooth camera navigation!
 */
export const ObjectInspectorBar: React.FC<ObjectInspectorBarProps> = ({
  activeObjectId,
  onSelectObject,
  onOpenStudio,
}) => {
  const currentObj = OBJECTS_3D_LIST.find((o) => o.id === activeObjectId) || OBJECTS_3D_LIST[0];

  return (
    <div className="w-full bg-slate-900/90 border-b border-slate-800 px-3 py-1.5 flex flex-col sm:flex-row sm:items-center justify-between gap-1.5 shrink-0 z-20 text-xs select-none">
      {/* Scrollable list of 3D object buttons */}
      <div className="flex items-center gap-1 overflow-x-auto py-0.5 scrollbar-none">
        <span className="text-[11px] font-semibold text-slate-400 mr-1 shrink-0 hidden md:inline">
          Pilih Objek 3D:
        </span>
        {OBJECTS_3D_LIST.map((obj) => {
          const isActive = activeObjectId === obj.id;
          return (
            <button
              key={obj.id}
              onClick={() => onSelectObject(obj.id)}
              className={`flex items-center gap-1 px-2.5 py-1 rounded-lg text-xs font-semibold whitespace-nowrap transition-all shrink-0 ${
                isActive
                  ? 'bg-cyan-500 text-slate-950 shadow-md font-bold'
                  : 'bg-slate-800/80 hover:bg-slate-700 text-slate-300 hover:text-white'
              }`}
            >
              <span>{obj.icon}</span>
              <span>{obj.name}</span>
            </button>
          );
        })}
      </div>

      {/* Quick Info & 3D Studio Button */}
      {activeObjectId !== 'all' && (
        <div className="flex items-center justify-between sm:justify-end gap-2 shrink-0">
          <span className="text-[11px] text-cyan-300 truncate max-w-xs hidden lg:inline">
            💡 {currentObj.geographyRole}
          </span>
          <button
            onClick={() => onOpenStudio(activeObjectId)}
            className="flex items-center gap-1 px-2.5 py-1 rounded-lg bg-indigo-600 hover:bg-indigo-500 text-white font-bold text-xs shadow-sm transition-colors whitespace-nowrap"
            title="Buka studio 3D untuk memutar dan mengamati objek ini secara 360 derajat"
          >
            <span>🔍 Studio 360°</span>
          </button>
        </div>
      )}
    </div>
  );
};
