// Soundscapes — sound-cell definitions per performer.
//
// Each performer has an array of cells. Cell 0 is silence. Higher indexes
// = denser / more intense. Each cell exposes:
//   - id, label
//   - duration: loop length in seconds
//   - schedule(ctx, dest, startTime, volume) — schedules events for one loop
//
// Randomness lives inside the synth primitives, so the same cell never plays
// the same way twice.

import { SYNTH } from './synth-sources.js';

const rnd = (a, b) => a + Math.random() * (b - a);

// Helper: schedule N events spaced randomly within [0, duration]
function scheduleScattered(count, duration, fn) {
  const times = [];
  for (let i = 0; i < count; i++) times.push(Math.random() * duration);
  times.sort((a, b) => a - b);
  return times.map(t => ({ t, fn }));
}

// Each cell schedule fn returns nothing — it just fires synth functions
// at offsets from startTime.

// =============================================================
// BIRDS
// =============================================================

const birdsCells = [
  {
    id: 'birds-0',
    label: 'silent',
    duration: 6,
    schedule: () => {},
  },
  {
    id: 'birds-1',
    label: 'distant chirp',
    duration: 8,
    schedule: (ctx, dest, t0, vol) => {
      // 1 chirp per loop, from very far (low amp)
      const t = t0 + rnd(1, 6);
      SYNTH.birdChirp(ctx, dest, t, { volume: 0.4 * vol });
    },
  },
  {
    id: 'birds-2',
    label: 'two voices',
    duration: 7,
    schedule: (ctx, dest, t0, vol) => {
      SYNTH.birdChirp(ctx, dest, t0 + rnd(0, 3), { volume: 0.55 * vol, pitchStart: rnd(2200, 2800) });
      SYNTH.birdCall(ctx, dest, t0 + rnd(3, 6), { volume: 0.55 * vol, baseFreq: rnd(1500, 2000) });
      if (Math.random() < 0.4) {
        SYNTH.birdTrill(ctx, dest, t0 + rnd(0, 6), { volume: 0.5 * vol });
      }
    },
  },
  {
    id: 'birds-3',
    label: 'overlapping calls',
    duration: 7,
    schedule: (ctx, dest, t0, vol) => {
      const events = [
        () => SYNTH.birdChirp(ctx, dest, 0, { volume: 0.7 * vol }),
        () => SYNTH.birdCall(ctx, dest, 0, { volume: 0.7 * vol }),
        () => SYNTH.birdTrill(ctx, dest, 0, { volume: 0.6 * vol }),
        () => SYNTH.birdChirp(ctx, dest, 0, { volume: 0.6 * vol, pitchStart: rnd(2400, 3200) }),
      ];
      // Schedule each event at its own random time
      for (let i = 0; i < 5; i++) {
        const fn = events[Math.floor(Math.random() * events.length)];
        const t = t0 + rnd(0, 6);
        // Inline rebind to apply real time
        if (fn === events[0]) SYNTH.birdChirp(ctx, dest, t, { volume: 0.7 * vol });
        else if (fn === events[1]) SYNTH.birdCall(ctx, dest, t, { volume: 0.7 * vol });
        else if (fn === events[2]) SYNTH.birdTrill(ctx, dest, t, { volume: 0.6 * vol });
        else SYNTH.birdChirp(ctx, dest, t, { volume: 0.6 * vol, pitchStart: rnd(2400, 3200) });
      }
    },
  },
  {
    id: 'birds-4',
    label: 'dawn chorus',
    duration: 6,
    schedule: (ctx, dest, t0, vol) => {
      // Dense: ~12 events
      for (let i = 0; i < 12; i++) {
        const t = t0 + rnd(0, 5.5);
        const r = Math.random();
        if (r < 0.4) {
          SYNTH.birdChirp(ctx, dest, t, { volume: 0.7 * vol, pitchStart: rnd(2000, 3500) });
        } else if (r < 0.7) {
          SYNTH.birdTrill(ctx, dest, t, { volume: 0.65 * vol, baseFreq: rnd(1800, 3000) });
        } else {
          SYNTH.birdCall(ctx, dest, t, { volume: 0.6 * vol, baseFreq: rnd(1300, 2200) });
        }
      }
    },
  },
];

