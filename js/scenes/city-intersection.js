// Soundscapes — City Intersection scene.
// 7 performers: traffic ambient bed, horns, pedestrians, buses,
// sirens, construction, atmosphere.

import { oneShot, ambientBed } from '../sample-engine.js';

const rnd = (a, b) => a + Math.random() * (b - a);
const pick = (arr) => arr[Math.floor(Math.random() * arr.length)];

// ---- Sample manifest ----
const SAMPLES = {
  // Traffic beds
  'aubervilliers-street': { url: 'samples/city-intersection/aubervilliers-street.mp3' },
  'cheerful-street':      { url: 'samples/city-intersection/cheerful-street.mp3' },
  'paris-by-night':       { url: 'samples/city-intersection/paris-by-night.mp3' },
  'pedestrian-place':     { url: 'samples/city-intersection/pedestrian-place.mp3' },
  // Cars
  'car-passing':          { url: 'samples/city-intersection/car-passing.mp3' },
  'car-engine':           { url: 'samples/city-intersection/car-engine.mp3' },
  'car-departure':        { url: 'samples/city-intersection/car-departure.mp3' },
  'screeching-tires':     { url: 'samples/city-intersection/screeching-tires.mp3' },
  // Horns
  'car-horn-1':           { url: 'samples/city-intersection/car-horn-1.mp3' },
  'car-horn-2':           { url: 'samples/city-intersection/car-horn-2.mp3' },
  'horn-short':           { url: 'samples/city-intersection/horn-short.mp3' },
  'truck-horn':           { url: 'samples/city-intersection/truck-horn.mp3' },
  'pneumatic-horn':       { url: 'samples/city-intersection/pneumatic-horn.mp3' },
  // Sirens
  'vehicle-siren':        { url: 'samples/city-intersection/vehicle-siren.mp3' },
  'ambulance-siren':      { url: 'samples/city-intersection/ambulance-siren.mp3' },
  'ambulance-passage':    { url: 'samples/city-intersection/ambulance-passage.mp3' },
  'gendarmerie-passage':  { url: 'samples/city-intersection/gendarmerie-passage.mp3' },
  // Pedestrians
  'footsteps':            { url: 'samples/city-intersection/footsteps.mp3' },
  'fast-footsteps':       { url: 'samples/city-intersection/fast-footsteps.mp3' },
  // Buses & trucks
  'london-bus':           { url: 'samples/city-intersection/london-bus.mp3' },
  // Construction
  'jackhammer':           { url: 'samples/city-intersection/jackhammer.mp3' },
  'roadworks':            { url: 'samples/city-intersection/roadworks.mp3' },
  // Atmosphere
  'pigeons':              { url: 'samples/city-intersection/pigeons.mp3' },
  'motorcycle':           { url: 'samples/city-intersection/motorcycle.mp3' },
};

// ---- Performer roster ----
const PERFORMERS = [
  { id: 0, key: '1', name: 'Traffic',      color: '#9ec5e3', categoryId: 'traffic' },
  { id: 1, key: '2', name: 'Horns',        color: '#f4d35e', categoryId: 'horns' },
  { id: 2, key: '3', name: 'Pedestrians',  color: '#e3a76f', categoryId: 'pedestrians' },
  { id: 3, key: '4', name: 'Buses',        color: '#c97b63', categoryId: 'buses' },
  { id: 4, key: '5', name: 'Sirens',       color: '#e85a4f', categoryId: 'sirens' },
  { id: 5, key: '6', name: 'Construction', color: '#d8c382', categoryId: 'construction' },
  { id: 6, key: '7', name: 'Atmosphere',   color: '#7a708a', categoryId: 'atmosphere' },
];

// ---- Cells per category ----

