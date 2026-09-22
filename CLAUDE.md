# Cicho-metr

Floating classroom noise meter for one teacher: mic level on a gauge that stays over her
slides, plus a counter of how long the class has been loud. Electron, Windows + macOS.

## Stack & layout

Electron 44 (Chromium — chosen so the browser MVP survived into the app; Tauri was rejected,
WKWebView mic quirks on macOS would force a Rust audio path). No bundler, no framework.

- `index.html` — the whole UI and all audio/state logic in one file. The renderer detects
  Electron via `window.cicho` (from `preload.js`) and adds `html.app`; without it the page
  still runs in a plain browser with the settings panel visible. Edit and reload, no build.
- `main.js` — window: frameless, transparent, `alwaysOnTop('screen-saver')`, `type: 'panel'`
  on macOS + `setVisibleOnAllWorkspaces(true, {visibleOnFullScreen: true})` so it floats over
  full-screen Keynote. Window position in `userData/window.json`; settings in `localStorage`.
- `preload.js` — the only bridge: `resize`, `quit`. `contextIsolation: true` stays on.

## Conventions

- A setting = one key in `settings` + a slider whose `id` is that key + an `apply[key]`
  function. The binding loop wires them; nothing else needs touching.
- Widget scaling uses CSS `zoom` (the layout box must scale too, `transform` would not move
  the window), and a `ResizeObserver` tells main the new content size.
- Any class with `display:` needs its own `[hidden]{display:none}` rule, or `el.hidden` silently
  does nothing.

## Commands

```
npm start          # run from source
npm run dist:win   # portable exe -> dist/
```

macOS is built only in CI (`.github/workflows/build.yml`, manual dispatch or a `v*` tag) —
there is no Mac in this loop. The mac job must keep its `codesign --verify` step: the app is
ad-hoc signed (`mac.identity: "-"`, `hardenedRuntime: false`) and a fully unsigned arm64 app
is killed on launch. Never set `mac.identity: null` or `CSC_IDENTITY_AUTO_DISCOVERY=false`;
`mac.sign` in electron-builder 26.x is a custom signer function, not an options object —
check `node_modules/app-builder-lib/scheme.json` before trusting any config doc.

## Where the state lives

- `docs/plan.md` — goal, owner decisions with reasons, step status, done criterion. Read first.
- `LEARNINGS.md` — bugs and their root causes; add one line per real lesson.
- `README.md` — what the teacher is told, including the first-run steps on each OS.

## Status

v0.1.0 shipped to one teacher for testing (dmg + exe). Open: no app icon (default Electron
one), the noise scale `SPAN_DB = 40` is untested in a real classroom, and the done criterion —
the gauge over her slides on a real Mac — is still unverified.