// =============================================================
// WIND
// =============================================================

const windCells = [
  {
    id: 'wind-0',
    label: 'silent',
    duration: 6,
    schedule: () => {},
  },
  {
    id: 'wind-1',
    label: 'faint rustle',
    duration: 8,
    schedule: (ctx, dest, t0, vol) => {
      // A handful of leaf rustles, very quiet
      for (let i = 0; i < 3; i++) {
        const t = t0 + rnd(0, 7);
        SYNTH.leafRustle(ctx, dest, t, { volume: 0.35 * vol, amp: rnd(0.1, 0.18) });
      }
    },
  },
  {
    id: 'wind-2',
    label: 'breeze',
    duration: 8,
    schedule: (ctx, dest, t0, vol) => {
      SYNTH.windGust(ctx, dest, t0, { duration: 7, amp: 0.2 * vol, volume: vol });
      // a few rustles riding the gust
      for (let i = 0; i < 4; i++) {
        SYNTH.leafRustle(ctx, dest, t0 + rnd(0, 7), { volume: 0.4 * vol });
      }
    },
  },
  {
    id: 'wind-3',
    label: 'steady wind',
    duration: 8,
    schedule: (ctx, dest, t0, vol) => {
      // Two overlapping gusts for continuous bed
      SYNTH.windGust(ctx, dest, t0, { duration: 8, amp: 0.28 * vol, volume: vol, cutoffPeak: rnd(1000, 1600) });
      SYNTH.windGust(ctx, dest, t0 + 4, { duration: 6, amp: 0.22 * vol, volume: vol, cutoffPeak: rnd(800, 1300) });
      for (let i = 0; i < 8; i++) {
        SYNTH.leafRustle(ctx, dest, t0 + rnd(0, 7.5), { volume: 0.45 * vol });
      }
    },
  },
  {
    id: 'wind-4',
    label: 'gusts in the canopy',
    duration: 8,
    schedule: (ctx, dest, t0, vol) => {
      SYNTH.windGust(ctx, dest, t0, { duration: 8, amp: 0.35 * vol, volume: vol, cutoffPeak: rnd(1200, 2000) });
      SYNTH.windGust(ctx, dest, t0 + rnd(1, 3), { duration: 5, amp: 0.32 * vol, volume: vol, cutoffPeak: rnd(900, 1500) });
      // Lots of rustle activity
      for (let i = 0; i < 14; i++) {
        SYNTH.leafRustle(ctx, dest, t0 + rnd(0, 7.5), { volume: 0.55 * vol, amp: rnd(0.25, 0.45) });
      }
    },
  },
];

// =============================================================
// WATER
// =============================================================

