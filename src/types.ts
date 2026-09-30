export type SimulationModel = 'cell' | 'dna' | 'atom';

export type CellType = 'animal' | 'plant';

export type RenderMode = 'pbr' | 'fluorescence' | 'cryo_tem' | 'xray';

export interface OrganelleInfo {
  id: string;
  name: string;
  scientificName: string;
  category: 'Genetic' | 'Energy' | 'Synthesis & Transport' | 'Structural' | 'Metabolic';
  gradeXSummary: string;
  analogy: string;
  primaryFunction: string;
  biochemicalProcess?: string;
  formula?: string;
  dimensions: string;
  grade10KeyFact: string;
  color: string;
  fluorescenceColor: string;
  position: [number, number, number];
  cameraTarget: [number, number, number];
  cameraDistance: number;
  plantOnly?: boolean;
  animalOnly?: boolean;
}

export interface DNABasePairInfo {
  id: string;
  name: string;
  pair: string;
  bonds: number;
  description: string;
  grade10Fact: string;
  color: string;
}

export interface ElementAtomInfo {
  atomicNumber: number;
  symbol: string;
  name: string;
  protons: number;
  neutrons: number;
  electrons: number;
  electronConfiguration: number[]; // e.g. [2, 8, 1]
  period: number;
  group: number;
  category: string;
  valenceElectrons: number;
  grade10Fact: string;
}

export interface QuizQuestion {
  id: number;
  question: string;
  options: string[];
  correctIndex: number;
  explanation: string;
  targetId: string; // target organelle to focus camera on
  curriculumStandard: string;
}

export interface ViewportSettings {
  explodedView: number; // 0 to 1
  cutawayAngle: number; // 0 to 120 degrees
  autoRotate: boolean;
  showLabels: boolean;
  renderMode: RenderMode;
  cellType: CellType;
  particlesActive: boolean;
  lightIntensity: number;
}
