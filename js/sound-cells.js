// Soundscapes — sample-based cell definitions per performer.
//
// Each cell schedule fn receives (ctx, dest, t0, vol) and arranges a set
// of sample playbacks across one loop period. Random start offsets,
// pitches, pans, and gains inside each scheduling call ensure no two
// loops sound identical.

import { oneShot, ambientBed } from './sample-engine.js';

const rnd = (a, b) => a + Math.random() * (b - a);
const pick = (arr) => arr[Math.floor(Math.random() * arr.length)];

// =============================================================
// BIRDS
// =============================================================

const birdsCells = [
  { id: 'birds-0', label: 'silent', duration: 6, schedule: () => {} },
  {
    id: 'birds-1',
    label: 'distant chirp',
    duration: 9,
    schedule: (ctx, dest, t0, vol) => {
      // Sparse: a single one-shot from one of the short bird files
      const id = pick(['robin', 'common-blackbird']);
      oneShot(ctx, dest, id, t0 + rnd(2, 6), {
        gain: rnd(0.18, 0.32) * vol,
        pitchSpread: 0.1,
        panSpread: 0.7,
      });
    },
  },
  {
    id: 'birds-2',
    label: 'two voices',
    duration: 9,
    schedule: (ctx, dest, t0, vol) => {
      // Two distinct calls + faint evening-bird ambience
      oneShot(ctx, dest, 'robin', t0 + rnd(0, 4), {
        gain: rnd(0.32, 0.5) * vol,
        pitchSpread: 0.12,
      });
      oneShot(ctx, dest, 'common-blackbird', t0 + rnd(3, 8), {
        gain: rnd(0.32, 0.5) * vol,
        pitchSpread: 0.1,
      });
      ambientBed(ctx, dest, 'evening-birds', t0, 9, {
        gain: 0.18 * vol,
        fadeIn: 0.8,
        fadeOut: 0.8,
      });
    },
  },
  {
    id: 'birds-3',
    label: 'overlapping calls',
    duration: 9,
    schedule: (ctx, dest, t0, vol) => {
      ambientBed(ctx, dest, 'evening-birds', t0, 9, {
        gain: 0.32 * vol,
        fadeIn: 0.6,
        fadeOut: 0.6,
      });
      // 3-4 punctuating calls
      const calls = ['robin', 'common-blackbird'];
      for (let i = 0; i < 4; i++) {
        oneShot(ctx, dest, pick(calls), t0 + rnd(0, 8), {
          gain: rnd(0.35, 0.55) * vol,
          pitchSpread: 0.18,
        });
      }
    },
  },
  {
    id: 'birds-4',
    label: 'dawn chorus',
    duration: 9,
    schedule: (ctx, dest, t0, vol) => {
      // Full awakening-birds bed plus extra calls
      ambientBed(ctx, dest, 'awakening-birds', t0, 9, {
        gain: 0.55 * vol,
        fadeIn: 0.5,
        fadeOut: 0.5,
        pitchSpread: 0.06,
      });
      // Layered second copy at slightly different pitch for thickness
      ambientBed(ctx, dest, 'evening-birds', t0 + 0.5, 8, {
        gain: 0.28 * vol,
        fadeIn: 0.6,
        fadeOut: 0.6,
        pitchSpread: 0.08,
        pan: rnd(-0.5, 0.5),
      });
      // A few foreground calls
      const calls = ['robin', 'common-blackbird'];
      for (let i = 0; i < 5; i++) {
        oneShot(ctx, dest, pick(calls), t0 + rnd(0, 8), {
          gain: rnd(0.4, 0.6) * vol,
          pitchSpread: 0.2,
        });
      }
    },
  },
];

// =============================================================
// WIND
// =============================================================

