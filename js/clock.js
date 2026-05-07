// Soundscapes — global pulse / status clock.
// Performers each loop their own cell duration, so this clock just provides
// a steady metronome for the demo-mode tap heuristic and visualization.

import { CONFIG } from './config.js';

export class Clock extends EventTarget {
  constructor() {
    super();
    this._running = false;
    this._tickCount = 0;
    this._timer = null;
  }

  start() {
    if (this._running) return;
    this._running = true;
    this._scheduleNext();
  }

  pause() {
    this._running = false;
    if (this._timer) {
      clearTimeout(this._timer);
      this._timer = null;
    }
  }

  reset() {
    this.pause();
    this._tickCount = 0;
  }

  get pulseSec() {
    return CONFIG.pulseSec;
  }

  get tick() {
    return this._tickCount;
  }

  _scheduleNext() {
    if (!this._running) return;
    this._timer = setTimeout(() => {
      this._tickCount++;
      this.dispatchEvent(new CustomEvent('pulse', { detail: { tick: this._tickCount } }));
      this._scheduleNext();
    }, this.pulseSec * 1000);
  }
}
