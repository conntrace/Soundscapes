// Soundscapes — Web Audio nature primitives.
//
// Every function is a one-shot: it creates audio nodes, schedules them
// against `startTime`, and they self-destruct when the envelope finishes.
// All routing goes through `dest` (the master bus). The tracker callback,
// if provided, is called with the audible peak gain so the visualization
// can pulse on each event.

const NOISE_LEN_SEC = 4;

// --- Cached noise buffers (created once per context) ---

const noiseCache = new WeakMap();

function getNoiseBuffers(ctx) {
  let cache = noiseCache.get(ctx);
  if (cache) return cache;

  const sampleRate = ctx.sampleRate;
  const length = Math.floor(NOISE_LEN_SEC * sampleRate);

  const white = ctx.createBuffer(1, length, sampleRate);
  const wch = white.getChannelData(0);
  for (let i = 0; i < length; i++) wch[i] = Math.random() * 2 - 1;

  // Pink noise via Voss-McCartney
  const pink = ctx.createBuffer(1, length, sampleRate);
  const pch = pink.getChannelData(0);
  let b0 = 0, b1 = 0, b2 = 0, b3 = 0, b4 = 0, b5 = 0, b6 = 0;
  for (let i = 0; i < length; i++) {
    const w = Math.random() * 2 - 1;
    b0 = 0.99886 * b0 + w * 0.0555179;
    b1 = 0.99332 * b1 + w * 0.0750759;
    b2 = 0.96900 * b2 + w * 0.1538520;
    b3 = 0.86650 * b3 + w * 0.3104856;
    b4 = 0.55000 * b4 + w * 0.5329522;
    b5 = -0.7616 * b5 - w * 0.0168980;
    pch[i] = (b0 + b1 + b2 + b3 + b4 + b5 + b6 + w * 0.5362) * 0.11;
    b6 = w * 0.115926;
  }

  // Brown noise (low-frequency rumble)
  const brown = ctx.createBuffer(1, length, sampleRate);
  const bch = brown.getChannelData(0);
  let last = 0;
  for (let i = 0; i < length; i++) {
    const w = Math.random() * 2 - 1;
    last = (last + 0.02 * w) / 1.02;
    bch[i] = last * 3.5;
  }

  cache = { white, pink, brown };
  noiseCache.set(ctx, cache);
  return cache;
}

function makeNoise(ctx, kind = 'pink', loop = false) {
  const src = ctx.createBufferSource();
  src.buffer = getNoiseBuffers(ctx)[kind];
  src.loop = loop;
  return src;
}

// Random helpers
const rand = (min, max) => min + Math.random() * (max - min);
const pick = (arr) => arr[Math.floor(Math.random() * arr.length)];

// Schedule a quick exponential decay envelope. start/peak/end are seconds.
function envelope(gainNode, startTime, attack, peak, decay, peakGain) {
  const g = gainNode.gain;
  g.setValueAtTime(0.0001, startTime);
  g.exponentialRampToValueAtTime(Math.max(peakGain, 0.0001), startTime + attack);
  g.exponentialRampToValueAtTime(Math.max(peakGain, 0.0001), startTime + attack + peak);
  g.exponentialRampToValueAtTime(0.0001, startTime + attack + peak + decay);
}

// =============================================================
// BIRDS
// =============================================================

export function birdChirp(ctx, dest, startTime, params = {}) {
  const pitchStart = params.pitchStart ?? rand(2200, 3400);
  const pitchEnd = params.pitchEnd ?? pitchStart * rand(0.7, 1.3);
  const dur = params.duration ?? rand(0.06, 0.12);
  const amp = (params.amp ?? rand(0.5, 0.85)) * (params.volume ?? 1);

  const osc = ctx.createOscillator();
  osc.type = 'sine';
  osc.frequency.setValueAtTime(pitchStart, startTime);
  osc.frequency.exponentialRampToValueAtTime(pitchEnd, startTime + dur);

  const g = ctx.createGain();
  envelope(g, startTime, 0.005, dur * 0.4, dur * 0.55, amp);

  // tiny bit of bandpass for body
  const bp = ctx.createBiquadFilter();
  bp.type = 'bandpass';
  bp.frequency.value = (pitchStart + pitchEnd) / 2;
  bp.Q.value = 4;

  osc.connect(bp).connect(g).connect(dest);
  osc.start(startTime);
  osc.stop(startTime + dur + 0.05);
}

