// Soundscapes — autonomous advance heuristic for demo / installation mode.
// On every clock pulse, decide whether to tap any performers' buttons,
// favoring catch-up so the ensemble drifts forward.

import { CONFIG } from './config.js';

export class DemoMode {
  constructor(ensemble, clock) {
    this.ensemble = ensemble;
    this.clock = clock;
    this.enabled = false;
    this.clock.addEventListener('pulse', () => this._onPulse());
  }

  toggle(on) {
    this.enabled = (on === undefined) ? !this.enabled : !!on;
    return this.enabled;
  }

  _onPulse() {
    if (!this.enabled) return;
    const eligible = this.ensemble.performers.filter(p => this.ensemble.isEligible(p.id));
    if (!eligible.length) return;

    // Catch-up bias: prefer the most-behind eligible performer
    const minCell = this.ensemble.getMinCell();
    const behind = eligible.filter(p => p.currentCell === minCell);
    const pool = behind.length ? behind : eligible;

    // Tap one with high probability if behind, otherwise occasionally
    const probability = behind.length ? 0.55 : CONFIG.demoTapProbability;
    if (Math.random() < probability) {
      const pick = pool[Math.floor(Math.random() * pool.length)];
      this.ensemble.queueAdvance(pick.id);
    }
  }
}
