// Soundscapes — sample-based playback primitives.
//
// Replaces synth-sources.js. All sounds are real CC0 field recordings
// from bigsoundbank.com (see samples/CREDITS.md). Each primitive schedules
// a sample to play at a given time with optional pitch/volume/pan
// variation. Per-loop randomness across pitch, gain, pan, start-offset
// keeps every loop unique.

// ---- Manifest of available samples ----
// Each entry: id → { url, label, source }
// All files are CC0 (public domain).
export const SAMPLE_MANIFEST = {
  // Birds
  'awakening-birds':   { url: 'samples/awakening-birds.mp3' },
  'evening-birds':     { url: 'samples/evening-birds.mp3' },
  'robin':             { url: 'samples/robin.mp3' },
  'common-blackbird':  { url: 'samples/common-blackbird.mp3' },
  // Wind
  'wind':              { url: 'samples/wind.mp3' },
  'wind-in-trees':     { url: 'samples/wind-in-trees.mp3' },
  'wind-tree-squeaks': { url: 'samples/wind-tree-squeaks.mp3' },
  // Water
  'small-stream':      { url: 'samples/small-stream.mp3' },
  'small-cascade':     { url: 'samples/small-cascade.mp3' },
  'brooklet':          { url: 'samples/brooklet.mp3' },
  // Insects
  'field-cricket':     { url: 'samples/field-cricket.mp3' },
  'nocturnal-insect':  { url: 'samples/nocturnal-insect.mp3' },
  'nocturnal-insects': { url: 'samples/nocturnal-insects.mp3' },
  // Amphibians
  'frogs-1':           { url: 'samples/frogs-1.mp3' },
  'frogs-2':           { url: 'samples/frogs-2.mp3' },
  'one-frog':          { url: 'samples/one-frog.mp3' },
  // Leaves
  'feet-in-leaves':    { url: 'samples/feet-in-leaves.mp3' },
  'feet-in-leaves-2':  { url: 'samples/feet-in-leaves-2.mp3' },
  // Atmosphere
  'thunder':           { url: 'samples/thunder.mp3' },
  'tawny-owl':         { url: 'samples/tawny-owl.mp3' },
  'long-eared-owl':    { url: 'samples/long-eared-owl.mp3' },
};

// ---- AudioBuffer cache ----
const buffers = new Map(); // id → AudioBuffer
let _ctx = null;

export async function loadAllSamples(ctx, onProgress) {
  _ctx = ctx;
  const ids = Object.keys(SAMPLE_MANIFEST);
  let loaded = 0;
  await Promise.all(ids.map(async (id) => {
    const url = SAMPLE_MANIFEST[id].url;
    try {
      const res = await fetch(url);
      if (!res.ok) throw new Error(`${res.status} ${res.statusText}`);
      const arr = await res.arrayBuffer();
      const buf = await ctx.decodeAudioData(arr);
      buffers.set(id, buf);
    } catch (err) {
      console.warn(`failed to load ${id}: ${err.message}`);
    }
    loaded++;
    if (onProgress) onProgress(loaded, ids.length, id);
  }));
  return buffers.size;
}

export function getBuffer(id) {
  return buffers.get(id);
}

const rand = (a, b) => a + Math.random() * (b - a);

// ---- Core primitive: play a sample at a given time ----
//
// Options:
//   id           — sample id from manifest
//   when         — audio context time to start
//   gain         — 0..1 (default 0.7)
//   pitch        — playbackRate (default 1; e.g. 0.9 lowers, 1.1 raises)
//   pan          — -1..1 stereo pan (default 0)
//   offset       — start time inside the buffer (default random within first 60% of buffer for ambiences)
//   duration     — how long to play (default: full remainder of buffer)
//   fadeIn       — seconds (default 0.1 if looped/ambient, 0.005 for one-shots)
//   fadeOut      — seconds (default 0.3)
//   randomOffset — if true, pick a random start offset in the buffer (good for ambiences)
//   loop         — if true, loop the buffer for `duration` seconds with crossfade-friendly fades
//
// Returns the GainNode so callers can chain to a meter/bus if needed.
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
    // start somewhere in the first ~70% of the buffer to avoid running out
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
  // Envelope
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
// Good for bird chirps, drips, footsteps, etc.
export function oneShot(ctx, dest, id, when, opts = {}) {
  const buf = buffers.get(id);
  if (!buf) return;
  const pitchSpread = opts.pitchSpread ?? 0.15;
  const panSpread = opts.panSpread ?? 0.6;
  return playSample(ctx, dest, {
    id,
    when,
    gain: opts.gain ?? rand(0.5, 0.85),
    pitch: 1 + rand(-pitchSpread, pitchSpread),
    pan: rand(-panSpread, panSpread),
    offset: opts.offset ?? 0,
    duration: opts.duration,
    fadeIn: opts.fadeIn ?? 0.005,
    fadeOut: opts.fadeOut ?? Math.min(0.2, (buf.duration * 0.3)),
  });
}

// Schedule a long looping bed (for ambient sounds during a cell).
// Random pitch + start offset + pan keeps it varied across loops.
export function ambientBed(ctx, dest, id, when, duration, opts = {}) {
  const buf = buffers.get(id);
  if (!buf) return;
  const pitchSpread = opts.pitchSpread ?? 0.04;
  const pitch = 1 + rand(-pitchSpread, pitchSpread);
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
