import * as THREE from 'three';

export interface AtmosphereMeshes {
  atmosphereGroup: THREE.Group;
  sunGroup: THREE.Group;
  sunLight: THREE.DirectionalLight;
  moonGroup: THREE.Group;
  moonLight: THREE.DirectionalLight;
  cloudsGroup: THREE.Group;
  airParticles: THREE.Points;
  particlePositions: Float32Array;
  particleColors: Float32Array;
  pressureGroup: THREE.Group;
  landPressureSign: THREE.Group;
  seaPressureSign: THREE.Group;
}

/**
 * Creates clean, uncluttered atmospheric elements:
 * - Orbital Sun & Moon with atmospheric lighting
 * - Soft cumulus clouds drifting aloft
 * - High-altitude floating pressure badges (H & L) that never block ground objects
 * - Streamlined closed-loop air particles
 */
export function createAtmosphereAndWind(): AtmosphereMeshes {
  const atmosphereGroup = new THREE.Group();
  atmosphereGroup.name = 'Atmosphere';

  // ==========================================
  // 1. SUN & CELESTIAL LIGHTING
  // ==========================================
  const sunGroup = new THREE.Group();
  sunGroup.name = 'Sun';

  const sunSphereGeo = new THREE.SphereGeometry(1.5, 24, 24);
  const sunSphereMat = new THREE.MeshBasicMaterial({ color: 0xfffbeb });
  const sunSphere = new THREE.Mesh(sunSphereGeo, sunSphereMat);
  sunGroup.add(sunSphere);

  const coronaGeo = new THREE.SphereGeometry(2.2, 20, 20);
  const coronaMat = new THREE.MeshBasicMaterial({
    color: 0xf59e0b,
    transparent: true,
    opacity: 0.4,
    side: THREE.BackSide,
  });
  const corona = new THREE.Mesh(coronaGeo, coronaMat);
  sunGroup.add(corona);

  const sunLight = new THREE.DirectionalLight(0xfff7ed, 2.2);
  sunLight.castShadow = true;
  sunLight.shadow.mapSize.width = 2048;
  sunLight.shadow.mapSize.height = 2048;
  sunGroup.add(sunLight);
  atmosphereGroup.add(sunGroup);

  // ==========================================
  // 2. MOON (Nighttime celestial illumination)
  // ==========================================
  const moonGroup = new THREE.Group();
  moonGroup.name = 'Moon';

  const moonSphereGeo = new THREE.SphereGeometry(1.1, 20, 20);
  const moonSphereMat = new THREE.MeshBasicMaterial({ color: 0xe2e8f0 });
  const moonSphere = new THREE.Mesh(moonSphereGeo, moonSphereMat);
  moonGroup.add(moonSphere);

  const moonCoronaGeo = new THREE.SphereGeometry(1.6, 16, 16);
  const moonCoronaMat = new THREE.MeshBasicMaterial({
    color: 0x38bdf8,
    transparent: true,
    opacity: 0.25,
    side: THREE.BackSide,
  });
  moonGroup.add(new THREE.Mesh(moonCoronaGeo, moonCoronaMat));

  const moonLight = new THREE.DirectionalLight(0x93c5fd, 0.4);
  moonGroup.add(moonLight);
  atmosphereGroup.add(moonGroup);

  // ==========================================
  // 3. CUMULUS CLOUDS (Awan Konveksi)
  // Positioned high in the sky (y > 6.5) so they never crowd the surface
  // ==========================================
  const cloudsGroup = new THREE.Group();
  cloudsGroup.name = 'Clouds';

  function createFluffyCloud(): THREE.Group {
    const cloud = new THREE.Group();
    const cloudMat = new THREE.MeshStandardMaterial({
      color: 0xffffff,
      roughness: 0.85,
      metalness: 0.05,
      transparent: true,
      opacity: 0.9,
    });

    const puffCoords = [
      [0, 0, 0, 0.9],
      [0.7, -0.1, 0.15, 0.75],
      [-0.7, -0.1, -0.15, 0.7],
      [0.35, 0.25, -0.2, 0.65],
      [-0.35, 0.28, 0.2, 0.65],
    ];
    puffCoords.forEach(([px, py, pz, pr]) => {
      const puff = new THREE.Mesh(new THREE.SphereGeometry(pr, 12, 12), cloudMat);
      puff.position.set(px, py, pz);
      cloud.add(puff);
    });
    return cloud;
  }

  const cloud1 = createFluffyCloud();
  cloud1.position.set(-6.5, 7.2, -3.5);
  cloudsGroup.add(cloud1);

  const cloud2 = createFluffyCloud();
  cloud2.position.set(-3.5, 6.8, 3.5);
  cloud2.scale.set(0.85, 0.85, 0.85);
  cloudsGroup.add(cloud2);

  const cloud3 = createFluffyCloud();
  cloud3.position.set(6.5, 7.0, -3.0);
  cloud3.scale.set(0.8, 0.8, 0.8);
  cloudsGroup.add(cloud3);

  atmosphereGroup.add(cloudsGroup);

  // ==========================================
  // 4. AIR PARTICLES (Sirkulasi Konveksi Halus)
  // Clean count (100 particles) with clear spacing, not crowded
  // ==========================================
  const particleCount = 100;
  const particleGeo = new THREE.BufferGeometry();
  const particlePositions = new Float32Array(particleCount * 3);
  const particleColors = new Float32Array(particleCount * 3);

  for (let i = 0; i < particleCount; i++) {
    const progress = i / particleCount;
    let x = 0;
    let y = 0;
    const leg = progress * 4;
    if (leg < 1) {
      x = 8 - leg * 16;
      y = 1.0;
    } else if (leg < 2) {
      x = -8;
      y = 1.0 + (leg - 1) * 4.8;
    } else if (leg < 3) {
      x = -8 + (leg - 2) * 16;
      y = 5.8;
    } else {
      x = 8;
      y = 5.8 - (leg - 3) * 4.8;
    }

    particlePositions[i * 3] = x;
    particlePositions[i * 3 + 1] = y;
    particlePositions[i * 3 + 2] = ((i % 5) - 2) * 1.5;

    particleColors[i * 3] = 0.2;
    particleColors[i * 3 + 1] = 0.8;
    particleColors[i * 3 + 2] = 1.0;
  }

  particleGeo.setAttribute('position', new THREE.BufferAttribute(particlePositions, 3));
  particleGeo.setAttribute('color', new THREE.BufferAttribute(particleColors, 3));

  const particleMat = new THREE.PointsMaterial({
    size: 0.14,
    vertexColors: true,
    transparent: true,
    opacity: 0.75,
    blending: THREE.AdditiveBlending,
  });

  const airParticles = new THREE.Points(particleGeo, particleMat);
  airParticles.name = 'AirParticles';
  atmosphereGroup.add(airParticles);

  // ==========================================
  // 5. FLOATING PRESSURE BADGES (H & L)
  // Positioned high aloft (y = 5.8) over land & sea so they don't crowd the ground
  // ==========================================
  const pressureGroup = new THREE.Group();
  pressureGroup.name = 'PressureVisualization';

  function createFloatingBadge(type: 'H' | 'L'): THREE.Group {
    const badge = new THREE.Group();
    const isHigh = type === 'H';
    const color = isHigh ? 0x0284c7 : 0xef4444;

    // Elegant ring badge
    const ringGeo = new THREE.TorusGeometry(0.7, 0.04, 8, 24);
    const ringMat = new THREE.MeshBasicMaterial({ color });
    badge.add(new THREE.Mesh(ringGeo, ringMat));

    // Glowing center sphere
    const sphereGeo = new THREE.SphereGeometry(0.2, 12, 12);
    const sphereMat = new THREE.MeshBasicMaterial({ color });
    badge.add(new THREE.Mesh(sphereGeo, sphereMat));

    // 3D Letter H or L inside ring
    const letterMat = new THREE.MeshBasicMaterial({ color: 0xffffff });
    if (isHigh) {
      const l1 = new THREE.Mesh(new THREE.BoxGeometry(0.1, 0.5, 0.1), letterMat);
      l1.position.x = -0.15;
      badge.add(l1);
      const l2 = new THREE.Mesh(new THREE.BoxGeometry(0.1, 0.5, 0.1), letterMat);
      l2.position.x = 0.15;
      badge.add(l2);
      const bar = new THREE.Mesh(new THREE.BoxGeometry(0.3, 0.1, 0.1), letterMat);
      badge.add(bar);
    } else {
      const v = new THREE.Mesh(new THREE.BoxGeometry(0.1, 0.5, 0.1), letterMat);
      v.position.x = -0.1;
      badge.add(v);
      const h = new THREE.Mesh(new THREE.BoxGeometry(0.3, 0.1, 0.1), letterMat);
      h.position.set(0.05, -0.2, 0);
      badge.add(h);
    }

    return badge;
  }

  const landPressureSign = createFloatingBadge('L');
  landPressureSign.position.set(-7.5, 5.8, -1.0);
  pressureGroup.add(landPressureSign);

  const seaPressureSign = createFloatingBadge('H');
  seaPressureSign.position.set(7.5, 5.8, -1.0);
  pressureGroup.add(seaPressureSign);

  atmosphereGroup.add(pressureGroup);

  return {
    atmosphereGroup,
    sunGroup,
    sunLight,
    moonGroup,
    moonLight,
    cloudsGroup,
    airParticles,
    particlePositions,
    particleColors,
    pressureGroup,
    landPressureSign,
    seaPressureSign,
  };
}
