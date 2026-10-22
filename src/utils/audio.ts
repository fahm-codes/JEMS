// Audio synthesis and Web Speech API utilities

class SoundFX {
  private ctx: AudioContext | null = null;

  private getContext(): AudioContext | null {
    if (typeof window === 'undefined') return null;
    if (!this.ctx) {
      const AudioCtx = window.AudioContext || (window as unknown as { webkitAudioContext: typeof AudioContext }).webkitAudioContext;
      if (AudioCtx) {
        this.ctx = new AudioCtx();
      }
    }
    if (this.ctx && this.ctx.state === 'suspended') {
      this.ctx.resume().catch(() => {});
    }
    return this.ctx;
  }

  playPop() {
    try {
      const ctx = this.getContext();
      if (!ctx) return;
      const osc = ctx.createOscillator();
      const gain = ctx.createGain();
      osc.type = 'sine';
      osc.frequency.setValueAtTime(450, ctx.currentTime);
      osc.frequency.exponentialRampToValueAtTime(800, ctx.currentTime + 0.08);

      gain.gain.setValueAtTime(0.18, ctx.currentTime);
      gain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + 0.08);

      osc.connect(gain);
      gain.connect(ctx.destination);
      osc.start();
      osc.stop(ctx.currentTime + 0.09);
    } catch {
      // AudioContext muted or blocked
    }
  }

  playSuccess() {
    try {
      const ctx = this.getContext();
      if (!ctx) return;
      const notes = [523.25, 659.25, 783.99, 1046.50]; // C5, E5, G5, C6
      notes.forEach((freq, idx) => {
        const osc = ctx.createOscillator();
        const gain = ctx.createGain();
        osc.type = 'triangle';
        osc.frequency.value = freq;

        const startTime = ctx.currentTime + idx * 0.09;
        gain.gain.setValueAtTime(0.2, startTime);
        gain.gain.exponentialRampToValueAtTime(0.001, startTime + 0.3);

        osc.connect(gain);
        gain.connect(ctx.destination);
        osc.start(startTime);
        osc.stop(startTime + 0.35);
      });
    } catch {
      // ignore
    }
  }

  playError() {
    try {
      const ctx = this.getContext();
      if (!ctx) return;
      const osc = ctx.createOscillator();
      const gain = ctx.createGain();
      osc.type = 'sawtooth';
      osc.frequency.setValueAtTime(280, ctx.currentTime);
      osc.frequency.linearRampToValueAtTime(180, ctx.currentTime + 0.25);

      gain.gain.setValueAtTime(0.15, ctx.currentTime);
      gain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + 0.25);

      osc.connect(gain);
      gain.connect(ctx.destination);
      osc.start();
      osc.stop(ctx.currentTime + 0.26);
    } catch {
      // ignore
    }
  }

  playStar() {
    try {
      const ctx = this.getContext();
      if (!ctx) return;
      const freqs = [784, 988, 1175, 1568];
      freqs.forEach((f, i) => {
        const osc = ctx.createOscillator();
        const gain = ctx.createGain();
        osc.type = 'sine';
        osc.frequency.setValueAtTime(f, ctx.currentTime + i * 0.07);

        gain.gain.setValueAtTime(0.15, ctx.currentTime + i * 0.07);
        gain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + i * 0.07 + 0.25);

        osc.connect(gain);
        gain.connect(ctx.destination);
        osc.start(ctx.currentTime + i * 0.07);
        osc.stop(ctx.currentTime + i * 0.07 + 0.3);
      });
    } catch {
      // ignore
    }
  }
}

export const soundFX = new SoundFX();

export interface SpeechOptions {
  pitch?: number;
  rate?: number;
  voiceType?: 'kid' | 'teacher';
  lang?: string;
  onStart?: () => void;
  onEnd?: () => void;
}

export class SpeechEngine {
  private voices: SpeechSynthesisVoice[] = [];
  private isVoicesLoaded = false;

  constructor() {
    if (typeof window !== 'undefined' && 'speechSynthesis' in window) {
      this.loadVoices();
      window.speechSynthesis.onvoiceschanged = () => {
        this.loadVoices();
      };
    }
  }

  private loadVoices() {
    if (typeof window === 'undefined' || !('speechSynthesis' in window)) return;
    this.voices = window.speechSynthesis.getVoices();
    if (this.voices.length > 0) {
      this.isVoicesLoaded = true;
    }
  }

  public getAvailableVoices(): SpeechSynthesisVoice[] {
    if (!this.isVoicesLoaded && typeof window !== 'undefined' && 'speechSynthesis' in window) {
      this.loadVoices();
    }
    return this.voices;
  }

  public stop() {
    if (typeof window !== 'undefined' && 'speechSynthesis' in window) {
      window.speechSynthesis.cancel();
    }
  }

  public speak(text: string, options: SpeechOptions = {}) {
    if (typeof window === 'undefined' || !('speechSynthesis' in window)) {
      options.onEnd?.();
      return;
    }

    window.speechSynthesis.cancel();

    const utterance = new SpeechSynthesisUtterance(text);
    
    // Choose voice according to role
    const voices = this.getAvailableVoices();
    const isKid = options.voiceType === 'kid';

    // Prioritize natural voices
    let selectedVoice: SpeechSynthesisVoice | undefined;

    if (options.lang) {
      selectedVoice = voices.find(v => v.lang.toLowerCase().startsWith(options.lang!.toLowerCase()));
    }

    if (!selectedVoice) {
      if (isKid) {
        // Find youthful / female / high quality voice
        selectedVoice = voices.find(v => 
          (v.name.includes('Kid') || v.name.includes('Child') || v.name.includes('Samantha') || v.name.includes('Google UK English Female') || v.name.includes('Zira') || v.name.includes('Karen') || v.lang.startsWith('en'))
        );
      } else {
        // Teacher voice
        selectedVoice = voices.find(v => 
          (v.name.includes('Google US English') || v.name.includes('Daniel') || v.name.includes('Natural') || v.lang.startsWith('en'))
        );
      }
    }

    if (selectedVoice) {
      utterance.voice = selectedVoice;
    }

    // Kid Voice is tuned higher in pitch & gentle rate
    if (isKid) {
      utterance.pitch = options.pitch ?? 1.35;
      utterance.rate = options.rate ?? 0.92;
    } else {
      utterance.pitch = options.pitch ?? 1.05;
      utterance.rate = options.rate ?? 0.95;
    }

    utterance.onstart = () => {
      options.onStart?.();
    };

    utterance.onend = () => {
      options.onEnd?.();
    };

    utterance.onerror = () => {
      options.onEnd?.();
    };

    window.speechSynthesis.speak(utterance);
  }

  public playDialogue(
    question: string,
    answer: string,
    onQuestionStart?: () => void,
    onAnswerStart?: () => void,
    onFinish?: () => void
  ) {
    this.speak(question, {
      voiceType: 'teacher',
      pitch: 1.05,
      rate: 0.95,
      onStart: onQuestionStart,
      onEnd: () => {
        setTimeout(() => {
          this.speak(answer, {
            voiceType: 'kid',
            pitch: 1.4,
            rate: 0.92,
            onStart: onAnswerStart,
            onEnd: onFinish
          });
        }, 500);
      }
    });
  }
}

export const speechEngine = new SpeechEngine();
