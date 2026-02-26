/** 声音效果管理器 */
export type SoundType = 
  | 'click' 
  | 'input' 
  | 'erase' 
  | 'hint' 
  | 'error' 
  | 'success' 
  | 'complete' 
  | 'gameOver';

interface SoundConfig {
  frequency: number;
  duration: number;
  type: OscillatorType;
  volume: number;
}

const soundConfigs: Record<SoundType, SoundConfig> = {
  click: { frequency: 800, duration: 50, type: 'sine', volume: 0.1 },
  input: { frequency: 600, duration: 80, type: 'sine', volume: 0.15 },
  erase: { frequency: 400, duration: 100, type: 'triangle', volume: 0.1 },
  hint: { frequency: 1000, duration: 150, type: 'sine', volume: 0.2 },
  error: { frequency: 200, duration: 200, type: 'sawtooth', volume: 0.15 },
  success: { frequency: 880, duration: 200, type: 'sine', volume: 0.2 },
  complete: { frequency: 523, duration: 400, type: 'sine', volume: 0.25 },
  gameOver: { frequency: 150, duration: 500, type: 'sawtooth', volume: 0.2 },
};

class SoundManager {
  private enabled: boolean = true;
  private audioContext: AudioContext | null = null;

  constructor() {
    this.loadSettings();
  }

  private loadSettings(): void {
    if (typeof window === 'undefined') return;
    const stored = localStorage.getItem('sudoku-sound-enabled');
    this.enabled = stored !== 'false';
  }

  public saveSettings(): void {
    if (typeof window === 'undefined') return;
    localStorage.setItem('sudoku-sound-enabled', String(this.enabled));
  }

  public isEnabled(): boolean {
    return this.enabled;
  }

  public setEnabled(enabled: boolean): void {
    this.enabled = enabled;
    this.saveSettings();
  }

  public toggle(): boolean {
    this.enabled = !this.enabled;
    this.saveSettings();
    return this.enabled;
  }

  private initAudioContext(): AudioContext | null {
    if (typeof window === 'undefined') return null;
    if (!this.audioContext) {
      try {
        this.audioContext = new (window.AudioContext || (window as unknown as { webkitAudioContext: typeof AudioContext }).webkitAudioContext)();
      } catch {
        return null;
      }
    }
    return this.audioContext;
  }

  public play(type: SoundType): void {
    if (!this.enabled) return;
    
    const ctx = this.initAudioContext();
    if (!ctx) return;

    // 恢复 AudioContext（可能被浏览器暂停）
    if (ctx.state === 'suspended') {
      ctx.resume().catch(() => {});
    }

    const config = soundConfigs[type];
    const oscillator = ctx.createOscillator();
    const gainNode = ctx.createGain();

    oscillator.type = config.type;
    oscillator.frequency.setValueAtTime(config.frequency, ctx.currentTime);
    
    gainNode.gain.setValueAtTime(config.volume, ctx.currentTime);
    gainNode.gain.exponentialRampToValueAtTime(0.01, ctx.currentTime + config.duration / 1000);

    oscillator.connect(gainNode);
    gainNode.connect(ctx.destination);

    oscillator.start(ctx.currentTime);
    oscillator.stop(ctx.currentTime + config.duration / 1000);
  }
}

export const soundManager = new SoundManager();