const windCells = [
  { id: 'wind-0', label: 'silent', duration: 6, schedule: () => {} },
  {
    id: 'wind-1',
    label: 'faint rustle',
    duration: 10,
    schedule: (ctx, dest, t0, vol) => {
      ambientBed(ctx, dest, 'wind-tree-squeaks', t0, 10, {
        gain: 0.18 * vol,
        fadeIn: 1.5,
        fadeOut: 1.5,
        pitchSpread: 0.04,
      });
    },
  },
  {
    id: 'wind-2',
    label: 'breeze',
    duration: 10,
    schedule: (ctx, dest, t0, vol) => {
      ambientBed(ctx, dest, 'wind', t0, 10, {
        gain: 0.32 * vol,
        fadeIn: 1.0,
        fadeOut: 1.0,
        pitchSpread: 0.05,
      });
    },
  },
  {
    id: 'wind-3',
    label: 'wind in trees',
    duration: 10,
    schedule: (ctx, dest, t0, vol) => {
      ambientBed(ctx, dest, 'wind-in-trees', t0, 10, {
        gain: 0.45 * vol,
        fadeIn: 0.8,
        fadeOut: 0.8,
        pitchSpread: 0.04,
      });
      // Subtle squeaks layered on top, panned the other way
      ambientBed(ctx, dest, 'wind-tree-squeaks', t0 + 1, 8, {
        gain: 0.2 * vol,
        fadeIn: 1.0,
        fadeOut: 1.0,
        pan: rnd(-0.6, 0.6),
      });
    },
  },
  {
    id: 'wind-4',
    label: 'gusts in the canopy',
    duration: 10,
    schedule: (ctx, dest, t0, vol) => {
      ambientBed(ctx, dest, 'wind-in-trees', t0, 10, {
        gain: 0.6 * vol,
        fadeIn: 0.4,
        fadeOut: 0.6,
        pitchSpread: 0.06,
      });
      ambientBed(ctx, dest, 'wind', t0 + rnd(0.5, 2), 8, {
        gain: 0.4 * vol,
        fadeIn: 0.5,
        fadeOut: 0.5,
        pan: rnd(-0.6, 0.6),
      });
    },
  },
];

// =============================================================
// WATER
// =============================================================

const waterCells = [
  { id: 'water-0', label: 'silent', duration: 6, schedule: () => {} },
  {
    id: 'water-1',
    label: 'distant trickle',
    duration: 10,
    schedule: (ctx, dest, t0, vol) => {
      ambientBed(ctx, dest, 'brooklet', t0, 10, {
        gain: 0.2 * vol,
        fadeIn: 1.5,
        fadeOut: 1.5,
        pitchSpread: 0.03,
      });
    },
  },
  {
    id: 'water-2',
    label: 'small stream',
    duration: 10,
    schedule: (ctx, dest, t0, vol) => {
      ambientBed(ctx, dest, 'small-stream', t0, 10, {
        gain: 0.32 * vol,
        fadeIn: 1.0,
        fadeOut: 1.0,
        pitchSpread: 0.03,
      });
    },
  },
  {
    id: 'water-3',
    label: 'brook',
    duration: 10,
    schedule: (ctx, dest, t0, vol) => {
      ambientBed(ctx, dest, 'small-stream', t0, 10, {
        gain: 0.42 * vol,
        fadeIn: 0.8,
        fadeOut: 0.8,
      });
      ambientBed(ctx, dest, 'brooklet', t0 + 0.5, 9, {
        gain: 0.25 * vol,
        fadeIn: 1.0,
        fadeOut: 1.0,
        pan: rnd(-0.5, 0.5),
      });
    },
  },
  {
    id: 'water-4',
    label: 'cascade',
    duration: 10,
    schedule: (ctx, dest, t0, vol) => {
      ambientBed(ctx, dest, 'small-cascade', t0, 10, {
        gain: 0.52 * vol,
        fadeIn: 0.6,
        fadeOut: 0.6,
      });
      ambientBed(ctx, dest, 'small-stream', t0 + 1, 8, {
        gain: 0.3 * vol,
        fadeIn: 0.8,
        fadeOut: 0.8,
        pan: rnd(-0.5, 0.5),
      });
    },
  },
];

// =============================================================
// INSECTS
// =============================================================

