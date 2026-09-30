import * as THREE from 'three';

export interface CoastalMeshes {
  coastalEnvironment: THREE.Group;
  landMesh: THREE.Mesh;
  seaMesh: THREE.Mesh;
  landMaterial: THREE.MeshPhysicalMaterial;
  seaMaterial: THREE.MeshPhysicalMaterial;
  boatsGroup: THREE.Group;
  treesGroup: THREE.Group;
  lighthouseBeam: THREE.SpotLight;
  shoreFoamMesh: THREE.Mesh;
  dioramaBase: THREE.Mesh;
  updateWindReaction: (delta: number, time: number, windSpeed: number, isSeaBreeze: boolean) => void;
}

/**
 * Builds a SINGLE, UNIFIED, SEAMLESS Coastal Geological Block (Diorama):
 * - One continuous piece of Earth's crust: Land hills -> Sandy beach -> Seabed
 * - Solid geological bedrock base (cross-section sides & bottom) so nothing floats disconnected
 * - Living sea water naturally filling the ocean basin
 * - Anchored lighthouse, rooted palm trees, shoreline windsock, and naturally floating boats
 */
export function createCoastalEnvironment(): CoastalMeshes {
  const coastalEnvironment = new THREE.Group();
  coastalEnvironment.name = 'CoastalEnvironment';

  // ==========================================
  // 1. UNIFIED CONTINUOUS TERRAIN (Darat + Pantai + Dasar Laut)
  // Single continuous vertex grid: x from -14 to +14, z from -9 to +9
  // ==========================================
  const terrainWidth = 28;
  const terrainDepth = 18;
  const segmentsX = 84;
  const segmentsZ = 54;

  const terrainGeo = new THREE.PlaneGeometry(terrainWidth, terrainDepth, segmentsX, segmentsZ);
  terrainGeo.rotateX(-Math.PI / 2);

  const tPos = terrainGeo.attributes.position;
  // Vertex colors for seamless blending: Grass (green) -> Sand (golden) -> Seabed (dark navy sand)
  const colors = new Float32Array(tPos.count * 3);

  const grassColor = new THREE.Color(0x3f6212); // Natural lush green
  const hillRockColor = new THREE.Color(0x475569); // Rocky headland
  const sandColor = new THREE.Color(0xd97706); // Warm golden beach sand
  const wetSandColor = new THREE.Color(0x92400e); // Dark wet shoreline sand
  const seabedColor = new THREE.Color(0x0f172a); // Deep marine seabed

  for (let i = 0; i < tPos.count; i++) {
    const x = tPos.getX(i);
    const z = tPos.getZ(i);
    let y = 0;

    if (x < -1.0) {
      // LAND REGION (x < -1.0)
      const inlandDist = Math.abs(x + 1.0);
      // Gentle coastal bluffs, headland promontory, and natural rolling hills
      y = Math.pow(inlandDist / 7.0, 1.35) * 3.4
        + Math.sin(z * 0.4) * 0.45
        + Math.cos(x * 0.5) * 0.35
        + Math.sin(x * 1.5 + z * 1.1) * 0.12;

      // Color: Hills blend from grass to rock at high elevations
      const col = y > 2.2 ? hillRockColor : grassColor;
      colors[i * 3] = col.r;
      colors[i * 3 + 1] = col.g;
      colors[i * 3 + 2] = col.b;
    } else if (x <= 1.5) {
      // BEACH SHORELINE REGION (-1.0 <= x <= 1.5)
      // Slopes gently down to sea level (y = 0) and into the shallow surf
      const t = (x + 1.0) / 2.5; // 0 at land border, 1 at sea shelf
      y = 0.5 * (1 - t) - 0.4 * t;

      // Color: Sand blending into wet sand
      const col = t > 0.4 ? wetSandColor : sandColor;
      colors[i * 3] = col.r;
      colors[i * 3 + 1] = col.g;
      colors[i * 3 + 2] = col.b;
    } else {
      // CONTINENTAL SHELF & SEABED (x > 1.5)
      // Dips into deep ocean basin with gentle ripples
      const seaDist = x - 1.5;
      y = -0.4 - Math.min(2.0, Math.pow(seaDist / 6.0, 1.1) * 2.0)
        + Math.sin(x * 0.8 + z * 0.6) * 0.08;

      colors[i * 3] = seabedColor.r;
      colors[i * 3 + 1] = seabedColor.g;
      colors[i * 3 + 2] = seabedColor.b;
    }

    tPos.setY(i, y);
  }

  terrainGeo.setAttribute('color', new THREE.BufferAttribute(colors, 3));
  terrainGeo.computeVertexNormals();

  const landMaterial = new THREE.MeshPhysicalMaterial({
    vertexColors: true,
    roughness: 0.85,
    metalness: 0.04,
    clearcoat: 0.1,
    flatShading: true,
  });

  const landMesh = new THREE.Mesh(terrainGeo, landMaterial);
  landMesh.name = 'Land';
  landMesh.receiveShadow = true;
  landMesh.castShadow = true;
  coastalEnvironment.add(landMesh);

  // ==========================================
  // 2. SOLID GEOLOGICAL BEDROCK BASE (Diorama Pedestal)
  // Forms a unified solid block so the scene never looks like loose floating sheets!
  // ==========================================
  const baseDepth = 4.0;
  const baseGeo = new THREE.BoxGeometry(terrainWidth, baseDepth, terrainDepth);
  const baseMat = new THREE.MeshStandardMaterial({
    color: 0x1e293b, // Dark geological strata slate
    roughness: 0.9,
    metalness: 0.1,
  });
  const dioramaBase = new THREE.Mesh(baseGeo, baseMat);
  dioramaBase.name = 'GeologicalBedrockBase';
  // Position directly beneath the terrain grid
  dioramaBase.position.set(0, -baseDepth / 2 - 0.02, 0);
  coastalEnvironment.add(dioramaBase);

  // Decorative border rim around diorama
  const rimGeo = new THREE.BoxGeometry(terrainWidth + 0.4, 0.3, terrainDepth + 0.4);
  const rimMat = new THREE.MeshStandardMaterial({ color: 0x0f172a, roughness: 0.8 });
  const rim = new THREE.Mesh(rimGeo, rimMat);
  rim.position.set(0, -0.15, 0);
  coastalEnvironment.add(rim);

  // ==========================================
  // 3. LIVING OCEAN WATER (Naturally Filling Ocean Basin)
  // Water plane perfectly aligned with shoreline: x from 0 to 14
  // ==========================================
  const seaWidth = 14;
  const seaDepth = terrainDepth;
  const seaGeo = new THREE.PlaneGeometry(seaWidth, seaDepth, 48, 48);
  seaGeo.rotateX(-Math.PI / 2);

  const seaMaterial = new THREE.MeshPhysicalMaterial({
    color: 0x0284c7, // Vibrant coastal cerulean
    roughness: 0.12,
    metalness: 0.1,
    transmission: 0.5,
    transparent: true,
    opacity: 0.88,
    clearcoat: 0.95,
    clearcoatRoughness: 0.05,
    ior: 1.333,
  });

  const seaMesh = new THREE.Mesh(seaGeo, seaMaterial);
  seaMesh.name = 'Sea';
  // Placed at y = 0, exactly filling the right half from x = 0 to 14
  seaMesh.position.set(seaWidth / 2, 0, 0);
  seaMesh.receiveShadow = true;
  coastalEnvironment.add(seaMesh);

  // Shoreline foaming wave strip where water washes up the sand (x = 0.1)
  const foamGeo = new THREE.PlaneGeometry(0.7, terrainDepth, 8, 32);
  foamGeo.rotateX(-Math.PI / 2);
  const foamMat = new THREE.MeshBasicMaterial({
    color: 0xffffff,
    transparent: true,
    opacity: 0.6,
    blending: THREE.AdditiveBlending,
  });
  const shoreFoamMesh = new THREE.Mesh(foamGeo, foamMat);
  shoreFoamMesh.position.set(0.15, 0.04, 0);
  coastalEnvironment.add(shoreFoamMesh);

  // ==========================================
  // 4. ANCHORED COASTAL VEGETATION (Palm Trees Rooted to Hills)
  // ==========================================
  const treesGroup = new THREE.Group();
  treesGroup.name = 'PalmTrees';

  interface TreeInstance {
    group: THREE.Group;
    baseZRotation: number;
  }
  const treeInstances: TreeInstance[] = [];

  function createRootedPalmTree(x: number, y: number, z: number, scale = 1.0): THREE.Group {
    const tree = new THREE.Group();

    // Curved trunk with root flared base
    const trunkMat = new THREE.MeshStandardMaterial({ color: 0x78350f, roughness: 0.9 });
    const trunkGeo = new THREE.CylinderGeometry(0.1 * scale, 0.22 * scale, 2.4 * scale, 8);
    const trunk = new THREE.Mesh(trunkGeo, trunkMat);
    trunk.position.y = (2.4 * scale) / 2;
    tree.add(trunk);

    // Crown of 6 palm fronds
    const frondMat = new THREE.MeshStandardMaterial({
      color: 0x16a34a,
      roughness: 0.6,
      side: THREE.DoubleSide,
    });

    for (let f = 0; f < 6; f++) {
      const angle = (f / 6) * Math.PI * 2;
      const frondGeo = new THREE.ConeGeometry(0.5 * scale, 1.8 * scale, 4);
      const frond = new THREE.Mesh(frondGeo, frondMat);
      frond.position.set(0, 2.3 * scale, 0);
      frond.rotation.y = angle;
      frond.rotation.z = Math.PI * 0.42;
      tree.add(frond);
    }

    tree.position.set(x, y, z);
    return tree;
  }

  // Plant trees naturally following the contour heights
  const treeCoords = [
    [-3.5, 0.8, -4.5, 0.9],
    [-4.5, 1.2, -2.0, 1.05],
    [-3.8, 0.9, 2.5, 0.95],
    [-5.5, 1.5, 5.0, 1.15],
    [-7.0, 2.2, -0.5, 1.2],
    [-8.0, 2.8, 3.5, 1.1],
  ];

  treeCoords.forEach(([tx, ty, tz, sc]) => {
    const tGroup = createRootedPalmTree(tx, ty, tz, sc);
    treesGroup.add(tGroup);
    treeInstances.push({ group: tGroup, baseZRotation: 0 });
  });
  coastalEnvironment.add(treesGroup);

  // ==========================================
  // 5. ANCHORED LIGHTHOUSE ON HEADLAND PROMONTORY
  // ==========================================
  const lighthouseGroup = new THREE.Group();
  lighthouseGroup.name = 'Lighthouse';
  lighthouseGroup.position.set(-10.5, 3.4, -4.5);

  const towerGeo = new THREE.CylinderGeometry(0.48, 0.78, 4.2, 16);
  const towerMat = new THREE.MeshStandardMaterial({ color: 0xf8fafc, roughness: 0.4 });
  const tower = new THREE.Mesh(towerGeo, towerMat);
  tower.position.y = 2.1;
  lighthouseGroup.add(tower);

  // Red band
  const stripeGeo = new THREE.CylinderGeometry(0.54, 0.66, 1.0, 16);
  const stripeMat = new THREE.MeshStandardMaterial({ color: 0xdc2626, roughness: 0.4 });
  const stripe = new THREE.Mesh(stripeGeo, stripeMat);
  stripe.position.y = 2.5;
  lighthouseGroup.add(stripe);

  // Lantern room
  const lanternGeo = new THREE.CylinderGeometry(0.4, 0.4, 0.8, 12);
  const lanternMat = new THREE.MeshPhysicalMaterial({
    color: 0xfef08a,
    emissive: 0xfef08a,
    emissiveIntensity: 0.85,
    transparent: true,
    opacity: 0.9,
  });
  const lantern = new THREE.Mesh(lanternGeo, lanternMat);
  lantern.position.y = 4.6;
  lighthouseGroup.add(lantern);

  const lighthouseBeam = new THREE.SpotLight(0xfef08a, 0, 38, Math.PI * 0.12, 0.35, 1.2);
  lighthouseBeam.position.set(0, 4.6, 0);
  lighthouseBeam.target.position.set(16, 0, 0);
  lighthouseGroup.add(lighthouseBeam);
  lighthouseGroup.add(lighthouseBeam.target);

  coastalEnvironment.add(lighthouseGroup);

  // ==========================================
  // 6. TRADITIONAL FISHERMAN BOATS (Perahu Cadik Nelayan)
  // Naturally bobbing on the water surface with billowing sails
  // ==========================================
  const boatsGroup = new THREE.Group();
  boatsGroup.name = 'FishermanBoats';

  interface BoatInstance {
    boat: THREE.Group;
    sailMesh: THREE.Mesh;
    baseX: number;
    baseZ: number;
  }
  const boatInstances: BoatInstance[] = [];

  function createFishermanBoat(): { boat: THREE.Group; sailMesh: THREE.Mesh } {
    const boat = new THREE.Group();

    // Wooden hull
    const hullGeo = new THREE.ConeGeometry(0.28, 2.2, 8);
    hullGeo.rotateX(Math.PI / 2);
    hullGeo.scale(1.0, 0.45, 1.0);
    const hullMat = new THREE.MeshStandardMaterial({ color: 0x7c2d12, roughness: 0.75 });
    const hull = new THREE.Mesh(hullGeo, hullMat);
    hull.position.y = 0.05;
    boat.add(hull);

    // Twin outrigger floats (cadik)
    const floatGeo = new THREE.CylinderGeometry(0.055, 0.055, 1.9, 8);
    floatGeo.rotateZ(Math.PI / 2);
    const floatMat = new THREE.MeshStandardMaterial({ color: 0xfde047, roughness: 0.5 });

    const leftFloat = new THREE.Mesh(floatGeo, floatMat);
    leftFloat.position.set(0.7, 0.05, 0);
    boat.add(leftFloat);

    const rightFloat = new THREE.Mesh(floatGeo, floatMat);
    rightFloat.position.set(-0.7, 0.05, 0);
    boat.add(rightFloat);

    // Bamboo crossbeams
    const beamGeo = new THREE.CylinderGeometry(0.025, 0.025, 1.6, 6);
    beamGeo.rotateZ(Math.PI / 2);
    const beam1 = new THREE.Mesh(beamGeo, floatMat);
    beam1.position.set(0, 0.15, 0.4);
    boat.add(beam1);
    const beam2 = new THREE.Mesh(beamGeo, floatMat);
    beam2.position.set(0, 0.15, -0.4);
    boat.add(beam2);

    // Triangular canvas sail (Layar Nelayan)
    const sailGeo = new THREE.BufferGeometry();
    const sailVerts = new Float32Array([
      0, 0.22, 0.55,
      0, 2.1, -0.18,
      0, 0.3, -0.75,
    ]);
    sailGeo.setAttribute('position', new THREE.BufferAttribute(sailVerts, 3));
    sailGeo.computeVertexNormals();

    const sailMat = new THREE.MeshStandardMaterial({
      color: 0xf8fafc,
      side: THREE.DoubleSide,
      roughness: 0.6,
    });
    const sailMesh = new THREE.Mesh(sailGeo, sailMat);
    sailMesh.name = 'Sail';
    boat.add(sailMesh);

    return { boat, sailMesh };
  }

  // Position boats comfortably across the sea basin
  const boatCoords = [
    [4.0, -2.5, 1.0],
    [7.5, 2.0, 0.9],
    [11.0, -3.5, 0.8],
  ];

  boatCoords.forEach(([bx, bz, bScale]) => {
    const { boat, sailMesh } = createFishermanBoat();
    boat.position.set(bx, 0.05, bz);
    boat.scale.set(bScale, bScale, bScale);
    boatsGroup.add(boat);
    boatInstances.push({ boat, sailMesh, baseX: bx, baseZ: bz });
  });

  coastalEnvironment.add(boatsGroup);

  // ==========================================
  // 7. DYNAMIC WIND & WATER REACTION UPDATE
  // ==========================================
  const updateWindReaction = (delta: number, time: number, windSpeed: number, isSeaBreeze: boolean) => {
    // A. Trees sway
    const windTilt = (isSeaBreeze ? -1 : 1) * Math.min(0.24, (windSpeed / 6.0) * 0.2);
    treeInstances.forEach((inst, idx) => {
      const gust = Math.sin(time * (3.5 + idx * 0.4)) * 0.05 * (windSpeed / 5.0);
      inst.group.rotation.z = windTilt + gust;
    });

    // B. Boat heading, billowing sail & ocean rolling
    const boatHeading = isSeaBreeze ? -Math.PI / 2 : Math.PI / 2;
    const sailBillow = (isSeaBreeze ? -1 : 1) * Math.min(0.32, (windSpeed / 5.0) * 0.28);

    boatInstances.forEach((inst, bIdx) => {
      inst.boat.rotation.y = THREE.MathUtils.lerp(inst.boat.rotation.y, boatHeading, 0.05);
      inst.boat.position.y = 0.05 + Math.sin(time * 2.2 + bIdx * 1.5) * 0.06;
      inst.boat.rotation.z = Math.sin(time * 1.8 + bIdx) * 0.05;
      inst.boat.rotation.x = Math.cos(time * 1.5 + bIdx) * 0.03;
      inst.sailMesh.rotation.y = sailBillow + Math.sin(time * 4.0 + bIdx) * 0.035;
    });

    // C. Shore wave foam wash
    if (shoreFoamMesh) {
      const wash = Math.sin(time * 2.0);
      shoreFoamMesh.position.x = 0.15 + wash * 0.25;
      (shoreFoamMesh.material as THREE.MeshBasicMaterial).opacity = 0.4 + wash * 0.25;
    }

    // D. Sea water ripple vertices
    if (seaMesh) {
      const pos = seaMesh.geometry.attributes.position;
      for (let i = 0; i < pos.count; i++) {
        const vx = pos.getX(i);
        const vz = pos.getZ(i);
        // Waves propagate along wind direction!
        const waveDir = isSeaBreeze ? -1 : 1;
        const wave = Math.sin((vx * waveDir * 0.7) + (time * 2.0)) * 0.06
                   + Math.cos(vz * 0.5 + time * 1.6) * 0.04;
        pos.setY(i, wave);
      }
      seaMesh.geometry.computeVertexNormals();
      seaMesh.geometry.attributes.position.needsUpdate = true;
    }
  };

  return {
    coastalEnvironment,
    landMesh,
    seaMesh,
    landMaterial,
    seaMaterial,
    boatsGroup,
    treesGroup,
    lighthouseBeam,
    shoreFoamMesh,
    dioramaBase,
    updateWindReaction,
  };
}
