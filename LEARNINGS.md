# Cicho-metr -- Learning Journal

## Architecture
[To be filled as we build]

## Decisions & Rationale
- 2026-09-22: Electron over Tauri -- see docs/plan.md "Owner decisions".

## Bugs & Lessons
- 2026-09-22: `hidden` attribute lost to `.panel{display:grid}` -- a class beats the UA
  `[hidden]` rule. Always add `.x[hidden]{display:none}` next to any `display:` on the class.
- 2026-09-22: electron-builder in CI on a `v*` tag auto-publishes to GitHub Releases and dies
  without `GH_TOKEN`. `--publish never` when the artifact is all you want.
- 2026-09-22: AudioContext created right after `getUserMedia` (no click in between) can start
  `suspended` -- mic "granted", reads all zeros. Browser: `ctx.resume()` + keep the button;
  Electron: `autoplay-policy=no-user-gesture-required`.
- 2026-09-22: transparent frameless windows are not natively resizable on Windows -- resize
  grips in JS that change a CSS `zoom`, window follows via ResizeObserver + `setContentSize`.
