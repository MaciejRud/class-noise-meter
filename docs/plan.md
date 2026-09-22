# Cicho-metr — plan

**Goal**: a floating classroom noise meter for one teacher. Mic level → compact gauge widget
on top of every other window (projector). Teacher sets a threshold; after 3 s of sustained
noise above it a timer starts and counts up; it stops after 3 s of sustained quiet.

**Owner decisions (2026-09-22)**
- Timer variant (a): counts UP while the class is loud; no penalty at zero. Not a countdown.
- Look: concept A3 from the mockup page — pastel palette (white widget, mint/yellow/coral zones),
  semicircular gauge 220×130 px, threshold tick on the arc, timer under the arc, NO "hałas" label.
  Mockup: https://claude.ai/artifact/MuFsGToisW2Wyz9vPe295G
- Stack: HTML MVP first, then Electron (one codebase, Chromium on both OSes; `alwaysOnTop`
  + `visibleOnFullScreen` cover macOS fullscreen apps). Tauri rejected: WKWebView mic quirks
  on macOS would force a Rust audio path and throw the MVP away.
- Everything is built on Windows. Windows: portable .exe via electron-builder locally.
  macOS: GitHub Actions `macos-latest` runner, unsigned .dmg — teacher opens it once via
  System Settings → Privacy & Security → "Open Anyway". Docker cannot build or run macOS.
- No Mac available for testing: the first run on the teacher's laptop IS the macOS test.
  Plan 15 min with her at the laptop; check (1) window over fullscreen Keynote/PowerPoint,
  (2) mic permission prompt appears and is granted.
- `init-project` (CLAUDE.md generator) runs AFTER step 3, when there is code to scan.

**Steps**
1. Repo, this plan, LEARNINGS.md skeleton. — done 2026-09-22
2. `index.html` MVP: getUserMedia → AnalyserNode → RMS dBFS → 0-100 level with
   "calibrate silence" (3 s of room noise = 0 %), smoothing (fast attack, slow release),
   3 s arm / 3 s release state machine, threshold + size sliders, settings in localStorage.
   — built 2026-09-22, rendered in Chrome via `python -m http.server`; mic path (permission,
   calibration, arm/release on a real room) waits for the owner's test — log goes to LEARNINGS.md.
   Known trap handled: AudioContext created without a user gesture can start `suspended`
   (mic "granted", reads all zeros) → `ctx.resume()` + button stays until `state === 'running'`;
   `ctx` state is printed in the debug line.
3. Electron: `main.js` — frameless, transparent, always-on-top (`screen-saver` level),
   visible on all workspaces incl. fullscreen, draggable; `askForMediaAccess` on macOS;
   `NSMicrophoneUsageDescription` in Info.plist via electron-builder `extendInfo`;
   `app.commandLine.appendSwitch('autoplay-policy', 'no-user-gesture-required')` so the
   suspended-context trap from step 2 does not move into the exe.
4. Build: electron-builder → `portable` target for Windows; GitHub Actions workflow
   → macOS dmg artifact. README with first-run instructions for both OSes.

**Done criterion**
Teacher's laptop (Mac) shows the gauge over her slides, needle follows the room, timer starts
after 3 s of noise and stops after 3 s of quiet, threshold survives a restart.

**Proof**
- Step 2: page opened in Chrome on Windows, mic granted, manual test log in LEARNINGS.md
  (clap/talk → arm → timer; silence → release).
- Step 3/4: Windows .exe run over a fullscreen PowerPoint; macOS run logged after the visit.