const insectsCells = [
  { id: 'insects-0', label: 'silent', duration: 6, schedule: () => {} },
  {
    id: 'insects-1',
    label: 'lone cricket',
    duration: 10,
    schedule: (ctx, dest, t0, vol) => {
      // A single one-shot cricket call (or two)
      const count = Math.floor(rnd(1, 3));
      for (let i = 0; i < count; i++) {
        oneShot(ctx, dest, 'nocturnal-insect', t0 + rnd(0, 8), {
          gain: rnd(0.32, 0.5) * vol,
          pitchSpread: 0.1,
        });
      }
    },
  },
  {
    id: 'insects-2',
    label: 'several crickets',
    duration: 10,
    schedule: (ctx, dest, t0, vol) => {
      ambientBed(ctx, dest, 'field-cricket', t0, 10, {
        gain: 0.28 * vol,
        fadeIn: 1.0,
        fadeOut: 1.0,
        pitchSpread: 0.05,
      });
      // a few one-shots for closer, distinct calls
      for (let i = 0; i < 3; i++) {
        oneShot(ctx, dest, 'nocturnal-insect', t0 + rnd(0, 8), {
          gain: rnd(0.25, 0.4) * vol,
          pitchSpread: 0.12,
        });
      }
    },
  },
  {
    id: 'insects-3',
    label: 'cricket chorus',
    duration: 10,
    schedule: (ctx, dest, t0, vol) => {
      ambientBed(ctx, dest, 'nocturnal-insects', t0, 10, {
        gain: 0.4 * vol,
        fadeIn: 0.8,
        fadeOut: 0.8,
      });
      ambientBed(ctx, dest, 'field-cricket', t0 + 0.5, 9, {
        gain: 0.22 * vol,
        fadeIn: 1.0,
        fadeOut: 1.0,
        pan: rnd(-0.5, 0.5),
      });
    },
  },
  {
    id: 'insects-4',
    label: 'full chorus',
    duration: 10,
    schedule: (ctx, dest, t0, vol) => {
      ambientBed(ctx, dest, 'nocturnal-insects', t0, 10, {
        gain: 0.55 * vol,
        fadeIn: 0.5,
        fadeOut: 0.6,
      });
      ambientBed(ctx, dest, 'field-cricket', t0 + 0.3, 9, {
        gain: 0.35 * vol,
        fadeIn: 0.7,
        fadeOut: 0.7,
        pan: rnd(-0.6, 0.6),
        pitchSpread: 0.05,
      });
    },
  },
];

// =============================================================
// AMPHIBIANS
// =============================================================

const amphibiansCells = [
  { id: 'amph-0', label: 'silent', duration: 6, schedule: () => {} },
  {
    id: 'amph-1',
    label: 'distant croak',
    duration: 10,
    schedule: (ctx, dest, t0, vol) => {
      oneShot(ctx, dest, 'one-frog', t0 + rnd(2, 7), {
        gain: rnd(0.28, 0.45) * vol,
        pitchSpread: 0.08,
      });
    },
  },
  {
    id: 'amph-2',
    label: 'trading frogs',
    duration: 10,
    schedule: (ctx, dest, t0, vol) => {
      // Multiple one-frog calls panned around + faint chorus
      for (let i = 0; i < 3; i++) {
        oneShot(ctx, dest, 'one-frog', t0 + rnd(0, 9), {
          gain: rnd(0.32, 0.5) * vol,
          pitchSpread: 0.15,
          panSpread: 0.7,
        });
      }
      ambientBed(ctx, dest, 'frogs-1', t0, 10, {
        gain: 0.18 * vol,
        fadeIn: 1.5,
        fadeOut: 1.5,
      });
    },
  },
  {
    id: 'amph-3',
    label: 'pond chorus',
    duration: 10,
    schedule: (ctx, dest, t0, vol) => {
      ambientBed(ctx, dest, 'frogs-1', t0, 10, {
        gain: 0.4 * vol,
        fadeIn: 0.8,
        fadeOut: 0.8,
      });
      // a few pluck-out calls on top
      for (let i = 0; i < 2; i++) {
        oneShot(ctx, dest, 'one-frog', t0 + rnd(0, 9), {
          gain: rnd(0.3, 0.45) * vol,
          pitchSpread: 0.12,
        });
      }
    },
  },
  {
    id: 'amph-4',
    label: 'peak chorus',
    duration: 10,
    schedule: (ctx, dest, t0, vol) => {
      ambientBed(ctx, dest, 'frogs-2', t0, 10, {
        gain: 0.5 * vol,
        fadeIn: 0.5,
        fadeOut: 0.6,
      });
      ambientBed(ctx, dest, 'frogs-1', t0 + 0.5, 9, {
        gain: 0.32 * vol,
        fadeIn: 0.8,
        fadeOut: 0.8,
        pan: rnd(-0.5, 0.5),
        pitchSpread: 0.05,
      });
    },
  },
];