export function birdTrill(ctx, dest, startTime, params = {}) {
  // Series of fast chirps (warble)
  const count = params.count ?? Math.floor(rand(3, 6));
  const baseFreq = params.baseFreq ?? rand(1800, 2800);
  const spacing = params.spacing ?? rand(0.04, 0.08);
  for (let i = 0; i < count; i++) {
    const t = startTime + i * spacing;
    birdChirp(ctx, dest, t, {
      pitchStart: baseFreq * rand(0.95, 1.15),
      pitchEnd: baseFreq * rand(0.85, 1.1),
      duration: rand(0.04, 0.08),
      amp: 0.5 * (params.volume ?? 1),
    });
  }
}

export function birdCall(ctx, dest, startTime, params = {}) {
  // Longer melodic call (robin-like): two-note phrase
  const baseFreq = params.baseFreq ?? rand(1400, 2400);
  birdChirp(ctx, dest, startTime, {
    pitchStart: baseFreq,
    pitchEnd: baseFreq * 1.4,
    duration: rand(0.12, 0.2),
    amp: 0.7 * (params.volume ?? 1),
  });
  birdChirp(ctx, dest, startTime + rand(0.18, 0.3), {
    pitchStart: baseFreq * 1.4,
    pitchEnd: baseFreq * 0.9,
    duration: rand(0.16, 0.24),
    amp: 0.6 * (params.volume ?? 1),
  });
}

export function owlHoot(ctx, dest, startTime, params = {}) {
  const freq = params.freq ?? rand(220, 320);
  const dur = params.duration ?? rand(0.5, 0.8);
  const amp = (params.amp ?? 0.5) * (params.volume ?? 1);

  const osc = ctx.createOscillator();
  osc.type = 'sine';
  osc.frequency.setValueAtTime(freq * 1.05, startTime);
  osc.frequency.linearRampToValueAtTime(freq, startTime + 0.15);

  // breath: filtered noise mixed in low
  const noise = makeNoise(ctx, 'pink');
  const noiseFilt = ctx.createBiquadFilter();
  noiseFilt.type = 'bandpass';
  noiseFilt.frequency.value = freq * 2;
  noiseFilt.Q.value = 2;
  const noiseGain = ctx.createGain();
  noiseGain.gain.setValueAtTime(0.0001, startTime);
  noiseGain.gain.exponentialRampToValueAtTime(amp * 0.15, startTime + 0.1);
  noiseGain.gain.exponentialRampToValueAtTime(0.0001, startTime + dur);

  noise.connect(noiseFilt).connect(noiseGain).connect(dest);
  noise.start(startTime);
  noise.stop(startTime + dur + 0.05);

  const g = ctx.createGain();
  envelope(g, startTime, 0.08, dur * 0.5, dur * 0.4, amp);
  osc.connect(g).connect(dest);
  osc.start(startTime);
  osc.stop(startTime + dur + 0.05);
}

// =============================================================
// WIND & LEAVES
// =============================================================

export function windGust(ctx, dest, startTime, params = {}) {
  // A gust = filtered pink noise that swells in and out over 2-5 seconds
  const dur = params.duration ?? rand(2.5, 4.5);
  const amp = (params.amp ?? rand(0.18, 0.32)) * (params.volume ?? 1);
  const cutoffPeak = params.cutoffPeak ?? rand(800, 1600);

  const noise = makeNoise(ctx, 'pink');
  const filt = ctx.createBiquadFilter();
  filt.type = 'bandpass';
  filt.Q.value = 0.8;
  filt.frequency.setValueAtTime(cutoffPeak * 0.5, startTime);
  filt.frequency.linearRampToValueAtTime(cutoffPeak, startTime + dur * 0.5);
  filt.frequency.linearRampToValueAtTime(cutoffPeak * 0.6, startTime + dur);

  const g = ctx.createGain();
  envelope(g, startTime, dur * 0.35, dur * 0.15, dur * 0.5, amp);

  noise.connect(filt).connect(g).connect(dest);
  noise.start(startTime);
  noise.stop(startTime + dur + 0.1);
}