const trafficCells = [
  { id: 'tra-0', label: 'silent', duration: 6, schedule: () => {} },
  {
    id: 'tra-1', label: 'distant traffic', duration: 10,
    schedule: (ctx, dest, t0, vol) => {
      ambientBed(ctx, dest, 'paris-by-night', t0, 10, {
        gain: 0.22 * vol, fadeIn: 1.5, fadeOut: 1.5, pitchSpread: 0.03,
      });
    },
  },
  {
    id: 'tra-2', label: 'flowing traffic', duration: 10,
    schedule: (ctx, dest, t0, vol) => {
      ambientBed(ctx, dest, 'cheerful-street', t0, 10, {
        gain: 0.32 * vol, fadeIn: 1.0, fadeOut: 1.0, pitchSpread: 0.03,
      });
      // a single car passing
      oneShot(ctx, dest, 'car-passing', t0 + rnd(2, 7), {
        gain: rnd(0.3, 0.45) * vol, pitchSpread: 0.08, panSpread: 0.7,
      });
    },
  },
  {
    id: 'tra-3', label: 'busy intersection', duration: 10,
    schedule: (ctx, dest, t0, vol) => {
      ambientBed(ctx, dest, 'aubervilliers-street', t0, 10, {
        gain: 0.42 * vol, fadeIn: 0.7, fadeOut: 0.7,
      });
      // 2-3 close passes
      for (let i = 0; i < 2; i++) {
        oneShot(ctx, dest, 'car-passing', t0 + rnd(0, 8), {
          gain: rnd(0.35, 0.5) * vol, pitchSpread: 0.1, panSpread: 0.7,
        });
      }
      if (Math.random() < 0.5) {
        oneShot(ctx, dest, 'car-departure', t0 + rnd(1, 6), {
          gain: rnd(0.3, 0.45) * vol, pitchSpread: 0.06, panSpread: 0.5,
        });
      }
    },
  },
  {
    id: 'tra-4', label: 'rush hour', duration: 10,
    schedule: (ctx, dest, t0, vol) => {
      ambientBed(ctx, dest, 'aubervilliers-street', t0, 10, {
        gain: 0.55 * vol, fadeIn: 0.4, fadeOut: 0.5,
      });
      ambientBed(ctx, dest, 'cheerful-street', t0 + 0.5, 9, {
        gain: 0.3 * vol, fadeIn: 0.6, fadeOut: 0.6, pan: rnd(-0.5, 0.5),
      });
      for (let i = 0; i < 3; i++) {
        oneShot(ctx, dest, 'car-passing', t0 + rnd(0, 9), {
          gain: rnd(0.4, 0.55) * vol, pitchSpread: 0.12, panSpread: 0.8,
        });
      }
      if (Math.random() < 0.4) {
        oneShot(ctx, dest, 'screeching-tires', t0 + rnd(2, 8), {
          gain: rnd(0.4, 0.55) * vol, pitchSpread: 0.1, panSpread: 0.7,
        });
      }
    },
  },
];

