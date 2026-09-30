import * as THREE from 'three';
import { CellType, RenderMode } from '../../types';

export interface OrganelleMeshGroup {
  id: string;
  group: THREE.Group;
  basePosition: THREE.Vector3;
  explodeDirection: THREE.Vector3;
  materials: THREE.Material[];
  highlightMeshes: THREE.Mesh[];
}

/**
 * Creates high-fidelity procedural 3D meshes for eukaryotic animal and plant cells.
 * Adheres to cinematic PBR standards with clean geometry, realistic translucency, and accurate cytology.
 */
export function createCellScene(
  cellType: CellType,
  renderMode: RenderMode,
  cutawayAngleDeg: number
): { root: THREE.Group; organelleGroups: Map<string, OrganelleMeshGroup>; particleSystem: THREE.Points } {
  const root = new THREE.Group();
  const organelleGroups = new Map<string, OrganelleMeshGroup>();

  // Color palette based on render mode
  const isFluo = renderMode === 'fluorescence';
  const isTem = renderMode === 'cryo_tem';
  const isXray = renderMode === 'xray';

  function getMat(
    pbrColor: number,
    fluoColor: number,
    temGray: number,
    opts: {
      roughness?: number;
      metalness?: number;
      transmission?: number;
      opacity?: number;
      transparent?: boolean;
      clearcoat?: number;
      wireframe?: boolean;
      emissive?: number;
      emissiveIntensity?: number;
    } = {}
  ): THREE.MeshPhysicalMaterial {
    let color = pbrColor;
    let emissive = opts.emissive || 0x000000;
    let emissiveIntensity = opts.emissiveIntensity || 0;

    if (isFluo) {
      color = fluoColor;
      emissive = fluoColor;
      emissiveIntensity = 0.35;
    } else if (isTem) {
      color = temGray;
      emissive = 0x000000;
      emissiveIntensity = 0;
    }

    return new THREE.MeshPhysicalMaterial({
      color,
      roughness: isTem ? 0.8 : (opts.roughness ?? 0.3),
      metalness: isTem ? 0.05 : (opts.metalness ?? 0.1),
      transmission: isXray ? 0.85 : (opts.transmission ?? 0),
      opacity: isXray ? 0.35 : (opts.opacity ?? 1.0),
      transparent: isXray || opts.transparent || false,
      clearcoat: isTem ? 0 : (opts.clearcoat ?? 0.2),
      clearcoatRoughness: 0.1,
      emissive,
      emissiveIntensity,
      wireframe: opts.wireframe || false,
      side: THREE.DoubleSide,
    });
  }

  // ==========================================
  // 1. PLASMA MEMBRANE & CYTOSOL BOUNDARY
  // ==========================================
  const membraneGroup = new THREE.Group();
  const cutawayRad = (cutawayAngleDeg * Math.PI) / 180;
  const sphereGeo = new THREE.SphereGeometry(3.3, 64, 48, 0, Math.PI * 2 - cutawayRad);
  
  const membraneMat = getMat(0x38bdf8, 0x0284c7, 0x555555, {
    transmission: isXray ? 0.95 : 0.65,
    opacity: isXray ? 0.2 : 0.85,
    transparent: true,
    roughness: 0.2,
    clearcoat: 0.6,
  });

  const membraneMesh = new THREE.Mesh(sphereGeo, membraneMat);
  membraneMesh.rotation.y = Math.PI * 0.25;
  membraneGroup.add(membraneMesh);

  // Cross section cut cap slice (if cutaway > 0)
  if (cutawayAngleDeg > 5) {
    const capGeo = new THREE.RingGeometry(0.1, 3.3, 32);
    const capMat = getMat(0x0ea5e9, 0x0284c7, 0x444444, {
      roughness: 0.5,
      metalness: 0.05,
    });
    const cap1 = new THREE.Mesh(capGeo, capMat);
    cap1.rotation.y = Math.PI * 0.25;
    membraneGroup.add(cap1);

    const cap2 = new THREE.Mesh(capGeo, capMat);
    cap2.rotation.y = Math.PI * 0.25 + (Math.PI * 2 - cutawayRad);
    membraneGroup.add(cap2);
  }

  // If Plant cell, add outer hexagonal/cuboid Cell Wall
  if (cellType === 'plant') {
    const wallGeo = new THREE.BoxGeometry(7.2, 7.2, 7.2, 2, 2, 2);
    const wallMat = getMat(0x15803d, 0x22c55e, 0x666666, {
      wireframe: true,
      transparent: true,
      opacity: 0.45,
      roughness: 0.7,
    });
    const wallMesh = new THREE.Mesh(wallGeo, wallMat);
    membraneGroup.add(wallMesh);
  }

  membraneGroup.userData = { organelleId: cellType === 'plant' ? 'cell_wall' : 'membrane' };
  root.add(membraneGroup);
  organelleGroups.set('membrane', {
    id: 'membrane',
    group: membraneGroup,
    basePosition: new THREE.Vector3(0, 0, 0),
    explodeDirection: new THREE.Vector3(0, 0, 0),
    materials: [membraneMat],
    highlightMeshes: [membraneMesh],
  });

  // ==========================================
  // 2. NUCLEUS (with Envelope, Pores, Nucleolus & Chromatin)
  // ==========================================
  const nucleusGroup = new THREE.Group();
  nucleusGroup.position.set(0, 0, 0);

  // Outer nuclear envelope with a 90° cutaway revealing interior
  const nucleusOuterGeo = new THREE.SphereGeometry(1.25, 48, 36, 0, Math.PI * 1.5);
  const nucleusOuterMat = getMat(0x6366f1, 0x38bdf8, 0x777777, {
    roughness: 0.35,
    clearcoat: 0.3,
  });
  const nucleusOuter = new THREE.Mesh(nucleusOuterGeo, nucleusOuterMat);
  nucleusOuter.rotation.y = Math.PI * 0.25;
  nucleusGroup.add(nucleusOuter);

  // Nuclear pores scattered across outer envelope
  const poreGeo = new THREE.TorusGeometry(0.045, 0.015, 8, 16);
  const poreMat = getMat(0xf43f5e, 0x38bdf8, 0x333333, { roughness: 0.3 });
  for (let i = 0; i < 35; i++) {
    const u = Math.random() * Math.PI * 1.4;
    const v = Math.acos(2 * Math.random() - 1);
    const r = 1.255;
    const px = r * Math.sin(v) * Math.cos(u);
    const py = r * Math.sin(v) * Math.sin(u);
    const pz = r * Math.cos(v);

    const pore = new THREE.Mesh(poreGeo, poreMat);
    pore.position.set(px, py, pz);
    pore.lookAt(px * 2, py * 2, pz * 2);
    nucleusGroup.add(pore);
  }

  // Dense inner Nucleolus
  const nucleolusGeo = new THREE.SphereGeometry(0.5, 32, 24);
  const nucleolusMat = getMat(0xf59e0b, 0x38bdf8, 0x999999, {
    roughness: 0.2,
    emissive: isFluo ? 0x38bdf8 : 0xd97706,
    emissiveIntensity: isFluo ? 0.6 : 0.25,
  });
  const nucleolus = new THREE.Mesh(nucleolusGeo, nucleolusMat);
  nucleusGroup.add(nucleolus);

  // Chromatin coils (interlocking torus knots)
  const chromatinGeo = new THREE.TorusKnotGeometry(0.72, 0.05, 64, 12, 2, 3);
  const chromatinMat = getMat(0x818cf8, 0x60a5fa, 0x888888, {
    roughness: 0.4,
    transparent: true,
    opacity: 0.8,
  });
  const chromatin = new THREE.Mesh(chromatinGeo, chromatinMat);
  nucleusGroup.add(chromatin);

  nucleusGroup.userData = { organelleId: 'nucleus' };
  root.add(nucleusGroup);
  organelleGroups.set('nucleus', {
    id: 'nucleus',
    group: nucleusGroup,
    basePosition: new THREE.Vector3(0, 0, 0),
    explodeDirection: new THREE.Vector3(0, 0, 0),
    materials: [nucleusOuterMat, nucleolusMat, chromatinMat],
    highlightMeshes: [nucleusOuter, nucleolus],
  });

  // ==========================================
  // 3. MITOCHONDRIA (with Cristae & Outer Membrane)
  // ==========================================
  const mitoGroup = new THREE.Group();
  mitoGroup.position.set(2.1, 0.7, 1.1);
  mitoGroup.rotation.set(0.3, -0.4, 0.6);

  function createMitochondrion(): THREE.Group {
    const singleMito = new THREE.Group();

    // Outer membrane capsule with cutaway half
    const outerGeo = new THREE.CapsuleGeometry(0.35, 0.9, 16, 24);
    const outerMat = getMat(0xf97316, 0xef4444, 0x666666, {
      roughness: 0.25,
      clearcoat: 0.4,
      transmission: 0.4,
      transparent: true,
      opacity: 0.85,
    });
    const outerMesh = new THREE.Mesh(outerGeo, outerMat);
    singleMito.add(outerMesh);

    // Inner folded cristae baffles
    const cristaeMat = getMat(0xfbbf24, 0xf87171, 0x888888, {
      roughness: 0.3,
      metalness: 0.1,
    });
    for (let c = -0.35; c <= 0.35; c += 0.14) {
      const discGeo = new THREE.CylinderGeometry(0.24, 0.24, 0.025, 16);
      const disc = new THREE.Mesh(discGeo, cristaeMat);
      disc.position.y = c;
      disc.rotation.x = Math.PI * 0.12 * Math.sin(c * 10);
      disc.rotation.z = Math.PI * 0.5;
      singleMito.add(disc);
    }

    return singleMito;
  }

  const primaryMito = createMitochondrion();
  mitoGroup.add(primaryMito);

  // Secondary mitochondrion in other quadrant
  const secondMito = createMitochondrion();
  secondMito.position.set(-2.0, 1.2, -1.2);
  secondMito.rotation.set(-0.5, 0.7, -0.2);
  secondMito.scale.set(0.85, 0.85, 0.85);
  mitoGroup.add(secondMito);

  mitoGroup.userData = { organelleId: 'mitochondria' };
  root.add(mitoGroup);
  organelleGroups.set('mitochondria', {
    id: 'mitochondria',
    group: mitoGroup,
    basePosition: new THREE.Vector3(2.1, 0.7, 1.1),
    explodeDirection: new THREE.Vector3(1, 0.4, 0.5).normalize(),
    materials: [((primaryMito.children[0] as THREE.Mesh).material as THREE.Material)],
    highlightMeshes: [primaryMito.children[0] as THREE.Mesh],
  });

  // ==========================================
  // 4. ROUGH ENDOPLASMIC RETICULUM (RER)
  // Convoluted folded cisternae with ribosome beads
  // ==========================================
  const rerGroup = new THREE.Group();
  rerGroup.position.set(-1.3, 0.9, -0.9);

  const rerMat = getMat(0xa855f7, 0xc084fc, 0x777777, {
    roughness: 0.3,
    clearcoat: 0.3,
  });

  const riboMat = getMat(0xec4899, 0xf472b6, 0x222222, {
    roughness: 0.2,
    metalness: 0.1,
  });

  const rerHighlightMeshes: THREE.Mesh[] = [];

  // Generate 4 undulating curved cisternae sheets
  for (let s = 0; s < 4; s++) {
    const sheetGeo = new THREE.TorusGeometry(0.9 + s * 0.26, 0.09, 14, 32, Math.PI * 0.95);
    const sheet = new THREE.Mesh(sheetGeo, rerMat);
    sheet.rotation.x = Math.PI * 0.35 + s * 0.12;
    sheet.rotation.y = -Math.PI * 0.2 + s * 0.08;
    sheet.position.set(0, s * 0.15, s * 0.1);
    rerGroup.add(sheet);
    rerHighlightMeshes.push(sheet);

    // Ribosome granules studded on each sheet
    const riboGeo = new THREE.SphereGeometry(0.026, 6, 6);
    for (let r = 0; r < 14; r++) {
      const angle = (r / 14) * Math.PI * 0.95;
      const rx = (0.9 + s * 0.26) * Math.cos(angle);
      const ry = (0.9 + s * 0.26) * Math.sin(angle);
      const rz = 0.095 * (r % 2 === 0 ? 1 : -1);

      const ribo = new THREE.Mesh(riboGeo, riboMat);
      ribo.position.set(rx, ry, rz);
      sheet.add(ribo);
    }
  }

  rerGroup.userData = { organelleId: 'rough_er' };
  root.add(rerGroup);
  organelleGroups.set('rough_er', {
    id: 'rough_er',
    group: rerGroup,
    basePosition: new THREE.Vector3(-1.3, 0.9, -0.9),
    explodeDirection: new THREE.Vector3(-0.8, 0.6, -0.6).normalize(),
    materials: [rerMat, riboMat],
    highlightMeshes: rerHighlightMeshes,
  });

  // ==========================================
  // 5. SMOOTH ENDOPLASMIC RETICULUM (SER)
  // Branching tubular interconnected system (no ribosomes)
  // ==========================================
  const serGroup = new THREE.Group();
  serGroup.position.set(-2.0, -0.6, 0.7);

  const serMat = getMat(0xec4899, 0xf43f5e, 0x888888, {
    roughness: 0.25,
    clearcoat: 0.5,
  });

  const serHighlightMeshes: THREE.Mesh[] = [];

  // Branching interlocking torus sections creating a tubular lattice
  for (let t = 0; t < 5; t++) {
    const tubeGeo = new THREE.TorusGeometry(0.42, 0.065, 12, 24, Math.PI * 1.5);
    const tube = new THREE.Mesh(tubeGeo, serMat);
    tube.position.set(
      Math.sin(t * 1.2) * 0.35,
      t * 0.2 - 0.4,
      Math.cos(t * 1.2) * 0.35
    );
    tube.rotation.set(t * 0.5, t * 0.8, t * 0.3);
    serGroup.add(tube);
    serHighlightMeshes.push(tube);
  }

  serGroup.userData = { organelleId: 'smooth_er' };
  root.add(serGroup);
  organelleGroups.set('smooth_er', {
    id: 'smooth_er',
    group: serGroup,
    basePosition: new THREE.Vector3(-2.0, -0.6, 0.7),
    explodeDirection: new THREE.Vector3(-0.9, -0.3, 0.4).normalize(),
    materials: [serMat],
    highlightMeshes: serHighlightMeshes,
  });

  // ==========================================
  // 6. GOLGI APPARATUS
  // Stack of crescent cisternae with budding secretory vesicles
  // ==========================================
  const golgiGroup = new THREE.Group();
  golgiGroup.position.set(1.7, -1.1, -0.9);

  const golgiMat = getMat(0xeab308, 0xfacc15, 0x777777, {
    roughness: 0.25,
    clearcoat: 0.4,
  });

  const vesicleMat = getMat(0xf59e0b, 0xfde047, 0x555555, {
    roughness: 0.2,
    clearcoat: 0.6,
  });

  const golgiHighlightMeshes: THREE.Mesh[] = [];

  // 5 curved cisternae plates with swollen rims
  for (let g = 0; g < 5; g++) {
    const cisternaGeo = new THREE.CylinderGeometry(0.65 + g * 0.04, 0.68 + g * 0.04, 0.06, 24);
    const cisterna = new THREE.Mesh(cisternaGeo, golgiMat);
    cisterna.position.set(0, g * 0.14 - 0.28, 0);
    cisterna.scale.set(1.4, 1.0, 0.5); // Crescent pancake shape
    cisterna.rotation.y = 0.2 * g;
    cisterna.rotation.z = 0.08 * (g - 2);
    golgiGroup.add(cisterna);
    golgiHighlightMeshes.push(cisterna);
  }

  // Budding transport vesicles
  const vGeo = new THREE.SphereGeometry(0.09, 12, 12);
  for (let v = 0; v < 8; v++) {
    const vesicle = new THREE.Mesh(vGeo, vesicleMat);
    vesicle.position.set(
      0.85 + Math.random() * 0.4,
      (Math.random() - 0.5) * 0.7,
      (Math.random() - 0.5) * 0.5
    );
    golgiGroup.add(vesicle);
  }

  golgiGroup.userData = { organelleId: 'golgi' };
  root.add(golgiGroup);
  organelleGroups.set('golgi', {
    id: 'golgi',
    group: golgiGroup,
    basePosition: new THREE.Vector3(1.7, -1.1, -0.9),
    explodeDirection: new THREE.Vector3(0.8, -0.6, -0.4).normalize(),
    materials: [golgiMat, vesicleMat],
    highlightMeshes: golgiHighlightMeshes,
  });

  // ==========================================
  // 7. LYSOSOMES & PEROXISOMES (Animal)
  // Spherical hydrolytic digestive enzyme vesicles
  // ==========================================
  const lysoGroup = new THREE.Group();
  lysoGroup.position.set(0.7, 1.7, -1.4);

  const lysoMat = getMat(0x06b6d4, 0x22d3ee, 0x666666, {
    roughness: 0.2,
    clearcoat: 0.5,
    transmission: 0.35,
    transparent: true,
  });

  const lysoHighlightMeshes: THREE.Mesh[] = [];

  // Primary lysosome
  const lysoGeo = new THREE.SphereGeometry(0.38, 24, 24);
  const lyso1 = new THREE.Mesh(lysoGeo, lysoMat);
  lysoGroup.add(lyso1);
  lysoHighlightMeshes.push(lyso1);

  // Secondary lysosome
  const lyso2 = new THREE.Mesh(new THREE.SphereGeometry(0.28, 20, 20), lysoMat);
  lyso2.position.set(-0.6, -0.4, 0.4);
  lysoGroup.add(lyso2);

  // Peroxisome with crystalline core
  const peroxGeo = new THREE.SphereGeometry(0.32, 20, 20);
  const perox = new THREE.Mesh(peroxGeo, lysoMat);
  perox.position.set(0.8, -0.5, 0.2);
  const coreMesh = new THREE.Mesh(
    new THREE.BoxGeometry(0.12, 0.12, 0.12),
    getMat(0x0891b2, 0x67e8f9, 0x222222, { roughness: 0.1 })
  );
  perox.add(coreMesh);
  lysoGroup.add(perox);

  lysoGroup.userData = { organelleId: 'lysosome' };
  root.add(lysoGroup);
  organelleGroups.set('lysosome', {
    id: 'lysosome',
    group: lysoGroup,
    basePosition: new THREE.Vector3(0.7, 1.7, -1.4),
    explodeDirection: new THREE.Vector3(0.4, 0.8, -0.7).normalize(),
    materials: [lysoMat],
    highlightMeshes: lysoHighlightMeshes,
  });

  // ==========================================
  // 8. CENTROSOME & MICROTUBULE ASTER (Animal)
  // Perpendicular cylindrical centrioles with 9-triplet bundles
  // ==========================================
  const centroGroup = new THREE.Group();
  centroGroup.position.set(-0.6, -1.6, 1.2);

  const centroMat = getMat(0x10b981, 0x34d399, 0x777777, {
    roughness: 0.35,
    metalness: 0.15,
  });

  function createCentriole(): THREE.Group {
    const c = new THREE.Group();
    for (let t = 0; t < 9; t++) {
      const angle = (t / 9) * Math.PI * 2;
      const x = 0.12 * Math.cos(angle);
      const z = 0.12 * Math.sin(angle);
      const triplet = new THREE.Mesh(new THREE.CylinderGeometry(0.022, 0.022, 0.45, 8), centroMat);
      triplet.position.set(x, 0, z);
      triplet.rotation.y = angle + 0.3;
      c.add(triplet);
    }
    return c;
  }

  const c1 = createCentriole();
  const c2 = createCentriole();
  c2.rotation.x = Math.PI * 0.5; // Perpendicular
  c2.position.set(0.15, 0.15, 0);
  centroGroup.add(c1);
  centroGroup.add(c2);

  // Microtubule filament radiating rays
  const filamentMat = new THREE.LineBasicMaterial({
    color: isFluo ? 0x34d399 : 0x059669,
    transparent: true,
    opacity: 0.6,
  });

  for (let f = 0; f < 18; f++) {
    const dir = new THREE.Vector3(
      Math.random() - 0.5,
      Math.random() - 0.5,
      Math.random() - 0.5
    ).normalize().multiplyScalar(1.2 + Math.random() * 0.8);
    const lineGeo = new THREE.BufferGeometry().setFromPoints([new THREE.Vector3(0, 0, 0), dir]);
    const line = new THREE.Line(lineGeo, filamentMat);
    centroGroup.add(line);
  }

  centroGroup.userData = { organelleId: 'centrosome' };
  root.add(centroGroup);
  organelleGroups.set('centrosome', {
    id: 'centrosome',
    group: centroGroup,
    basePosition: new THREE.Vector3(-0.6, -1.6, 1.2),
    explodeDirection: new THREE.Vector3(-0.3, -0.8, 0.6).normalize(),
    materials: [centroMat],
    highlightMeshes: [c1.children[0] as THREE.Mesh, c2.children[0] as THREE.Mesh],
  });

  // ==========================================
  // 9. PLANT CELL SPECIFICS: CHLOROPLAST & VACUOLE
  // ==========================================
  if (cellType === 'plant') {
    // Chloroplast with Thylakoid Stacks
    const chloroGroup = new THREE.Group();
    chloroGroup.position.set(2.0, 0.8, 1.1);

    const chloroMat = getMat(0x22c55e, 0x4ade80, 0x666666, {
      roughness: 0.25,
      clearcoat: 0.4,
      transmission: 0.35,
      transparent: true,
    });

    const thylakoidMat = getMat(0x16a34a, 0x86efac, 0x333333, { roughness: 0.3 });

    // Outer envelope
    const chloroOuter = new THREE.Mesh(new THREE.CapsuleGeometry(0.42, 1.1, 16, 24), chloroMat);
    chloroGroup.add(chloroOuter);

    // Stacks of thylakoid discs (grana)
    for (let stack = -0.35; stack <= 0.35; stack += 0.25) {
      for (let disc = 0; disc < 5; disc++) {
        const thyla = new THREE.Mesh(new THREE.CylinderGeometry(0.18, 0.18, 0.02, 16), thylakoidMat);
        thyla.position.set(0, stack, disc * 0.035 - 0.07);
        thyla.rotation.x = Math.PI * 0.5;
        chloroGroup.add(thyla);
      }
    }

    chloroGroup.userData = { organelleId: 'chloroplast' };
    root.add(chloroGroup);
    organelleGroups.set('chloroplast', {
      id: 'chloroplast',
      group: chloroGroup,
      basePosition: new THREE.Vector3(2.0, 0.8, 1.1),
      explodeDirection: new THREE.Vector3(0.9, 0.4, 0.5).normalize(),
      materials: [chloroMat, thylakoidMat],
      highlightMeshes: [chloroOuter],
    });

    // Massive Central Vacuole
    const vacuoleGroup = new THREE.Group();
    vacuoleGroup.position.set(-0.4, 0.2, 0.3);

    const vacuoleMat = getMat(0x0284c7, 0x38bdf8, 0x555555, {
      transmission: 0.8,
      roughness: 0.1,
      clearcoat: 0.8,
      transparent: true,
      opacity: 0.65,
    });

    const vacMesh = new THREE.Mesh(new THREE.SphereGeometry(1.6, 32, 24), vacuoleMat);
    vacMesh.scale.set(1.2, 0.9, 1.1);
    vacuoleGroup.add(vacMesh);

    vacuoleGroup.userData = { organelleId: 'vacuole' };
    root.add(vacuoleGroup);
    organelleGroups.set('vacuole', {
      id: 'vacuole',
      group: vacuoleGroup,
      basePosition: new THREE.Vector3(-0.4, 0.2, 0.3),
      explodeDirection: new THREE.Vector3(-0.3, 0.2, 0.3).normalize(),
      materials: [vacuoleMat],
      highlightMeshes: [vacMesh],
    });
  }

  // ==========================================
  // 10. CYTOPLASMIC FLOATING MACROMOLECULE PARTICLES
  // ATP & Metabolic Flux simulation particles
  // ==========================================
  const particleCount = 280;
  const particleGeo = new THREE.BufferGeometry();
  const particlePositions = new Float32Array(particleCount * 3);
  const particleColors = new Float32Array(particleCount * 3);

  const pColor = new THREE.Color(isFluo ? 0x38bdf8 : 0xfbbf24);

  for (let p = 0; p < particleCount; p++) {
    // Generate within a sphere of radius 2.8, avoiding nucleus core
    const rad = 1.3 + Math.random() * 1.6;
    const theta = Math.random() * Math.PI * 2;
    const phi = Math.acos(2 * Math.random() - 1);

    particlePositions[p * 3] = rad * Math.sin(phi) * Math.cos(theta);
    particlePositions[p * 3 + 1] = rad * Math.sin(phi) * Math.sin(theta);
    particlePositions[p * 3 + 2] = rad * Math.cos(phi);

    particleColors[p * 3] = pColor.r;
    particleColors[p * 3 + 1] = pColor.g;
    particleColors[p * 3 + 2] = pColor.b;
  }

  particleGeo.setAttribute('position', new THREE.BufferAttribute(particlePositions, 3));
  particleGeo.setAttribute('color', new THREE.BufferAttribute(particleColors, 3));

  const particleMat = new THREE.PointsMaterial({
    size: 0.055,
    vertexColors: true,
    transparent: true,
    opacity: 0.65,
    blending: THREE.AdditiveBlending,
  });

  const particleSystem = new THREE.Points(particleGeo, particleMat);
  root.add(particleSystem);

  return { root, organelleGroups, particleSystem };
}
