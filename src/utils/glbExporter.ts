import * as THREE from 'three';
import { GLTFExporter } from 'three/examples/jsm/exporters/GLTFExporter.js';

export interface GlbExportTarget {
  id: string;
  filename: string;
  name: string;
  description: string;
  category: 'Terrain' | 'Atmosphere' | 'Dynamics' | 'Environment';
}

export const GLB_TARGETS: GlbExportTarget[] = [
  {
    id: 'land',
    filename: 'land.glb',
    name: '01. Land (Daratan Pesisir)',
    description: 'Model daratan pantai dengan kontur perbukitan, lereng pantai berpasir, dan material responsif suhu.',
    category: 'Terrain',
  },
  {
    id: 'sea',
    filename: 'sea.glb',
    name: '02. Sea (Permukaan Laut)',
    description: 'Permukaan air laut bergelombang halus dengan kedalaman optik dan material termal.',
    category: 'Terrain',
  },
  {
    id: 'sun',
    filename: 'sun.glb',
    name: '03. Sun (Matahari & Efek Radiasi)',
    description: 'Model sumber energi panas geosentris dengan bola pijar, korona radiasi, dan pencahayaan.',
    category: 'Atmosphere',
  },
  {
    id: 'cloud',
    filename: 'cloud.glb',
    name: '04. Cloud (Awan Konveksi Kumulus)',
    description: 'Gugusan awan atmosferik yang terbentuk akibat kondensasi udara hangat membubung.',
    category: 'Atmosphere',
  },
  {
    id: 'atmosphere',
    filename: 'atmosphere.glb',
    name: '05. Atmosphere (Lapisan Atmosfer Batas)',
    description: 'Volume udara batas transparan yang melingkupi sel sirkulasi konveksi troposfer bawah.',
    category: 'Atmosphere',
  },
  {
    id: 'air_particle',
    filename: 'air_particle.glb',
    name: '06. Air Particles (Partikel Sirkulasi Udara)',
    description: 'Representasi partikel udara konvektif: gerak vertikal naik/turun dan horizontal permukaan/atas.',
    category: 'Dynamics',
  },
  {
    id: 'wind_arrow',
    filename: 'wind_arrow.glb',
    name: '07. Wind Arrow (Panah Vektor Angin)',
    description: 'Panah 3D aerodinamis yang menunjukkan arah tiupan angin permukaan (Sea → Land atau Land → Sea).',
    category: 'Dynamics',
  },
  {
    id: 'pressure_visualization',
    filename: 'pressure_visualization.glb',
    name: '08. Pressure Visualization (Indikator H & L)',
    description: 'Simbol 3D Tekanan Tinggi (H / High) dan Tekanan Rendah (L / Low) beserta isobar atmosfer.',
    category: 'Dynamics',
  },
  {
    id: 'temperature_visualization',
    filename: 'temperature_visualization.glb',
    name: '09. Temperature Visualization (Termometer & Shimmer)',
    description: 'Gradien warna termal permukaan dan menara termometer vertikal dinamis.',
    category: 'Dynamics',
  },
  {
    id: 'coastal_environment',
    filename: 'coastal_environment.glb',
    name: '10. Coastal Environment (Lingkungan Lengkap Pesisir)',
    description: 'Gabungan daratan, laut, mercusuar, pohon kelapa pantai, dan perahu nelayan tradisional.',
    category: 'Environment',
  },
];

/**
 * Exports a Three.js Object3D as a standard binary .GLB file and initiates browser download.
 */
export function exportObjectToGlb(object: THREE.Object3D, filename: string): Promise<boolean> {
  return new Promise((resolve, reject) => {
    const exporter = new GLTFExporter();

    exporter.parse(
      object,
      (gltf) => {
        try {
          let blob: Blob;
          if (gltf instanceof ArrayBuffer) {
            blob = new Blob([gltf], { type: 'model/gltf-binary' });
          } else {
            const output = JSON.stringify(gltf, null, 2);
            blob = new Blob([output], { type: 'application/json' });
          }

          const link = document.createElement('a');
          link.href = URL.createObjectURL(blob);
          link.download = filename;
          document.body.appendChild(link);
          link.click();
          document.body.removeChild(link);
          URL.revokeObjectURL(link.href);
          resolve(true);
        } catch (err) {
          reject(err);
        }
      },
      (error) => {
        console.error('Error exporting GLB:', error);
        reject(error);
      },
      { binary: true }
    );
  });
}
