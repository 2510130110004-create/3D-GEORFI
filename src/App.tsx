import { useState, useEffect, useRef } from 'react';
import { AppMode, LayerVisibility } from './types/geography';
import { calculateMeteorologicalState } from './utils/physicsEngine';
import { GeoNavigation } from './components/GeoNavigation';
import { TopStatusStrip } from './components/TopStatusStrip';
import { ObjectInspectorBar, FocusObjectId } from './components/ObjectInspectorBar';
import { GeoViewport3D } from './components/GeoViewport3D';
import { CleanControlDeck } from './components/CleanControlDeck';
import { SingleObjectStudioModal } from './components/SingleObjectStudioModal';
import { TheoryModal } from './components/TheoryModal';
import { SideBySideCompareModal } from './components/SideBySideCompareModal';
import { StepByStepStoryModal } from './components/StepByStepStoryModal';
import { GeoQuizModal } from './components/GeoQuizModal';
import { GlbExportModal } from './components/GlbExportModal';
import { coastalAudio } from './utils/audioAmbience';
import { CameraPresetType } from './components/CameraPresetBar';

export default function App() {
  const [mode, setMode] = useState<AppMode>('explore');
  const [timeHours, setTimeHours] = useState<number>(13.5); // Peak daytime sea breeze
  const [isPlaying, setIsPlaying] = useState<boolean>(true);
  const [cameraPreset] = useState<CameraPresetType>('overview');
  const [isAudioActive, setIsAudioActive] = useState<boolean>(false);
  const [activeObjectId, setActiveObjectId] = useState<FocusObjectId>('all');

  // Studio 3D modal state
  const [isStudioOpen, setIsStudioOpen] = useState(false);
  const [studioObjectId, setStudioObjectId] = useState<FocusObjectId>('boat');

  // Active essential 3D layers
  const [layers] = useState<LayerVisibility>({
    showTemperatureColors: true,
    showPressureIndicators: true,
    showConvectionParticles: true,
    showWindArrows: true,
    showUpperAtmosphereReturn: true,
    showFishermanBoats: true,
    showClouds: true,
  });

  const [isTheoryOpen, setIsTheoryOpen] = useState(false);
  const [isCompareOpen, setIsCompareOpen] = useState(false);
  const [isStoryOpen, setIsStoryOpen] = useState(false);
  const [isQuizOpen, setIsQuizOpen] = useState(false);
  const [isGlbExportOpen, setIsGlbExportOpen] = useState(false);

  const exportFnRef = useRef<((targetId: string, filename: string) => Promise<boolean>) | null>(null);
  const viewportContainerRef = useRef<HTMLDivElement>(null);

  // Compute live meteorological & causality state
  const meteoState = calculateMeteorologicalState(timeHours);

  // Auto-play timer for 24-hour cycle
  useEffect(() => {
    if (!isPlaying) return;

    const interval = setInterval(() => {
      setTimeHours((prev) => {
        return (prev + 0.04) % 24.0;
      });
    }, 50);

    return () => clearInterval(interval);
  }, [isPlaying]);

  const handleToggleAudio = () => {
    const active = coastalAudio.toggleMute();
    setIsAudioActive(active);
  };

  const handleResetCamera = () => {
    setActiveObjectId('all');
    setTimeHours(13.5);
    setIsPlaying(true);
  };

  const handleExportGlb = async (targetId: string, filename: string): Promise<boolean> => {
    if (exportFnRef.current) {
      return await exportFnRef.current(targetId, filename);
    }
    return false;
  };

  // Instant switch between Day (Angin Laut) and Night (Angin Darat)
  const handleToggleDayNight = () => {
    if (meteoState.isDaytime) {
      setTimeHours(2.0); // Switch to night (Angin Darat)
    } else {
      setTimeHours(13.5); // Switch to day (Angin Laut)
    }
    setIsPlaying(false);
  };

  const handleOpenStudio = (id: FocusObjectId) => {
    setStudioObjectId(id === 'all' ? 'boat' : id);
    setIsStudioOpen(true);
  };

  return (
    <div className="flex flex-col h-screen w-screen overflow-hidden bg-slate-950 text-slate-100 select-none">
      {/* 1. Header Navigasi Atas */}
      <GeoNavigation
        mode={mode}
        onSelectMode={setMode}
        onOpenGlbExport={() => setIsGlbExportOpen(true)}
        onResetCamera={handleResetCamera}
        isAudioActive={isAudioActive}
        onToggleAudio={handleToggleAudio}
        onOpenTheory={() => setIsTheoryOpen(true)}
        onOpenQuiz={() => setIsQuizOpen(true)}
      />

      {/* 2. Pita Status Cuaca & Angin (Docked di bawah navigasi, TIDAK menutupi kanvas 3D) */}
      <TopStatusStrip meteoState={meteoState} />

      {/* 3. Bar Pemilih Objek 3D Satu per Satu */}
      <ObjectInspectorBar
        activeObjectId={activeObjectId}
        onSelectObject={(id) => setActiveObjectId(id)}
        onOpenStudio={handleOpenStudio}
      />

      {/* 4. Panggung 3D Utama (100% BEBAS DARI MENU, Kamera Fokus ke Objek Pilihan) */}
      <main className="relative flex-1 w-full h-full overflow-hidden bg-slate-950">
        <div ref={viewportContainerRef} className="w-full h-full">
          <GeoViewport3D
            meteoState={meteoState}
            layers={layers}
            cameraPreset={cameraPreset}
            targetObjectId={activeObjectId}
            onSceneReady={(exportFn) => {
              exportFnRef.current = exportFn;
            }}
          />
        </div>
      </main>

      {/* 5. Konsol Kontrol Bawah (Docked di footer bawah, BUKAN overlay di atas 3D) */}
      <CleanControlDeck
        meteoState={meteoState}
        onSetTime={(t) => {
          setTimeHours(t);
          setIsPlaying(false);
        }}
        isPlaying={isPlaying}
        onTogglePlay={() => setIsPlaying(!isPlaying)}
        onToggleDayNight={handleToggleDayNight}
        onOpenTheory={() => setIsTheoryOpen(true)}
      />

      {/* Studio 3D Objek Tunggal (Turntable 360° dengan Wireframe & Zoom) */}
      <SingleObjectStudioModal
        isOpen={isStudioOpen}
        objectId={studioObjectId}
        onClose={() => setIsStudioOpen(false)}
        onSelectAnother={(id) => setStudioObjectId(id)}
      />

      {/* Modal Edukatif Tambahan */}
      <TheoryModal
        isOpen={isTheoryOpen}
        onClose={() => setIsTheoryOpen(false)}
        onJumpToTime={(t) => {
          setTimeHours(t);
          setIsPlaying(false);
        }}
      />

      <SideBySideCompareModal
        isOpen={isCompareOpen}
        onClose={() => setIsCompareOpen(false)}
        onJumpToTime={(t) => {
          setTimeHours(t);
          setIsPlaying(false);
        }}
      />

      <StepByStepStoryModal
        isOpen={isStoryOpen}
        onClose={() => setIsStoryOpen(false)}
        onJumpToTime={(t) => {
          setTimeHours(t);
          setIsPlaying(false);
        }}
      />

      <GeoQuizModal
        isOpen={isQuizOpen}
        onClose={() => setIsQuizOpen(false)}
        onSetSimulationTime={(t) => {
          setTimeHours(t);
          setIsPlaying(false);
          setIsQuizOpen(false);
        }}
      />

      <GlbExportModal
        isOpen={isGlbExportOpen}
        onClose={() => setIsGlbExportOpen(false)}
        onExport={handleExportGlb}
      />
    </div>
  );
}
