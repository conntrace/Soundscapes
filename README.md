# Soundscapes

Generative environmental soundscapes — an audience-driven evolving scene in the spirit of Terry Riley's *In C*.

A companion to [in-c-audience-ensemble](https://github.com/conntrace/in-c-audience-ensemble). Same idea: a small group of "performers" each loop independently, advancing through a cell-by-cell progression at the audience's pace. Spread rules keep them roughly together; randomness inside every cell guarantees no two performances are alike.

But instead of musical patterns, every performer is a sonic *layer* in a natural scene — birds, wind, water, insects, amphibians, leaves, atmosphere, ground creatures — and "advancing" means deepening their density and intensity inside that layer.

## First scene

**Forest at Dawn** — seven performers, five cells each. All sounds are real CC0 field recordings from [BigSoundBank](https://bigsoundbank.com/), bundled in `samples/` (see [samples/CREDITS.md](samples/CREDITS.md)). Per-loop random pitch, pan, gain, and start-offset variation guarantees no two plays sound identical.

| Performer | Cells progress through |
|---|---|
| Birds | silence → distant chirp → two voices → overlapping calls → dawn chorus |
| Wind | silence → faint rustle → breeze → wind in trees → gusts in canopy |
| Water | silence → distant trickle → small stream → brook → cascade |
| Insects | silence → lone cricket → several crickets → cricket chorus → full chorus |
| Amphibians | silence → distant croak → trading frogs → pond chorus → peak chorus |
| Leaves | silence → footstep → someone walking → movement nearby → something moves |
| Atmosphere | silence → distant rumble → owl hoot → thunder+owl → storm closer |

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
  config.js             — performer roster, scene settings
  sample-engine.js      — sample manifest, AudioBuffer cache, playback primitives
  sound-cells.js        — cell definitions per performer (the "score")
  performer.js          — single performer state machine
  ensemble.js           — manages all performers, spread + deadlock rules
  clock.js              — global tempo / loop pulse
  audio-engine.js       — per-performer cell scheduling, master bus + reverb
  button-controller.js  — audience input
  scene-display.js      — visualization
  operator-panel.js     — admin / config UI
  demo-mode.js          — autonomous advance heuristic

samples/                — CC0 MP3 field recordings (see CREDITS.md)
```

The performer / ensemble / spread-and-deadlock logic is a direct port from In C. The novelty here is on the audio side: each cell is a *recipe* (function) that, given an audio context and a start time, schedules a randomized set of sample playbacks across one loop period. Two plays of the same cell never sound identical because pitch, pan, gain, and sample start-offset are randomized inside the recipe.

## Why

Live installations and ambient pieces. The mathematical bones of *In C* — independent loopers + spread constraint + opening gate + per-performer audience-button advance — turn out to be a fantastic engine for any layered, evolving scene, not just music.

## License

MIT.