// =============================================================
// LEAVES (footsteps + things moving through underbrush)
// =============================================================

const leavesCells = [
  { id: 'leaves-0', label: 'silent', duration: 6, schedule: () => {} },
  {
    id: 'leaves-1',
    label: 'footstep',
    duration: 10,
    schedule: (ctx, dest, t0, vol) => {
      // One brief excerpt from feet-in-leaves, played with a short window
      oneShot(ctx, dest, 'feet-in-leaves', t0 + rnd(2, 6), {
        gain: rnd(0.3, 0.45) * vol,
        duration: rnd(1.2, 2.0),
        offset: rnd(0, 4),
        pitchSpread: 0.08,
        fadeIn: 0.05,
        fadeOut: 0.4,
      });
    },
  },
  {
    id: 'leaves-2',
    label: 'someone walking',
    duration: 10,
    schedule: (ctx, dest, t0, vol) => {
      // A continuous walking segment ~4-5s
      oneShot(ctx, dest, 'feet-in-leaves', t0 + rnd(1, 3), {
        gain: rnd(0.42, 0.58) * vol,
        duration: rnd(3.5, 5),
        offset: rnd(0, 4),
        pitchSpread: 0.06,
        fadeIn: 0.2,
        fadeOut: 0.5,
      });
    },
  },
  {
    id: 'leaves-3',
    label: 'movement nearby',
    duration: 10,
    schedule: (ctx, dest, t0, vol) => {
      // Two overlapping walking segments, panned apart
      oneShot(ctx, dest, 'feet-in-leaves', t0 + rnd(0, 2), {
        gain: rnd(0.4, 0.55) * vol,
        duration: rnd(4, 6),
        offset: rnd(0, 4),
        pan: rnd(-0.7, -0.2),
        pitchSpread: 0.06,
        fadeIn: 0.2,
        fadeOut: 0.6,
      });
      oneShot(ctx, dest, 'feet-in-leaves-2', t0 + rnd(2, 4), {
        gain: rnd(0.35, 0.5) * vol,
        duration: rnd(3, 5),
        offset: rnd(0, 4),
        pan: rnd(0.2, 0.7),
        pitchSpread: 0.07,
        fadeIn: 0.2,
        fadeOut: 0.6,
      });
    },
  },
  {
    id: 'leaves-4',
    label: 'something moves',
    duration: 10,
    schedule: (ctx, dest, t0, vol) => {
      // Heavy continuous activity using both leaf samples as bed
      ambientBed(ctx, dest, 'feet-in-leaves', t0, 10, {
        gain: 0.45 * vol,
        fadeIn: 0.4,
        fadeOut: 0.6,
        pan: rnd(-0.5, 0),
      });
      ambientBed(ctx, dest, 'feet-in-leaves-2', t0 + 0.3, 9, {
        gain: 0.4 * vol,
        fadeIn: 0.5,
        fadeOut: 0.6,
        pan: rnd(0, 0.5),
        pitchSpread: 0.06,
      });
    },
  },
];

// =============================================================
// ATMOSPHERE (thunder + owls)
// =============================================================

