// Soundscapes — Mall Food Court scene.
// 7 performers: crowd, trays & dishes, registers, kitchen sizzle,
// children, coffee bar, mall ambience.

import { oneShot, ambientBed } from '../sample-engine.js';

const rnd = (a, b) => a + Math.random() * (b - a);
const pick = (arr) => arr[Math.floor(Math.random() * arr.length)];

// ---- Sample manifest ----
const SAMPLES = {
  // Crowd
  'restaurant-conversations': { url: 'samples/mall-food-court/restaurant-conversations.mp3' },
  'outdoor-market':           { url: 'samples/mall-food-court/outdoor-market.mp3' },
  'outside-talks':            { url: 'samples/mall-food-court/outside-talks.mp3' },
  'supermarket':              { url: 'samples/mall-food-court/supermarket.mp3' },
  // Trays & dishes
  'plate-stack':              { url: 'samples/mall-food-court/plate-stack.mp3' },
  'plates-manipulations':     { url: 'samples/mall-food-court/plates-manipulations.mp3' },
  'cutlery-on-table':         { url: 'samples/mall-food-court/cutlery-on-table.mp3' },
  'glasses-manipulations':    { url: 'samples/mall-food-court/glasses-manipulations.mp3' },
  // Registers
  'register-beep-1':          { url: 'samples/mall-food-court/register-beep-1.mp3' },
  'register-beep-2':          { url: 'samples/mall-food-court/register-beep-2.mp3' },
  'supermarket-registers':    { url: 'samples/mall-food-court/supermarket-registers.mp3' },
  // Kitchen
  'deep-fryer':               { url: 'samples/mall-food-court/deep-fryer.mp3' },
  'deep-fryer-2':             { url: 'samples/mall-food-court/deep-fryer-2.mp3' },
  'frying-pan':               { url: 'samples/mall-food-court/frying-pan.mp3' },
  'fried-egg':                { url: 'samples/mall-food-court/fried-egg.mp3' },
  // Children
  'kindergarten':             { url: 'samples/mall-food-court/kindergarten.mp3' },
  'children-laughter':        { url: 'samples/mall-food-court/children-laughter.mp3' },
  'crying-baby':              { url: 'samples/mall-food-court/crying-baby.mp3' },
  'kids-screaming':           { url: 'samples/mall-food-court/kids-screaming.mp3' },
  // Coffee
  'coffee-grinder':           { url: 'samples/mall-food-court/coffee-grinder.mp3' },
  'nespresso':                { url: 'samples/mall-food-court/nespresso.mp3' },
  'italian-coffee-maker':     { url: 'samples/mall-food-court/italian-coffee-maker.mp3' },
  // Mall ambience
  'escalator':                { url: 'samples/mall-food-court/escalator.mp3' },
  'fountain':                 { url: 'samples/mall-food-court/fountain.mp3' },
};

// ---- Performer roster ----
const PERFORMERS = [
  { id: 0, key: '1', name: 'Crowd',     color: '#dcb88c', categoryId: 'crowd' },
  { id: 1, key: '2', name: 'Dishes',    color: '#c2c8d5', categoryId: 'dishes' },
  { id: 2, key: '3', name: 'Registers', color: '#f4d35e', categoryId: 'registers' },
  { id: 3, key: '4', name: 'Kitchen',   color: '#e85a4f', categoryId: 'kitchen' },
  { id: 4, key: '5', name: 'Children',  color: '#f49b65', categoryId: 'children' },
  { id: 5, key: '6', name: 'Coffee',    color: '#8b6f47', categoryId: 'coffee' },
  { id: 6, key: '7', name: 'Ambience',  color: '#9aa1a8', categoryId: 'ambience' },
];

// ---- Cells per category ----