const hornsCells = [
  { id: 'hrn-0', label: 'silent', duration: 6, schedule: () => {} },
  {
    id: 'hrn-1', label: 'distant honk', duration: 10,
    schedule: (ctx, dest, t0, vol) => {
      const id = pick(['car-horn-1', 'car-horn-2', 'horn-short']);
      oneShot(ctx, dest, id, t0 + rnd(3, 7), {
        gain: rnd(0.22, 0.35) * vol, pitchSpread: 0.08, panSpread: 0.7,
      });
    },
  },
  {
    id: 'hrn-2', label: 'occasional honks', duration: 10,
    schedule: (ctx, dest, t0, vol) => {
      const horns = ['car-horn-1', 'car-horn-2', 'horn-short'];
      const count = Math.floor(rnd(2, 4));
      for (let i = 0; i < count; i++) {
        oneShot(ctx, dest, pick(horns), t0 + rnd(0, 9), {
          gain: rnd(0.3, 0.45) * vol, pitchSpread: 0.12, panSpread: 0.7,
        });
      }
    },
  },
  {
    id: 'hrn-3', label: 'impatient drivers', duration: 10,
    schedule: (ctx, dest, t0, vol) => {
      const horns = ['car-horn-1', 'car-horn-2', 'horn-short', 'pneumatic-horn'];
      const count = Math.floor(rnd(4, 6));
      for (let i = 0; i < count; i++) {
        oneShot(ctx, dest, pick(horns), t0 + rnd(0, 9), {
          gain: rnd(0.35, 0.55) * vol, pitchSpread: 0.15, panSpread: 0.8,
        });
      }
    },
  },
  {
    id: 'hrn-4', label: 'gridlock', duration: 10,
    schedule: (ctx, dest, t0, vol) => {
      const horns = ['car-horn-1', 'car-horn-2', 'horn-short', 'pneumatic-horn', 'truck-horn'];
      const count = Math.floor(rnd(7, 10));
      for (let i = 0; i < count; i++) {
        oneShot(ctx, dest, pick(horns), t0 + rnd(0, 9), {
          gain: rnd(0.4, 0.6) * vol, pitchSpread: 0.18, panSpread: 0.85,
        });
      }
      // a big truck horn for emphasis
      oneShot(ctx, dest, 'truck-horn', t0 + rnd(2, 7), {
        gain: rnd(0.5, 0.65) * vol, pitchSpread: 0.05, panSpread: 0.5,
      });
    },
  },
];

const pedestriansCells = [
  { id: 'ped-0', label: 'silent', duration: 6, schedule: () => {} },
  {
    id: 'ped-1', label: 'a passerby', duration: 10,
    schedule: (ctx, dest, t0, vol) => {
      oneShot(ctx, dest, 'footsteps', t0 + rnd(1, 6), {
        gain: rnd(0.32, 0.48) * vol, duration: rnd(2.5, 4),
        offset: rnd(0, 4), pitchSpread: 0.06, fadeIn: 0.15, fadeOut: 0.5,
      });
    },
  },
  {
    id: 'ped-2', label: 'walking by', duration: 10,
    schedule: (ctx, dest, t0, vol) => {
      oneShot(ctx, dest, 'footsteps', t0 + rnd(0, 2), {
        gain: rnd(0.4, 0.55) * vol, duration: rnd(4, 6),
        offset: rnd(0, 4), pan: rnd(-0.6, -0.1), pitchSpread: 0.05, fadeIn: 0.2, fadeOut: 0.5,
      });
      oneShot(ctx, dest, 'fast-footsteps', t0 + rnd(3, 6), {
        gain: rnd(0.32, 0.45) * vol, duration: rnd(2, 3.5),
        offset: rnd(0, 4), pan: rnd(0.1, 0.6), pitchSpread: 0.07, fadeIn: 0.15, fadeOut: 0.4,
      });
    },
  },
  {
    id: 'ped-3', label: 'morning rush', duration: 10,
    schedule: (ctx, dest, t0, vol) => {
      ambientBed(ctx, dest, 'pedestrian-place', t0, 10, {
        gain: 0.32 * vol, fadeIn: 0.8, fadeOut: 0.8,
      });
      oneShot(ctx, dest, 'fast-footsteps', t0 + rnd(0, 3), {
        gain: rnd(0.35, 0.5) * vol, duration: rnd(3, 5), offset: rnd(0, 4),
        pan: rnd(-0.7, -0.2), pitchSpread: 0.06, fadeIn: 0.15, fadeOut: 0.5,
      });
      oneShot(ctx, dest, 'footsteps', t0 + rnd(2, 6), {
        gain: rnd(0.32, 0.45) * vol, duration: rnd(2.5, 4), offset: rnd(0, 4),
        pan: rnd(0.2, 0.7), pitchSpread: 0.06, fadeIn: 0.15, fadeOut: 0.4,
      });
    },
  },
  {
    id: 'ped-4', label: 'crowded crossing', duration: 10,
    schedule: (ctx, dest, t0, vol) => {
      ambientBed(ctx, dest, 'pedestrian-place', t0, 10, {
        gain: 0.5 * vol, fadeIn: 0.5, fadeOut: 0.6,
      });
      // Two overlapping fast-footsteps + one shoe-on-concrete
      oneShot(ctx, dest, 'fast-footsteps', t0 + rnd(0, 2), {
        gain: rnd(0.4, 0.55) * vol, duration: rnd(4, 6), offset: rnd(0, 4),
        pan: rnd(-0.7, -0.3), pitchSpread: 0.07, fadeIn: 0.15, fadeOut: 0.5,
      });
      oneShot(ctx, dest, 'fast-footsteps', t0 + rnd(2, 5), {
        gain: rnd(0.4, 0.55) * vol, duration: rnd(3.5, 5.5), offset: rnd(0, 4),
        pan: rnd(0.3, 0.7), pitchSpread: 0.08, fadeIn: 0.15, fadeOut: 0.5,
      });
      oneShot(ctx, dest, 'footsteps', t0 + rnd(1, 7), {
        gain: rnd(0.35, 0.5) * vol, duration: rnd(2.5, 4), offset: rnd(0, 4),
        pan: rnd(-0.3, 0.3), pitchSpread: 0.05, fadeIn: 0.15, fadeOut: 0.4,
      });
    },
  },
];

