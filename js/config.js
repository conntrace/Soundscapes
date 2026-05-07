// Soundscapes — runtime configuration.
//
// Scene-specific data (performer roster, sample manifest, cells) lives
// in js/scenes/. CONFIG holds runtime tunables and exposes the active
// scene via getters so other modules can pull through it.

import { ACTIVE_SCENE, ACTIVE_SCENE_ID } from './scenes/index.js';

export const CONFIG = {
  // Scene identity (read-only — flip via ?scene= URL param)
  get scene() { return ACTIVE_SCENE_ID; },
  get sceneLabel() { return ACTIVE_SCENE.label; },
  get performers() { return ACTIVE_SCENE.performers; },
  get performerCount() { return ACTIVE_SCENE.performers.length; },

  // Cells per performer (consistent across scenes for now)
  totalCells: 5,

  // Spread: most-advanced performer cannot be more than this many cells
  // beyond the least-advanced performer.
  maxSpread: 3,

  // 'hold' = stay at last cell once reached
  // 'wrap' = wrap back to cell 1
  // 'resetAll' = once everyone reaches the end, reset everyone to cell 1
  endBehavior: 'hold',

  // Master volume
  masterVolume: 0.7,

  // Demo mode tap probability per pulse
  demoTapProbability: 0.18,

  // The "global pulse" — base loop time. Individual cells can be longer
  // multiples of this.
  pulseSec: 4,
};