const crowdCells = [
  { id: 'crd-0', label: 'silent', duration: 6, schedule: () => {} },
  {
    id: 'crd-1', label: 'distant murmur', duration: 10,
    schedule: (ctx, dest, t0, vol) => {
      ambientBed(ctx, dest, 'outside-talks', t0, 10, {
        gain: 0.22 * vol, fadeIn: 1.5, fadeOut: 1.5, pitchSpread: 0.03,
      });
    },
  },
  {
    id: 'crd-2', label: 'small group', duration: 10,
    schedule: (ctx, dest, t0, vol) => {
      ambientBed(ctx, dest, 'restaurant-conversations', t0, 10, {
        gain: 0.34 * vol, fadeIn: 1.0, fadeOut: 1.0, pitchSpread: 0.03,
      });
    },
  },
  {
    id: 'crd-3', label: 'busy lunch', duration: 10,
    schedule: (ctx, dest, t0, vol) => {
      ambientBed(ctx, dest, 'restaurant-conversations', t0, 10, {
        gain: 0.42 * vol, fadeIn: 0.8, fadeOut: 0.8,
      });
      ambientBed(ctx, dest, 'outdoor-market', t0 + 0.5, 9, {
        gain: 0.28 * vol, fadeIn: 1.0, fadeOut: 1.0, pan: rnd(-0.5, 0.5),
      });
    },
  },
  {
    id: 'crd-4', label: 'peak crowd', duration: 10,
    schedule: (ctx, dest, t0, vol) => {
      ambientBed(ctx, dest, 'restaurant-conversations', t0, 10, {
        gain: 0.5 * vol, fadeIn: 0.5, fadeOut: 0.6,
      });
      ambientBed(ctx, dest, 'outdoor-market', t0 + 0.3, 9, {
        gain: 0.4 * vol, fadeIn: 0.7, fadeOut: 0.7, pan: rnd(-0.6, 0.6),
      });
      ambientBed(ctx, dest, 'supermarket', t0 + 0.7, 8, {
        gain: 0.28 * vol, fadeIn: 0.8, fadeOut: 0.8, pitchSpread: 0.04,
      });
    },
  },
];

const dishesCells = [
  { id: 'dsh-0', label: 'silent', duration: 6, schedule: () => {} },
  {
    id: 'dsh-1', label: 'someone clears', duration: 10,
    schedule: (ctx, dest, t0, vol) => {
      const id = pick(['cutlery-on-table', 'glasses-manipulations']);
      oneShot(ctx, dest, id, t0 + rnd(2, 6), {
        gain: rnd(0.32, 0.48) * vol, duration: rnd(1.5, 3),
        offset: rnd(0, 4), pitchSpread: 0.06, panSpread: 0.6,
      });
    },
  },
  {
    id: 'dsh-2', label: 'tray drops', duration: 10,
    schedule: (ctx, dest, t0, vol) => {
      oneShot(ctx, dest, 'plate-stack', t0 + rnd(0, 4), {
        gain: rnd(0.4, 0.55) * vol, pitchSpread: 0.08, panSpread: 0.7,
      });
      oneShot(ctx, dest, 'cutlery-on-table', t0 + rnd(3, 8), {
        gain: rnd(0.32, 0.45) * vol, duration: rnd(1.5, 2.8),
        offset: rnd(0, 4), pitchSpread: 0.06, panSpread: 0.7,
      });
    },
  },
  {
    id: 'dsh-3', label: 'busy bussing', duration: 10,
    schedule: (ctx, dest, t0, vol) => {
      const events = ['plate-stack', 'cutlery-on-table', 'glasses-manipulations'];
      for (let i = 0; i < 5; i++) {
        const id = pick(events);
        oneShot(ctx, dest, id, t0 + rnd(0, 9), {
          gain: rnd(0.32, 0.5) * vol, duration: rnd(1, 2.5),
          offset: rnd(0, 4), pitchSpread: 0.1, panSpread: 0.8,
        });
      }
    },
  },
  {
    id: 'dsh-4', label: 'lunch rush', duration: 10,
    schedule: (ctx, dest, t0, vol) => {
      ambientBed(ctx, dest, 'plates-manipulations', t0, 10, {
        gain: 0.32 * vol, fadeIn: 0.7, fadeOut: 0.7, pitchSpread: 0.04,
      });
      const events = ['plate-stack', 'cutlery-on-table', 'glasses-manipulations'];
      for (let i = 0; i < 7; i++) {
        const id = pick(events);
        oneShot(ctx, dest, id, t0 + rnd(0, 9), {
          gain: rnd(0.35, 0.55) * vol, duration: rnd(1, 2.5),
          offset: rnd(0, 4), pitchSpread: 0.12, panSpread: 0.85,
        });
      }
    },
  },
];

