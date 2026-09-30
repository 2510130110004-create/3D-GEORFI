/**
 * Procedural Web Audio API sound generator for natural coastal ambiance:
 * - Filtered pink noise for rushing wind gusts (volume scales with windSpeed)
 * - Rhythmic low-pass filtered noise for ocean wave surf
 * 100% offline, zero external file dependencies.
 */
class CoastalAudioEngine {
  private ctx: AudioContext | null = null;
  private windGain: GainNode | null = null;
  private waveGain: GainNode | null = null;
  private windFilter: BiquadFilterNode | null = null;
  private isMuted: boolean = true;

  public init() {
    if (this.ctx) return;
    try {
      const AudioCtx = window.AudioContext || (window as any).webkitAudioContext;
      this.ctx = new AudioCtx();

      // Create Wind Noise Buffer (Pink Noise)
      const bufferSize = this.ctx.sampleRate * 2;
      const noiseBuffer = this.ctx.createBuffer(1, bufferSize, this.ctx.sampleRate);
      const output = noiseBuffer.getChannelData(0);
      let b0 = 0, b1 = 0, b2 = 0, b3 = 0, b4 = 0, b5 = 0, b6 = 0;
      for (let i = 0; i < bufferSize; i++) {
        const white = Math.random() * 2 - 1;
        b0 = 0.99886 * b0 + white * 0.0555179;
        b1 = 0.99332 * b1 + white * 0.0750759;
        b2 = 0.96900 * b2 + white * 0.1538520;
        b3 = 0.86650 * b3 + white * 0.3104856;
        b4 = 0.55000 * b4 + white * 0.5329522;
        b5 = -0.7616 * b5 - white * 0.0168980;
        output[i] = (b0 + b1 + b2 + b3 + b4 + b5 + b6 + white * 0.5362) * 0.08;
        b6 = white * 0.115926;
      }

      // Wind Audio Chain
      const windSource = this.ctx.createBufferSource();
      windSource.buffer = noiseBuffer;
      windSource.loop = true;

      this.windFilter = this.ctx.createBiquadFilter();
      this.windFilter.type = 'bandpass';
      this.windFilter.frequency.value = 450;
      this.windFilter.Q.value = 1.2;

      this.windGain = this.ctx.createGain();
      this.windGain.gain.value = 0;

      windSource.connect(this.windFilter);
      this.windFilter.connect(this.windGain);
      this.windGain.connect(this.ctx.destination);
      windSource.start();

      // Ocean Wave Audio Chain
      const waveSource = this.ctx.createBufferSource();
      waveSource.buffer = noiseBuffer;
      waveSource.loop = true;

      const waveFilter = this.ctx.createBiquadFilter();
      waveFilter.type = 'lowpass';
      waveFilter.frequency.value = 280;

      this.waveGain = this.ctx.createGain();
      this.waveGain.gain.value = 0;

      waveSource.connect(waveFilter);
      waveFilter.connect(this.waveGain);
      this.waveGain.connect(this.ctx.destination);
      waveSource.start();
    } catch (e) {
      console.warn('Web Audio not supported:', e);
    }
  }

  public toggleMute(): boolean {
    this.init();
    if (this.ctx && this.ctx.state === 'suspended') {
      this.ctx.resume();
    }
    this.isMuted = !this.isMuted;
    if (this.isMuted) {
      if (this.windGain) this.windGain.gain.setTargetAtTime(0, this.ctx!.currentTime, 0.1);
      if (this.waveGain) this.waveGain.gain.setTargetAtTime(0, this.ctx!.currentTime, 0.1);
    }
    return !this.isMuted;
  }

  public update(windSpeedMs: number) {
    if (this.isMuted || !this.ctx || !this.windGain || !this.waveGain || !this.windFilter) return;

    const now = this.ctx.currentTime;
    // Volume scales softly with wind speed (up to 0.15 master volume)
    const targetWindVol = Math.min(0.18, 0.03 + (windSpeedMs / 7.0) * 0.12);
    this.windGain.gain.setTargetAtTime(targetWindVol, now, 0.2);

    // Filter frequency rises as wind blows faster (higher whistling tone)
    const targetFreq = 300 + (windSpeedMs / 7.0) * 400;
    this.windFilter.frequency.setTargetAtTime(targetFreq, now, 0.2);

    // Ocean wave rhythmic swell
    const waveVol = 0.06 + Math.sin(now * 1.5) * 0.03;
    this.waveGain.gain.setTargetAtTime(waveVol, now, 0.15);
  }

  public getIsPlaying(): boolean {
    return !this.isMuted;
  }
}

export const coastalAudio = new CoastalAudioEngine();
