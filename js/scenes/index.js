// Soundscapes — scene registry & active-scene resolution.
//
// The active scene is selected by the `?scene=<id>` URL parameter.
// Defaults to 'forest-dawn' if absent or unknown.

import { SCENE as forestDawn } from './forest-dawn.js';
import { SCENE as cityIntersection } from './city-intersection.js';
import { SCENE as mallFoodCourt } from './mall-food-court.js';

export const SCENES = {
  'forest-dawn': forestDawn,
  'city-intersection': cityIntersection,
  'mall-food-court': mallFoodCourt,
};

export const SCENE_ORDER = ['forest-dawn', 'city-intersection', 'mall-food-court'];

function resolveSceneId() {
  const params = new URLSearchParams(window.location.search);
  const id = params.get('scene');
  if (id && SCENES[id]) return id;
  return 'forest-dawn';
}

export const ACTIVE_SCENE_ID = resolveSceneId();
export const ACTIVE_SCENE = SCENES[ACTIVE_SCENE_ID];

export function navigateToScene(id) {
  if (!SCENES[id]) return;
  const url = new URL(window.location.href);
  url.searchParams.set('scene', id);
  window.location.href = url.toString();
}