const registersCells = [
  { id: 'reg-0', label: 'silent', duration: 6, schedule: () => {} },
  {
    id: 'reg-1', label: 'a beep', duration: 10,
    schedule: (ctx, dest, t0, vol) => {
      const id = pick(['register-beep-1', 'register-beep-2']);
      oneShot(ctx, dest, id, t0 + rnd(2, 7), {
        gain: rnd(0.28, 0.42) * vol, pitchSpread: 0.06, panSpread: 0.6,
      });
    },
  },
  {
    id: 'reg-2', label: 'busy register', duration: 10,
    schedule: (ctx, dest, t0, vol) => {
      const beeps = ['register-beep-1', 'register-beep-2'];
      const count = Math.floor(rnd(3, 6));
      for (let i = 0; i < count; i++) {
        oneShot(ctx, dest, pick(beeps), t0 + rnd(0, 9), {
          gain: rnd(0.3, 0.45) * vol, pitchSpread: 0.1, panSpread: 0.7,
        });
      }
    },
  },
  {
    id: 'reg-3', label: 'full row', duration: 10,
    schedule: (ctx, dest, t0, vol) => {
      ambientBed(ctx, dest, 'supermarket-registers', t0, 10, {
        gain: 0.32 * vol, fadeIn: 0.8, fadeOut: 0.8, pitchSpread: 0.03,
      });
      const beeps = ['register-beep-1', 'register-beep-2'];
      for (let i = 0; i < 4; i++) {
        oneShot(ctx, dest, pick(beeps), t0 + rnd(0, 9), {
          gain: rnd(0.35, 0.5) * vol, pitchSpread: 0.12, panSpread: 0.7,
        });
      }
    },
  },
  {
    id: 'reg-4', label: 'rush', duration: 10,
    schedule: (ctx, dest, t0, vol) => {
      ambientBed(ctx, dest, 'supermarket-registers', t0, 10, {
        gain: 0.45 * vol, fadeIn: 0.5, fadeOut: 0.6,
      });
      const beeps = ['register-beep-1', 'register-beep-2'];
      for (let i = 0; i < 8; i++) {
        oneShot(ctx, dest, pick(beeps), t0 + rnd(0, 9), {
          gain: rnd(0.38, 0.55) * vol, pitchSpread: 0.15, panSpread: 0.85,
        });
      }
    },
  },
];

const kitchenCells = [
  { id: 'kit-0', label: 'silent', duration: 6, schedule: () => {} },
  {
    id: 'kit-1', label: 'faint sizzle', duration: 10,
    schedule: (ctx, dest, t0, vol) => {
      ambientBed(ctx, dest, 'frying-pan', t0, 10, {
        gain: 0.22 * vol, fadeIn: 1.5, fadeOut: 1.5, pitchSpread: 0.03,
      });
    },
  },
  {
    id: 'kit-2', label: 'cooking', duration: 10,
    schedule: (ctx, dest, t0, vol) => {
      ambientBed(ctx, dest, 'deep-fryer', t0, 10, {
        gain: 0.35 * vol, fadeIn: 0.8, fadeOut: 0.8, pitchSpread: 0.03,
      });
      if (Math.random() < 0.5) {
        oneShot(ctx, dest, 'fried-egg', t0 + rnd(2, 7), {
          gain: rnd(0.3, 0.42) * vol, duration: rnd(1.5, 2.5),
          offset: rnd(0, 4), pitchSpread: 0.05, panSpread: 0.5,
        });
      }
    },
  },
  {
    id: 'kit-3', label: 'busy kitchen', duration: 10,
    schedule: (ctx, dest, t0, vol) => {
      ambientBed(ctx, dest, 'deep-fryer', t0, 10, {
        gain: 0.42 * vol, fadeIn: 0.6, fadeOut: 0.7,
      });
      ambientBed(ctx, dest, 'frying-pan', t0 + 0.5, 9, {
        gain: 0.3 * vol, fadeIn: 0.8, fadeOut: 0.8, pan: rnd(-0.5, 0.5),
      });
      oneShot(ctx, dest, 'fried-egg', t0 + rnd(1, 7), {
        gain: rnd(0.32, 0.45) * vol, duration: rnd(1.5, 2.5),
        offset: rnd(0, 4), pitchSpread: 0.06,
      });
    },
  },
  {
    id: 'kit-4', label: 'lunch rush', duration: 10,
    schedule: (ctx, dest, t0, vol) => {
      ambientBed(ctx, dest, 'deep-fryer', t0, 10, {
        gain: 0.5 * vol, fadeIn: 0.4, fadeOut: 0.5, pan: rnd(-0.4, 0),
      });
      ambientBed(ctx, dest, 'deep-fryer-2', t0 + 0.3, 9, {
        gain: 0.45 * vol, fadeIn: 0.5, fadeOut: 0.6, pan: rnd(0, 0.4),
      });
      ambientBed(ctx, dest, 'frying-pan', t0 + 0.6, 9, {
        gain: 0.32 * vol, fadeIn: 0.7, fadeOut: 0.7, pitchSpread: 0.04,
      });
      // Punctuating fried-egg drops
      for (let i = 0; i < 2; i++) {
        oneShot(ctx, dest, 'fried-egg', t0 + rnd(0, 9), {
          gain: rnd(0.38, 0.5) * vol, duration: rnd(1.5, 2.8),
          offset: rnd(0, 4), pitchSpread: 0.08, panSpread: 0.7,
        });
      }
    },
  },
];

