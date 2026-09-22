'use strict';
const { contextBridge, ipcRenderer } = require('electron');

contextBridge.exposeInMainWorld('cicho', {
  resize: (w, h) => ipcRenderer.invoke('resize', w, h),
  quit: () => ipcRenderer.send('quit'),
});