const busesCells = [
  { id: 'bus-0', label: 'silent', duration: 6, schedule: () => {} },
  {
    id: 'bus-1', label: 'distant rumble', duration: 10,
    schedule: (ctx, dest, t0, vol) => {
      ambientBed(ctx, dest, 'london-bus', t0, 10, {
        gain: 0.2 * vol, fadeIn: 1.5, fadeOut: 1.5, pitch: rnd(0.92, 0.98),
      });
    },
  },
  {
    id: 'bus-2', label: 'bus passing', duration: 10,
    schedule: (ctx, dest, t0, vol) => {
      ambientBed(ctx, dest, 'london-bus', t0, 10, {
        gain: 0.35 * vol, fadeIn: 0.6, fadeOut: 0.8,
      });
      if (Math.random() < 0.6) {
        oneShot(ctx, dest, 'truck-horn', t0 + rnd(3, 7), {
          gain: rnd(0.3, 0.45) * vol, pitchSpread: 0.08, panSpread: 0.5,
        });
      }
    },
  },
  {
    id: 'bus-3', label: 'heavy traffic', duration: 10,
    schedule: (ctx, dest, t0, vol) => {
      ambientBed(ctx, dest, 'london-bus', t0, 10, {
        gain: 0.45 * vol, fadeIn: 0.4, fadeOut: 0.6,
      });
      oneShot(ctx, dest, 'truck-horn', t0 + rnd(1, 5), {
        gain: rnd(0.4, 0.55) * vol, pitchSpread: 0.06, panSpread: 0.4,
      });
      if (Math.random() < 0.5) {
        oneShot(ctx, dest, 'pneumatic-horn', t0 + rnd(4, 8), {
          gain: rnd(0.35, 0.5) * vol, pitchSpread: 0.08, panSpread: 0.6,
        });
      }
    },
  },
  {
    id: 'bus-4', label: 'depot chaos', duration: 10,
    schedule: (ctx, dest, t0, vol) => {
      ambientBed(ctx, dest, 'london-bus', t0, 10, {
        gain: 0.55 * vol, fadeIn: 0.3, fadeOut: 0.5,
      });
      ambientBed(ctx, dest, 'london-bus', t0 + rnd(1, 3), 8, {
        gain: 0.35 * vol, fadeIn: 0.5, fadeOut: 0.6, pan: rnd(-0.6, 0.6), pitch: rnd(0.95, 1.05),
      });
      oneShot(ctx, dest, 'truck-horn', t0 + rnd(0, 4), {
        gain: rnd(0.45, 0.6) * vol, pitchSpread: 0.06,
      });
      oneShot(ctx, dest, 'pneumatic-horn', t0 + rnd(4, 9), {
        gain: rnd(0.4, 0.55) * vol, pitchSpread: 0.08, panSpread: 0.6,
      });
    },
  },
];

