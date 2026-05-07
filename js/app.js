// Soundscapes — bootstrap.

import { CONFIG } from './config.js';
import { Ensemble } from './ensemble.js';
import { Clock } from './clock.js';
import { AudioEngine } from './audio-engine.js';
import { ButtonController } from './button-controller.js';
import { SceneDisplay } from './scene-display.js';
import { DemoMode } from './demo-mode.js';
import { OperatorPanel } from './operator-panel.js';

const state = {
  ensemble: null,
  clock: null,
  audioEngine: null,
  demoMode: null,
  scene: null,
  buttons: null,
  operator: null,
  mode: 'stopped',
};

const el = (id) => document.getElementById(id);

const transport = {
  async start() {
    if (state.mode === 'playing') return;
    if (!state.audioEngine._started) {
      await state.audioEngine.start();
    }
    state.audioEngine.startAll();
    state.clock.start();
    state.scene.start();
    state.mode = 'playing';
    el('start-overlay').classList.add('hidden');
    updateStatus();
  },
  pause() {
    state.audioEngine.stopAll();
    state.clock.pause();
    state.mode = 'paused';
    updateStatus();
  },
  reset() {
    state.audioEngine.stopAll();
    state.clock.reset();
    state.ensemble.reset();
    state.mode = 'stopped';
    state.buttons.refresh();
    updateStatus();
  },
};

function updateStatus() {
  const e = state.ensemble;
  el('status-spread').textContent = `${e.getSpread()} / ${CONFIG.maxSpread}`;
  el('status-range').textContent = `${e.getMinCell()} - ${e.getMaxCell()}`;
  el('status-mode').textContent = state.mode.charAt(0).toUpperCase() + state.mode.slice(1);
  el('status-pulse').textContent = state.clock?.tick ?? '-';
}

function initKeys() {
  document.addEventListener('keydown', (e) => {
    const tag = (e.target.tagName || '').toLowerCase();
    if (tag === 'input' || tag === 'select' || tag === 'textarea') return;
    if (e.code === 'Space') {
      e.preventDefault();
      if (state.mode === 'playing') transport.pause();
      else transport.start();
    } else if (e.key === 'd' || e.key === 'D') {
      const on = state.demoMode.toggle();
      const btn = el('op-demo');
      btn.textContent = on ? 'On' : 'Off';
      btn.classList.toggle('primary', on);
    }
  });
}

async function boot() {
  state.ensemble = new Ensemble();
  state.clock = new Clock();
  state.audioEngine = new AudioEngine(state.ensemble);
  state.demoMode = new DemoMode(state.ensemble, state.clock);

  state.buttons = new ButtonController(state.ensemble, state.audioEngine, el('button-row'));
  state.scene = new SceneDisplay(el('scene-canvas'), state.ensemble, state.audioEngine);
  state.operator = new OperatorPanel({
    ensemble: state.ensemble,
    audioEngine: state.audioEngine,
    clock: state.clock,
    demoMode: state.demoMode,
    transport,
  });

  state.ensemble.addEventListener('stateChange', () => {
    state.buttons.refresh();
    updateStatus();
  });
  state.ensemble.addEventListener('reset', () => {
    state.buttons.refresh();
    updateStatus();
  });
  state.clock.addEventListener('pulse', updateStatus);

  el('btn-play-demo').addEventListener('click', async () => {
    // Pressing the big play button starts AND turns demo mode on so the scene
    // self-evolves right away (matches In C UX).
    await transport.start();
    if (!state.demoMode.enabled) {
      const on = state.demoMode.toggle(true);
      const btn = el('op-demo');
      btn.textContent = on ? 'On' : 'Off';
      btn.classList.toggle('primary', on);
    }
  });

  initKeys();
  updateStatus();
}

boot().catch((err) => console.error('boot failed', err));