const waterCells = [
  {
    id: 'water-0',
    label: 'silent',
    duration: 6,
    schedule: () => {},
  },
  {
    id: 'water-1',
    label: 'occasional drip',
    duration: 8,
    schedule: (ctx, dest, t0, vol) => {
      const count = Math.floor(rnd(1, 3));
      for (let i = 0; i < count; i++) {
        SYNTH.drip(ctx, dest, t0 + rnd(0.5, 7), {
          volume: 0.5 * vol,
          pitchStart: rnd(800, 1400),
        });
      }
    },
  },
  {
    id: 'water-2',
    label: 'trickle',
    duration: 8,
    schedule: (ctx, dest, t0, vol) => {
      // many small drips
      for (let i = 0; i < 12; i++) {
        SYNTH.drip(ctx, dest, t0 + rnd(0, 7.5), {
          volume: 0.4 * vol,
          pitchStart: rnd(700, 1500),
          duration: rnd(0.06, 0.12),
        });
      }
    },
  },
  {
    id: 'water-3',
    label: 'brook',
    duration: 8,
    schedule: (ctx, dest, t0, vol) => {
      SYNTH.streamFlow(ctx, dest, t0, { duration: 8, amp: 0.22 * vol, volume: vol });
    },
  },
  {
    id: 'water-4',
    label: 'bubbling rapids',
    duration: 8,
    schedule: (ctx, dest, t0, vol) => {
      SYNTH.streamFlow(ctx, dest, t0, { duration: 8, amp: 0.28 * vol, volume: vol });
      // heavier bubbling on top
      for (let i = 0; i < 4; i++) {
        SYNTH.bubbleCluster(ctx, dest, t0 + rnd(0, 7), { volume: 0.55 * vol });
      }
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
    duration: 8,
    schedule: (ctx, dest, t0, vol) => {
      const count = Math.floor(rnd(2, 4));
      for (let i = 0; i < count; i++) {
        SYNTH.cricket(ctx, dest, t0 + rnd(0, 7), { volume: 0.45 * vol });
      }
    },
  },
  {
    id: 'insects-2',
    label: 'several crickets',
    duration: 8,
    schedule: (ctx, dest, t0, vol) => {
      for (let i = 0; i < 7; i++) {
        SYNTH.cricket(ctx, dest, t0 + rnd(0, 7.5), { volume: 0.5 * vol, freq: rnd(4000, 5500) });
      }
    },
  },
  {
    id: 'insects-3',
    label: 'cricket + cicada',
    duration: 8,
    schedule: (ctx, dest, t0, vol) => {
      SYNTH.cicadaBuzz(ctx, dest, t0 + rnd(0, 1), { duration: rnd(3, 5), volume: 0.5 * vol });
      for (let i = 0; i < 10; i++) {
        SYNTH.cricket(ctx, dest, t0 + rnd(0, 7.5), { volume: 0.5 * vol });
      }
    },
  },
  {
    id: 'insects-4',
    label: 'full chorus',
    duration: 8,
    schedule: (ctx, dest, t0, vol) => {
      SYNTH.cicadaBuzz(ctx, dest, t0, { duration: 7, volume: 0.6 * vol });
      SYNTH.cicadaBuzz(ctx, dest, t0 + 2, { duration: 5, volume: 0.5 * vol });
      for (let i = 0; i < 18; i++) {
        SYNTH.cricket(ctx, dest, t0 + rnd(0, 7.5), { volume: 0.55 * vol, freq: rnd(3800, 5500) });
      }
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
    duration: 8,
    schedule: (ctx, dest, t0, vol) => {
      SYNTH.frogCroak(ctx, dest, t0 + rnd(2, 6), { volume: 0.4 * vol, freq: rnd(180, 240) });
    },
  },
  {
    id: 'amph-2',
    label: 'trading frogs',
    duration: 8,
    schedule: (ctx, dest, t0, vol) => {
      const count = Math.floor(rnd(3, 5));
      for (let i = 0; i < count; i++) {
        SYNTH.frogCroak(ctx, dest, t0 + rnd(0, 7), {
          volume: 0.5 * vol,
          freq: rnd(170, 280),
        });
      }
    },
  },
  {
    id: 'amph-3',
    label: 'pond chorus',
    duration: 8,
    schedule: (ctx, dest, t0, vol) => {
      for (let i = 0; i < 8; i++) {
        SYNTH.frogCroak(ctx, dest, t0 + rnd(0, 7.5), {
          volume: 0.55 * vol,
          freq: rnd(160, 290),
        });
      }
      if (Math.random() < 0.5) {
        SYNTH.bullfrog(ctx, dest, t0 + rnd(1, 6), { volume: 0.6 * vol });
      }
    },
  },
  {
    id: 'amph-4',
    label: 'peak activity',
    duration: 8,
    schedule: (ctx, dest, t0, vol) => {
      for (let i = 0; i < 14; i++) {
        SYNTH.frogCroak(ctx, dest, t0 + rnd(0, 7.5), {
          volume: 0.55 * vol,
          freq: rnd(150, 300),
        });
      }
      SYNTH.bullfrog(ctx, dest, t0 + rnd(0, 4), { volume: 0.7 * vol });
      SYNTH.bullfrog(ctx, dest, t0 + rnd(4, 7), { volume: 0.6 * vol });
    },
  },
];

// =============================================================
// LEAVES (large rustles, footsteps, things moving on the ground)
// =============================================================

const leavesCells = [
  { id: 'leaves-0', label: 'silent', duration: 6, schedule: () => {} },
  {
    id: 'leaves-1',
    label: 'occasional rustle',
    duration: 8,
    schedule: (ctx, dest, t0, vol) => {
      const count = Math.floor(rnd(2, 4));
      for (let i = 0; i < count; i++) {
        SYNTH.leafRustle(ctx, dest, t0 + rnd(0, 7.5), { volume: 0.5 * vol });
      }
    },
  },
  {
    id: 'leaves-2',
    label: 'footsteps',
    duration: 8,
    schedule: (ctx, dest, t0, vol) => {
      // a sequence of footstep crunches
      const stepStart = rnd(1, 3);
      const stepCount = Math.floor(rnd(3, 6));
      for (let i = 0; i < stepCount; i++) {
        SYNTH.footstepCrunch(ctx, dest, t0 + stepStart + i * rnd(0.5, 0.8), {
          volume: 0.55 * vol,
        });
      }
      for (let i = 0; i < 3; i++) {
        SYNTH.leafRustle(ctx, dest, t0 + rnd(0, 7), { volume: 0.45 * vol });
      }
    },
  },
  {
    id: 'leaves-3',
    label: 'continuous rustling',
    duration: 8,
    schedule: (ctx, dest, t0, vol) => {
      for (let i = 0; i < 10; i++) {
        SYNTH.leafRustle(ctx, dest, t0 + rnd(0, 7.5), { volume: 0.55 * vol });
      }
      for (let i = 0; i < 2; i++) {
        SYNTH.footstepCrunch(ctx, dest, t0 + rnd(1, 7), { volume: 0.5 * vol });
      }
    },
  },
  {
    id: 'leaves-4',
    label: 'something moves',
    duration: 8,
    schedule: (ctx, dest, t0, vol) => {
      for (let i = 0; i < 16; i++) {
        SYNTH.leafRustle(ctx, dest, t0 + rnd(0, 7.5), { volume: 0.6 * vol });
      }
      // a flurry of footsteps mid-loop
      const burst = rnd(2, 5);
      for (let i = 0; i < 6; i++) {
        SYNTH.footstepCrunch(ctx, dest, t0 + burst + i * rnd(0.18, 0.32), {
          volume: 0.6 * vol,
        });
      }
    },
  },
];

// =============================================================
// ATMOSPHERE (thunder, owls)
// =============================================================

const atmosphereCells = [
  { id: 'atm-0', label: 'silent', duration: 8, schedule: () => {} },
  {
    id: 'atm-1',
    label: 'distant rumble',
    duration: 10,
    schedule: (ctx, dest, t0, vol) => {
      if (Math.random() < 0.7) {
        SYNTH.thunderRumble(ctx, dest, t0 + rnd(0, 4), {
          duration: rnd(3, 5),
          amp: 0.18 * vol,
          volume: vol,
        });
      }
    },
  },
  {
    id: 'atm-2',
    label: 'owl hoot',
    duration: 10,
    schedule: (ctx, dest, t0, vol) => {
      // 1-2 hoots in series
      const hoots = Math.floor(rnd(1, 3));
      const start = rnd(2, 6);
      for (let i = 0; i < hoots; i++) {
        SYNTH.owlHoot(ctx, dest, t0 + start + i * rnd(0.7, 1.2), {
          freq: rnd(220, 320),
          volume: 0.5 * vol,
        });
      }
      if (Math.random() < 0.4) {
        SYNTH.thunderRumble(ctx, dest, t0 + rnd(0, 5), {
          duration: rnd(2, 4),
          amp: 0.15 * vol,
          volume: vol,
        });
      }
    },
  },
  {
    id: 'atm-3',
    label: 'thunder + owl',
    duration: 10,
    schedule: (ctx, dest, t0, vol) => {
      SYNTH.thunderRumble(ctx, dest, t0 + rnd(0, 3), {
        duration: rnd(3, 5),
        amp: 0.25 * vol,
        volume: vol,
      });
      SYNTH.owlHoot(ctx, dest, t0 + rnd(3, 7), { volume: 0.55 * vol });
      if (Math.random() < 0.4) {
        SYNTH.owlHoot(ctx, dest, t0 + rnd(5, 9), {
          freq: rnd(260, 350),
          volume: 0.5 * vol,
        });
      }
    },
  },
  {
    id: 'atm-4',
    label: 'thunder closer',
    duration: 10,
    schedule: (ctx, dest, t0, vol) => {
      SYNTH.thunderRumble(ctx, dest, t0, { duration: rnd(4, 6), amp: 0.4 * vol, volume: vol });
      SYNTH.thunderRumble(ctx, dest, t0 + rnd(4, 6), {
        duration: rnd(3, 5),
        amp: 0.3 * vol,
        volume: vol,
      });
      SYNTH.owlHoot(ctx, dest, t0 + rnd(1, 4), { volume: 0.5 * vol });
      SYNTH.owlHoot(ctx, dest, t0 + rnd(5, 9), { volume: 0.5 * vol });
    },
  },
];

// =============================================================
// CREATURES (squirrels, distant howl, distant bark)
// =============================================================

const creaturesCells = [
  { id: 'cre-0', label: 'silent', duration: 6, schedule: () => {} },
  {
    id: 'cre-1',
    label: 'squirrel chitter',
    duration: 8,
    schedule: (ctx, dest, t0, vol) => {
      SYNTH.squirrelChitter(ctx, dest, t0 + rnd(1, 5), { volume: 0.5 * vol });
    },
  },
  {
    id: 'cre-2',
    label: 'a distant bark',
    duration: 8,
    schedule: (ctx, dest, t0, vol) => {
      if (Math.random() < 0.6) {
        SYNTH.distantBark(ctx, dest, t0 + rnd(2, 5), { volume: 0.5 * vol });
      }
      SYNTH.squirrelChitter(ctx, dest, t0 + rnd(0, 6), { volume: 0.5 * vol });
    },
  },
  {
    id: 'cre-3',
    label: 'paws & barks',
    duration: 8,
    schedule: (ctx, dest, t0, vol) => {
      SYNTH.distantBark(ctx, dest, t0 + rnd(0, 5), { volume: 0.55 * vol });
      SYNTH.squirrelChitter(ctx, dest, t0 + rnd(0, 6), { volume: 0.55 * vol });
      if (Math.random() < 0.5) {
        SYNTH.squirrelChitter(ctx, dest, t0 + rnd(2, 7), { volume: 0.5 * vol });
      }
    },
  },
  {
    id: 'cre-4',
    label: 'distant howl',
    duration: 10,
    schedule: (ctx, dest, t0, vol) => {
      SYNTH.distantHowl(ctx, dest, t0 + rnd(2, 5), { volume: 0.6 * vol });
      SYNTH.squirrelChitter(ctx, dest, t0 + rnd(0, 9), { volume: 0.5 * vol });
      if (Math.random() < 0.4) {
        SYNTH.distantBark(ctx, dest, t0 + rnd(5, 9), { volume: 0.5 * vol });
      }
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
  creatures: creaturesCells,
};

export function getCells(categoryId) {
  return CELLS_BY_CATEGORY[categoryId];
}

export function getCell(categoryId, cellIndex) {
  const cells = CELLS_BY_CATEGORY[categoryId];
  if (!cells) return null;
  return cells[Math.max(0, Math.min(cellIndex, cells.length - 1))];
}