export function leafRustle(ctx, dest, startTime, params = {}) {
  // Brief filtered noise burst, lots of shimmer
  const dur = params.duration ?? rand(0.15, 0.4);
  const amp = (params.amp ?? rand(0.2, 0.4)) * (params.volume ?? 1);

  const noise = makeNoise(ctx, 'white');
  const hp = ctx.createBiquadFilter();
  hp.type = 'highpass';
  hp.frequency.value = rand(2500, 4500);

  const bp = ctx.createBiquadFilter();
  bp.type = 'bandpass';
  bp.frequency.value = rand(3500, 6500);
  bp.Q.value = 1.5;

  const g = ctx.createGain();
  // shimmery flutter: sub-envelope
  g.gain.setValueAtTime(0.0001, startTime);
  const steps = 6;
  for (let i = 0; i < steps; i++) {
    const t = startTime + (i / steps) * dur;
    g.gain.linearRampToValueAtTime(amp * (0.4 + Math.random() * 0.6), t);
  }
  g.gain.exponentialRampToValueAtTime(0.0001, startTime + dur);

  noise.connect(hp).connect(bp).connect(g).connect(dest);
  noise.start(startTime);
  noise.stop(startTime + dur + 0.05);
}

export function footstepCrunch(ctx, dest, startTime, params = {}) {
  const amp = (params.amp ?? 0.45) * (params.volume ?? 1);
  const noise = makeNoise(ctx, 'white');
  const filt = ctx.createBiquadFilter();
  filt.type = 'bandpass';
  filt.frequency.value = rand(800, 1500);
  filt.Q.value = 1.2;

  const g = ctx.createGain();
  g.gain.setValueAtTime(0.0001, startTime);
  g.gain.exponentialRampToValueAtTime(amp, startTime + 0.005);
  g.gain.exponentialRampToValueAtTime(0.0001, startTime + 0.12);

  noise.connect(filt).connect(g).connect(dest);
  noise.start(startTime);
  noise.stop(startTime + 0.2);
}

// =============================================================
// WATER
// =============================================================

export function drip(ctx, dest, startTime, params = {}) {
  const pitchStart = params.pitchStart ?? rand(900, 1500);
  const pitchEnd = pitchStart * rand(0.4, 0.6);
  const dur = params.duration ?? 0.15;
  const amp = (params.amp ?? rand(0.4, 0.7)) * (params.volume ?? 1);

  const osc = ctx.createOscillator();
  osc.type = 'sine';
  osc.frequency.setValueAtTime(pitchStart, startTime);
  osc.frequency.exponentialRampToValueAtTime(pitchEnd, startTime + dur);

  const g = ctx.createGain();
  g.gain.setValueAtTime(0.0001, startTime);
  g.gain.exponentialRampToValueAtTime(amp, startTime + 0.005);
  g.gain.exponentialRampToValueAtTime(0.0001, startTime + dur);

  osc.connect(g).connect(dest);
  osc.start(startTime);
  osc.stop(startTime + dur + 0.05);
}

export function bubbleCluster(ctx, dest, startTime, params = {}) {
  const count = params.count ?? Math.floor(rand(3, 6));
  for (let i = 0; i < count; i++) {
    drip(ctx, dest, startTime + Math.random() * 0.4, {
      pitchStart: rand(700, 1400),
      duration: rand(0.08, 0.14),
      amp: rand(0.25, 0.5) * (params.volume ?? 1),
    });
  }
}

export function streamFlow(ctx, dest, startTime, params = {}) {
  // Sustained band-passed noise, gentle modulation
  const dur = params.duration ?? rand(4, 8);
  const amp = (params.amp ?? rand(0.18, 0.28)) * (params.volume ?? 1);

  const noise = makeNoise(ctx, 'pink');
  const filt = ctx.createBiquadFilter();
  filt.type = 'bandpass';
  filt.frequency.value = rand(800, 1400);
  filt.Q.value = 0.7;

  // Slow LFO on the filter for life
  const lfo = ctx.createOscillator();
  lfo.frequency.value = rand(0.2, 0.5);
  const lfoGain = ctx.createGain();
  lfoGain.gain.value = 200;
  lfo.connect(lfoGain).connect(filt.frequency);

  const g = ctx.createGain();
  envelope(g, startTime, 0.5, dur * 0.7, 0.8, amp);

  noise.connect(filt).connect(g).connect(dest);
  noise.start(startTime);
  noise.stop(startTime + dur + 0.1);
  lfo.start(startTime);
  lfo.stop(startTime + dur + 0.1);

  // Sprinkle a few drips through it
  const drips = Math.floor(rand(2, 6));
  for (let i = 0; i < drips; i++) {
    drip(ctx, dest, startTime + 0.5 + Math.random() * (dur - 1), {
      pitchStart: rand(800, 1500),
      duration: rand(0.08, 0.14),
      amp: 0.3 * (params.volume ?? 1),
    });
  }
}

// =============================================================
// INSECTS
// =============================================================

