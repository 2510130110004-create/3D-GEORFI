import * as THREE from 'three';
import { ElementAtomInfo, RenderMode } from '../../types';

export interface AtomMeshResult {
  root: THREE.Group;
  orbitalsGroup: THREE.Group;
  electronsGroup: THREE.Group;
  nucleusGroup: THREE.Group;
  electronMeshes: THREE.Mesh[];
  orbitalMeshes: THREE.Object3D[];
}

export function createAtomScene(
  element: ElementAtomInfo,
  orbitalType: 'bohr' | 'quantum',
  renderMode: RenderMode
): AtomMeshResult {
  const root = new THREE.Group();
  const nucleusGroup = new THREE.Group();
  const orbitalsGroup = new THREE.Group();
  const electronsGroup = new THREE.Group();
  const electronMeshes: THREE.Mesh[] = [];
  const orbitalMeshes: THREE.Object3D[] = [];

  const isFluo = renderMode === 'fluorescence';
  const isTem = renderMode === 'cryo_tem';

  // 1. NUCLEUS (Protons & Neutrons)
  const totalNucleons = element.protons + element.neutrons;
  const protonMat = new THREE.MeshPhysicalMaterial({
    color: isTem ? 0x888888 : (isFluo ? 0xf43f5e : 0xdc2626),
    roughness: 0.2,
    metalness: 0.2,
    clearcoat: 0.5,
    emissive: isFluo ? 0xdc2626 : 0x000000,
    emissiveIntensity: isFluo ? 0.3 : 0,
  });

  const neutronMat = new THREE.MeshPhysicalMaterial({
    color: isTem ? 0x444444 : 0x64748b,
    roughness: 0.35,
    metalness: 0.1,
    clearcoat: 0.3,
  });

  const nucleonRadius = 0.18;
  const clusterRadius = Math.max(0.25, Math.pow(totalNucleons, 1 / 3) * 0.24);

  // Distribute protons and neutrons uniformly in a small spherical cluster
  for (let i = 0; i < totalNucleons; i++) {
    const isProton = i < element.protons;
    const phi = Math.acos(1 - (2 * (i + 0.5)) / totalNucleons);
    const theta = Math.PI * (1 + Math.sqrt(5)) * (i + 0.5);
    const r = clusterRadius * (0.35 + 0.65 * Math.cbrt((i + 1) / totalNucleons));

    const x = r * Math.sin(phi) * Math.cos(theta);
    const y = r * Math.sin(phi) * Math.sin(theta);
    const z = r * Math.cos(phi);

    const geo = new THREE.SphereGeometry(nucleonRadius, 16, 16);
    const mesh = new THREE.Mesh(geo, isProton ? protonMat : neutronMat);
    mesh.position.set(x, y, z);
    nucleusGroup.add(mesh);
  }
  root.add(nucleusGroup);

  // 2. ELECTRON CONFIGURATION / ORBITALS
  const electronMat = new THREE.MeshPhysicalMaterial({
    color: isTem ? 0xffffff : (isFluo ? 0x38bdf8 : 0x06b6d4),
    roughness: 0.1,
    metalness: 0.1,
    emissive: isFluo ? 0x38bdf8 : 0x0ea5e9,
    emissiveIntensity: 0.6,
  });

  if (orbitalType === 'bohr') {
    // BOHR PLANETARY MODEL (Concentric rings)
    const ringMat = new THREE.LineBasicMaterial({
      color: isTem ? 0x555555 : 0x38bdf8,
      transparent: true,
      opacity: 0.45,
    });

    element.electronConfiguration.forEach((count, shellIndex) => {
      const shellRadius = 1.4 + shellIndex * 1.0;

      // Orbit ring
      const ringGeo = new THREE.BufferGeometry();
      const ringPoints: THREE.Vector3[] = [];
      const segments = 64;
      for (let s = 0; s <= segments; s++) {
        const a = (s / segments) * Math.PI * 2;
        ringPoints.push(new THREE.Vector3(shellRadius * Math.cos(a), 0, shellRadius * Math.sin(a)));
      }
      ringGeo.setFromPoints(ringPoints);
      const ringLine = new THREE.Line(ringGeo, ringMat);
      // Slight tilt for cinematic depth
      ringLine.rotation.x = 0.25 * (shellIndex + 1);
      ringLine.rotation.z = 0.15 * (shellIndex + 1);
      orbitalsGroup.add(ringLine);
      orbitalMeshes.push(ringLine);

      // Place electrons around this shell
      for (let e = 0; e < count; e++) {
        const eGeo = new THREE.SphereGeometry(0.09, 14, 14);
        const eMesh = new THREE.Mesh(eGeo, electronMat);
        const angle = (e / count) * Math.PI * 2;
        eMesh.position.set(shellRadius * Math.cos(angle), 0, shellRadius * Math.sin(angle));
        
        // Add to ring so it inherits rotation
        ringLine.add(eMesh);
        electronMeshes.push(eMesh);

        // Halo glow
        const glowGeo = new THREE.SphereGeometry(0.16, 12, 12);
        const glowMat = new THREE.MeshBasicMaterial({
          color: 0x38bdf8,
          transparent: true,
          opacity: 0.35,
        });
        const glow = new THREE.Mesh(glowGeo, glowMat);
        eMesh.add(glow);
      }
    });
  } else {
    // QUANTUM PROBABILITY ORBITALS (1s, 2s, 2p lobes)
    const orbitalCloudMat = (col: number) =>
      new THREE.MeshPhysicalMaterial({
        color: col,
        transmission: 0.85,
        roughness: 0.15,
        transparent: true,
        opacity: 0.45,
        clearcoat: 0.5,
        side: THREE.DoubleSide,
      });

    // 1s orbital (spherical shell)
    const s1Geo = new THREE.SphereGeometry(1.2, 32, 24);
    const s1Mesh = new THREE.Mesh(s1Geo, orbitalCloudMat(0x38bdf8));
    orbitalsGroup.add(s1Mesh);
    orbitalMeshes.push(s1Mesh);

    // 2s orbital (larger spherical shell if > 2 electrons)
    if (element.electrons > 2) {
      const s2Geo = new THREE.SphereGeometry(2.3, 32, 24);
      const s2Mesh = new THREE.Mesh(s2Geo, orbitalCloudMat(0x818cf8));
      orbitalsGroup.add(s2Mesh);
      orbitalMeshes.push(s2Mesh);
    }

    // 2p lobes (px, py, pz dumbbells) if > 4 electrons
    if (element.electrons > 4) {
      function createDumbbell(axis: 'x' | 'y' | 'z', color: number): THREE.Group {
        const g = new THREE.Group();
        const mat = orbitalCloudMat(color);
        
        const lobe1 = new THREE.Mesh(new THREE.SphereGeometry(0.85, 24, 20), mat);
        lobe1.scale.set(1.5, 0.9, 0.9);
        lobe1.position.x = 1.35;

        const lobe2 = new THREE.Mesh(new THREE.SphereGeometry(0.85, 24, 20), mat);
        lobe2.scale.set(1.5, 0.9, 0.9);
        lobe2.position.x = -1.35;

        g.add(lobe1);
        g.add(lobe2);

        if (axis === 'y') g.rotation.z = Math.PI * 0.5;
        if (axis === 'z') g.rotation.y = Math.PI * 0.5;

        return g;
      }

      // 2px
      const px = createDumbbell('x', 0x10b981);
      orbitalsGroup.add(px);
      orbitalMeshes.push(px);

      // 2py (if electrons > 6)
      if (element.electrons > 6) {
        const py = createDumbbell('y', 0xf59e0b);
        orbitalsGroup.add(py);
        orbitalMeshes.push(py);
      }

      // 2pz (if electrons > 8)
      if (element.electrons > 8) {
        const pz = createDumbbell('z', 0xec4899);
        orbitalsGroup.add(pz);
        orbitalMeshes.push(pz);
      }
    }
  }

  root.add(orbitalsGroup);
  root.add(electronsGroup);

  return {
    root,
    orbitalsGroup,
    electronsGroup,
    nucleusGroup,
    electronMeshes,
    orbitalMeshes,
  };
}
