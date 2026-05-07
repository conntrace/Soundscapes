// Soundscapes — Operator Panel.
// Wires the side-drawer admin controls.

import { CONFIG } from './config.js';
import { SCENES, SCENE_ORDER, ACTIVE_SCENE_ID, navigateToScene } from './scenes/index.js';

export class OperatorPanel {
  constructor({ ensemble, audioEngine, clock, demoMode, transport }) {
    this.ensemble = ensemble;
    this.audioEngine = audioEngine;
    this.clock = clock;
    this.demoMode = demoMode;
    this.transport = transport;
    this.panel = document.getElementById('operator-panel');
    this._wire();
  }

  open() { this.panel.classList.add('open'); }
  close() { this.panel.classList.remove('open'); }
  toggle() { this.panel.classList.toggle('open'); }

  _wire() {
    document.getElementById('op-link').addEventListener('click', (e) => {
      e.preventDefault();
      this.toggle();
    });

    document.addEventListener('keydown', (e) => {
      if (e.key === 'Escape') this.close();
    });

    document.getElementById('op-start').addEventListener('click', () => this.transport.start());
    document.getElementById('op-pause').addEventListener('click', () => this.transport.pause());
    document.getElementById('op-reset').addEventListener('click', () => this.transport.reset());

    // Scene selector — populate from registry, navigate on change
    const sceneSel = document.getElementById('op-scene');
    if (sceneSel) {
      sceneSel.innerHTML = '';
      for (const id of SCENE_ORDER) {
        const opt = document.createElement('option');
        opt.value = id;
        opt.textContent = SCENES[id].label;
        if (id === ACTIVE_SCENE_ID) opt.selected = true;
        sceneSel.appendChild(opt);
      }
      sceneSel.addEventListener('change', () => {
        navigateToScene(sceneSel.value);
      });
    }

    const spreadInput = document.getElementById('op-spread');
    spreadInput.value = String(CONFIG.maxSpread);
    spreadInput.addEventListener('change', () => {
      const v = parseInt(spreadInput.value, 10);
      if (Number.isFinite(v) && v >= 1 && v <= 6) CONFIG.maxSpread = v;
    });

    const endSel = document.getElementById('op-end-behavior');
    endSel.value = CONFIG.endBehavior;
    endSel.addEventListener('change', () => {
      CONFIG.endBehavior = endSel.value;
    });

    const vol = document.getElementById('op-volume');
    vol.value = String(Math.round(CONFIG.masterVolume * 100));
    vol.addEventListener('input', () => {
      this.audioEngine.setMasterVolume(parseInt(vol.value, 10) / 100);
    });

    const demoBtn = document.getElementById('op-demo');
    demoBtn.addEventListener('click', () => {
      const on = this.demoMode.toggle();
      demoBtn.textContent = on ? 'On' : 'Off';
      demoBtn.classList.toggle('primary', on);
    });
  }
}
