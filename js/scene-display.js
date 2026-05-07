// Soundscapes — Scene Display.
// A simple animated visualization of the eight performers as horizontal
// "layers" of a forest scene — each layer's intensity reflects the current
// cell, and pulses on real-time peak levels from the audio engine.

import { CONFIG } from './config.js';
import { getCell } from './sound-cells.js';

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
    this._stars = this._generateStars(80);
    this._resize();
    window.addEventListener('resize', () => this._resize());
  }

  _resize() {
    const rect = this.canvas.getBoundingClientRect();
    this.canvas.width = Math.floor(rect.width * this.dpr);
    this.canvas.height = Math.floor(rect.height * this.dpr);
  }

  _generateStars(n) {
    const stars = [];
    for (let i = 0; i < n; i++) {
      stars.push({
        x: Math.random(),
        y: Math.random() * 0.55,
        b: 0.3 + Math.random() * 0.7,
        twinkle: Math.random() * Math.PI * 2,
      });
    }
    return stars;
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
        // Smooth toward live level
        this._smoothed[i] = this._smoothed[i] * 0.85 + this._levels[i] * 0.15;
      }
    }

    // Sky gradient — color shifts subtly with overall density
    const totalCell = this.ensemble.performers.reduce((a, p) => a + p.currentCell, 0);
    const dawnProgress = Math.min(1, totalCell / (CONFIG.performerCount * (CONFIG.totalCells - 1)));
    this._drawSky(ctx, w, h, dawnProgress);
    this._drawStars(ctx, w, h, dawnProgress);
    this._drawSun(ctx, w, h, dawnProgress);
    this._drawHorizon(ctx, w, h, dawnProgress);

    // Layer bars at the bottom
    this._drawLayerBars(ctx, w, h);
  }

  _drawSky(ctx, w, h, dawn) {
    const top = `rgb(${Math.floor(10 + dawn * 60)}, ${Math.floor(20 + dawn * 50)}, ${Math.floor(30 + dawn * 40)})`;
    const bottom = `rgb(${Math.floor(20 + dawn * 200)}, ${Math.floor(36 + dawn * 130)}, ${Math.floor(60 + dawn * 80)})`;
    const grad = ctx.createLinearGradient(0, 0, 0, h * 0.7);
    grad.addColorStop(0, top);
    grad.addColorStop(1, bottom);
    ctx.fillStyle = grad;
    ctx.fillRect(0, 0, w, h * 0.7);
  }

  _drawStars(ctx, w, h, dawn) {
    const visibility = 1 - Math.min(1, dawn * 1.6);
    if (visibility <= 0.02) return;
    const time = performance.now() / 1000;
    for (const s of this._stars) {
      const tw = 0.5 + 0.5 * Math.sin(time * 2 + s.twinkle);
      const alpha = visibility * s.b * (0.4 + 0.6 * tw);
      ctx.fillStyle = `rgba(232, 239, 229, ${alpha})`;
      ctx.fillRect(s.x * w, s.y * h * 0.7, 1.5 * this.dpr, 1.5 * this.dpr);
    }
  }

  _drawSun(ctx, w, h, dawn) {
    if (dawn <= 0.05) return;
    const cx = w * 0.7;
    const baseY = h * 0.7;
    const y = baseY - dawn * h * 0.25;
    const r = (8 + dawn * 28) * this.dpr;
    const grad = ctx.createRadialGradient(cx, y, 0, cx, y, r * 3);
    grad.addColorStop(0, `rgba(255, 220, 160, ${0.9 * dawn})`);
    grad.addColorStop(0.4, `rgba(255, 180, 110, ${0.4 * dawn})`);
    grad.addColorStop(1, `rgba(255, 180, 110, 0)`);
    ctx.fillStyle = grad;
    ctx.beginPath();
    ctx.arc(cx, y, r * 3, 0, Math.PI * 2);
    ctx.fill();
    ctx.fillStyle = `rgba(255, 235, 200, ${0.95 * dawn})`;
    ctx.beginPath();
    ctx.arc(cx, y, r, 0, Math.PI * 2);
    ctx.fill();
  }

  _drawHorizon(ctx, w, h, dawn) {
    const horizonY = h * 0.7;
    // Distant tree silhouette (low ridge)
    ctx.fillStyle = `rgba(${10 + dawn * 30}, ${22 + dawn * 35}, ${20 + dawn * 28}, 1)`;
    ctx.beginPath();
    ctx.moveTo(0, horizonY);
    const peaks = 30;
    for (let i = 0; i <= peaks; i++) {
      const x = (i / peaks) * w;
      const peak = horizonY - (10 + Math.sin(i * 1.6) * 6 + Math.sin(i * 0.7) * 8) * this.dpr;
      ctx.lineTo(x, peak);
    }
    ctx.lineTo(w, horizonY);
    ctx.closePath();
    ctx.fill();

    // Closer trees
    ctx.fillStyle = `rgba(${5 + dawn * 14}, ${15 + dawn * 18}, ${12 + dawn * 14}, 1)`;
    ctx.beginPath();
    ctx.moveTo(0, h);
    ctx.lineTo(0, horizonY + 12 * this.dpr);
    const peaks2 = 18;
    for (let i = 0; i <= peaks2; i++) {
      const x = (i / peaks2) * w;
      const peak = horizonY + (8 + Math.cos(i * 1.1) * 18 + Math.sin(i * 2.3) * 14) * this.dpr;
      ctx.lineTo(x, peak);
    }
    ctx.lineTo(w, h);
    ctx.closePath();
    ctx.fill();
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

      // Bar background
      ctx.fillStyle = 'rgba(255, 255, 255, 0.04)';
      ctx.fillRect(x + 4, barAreaY, barW - 8, barAreaH);

      // Fill (current cell level)
      ctx.fillStyle = perf.color + '99';
      ctx.fillRect(x + 4, barAreaY + (barAreaH - cellH), barW - 8, cellH);

      // Live peak overlay (grows from current fill, indicating audio)
      const peakH = Math.min(barAreaH * 0.3, live * barAreaH * 0.6);
      if (peakH > 0.5) {
        ctx.fillStyle = perf.color;
        ctx.fillRect(x + 4, barAreaY + (barAreaH - cellH) - peakH, barW - 8, peakH);
      }

      // Glow if queued
      if (perf.advanceQueued) {
        ctx.strokeStyle = perf.color;
        ctx.lineWidth = 2 * this.dpr;
        ctx.strokeRect(x + 3, barAreaY - 1, barW - 6, barAreaH + 2);
      }
    }
  }
}
