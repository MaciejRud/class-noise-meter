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
- 2026-09-22: `mac.identity: null` = no signature at all; `CSC_IDENTITY_AUTO_DISCOVERY=false`
  also skips entirely; `mac.sign` in 26.x is a custom signer function, not an options object.
  Ad-hoc = `mac.identity: "-"`. Cost 3 CI rounds because the config key came from docs on
  `master`, not from the installed version -- for electron-builder read
  `node_modules/app-builder-lib/scheme.json` first, and let CI prove signing (`codesign --verify`).
- 2026-09-22: transparent frameless windows are not natively resizable on Windows -- resize
  grips in JS that change a CSS `zoom`, window follows via ResizeObserver + `setContentSize`.
