// Soundscapes — Forest at Dawn scene.
// Defines the performer roster, sample manifest, and cell library for
// this scene. Loaded by scenes/index.js based on the active scene id.

import { oneShot, ambientBed } from '../sample-engine.js';

const rnd = (a, b) => a + Math.random() * (b - a);
const pick = (arr) => arr[Math.floor(Math.random() * arr.length)];

// ---- Sample manifest ----
const SAMPLES = {
  'awakening-birds':   { url: 'samples/forest-dawn/awakening-birds.mp3' },
  'evening-birds':     { url: 'samples/forest-dawn/evening-birds.mp3' },
  'robin':             { url: 'samples/forest-dawn/robin.mp3' },
  'common-blackbird':  { url: 'samples/forest-dawn/common-blackbird.mp3' },
  'wind':              { url: 'samples/forest-dawn/wind.mp3' },
  'wind-in-trees':     { url: 'samples/forest-dawn/wind-in-trees.mp3' },
  'wind-tree-squeaks': { url: 'samples/forest-dawn/wind-tree-squeaks.mp3' },
  'small-stream':      { url: 'samples/forest-dawn/small-stream.mp3' },
  'small-cascade':     { url: 'samples/forest-dawn/small-cascade.mp3' },
  'brooklet':          { url: 'samples/forest-dawn/brooklet.mp3' },
  'field-cricket':     { url: 'samples/forest-dawn/field-cricket.mp3' },
  'nocturnal-insect':  { url: 'samples/forest-dawn/nocturnal-insect.mp3' },
  'nocturnal-insects': { url: 'samples/forest-dawn/nocturnal-insects.mp3' },
  'frogs-1':           { url: 'samples/forest-dawn/frogs-1.mp3' },
  'frogs-2':           { url: 'samples/forest-dawn/frogs-2.mp3' },
  'one-frog':          { url: 'samples/forest-dawn/one-frog.mp3' },
  'feet-in-leaves':    { url: 'samples/forest-dawn/feet-in-leaves.mp3' },
  'feet-in-leaves-2':  { url: 'samples/forest-dawn/feet-in-leaves-2.mp3' },
  'thunder':           { url: 'samples/forest-dawn/thunder.mp3' },
  'tawny-owl':         { url: 'samples/forest-dawn/tawny-owl.mp3' },
  'long-eared-owl':    { url: 'samples/forest-dawn/long-eared-owl.mp3' },
};

// ---- Performer roster ----
const PERFORMERS = [
  { id: 0, key: '1', name: 'Birds',      color: '#f4d35e', categoryId: 'birds' },
  { id: 1, key: '2', name: 'Wind',       color: '#a4c2c6', categoryId: 'wind' },
  { id: 2, key: '3', name: 'Water',      color: '#5da9e9', categoryId: 'water' },
  { id: 3, key: '4', name: 'Insects',    color: '#c1d36b', categoryId: 'insects' },
  { id: 4, key: '5', name: 'Amphibians', color: '#8b9d4e', categoryId: 'amphibians' },
  { id: 5, key: '6', name: 'Leaves',     color: '#b08968', categoryId: 'leaves' },
  { id: 6, key: '7', name: 'Atmosphere', color: '#7a708a', categoryId: 'atmosphere' },
];

// ---- Cells per category ----

