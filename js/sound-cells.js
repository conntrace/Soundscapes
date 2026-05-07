// Soundscapes — cell library proxy.
//
// Re-exports the cell library from the active scene. Performer state
// machines and the audio engine call getCell()/getCells() through here
// without needing to know which scene is running.

import { ACTIVE_SCENE } from './scenes/index.js';

export const CELLS_BY_CATEGORY = ACTIVE_SCENE.cellsByCategory;

export function getCells(categoryId) {
  return CELLS_BY_CATEGORY[categoryId];
}

export function getCell(categoryId, cellIndex) {
  const cells = CELLS_BY_CATEGORY[categoryId];
  if (!cells) return null;
  return cells[Math.max(0, Math.min(cellIndex, cells.length - 1))];
}