const childrenCells = [
  { id: 'chd-0', label: 'silent', duration: 6, schedule: () => {} },
  {
    id: 'chd-1', label: 'a kid in the distance', duration: 10,
    schedule: (ctx, dest, t0, vol) => {
      oneShot(ctx, dest, 'kids-screaming', t0 + rnd(2, 7), {
        gain: rnd(0.22, 0.34) * vol, duration: rnd(1.5, 3),
        offset: rnd(0, 2), pitchSpread: 0.08, panSpread: 0.7,
      });
    },
  },
  {
    id: 'chd-2', label: 'laughter', duration: 10,
    schedule: (ctx, dest, t0, vol) => {
      oneShot(ctx, dest, 'children-laughter', t0 + rnd(1, 5), {
        gain: rnd(0.4, 0.55) * vol, pitchSpread: 0.05, panSpread: 0.5,
      });
      if (Math.random() < 0.5) {
        oneShot(ctx, dest, 'kids-screaming', t0 + rnd(4, 9), {
          gain: rnd(0.3, 0.42) * vol, duration: rnd(1.5, 2.5),
          offset: rnd(0, 2), pitchSpread: 0.08, panSpread: 0.7,
        });
      }
    },
  },
  {
    id: 'chd-3', label: 'kids being kids', duration: 10,
    schedule: (ctx, dest, t0, vol) => {
      oneShot(ctx, dest, 'children-laughter', t0 + rnd(0, 4), {
        gain: rnd(0.42, 0.55) * vol, pitchSpread: 0.06,
      });
      oneShot(ctx, dest, 'crying-baby', t0 + rnd(2, 7), {
        gain: rnd(0.3, 0.45) * vol, duration: rnd(2, 4),
        offset: rnd(0, 5), pitchSpread: 0.05, panSpread: 0.6,
      });
      oneShot(ctx, dest, 'kids-screaming', t0 + rnd(4, 9), {
        gain: rnd(0.35, 0.48) * vol, duration: rnd(1.5, 2.5),
        offset: rnd(0, 2), pitchSpread: 0.1, panSpread: 0.7,
      });
    },
  },
  {
    id: 'chd-4', label: 'pure chaos', duration: 10,
    schedule: (ctx, dest, t0, vol) => {
      ambientBed(ctx, dest, 'kindergarten', t0, 10, {
        gain: 0.48 * vol, fadeIn: 0.5, fadeOut: 0.6,
      });
      oneShot(ctx, dest, 'crying-baby', t0 + rnd(0, 4), {
        gain: rnd(0.4, 0.55) * vol, duration: rnd(3, 5),
        offset: rnd(0, 5), pitchSpread: 0.06, pan: rnd(-0.5, -0.1),
      });
      oneShot(ctx, dest, 'kids-screaming', t0 + rnd(2, 6), {
        gain: rnd(0.4, 0.55) * vol, duration: rnd(2, 3),
        offset: rnd(0, 2), pitchSpread: 0.12, pan: rnd(0.1, 0.5),
      });
      oneShot(ctx, dest, 'children-laughter', t0 + rnd(4, 9), {
        gain: rnd(0.35, 0.5) * vol, pitchSpread: 0.08, panSpread: 0.7,
      });
    },
  },
];

