/**
 * BG678 Authentic WinGo Sound FX Engine (Pure JavaScript)
 */

class SoundFX {
  constructor() {
    this.ctx = null;
    this.enabled = true;

    // Initialize Web Audio on first user interaction
    if (typeof window !== 'undefined') {
      const unlockAudio = () => {
        this.initCtx();
        window.removeEventListener('click', unlockAudio);
        window.removeEventListener('touchstart', unlockAudio);
        window.removeEventListener('keydown', unlockAudio);
      };

      window.addEventListener('click', unlockAudio, { passive: true });
      window.addEventListener('touchstart', unlockAudio, { passive: true });
      window.addEventListener('keydown', unlockAudio, { passive: true });
    }
  }

  initCtx() {
    if (!this.ctx && typeof window !== 'undefined') {
      const AudioCtx = window.AudioContext || window.webkitAudioContext;
      if (AudioCtx) {
        this.ctx = new AudioCtx();
      }
    }
    if (this.ctx && this.ctx.state === 'suspended') {
      this.ctx.resume().catch(() => {});
    }
    return this.ctx;
  }

  setEnabled(val) {
    this.enabled = Boolean(val);
  }

  isEnabled() {
    return this.enabled;
  }

  playClick() {}
  playBetPlace() {}
  playRoll() {}

  /**
   * BG678 WinGo Countdown Audio (5s, 4s, 3s, 2s, 1s, 0s)
   */
  playCountdown(secondsLeft) {
    if (!this.enabled) return;
    const ctx = this.initCtx();
    if (!ctx) return;

    try {
      const now = ctx.currentTime;

      if (secondsLeft === 0) {
        // "0" -> Bet Closed official round lock buzzer
        const osc = ctx.createOscillator();
        const gain = ctx.createGain();

        osc.type = 'sawtooth';
        osc.frequency.setValueAtTime(800, now);
        osc.frequency.exponentialRampToValueAtTime(400, now + 0.22);

        gain.gain.setValueAtTime(0, now);
        gain.gain.linearRampToValueAtTime(0.24, now + 0.01);
        gain.gain.exponentialRampToValueAtTime(0.001, now + 0.24);

        osc.connect(gain);
        gain.connect(ctx.destination);

        osc.start(now);
        osc.stop(now + 0.25);
      } else if (secondsLeft === 1) {
        // "1" -> Rapid double-beep warning
        [0, 0.08].forEach((offset) => {
          const osc = ctx.createOscillator();
          const gain = ctx.createGain();

          osc.type = 'sine';
          osc.frequency.setValueAtTime(1175, now + offset);

          gain.gain.setValueAtTime(0, now + offset);
          gain.gain.linearRampToValueAtTime(0.28, now + offset + 0.005);
          gain.gain.exponentialRampToValueAtTime(0.001, now + offset + 0.055);

          osc.connect(gain);
          gain.connect(ctx.destination);

          osc.start(now + offset);
          osc.stop(now + offset + 0.06);
        });
      } else {
        // "5, 4, 3, 2" -> Clean digital clock pulse (1046.5Hz C6)
        const osc = ctx.createOscillator();
        const gain = ctx.createGain();

        osc.type = 'sine';
        osc.frequency.setValueAtTime(1046.5, now);

        gain.gain.setValueAtTime(0, now);
        gain.gain.linearRampToValueAtTime(0.25, now + 0.005);
        gain.gain.exponentialRampToValueAtTime(0.001, now + 0.065);

        osc.connect(gain);
        gain.connect(ctx.destination);

        osc.start(now);
        osc.stop(now + 0.07);
      }
    } catch {
      // Safe audio fail
    }
  }

  playTick(secondsLeft) {
    this.playCountdown(typeof secondsLeft === 'number' ? secondsLeft : 5);
  }

  /**
   * BG678 Authentic Win Sound
   */
  playWin() {
    if (!this.enabled) return;
    const ctx = this.initCtx();
    if (!ctx) return;

    try {
      const now = ctx.currentTime;

      const notes = [
        { freq: 523.25, time: 0.00, dur: 0.12 },
        { freq: 659.25, time: 0.09, dur: 0.12 },
        { freq: 783.99, time: 0.18, dur: 0.12 },
        { freq: 1046.50, time: 0.28, dur: 0.16 },
        { freq: 1318.51, time: 0.40, dur: 0.22 },
        { freq: 1567.98, time: 0.54, dur: 0.50 },
      ];

      notes.forEach((n, idx) => {
        const osc = ctx.createOscillator();
        const harmonic = ctx.createOscillator();
        const gain = ctx.createGain();

        osc.type = 'triangle';
        osc.frequency.setValueAtTime(n.freq, now + n.time);

        harmonic.type = 'sine';
        harmonic.frequency.setValueAtTime(n.freq * 2, now + n.time);

        const vol = idx === notes.length - 1 ? 0.32 : 0.22;
        gain.gain.setValueAtTime(0, now + n.time);
        gain.gain.linearRampToValueAtTime(vol, now + n.time + 0.015);
        gain.gain.exponentialRampToValueAtTime(0.001, now + n.time + n.dur);

        osc.connect(gain);
        harmonic.connect(gain);
        gain.connect(ctx.destination);

        osc.start(now + n.time);
        harmonic.start(now + n.time);
        osc.stop(now + n.time + n.dur);
        harmonic.stop(now + n.time + n.dur);
      });

      const coinDrops = [2093, 2637, 3136, 3520, 4186, 4698];
      coinDrops.forEach((freq, i) => {
        const dropTime = now + 0.45 + i * 0.065;
        const osc = ctx.createOscillator();
        const gain = ctx.createGain();

        osc.type = 'sine';
        osc.frequency.setValueAtTime(freq, dropTime);

        gain.gain.setValueAtTime(0, dropTime);
        gain.gain.linearRampToValueAtTime(0.18, dropTime + 0.004);
        gain.gain.exponentialRampToValueAtTime(0.001, dropTime + 0.18);

        osc.connect(gain);
        gain.connect(ctx.destination);

        osc.start(dropTime);
        osc.stop(dropTime + 0.19);
      });
    } catch {
      // Safe audio fail
    }
  }

  /**
   * BG678 Authentic Lose Sound
   */
  playLoss() {
    if (!this.enabled) return;
    const ctx = this.initCtx();
    if (!ctx) return;

    try {
      const now = ctx.currentTime;

      const defeatNotes = [
        { freq: 349.23, time: 0.00, dur: 0.14, slideTo: 330 },
        { freq: 261.63, time: 0.13, dur: 0.38, slideTo: 196 },
      ];

      defeatNotes.forEach((n) => {
        const osc = ctx.createOscillator();
        const filter = ctx.createBiquadFilter();
        const gain = ctx.createGain();

        osc.type = 'triangle';
        osc.frequency.setValueAtTime(n.freq, now + n.time);
        osc.frequency.exponentialRampToValueAtTime(n.slideTo, now + n.time + n.dur);

        filter.type = 'lowpass';
        filter.frequency.setValueAtTime(650, now + n.time);

        gain.gain.setValueAtTime(0, now + n.time);
        gain.gain.linearRampToValueAtTime(0.24, now + n.time + 0.015);
        gain.gain.exponentialRampToValueAtTime(0.001, now + n.time + n.dur);

        osc.connect(filter);
        filter.connect(gain);
        gain.connect(ctx.destination);

        osc.start(now + n.time);
        osc.stop(now + n.time + n.dur);
      });
    } catch {
      // Safe audio fail
    }
  }
}

export const sound = new SoundFX();
