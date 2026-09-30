export type AppMode = 'observe' | 'explore' | 'understand' | 'quiz';

export type WindType = 'sea_breeze' | 'land_breeze' | 'calm_transition';

export interface MeteorologicalState {
  timeHours: number; // 0.0 to 24.0
  timeString: string; // e.g. "13:30"
  timeCategory: 'Malam' | 'Pagi' | 'Siang' | 'Sore';
  isDaytime: boolean;
  sunElevationDeg: number;
  sunIntensity: number; // 0 to 1
  
  // Temperatures
  landTempC: number;
  seaTempC: number;
  tempDifference: number; // land - sea
  
  // Pressures (in hPa / conceptual)
  landPressureHpa: number;
  seaPressureHpa: number;
  pressureGradient: number; // sea - land (positive means Sea -> Land)
  
  // Wind characteristics
  windType: WindType;
  windNameId: 'Angin Laut' | 'Angin Darat' | 'Tenang (Transisi)';
  surfaceWindSpeedMs: number; // 0 to 8 m/s
  windDirectionLabel: 'Laut → Darat' | 'Darat → Laut' | 'Tenang / Transisi';
  
  // Educational Cause-and-Effect Chain
  causalityStep: {
    heating: string;
    temperature: string;
    density: string;
    pressure: string;
    airMovement: string;
    windResult: string;
  };
  
  // Fisherman activity context (Grade 10 geography application)
  fishermanContext: string;
}

export interface LayerVisibility {
  showTemperatureColors: boolean;
  showPressureIndicators: boolean;
  showConvectionParticles: boolean;
  showWindArrows: boolean;
  showUpperAtmosphereReturn: boolean;
  showFishermanBoats: boolean;
  showClouds: boolean;
}

export interface GeoQuizQuestion {
  id: number;
  question: string;
  options: string[];
  correctIndex: number;
  explanation: string;
  pedagogicalCore: string;
}
