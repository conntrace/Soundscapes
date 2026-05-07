# Soundscapes

Generative environmental soundscapes — an audience-driven evolving scene in the spirit of Terry Riley's *In C*.

A companion to [in-c-audience-ensemble](https://github.com/conntrace/in-c-audience-ensemble). Same idea: a small group of "performers" each loop independently, advancing through a cell-by-cell progression at the audience's pace. Spread rules keep them roughly together; randomness inside every cell guarantees no two performances are alike.

But instead of musical patterns, every performer is a sonic *layer* in a natural scene — birds, wind, water, insects, amphibians, leaves, atmosphere, ground creatures — and "advancing" means deepening their density and intensity inside that layer.

## First scene

**Forest at Dawn** — eight performers, five cells each, all sounds synthesized in the browser via Web Audio (no sample assets, no network calls during play).

| Performer | Cells progress through |
|---|---|
| Birds | silence → distant chirp → two birds → overlapping calls → dawn chorus |
| Wind | silence → faint rustle → breeze → steady wind → gusts |
| Water | silence → occasional drip → trickle → brook → bubbling rapids |
| Insects | silence → single cricket → several → cricket+cicada → full chorus |
| Amphibians | silence → distant croak → trading frogs → pond chorus → peak |
| Leaves | silence → occasional rustle → footsteps → continuous → activity |
| Atmosphere | silence → distant rumble → owl hoot → thunder+owl → close thunder |
| Ground creatures | silence → squirrel chitter → bark → paws → distant howl |

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
  synth-sources.js      — Web Audio primitives (chirp, wind, drip, cricket, ...)
  sound-cells.js        — cell definitions per performer (the "score")
  performer.js          — single performer state machine
  ensemble.js           — manages all performers, spread + deadlock rules
  clock.js              — global tempo / loop pulse
  audio-engine.js       — per-performer cell scheduling
  button-controller.js  — audience input
  scene-display.js      — visualization
  operator-panel.js     — admin / config UI
  demo-mode.js          — autonomous advance heuristic
```

The performer / ensemble / spread-and-deadlock logic is a direct port from In C. The novelty here is on the audio side: each cell is a *recipe* (function) that, given an audio context and a start time, schedules a randomized set of sound events across one loop period. Two plays of the same cell never sound identical.

## Why

Live installations and ambient pieces. The mathematical bones of *In C* — independent loopers + spread constraint + opening gate + per-performer audience-button advance — turn out to be a fantastic engine for any layered, evolving scene, not just music.

## License

MIT.
