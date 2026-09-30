import * as THREE from 'three';
import { RenderMode } from '../../types';

export interface DNAMeshGroup {
  id: string;
  name: string;
  group: THREE.Group;
  materials: THREE.Material[];
}

export function createDNAScene(
  renderMode: RenderMode,
  unzipProgress: number // 0 (zipped) to 1 (unzipped transcription bubble)
): { root: THREE.Group; dnaGroups: Map<string, DNAMeshGroup>; particleSystem: THREE.Points } {
  const root = new THREE.Group();
  const dnaGroups = new Map<string, DNAMeshGroup>();

  const isFluo = renderMode === 'fluorescence';
  const isTem = renderMode === 'cryo_tem';

  const basePairsCount = 28;
  const heightStep = 0.35;
  const radius = 1.35;
  const twistPerStep = Math.PI * 0.22; // ~10 pairs per 360 deg turn

  // Materials
  const backboneMat1 = new THREE.MeshPhysicalMaterial({
    color: isTem ? 0x777777 : (isFluo ? 0x06b6d4 : 0x0284c7),
    roughness: isTem ? 0.7 : 0.25,
    metalness: 0.15,
    clearcoat: 0.4,
    emissive: isFluo ? 0x0284c7 : 0x000000,
    emissiveIntensity: isFluo ? 0.3 : 0,
  });

  const backboneMat2 = new THREE.MeshPhysicalMaterial({
    color: isTem ? 0x555555 : (isFluo ? 0x818cf8 : 0x4f46e5),
    roughness: isTem ? 0.7 : 0.25,
    metalness: 0.15,
    clearcoat: 0.4,
    emissive: isFluo ? 0x4f46e5 : 0x000000,
    emissiveIntensity: isFluo ? 0.3 : 0,
  });

  const baseMaterials = {
    A: new THREE.MeshPhysicalMaterial({ color: isTem ? 0x888888 : 0xef4444, roughness: 0.3, clearcoat: 0.3 }),
    T: new THREE.MeshPhysicalMaterial({ color: isTem ? 0x555555 : 0x3b82f6, roughness: 0.3, clearcoat: 0.3 }),
    G: new THREE.MeshPhysicalMaterial({ color: isTem ? 0x999999 : 0x10b981, roughness: 0.3, clearcoat: 0.3 }),
    C: new THREE.MeshPhysicalMaterial({ color: isTem ? 0x666666 : 0xf59e0b, roughness: 0.3, clearcoat: 0.3 }),
  };

  const hydrogenBondMat = new THREE.LineDashedMaterial({
    color: isFluo ? 0xffffff : 0xe2e8f0,
    dashSize: 0.08,
    gapSize: 0.05,
    linewidth: 2,
  });

  // Curve points for backbones
  const pointsStrand1: THREE.Vector3[] = [];
  const pointsStrand2: THREE.Vector3[] = [];

  const sequence: Array<{ left: 'A' | 'T' | 'G' | 'C'; right: 'A' | 'T' | 'G' | 'C' }> = [
    { left: 'A', right: 'T' },
    { left: 'T', right: 'A' },
    { left: 'G', right: 'C' },
    { left: 'C', right: 'G' },
    { left: 'A', right: 'T' },
    { left: 'G', right: 'C' },
    { left: 'T', right: 'A' },
    { left: 'C', right: 'G' },
    { left: 'A', right: 'T' },
    { left: 'A', right: 'T' },
    { left: 'G', right: 'C' },
    { left: 'T', right: 'A' },
    { left: 'C', right: 'G' },
    { left: 'G', right: 'C' },
    { left: 'A', right: 'T' },
    { left: 'T', right: 'A' },
    { left: 'C', right: 'G' },
    { left: 'G', right: 'C' },
    { left: 'A', right: 'T' },
    { left: 'T', right: 'A' },
    { left: 'G', right: 'C' },
    { left: 'C', right: 'G' },
    { left: 'A', right: 'T' },
    { left: 'T', right: 'A' },
    { left: 'G', right: 'C' },
    { left: 'C', right: 'G' },
    { left: 'A', right: 'T' },
    { left: 'G', right: 'C' },
  ];

  const totalHeight = basePairsCount * heightStep;
  const startY = -totalHeight / 2;

  // Track base pair groups for interaction
  for (let i = 0; i < basePairsCount; i++) {
    const y = startY + i * heightStep;
    const angle = i * twistPerStep;

    // Transcription bubble unzipping offset in middle section
    const distFromCenter = Math.abs(i - basePairsCount / 2) / (basePairsCount / 2);
    const bubbleFactor = Math.max(0, 1 - distFromCenter * 2) * unzipProgress * 1.5;

    const p1 = new THREE.Vector3(
      (radius + bubbleFactor) * Math.cos(angle),
      y,
      (radius + bubbleFactor) * Math.sin(angle)
    );

    const p2 = new THREE.Vector3(
      -(radius + bubbleFactor) * Math.cos(angle),
      y,
      -(radius + bubbleFactor) * Math.sin(angle)
    );

    pointsStrand1.push(p1);
    pointsStrand2.push(p2);

    // Create Base Pair Rungs
    const pairGroup = new THREE.Group();
    pairGroup.position.set(0, y, 0);

    const pair = sequence[i % sequence.length];
    const leftBaseMat = baseMaterials[pair.left];
    const rightBaseMat = baseMaterials[pair.right];

    // Left base cylinder
    const leftLen = (radius - 0.2) * (bubbleFactor > 0.1 ? 0.8 : 0.95);
    const leftGeo = new THREE.CylinderGeometry(0.12, 0.12, leftLen, 16);
    const leftMesh = new THREE.Mesh(leftGeo, leftBaseMat);
    leftMesh.quaternion.setFromUnitVectors(new THREE.Vector3(0, 1, 0), new THREE.Vector3(Math.cos(angle), 0, Math.sin(angle)));
    leftMesh.position.set((leftLen / 2 + bubbleFactor) * Math.cos(angle), 0, (leftLen / 2 + bubbleFactor) * Math.sin(angle));
    pairGroup.add(leftMesh);

    // Right base cylinder
    const rightMesh = new THREE.Mesh(leftGeo, rightBaseMat);
    rightMesh.quaternion.setFromUnitVectors(new THREE.Vector3(0, 1, 0), new THREE.Vector3(-Math.cos(angle), 0, -Math.sin(angle)));
    rightMesh.position.set(-(leftLen / 2 + bubbleFactor) * Math.cos(angle), 0, -(leftLen / 2 + bubbleFactor) * Math.sin(angle));
    pairGroup.add(rightMesh);

    // Hydrogen bonds if not unzipped
    if (bubbleFactor < 0.4) {
      const bondsCount = (pair.left === 'A' || pair.left === 'T') ? 2 : 3;
      for (let b = 0; b < bondsCount; b++) {
        const offset = (b - (bondsCount - 1) / 2) * 0.08;
        const bondGeo = new THREE.BufferGeometry().setFromPoints([
          new THREE.Vector3(0.15 * Math.cos(angle), offset, 0.15 * Math.sin(angle)),
          new THREE.Vector3(-0.15 * Math.cos(angle), offset, -0.15 * Math.sin(angle))
        ]);
        const bondLine = new THREE.Line(bondGeo, hydrogenBondMat);
        pairGroup.add(bondLine);
      }
    }

    // Sugar phosphate sphere connection nodes
    const nodeGeo = new THREE.SphereGeometry(0.18, 16, 16);
    const node1 = new THREE.Mesh(nodeGeo, backboneMat1);
    node1.position.copy(p1).sub(new THREE.Vector3(0, y, 0));
    pairGroup.add(node1);

    const node2 = new THREE.Mesh(nodeGeo, backboneMat2);
    node2.position.copy(p2).sub(new THREE.Vector3(0, y, 0));
    pairGroup.add(node2);

    pairGroup.userData = {
      basePairId: pair.left.toLowerCase(),
      leftBase: pair.left,
      rightBase: pair.right,
      bonds: (pair.left === 'A' || pair.left === 'T') ? 2 : 3,
    };

    root.add(pairGroup);
    dnaGroups.set(`bp_${i}`, {
      id: pair.left.toLowerCase(),
      name: `${pair.left} - ${pair.right} Base Pair`,
      group: pairGroup,
      materials: [leftBaseMat, rightBaseMat],
    });
  }

  // Smooth Backbones as TubeGeometry
  const curve1 = new THREE.CatmullRomCurve3(pointsStrand1);
  const tubeGeo1 = new THREE.TubeGeometry(curve1, 120, 0.1, 16, false);
  const tube1 = new THREE.Mesh(tubeGeo1, backboneMat1);
  root.add(tube1);

  const curve2 = new THREE.CatmullRomCurve3(pointsStrand2);
  const tubeGeo2 = new THREE.TubeGeometry(curve2, 120, 0.1, 16, false);
  const tube2 = new THREE.Mesh(tubeGeo2, backboneMat2);
  root.add(tube2);

  // Floating RNA nucleotide precursor particles
  const pCount = 120;
  const pGeo = new THREE.BufferGeometry();
  const pPos = new Float32Array(pCount * 3);
  for (let p = 0; p < pCount; p++) {
    const r = 2.2 + Math.random() * 1.5;
    const a = Math.random() * Math.PI * 2;
    pPos[p * 3] = r * Math.cos(a);
    pPos[p * 3 + 1] = (Math.random() - 0.5) * totalHeight * 1.2;
    pPos[p * 3 + 2] = r * Math.sin(a);
  }
  pGeo.setAttribute('position', new THREE.BufferAttribute(pPos, 3));
  const pMat = new THREE.PointsMaterial({
    size: 0.06,
    color: 0x38bdf8,
    transparent: true,
    opacity: 0.5,
  });
  const particleSystem = new THREE.Points(pGeo, pMat);
  root.add(particleSystem);

  return { root, dnaGroups, particleSystem };
}