const birdsCells = [
  { id: 'birds-0', label: 'silent', duration: 6, schedule: () => {} },
  {
    id: 'birds-1', label: 'distant chirp', duration: 9,
    schedule: (ctx, dest, t0, vol) => {
      const id = pick(['robin', 'common-blackbird']);
      oneShot(ctx, dest, id, t0 + rnd(2, 6), { gain: rnd(0.18, 0.32) * vol, pitchSpread: 0.1, panSpread: 0.7 });
    },
  },
  {
    id: 'birds-2', label: 'two voices', duration: 9,
    schedule: (ctx, dest, t0, vol) => {
      oneShot(ctx, dest, 'robin', t0 + rnd(0, 4), { gain: rnd(0.32, 0.5) * vol, pitchSpread: 0.12 });
      oneShot(ctx, dest, 'common-blackbird', t0 + rnd(3, 8), { gain: rnd(0.32, 0.5) * vol, pitchSpread: 0.1 });
      ambientBed(ctx, dest, 'evening-birds', t0, 9, { gain: 0.18 * vol, fadeIn: 0.8, fadeOut: 0.8 });
    },
  },
  {
    id: 'birds-3', label: 'overlapping calls', duration: 9,
    schedule: (ctx, dest, t0, vol) => {
      ambientBed(ctx, dest, 'evening-birds', t0, 9, { gain: 0.32 * vol, fadeIn: 0.6, fadeOut: 0.6 });
      const calls = ['robin', 'common-blackbird'];
      for (let i = 0; i < 4; i++) {
        oneShot(ctx, dest, pick(calls), t0 + rnd(0, 8), { gain: rnd(0.35, 0.55) * vol, pitchSpread: 0.18 });
      }
    },
  },
  {
    id: 'birds-4', label: 'dawn chorus', duration: 9,
    schedule: (ctx, dest, t0, vol) => {
      ambientBed(ctx, dest, 'awakening-birds', t0, 9, { gain: 0.55 * vol, fadeIn: 0.5, fadeOut: 0.5, pitchSpread: 0.06 });
      ambientBed(ctx, dest, 'evening-birds', t0 + 0.5, 8, { gain: 0.28 * vol, fadeIn: 0.6, fadeOut: 0.6, pitchSpread: 0.08, pan: rnd(-0.5, 0.5) });
      const calls = ['robin', 'common-blackbird'];
      for (let i = 0; i < 5; i++) {
        oneShot(ctx, dest, pick(calls), t0 + rnd(0, 8), { gain: rnd(0.4, 0.6) * vol, pitchSpread: 0.2 });
      }
    },
  },
];

const windCells = [
  { id: 'wind-0', label: 'silent', duration: 6, schedule: () => {} },
  {
    id: 'wind-1', label: 'faint rustle', duration: 10,
    schedule: (ctx, dest, t0, vol) => {
      ambientBed(ctx, dest, 'wind-tree-squeaks', t0, 10, { gain: 0.18 * vol, fadeIn: 1.5, fadeOut: 1.5, pitchSpread: 0.04 });
    },
  },
  {
    id: 'wind-2', label: 'breeze', duration: 10,
    schedule: (ctx, dest, t0, vol) => {
      ambientBed(ctx, dest, 'wind', t0, 10, { gain: 0.32 * vol, fadeIn: 1.0, fadeOut: 1.0, pitchSpread: 0.05 });
    },
  },
  {
    id: 'wind-3', label: 'wind in trees', duration: 10,
    schedule: (ctx, dest, t0, vol) => {
      ambientBed(ctx, dest, 'wind-in-trees', t0, 10, { gain: 0.45 * vol, fadeIn: 0.8, fadeOut: 0.8, pitchSpread: 0.04 });
      ambientBed(ctx, dest, 'wind-tree-squeaks', t0 + 1, 8, { gain: 0.2 * vol, fadeIn: 1.0, fadeOut: 1.0, pan: rnd(-0.6, 0.6) });
    },
  },
  {
    id: 'wind-4', label: 'gusts in the canopy', duration: 10,
    schedule: (ctx, dest, t0, vol) => {
      ambientBed(ctx, dest, 'wind-in-trees', t0, 10, { gain: 0.6 * vol, fadeIn: 0.4, fadeOut: 0.6, pitchSpread: 0.06 });
      ambientBed(ctx, dest, 'wind', t0 + rnd(0.5, 2), 8, { gain: 0.4 * vol, fadeIn: 0.5, fadeOut: 0.5, pan: rnd(-0.6, 0.6) });
    },
  },
];

