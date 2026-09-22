'use strict';
const { app, BrowserWindow, ipcMain, session, screen, systemPreferences } = require('electron');
const path = require('path');
const fs = require('fs');

// The AudioContext is created right after the mic is granted, with no click in between;
// without this switch Chromium may leave it 'suspended' and the gauge reads zeros.
app.commandLine.appendSwitch('autoplay-policy', 'no-user-gesture-required');

const stateFile = () => path.join(app.getPath('userData'), 'window.json');

function loadPosition() {
  let saved;
  try { saved = JSON.parse(fs.readFileSync(stateFile(), 'utf8')); } catch (e) { return {}; }
  if (!Number.isFinite(saved.x) || !Number.isFinite(saved.y)) return {};
  // a projector unplugged since last time would leave the window off-screen: fall back to centre
  const onScreen = screen.getAllDisplays().some(({ bounds: b }) =>
    saved.x >= b.x && saved.x < b.x + b.width && saved.y >= b.y && saved.y < b.y + b.height);
  return onScreen ? saved : {};
}

function savePosition(win) {
  const [x, y] = win.getPosition();
  try { fs.writeFileSync(stateFile(), JSON.stringify({ x, y })); } catch (e) { console.error('window position not saved:', e.message); }
}

async function createWindow() {
  if (process.platform === 'darwin') {
    const granted = await systemPreferences.askForMediaAccess('microphone');
    if (!granted) console.error('microphone access denied in System Settings > Privacy & Security > Microphone');
  }
  session.defaultSession.setPermissionRequestHandler((wc, permission, callback) => callback(permission === 'media'));

  const win = new BrowserWindow({
    ...loadPosition(),
    width: 300, height: 200,
    frame: false, transparent: true, resizable: false, hasShadow: false, alwaysOnTop: true,
    // macOS: a panel floats over full-screen apps (Keynote/PowerPoint in presentation mode)
    ...(process.platform === 'darwin' ? { type: 'panel' } : {}),
    webPreferences: { preload: path.join(__dirname, 'preload.js'), contextIsolation: true, nodeIntegration: false },
  });
  win.setAlwaysOnTop(true, 'screen-saver');
  win.setVisibleOnAllWorkspaces(true, { visibleOnFullScreen: true });
  win.on('moved', () => savePosition(win));

  ipcMain.handle('resize', (event, w, h) => { win.setContentSize(Math.ceil(w), Math.ceil(h)); });
  ipcMain.on('quit', () => app.quit());

  await win.loadFile('index.html');
}

app.whenReady().then(createWindow);
app.on('window-all-closed', () => app.quit());
