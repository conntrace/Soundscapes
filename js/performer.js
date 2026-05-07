// Soundscapes — Performer state machine.
// Ported from in-c-audience-ensemble's musician.js, with cell semantics.

import { CONFIG } from './config.js';

export class Performer {
  constructor(id) {
    const meta = CONFIG.performers[id];
    this.id = id;
    this.key = meta.key;
    this.name = meta.name;
    this.color = meta.color;
    this.categoryId = meta.categoryId;

    // currentCell starts at 0 (silence). The opening gate requires everyone
    // to reach cell 1 before anyone advances past cell 1.
    this.currentCell = 0;
    this.advanceQueued = false;
    this.cooldownActive = false;
    this.offline = false;
  }

  // Called when this performer's cell loop completes.
  onLoopComplete() {
    if (this.offline) return { advanced: false };

    // Cooldown clears after one full loop of the new cell
    if (this.cooldownActive && !this.advanceQueued) {
      this.cooldownActive = false;
      return { advanced: false };
    }

    if (this.advanceQueued) {
      this.advanceQueued = false;
      this._advanceCell();
      this.cooldownActive = true;
      return { advanced: true, newCell: this.currentCell };
    }

    return { advanced: false };
  }

  _advanceCell() {
    const last = CONFIG.totalCells - 1;
    if (CONFIG.endBehavior === 'wrap') {
      this.currentCell = (this.currentCell + 1) % CONFIG.totalCells;
    } else if (CONFIG.endBehavior === 'hold') {
      if (this.currentCell < last) this.currentCell++;
    } else {
      // resetAll handled at ensemble level
      this.currentCell++;
    }
  }

  queueAdvance() {
    if (this.canAdvance()) {
      this.advanceQueued = true;
      return true;
    }
    return false;
  }

  canAdvance() {
    if (this.offline) return false;
    if (this.advanceQueued || this.cooldownActive) return false;
    if (CONFIG.endBehavior === 'hold' && this.currentCell >= CONFIG.totalCells - 1) {
      return false;
    }
    return true;
  }

  reset() {
    this.currentCell = 0;
    this.advanceQueued = false;
    this.cooldownActive = false;
  }
}
