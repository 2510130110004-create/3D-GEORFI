import React, { useEffect, useRef, useState } from 'react';
import * as THREE from 'three';
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls.js';
import { SimulationModel, ViewportSettings, ElementAtomInfo } from '../types';
import { createCellScene, OrganelleMeshGroup } from './scene/cellMeshes';
import { createDNAScene } from './scene/dnaMeshes';
import { createAtomScene, AtomMeshResult } from './scene/atomMeshes';
import { CELL_ORGANELLES, ELEMENT_ATOMS } from '../data/cellData';

interface Viewport3DProps {
  model: SimulationModel;
  settings: ViewportSettings;
  selectedId: string | null;
  onSelectOrganelle: (id: string | null) => void;
  selectedElement: ElementAtomInfo;
  orbitalType: 'bohr' | 'quantum';
  dnaUnzipProgress: number;
}

export const Viewport3D: React.FC<Viewport3DProps> = ({
  model,
  settings,
  selectedId,
  onSelectOrganelle,
  selectedElement,
  orbitalType,
  dnaUnzipProgress,
}) => {
  const mountRef = useRef<HTMLDivElement>(null);
  const rendererRef = useRef<THREE.WebGLRenderer | null>(null);
  const sceneRef = useRef<THREE.Scene | null>(null);
  const cameraRef = useRef<THREE.PerspectiveCamera | null>(null);
  const controlsRef = useRef<OrbitControls | null>(null);
  const animFrameRef = useRef<number | null>(null);

  // References to active groups for dynamic updates
  const cellGroupsRef = useRef<Map<string, OrganelleMeshGroup> | null>(null);
  const atomResultRef = useRef<AtomMeshResult | null>(null);
  const activeRootRef = useRef<THREE.Group | null>(null);
  const particleSysRef = useRef<THREE.Points | null>(null);

  // Camera transition state
  const targetCamPos = useRef<THREE.Vector3 | null>(null);
  const targetLookAt = useRef<THREE.Vector3 | null>(null);

  const [hoveredLabel, setHoveredLabel] = useState<{ name: string; x: number; y: number } | null>(null);

  // 1. Initialize Scene & Renderer
  useEffect(() => {
    const container = mountRef.current;
    if (!container) return;

    const width = container.clientWidth;
    const height = container.clientHeight;

    const scene = new THREE.Scene();
    sceneRef.current = scene;

    // Deep scientific obsidian background with subtle fog for depth
    scene.background = new THREE.Color(0x020617);
    scene.fog = new THREE.FogExp2(0x020617, 0.025);

    const camera = new THREE.PerspectiveCamera(45, width / height, 0.1, 100);
    camera.position.set(0, 2.5, 8.5);
    cameraRef.current = camera;

    const renderer = new THREE.WebGLRenderer({
      antialias: true,
      powerPreference: 'high-performance',
      preserveDrawingBuffer: true,
    });
    renderer.setSize(width, height);
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    renderer.toneMapping = THREE.ACESFilmicToneMapping;
    renderer.toneMappingExposure = 1.15;
    container.appendChild(renderer.domElement);
    rendererRef.current = renderer;

    const controls = new OrbitControls(camera, renderer.domElement);
    controls.enableDamping = true;
    controls.dampingFactor = 0.05;
    controls.maxDistance = 22;
    controls.minDistance = 2.0;
    controlsRef.current = controls;

    // 2. Cinematic Three-Point Lighting Rig
    const ambientLight = new THREE.AmbientLight(0xf8fafc, 0.75);
    scene.add(ambientLight);

    // Warm Key Light (Upper right)
    const keyLight = new THREE.DirectionalLight(0xfff7ed, 2.2);
    keyLight.position.set(6, 8, 7);
    scene.add(keyLight);

    // Cool Laboratory Fill Light (Lower left)
    const fillLight = new THREE.DirectionalLight(0xbae6fd, 1.4);
    fillLight.position.set(-6, -4, 4);
    scene.add(fillLight);

    // High-angle Cyan Rim Light (Sharp silhouette separation)
    const rimLight = new THREE.DirectionalLight(0x38bdf8, 2.8);
    rimLight.position.set(0, 5, -8);
    scene.add(rimLight);

    // Sub-surface soft floor bounce
    const floorBounce = new THREE.HemisphereLight(0x38bdf8, 0x020617, 0.4);
    scene.add(floorBounce);

    // Resize Handler
    const handleResize = () => {
      if (!container || !renderer || !camera) return;
      const w = container.clientWidth;
      const h = container.clientHeight;
      camera.aspect = w / h;
      camera.updateProjectionMatrix();
      renderer.setSize(w, h);
    };

    window.addEventListener('resize', handleResize);

    // Render loop
    let clock = new THREE.Clock();
    const animate = () => {
      animFrameRef.current = requestAnimationFrame(animate);
      const delta = clock.getDelta();
      const time = clock.getElapsedTime();

      // Smooth camera interpolation towards target
      if (targetCamPos.current && camera) {
        camera.position.lerp(targetCamPos.current, 0.06);
        if (camera.position.distanceTo(targetCamPos.current) < 0.05) {
          targetCamPos.current = null;
        }
      }
      if (targetLookAt.current && controls) {
        controls.target.lerp(targetLookAt.current, 0.06);
        if (controls.target.distanceTo(targetLookAt.current) < 0.05) {
          targetLookAt.current = null;
        }
      }

      // Auto-rotation when enabled
      if (settings.autoRotate && controls && !targetCamPos.current) {
        controls.autoRotate = true;
        controls.autoRotateSpeed = 1.0;
      } else if (controls) {
        controls.autoRotate = false;
      }

      // Animate cytoplasmic / metabolic particles
      if (particleSysRef.current && settings.particlesActive) {
        particleSysRef.current.rotation.y = time * 0.05;
        particleSysRef.current.rotation.x = Math.sin(time * 0.03) * 0.05;
      }

      // Bohr electrons orbiting
      if (atomResultRef.current && orbitalType === 'bohr') {
        atomResultRef.current.orbitalsGroup.children.forEach((ring, rIdx) => {
          ring.rotation.y = time * (1.2 / (rIdx + 1));
        });
      }

      controls.update();
      renderer.render(scene, camera);
    };
    animate();

    return () => {
      window.removeEventListener('resize', handleResize);
      if (animFrameRef.current) cancelAnimationFrame(animFrameRef.current);
      if (renderer.domElement.parentElement) {
        renderer.domElement.parentElement.removeChild(renderer.domElement);
      }
      renderer.dispose();
    };
  }, []);

  // 2. Rebuild 3D Model when model, cellType, renderMode, or cutaway changes
  useEffect(() => {
    const scene = sceneRef.current;
    if (!scene) return;

    // Remove previous model
    if (activeRootRef.current) {
      scene.remove(activeRootRef.current);
      activeRootRef.current = null;
    }
    cellGroupsRef.current = null;
    atomResultRef.current = null;
    particleSysRef.current = null;

    if (model === 'cell') {
      const { root, organelleGroups, particleSystem } = createCellScene(
        settings.cellType,
        settings.renderMode,
        settings.cutawayAngle
      );
      scene.add(root);
      activeRootRef.current = root;
      cellGroupsRef.current = organelleGroups;
      particleSysRef.current = particleSystem;
    } else if (model === 'dna') {
      const { root, particleSystem } = createDNAScene(settings.renderMode, dnaUnzipProgress);
      scene.add(root);
      activeRootRef.current = root;
      particleSysRef.current = particleSystem;
    } else if (model === 'atom') {
      const result = createAtomScene(selectedElement, orbitalType, settings.renderMode);
      scene.add(result.root);
      activeRootRef.current = result.root;
      atomResultRef.current = result;
    }
  }, [
    model,
    settings.cellType,
    settings.renderMode,
    settings.cutawayAngle,
    selectedElement,
    orbitalType,
    dnaUnzipProgress,
  ]);

  // 3. Update Exploded View
  useEffect(() => {
    if (model !== 'cell' || !cellGroupsRef.current) return;

    cellGroupsRef.current.forEach((info) => {
      const targetPos = info.basePosition.clone().add(
        info.explodeDirection.clone().multiplyScalar(settings.explodedView * 2.8)
      );
      info.group.position.copy(targetPos);
    });
  }, [settings.explodedView, model]);

  // 4. Smooth Camera Focus on Selected Organelle
  useEffect(() => {
    if (!selectedId || model !== 'cell') return;

    const organelle = CELL_ORGANELLES.find((o) => o.id === selectedId);
    if (!organelle || !cameraRef.current || !controlsRef.current) return;

    const [tx, ty, tz] = organelle.cameraTarget;
    targetLookAt.current = new THREE.Vector3(tx, ty, tz);

    // Compute camera offset along current view vector with preferred distance
    const currentDir = cameraRef.current.position
      .clone()
      .sub(controlsRef.current.target)
      .normalize();

    targetCamPos.current = new THREE.Vector3(tx, ty, tz).add(
      currentDir.multiplyScalar(organelle.cameraDistance)
    );
  }, [selectedId, model]);

  // 5. Raycasting for Interaction (Hover & Click)
  const handlePointerDown = (event: React.PointerEvent<HTMLDivElement>) => {
    const container = mountRef.current;
    const camera = cameraRef.current;
    const scene = sceneRef.current;
    if (!container || !camera || !scene) return;

    const rect = container.getBoundingClientRect();
    const x = ((event.clientX - rect.left) / rect.width) * 2 - 1;
    const y = -((event.clientY - rect.top) / rect.height) * 2 + 1;

    const raycaster = new THREE.Raycaster();
    raycaster.setFromCamera(new THREE.Vector2(x, y), camera);

    const intersects = raycaster.intersectObjects(scene.children, true);
    if (intersects.length > 0) {
      // Traverse upwards to find an object with organelleId
      for (const hit of intersects) {
        let curr: THREE.Object3D | null = hit.object;
        while (curr) {
          if (curr.userData && curr.userData.organelleId) {
            onSelectOrganelle(curr.userData.organelleId);
            return;
          }
          if (curr.userData && curr.userData.basePairId) {
            onSelectOrganelle(curr.userData.basePairId);
            return;
          }
          curr = curr.parent;
        }
      }
    }
  };

  const handlePointerMove = (event: React.PointerEvent<HTMLDivElement>) => {
    const container = mountRef.current;
    const camera = cameraRef.current;
    const scene = sceneRef.current;
    if (!container || !camera || !scene) return;

    const rect = container.getBoundingClientRect();
    const x = ((event.clientX - rect.left) / rect.width) * 2 - 1;
    const y = -((event.clientY - rect.top) / rect.height) * 2 + 1;

    const raycaster = new THREE.Raycaster();
    raycaster.setFromCamera(new THREE.Vector2(x, y), camera);

    const intersects = raycaster.intersectObjects(scene.children, true);
    let found = false;

    if (intersects.length > 0) {
      for (const hit of intersects) {
        let curr: THREE.Object3D | null = hit.object;
        while (curr) {
          if (curr.userData && curr.userData.organelleId) {
            const org = CELL_ORGANELLES.find((o) => o.id === curr?.userData.organelleId);
            if (org) {
              setHoveredLabel({
                name: org.name,
                x: event.clientX - rect.left,
                y: event.clientY - rect.top,
              });
              found = true;
              return;
            }
          }
          curr = curr.parent;
        }
      }
    }

    if (!found) {
      setHoveredLabel(null);
    }
  };

  // Expose Screenshot Capture function on container
  useEffect(() => {
    if (mountRef.current) {
      (mountRef.current as any).captureImage = () => {
        if (!rendererRef.current || !sceneRef.current || !cameraRef.current) return null;
        rendererRef.current.render(sceneRef.current, cameraRef.current);
        return rendererRef.current.domElement.toDataURL('image/png');
      };
    }
  }, []);

  return (
    <div
      ref={mountRef}
      onPointerDown={handlePointerDown}
      onPointerMove={handlePointerMove}
      onPointerLeave={() => setHoveredLabel(null)}
      className="relative w-full h-full cursor-grab active:cursor-grabbing select-none overflow-hidden"
    >
      {/* Dynamic 3D Hover Tooltip */}
      {hoveredLabel && (
        <div
          className="absolute z-20 pointer-events-none transform -translate-x-1/2 -translate-y-12 transition-transform duration-75 px-2.5 py-1 bg-slate-900/90 border border-slate-700/80 rounded backdrop-blur-md shadow-xl text-xs font-medium text-slate-100 whitespace-nowrap"
          style={{ left: `${hoveredLabel.x}px`, top: `${hoveredLabel.y}px` }}
        >
          <span className="text-cyan-400 mr-1.5">●</span>
          {hoveredLabel.name}
        </div>
      )}
    </div>
  );
};
