// Soundscapes — Audio Engine.
// Each performer self-loops its current cell. When a loop completes,
// we tell the ensemble (which may flip the cell), then schedule the next.

import { CONFIG } from './config.js';
import { getCell } from './sound-cells.js';
import { loadAllSamples } from './sample-engine.js';

const LOOKAHEAD_SEC = 0.05;

class PerformerVoice {
  constructor(performerId, ctx, masterBus, ensemble, onEvent) {
    this.id = performerId;
    this.ctx = ctx;
    this.masterBus = masterBus;
    this.ensemble = ensemble;
    this.onEvent = onEvent;
    this._running = false;
    this._loopTimerId = null;
    this._nextLoopTime = 0;

    // Per-performer mix bus, useful for ducking/visualization
    this.bus = ctx.createGain();
    this.bus.gain.value = 1.0;
    this.bus.connect(masterBus);

    // Lightweight peak meter: an analyser node for the visualization
    this.analyser = ctx.createAnalyser();
    this.analyser.fftSize = 256;
    this._meterData = new Uint8Array(this.analyser.frequencyBinCount);
    this.bus.connect(this.analyser);
  }

  startLoop(startTime) {
    this._running = true;
    this._nextLoopTime = startTime;
    this._scheduleNextLoop();
  }

  stopLoop() {
    this._running = false;
    if (this._loopTimerId !== null) {
      clearTimeout(this._loopTimerId);
      this._loopTimerId = null;
    }
  }

  _scheduleNextLoop() {
    if (!this._running) return;

    const performer = this.ensemble.performers[this.id];
    const cell = getCell(performer.categoryId, performer.currentCell);
    if (!cell) return;

    const loopStart = this._nextLoopTime;
    const loopEnd = loopStart + cell.duration;

    // Schedule the cell's events
    try {
      cell.schedule(this.ctx, this.bus, loopStart, 1.0);
    } catch (err) {
      console.error('cell schedule error', performer.name, err);
    }

    this._nextLoopTime = loopEnd;

    // Fire loop-complete callback slightly before audio actually finishes,
    // so the next loop can be scheduled seamlessly.
    const fireDelay = Math.max(0, (loopEnd - this.ctx.currentTime - LOOKAHEAD_SEC) * 1000);
    this._loopTimerId = setTimeout(() => {
      if (!this._running) return;
      // Notify ensemble — may advance the cell
      this.ensemble.onPerformerLoopComplete(this.id);
      this.onEvent?.('loop-complete', this.id);
      // Schedule the next loop
      this._scheduleNextLoop();
    }, fireDelay);
  }

  getPeakLevel() {
    this.analyser.getByteTimeDomainData(this._meterData);
    let peak = 0;
    for (let i = 0; i < this._meterData.length; i++) {
      const v = Math.abs(this._meterData[i] - 128) / 128;
      if (v > peak) peak = v;
    }
    return peak;
  }
}

export class AudioEngine {
  constructor(ensemble) {
    this.ensemble = ensemble;
    this.ctx = null;
    this.masterBus = null;
    this.voices = [];
    this._started = false;
    this._eventListeners = new Set();
  }

  on(fn) {
    this._eventListeners.add(fn);
    return () => this._eventListeners.delete(fn);
  }

  _emit(name, payload) {
    for (const fn of this._eventListeners) fn(name, payload);
  }

  async start() {
    if (this._started) return;
    this.ctx = new (window.AudioContext || window.webkitAudioContext)();
    if (this.ctx.state === 'suspended') {
      await this.ctx.resume();
    }

    this.masterBus = this.ctx.createGain();
    this.masterBus.gain.value = CONFIG.masterVolume;

    // Subtle high-shelf reverb-ish: convolver with a synthetic IR for a bit of space
    const verb = this._buildReverb();
    if (verb) {
      const wet = this.ctx.createGain();
      wet.gain.value = 0.12;
      this.masterBus.connect(verb).connect(wet).connect(this.ctx.destination);
    }
    // Dry path
    this.masterBus.connect(this.ctx.destination);

    // Load all sample buffers before scheduling. Emits progress events.
    this._emit('loading', { loaded: 0, total: 0 });
    const loaded = await loadAllSamples(this.ctx, (n, total, id) => {
      this._emit('loading', { loaded: n, total, current: id });
    });
    this._emit('loaded', { loaded });

    // Create voices
    this.voices = [];
    for (let i = 0; i < CONFIG.performerCount; i++) {
      this.voices.push(
        new PerformerVoice(i, this.ctx, this.masterBus, this.ensemble, (name, id) => {
          this._emit(name, id);
        })
      );
    }

    this._started = true;
    this._emit('started');
  }

  startAll() {
    if (!this._started) return;
    const t0 = this.ctx.currentTime + 0.1;
    for (const v of this.voices) v.startLoop(t0);
    this._emit('playing');
  }

  stopAll() {
    for (const v of this.voices) v.stopLoop();
    this._emit('stopped');
  }

  setMasterVolume(v) {
    if (this.masterBus) {
      this.masterBus.gain.cancelScheduledValues(this.ctx.currentTime);
      this.masterBus.gain.linearRampToValueAtTime(v, this.ctx.currentTime + 0.1);
    }
    CONFIG.masterVolume = v;
  }

  // Build a small synthetic impulse response for ambient room feel.
  _buildReverb() {
    try {
      const ctx = this.ctx;
      const dur = 1.6;
      const decay = 2.5;
      const sampleRate = ctx.sampleRate;
      const length = Math.floor(dur * sampleRate);
      const ir = ctx.createBuffer(2, length, sampleRate);
      for (let ch = 0; ch < 2; ch++) {
        const data = ir.getChannelData(ch);
        for (let i = 0; i < length; i++) {
          data[i] = (Math.random() * 2 - 1) * Math.pow(1 - i / length, decay);
        }
      }
      const conv = ctx.createConvolver();
      conv.buffer = ir;
      return conv;
    } catch (err) {
      console.warn('reverb unavailable', err);
      return null;
    }
  }
}