const atmosphereCells = [
  { id: 'atm-0', label: 'silent', duration: 8, schedule: () => {} },
  {
    id: 'atm-1',
    label: 'distant rumble',
    duration: 12,
    schedule: (ctx, dest, t0, vol) => {
      if (Math.random() < 0.7) {
        oneShot(ctx, dest, 'thunder', t0 + rnd(0, 4), {
          gain: rnd(0.25, 0.4) * vol,
          pitch: rnd(0.85, 0.95), // pitched-down for distance
          pitchSpread: 0,
          fadeIn: 0.3,
          fadeOut: 1.2,
        });
      }
    },
  },
  {
    id: 'atm-2',
    label: 'owl hoot',
    duration: 12,
    schedule: (ctx, dest, t0, vol) => {
      const id = pick(['tawny-owl', 'long-eared-owl']);
      oneShot(ctx, dest, id, t0 + rnd(2, 7), {
        gain: rnd(0.4, 0.55) * vol,
        pitchSpread: 0.06,
        panSpread: 0.5,
      });
      if (Math.random() < 0.4) {
        oneShot(ctx, dest, 'thunder', t0 + rnd(0, 5), {
          gain: rnd(0.2, 0.3) * vol,
          pitch: rnd(0.85, 0.95),
          fadeIn: 0.4,
          fadeOut: 1.2,
        });
      }
    },
  },
  {
    id: 'atm-3',
    label: 'thunder + owl',
    duration: 12,
    schedule: (ctx, dest, t0, vol) => {
      oneShot(ctx, dest, 'thunder', t0 + rnd(0, 3), {
        gain: rnd(0.4, 0.55) * vol,
        pitch: rnd(0.9, 1.0),
        fadeIn: 0.2,
        fadeOut: 1.5,
      });
      const owlId = pick(['tawny-owl', 'long-eared-owl']);
      oneShot(ctx, dest, owlId, t0 + rnd(4, 9), {
        gain: rnd(0.45, 0.6) * vol,
        pitchSpread: 0.08,
      });
      if (Math.random() < 0.5) {
        const owl2 = pick(['tawny-owl', 'long-eared-owl']);
        oneShot(ctx, dest, owl2, t0 + rnd(7, 11), {
          gain: rnd(0.4, 0.55) * vol,
          pitchSpread: 0.1,
          panSpread: 0.7,
        });
      }
    },
  },
  {
    id: 'atm-4',
    label: 'storm closer',
    duration: 12,
    schedule: (ctx, dest, t0, vol) => {
      oneShot(ctx, dest, 'thunder', t0 + rnd(0, 1), {
        gain: rnd(0.55, 0.75) * vol,
        pitch: rnd(0.95, 1.05),
        fadeIn: 0.1,
        fadeOut: 1.5,
      });
      oneShot(ctx, dest, 'thunder', t0 + rnd(5, 8), {
        gain: rnd(0.5, 0.7) * vol,
        pitch: rnd(0.9, 1.0),
        fadeIn: 0.15,
        fadeOut: 1.3,
        pan: rnd(-0.5, 0.5),
      });
      oneShot(ctx, dest, 'tawny-owl', t0 + rnd(2, 5), {
        gain: rnd(0.45, 0.6) * vol,
        pitchSpread: 0.08,
      });
      oneShot(ctx, dest, 'long-eared-owl', t0 + rnd(6, 10), {
        gain: rnd(0.4, 0.55) * vol,
        pitchSpread: 0.1,
      });
    },
  },
];

// =============================================================

export const CELLS_BY_CATEGORY = {
  birds: birdsCells,
  wind: windCells,
  water: waterCells,
  insects: insectsCells,
  amphibians: amphibiansCells,
  leaves: leavesCells,
  atmosphere: atmosphereCells,
};

export function getCells(categoryId) {
  return CELLS_BY_CATEGORY[categoryId];
}

export function getCell(categoryId, cellIndex) {
  const cells = CELLS_BY_CATEGORY[categoryId];
  if (!cells) return null;
  return cells[Math.max(0, Math.min(cellIndex, cells.length - 1))];
}