const sirensCells = [
  { id: 'sir-0', label: 'silent', duration: 8, schedule: () => {} },
  {
    id: 'sir-1', label: 'distant siren', duration: 12,
    schedule: (ctx, dest, t0, vol) => {
      const id = pick(['vehicle-siren', 'ambulance-siren']);
      oneShot(ctx, dest, id, t0 + rnd(1, 5), {
        gain: rnd(0.2, 0.32) * vol, pitch: rnd(0.85, 0.95), pitchSpread: 0,
        duration: rnd(4, 6), offset: rnd(0, 2), fadeIn: 0.5, fadeOut: 1.0, panSpread: 0.7,
      });
    },
  },
  {
    id: 'sir-2', label: 'approaching siren', duration: 12,
    schedule: (ctx, dest, t0, vol) => {
      const id = pick(['gendarmerie-passage', 'ambulance-passage']);
      oneShot(ctx, dest, id, t0 + rnd(1, 4), {
        gain: rnd(0.4, 0.55) * vol, duration: rnd(7, 9), offset: 0,
        fadeIn: 0.3, fadeOut: 0.8, panSpread: 0.5,
      });
    },
  },
  {
    id: 'sir-3', label: 'emergency', duration: 12,
    schedule: (ctx, dest, t0, vol) => {
      oneShot(ctx, dest, 'ambulance-passage', t0 + rnd(0, 2), {
        gain: rnd(0.5, 0.65) * vol, duration: rnd(8, 11), offset: 0,
        fadeIn: 0.2, fadeOut: 0.8, panSpread: 0.6,
      });
      oneShot(ctx, dest, 'vehicle-siren', t0 + rnd(3, 7), {
        gain: rnd(0.35, 0.5) * vol, duration: rnd(4, 6), offset: rnd(0, 2),
        pan: rnd(-0.7, -0.3), fadeIn: 0.2, fadeOut: 0.6,
      });
    },
  },
  {
    id: 'sir-4', label: 'multiple sirens', duration: 12,
    schedule: (ctx, dest, t0, vol) => {
      oneShot(ctx, dest, 'gendarmerie-passage', t0, {
        gain: rnd(0.5, 0.65) * vol, duration: rnd(8, 11), offset: 0,
        pan: rnd(-0.6, -0.3), fadeIn: 0.2, fadeOut: 0.7,
      });
      oneShot(ctx, dest, 'ambulance-passage', t0 + rnd(1, 3), {
        gain: rnd(0.5, 0.65) * vol, duration: rnd(8, 10), offset: 0,
        pan: rnd(0.3, 0.6), fadeIn: 0.3, fadeOut: 0.7,
      });
      oneShot(ctx, dest, 'vehicle-siren', t0 + rnd(4, 8), {
        gain: rnd(0.4, 0.55) * vol, duration: rnd(3, 5), offset: rnd(0, 2),
        fadeIn: 0.2, fadeOut: 0.5, panSpread: 0.6,
      });
    },
  },
];

