// Soundscapes — Scene Display.
//
// Animated visualization. Each scene supplies its own background renderer
// (sky, silhouette, atmospheric elements) via ACTIVE_SCENE.background; the
// per-performer color bars at the bottom are scene-agnostic.

import { CONFIG } from './config.js';
import { ACTIVE_SCENE } from './scenes/index.js';

export class SceneDisplay {
  constructor(canvas, ensemble, audioEngine) {
    this.canvas = canvas;
    this.ctx = canvas.getContext('2d');
    this.ensemble = ensemble;
    this.audioEngine = audioEngine;
    this.dpr = window.devicePixelRatio || 1;
    this._running = false;
    this._levels = new Array(CONFIG.performerCount).fill(0);
    this._smoothed = new Array(CONFIG.performerCount).fill(0);
    this._sceneState = {}; // mutable scratch passed to scene background fn
    this._resize();
    window.addEventListener('resize', () => this._resize());
    // Let the scene initialize any persistent state (stars, building grid, etc)
    if (typeof ACTIVE_SCENE.initBackground === 'function') {
      ACTIVE_SCENE.initBackground(this._sceneState, this.dpr);
    }
  }

  _resize() {
    const rect = this.canvas.getBoundingClientRect();
    this.canvas.width = Math.floor(rect.width * this.dpr);
    this.canvas.height = Math.floor(rect.height * this.dpr);
  }

  start() {
    if (this._running) return;
    this._running = true;
    this._loop();
  }

  stop() {
    this._running = false;
  }

  _loop() {
    if (!this._running) return;
    this._draw();
    requestAnimationFrame(() => this._loop());
  }

  _draw() {
    const ctx = this.ctx;
    const w = this.canvas.width;
    const h = this.canvas.height;
    ctx.clearRect(0, 0, w, h);

    // Read live peak levels
    if (this.audioEngine?.voices) {
      for (let i = 0; i < this.audioEngine.voices.length; i++) {
        this._levels[i] = this.audioEngine.voices[i].getPeakLevel();
        this._smoothed[i] = this._smoothed[i] * 0.85 + this._levels[i] * 0.15;
      }
    }

    // Overall density (0..1) — every scene gets this
    const totalCell = this.ensemble.performers.reduce((a, p) => a + p.currentCell, 0);
    const density = Math.min(1, totalCell / (CONFIG.performerCount * (CONFIG.totalCells - 1)));

    // Scene background — defer to active scene
    if (typeof ACTIVE_SCENE.drawBackground === 'function') {
      ACTIVE_SCENE.drawBackground(ctx, w, h, density, performance.now() / 1000, this._sceneState, this.dpr);
    } else {
      // Fallback: plain dark gradient
      ctx.fillStyle = '#0a1410';
      ctx.fillRect(0, 0, w, h * 0.7);
    }

    // Layer bars (scene-agnostic)
    this._drawLayerBars(ctx, w, h);
  }

  _drawLayerBars(ctx, w, h) {
    const barAreaY = h * 0.78;
    const barAreaH = h * 0.18;
    const n = CONFIG.performerCount;
    const padding = 14 * this.dpr;
    const totalW = w - padding * 2;
    const barW = totalW / n;

    for (let i = 0; i < n; i++) {
      const perf = this.ensemble.performers[i];
      const cellMax = CONFIG.totalCells - 1;
      const fill = perf.currentCell / cellMax;
      const live = this._smoothed[i] || 0;

      const x = padding + i * barW;
      const cellH = barAreaH * fill;

      ctx.fillStyle = 'rgba(255, 255, 255, 0.04)';
      ctx.fillRect(x + 4, barAreaY, barW - 8, barAreaH);

      ctx.fillStyle = perf.color + '99';
      ctx.fillRect(x + 4, barAreaY + (barAreaH - cellH), barW - 8, cellH);

      const peakH = Math.min(barAreaH * 0.3, live * barAreaH * 0.6);
      if (peakH > 0.5) {
        ctx.fillStyle = perf.color;
        ctx.fillRect(x + 4, barAreaY + (barAreaH - cellH) - peakH, barW - 8, peakH);
      }

      if (perf.advanceQueued) {
        ctx.strokeStyle = perf.color;
        ctx.lineWidth = 2 * this.dpr;
        ctx.strokeRect(x + 3, barAreaY - 1, barW - 6, barAreaH + 2);
      }
    }
  }
}
