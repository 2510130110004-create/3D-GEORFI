import React, { useEffect, useRef, useState } from 'react';
import * as THREE from 'three';
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls.js';
import { X, RotateCcw, Box, Eye } from 'lucide-react';
import { FocusObjectId, OBJECTS_3D_LIST } from './ObjectInspectorBar';

interface SingleObjectStudioModalProps {
  isOpen: boolean;
  objectId: FocusObjectId;
  onClose: () => void;
  onSelectAnother: (id: FocusObjectId) => void;
}

export const SingleObjectStudioModal: React.FC<SingleObjectStudioModalProps> = ({
  isOpen,
  objectId,
  onClose,
  onSelectAnother,
}) => {
  const mountRef = useRef<HTMLDivElement>(null);
  const [isWireframe, setIsWireframe] = useState(false);
  const currentObj = OBJECTS_3D_LIST.find((o) => o.id === objectId) || OBJECTS_3D_LIST[1];

  useEffect(() => {
    if (!isOpen) return;
    const container = mountRef.current;
    if (!container) return;

    const width = container.clientWidth;
    const height = container.clientHeight;

    const scene = new THREE.Scene();
    scene.background = new THREE.Color(0x090d16);

    const camera = new THREE.PerspectiveCamera(45, width / height, 0.1, 100);
    camera.position.set(0, 3, 7);

    const renderer = new THREE.WebGLRenderer({ antialias: true });
    renderer.setSize(width, height);
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    renderer.shadowMap.enabled = true;
    container.appendChild(renderer.domElement);

    const controls = new OrbitControls(camera, renderer.domElement);
    controls.enableDamping = true;
    controls.dampingFactor = 0.05;
    controls.autoRotate = true;
    controls.autoRotateSpeed = 2.0;

    // Studio pedestal (Circular display platform)
    const pedestalGeo = new THREE.CylinderGeometry(3.5, 3.8, 0.4, 32);
    const pedestalMat = new THREE.MeshStandardMaterial({
      color: 0x1e293b,
      roughness: 0.8,
      metalness: 0.2,
    });
    const pedestal = new THREE.Mesh(pedestalGeo, pedestalMat);
    pedestal.position.y = -0.2;
    pedestal.receiveShadow = true;
    scene.add(pedestal);

    // Grid ring
    const grid = new THREE.GridHelper(7, 14, 0x06b6d4, 0x334155);
    grid.position.y = 0.01;
    scene.add(grid);

    // Studio Lighting
    const keyLight = new THREE.DirectionalLight(0xffffff, 2.2);
    keyLight.position.set(5, 8, 5);
    keyLight.castShadow = true;
    scene.add(keyLight);

    const fillLight = new THREE.DirectionalLight(0x38bdf8, 1.2);
    fillLight.position.set(-5, 4, -5);
    scene.add(fillLight);

    const ambLight = new THREE.AmbientLight(0xffffff, 0.7);
    scene.add(ambLight);

    // Build Isolated 3D Object
    const objectGroup = new THREE.Group();

    if (objectId === 'boat') {
      // 1. Perahu Nelayan Cadik
      const hullGeo = new THREE.ConeGeometry(0.5, 3.8, 8);
      hullGeo.rotateX(Math.PI / 2);
      hullGeo.scale(1.0, 0.5, 1.0);
      const hullMat = new THREE.MeshStandardMaterial({ color: 0x854d0e, roughness: 0.7 });
      const hull = new THREE.Mesh(hullGeo, hullMat);
      hull.position.y = 0.4;
      objectGroup.add(hull);

      const cadikMat = new THREE.MeshStandardMaterial({ color: 0xfde047, roughness: 0.5 });
      const floatGeo = new THREE.CylinderGeometry(0.1, 0.1, 3.2, 8);
      floatGeo.rotateZ(Math.PI / 2);
      const float1 = new THREE.Mesh(floatGeo, cadikMat);
      float1.position.set(1.4, 0.3, 0);
      objectGroup.add(float1);
      const float2 = new THREE.Mesh(floatGeo, cadikMat);
      float2.position.set(-1.4, 0.3, 0);
      objectGroup.add(float2);

      const beamGeo = new THREE.CylinderGeometry(0.04, 0.04, 3.0, 6);
      beamGeo.rotateZ(Math.PI / 2);
      const beam1 = new THREE.Mesh(beamGeo, cadikMat);
      beam1.position.set(0, 0.6, 0.7);
      objectGroup.add(beam1);
      const beam2 = new THREE.Mesh(beamGeo, cadikMat);
      beam2.position.set(0, 0.6, -0.7);
      objectGroup.add(beam2);

      // Sail
      const sailGeo = new THREE.BufferGeometry();
      const sailVerts = new Float32Array([
        0, 0.7, 1.0,
        0, 3.6, -0.3,
        0, 0.8, -1.2,
      ]);
      sailGeo.setAttribute('position', new THREE.BufferAttribute(sailVerts, 3));
      sailGeo.computeVertexNormals();
      const sailMat = new THREE.MeshStandardMaterial({
        color: 0xf8fafc,
        side: THREE.DoubleSide,
        roughness: 0.5,
      });
      const sail = new THREE.Mesh(sailGeo, sailMat);
      objectGroup.add(sail);
    } else if (objectId === 'windsock') {
      // 2. Kantong Angin BMKG
      const mastGeo = new THREE.CylinderGeometry(0.06, 0.08, 4.5, 12);
      const mastMat = new THREE.MeshStandardMaterial({ color: 0x94a3b8, metalness: 0.8 });
      const mast = new THREE.Mesh(mastGeo, mastMat);
      mast.position.y = 2.25;
      objectGroup.add(mast);

      const sockGeo = new THREE.ConeGeometry(0.45, 2.5, 16, 1, true);
      sockGeo.rotateZ(Math.PI / 2);
      sockGeo.translate(-1.25, 0, 0);
      const sockMat = new THREE.MeshStandardMaterial({
        color: 0xf97316,
        roughness: 0.6,
        side: THREE.DoubleSide,
      });
      const sock = new THREE.Mesh(sockGeo, sockMat);
      sock.position.set(0, 4.4, 0);
      objectGroup.add(sock);
    } else if (objectId === 'lighthouse') {
      // 3. Mercusuar
      const towerGeo = new THREE.CylinderGeometry(0.7, 1.2, 5.0, 16);
      const towerMat = new THREE.MeshStandardMaterial({ color: 0xf8fafc, roughness: 0.5 });
      const tower = new THREE.Mesh(towerGeo, towerMat);
      tower.position.y = 2.5;
      objectGroup.add(tower);

      const bandGeo = new THREE.CylinderGeometry(0.8, 1.0, 1.2, 16);
      const bandMat = new THREE.MeshStandardMaterial({ color: 0xdc2626 });
      const band = new THREE.Mesh(bandGeo, bandMat);
      band.position.y = 3.0;
      objectGroup.add(band);

      const lanternGeo = new THREE.CylinderGeometry(0.6, 0.6, 1.0, 12);
      const lanternMat = new THREE.MeshStandardMaterial({
        color: 0xfef08a,
        emissive: 0xfef08a,
        emissiveIntensity: 0.9,
      });
      const lantern = new THREE.Mesh(lanternGeo, lanternMat);
      lantern.position.y = 5.5;
      objectGroup.add(lantern);
    } else if (objectId === 'cloud') {
      // 4. Awan Kumulus
      const cloudMat = new THREE.MeshStandardMaterial({ color: 0xffffff, roughness: 0.9 });
      for (let c = 0; c < 7; c++) {
        const rad = 0.8 + Math.random() * 0.7;
        const sphGeo = new THREE.SphereGeometry(rad, 16, 16);
        const puff = new THREE.Mesh(sphGeo, cloudMat);
        puff.position.set(
          (c - 3) * 0.8 + (Math.random() - 0.5) * 0.5,
          1.8 + Math.sin(c) * 0.6,
          (Math.random() - 0.5) * 0.8
        );
        objectGroup.add(puff);
      }
    } else if (objectId === 'land') {
      // 5. Irisan Balok Daratan
      const landGeo = new THREE.BoxGeometry(4.5, 1.5, 4.5, 16, 8, 16);
      const landMat = new THREE.MeshStandardMaterial({ color: 0x3f6212, roughness: 0.8 });
      const landSlice = new THREE.Mesh(landGeo, landMat);
      landSlice.position.y = 0.75;
      objectGroup.add(landSlice);

      // Palm tree on top
      const trunkGeo = new THREE.CylinderGeometry(0.08, 0.15, 2.0, 8);
      const trunkMat = new THREE.MeshStandardMaterial({ color: 0x78350f });
      const trunk = new THREE.Mesh(trunkGeo, trunkMat);
      trunk.position.set(0.5, 2.5, 0.5);
      objectGroup.add(trunk);
    } else {
      // 6. Air Lautan
      const seaGeo = new THREE.BoxGeometry(4.5, 1.5, 4.5, 16, 8, 16);
      const seaMat = new THREE.MeshPhysicalMaterial({
        color: 0x0284c7,
        roughness: 0.1,
        transmission: 0.6,
        transparent: true,
        opacity: 0.85,
      });
      const seaSlice = new THREE.Mesh(seaGeo, seaMat);
      seaSlice.position.y = 0.75;
      objectGroup.add(seaSlice);
    }

    scene.add(objectGroup);

    // Apply wireframe toggle
    objectGroup.traverse((child) => {
      if (child instanceof THREE.Mesh && child.material) {
        if (Array.isArray(child.material)) {
          child.material.forEach((m) => (m.wireframe = isWireframe));
        } else {
          child.material.wireframe = isWireframe;
        }
      }
    });

    let reqId: number;
    const animate = () => {
      reqId = requestAnimationFrame(animate);
      controls.update();
      renderer.render(scene, camera);
    };
    animate();

    const handleResize = () => {
      if (!container) return;
      camera.aspect = container.clientWidth / container.clientHeight;
      camera.updateProjectionMatrix();
      renderer.setSize(container.clientWidth, container.clientHeight);
    };
    window.addEventListener('resize', handleResize);

    return () => {
      cancelAnimationFrame(reqId);
      window.removeEventListener('resize', handleResize);
      renderer.dispose();
      if (container && renderer.domElement) {
        container.removeChild(renderer.domElement);
      }
    };
  }, [isOpen, objectId, isWireframe]);

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-5 bg-slate-950/85 backdrop-blur-md">
      <div className="w-full max-w-3xl h-[85vh] bg-slate-900 border border-slate-700/80 rounded-2xl shadow-2xl flex flex-col overflow-hidden relative">
        {/* Header */}
        <div className="h-14 border-b border-slate-800 px-4 sm:px-6 flex items-center justify-between shrink-0 bg-slate-950/60">
          <div className="flex items-center gap-2">
            <span className="text-2xl">{currentObj.icon}</span>
            <div>
              <div className="text-[11px] font-mono text-cyan-400 font-semibold uppercase tracking-wider">
                Studio Inspeksi Objek 3D
              </div>
              <h3 className="text-base font-bold text-white font-display">
                {currentObj.name}
              </h3>
            </div>
          </div>

          <div className="flex items-center gap-2">
            {/* Wireframe Toggle */}
            <button
              onClick={() => setIsWireframe(!isWireframe)}
              className={`flex items-center gap-1 px-2.5 py-1 rounded-lg text-xs font-semibold border transition-colors ${
                isWireframe
                  ? 'bg-cyan-500/20 text-cyan-300 border-cyan-500/50'
                  : 'bg-slate-800 text-slate-300 border-slate-700 hover:text-white'
              }`}
              title="Tampilkan susunan rangka poligon 3D (Wireframe)"
            >
              <Box className="w-3.5 h-3.5" />
              <span>{isWireframe ? 'Rangka (Aktif)' : 'Mode Rangka'}</span>
            </button>

            <button
              onClick={onClose}
              className="p-1.5 text-slate-400 hover:text-white rounded-lg hover:bg-slate-800 transition-colors"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Object quick navigation pills */}
        <div className="px-4 py-2 border-b border-slate-800 bg-slate-950/40 flex items-center gap-1.5 overflow-x-auto scrollbar-none">
          <span className="text-[11px] text-slate-400 font-medium shrink-0 mr-1">
            Ganti Objek:
          </span>
          {OBJECTS_3D_LIST.filter((o) => o.id !== 'all').map((obj) => (
            <button
              key={obj.id}
              onClick={() => onSelectAnother(obj.id)}
              className={`flex items-center gap-1 px-2 py-0.5 rounded-md text-[11px] font-semibold whitespace-nowrap transition-colors ${
                obj.id === objectId
                  ? 'bg-cyan-400 text-slate-950 font-bold'
                  : 'bg-slate-800 hover:bg-slate-700 text-slate-300 hover:text-white'
              }`}
            >
              <span>{obj.icon}</span>
              <span>{obj.name}</span>
            </button>
          ))}
        </div>

        {/* 3D Viewport Area */}
        <div className="relative flex-1 w-full h-full overflow-hidden">
          <div ref={mountRef} className="w-full h-full cursor-grab active:cursor-grabbing" />

          {/* Floating Instructions */}
          <div className="absolute top-3 left-3 pointer-events-none bg-slate-950/80 border border-slate-800 px-2.5 py-1 rounded-md text-[10px] text-slate-400 backdrop-blur-sm">
            🖱️ Klik & geser untuk memutar 360° · Scroll untuk Zoom
          </div>

          {/* Explanation Info Card at Bottom */}
          <div className="absolute bottom-3 left-3 right-3 bg-slate-950/90 border border-slate-800 rounded-xl p-3 shadow-xl backdrop-blur-md text-xs space-y-1">
            <strong className="text-cyan-300 block text-xs">
              🌍 Peran Geografis & Mekanisme Fisika:
            </strong>
            <p className="text-slate-300 leading-relaxed text-[11.5px]">
              {currentObj.geographyRole}
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};