const constructionCells = [
  { id: 'con-0', label: 'silent', duration: 6, schedule: () => {} },
  {
    id: 'con-1', label: 'distant works', duration: 10,
    schedule: (ctx, dest, t0, vol) => {
      ambientBed(ctx, dest, 'roadworks', t0, 10, {
        gain: 0.2 * vol, fadeIn: 1.5, fadeOut: 1.5, pitch: rnd(0.95, 1.0),
      });
    },
  },
  {
    id: 'con-2', label: 'nearby works', duration: 10,
    schedule: (ctx, dest, t0, vol) => {
      ambientBed(ctx, dest, 'roadworks', t0, 10, {
        gain: 0.32 * vol, fadeIn: 0.8, fadeOut: 0.8,
      });
      if (Math.random() < 0.5) {
        oneShot(ctx, dest, 'jackhammer', t0 + rnd(2, 6), {
          gain: rnd(0.25, 0.4) * vol, duration: rnd(2, 3.5), offset: rnd(0, 4),
          fadeIn: 0.1, fadeOut: 0.4, panSpread: 0.5, pitchSpread: 0.04,
        });
      }
    },
  },
  {
    id: 'con-3', label: 'jackhammer', duration: 10,
    schedule: (ctx, dest, t0, vol) => {
      ambientBed(ctx, dest, 'jackhammer', t0, 10, {
        gain: 0.4 * vol, fadeIn: 0.4, fadeOut: 0.6,
      });
      ambientBed(ctx, dest, 'roadworks', t0 + 0.5, 9, {
        gain: 0.25 * vol, fadeIn: 0.6, fadeOut: 0.6, pan: rnd(-0.4, 0.4),
      });
    },
  },
  {
    id: 'con-4', label: 'demolition', duration: 10,
    schedule: (ctx, dest, t0, vol) => {
      ambientBed(ctx, dest, 'jackhammer', t0, 10, {
        gain: 0.55 * vol, fadeIn: 0.2, fadeOut: 0.5,
      });
      ambientBed(ctx, dest, 'roadworks', t0 + 0.3, 9, {
        gain: 0.4 * vol, fadeIn: 0.4, fadeOut: 0.5, pan: rnd(-0.5, 0.5),
        pitch: rnd(0.97, 1.03),
      });
    },
  },
];

const atmosphereCells = [
  { id: 'atm-0', label: 'silent', duration: 8, schedule: () => {} },
  {
    id: 'atm-1', label: 'pigeons', duration: 10,
    schedule: (ctx, dest, t0, vol) => {
      oneShot(ctx, dest, 'pigeons', t0 + rnd(2, 5), {
        gain: rnd(0.3, 0.45) * vol, duration: rnd(3, 5), offset: rnd(0, 3),
        fadeIn: 0.2, fadeOut: 0.5, panSpread: 0.6, pitchSpread: 0.08,
      });
    },
  },
  {
    id: 'atm-2', label: 'distant motorcycle', duration: 10,
    schedule: (ctx, dest, t0, vol) => {
      oneShot(ctx, dest, 'motorcycle', t0 + rnd(1, 4), {
        gain: rnd(0.32, 0.45) * vol, duration: rnd(4, 6), offset: rnd(0, 3),
        fadeIn: 0.3, fadeOut: 0.6, panSpread: 0.7,
      });
      if (Math.random() < 0.5) {
        oneShot(ctx, dest, 'pigeons', t0 + rnd(4, 8), {
          gain: rnd(0.25, 0.38) * vol, duration: rnd(2, 4), offset: rnd(0, 3),
          fadeIn: 0.2, fadeOut: 0.4,
        });
      }
    },
  },
  {
    id: 'atm-3', label: 'street alive', duration: 10,
    schedule: (ctx, dest, t0, vol) => {
      ambientBed(ctx, dest, 'paris-by-night', t0, 10, {
        gain: 0.25 * vol, fadeIn: 0.8, fadeOut: 0.8,
      });
      oneShot(ctx, dest, 'motorcycle', t0 + rnd(1, 5), {
        gain: rnd(0.4, 0.55) * vol, duration: rnd(4, 6), offset: rnd(0, 3),
        fadeIn: 0.2, fadeOut: 0.5, panSpread: 0.7,
      });
      oneShot(ctx, dest, 'pigeons', t0 + rnd(4, 8), {
        gain: rnd(0.3, 0.45) * vol, duration: rnd(2.5, 4), offset: rnd(0, 3),
        fadeIn: 0.15, fadeOut: 0.4, panSpread: 0.7,
      });
    },
  },
  {
    id: 'atm-4', label: 'urban roar', duration: 10,
    schedule: (ctx, dest, t0, vol) => {
      ambientBed(ctx, dest, 'paris-by-night', t0, 10, {
        gain: 0.4 * vol, fadeIn: 0.5, fadeOut: 0.6,
      });
      oneShot(ctx, dest, 'motorcycle', t0 + rnd(0, 3), {
        gain: rnd(0.5, 0.65) * vol, duration: rnd(5, 7), offset: rnd(0, 3),
        fadeIn: 0.15, fadeOut: 0.5, pan: rnd(-0.7, -0.2),
      });
      oneShot(ctx, dest, 'motorcycle', t0 + rnd(4, 8), {
        gain: rnd(0.4, 0.55) * vol, duration: rnd(3, 5), offset: rnd(0, 3),
        fadeIn: 0.15, fadeOut: 0.5, pan: rnd(0.2, 0.7), pitchSpread: 0.05,
      });
      oneShot(ctx, dest, 'pigeons', t0 + rnd(2, 8), {
        gain: rnd(0.32, 0.48) * vol, duration: rnd(2, 3.5), offset: rnd(0, 3),
        fadeIn: 0.15, fadeOut: 0.4,
      });
    },
  },
];