const coffeeCells = [
  { id: 'cof-0', label: 'silent', duration: 6, schedule: () => {} },
  {
    id: 'cof-1', label: 'a coffee being made', duration: 10,
    schedule: (ctx, dest, t0, vol) => {
      const id = pick(['italian-coffee-maker', 'nespresso']);
      oneShot(ctx, dest, id, t0 + rnd(1, 5), {
        gain: rnd(0.28, 0.42) * vol, duration: rnd(4, 7),
        offset: rnd(0, 5), pitchSpread: 0.04, panSpread: 0.5,
        fadeIn: 0.2, fadeOut: 0.5,
      });
    },
  },
  {
    id: 'cof-2', label: 'regular orders', duration: 10,
    schedule: (ctx, dest, t0, vol) => {
      oneShot(ctx, dest, 'italian-coffee-maker', t0 + rnd(0, 3), {
        gain: rnd(0.35, 0.48) * vol, duration: rnd(4, 6),
        offset: rnd(0, 5), pitchSpread: 0.04, pan: rnd(-0.5, 0),
        fadeIn: 0.2, fadeOut: 0.5,
      });
      oneShot(ctx, dest, 'nespresso', t0 + rnd(4, 8), {
        gain: rnd(0.32, 0.45) * vol, duration: rnd(3, 5),
        offset: rnd(0, 5), pitchSpread: 0.05, pan: rnd(0, 0.5),
        fadeIn: 0.2, fadeOut: 0.5,
      });
    },
  },
  {
    id: 'cof-3', label: 'busy bar', duration: 10,
    schedule: (ctx, dest, t0, vol) => {
      oneShot(ctx, dest, 'italian-coffee-maker', t0 + rnd(0, 2), {
        gain: rnd(0.38, 0.5) * vol, duration: rnd(5, 7),
        offset: rnd(0, 5), pitchSpread: 0.04, pan: rnd(-0.6, -0.1),
        fadeIn: 0.2, fadeOut: 0.5,
      });
      oneShot(ctx, dest, 'nespresso', t0 + rnd(2, 5), {
        gain: rnd(0.4, 0.5) * vol, duration: rnd(3, 5),
        offset: rnd(0, 5), pitchSpread: 0.05, pan: rnd(0.1, 0.6),
      });
      oneShot(ctx, dest, 'coffee-grinder', t0 + rnd(5, 8), {
        gain: rnd(0.35, 0.5) * vol, pitchSpread: 0.06, panSpread: 0.5,
      });
    },
  },
  {
    id: 'cof-4', label: 'morning rush', duration: 10,
    schedule: (ctx, dest, t0, vol) => {
      ambientBed(ctx, dest, 'italian-coffee-maker', t0, 10, {
        gain: 0.4 * vol, fadeIn: 0.5, fadeOut: 0.6, pitchSpread: 0.04,
      });
      ambientBed(ctx, dest, 'nespresso', t0 + 0.5, 9, {
        gain: 0.35 * vol, fadeIn: 0.6, fadeOut: 0.6, pan: rnd(-0.5, 0.5),
      });
      oneShot(ctx, dest, 'coffee-grinder', t0 + rnd(0, 4), {
        gain: rnd(0.42, 0.55) * vol, pitchSpread: 0.08, pan: rnd(-0.6, -0.1),
      });
      oneShot(ctx, dest, 'coffee-grinder', t0 + rnd(5, 9), {
        gain: rnd(0.38, 0.5) * vol, pitchSpread: 0.1, pan: rnd(0.1, 0.6),
      });
    },
  },
];