const waterCells = [
  { id: 'water-0', label: 'silent', duration: 6, schedule: () => {} },
  {
    id: 'water-1', label: 'distant trickle', duration: 10,
    schedule: (ctx, dest, t0, vol) => {
      ambientBed(ctx, dest, 'brooklet', t0, 10, { gain: 0.2 * vol, fadeIn: 1.5, fadeOut: 1.5, pitchSpread: 0.03 });
    },
  },
  {
    id: 'water-2', label: 'small stream', duration: 10,
    schedule: (ctx, dest, t0, vol) => {
      ambientBed(ctx, dest, 'small-stream', t0, 10, { gain: 0.32 * vol, fadeIn: 1.0, fadeOut: 1.0, pitchSpread: 0.03 });
    },
  },
  {
    id: 'water-3', label: 'brook', duration: 10,
    schedule: (ctx, dest, t0, vol) => {
      ambientBed(ctx, dest, 'small-stream', t0, 10, { gain: 0.42 * vol, fadeIn: 0.8, fadeOut: 0.8 });
      ambientBed(ctx, dest, 'brooklet', t0 + 0.5, 9, { gain: 0.25 * vol, fadeIn: 1.0, fadeOut: 1.0, pan: rnd(-0.5, 0.5) });
    },
  },
  {
    id: 'water-4', label: 'cascade', duration: 10,
    schedule: (ctx, dest, t0, vol) => {
      ambientBed(ctx, dest, 'small-cascade', t0, 10, { gain: 0.52 * vol, fadeIn: 0.6, fadeOut: 0.6 });
      ambientBed(ctx, dest, 'small-stream', t0 + 1, 8, { gain: 0.3 * vol, fadeIn: 0.8, fadeOut: 0.8, pan: rnd(-0.5, 0.5) });
    },
  },
];

const insectsCells = [
  { id: 'insects-0', label: 'silent', duration: 6, schedule: () => {} },
  {
    id: 'insects-1', label: 'lone cricket', duration: 10,
    schedule: (ctx, dest, t0, vol) => {
      const count = Math.floor(rnd(1, 3));
      for (let i = 0; i < count; i++) {
        oneShot(ctx, dest, 'nocturnal-insect', t0 + rnd(0, 8), { gain: rnd(0.32, 0.5) * vol, pitchSpread: 0.1 });
      }
    },
  },
  {
    id: 'insects-2', label: 'several crickets', duration: 10,
    schedule: (ctx, dest, t0, vol) => {
      ambientBed(ctx, dest, 'field-cricket', t0, 10, { gain: 0.28 * vol, fadeIn: 1.0, fadeOut: 1.0, pitchSpread: 0.05 });
      for (let i = 0; i < 3; i++) {
        oneShot(ctx, dest, 'nocturnal-insect', t0 + rnd(0, 8), { gain: rnd(0.25, 0.4) * vol, pitchSpread: 0.12 });
      }
    },
  },
  {
    id: 'insects-3', label: 'cricket chorus', duration: 10,
    schedule: (ctx, dest, t0, vol) => {
      ambientBed(ctx, dest, 'nocturnal-insects', t0, 10, { gain: 0.4 * vol, fadeIn: 0.8, fadeOut: 0.8 });
      ambientBed(ctx, dest, 'field-cricket', t0 + 0.5, 9, { gain: 0.22 * vol, fadeIn: 1.0, fadeOut: 1.0, pan: rnd(-0.5, 0.5) });
    },
  },
  {
    id: 'insects-4', label: 'full chorus', duration: 10,
    schedule: (ctx, dest, t0, vol) => {
      ambientBed(ctx, dest, 'nocturnal-insects', t0, 10, { gain: 0.55 * vol, fadeIn: 0.5, fadeOut: 0.6 });
      ambientBed(ctx, dest, 'field-cricket', t0 + 0.3, 9, { gain: 0.35 * vol, fadeIn: 0.7, fadeOut: 0.7, pan: rnd(-0.6, 0.6), pitchSpread: 0.05 });
    },
  },
];