// ---- Background visualization: night city skyline + lit windows ----

function initBackground(state, dpr) {
  // Stars (faintly visible through light pollution)
  state.stars = [];
  for (let i = 0; i < 30; i++) {
    state.stars.push({
      x: Math.random(),
      y: Math.random() * 0.4,
      b: 0.2 + Math.random() * 0.5,
      twinkle: Math.random() * Math.PI * 2,
    });
  }
  // Building grid: each building has x, width, height, and a 2D grid of windows
  state.buildings = [];
  let x = 0;
  while (x < 1.05) {
    const w = 0.04 + Math.random() * 0.10;
    const h = 0.18 + Math.random() * 0.42;
    const cols = Math.max(2, Math.floor(w * 60));
    const rows = Math.max(4, Math.floor(h * 40));
    const windows = [];
    for (let r = 0; r < rows; r++) {
      for (let c = 0; c < cols; c++) {
        windows.push({
          col: c, row: r,
          // Each window has a "lit threshold" — when density exceeds it the window lights up
          threshold: Math.random(),
          flicker: Math.random() * Math.PI * 2,
          flickerRate: 0.3 + Math.random() * 1.5,
        });
      }
    }
    state.buildings.push({ x, w, h, cols, rows, windows });
    x += w + 0.005;
  }
}