const ambienceCells = [
  { id: 'amb-0', label: 'silent', duration: 6, schedule: () => {} },
  {
    id: 'amb-1', label: 'distant escalator', duration: 12,
    schedule: (ctx, dest, t0, vol) => {
      ambientBed(ctx, dest, 'escalator', t0, 12, {
        gain: 0.2 * vol, fadeIn: 1.5, fadeOut: 1.5, pitchSpread: 0.03,
      });
    },
  },
  {
    id: 'amb-2', label: 'fountain nearby', duration: 12,
    schedule: (ctx, dest, t0, vol) => {
      ambientBed(ctx, dest, 'fountain', t0, 12, {
        gain: 0.3 * vol, fadeIn: 1.0, fadeOut: 1.0, pitchSpread: 0.03,
      });
      if (Math.random() < 0.5) {
        ambientBed(ctx, dest, 'escalator', t0 + 1, 10, {
          gain: 0.18 * vol, fadeIn: 1.2, fadeOut: 1.2, pan: rnd(-0.5, 0.5),
        });
      }
    },
  },
  {
    id: 'amb-3', label: 'full mall', duration: 12,
    schedule: (ctx, dest, t0, vol) => {
      ambientBed(ctx, dest, 'fountain', t0, 12, {
        gain: 0.35 * vol, fadeIn: 0.8, fadeOut: 0.8,
      });
      ambientBed(ctx, dest, 'escalator', t0 + 0.5, 11, {
        gain: 0.25 * vol, fadeIn: 1.0, fadeOut: 1.0, pan: rnd(-0.5, 0.5),
      });
    },
  },
  {
    id: 'amb-4', label: 'bustling complex', duration: 12,
    schedule: (ctx, dest, t0, vol) => {
      ambientBed(ctx, dest, 'fountain', t0, 12, {
        gain: 0.45 * vol, fadeIn: 0.6, fadeOut: 0.7,
      });
      ambientBed(ctx, dest, 'escalator', t0 + 0.3, 11, {
        gain: 0.38 * vol, fadeIn: 0.7, fadeOut: 0.8, pan: rnd(-0.6, 0.6),
      });
      ambientBed(ctx, dest, 'escalator', t0 + 1, 10, {
        gain: 0.25 * vol, fadeIn: 0.9, fadeOut: 0.9, pitch: rnd(0.96, 1.04),
        pan: rnd(-0.4, 0.4),
      });
    },
  },
];

// ---- Background visualization: warm-lit indoor food court ----

function initBackground(state, dpr) {
  // Ceiling lights — a row of dots
  state.ceilingLights = [];
  for (let i = 0; i < 16; i++) {
    state.ceilingLights.push({
      x: 0.05 + (i / 15) * 0.9,
      y: 0.06 + Math.random() * 0.04,
      flicker: Math.random() * Math.PI * 2,
    });
  }
  // Food kiosks — counter silhouettes with menu boards
  state.kiosks = [];
  let x = 0.0;
  while (x < 1.05) {
    const w = 0.10 + Math.random() * 0.06;
    state.kiosks.push({
      x,
      w,
      // top of counter is at y = 0.45-0.55 (varies by kiosk)
      counterTop: 0.50 + Math.random() * 0.07,
      // menu board sits ABOVE the counter
      menuTop: 0.20 + Math.random() * 0.08,
      menuBottom: 0.40 + Math.random() * 0.05,
      // each kiosk has a "menu intensity threshold"
      threshold: Math.random() * 0.8,
      // menu board color hue (warm reds, oranges, yellows)
      hue: Math.floor(rnd(15, 50)),
      // animated text "ticker" lines on the menu
      lineCount: 3 + Math.floor(Math.random() * 3),
    });
    x += w + 0.005;
  }
  // Tables in foreground — small dark blobs
  state.tables = [];
  for (let i = 0; i < 8; i++) {
    state.tables.push({
      x: 0.05 + (i / 8) * 0.95 + (Math.random() - 0.5) * 0.04,
      y: 0.78 + Math.random() * 0.05,
      r: 0.012 + Math.random() * 0.008,
    });
  }
}

