// Audio Manager using Web Audio API (no external files required)
export class AudioManager {
  private ctx: AudioContext | null = null;
  private masterGain: GainNode | null = null;
  private sfxGain: GainNode | null = null;
  private musicGain: GainNode | null = null;
  private enabled = true;

  init(): void {
    try {
      this.ctx = new AudioContext();
      this.masterGain = this.ctx.createGain();
      this.sfxGain = this.ctx.createGain();
      this.musicGain = this.ctx.createGain();
      this.sfxGain.connect(this.masterGain);
      this.musicGain.connect(this.masterGain);
      this.masterGain.connect(this.ctx.destination);
      this.masterGain.gain.value = 0.7;
      this.sfxGain.gain.value = 1.0;
      this.musicGain.gain.value = 0.4;
    } catch (e) {
      console.warn('AudioContext not available');
    }
  }

  setMasterVolume(v: number): void { if (this.masterGain) this.masterGain.gain.value = v; }
  setSFXVolume(v: number): void { if (this.sfxGain) this.sfxGain.gain.value = v; }
  setMusicVolume(v: number): void { if (this.musicGain) this.musicGain.gain.value = v; }
  setEnabled(e: boolean): void { this.enabled = e; if (this.masterGain) this.masterGain.gain.value = e ? 0.7 : 0; }

  private playTone(freq: number, duration: number, type: OscillatorType = 'square', volume = 0.1): void {
    if (!this.ctx || !this.sfxGain || !this.enabled) return;
    const osc = this.ctx.createOscillator();
    const gain = this.ctx.createGain();
    osc.connect(gain);
    gain.connect(this.sfxGain);
    osc.type = type;
    osc.frequency.value = freq;
    gain.gain.setValueAtTime(volume, this.ctx.currentTime);
    gain.gain.exponentialRampToValueAtTime(0.001, this.ctx.currentTime + duration);
    osc.start(this.ctx.currentTime);
    osc.stop(this.ctx.currentTime + duration);
  }

  private playNoise(duration: number, volume = 0.05, filter = 500): void {
    if (!this.ctx || !this.sfxGain || !this.enabled) return;
    const bufSize = this.ctx.sampleRate * duration;
    const buf = this.ctx.createBuffer(1, bufSize, this.ctx.sampleRate);
    const data = buf.getChannelData(0);
    for (let i = 0; i < bufSize; i++) data[i] = (Math.random() * 2 - 1);
    const source = this.ctx.createBufferSource();
    source.buffer = buf;
    const biquad = this.ctx.createBiquadFilter();
    biquad.type = 'bandpass';
    biquad.frequency.value = filter;
    const gain = this.ctx.createGain();
    gain.gain.setValueAtTime(volume, this.ctx.currentTime);
    gain.gain.exponentialRampToValueAtTime(0.001, this.ctx.currentTime + duration);
    source.connect(biquad);
    biquad.connect(gain);
    gain.connect(this.sfxGain!);
    source.start();
    source.stop(this.ctx.currentTime + duration);
  }

  playBlockBreak(blockId: number): void {
    if (blockId <= 6) this.playNoise(0.15, 0.08, 300); // dirt/stone
    else this.playTone(440, 0.1, 'triangle', 0.05);
  }

  playBlockPlace(): void { this.playNoise(0.1, 0.06, 600); }

  playFootstep(blockId: number): void {
    const v = 0.03;
    if (blockId === 4 /*sand*/) this.playNoise(0.08, v, 200);
    else if (blockId === 3 /*stone*/) this.playNoise(0.07, v, 800);
    else this.playNoise(0.06, v, 400);
  }

  playJump(): void { this.playTone(300, 0.05, 'sine', 0.05); }
  playLand(): void { this.playNoise(0.1, 0.08, 250); }

  playHurt(): void {
    this.playTone(200, 0.3, 'sawtooth', 0.1);
  }

  playDeath(): void {
    for (let i = 0; i < 3; i++) {
      setTimeout(() => this.playTone(150 - i * 30, 0.4, 'sawtooth', 0.15), i * 200);
    }
  }

  playPickup(): void { this.playTone(880, 0.08, 'sine', 0.07); }
  playUIClick(): void { this.playTone(660, 0.05, 'sine', 0.05); }

  playAmbient(): void {
    // Occasional ambient tones
    if (Math.random() < 0.001) {
      this.playTone(110 + Math.random() * 55, 2.0, 'sine', 0.02);
    }
  }

  playDaytime(): void { /* Background music via tone sequences */ }

  suspend(): void { this.ctx?.suspend(); }
  resume(): void { this.ctx?.resume(); }
}