function drawBackground(ctx, w, h, density, time, state, dpr) {
  // Sky gradient: deep night → orange-tinted urban glow as density grows
  const r1 = Math.floor(8 + density * 28);
  const g1 = Math.floor(10 + density * 22);
  const b1 = Math.floor(18 + density * 30);
  const r2 = Math.floor(22 + density * 90);
  const g2 = Math.floor(20 + density * 50);
  const b2 = Math.floor(28 + density * 30);
  const grad = ctx.createLinearGradient(0, 0, 0, h * 0.7);
  grad.addColorStop(0, `rgb(${r1},${g1},${b1})`);
  grad.addColorStop(1, `rgb(${r2},${g2},${b2})`);
  ctx.fillStyle = grad;
  ctx.fillRect(0, 0, w, h * 0.7);

  // Faint stars
  const visibility = Math.max(0, 0.6 - density * 0.6);
  if (visibility > 0.02) {
    for (const s of state.stars) {
      const tw = 0.5 + 0.5 * Math.sin(time * 1.5 + s.twinkle);
      const alpha = visibility * s.b * (0.4 + 0.6 * tw);
      ctx.fillStyle = `rgba(220, 220, 230, ${alpha})`;
      ctx.fillRect(s.x * w, s.y * h * 0.7, 1.2 * dpr, 1.2 * dpr);
    }
  }

  // Moon (always visible, slightly cool)
  const moonX = w * 0.18;
  const moonY = h * 0.18;
  const moonR = 14 * dpr;
  const moonGrad = ctx.createRadialGradient(moonX, moonY, 0, moonX, moonY, moonR * 3);
  moonGrad.addColorStop(0, `rgba(220, 226, 235, ${0.4 - density * 0.2})`);
  moonGrad.addColorStop(0.5, `rgba(180, 190, 210, ${0.15 - density * 0.1})`);
  moonGrad.addColorStop(1, 'rgba(180, 190, 210, 0)');
  ctx.fillStyle = moonGrad;
  ctx.beginPath();
  ctx.arc(moonX, moonY, moonR * 3, 0, Math.PI * 2);
  ctx.fill();
  ctx.fillStyle = `rgba(230, 232, 240, ${0.65 - density * 0.3})`;
  ctx.beginPath();
  ctx.arc(moonX, moonY, moonR, 0, Math.PI * 2);
  ctx.fill();

  // Building silhouettes with lit windows
  const horizonY = h * 0.7;
  for (const b of state.buildings) {
    const bx = b.x * w;
    const bw = b.w * w;
    const bh = b.h * h;
    const by = horizonY - bh;

    // Building body
    ctx.fillStyle = `rgba(${6 + density * 8}, ${8 + density * 10}, ${14 + density * 12}, 1)`;
    ctx.fillRect(bx, by, bw, bh + 1);

    // Windows: increasingly lit with density
    const winW = bw / b.cols;
    const winH = bh / b.rows;
    const winInset = Math.max(0.5, winW * 0.18);
    for (const win of b.windows) {
      // Window is lit when density exceeds its threshold
      // (window threshold ranges 0..1 — at density=0 a few are pre-lit; at density=1 most are on)
      const litness = Math.max(0, density * 1.3 - win.threshold);
      if (litness <= 0) continue;
      // Subtle flicker
      const flicker = 0.85 + 0.15 * Math.sin(time * win.flickerRate + win.flicker);
      const alpha = Math.min(1, litness * 1.2) * flicker;
      // Warm yellow window light
      ctx.fillStyle = `rgba(255, 210, 130, ${alpha * 0.85})`;
      const wx = bx + win.col * winW + winInset;
      const wy = by + win.row * winH + winInset;
      const ww = Math.max(1, winW - winInset * 2);
      const wh = Math.max(1, winH - winInset * 2);
      ctx.fillRect(wx, wy, ww, wh);
    }
  }

  // Street-level glow at horizon (sodium streetlight bloom)
  const glowGrad = ctx.createLinearGradient(0, horizonY - 30 * dpr, 0, horizonY);
  glowGrad.addColorStop(0, 'rgba(255, 180, 100, 0)');
  glowGrad.addColorStop(1, `rgba(255, 180, 100, ${0.18 + density * 0.18})`);
  ctx.fillStyle = glowGrad;
  ctx.fillRect(0, horizonY - 30 * dpr, w, 30 * dpr);

  // Asphalt foreground
  ctx.fillStyle = '#0a0c10';
  ctx.fillRect(0, horizonY, w, h - horizonY);
}

export const SCENE = {
  id: 'city-intersection',
  label: 'City Intersection',
  performers: PERFORMERS,
  samples: SAMPLES,
  cellsByCategory: {
    traffic: trafficCells,
    horns: hornsCells,
    pedestrians: pedestriansCells,
    buses: busesCells,
    sirens: sirensCells,
    construction: constructionCells,
    atmosphere: atmosphereCells,
  },
  initBackground,
  drawBackground,
};
