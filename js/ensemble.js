// Soundscapes — Ensemble manager.
// Ported from in-c-audience-ensemble's ensemble.js. Same spread + opening
// gate + deadlock relief logic, but cell-based.

import { CONFIG } from './config.js';
import { Performer } from './performer.js';

export class Ensemble extends EventTarget {
  constructor() {
    super();
    this.performers = [];
    for (let i = 0; i < CONFIG.performerCount; i++) {
      this.performers.push(new Performer(i));
    }
    this._deadlockTimer = null;
    this._spreadRelaxed = false;
  }

  // The opening gate: every online performer must reach cell 1 (first sound)
  // before anyone may advance past cell 1.
  _isOpeningGateActive() {
    const allOnline = this.performers.filter(p => !p.offline);
    return !allOnline.every(p => p.currentCell >= 1);
  }

  onPerformerLoopComplete(performerId) {
    const p = this.performers[performerId];

    // Enforce opening gate at advance time
    if (p.currentCell >= 1 && p.advanceQueued && this._isOpeningGateActive()) {
      p.advanceQueued = false;
    }

    const result = p.onLoopComplete();

    if (result.advanced && CONFIG.endBehavior === 'resetAll') {
      const last = CONFIG.totalCells - 1;
      const allAtEnd = this.performers.every(p => p.currentCell >= last);
      if (allAtEnd) {
        this.reset();
        this.dispatchEvent(new CustomEvent('resetAll'));
        return result;
      }
    }

    this._checkDeadlock();
    this.dispatchEvent(new CustomEvent('stateChange', { detail: { performerId } }));
    return result;
  }

  // Full eligibility check (called by UI to dim ineligible buttons)
  isEligible(performerId) {
    const p = this.performers[performerId];
    if (!p.canAdvance()) return false;

    // Opening gate
    if (p.currentCell >= 1) {
      const allOnline = this.performers.filter(o => !o.offline);
      const allEntered = allOnline.every(o => o.currentCell >= 1);
      if (!allEntered) return false;
    }

    // Catch-up: most-behind performers always eligible
    const minCell = this.getMinCell();
    if (p.currentCell === minCell) return true;

    // Spread check
    const newCell = p.currentCell + 1;
    const newMax = Math.max(this.getMaxCell(), newCell);
    const spread = newMax - minCell;
    if (this._spreadRelaxed) return true;
    return spread <= CONFIG.maxSpread;
  }

  queueAdvance(performerId) {
    if (!this.isEligible(performerId)) return false;
    const ok = this.performers[performerId].queueAdvance();
    if (ok) {
      this.dispatchEvent(new CustomEvent('queueChange', { detail: { performerId } }));
    }
    return ok;
  }

  getMinCell() {
    const online = this.performers.filter(p => !p.offline);
    if (!online.length) return 0;
    return Math.min(...online.map(p => p.currentCell));
  }

  getMaxCell() {
    const online = this.performers.filter(p => !p.offline);
    if (!online.length) return 0;
    return Math.max(...online.map(p => p.currentCell));
  }

  getSpread() {
    return this.getMaxCell() - this.getMinCell();
  }

  reset() {
    for (const p of this.performers) p.reset();
    this._spreadRelaxed = false;
    this.dispatchEvent(new CustomEvent('reset'));
  }

  // Deadlock relief: if everyone is gated by spread for too long, relax it.
  _checkDeadlock() {
    const allCanAdvance = this.performers.every(p => !p.canAdvance() || this.isEligible(p.id));
    if (allCanAdvance && this._spreadRelaxed) {
      this._spreadRelaxed = false;
    }

    if (this._deadlockTimer) return;

    // Check if all eligible performers are blocked solely by spread
    const blocked = this.performers.filter(p => !p.offline && p.canAdvance() && !this.isEligible(p.id));
    if (blocked.length >= 2) {
      this._deadlockTimer = setTimeout(() => {
        this._spreadRelaxed = true;
        this._deadlockTimer = null;
        this.dispatchEvent(new CustomEvent('deadlockRelief'));
      }, 30000);
    }
  }

  setOffline(performerId, offline) {
    this.performers[performerId].offline = offline;
    this.dispatchEvent(new CustomEvent('stateChange', { detail: { performerId } }));
  }
}
