import { MeteorologicalState, WindType } from '../types/geography';

/**
 * Computes physically sound, pedagogically clear meteorological values
 * for a 24-hour diurnal cycle over coastal land and sea.
 */
export function calculateMeteorologicalState(timeHours: number): MeteorologicalState {
  // Normalize time 0.0 - 24.0
  const t = ((timeHours % 24) + 24) % 24;
  
  // Format HH:MM
  const hrs = Math.floor(t);
  const mins = Math.floor((t - hrs) * 60);
  const timeString = `${String(hrs).padStart(2, '0')}:${String(mins).padStart(2, '0')}`;
  
  // Time category
  let timeCategory: 'Malam' | 'Pagi' | 'Siang' | 'Sore' = 'Malam';
  if (t >= 5 && t < 10) timeCategory = 'Pagi';
  else if (t >= 10 && t < 15) timeCategory = 'Siang';
  else if (t >= 15 && t < 18.5) timeCategory = 'Sore';
  else timeCategory = 'Malam';
  
  // Solar calculation (Sunrise at 06:00, Sunset at 18:00)
  const isDaytime = t >= 6.0 && t <= 18.0;
  let sunElevationDeg = 0;
  let sunIntensity = 0;
  
  if (isDaytime) {
    const dayProgress = (t - 6.0) / 12.0; // 0 at 06:00, 1 at 18:00
    sunElevationDeg = Math.sin(dayProgress * Math.PI) * 75; // Peak 75 deg at noon
    sunIntensity = Math.sin(dayProgress * Math.PI);
  } else {
    sunElevationDeg = -20;
    sunIntensity = 0;
  }
  
  // Specific Heat & Thermal lag:
  // Land has low specific heat capacity (c ~ 800 J/kg C) -> Fast heating & cooling
  // Peak solar is at 12:00, land peak temperature lags by ~1.5 hours to 13:30.
  const landPhase = ((t - 13.5) / 24) * 2 * Math.PI;
  // Land temp swings from ~21.5°C to ~34.5°C (mean 28°C, amplitude 6.5°C)
  const landTempC = Math.round((28.0 + 6.5 * Math.cos(landPhase)) * 10) / 10;
  
  // Sea has high specific heat capacity (c ~ 4184 J/kg C) -> Slow heating & cooling
  // Sea temp swings only slightly, from ~26.2°C to ~27.8°C (mean 27.0°C, amplitude 0.8°C)
  // Sea temperature peak lags further, around 15:30.
  const seaPhase = ((t - 15.5) / 24) * 2 * Math.PI;
  const seaTempC = Math.round((27.0 + 0.8 * Math.cos(seaPhase)) * 10) / 10;
  
  const tempDifference = Math.round((landTempC - seaTempC) * 10) / 10;
  
  // Atmospheric Pressure calculation (hPa):
  // Baseline sea-level standard: 1013.25 hPa
  // Warm air expands -> lower density -> thermal low pressure
  // Cold air contracts -> higher density -> thermal high pressure
  // deltaP is directly proportional to temperature difference
  const pressureFactor = 1.2; // hPa per deg C of thermal differential
  const landPressureHpa = Math.round((1013.25 - (landTempC - 28.0) * pressureFactor) * 10) / 10;
  const seaPressureHpa = Math.round((1013.25 - (seaTempC - 27.0) * pressureFactor) * 10) / 10;
  const pressureGradient = Math.round((seaPressureHpa - landPressureHpa) * 10) / 10;
  
  // Wind determination
  let windType: WindType = 'calm_transition';
  let windNameId: 'Angin Laut' | 'Angin Darat' | 'Tenang (Transisi)' = 'Tenang (Transisi)';
  let windDirectionLabel: 'Laut → Darat' | 'Darat → Laut' | 'Tenang / Transisi' = 'Tenang / Transisi';
  let surfaceWindSpeedMs = 0;
  
  // Threshold for calm transitional balance: |tempDiff| < 0.8°C
  if (tempDifference > 0.8) {
    windType = 'sea_breeze';
    windNameId = 'Angin Laut';
    windDirectionLabel = 'Laut → Darat';
    surfaceWindSpeedMs = Math.round(Math.min(7.5, Math.abs(tempDifference) * 1.1) * 10) / 10;
  } else if (tempDifference < -0.8) {
    windType = 'land_breeze';
    windNameId = 'Angin Darat';
    windDirectionLabel = 'Darat → Laut';
    surfaceWindSpeedMs = Math.round(Math.min(5.5, Math.abs(tempDifference) * 0.9) * 10) / 10;
  } else {
    windType = 'calm_transition';
    windNameId = 'Tenang (Transisi)';
    windDirectionLabel = 'Tenang / Transisi';
    surfaceWindSpeedMs = 0.5;
  }
  
  // Pedagogical step description
  let causalityStep = {
    heating: '',
    temperature: '',
    density: '',
    pressure: '',
    airMovement: '',
    windResult: '',
  };
  
  let fishermanContext = '';
  
  if (windType === 'sea_breeze') {
    causalityStep = {
      heating: 'Matahari menyinari daratan dan lautan. Kapasitas kalor daratan lebih rendah sehingga menyerap panas jauh lebih cepat.',
      temperature: `Suhu daratan (${landTempC}°C) meningkat pesat melampaui suhu lautan (${seaTempC}°C).`,
      density: 'Udara di atas daratan memuai, massa jenisnya berkurang (menjadi lebih ringan), lalu membubung naik (konveksi vertikal).',
      pressure: `Tekanan udara di atas daratan menjadi RELATIF RENDAH (${landPressureHpa} hPa), sedangkan di atas laut RELATIF TINGGI (${seaPressureHpa} hPa).`,
      airMovement: 'Udara dingin dan padat dari atas lautan bergerak menyapu permukaan menuju daratan untuk mengisi kekosongan udara yang naik.',
      windResult: 'Terbentuklah ANGIN LAUT yang bertiup kencang dari arah LAUT menuju DARAT.',
    };
    fishermanContext = 'Nelayan tradisional memanfaatkan tiupan Angin Laut di siang hari untuk berlayar pulang merapat ke tepi pantai membawa hasil tangkapan ikan.';
  } else if (windType === 'land_breeze') {
    causalityStep = {
      heating: 'Malam hari tanpa radiasi matahari. Daratan yang memiliki kapasitas kalor rendah melepaskan radiasi panas bumi jauh lebih cepat.',
      temperature: `Daratan mendingin cepat (${landTempC}°C), sementara air laut yang memiliki kapasitas kalor tinggi tetap relatif hangat (${seaTempC}°C).`,
      density: 'Udara di atas lautan yang relatif hangat memuai dan naik ke atmosfer.',
      pressure: `Tekanan udara di atas laut menjadi RELATIF RENDAH (${seaPressureHpa} hPa), sementara di atas daratan menjadi RELATIF TINGGI (${landPressureHpa} hPa).`,
      airMovement: 'Udara yang lebih dingin dan bertekanan tinggi dari daratan mengalir ke arah laut untuk menggantikan udara hangat laut yang naik.',
      windResult: 'Terbentuklah ANGIN DARAT yang bertiup dari arah DARAT menuju LAUT.',
    };
    fishermanContext = 'Nelayan tradisional berangkat melaut di malam hari memanfaatkan dorongan tiupan Angin Darat untuk mengarahkan perahu ke tengah samudra.';
  } else {
    causalityStep = {
      heating: 'Periode pergantian (pagi/senja). Radiasi matahari mulai seimbang dengan pelepasan panas.',
      temperature: `Suhu daratan (${landTempC}°C) dan lautan (${seaTempC}°C) berada dalam titik keseimbangan termal (isothermal).`,
      density: 'Kerapatan udara di atas darat dan laut hampir sama.',
      pressure: 'Gradien tekanan mendatar mendekati nol; tidak terdapat perbedaan tekanan yang signifikan.',
      airMovement: 'Sirkulasi konveksi melambat hingga berhenti sementara.',
      windResult: 'Kondisi ANGIN TENANG / TRANSISI (Calm period). Nelayan bersiap-siap mengubah aktivitas.',
    };
    fishermanContext = 'Momen transisi di mana angin bertiup sangat lemah, sering dijadikan waktu istirahat dan penataan jaring ikan oleh nelayan.';
  }
  
  return {
    timeHours: t,
    timeString,
    timeCategory,
    isDaytime,
    sunElevationDeg,
    sunIntensity,
    landTempC,
    seaTempC,
    tempDifference,
    landPressureHpa,
    seaPressureHpa,
    pressureGradient,
    windType,
    windNameId,
    surfaceWindSpeedMs,
    windDirectionLabel,
    causalityStep,
    fishermanContext,
  };
}
