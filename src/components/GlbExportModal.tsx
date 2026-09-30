import React, { useState } from 'react';
import { GLB_TARGETS } from '../utils/glbExporter';
import { X, Download, Check, FileCode, Layers, Info } from 'lucide-react';

interface GlbExportModalProps {
  isOpen: boolean;
  onClose: () => void;
  onExport: (targetId: string, filename: string) => Promise<boolean>;
}

export const GlbExportModal: React.FC<GlbExportModalProps> = ({
  isOpen,
  onClose,
  onExport,
}) => {
  const [downloadingId, setDownloadingId] = useState<string | null>(null);
  const [downloadedList, setDownloadedList] = useState<string[]>([]);
  const [showCodeSnippet, setShowCodeSnippet] = useState(false);

  if (!isOpen) return null;

  const handleDownload = async (targetId: string, filename: string) => {
    setDownloadingId(targetId);
    try {
      const success = await onExport(targetId, filename);
      if (success) {
        setDownloadedList((prev) => [...prev, targetId]);
      }
    } catch (e) {
      console.error('Download error:', e);
    } finally {
      setDownloadingId(null);
    }
  };

  const handleDownloadAll = async () => {
    for (const target of GLB_TARGETS) {
      await handleDownload(target.id, target.filename);
      // Brief pause between browser download dialogs
      await new Promise((res) => setTimeout(res, 400));
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-sm">
      <div className="w-full max-w-4xl max-h-[90vh] bg-slate-900 border border-slate-800 rounded-2xl shadow-2xl p-6 relative flex flex-col overflow-hidden">
        {/* Header */}
        <div className="flex items-center justify-between pb-4 border-b border-slate-800 shrink-0">
          <div>
            <div className="flex items-center gap-2 text-xs text-slate-400">
              <span>Format Standar 3D WebGL</span>
              <span aria-hidden="true">·</span>
              <span>Kompatibel THREE.GLTFLoader</span>
            </div>
            <h3 className="text-xl font-bold text-white font-display mt-0.5 flex items-center gap-2">
              <Download className="w-5 h-5 text-indigo-400" />
              Pusat Unduhan Aset 3D Edukasi (.GLB)
            </h3>
          </div>
          <button
            onClick={onClose}
            className="p-1 text-slate-400 hover:text-white rounded-lg hover:bg-slate-800 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Info Banner */}
        <div className="p-3 bg-indigo-950/30 border border-indigo-800/40 rounded-xl my-3 flex items-start justify-between gap-3 text-xs shrink-0">
          <div className="flex items-start gap-2">
            <Info className="w-4 h-4 text-indigo-400 shrink-0 mt-0.5" />
            <p className="text-slate-300">
              Aset 3D ini diekspor langsung dalam format biner standar <strong>.GLB</strong> yang dioptimalkan untuk browser web, Three.js, Blender, dan platform pembelajaran HTML5 dengan topologi bersih dan efisiensi memori tinggi.
            </p>
          </div>
          <button
            onClick={() => setShowCodeSnippet(!showCodeSnippet)}
            className="px-2.5 py-1 bg-slate-800 hover:bg-slate-700 text-indigo-300 rounded border border-indigo-700/50 whitespace-nowrap transition-colors flex items-center gap-1 font-medium"
          >
            <FileCode className="w-3.5 h-3.5" />
            {showCodeSnippet ? 'Tutup Kode HTML5' : 'Contoh Kode Tiga.js'}
          </button>
        </div>

        {/* Code Snippet Box (Toggleable) */}
        {showCodeSnippet && (
          <div className="p-3.5 bg-slate-950 border border-slate-800 rounded-xl mb-3 text-xs font-mono text-cyan-300 overflow-x-auto shrink-0 space-y-1">
            <div className="text-slate-500 font-sans text-[11px] mb-1">
              Contoh Memuat Aset di Tiga.js (JavaScript / HTML5):
            </div>
            <div>import &#123; GLTFLoader &#125; from 'three/examples/jsm/loaders/GLTFLoader.js';</div>
            <div>const loader = new GLTFLoader();</div>
            <div>loader.load('land.glb', (gltf) =&gt; &#123;</div>
            <div className="pl-4">scene.add(gltf.scene);</div>
            <div>&#125;);</div>
          </div>
        )}

        {/* Master Action: Download Complete Environment */}
        <div className="p-4 bg-slate-950 border border-slate-800 rounded-xl mb-4 flex items-center justify-between gap-3 shrink-0">
          <div>
            <div className="font-bold text-white text-sm flex items-center gap-2">
              <Layers className="w-4 h-4 text-cyan-400" />
              Paket Komplit: Semua 10 Aset .GLB (Atau Full Scene)
            </div>
            <p className="text-xs text-slate-400 mt-0.5">
              Unduh sekaligus seluruh komponen daratan, laut, atmosfer, partikel, awan, dan perahu nelayan.
            </p>
          </div>
          <div className="flex items-center gap-2">
            <button
              onClick={() => handleDownload('full_scene', 'full_scene_angin_darat_laut.glb')}
              disabled={downloadingId !== null}
              className="px-4 py-2 text-xs font-semibold text-slate-900 bg-cyan-400 hover:bg-cyan-300 rounded-lg transition-colors shadow-sm disabled:opacity-50 whitespace-nowrap flex items-center gap-1.5"
            >
              <Download className="w-4 h-4" />
              Unduh Scene Lengkap (.GLB)
            </button>
            <button
              onClick={handleDownloadAll}
              disabled={downloadingId !== null}
              className="px-4 py-2 text-xs font-medium text-slate-200 bg-slate-800 hover:bg-slate-700 border border-slate-700 rounded-lg transition-colors disabled:opacity-50 whitespace-nowrap"
            >
              Unduh 10 File Terpisah
            </button>
          </div>
        </div>

        {/* List of 10 GLB Assets */}
        <div className="space-y-2 overflow-y-auto pr-1 flex-1">
          <div className="text-xs font-semibold text-slate-400 uppercase tracking-wider mb-1">
            Daftar Komponen Terpisah (Format .GLB):
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-2.5">
            {GLB_TARGETS.map((target) => {
              const isDownloaded = downloadedList.includes(target.id);
              const isCurrent = downloadingId === target.id;

              return (
                <div
                  key={target.id}
                  className="p-3 bg-slate-950/70 border border-slate-800/80 rounded-xl hover:border-slate-700 transition-colors flex items-center justify-between gap-3"
                >
                  <div className="space-y-0.5 min-w-0">
                    <div className="flex items-center gap-2">
                      <span className="font-semibold text-xs text-slate-200 truncate">
                        {target.name}
                      </span>
                    </div>
                    <div className="text-[11px] font-mono text-cyan-400">
                      {target.filename}
                    </div>
                    <p className="text-[11px] text-slate-400 leading-snug truncate">
                      {target.description}
                    </p>
                  </div>

                  <button
                    onClick={() => handleDownload(target.id, target.filename)}
                    disabled={isCurrent}
                    className={`shrink-0 px-3 py-1.5 rounded-lg text-xs font-medium transition-colors flex items-center gap-1.5 ${
                      isDownloaded
                        ? 'bg-emerald-950/60 border border-emerald-700 text-emerald-300 hover:bg-emerald-900/60'
                        : 'bg-slate-800 border border-slate-700 text-slate-200 hover:bg-slate-700'
                    }`}
                  >
                    {isCurrent ? (
                      <span className="animate-pulse">Mengekspor...</span>
                    ) : isDownloaded ? (
                      <>
                        <Check className="w-3.5 h-3.5 text-emerald-400" />
                        <span>Unduh Lagi</span>
                      </>
                    ) : (
                      <>
                        <Download className="w-3.5 h-3.5" />
                        <span>Unduh .GLB</span>
                      </>
                    )}
                  </button>
                </div>
              );
            })}
          </div>
        </div>
      </div>
    </div>
  );
};