export function cricket(ctx, dest, startTime, params = {}) {
  // Series of rapid high-frequency bursts (the chirp trill)
  const burstCount = params.bursts ?? Math.floor(rand(3, 7));
  const baseFreq = params.freq ?? rand(4200, 5400);
  const trillRate = rand(28, 40); // bursts per second within a chirp
  const chirpDur = burstCount / trillRate;
  const amp = (params.amp ?? 0.35) * (params.volume ?? 1);

  for (let i = 0; i < burstCount; i++) {
    const t = startTime + i / trillRate;
    const osc = ctx.createOscillator();
    osc.type = 'triangle';
    osc.frequency.value = baseFreq * (0.97 + Math.random() * 0.06);
    const g = ctx.createGain();
    g.gain.setValueAtTime(0.0001, t);
    g.gain.exponentialRampToValueAtTime(amp, t + 0.002);
    g.gain.exponentialRampToValueAtTime(0.0001, t + 0.012);
    osc.connect(g).connect(dest);
    osc.start(t);
    osc.stop(t + 0.02);
  }
  return chirpDur;
}

export function cicadaBuzz(ctx, dest, startTime, params = {}) {
  const dur = params.duration ?? rand(2, 4);
  const amp = (params.amp ?? 0.15) * (params.volume ?? 1);

  const noise = makeNoise(ctx, 'white');
  const bp = ctx.createBiquadFilter();
  bp.type = 'bandpass';
  bp.frequency.value = rand(2800, 3800);
  bp.Q.value = 4;

  // Fast tremolo gives the ratchet
  const trem = ctx.createOscillator();
  trem.frequency.value = rand(35, 55);
  const tremGain = ctx.createGain();
  tremGain.gain.value = amp * 0.5;

  const g = ctx.createGain();
  g.gain.setValueAtTime(0.0001, startTime);
  g.gain.exponentialRampToValueAtTime(amp * 0.5, startTime + 0.5);
  g.gain.exponentialRampToValueAtTime(amp * 0.5, startTime + dur - 0.5);
  g.gain.exponentialRampToValueAtTime(0.0001, startTime + dur);

  trem.connect(tremGain).connect(g.gain);
  noise.connect(bp).connect(g).connect(dest);
  noise.start(startTime);
  noise.stop(startTime + dur + 0.1);
  trem.start(startTime);
  trem.stop(startTime + dur + 0.1);
}

// =============================================================
// AMPHIBIANS
// =============================================================

export function frogCroak(ctx, dest, startTime, params = {}) {
  const baseFreq = params.freq ?? rand(180, 260);
  const dur = params.duration ?? rand(0.25, 0.45);
  const amp = (params.amp ?? 0.6) * (params.volume ?? 1);
  const pulseRate = rand(35, 55);

  const osc = ctx.createOscillator();
  osc.type = 'sawtooth';
  osc.frequency.setValueAtTime(baseFreq, startTime);
  osc.frequency.linearRampToValueAtTime(baseFreq * 0.85, startTime + dur);

  const lp = ctx.createBiquadFilter();
  lp.type = 'lowpass';
  lp.frequency.value = baseFreq * 5;

  // Pulse train via fast tremolo
  const trem = ctx.createOscillator();
  trem.type = 'square';
  trem.frequency.value = pulseRate;
  const tremGain = ctx.createGain();
  tremGain.gain.value = amp * 0.7;

  const g = ctx.createGain();
  g.gain.setValueAtTime(0.0001, startTime);
  g.gain.exponentialRampToValueAtTime(amp, startTime + 0.02);
  g.gain.exponentialRampToValueAtTime(0.0001, startTime + dur);

  trem.connect(tremGain).connect(g.gain);
  osc.connect(lp).connect(g).connect(dest);
  osc.start(startTime);
  osc.stop(startTime + dur + 0.05);
  trem.start(startTime);
  trem.stop(startTime + dur + 0.05);
}

export function bullfrog(ctx, dest, startTime, params = {}) {
  // Deeper, slower croak
  frogCroak(ctx, dest, startTime, {
    freq: rand(90, 130),
    duration: rand(0.6, 1.0),
    amp: 0.7 * (params.volume ?? 1),
  });
}

// =============================================================
// ATMOSPHERE
// =============================================================

