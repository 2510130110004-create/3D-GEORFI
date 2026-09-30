import * as THREE from 'three';
import { MeteorologicalState } from '../../types/geography';

export interface WindStreamlinesSystem {
  root: THREE.Group;
  streamlines: THREE.Line[];
  gustRibbons: THREE.Mesh[];
  updraftParticles: THREE.Points;
  windsockMesh: THREE.Group;
  update: (delta: number, time: number, state: MeteorologicalState) => void;
}

/**
 * Clean, uncluttered, graceful wind visualization system:
 * - 5 well-spaced, aerodynamic streamlines tracing the convection cycle without visual collision
 * - 4 subtle surface breeze ribbons sweeping across the water and beach
 * - Delicate thermal updraft plume rising over the warm surface
 * - Clear, standalone beach windsock
 */
export function createWindStreamlinesSystem(): WindStreamlinesSystem {
  const root = new THREE.Group();
  root.name = 'RealisticWindSystem';

  // ==========================================
  // 1. CLEAN CONVECTIVE WIND STREAMLINES (5 Spaced Lines)
  // ==========================================
  const streamlines: THREE.Line[] = [];
  const streamlineCount = 5;
  const streamlinePointsCount = 64;

  const streamlineMat = new THREE.LineDashedMaterial({
    color: 0x38bdf8,
    dashSize: 1.4,
    gapSize: 0.8,
    linewidth: 2,
    transparent: true,
    opacity: 0.65,
  });

  // Spread across depth cleanly (z = -3.5, -1.8, 0, 1.8, 3.5)
  const zDepths = [-3.5, -1.8, 0.0, 1.8, 3.5];

  for (let s = 0; s < streamlineCount; s++) {
    const z = zDepths[s];
    const w = 8.5;
    const hBottom = 1.0;
    const hTop = 5.6;

    const controlPoints = [
      new THREE.Vector3(w, hBottom, z),
      new THREE.Vector3(0, hBottom, z),
      new THREE.Vector3(-w, hBottom + 0.2, z),
      new THREE.Vector3(-w - 0.5, (hBottom + hTop) * 0.5, z),
      new THREE.Vector3(-w, hTop, z),
      new THREE.Vector3(0, hTop, z),
      new THREE.Vector3(w, hTop, z),
      new THREE.Vector3(w + 0.5, (hBottom + hTop) * 0.5, z),
    ];

    const curve = new THREE.CatmullRomCurve3(controlPoints, true);
    const pts = curve.getPoints(streamlinePointsCount);

    const geo = new THREE.BufferGeometry().setFromPoints(pts);
    const line = new THREE.Line(geo, streamlineMat.clone());
    line.computeLineDistances();
    root.add(line);
    streamlines.push(line);
  }

  // ==========================================
  // 2. SUBTLE BREEZE RIBBONS (4 Soft Flow Strips)
  // Spaced cleanly at different depths
  // ==========================================
  const gustRibbons: THREE.Mesh[] = [];
  const ribbonCount = 4;
  const ribbonGeo = new THREE.PlaneGeometry(3.0, 0.14, 16, 1);
  ribbonGeo.rotateX(-Math.PI / 2);

  const ribbonMat = new THREE.MeshBasicMaterial({
    color: 0x7dd3fc,
    transparent: true,
    opacity: 0.4,
    side: THREE.DoubleSide,
    blending: THREE.AdditiveBlending,
  });

  const ribbonZ = [-3.0, -1.0, 1.0, 3.0];
  for (let r = 0; r < ribbonCount; r++) {
    const ribbon = new THREE.Mesh(ribbonGeo, ribbonMat.clone());
    ribbon.position.set(
      (r - 1.5) * 4.0,
      1.1,
      ribbonZ[r]
    );
    root.add(ribbon);
    gustRibbons.push(ribbon);
  }

  // ==========================================
  // 3. THERMAL UPDRAFT PARTICLES (60 Soft Rising Points)
  // ==========================================
  const updraftCount = 60;
  const updraftGeo = new THREE.BufferGeometry();
  const updraftPositions = new Float32Array(updraftCount * 3);
  const updraftColors = new Float32Array(updraftCount * 3);

  for (let p = 0; p < updraftCount; p++) {
    updraftPositions[p * 3] = -6 + (Math.random() - 0.5) * 4;
    updraftPositions[p * 3 + 1] = 1.0 + Math.random() * 4.5;
    updraftPositions[p * 3 + 2] = (Math.random() - 0.5) * 6;

    updraftColors[p * 3] = 1.0;
    updraftColors[p * 3 + 1] = 0.5;
    updraftColors[p * 3 + 2] = 0.2;
  }

  updraftGeo.setAttribute('position', new THREE.BufferAttribute(updraftPositions, 3));
  updraftGeo.setAttribute('color', new THREE.BufferAttribute(updraftColors, 3));

  const updraftMat = new THREE.PointsMaterial({
    size: 0.18,
    vertexColors: true,
    transparent: true,
    opacity: 0.55,
    blending: THREE.AdditiveBlending,
  });

  const updraftParticles = new THREE.Points(updraftGeo, updraftMat);
  root.add(updraftParticles);

  // ==========================================
  // 4. METEOROLOGICAL WINDSOCK (Clean Placement)
  // Planted firmly into the beach sand shoreline
  // ==========================================
  const windsockMesh = new THREE.Group();
  windsockMesh.name = 'Windsock';
  windsockMesh.position.set(-0.6, 0.2, 3.2);

  const mastGeo = new THREE.CylinderGeometry(0.04, 0.05, 3.2, 8);
  const mastMat = new THREE.MeshStandardMaterial({ color: 0x94a3b8, metalness: 0.7, roughness: 0.3 });
  const mast = new THREE.Mesh(mastGeo, mastMat);
  mast.position.y = 1.6;
  windsockMesh.add(mast);

  const swivel = new THREE.Group();
  swivel.position.set(0, 3.1, 0);

  const sockGeo = new THREE.ConeGeometry(0.22, 1.4, 12, 1, true);
  sockGeo.rotateZ(Math.PI / 2);
  sockGeo.translate(-0.7, 0, 0);

  const sockMat = new THREE.MeshStandardMaterial({
    color: 0xf97316,
    roughness: 0.6,
    side: THREE.DoubleSide,
  });
  const sock = new THREE.Mesh(sockGeo, sockMat);
  sock.name = 'SockCone';
  swivel.add(sock);

  const hoopGeo = new THREE.TorusGeometry(0.23, 0.02, 8, 16);
  hoopGeo.rotateY(Math.PI / 2);
  const hoop = new THREE.Mesh(hoopGeo, mastMat);
  swivel.add(hoop);

  windsockMesh.add(swivel);
  root.add(windsockMesh);

  // ==========================================
  // 5. UPDATE
  // ==========================================
  const update = (delta: number, time: number, state: MeteorologicalState) => {
    const isSeaBreeze = state.windType === 'sea_breeze';
    const isLandBreeze = state.windType === 'land_breeze';
    const windSpeed = state.surfaceWindSpeedMs;

    // A. Streamline glow and opacity
    streamlines.forEach((line, idx) => {
      const mat = line.material as THREE.LineDashedMaterial;
      if (state.windType === 'calm_transition') {
        mat.opacity = 0.15;
      } else {
        mat.opacity = 0.6;
        mat.dashSize = 1.3 + Math.sin(time * 2.0 + idx) * 0.2;
        mat.color.setHex(isSeaBreeze ? 0x38bdf8 : 0x10b981);
      }
    });

    // B. Surface wind ribbons sweep
    gustRibbons.forEach((ribbon, rIdx) => {
      if (state.windType === 'calm_transition') {
        ribbon.visible = false;
        return;
      }
      ribbon.visible = true;

      const moveSpeed = (isSeaBreeze ? -1 : 1) * windSpeed * delta * 1.6;
      ribbon.position.x += moveSpeed;

      if (isSeaBreeze && ribbon.position.x < -8.5) {
        ribbon.position.x = 8.5;
      } else if (isLandBreeze && ribbon.position.x > 8.5) {
        ribbon.position.x = -8.5;
      }

      ribbon.position.y = 1.1 + Math.sin(time * 2.5 + rIdx) * 0.08;
    });

    // C. Thermal Updraft Plume
    const updraftCenterX = isSeaBreeze ? -6.0 : 6.0;
    const positions = updraftParticles.geometry.attributes.position.array as Float32Array;
    const colors = updraftParticles.geometry.attributes.color.array as Float32Array;
    const liftRate = 1.3 * delta;

    for (let i = 0; i < updraftCount; i++) {
      let py = positions[i * 3 + 1];
      py += liftRate * (0.8 + (i % 4) * 0.1);

      if (py > 5.2) {
        py = 1.0;
        positions[i * 3] = updraftCenterX + (Math.random() - 0.5) * 3.5;
        positions[i * 3 + 2] = (Math.random() - 0.5) * 6.0;
      }

      positions[i * 3 + 1] = py;

      const heightFrac = Math.min(1.0, (py - 1.0) / 4.2);
      if (isSeaBreeze) {
        colors[i * 3] = 1.0 - heightFrac * 0.7;
        colors[i * 3 + 1] = 0.5 + heightFrac * 0.3;
        colors[i * 3 + 2] = 0.2 + heightFrac * 0.8;
      } else {
        colors[i * 3] = 0.9 - heightFrac * 0.6;
        colors[i * 3 + 1] = 0.6 + heightFrac * 0.2;
        colors[i * 3 + 2] = 0.3 + heightFrac * 0.7;
      }
    }
    updraftParticles.geometry.attributes.position.needsUpdate = true;
    updraftParticles.geometry.attributes.color.needsUpdate = true;

    // D. Windsock Orientation & Flutter
    const targetSwivelAngle = isSeaBreeze ? 0 : Math.PI;
    swivel.rotation.y = THREE.MathUtils.lerp(swivel.rotation.y, targetSwivelAngle, 0.08);

    const sockCone = swivel.getObjectByName('SockCone') as THREE.Mesh;
    if (sockCone) {
      const inflation = Math.min(1.1, Math.max(0.4, windSpeed / 4.5));
      const flutter = Math.sin(time * (5.0 + windSpeed * 2.0)) * 0.06 * inflation;
      sockCone.scale.set(inflation, inflation * (1.0 + flutter), inflation);
      sockCone.rotation.y = flutter;
    }
  };

  return {
    root,
    streamlines,
    gustRibbons,
    updraftParticles,
    windsockMesh,
    update,
  };
}
