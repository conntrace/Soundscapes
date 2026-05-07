// Soundscapes — runtime configuration

export const CONFIG = {
  scene: 'forest-dawn',
  sceneLabel: 'Forest at Dawn',

  // 8 performers, each is a sound layer category
  performerCount: 8,

  performers: [
    { id: 0, key: '1', name: 'Birds',      color: '#f4d35e', categoryId: 'birds' },
    { id: 1, key: '2', name: 'Wind',       color: '#a4c2c6', categoryId: 'wind' },
    { id: 2, key: '3', name: 'Water',      color: '#5da9e9', categoryId: 'water' },
    { id: 3, key: '4', name: 'Insects',    color: '#c1d36b', categoryId: 'insects' },
    { id: 4, key: '5', name: 'Amphibians', color: '#8b9d4e', categoryId: 'amphibians' },
    { id: 5, key: '6', name: 'Leaves',     color: '#b08968', categoryId: 'leaves' },
    { id: 6, key: '7', name: 'Atmosphere', color: '#7a708a', categoryId: 'atmosphere' },
    { id: 7, key: '8', name: 'Creatures',  color: '#c97b63', categoryId: 'creatures' },
  ],

  // Cells per performer (used by ensemble for end-of-progression)
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
  // multiples of this. 4-second pulse keeps things slow and ambient.
  pulseSec: 4,
};