const amphibiansCells = [
  { id: 'amph-0', label: 'silent', duration: 6, schedule: () => {} },
  {
    id: 'amph-1', label: 'distant croak', duration: 10,
    schedule: (ctx, dest, t0, vol) => {
      oneShot(ctx, dest, 'one-frog', t0 + rnd(2, 7), { gain: rnd(0.28, 0.45) * vol, pitchSpread: 0.08 });
    },
  },
  {
    id: 'amph-2', label: 'trading frogs', duration: 10,
    schedule: (ctx, dest, t0, vol) => {
      for (let i = 0; i < 3; i++) {
        oneShot(ctx, dest, 'one-frog', t0 + rnd(0, 9), { gain: rnd(0.32, 0.5) * vol, pitchSpread: 0.15, panSpread: 0.7 });
      }
      ambientBed(ctx, dest, 'frogs-1', t0, 10, { gain: 0.18 * vol, fadeIn: 1.5, fadeOut: 1.5 });
    },
  },
  {
    id: 'amph-3', label: 'pond chorus', duration: 10,
    schedule: (ctx, dest, t0, vol) => {
      ambientBed(ctx, dest, 'frogs-1', t0, 10, { gain: 0.4 * vol, fadeIn: 0.8, fadeOut: 0.8 });
      for (let i = 0; i < 2; i++) {
        oneShot(ctx, dest, 'one-frog', t0 + rnd(0, 9), { gain: rnd(0.3, 0.45) * vol, pitchSpread: 0.12 });
      }
    },
  },
  {
    id: 'amph-4', label: 'peak chorus', duration: 10,
    schedule: (ctx, dest, t0, vol) => {
      ambientBed(ctx, dest, 'frogs-2', t0, 10, { gain: 0.5 * vol, fadeIn: 0.5, fadeOut: 0.6 });
      ambientBed(ctx, dest, 'frogs-1', t0 + 0.5, 9, { gain: 0.32 * vol, fadeIn: 0.8, fadeOut: 0.8, pan: rnd(-0.5, 0.5), pitchSpread: 0.05 });
    },
  },
];

const leavesCells = [
  { id: 'leaves-0', label: 'silent', duration: 6, schedule: () => {} },
  {
    id: 'leaves-1', label: 'footstep', duration: 10,
    schedule: (ctx, dest, t0, vol) => {
      oneShot(ctx, dest, 'feet-in-leaves', t0 + rnd(2, 6), {
        gain: rnd(0.3, 0.45) * vol, duration: rnd(1.2, 2.0), offset: rnd(0, 4),
        pitchSpread: 0.08, fadeIn: 0.05, fadeOut: 0.4,
      });
    },
  },
  {
    id: 'leaves-2', label: 'someone walking', duration: 10,
    schedule: (ctx, dest, t0, vol) => {
      oneShot(ctx, dest, 'feet-in-leaves', t0 + rnd(1, 3), {
        gain: rnd(0.42, 0.58) * vol, duration: rnd(3.5, 5), offset: rnd(0, 4),
        pitchSpread: 0.06, fadeIn: 0.2, fadeOut: 0.5,
      });
    },
  },
  {
    id: 'leaves-3', label: 'movement nearby', duration: 10,
    schedule: (ctx, dest, t0, vol) => {
      oneShot(ctx, dest, 'feet-in-leaves', t0 + rnd(0, 2), {
        gain: rnd(0.4, 0.55) * vol, duration: rnd(4, 6), offset: rnd(0, 4),
        pan: rnd(-0.7, -0.2), pitchSpread: 0.06, fadeIn: 0.2, fadeOut: 0.6,
      });
      oneShot(ctx, dest, 'feet-in-leaves-2', t0 + rnd(2, 4), {
        gain: rnd(0.35, 0.5) * vol, duration: rnd(3, 5), offset: rnd(0, 4),
        pan: rnd(0.2, 0.7), pitchSpread: 0.07, fadeIn: 0.2, fadeOut: 0.6,
      });
    },
  },
  {
    id: 'leaves-4', label: 'something moves', duration: 10,
    schedule: (ctx, dest, t0, vol) => {
      ambientBed(ctx, dest, 'feet-in-leaves', t0, 10, { gain: 0.45 * vol, fadeIn: 0.4, fadeOut: 0.6, pan: rnd(-0.5, 0) });
      ambientBed(ctx, dest, 'feet-in-leaves-2', t0 + 0.3, 9, { gain: 0.4 * vol, fadeIn: 0.5, fadeOut: 0.6, pan: rnd(0, 0.5), pitchSpread: 0.06 });
    },
  },
];

