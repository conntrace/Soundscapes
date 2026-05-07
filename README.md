# Soundscapes

Generative environmental soundscapes — an audience-driven evolving scene in the spirit of Terry Riley's *In C*.

A companion to [in-c-audience-ensemble](https://github.com/conntrace/in-c-audience-ensemble). Same idea: a small group of "performers" each loop independently, advancing through a cell-by-cell progression at the audience's pace. Spread rules keep them roughly together; randomness inside every cell guarantees no two performances are alike.

But instead of musical patterns, every performer is a sonic *layer* in a scene, and "advancing" means deepening their density and intensity inside that layer. All sounds are real CC0 field recordings from [BigSoundBank](https://bigsoundbank.com/) (see [samples/CREDITS.md](samples/CREDITS.md)). Per-loop random pitch, pan, gain, and start-offset variation guarantees no two plays sound identical.

## Scenes

Switch via the operator panel (**Operator** → **Scene**) or the `?scene=<id>` URL parameter.

### Forest at Dawn — `?scene=forest-dawn`

Seven performers; visualization fades pre-dawn night sky to warm sunrise as the ensemble fills out, with stars and tree silhouettes.

| Performer | Cells |
|---|---|
| Birds | silence → distant chirp → two voices → overlapping calls → dawn chorus |
| Wind | silence → faint rustle → breeze → wind in trees → gusts in canopy |
| Water | silence → distant trickle → small stream → brook → cascade |
| Insects | silence → lone cricket → several crickets → cricket chorus → full chorus |
| Amphibians | silence → distant croak → trading frogs → pond chorus → peak chorus |
| Leaves | silence → footstep → someone walking → movement nearby → something moves |
| Atmosphere | silence → distant rumble → owl hoot → thunder+owl → storm closer |

### City Intersection — `?scene=city-intersection`

Seven performers; visualization shows a night skyline with apartment windows lighting up as density grows, plus a low moon and street-level sodium glow.

| Performer | Cells |
|---|---|
| Traffic | silence → distant traffic → flowing traffic → busy intersection → rush hour |
| Horns | silence → distant honk → occasional honks → impatient drivers → gridlock |
| Pedestrians | silence → a passerby → walking by → morning rush → crowded crossing |
| Buses | silence → distant rumble → bus passing → heavy traffic → depot chaos |
| Sirens | silence → distant siren → approaching siren → emergency → multiple sirens |
| Construction | silence → distant works → nearby works → jackhammer → demolition |
| Atmosphere | silence → pigeons → distant motorcycle → street alive → urban roar |

### Mall Food Court — `?scene=mall-food-court`

Seven performers; visualization shows a warm fluorescent-lit indoor scene with food kiosk silhouettes whose menu boards progressively light up (warm reds and oranges) as density grows, plus a row of bright ceiling pendant lights and dark table blobs in the foreground.

| Performer | Cells |
|---|---|
| Crowd | silence → distant murmur → small group → busy lunch → peak crowd |
| Dishes | silence → someone clears → tray drops → busy bussing → lunch rush |
| Registers | silence → a beep → busy register → full row → rush |
| Kitchen | silence → faint sizzle → cooking → busy kitchen → lunch rush |
| Children | silence → a kid in the distance → laughter → kids being kids → pure chaos |
| Coffee | silence → a coffee being made → regular orders → busy bar → morning rush |
| Ambience | silence → distant escalator → fountain nearby → full mall → bustling complex |

## How to run

It's a static site — no build step.

```bash
# from the repo root
python3 -m http.server 5500
# then open http://localhost:5500
```

Click **Play** to start the auto-evolving demo, or press **Space** then tap individual performer buttons to drive the soundscape yourself. Press **D** to toggle demo mode; **Escape** opens the operator panel.

## Architecture

```
js/
  app.js                — bootstrap + main loop
  config.js             — runtime settings; pulls performer roster from active scene
  sample-engine.js      — AudioBuffer cache + oneShot/ambientBed playback primitives
  sound-cells.js        — re-exports active scene's cell library
  performer.js          — single performer state machine
  ensemble.js           — manages all performers, spread + deadlock rules
  clock.js              — global tempo / loop pulse
  audio-engine.js       — per-performer cell scheduling, master bus + reverb
  button-controller.js  — audience input
  scene-display.js      — visualization shell, delegates background to scene
  operator-panel.js     — admin / config UI, scene selector
  demo-mode.js          — autonomous advance heuristic
  scenes/
    index.js            — scene registry + URL-param resolution
    forest-dawn.js      — performers, samples, cells, background renderer
    city-intersection.js — same shape, different scene

samples/
  forest-dawn/          — CC0 MP3 field recordings for the forest scene
  city-intersection/    — CC0 MP3 field recordings for the city scene
  CREDITS.md            — every file with its BigSoundBank ID + source URL
```

The performer / ensemble / spread-and-deadlock logic is a direct port from In C. The audio layer is sample-based: each cell is a *recipe* (function) that, given an audio context and a start time, schedules a randomized set of sample playbacks across one loop period. Pitch, pan, gain, and sample start-offset are randomized inside the recipe so two plays of the same cell never sound identical.

### Adding a new scene

1. Create `js/scenes/<your-scene>.js` exporting a `SCENE` object: `{ id, label, performers, samples, cellsByCategory, initBackground?, drawBackground? }`. Each performer needs a `categoryId` matching a key in `cellsByCategory`. Each category is an array of cells (`{ id, label, duration, schedule(ctx, dest, t0, vol) }`); cell `0` should be silence.
2. Drop your CC0 MP3s into `samples/<your-scene>/` and add their entries to your scene's `samples` map.
3. Register the scene in [js/scenes/index.js](js/scenes/index.js): import it, add to `SCENES`, append to `SCENE_ORDER`.
4. Add a row to [samples/CREDITS.md](samples/CREDITS.md).

The performer count, cell count, spread rules, and visualization wiring are all driven from the active scene's exports — no other code needs to change.

## Why

Live installations and ambient pieces. The mathematical bones of *In C* — independent loopers + spread constraint + opening gate + per-performer audience-button advance — turn out to be a fantastic engine for any layered, evolving scene, not just music.

## License

MIT.
