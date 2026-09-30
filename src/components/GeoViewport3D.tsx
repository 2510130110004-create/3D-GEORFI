import React, { useEffect, useRef } from 'react';
import * as THREE from 'three';
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls.js';
import { MeteorologicalState, LayerVisibility } from '../types/geography';
import { createCoastalEnvironment, CoastalMeshes } from './scene/coastalEnvironment';
import { createAtmosphereAndWind, AtmosphereMeshes } from './scene/atmosphereAndWind';
import { createWindStreamlinesSystem, WindStreamlinesSystem } from './scene/windStreamlines';
import { exportObjectToGlb } from '../utils/glbExporter';
import { CameraPresetType } from './CameraPresetBar';
import { coastalAudio } from '../utils/audioAmbience';
import { FocusObjectId, OBJECTS_3D_LIST } from './ObjectInspectorBar';

interface GeoViewport3DProps {
  meteoState: MeteorologicalState;
  layers: LayerVisibility;
  cameraPreset: CameraPresetType;
  targetObjectId?: FocusObjectId;
  onSceneReady?: (exportFn: (targetId: string, filename: string) => Promise<boolean>) => void;
}

export const GeoViewport3D: React.FC<GeoViewport3DProps> = ({
  meteoState,
  layers,
  cameraPreset,
  targetObjectId,
  onSceneReady,
}) => {
  const mountRef = useRef<HTMLDivElement>(null);
  const sceneRef = useRef<THREE.Scene | null>(null);
  const rendererRef = useRef<THREE.WebGLRenderer | null>(null);
  const cameraRef = useRef<THREE.PerspectiveCamera | null>(null);
  const controlsRef = useRef<OrbitControls | null>(null);
  const animFrameRef = useRef<number | null>(null);

  const coastalMeshesRef = useRef<CoastalMeshes | null>(null);
  const atmosphereMeshesRef = useRef<AtmosphereMeshes | null>(null);
  const windSystemRef = useRef<WindStreamlinesSystem | null>(null);
  const meteoStateRef = useRef<MeteorologicalState>(meteoState);
  meteoStateRef.current = meteoState;

  // Camera animation interpolation targets
  const targetCamPos = useRef<THREE.Vector3 | null>(null);
  const targetLookAt = useRef<THREE.Vector3 | null>(null);

  // Initialize Scene
  useEffect(() => {
    const container = mountRef.current;
    if (!container) return;

    const width = container.clientWidth;
    const height = container.clientHeight;

    const scene = new THREE.Scene();
    sceneRef.current = scene;

    scene.fog = new THREE.FogExp2(0x020617, 0.015);

    const camera = new THREE.PerspectiveCamera(45, width / height, 0.1, 200);
    camera.position.set(0, 10, 24);
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
    renderer.shadowMap.enabled = true;
    renderer.shadowMap.type = THREE.PCFSoftShadowMap;
    container.appendChild(renderer.domElement);
    rendererRef.current = renderer;

    const controls = new OrbitControls(camera, renderer.domElement);
    controls.enableDamping = true;
    controls.dampingFactor = 0.05;
    controls.maxDistance = 45;
    controls.minDistance = 4.0;
    controls.maxPolarAngle = Math.PI * 0.48; // Prevent underground clipping
    controls.target.set(0, 2.5, 0);
    controlsRef.current = controls;

    const ambientLight = new THREE.AmbientLight(0xffffff, 0.65);
    scene.add(ambientLight);

    // 1. Build Coastal Geography
    const coastal = createCoastalEnvironment();
    scene.add(coastal.coastalEnvironment);
    coastalMeshesRef.current = coastal;

    // 2. Build Atmosphere & Classical Indicators
    const atmosphere = createAtmosphereAndWind();
    scene.add(atmosphere.atmosphereGroup);
    atmosphereMeshesRef.current = atmosphere;

    // 3. Build Organic Real Wind System (Streamlines, Ribbons, Updraft Plumes, Windsock)
    const windSystem = createWindStreamlinesSystem();
    scene.add(windSystem.root);
    windSystemRef.current = windSystem;

    // Export Handler
    if (onSceneReady) {
      onSceneReady(async (targetId: string, filename: string) => {
        let targetObj: THREE.Object3D | null = null;
        if (targetId === 'land') targetObj = coastal.landMesh.parent || coastal.landMesh;
        else if (targetId === 'sea') targetObj = coastal.seaMesh.parent || coastal.seaMesh;
        else if (targetId === 'sun') targetObj = atmosphere.sunGroup;
        else if (targetId === 'cloud') targetObj = atmosphere.cloudsGroup;
        else if (targetId === 'atmosphere') targetObj = atmosphere.atmosphereGroup;
        else if (targetId === 'air_particle') targetObj = atmosphere.airParticles;
        else if (targetId === 'wind_arrow') targetObj = windSystem.root;
        else if (targetId === 'pressure_visualization') targetObj = atmosphere.pressureGroup;
        else if (targetId === 'temperature_visualization') targetObj = coastal.landMesh;
        else if (targetId === 'coastal_environment') targetObj = coastal.coastalEnvironment;
        else targetObj = scene;

        if (targetObj) {
          return await exportObjectToGlb(targetObj, filename);
        }
        return false;
      });
    }

    // Resize Handler
    const handleResize = () => {
      if (!container || !renderer || !camera) return;
      camera.aspect = container.clientWidth / container.clientHeight;
      camera.updateProjectionMatrix();
      renderer.setSize(container.clientWidth, container.clientHeight);
    };
    window.addEventListener('resize', handleResize);

    // Animation Loop
    let clock = new THREE.Clock();
    const animate = () => {
      animFrameRef.current = requestAnimationFrame(animate);
      const delta = clock.getDelta();
      const time = clock.getElapsedTime();
      const state = meteoStateRef.current;
      const isSeaBreeze = state.windType === 'sea_breeze';

      // Camera smooth interpolation
      if (targetCamPos.current && camera) {
        camera.position.lerp(targetCamPos.current, 0.05);
        if (camera.position.distanceTo(targetCamPos.current) < 0.05) {
          targetCamPos.current = null;
        }
      }
      if (targetLookAt.current && controls) {
        controls.target.lerp(targetLookAt.current, 0.05);
        if (controls.target.distanceTo(targetLookAt.current) < 0.05) {
          targetLookAt.current = null;
        }
      }

      // 1. Celestial Orbit (Sun & Moon position)
      const t = state.timeHours;
      const sunAngle = ((t - 6.0) / 12.0) * Math.PI;
      const sunDistance = 26.0;
      const sunX = Math.cos(sunAngle) * sunDistance;
      const sunY = Math.sin(sunAngle) * sunDistance;
      atmosphere.sunGroup.position.set(sunX, sunY, -14);
      atmosphere.sunLight.target.position.set(0, 0, 0);

      atmosphere.moonGroup.position.set(-sunX, -sunY, -14);
      atmosphere.moonLight.target.position.set(0, 0, 0);

      // Sky Background & Lighting Modulation
      if (state.isDaytime) {
        const dayFade = Math.sin(((t - 6.0) / 12.0) * Math.PI);
        const skyColor = new THREE.Color(0x0f172a).lerp(new THREE.Color(0x38bdf8), dayFade * 0.85);
        scene.background = skyColor;
        if (scene.fog) scene.fog.color = skyColor;

        atmosphere.sunLight.intensity = Math.max(0.3, dayFade * 2.8);
        atmosphere.moonLight.intensity = 0;
        ambientLight.intensity = 0.55 + dayFade * 0.55;

        coastal.lighthouseBeam.intensity = 0;
      } else {
        scene.background = new THREE.Color(0x020617);
        if (scene.fog) scene.fog.color = new THREE.Color(0x020617);

        atmosphere.sunLight.intensity = 0;
        atmosphere.moonLight.intensity = 0.6;
        ambientLight.intensity = 0.35;

        // Rotating lighthouse beam
        coastal.lighthouseBeam.intensity = 3.0;
        coastal.lighthouseBeam.target.position.x = Math.sin(time * 1.5) * 20;
        coastal.lighthouseBeam.target.position.z = Math.cos(time * 1.5) * 20;
      }

      // 2. Thermal Surface Shimmer & Colors
      if (coastal.landMaterial) {
        if (state.landTempC > 30.0) {
          coastal.landMaterial.color.setHex(0x65a30d);
          coastal.landMaterial.emissive.setHex(0xd97706);
          coastal.landMaterial.emissiveIntensity = (state.landTempC - 30.0) * 0.08;
        } else if (state.landTempC < 24.0) {
          coastal.landMaterial.color.setHex(0x334155);
          coastal.landMaterial.emissive.setHex(0x0284c7);
          coastal.landMaterial.emissiveIntensity = (24.0 - state.landTempC) * 0.06;
        } else {
          coastal.landMaterial.color.setHex(0x4d7c0f);
          coastal.landMaterial.emissiveIntensity = 0;
        }
      }

      // 3. Update Realistic Wind Streamlines, Gusts, Updraft, and Windsock!
      windSystem.update(delta, time, state);

      // 4. Update Wind Reaction on Palm Trees, Perahu Sails, and Beach Foam!
      coastal.updateWindReaction(delta, time, state.surfaceWindSpeedMs, isSeaBreeze);

      // 5. Natural Audio Ambiance Update
      coastalAudio.update(state.surfaceWindSpeedMs);

      // 6. Floating Atmospheric Pressure Badges (H and L)
      // When Sea Breeze (Day): Land is Low (L), Sea is High (H)
      // When Land Breeze (Night): Land is High (H), Sea is Low (L)
      atmosphere.landPressureSign.position.y = 5.8 + Math.sin(time * 1.5) * 0.12;
      atmosphere.seaPressureSign.position.y = 5.8 + Math.sin(time * 1.5 + 1.0) * 0.12;

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

  // Handle Camera Presets & Specific Object Focus
  useEffect(() => {
    if (!cameraRef.current || !controlsRef.current) return;

    if (targetObjectId) {
      const objInfo = OBJECTS_3D_LIST.find((o) => o.id === targetObjectId);
      if (objInfo) {
        targetCamPos.current = new THREE.Vector3(...objInfo.camPos);
        targetLookAt.current = new THREE.Vector3(...objInfo.lookAt);
        return;
      }
    }

    if (cameraPreset === 'side_circulation') {
      // Direct cross-section looking along Z axis at the entire convective loop
      targetCamPos.current = new THREE.Vector3(0, 4.5, 23.0);
      targetLookAt.current = new THREE.Vector3(0, 3.2, 0);
    } else if (cameraPreset === 'beach_perspective') {
      // Beach perspective standing on shore looking towards boats and windsock
      targetCamPos.current = new THREE.Vector3(-1.8, 2.2, 6.5);
      targetLookAt.current = new THREE.Vector3(3.0, 1.2, -1.0);
    } else if (cameraPreset === 'top_map') {
      // Satellite map overhead
      targetCamPos.current = new THREE.Vector3(0, 27.0, 3.0);
      targetLookAt.current = new THREE.Vector3(0, 0, 0);
    } else {
      // Default overview
      targetCamPos.current = new THREE.Vector3(0, 10.0, 24.0);
      targetLookAt.current = new THREE.Vector3(0, 2.5, 0);
    }
  }, [cameraPreset, targetObjectId]);

  // Sync Layer Visibility
  useEffect(() => {
    const atmo = atmosphereMeshesRef.current;
    const coastal = coastalMeshesRef.current;
    const wind = windSystemRef.current;
    if (!atmo || !coastal || !wind) return;

    atmo.pressureGroup.visible = layers.showPressureIndicators;
    atmo.airParticles.visible = layers.showConvectionParticles;
    atmo.cloudsGroup.visible = layers.showClouds;
    coastal.boatsGroup.visible = layers.showFishermanBoats;
    wind.root.visible = layers.showConvectionParticles;
  }, [layers, meteoState.windType]);

  return (
    <div
      ref={mountRef}
      className="relative w-full h-full cursor-grab active:cursor-grabbing select-none overflow-hidden"
    />
  );
};
