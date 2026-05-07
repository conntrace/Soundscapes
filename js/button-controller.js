// Soundscapes — Button Controller.
// Renders one button per performer + handles taps and keyboard.

import { CONFIG } from './config.js';
import { getCell } from './sound-cells.js';

export class ButtonController {
  constructor(ensemble, audioEngine, container) {
    this.ensemble = ensemble;
    this.audioEngine = audioEngine;
    this.container = container;
    this.buttons = [];
    this._build();
    this._wire();
  }

  _build() {
    this.container.innerHTML = '';
    for (const perf of this.ensemble.performers) {
      const btn = document.createElement('button');
      btn.className = 'performer-btn';
      btn.dataset.performerId = String(perf.id);
      btn.style.setProperty('--p-color', perf.color);

      btn.innerHTML = `
        <span class="key-label">${perf.key}</span>
        <span class="cell-num" data-role="cell-num">0/${CONFIG.totalCells - 1}</span>
        <span class="name" style="color:${perf.color}">${perf.name}</span>
        <span class="cell-label" data-role="cell-label">silent</span>
        <span class="indicator" data-role="indicator" style="background:${perf.color}"></span>
      `;

      btn.addEventListener('click', () => this._tap(perf.id));
      this.container.appendChild(btn);
      this.buttons.push(btn);
    }
  }

  _wire() {
    document.addEventListener('keydown', (e) => {
      const tag = (e.target.tagName || '').toLowerCase();
      if (tag === 'input' || tag === 'select' || tag === 'textarea') return;
      const perf = this.ensemble.performers.find(p => p.key === e.key);
      if (perf) {
        this._tap(perf.id);
        e.preventDefault();
      }
    });

    this.ensemble.addEventListener('queueChange', () => this.refresh());
    this.ensemble.addEventListener('stateChange', () => this.refresh());
    this.ensemble.addEventListener('reset', () => this.refresh());

    this.audioEngine.on((name, id) => {
      if (name === 'loop-complete' && typeof id === 'number') {
        this._pulseIndicator(id);
      }
    });

    this.refresh();
  }

  _tap(performerId) {
    this.ensemble.queueAdvance(performerId);
  }

  _pulseIndicator(performerId) {
    const btn = this.buttons[performerId];
    if (!btn) return;
    const ind = btn.querySelector('[data-role="indicator"]');
    if (!ind) return;
    ind.style.transition = 'transform 0s';
    ind.style.transform = 'scaleX(0)';
    requestAnimationFrame(() => {
      const perf = this.ensemble.performers[performerId];
      const cell = getCell(perf.categoryId, perf.currentCell);
      const dur = cell ? cell.duration : 6;
      ind.style.transition = `transform ${dur}s linear`;
      ind.style.transform = 'scaleX(1)';
    });
  }

  refresh() {
    for (let i = 0; i < this.buttons.length; i++) {
      const btn = this.buttons[i];
      const perf = this.ensemble.performers[i];
      const cell = getCell(perf.categoryId, perf.currentCell);
      const cellNumEl = btn.querySelector('[data-role="cell-num"]');
      const cellLblEl = btn.querySelector('[data-role="cell-label"]');
      cellNumEl.textContent = `${perf.currentCell}/${CONFIG.totalCells - 1}`;
      cellLblEl.textContent = cell ? cell.label : '—';
      btn.classList.toggle('queued', perf.advanceQueued);
      btn.classList.toggle('cooldown', perf.cooldownActive);
      btn.classList.toggle('ineligible', !this.ensemble.isEligible(i));
    }
  }
}