function drawBackground(ctx, w, h, density, time, state, dpr) {
  // Indoor warm gradient — cream/beige top, deeper warm at floor level
  const grad = ctx.createLinearGradient(0, 0, 0, h);
  grad.addColorStop(0, `rgb(${Math.floor(40 + density * 40)},${Math.floor(34 + density * 34)},${Math.floor(28 + density * 22)})`);
  grad.addColorStop(0.55, `rgb(${Math.floor(60 + density * 50)},${Math.floor(48 + density * 32)},${Math.floor(34 + density * 16)})`);
  grad.addColorStop(1, `rgb(${Math.floor(28 + density * 18)},${Math.floor(22 + density * 12)},${Math.floor(18 + density * 8)})`);
  ctx.fillStyle = grad;
  ctx.fillRect(0, 0, w, h);

  // Ceiling lights — bright dots with halos
  for (const light of state.ceilingLights) {
    const lx = light.x * w;
    const ly = light.y * h;
    const flicker = 0.85 + 0.15 * Math.sin(time * 0.6 + light.flicker);
    const baseR = 6 * dpr;
    const haloR = (10 + density * 14) * dpr;
    const halo = ctx.createRadialGradient(lx, ly, 0, lx, ly, haloR);
    halo.addColorStop(0, `rgba(255, 230, 170, ${(0.45 + density * 0.35) * flicker})`);
    halo.addColorStop(1, 'rgba(255, 220, 160, 0)');
    ctx.fillStyle = halo;
    ctx.beginPath();
    ctx.arc(lx, ly, haloR, 0, Math.PI * 2);
    ctx.fill();
    ctx.fillStyle = `rgba(255, 240, 200, ${(0.85 + density * 0.15) * flicker})`;
    ctx.beginPath();
    ctx.arc(lx, ly, baseR, 0, Math.PI * 2);
    ctx.fill();
  }

  // Kiosk silhouettes with menu boards
  const horizonY = h * 0.65;
  for (const k of state.kiosks) {
    const kx = k.x * w;
    const kw = k.w * w;
    // Counter (lower part of kiosk)
    const counterY = k.counterTop * h;
    ctx.fillStyle = `rgba(${20 + density * 18}, ${14 + density * 14}, ${10 + density * 10}, 1)`;
    ctx.fillRect(kx, counterY, kw, h - counterY);

    // Menu board frame
    const menuY1 = k.menuTop * h;
    const menuY2 = k.menuBottom * h;
    const menuH = menuY2 - menuY1;
    // Frame
    ctx.fillStyle = `rgba(${15 + density * 10}, ${10 + density * 8}, ${8 + density * 6}, 1)`;
    ctx.fillRect(kx + 4 * dpr, menuY1, kw - 8 * dpr, menuH);

    // Menu lights up with density
    const litness = Math.max(0, density * 1.4 - k.threshold);
    if (litness > 0.02) {
      const intensity = Math.min(1, litness * 1.3);
      // Inner menu surface — warm hue
      const surfR = 200 + Math.floor(intensity * 55);
      const surfG = 100 + Math.floor(intensity * 90 + (50 - k.hue));
      const surfB = 40 + Math.floor((50 - k.hue) * intensity);
      ctx.fillStyle = `rgba(${surfR}, ${surfG}, ${surfB}, ${0.28 + intensity * 0.4})`;
      ctx.fillRect(kx + 8 * dpr, menuY1 + 4 * dpr, kw - 16 * dpr, menuH - 8 * dpr);

      // Menu "text lines" — horizontal bars
      const lineH = (menuH - 14 * dpr) / k.lineCount;
      for (let i = 0; i < k.lineCount; i++) {
        const ly = menuY1 + 8 * dpr + i * lineH + lineH * 0.3;
        const lineW = (kw - 20 * dpr) * (0.4 + Math.random() * 0.55);
        ctx.fillStyle = `rgba(255, 230, 180, ${(0.45 + intensity * 0.45) * (0.7 + 0.3 * Math.sin(time * 0.5 + i * 7 + k.x * 13))})`;
        ctx.fillRect(kx + 12 * dpr, ly, lineW, Math.max(1.5, lineH * 0.32));
      }
    }
  }

  // Faint floor reflections of menu lights
  ctx.save();
  ctx.globalAlpha = 0.06 + density * 0.1;
  for (const k of state.kiosks) {
    const kx = k.x * w;
    const kw = k.w * w;
    const litness = Math.max(0, density * 1.4 - k.threshold);
    if (litness > 0.05) {
      const fy = horizonY + (h - horizonY) * 0.55;
      const fr = ctx.createLinearGradient(kx, fy - 10 * dpr, kx, h);
      fr.addColorStop(0, `rgba(255, 200, 130, ${0.4 * litness})`);
      fr.addColorStop(1, 'rgba(255, 200, 130, 0)');
      ctx.fillStyle = fr;
      ctx.fillRect(kx, fy, kw, h - fy);
    }
  }
  ctx.restore();

  // Foreground tables (small dark blobs)
  for (const t of state.tables) {
    ctx.fillStyle = `rgba(${10 + density * 8}, ${8 + density * 6}, ${5 + density * 4}, 1)`;
    ctx.beginPath();
    ctx.ellipse(t.x * w, t.y * h, t.r * w * 0.7, t.r * w * 0.35, 0, 0, Math.PI * 2);
    ctx.fill();
  }
}

export const SCENE = {
  id: 'mall-food-court',
  label: 'Mall Food Court',
  performers: PERFORMERS,
  samples: SAMPLES,
  cellsByCategory: {
    crowd: crowdCells,
    dishes: dishesCells,
    registers: registersCells,
    kitchen: kitchenCells,
    children: childrenCells,
    coffee: coffeeCells,
    ambience: ambienceCells,
  },
  initBackground,
  drawBackground,
};