export function thunderRumble(ctx, dest, startTime, params = {}) {
  const dur = params.duration ?? rand(3, 6);
  const amp = (params.amp ?? 0.4) * (params.volume ?? 1);

  const noise = makeNoise(ctx, 'brown');
  const lp = ctx.createBiquadFilter();
  lp.type = 'lowpass';
  lp.frequency.setValueAtTime(180, startTime);
  lp.frequency.linearRampToValueAtTime(120, startTime + dur);

  // Slow rumble modulation
  const lfo = ctx.createOscillator();
  lfo.frequency.value = rand(2, 5);
  const lfoGain = ctx.createGain();
  lfoGain.gain.value = amp * 0.3;

  const g = ctx.createGain();
  g.gain.setValueAtTime(0.0001, startTime);
  g.gain.exponentialRampToValueAtTime(amp, startTime + dur * 0.3);
  g.gain.exponentialRampToValueAtTime(amp * 0.5, startTime + dur * 0.7);
  g.gain.exponentialRampToValueAtTime(0.0001, startTime + dur);

  lfo.connect(lfoGain).connect(g.gain);
  noise.connect(lp).connect(g).connect(dest);
  noise.start(startTime);
  noise.stop(startTime + dur + 0.1);
  lfo.start(startTime);
  lfo.stop(startTime + dur + 0.1);
}

// =============================================================
// GROUND CREATURES
// =============================================================

export function squirrelChitter(ctx, dest, startTime, params = {}) {
  const count = params.count ?? Math.floor(rand(4, 9));
  const baseFreq = rand(2200, 3000);
  const spacing = rand(0.045, 0.08);
  for (let i = 0; i < count; i++) {
    const t = startTime + i * spacing;
    const osc = ctx.createOscillator();
    osc.type = 'square';
    osc.frequency.value = baseFreq * (0.85 + Math.random() * 0.3);
    const g = ctx.createGain();
    const amp = 0.18 * (params.volume ?? 1);
    g.gain.setValueAtTime(0.0001, t);
    g.gain.exponentialRampToValueAtTime(amp, t + 0.003);
    g.gain.exponentialRampToValueAtTime(0.0001, t + 0.025);
    osc.connect(g).connect(dest);
    osc.start(t);
    osc.stop(t + 0.04);
  }
}

export function distantHowl(ctx, dest, startTime, params = {}) {
  const dur = params.duration ?? rand(1.4, 2.0);
  const baseFreq = rand(380, 550);
  const amp = 0.18 * (params.volume ?? 1);

  const osc = ctx.createOscillator();
  osc.type = 'sawtooth';
  osc.frequency.setValueAtTime(baseFreq * 0.9, startTime);
  osc.frequency.linearRampToValueAtTime(baseFreq * 1.2, startTime + dur * 0.4);
  osc.frequency.linearRampToValueAtTime(baseFreq * 0.95, startTime + dur);

  const formant = ctx.createBiquadFilter();
  formant.type = 'bandpass';
  formant.frequency.value = baseFreq * 2.5;
  formant.Q.value = 6;

  const g = ctx.createGain();
  envelope(g, startTime, dur * 0.25, dur * 0.4, dur * 0.35, amp);

  osc.connect(formant).connect(g).connect(dest);
  osc.start(startTime);
  osc.stop(startTime + dur + 0.05);
}

export function distantBark(ctx, dest, startTime, params = {}) {
  const baseFreq = rand(280, 420);
  const amp = 0.25 * (params.volume ?? 1);
  // Two-three quick yips
  const count = Math.floor(rand(2, 4));
  for (let i = 0; i < count; i++) {
    const t = startTime + i * rand(0.18, 0.3);
    const osc = ctx.createOscillator();
    osc.type = 'sawtooth';
    osc.frequency.setValueAtTime(baseFreq, t);
    osc.frequency.exponentialRampToValueAtTime(baseFreq * 0.6, t + 0.08);
    const lp = ctx.createBiquadFilter();
    lp.type = 'lowpass';
    lp.frequency.value = 2200;
    const g = ctx.createGain();
    g.gain.setValueAtTime(0.0001, t);
    g.gain.exponentialRampToValueAtTime(amp, t + 0.005);
    g.gain.exponentialRampToValueAtTime(0.0001, t + 0.1);
    osc.connect(lp).connect(g).connect(dest);
    osc.start(t);
    osc.stop(t + 0.15);
  }
}

// Map for cell schedulers
export const SYNTH = {
  birdChirp,
  birdTrill,
  birdCall,
  owlHoot,
  windGust,
  leafRustle,
  footstepCrunch,
  drip,
  bubbleCluster,
  streamFlow,
  cricket,
  cicadaBuzz,
  frogCroak,
  bullfrog,
  thunderRumble,
  squirrelChitter,
  distantHowl,
  distantBark,
};
