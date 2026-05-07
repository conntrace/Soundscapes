// Soundscapes — sample-based playback primitives.
//
// Loads the active scene's sample manifest into AudioBuffers and
// exposes oneShot / ambientBed / playSample primitives that the cell
// schedulers in scenes/*.js call into.

import { ACTIVE_SCENE } from './scenes/index.js';

// ---- AudioBuffer cache ----
const buffers = new Map(); // id → AudioBuffer

const rand = (a, b) => a + Math.random() * (b - a);

export async function loadAllSamples(ctx, onProgress) {
  const manifest = ACTIVE_SCENE.samples;
  const ids = Object.keys(manifest);
  let loaded = 0;
  await Promise.all(ids.map(async (id) => {
    const url = manifest[id].url;
    try {
      const res = await fetch(url);
      if (!res.ok) throw new Error(`${res.status} ${res.statusText}`);
      const arr = await res.arrayBuffer();
      const buf = await ctx.decodeAudioData(arr);
      buffers.set(id, buf);
    } catch (err) {
      console.warn(`failed to load ${id} (${url}): ${err.message}`);
    }
    loaded++;
    if (onProgress) onProgress(loaded, ids.length, id);
  }));
  return buffers.size;
}

export function getBuffer(id) {
  return buffers.get(id);
}

// ---- Core primitive: play a sample at a given time ----
export function playSample(ctx, dest, opts) {
  const buf = buffers.get(opts.id);
  if (!buf) return null;

  const when = opts.when ?? ctx.currentTime;
  const gain = opts.gain ?? 0.7;
  const pitch = opts.pitch ?? 1;
  const pan = opts.pan ?? 0;
  const fadeIn = opts.fadeIn ?? 0.05;
  const fadeOut = opts.fadeOut ?? 0.3;
  const loop = !!opts.loop;

  let offset = opts.offset ?? 0;
  if (opts.randomOffset && buf.duration > 6) {
    offset = rand(0, buf.duration * 0.7);
  }

  let duration = opts.duration;
  if (duration === undefined || duration === null) {
    duration = (buf.duration - offset) / pitch;
  }

  const src = ctx.createBufferSource();
  src.buffer = buf;
  src.playbackRate.value = pitch;
  src.loop = loop;
  if (loop) {
    src.loopStart = 0;
    src.loopEnd = buf.duration;
  }

  const g = ctx.createGain();
  g.gain.setValueAtTime(0, when);
  g.gain.linearRampToValueAtTime(gain, when + fadeIn);
  g.gain.setValueAtTime(gain, Math.max(when + fadeIn, when + duration - fadeOut));
  g.gain.linearRampToValueAtTime(0, when + duration);

  let last = src.connect(g);
  if (Math.abs(pan) > 0.001) {
    const panner = ctx.createStereoPanner();
    panner.pan.value = Math.max(-1, Math.min(1, pan));
    last = last.connect(panner);
  }
  last.connect(dest);

  src.start(when, offset);
  src.stop(when + duration + 0.05);
  return g;
}

// Fire one short one-shot with random pitch / pan / gain variation.
export function oneShot(ctx, dest, id, when, opts = {}) {
  const buf = buffers.get(id);
  if (!buf) return;
  const pitchSpread = opts.pitchSpread ?? 0.15;
  const panSpread = opts.panSpread ?? 0.6;
  const pitch = (opts.pitch ?? 1) + rand(-pitchSpread, pitchSpread);
  return playSample(ctx, dest, {
    id,
    when,
    gain: opts.gain ?? rand(0.5, 0.85),
    pitch,
    pan: opts.pan ?? rand(-panSpread, panSpread),
    offset: opts.offset ?? 0,
    duration: opts.duration,
    fadeIn: opts.fadeIn ?? 0.005,
    fadeOut: opts.fadeOut ?? Math.min(0.2, (buf.duration * 0.3)),
  });
}

// Schedule a long looping bed (for ambient sounds during a cell).
export function ambientBed(ctx, dest, id, when, duration, opts = {}) {
  const buf = buffers.get(id);
  if (!buf) return;
  const pitchSpread = opts.pitchSpread ?? 0.04;
  const pitch = (opts.pitch ?? 1) + rand(-pitchSpread, pitchSpread);
  return playSample(ctx, dest, {
    id,
    when,
    gain: opts.gain ?? rand(0.3, 0.55),
    pitch,
    pan: opts.pan ?? rand(-0.4, 0.4),
    randomOffset: true,
    duration,
    loop: duration / pitch > buf.duration,
    fadeIn: opts.fadeIn ?? 0.4,
    fadeOut: opts.fadeOut ?? 0.6,
  });
}