const atmosphereCells = [
  { id: 'atm-0', label: 'silent', duration: 8, schedule: () => {} },
  {
    id: 'atm-1', label: 'distant rumble', duration: 12,
    schedule: (ctx, dest, t0, vol) => {
      if (Math.random() < 0.7) {
        oneShot(ctx, dest, 'thunder', t0 + rnd(0, 4), {
          gain: rnd(0.25, 0.4) * vol, pitch: rnd(0.85, 0.95), pitchSpread: 0,
          fadeIn: 0.3, fadeOut: 1.2,
        });
      }
    },
  },
  {
    id: 'atm-2', label: 'owl hoot', duration: 12,
    schedule: (ctx, dest, t0, vol) => {
      const id = pick(['tawny-owl', 'long-eared-owl']);
      oneShot(ctx, dest, id, t0 + rnd(2, 7), { gain: rnd(0.4, 0.55) * vol, pitchSpread: 0.06, panSpread: 0.5 });
      if (Math.random() < 0.4) {
        oneShot(ctx, dest, 'thunder', t0 + rnd(0, 5), {
          gain: rnd(0.2, 0.3) * vol, pitch: rnd(0.85, 0.95), fadeIn: 0.4, fadeOut: 1.2,
        });
      }
    },
  },
  {
    id: 'atm-3', label: 'thunder + owl', duration: 12,
    schedule: (ctx, dest, t0, vol) => {
      oneShot(ctx, dest, 'thunder', t0 + rnd(0, 3), {
        gain: rnd(0.4, 0.55) * vol, pitch: rnd(0.9, 1.0), fadeIn: 0.2, fadeOut: 1.5,
      });
      const owlId = pick(['tawny-owl', 'long-eared-owl']);
      oneShot(ctx, dest, owlId, t0 + rnd(4, 9), { gain: rnd(0.45, 0.6) * vol, pitchSpread: 0.08 });
      if (Math.random() < 0.5) {
        const owl2 = pick(['tawny-owl', 'long-eared-owl']);
        oneShot(ctx, dest, owl2, t0 + rnd(7, 11), { gain: rnd(0.4, 0.55) * vol, pitchSpread: 0.1, panSpread: 0.7 });
      }
    },
  },
  {
    id: 'atm-4', label: 'storm closer', duration: 12,
    schedule: (ctx, dest, t0, vol) => {
      oneShot(ctx, dest, 'thunder', t0 + rnd(0, 1), {
        gain: rnd(0.55, 0.75) * vol, pitch: rnd(0.95, 1.05), fadeIn: 0.1, fadeOut: 1.5,
      });
      oneShot(ctx, dest, 'thunder', t0 + rnd(5, 8), {
        gain: rnd(0.5, 0.7) * vol, pitch: rnd(0.9, 1.0), fadeIn: 0.15, fadeOut: 1.3, pan: rnd(-0.5, 0.5),
      });
      oneShot(ctx, dest, 'tawny-owl', t0 + rnd(2, 5), { gain: rnd(0.45, 0.6) * vol, pitchSpread: 0.08 });
      oneShot(ctx, dest, 'long-eared-owl', t0 + rnd(6, 10), { gain: rnd(0.4, 0.55) * vol, pitchSpread: 0.1 });
    },
  },
];

// ---- Background visualization ----

function initBackground(state, dpr) {
  state.stars = [];
  for (let i = 0; i < 80; i++) {
    state.stars.push({
      x: Math.random(),
      y: Math.random() * 0.55,
      b: 0.3 + Math.random() * 0.7,
      twinkle: Math.random() * Math.PI * 2,
    });
  }
}

