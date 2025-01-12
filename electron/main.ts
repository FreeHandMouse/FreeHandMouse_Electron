import { app, BrowserWindow, ipcMain } from 'electron'
// import { createRequire } from 'node:module'
import { fileURLToPath } from 'node:url'
import path from 'node:path'
import { HandLandmarkerResult, Landmark } from '@mediapipe/tasks-vision'

// const require = createRequire(import.meta.url)
const __dirname = path.dirname(fileURLToPath(import.meta.url))

// The built directory structure
//
// ├─┬─┬ dist
// │ │ └── index.html
// │ │
// │ ├─┬ dist-electron
// │ │ ├── main.js
// │ │ └── preload.mjs
// │
process.env.APP_ROOT = path.join(__dirname, '..')

// 🚧 Use ['ENV_NAME'] avoid vite:define plugin - Vite@2.x
export const VITE_DEV_SERVER_URL = process.env['VITE_DEV_SERVER_URL']
export const MAIN_DIST = path.join(process.env.APP_ROOT, 'dist-electron')
export const RENDERER_DIST = path.join(process.env.APP_ROOT, 'dist')

process.env.VITE_PUBLIC = VITE_DEV_SERVER_URL ? path.join(process.env.APP_ROOT, 'public') : RENDERER_DIST

let win: BrowserWindow | null

function createWindow() {
  win = new BrowserWindow({
    webPreferences: {
      preload: path.join(__dirname, 'preload.mjs'),
    },
  })

  // Test active push message to Renderer-process.
  win.webContents.on('did-finish-load', () => {
    win?.webContents.send('main-process-message', (new Date).toLocaleString())
  })

  ipcMain.on("landmarks", handLandmarkerResultHandler)

  if (VITE_DEV_SERVER_URL) {
    win.loadURL(VITE_DEV_SERVER_URL)
  } else {
    // win.loadFile('dist/index.html')
    win.loadFile(path.join(RENDERER_DIST, 'index.html'))
  }
}

// Quit when all windows are closed, except on macOS. There, it's common
// for applications and their menu bar to stay active until the user quits
// explicitly with Cmd + Q.
app.on('window-all-closed', () => {
  if (process.platform !== 'darwin') {
    app.quit()
    win = null
  }
})

app.on('activate', () => {
  // On OS X it's common to re-create a window in the app when the
  // dock icon is clicked and there are no other windows open.
  if (BrowserWindow.getAllWindows().length === 0) {
    createWindow()
  }
})

app.whenReady().then(createWindow)

const i = {
  ROOT: 0,
  F1_J3: 1, F1_J2: 2, F1_J1: 3, F1: 4,
  F2_J3: 5, F2_J2: 6, F2_J1: 7, F2: 8,
  F3_J3: 9, F3_J2: 10, F3_J1: 11, F3: 12,
  F4_J3: 13, F4_J2: 14, F4_J1: 15, F4: 16,
  F5_J3: 17, F5_J2: 18, F5_J1: 19, F5: 20,
}



function handLandmarkerResultHandler(_: Electron.IpcMainEvent, handLandmarkerResult: HandLandmarkerResult) {
  for (const worldLandmarks of handLandmarkerResult.worldLandmarks) {
    const foldeds = detectFold(worldLandmarks);
    let count = 0;
    for (let index = 0; index < foldeds.length; index++) {
      count += foldeds[index] ? 0 : 2 ** index;
    }
    console.log(count);
  }
}

function detectFold(landmarks: Landmark[]) {
  const points = [
    [i.F3_J3, i.F2_J3, i.F1],
    [i.ROOT, i.F2_J3, i.F2],
    [i.ROOT, i.F3_J3, i.F3],
    [i.ROOT, i.F4_J3, i.F4],
    [i.ROOT, i.F5_J3, i.F5],
  ];
  return points.map(([a, b, c]) => landmarkDot(landmarks[a], landmarks[b], landmarks[c]) < 0);
}

function landmarkDistance(landmark1: Landmark, landmark2: Landmark) {
  return Math.sqrt(
    Math.pow(landmark1.x - landmark2.x, 2) +
    Math.pow(landmark1.y - landmark2.y, 2) +
    Math.pow(landmark1.z - landmark2.z, 2)
  );
}

function landmarkDot(landmark1: Landmark, landmark2: Landmark, landmark3: Landmark) {
  return (landmark2.x - landmark1.x) * (landmark3.x - landmark2.x) +
    (landmark2.y - landmark1.y) * (landmark3.y - landmark2.y) +
    (landmark2.z - landmark1.z) * (landmark3.z - landmark2.z);
}

// const robot = require("@jitsi/robotjs");
// const robot = await import('@jitsi/robotjs');

// robot.setMouseDelay(2);
// var twoPI = Math.PI * 2.0;
// var screenSize = robot.getScreenSize();
// var height = (screenSize.height / 2) - 10;
// var width = screenSize.width;

// for (var x = 0; x < width; x++) {
//   var y = height * Math.sin((twoPI * x) / width) + height;
//   robot.moveMouse(x, y);
//   robot
// }