function drawBackground(ctx, w, h, dawn, time, state, dpr) {
  // Sky gradient — color shifts from night to dawn with density
  const top = `rgb(${Math.floor(10 + dawn * 60)}, ${Math.floor(20 + dawn * 50)}, ${Math.floor(30 + dawn * 40)})`;
  const bottom = `rgb(${Math.floor(20 + dawn * 200)}, ${Math.floor(36 + dawn * 130)}, ${Math.floor(60 + dawn * 80)})`;
  const grad = ctx.createLinearGradient(0, 0, 0, h * 0.7);
  grad.addColorStop(0, top);
  grad.addColorStop(1, bottom);
  ctx.fillStyle = grad;
  ctx.fillRect(0, 0, w, h * 0.7);

  // Stars (fade as dawn approaches)
  const visibility = 1 - Math.min(1, dawn * 1.6);
  if (visibility > 0.02) {
    for (const s of state.stars) {
      const tw = 0.5 + 0.5 * Math.sin(time * 2 + s.twinkle);
      const alpha = visibility * s.b * (0.4 + 0.6 * tw);
      ctx.fillStyle = `rgba(232, 239, 229, ${alpha})`;
      ctx.fillRect(s.x * w, s.y * h * 0.7, 1.5 * dpr, 1.5 * dpr);
    }
  }

  // Sun rises with density
  if (dawn > 0.05) {
    const cx = w * 0.7;
    const baseY = h * 0.7;
    const y = baseY - dawn * h * 0.25;
    const r = (8 + dawn * 28) * dpr;
    const sg = ctx.createRadialGradient(cx, y, 0, cx, y, r * 3);
    sg.addColorStop(0, `rgba(255, 220, 160, ${0.9 * dawn})`);
    sg.addColorStop(0.4, `rgba(255, 180, 110, ${0.4 * dawn})`);
    sg.addColorStop(1, `rgba(255, 180, 110, 0)`);
    ctx.fillStyle = sg;
    ctx.beginPath();
    ctx.arc(cx, y, r * 3, 0, Math.PI * 2);
    ctx.fill();
    ctx.fillStyle = `rgba(255, 235, 200, ${0.95 * dawn})`;
    ctx.beginPath();
    ctx.arc(cx, y, r, 0, Math.PI * 2);
    ctx.fill();
  }

  // Distant tree silhouette
  const horizonY = h * 0.7;
  ctx.fillStyle = `rgba(${10 + dawn * 30}, ${22 + dawn * 35}, ${20 + dawn * 28}, 1)`;
  ctx.beginPath();
  ctx.moveTo(0, horizonY);
  for (let i = 0; i <= 30; i++) {
    const x = (i / 30) * w;
    const peak = horizonY - (10 + Math.sin(i * 1.6) * 6 + Math.sin(i * 0.7) * 8) * dpr;
    ctx.lineTo(x, peak);
  }
  ctx.lineTo(w, horizonY);
  ctx.closePath();
  ctx.fill();

  // Closer trees
  ctx.fillStyle = `rgba(${5 + dawn * 14}, ${15 + dawn * 18}, ${12 + dawn * 14}, 1)`;
  ctx.beginPath();
  ctx.moveTo(0, h);
  ctx.lineTo(0, horizonY + 12 * dpr);
  for (let i = 0; i <= 18; i++) {
    const x = (i / 18) * w;
    const peak = horizonY + (8 + Math.cos(i * 1.1) * 18 + Math.sin(i * 2.3) * 14) * dpr;
    ctx.lineTo(x, peak);
  }
  ctx.lineTo(w, h);
  ctx.closePath();
  ctx.fill();
}

export const SCENE = {
  id: 'forest-dawn',
  label: 'Forest at Dawn',
  performers: PERFORMERS,
  samples: SAMPLES,
  cellsByCategory: {
    birds: birdsCells,
    wind: windCells,
    water: waterCells,
    insects: insectsCells,
    amphibians: amphibiansCells,
    leaves: leavesCells,
    atmosphere: atmosphereCells,
  },
  initBackground,
  drawBackground,
};
