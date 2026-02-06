import { app, BrowserWindow, ipcMain } from 'electron'
import { join } from 'path'
import { electronApp, optimizer, is } from '@electron-toolkit/utils'
import icon from '../../resources/icon.png?asset'
import * as pty from 'node-pty'
import os from 'os'
import fs from 'fs' 
import si from 'systeminformation'
import axios from 'axios'

// 1. تنظيف التيرمينال وحل مشاكل الشاشة السوداء
app.disableHardwareAcceleration();
app.commandLine.appendSwitch('disable-features', 'Autofill,PasswordGeneration,PasswordLeakDetection');
app.commandLine.appendSwitch('log-level', '3');
process.env['ELECTRON_DISABLE_SECURITY_WARNINGS'] = 'true';

function createWindow(): void {
  const mainWindow = new BrowserWindow({
    fullscreen: true,       
    frame: false,          
    autoHideMenuBar: true, 
    show: false,
    backgroundColor: '#000000',
    ...(process.platform === 'linux' ? { icon } : {}),
    webPreferences: {
      preload: join(__dirname, '../preload/index.js'),
      sandbox: false,
      nodeIntegration: true,
      contextIsolation: false,
      autoplayPolicy: 'no-user-gesture-required' 
    }
  })

  // فلترة رسائل التيرمينال (الطريقة الحديثة)
  mainWindow.webContents.on('console-message', (event) => {
    if (event.message.includes('Autofill')) event.preventDefault();
  });

  if (is.dev) {
    mainWindow.webContents.openDevTools({ mode: 'detach' });
  }

  mainWindow.on('ready-to-show', () => {
    mainWindow.show()
  })

  // --- [2] دعم المسارات والترمينال لكل المنصات ---
  // تحديد الصدفة (Shell) بناءً على نظام التشغيل
  const isWin = os.platform() === 'win32';
  const shellPath = isWin ? 'powershell.exe' : 'bash';
  
  // تحديد مجلد البداية (Home Directory) بشكل صحيح للويندوز ولينكس
  const homeDir = os.homedir();

  const ptyProcess = pty.spawn(shellPath, [], {
    name: 'xterm-color',
    cols: 80,
    rows: 30,
    cwd: homeDir, // بيفتح تلقائياً بمجلد المستخدم
    env: process.env as any
  });

  ptyProcess.onData((data) => {
    if (!mainWindow.isDestroyed()) mainWindow.webContents.send('terminal-data', data);
  });

  ipcMain.on('terminal-write', (_event, data) => {
    ptyProcess.write(data);
  });

  // --- [3] مدير الملفات (File Browser) ---
  ipcMain.handle('read-dir', async (_event, path: string) => {
    try {
      // إذا المسار فاضي بنفتح الـ Home
      const targetPath = path || homeDir;
      const files = fs.readdirSync(targetPath, { withFileTypes: true });
      return files.map(file => ({
        name: file.name,
        isDirectory: file.isDirectory()
      }));
    } catch (error) {
      console.error("Read Dir Error:", error);
      return [];
    }
  });

  // --- [4] رادار الموقع (Geo-Stats) ---
  let cachedGeo = { ip: 'Scanning...', city: 'Istanbul', country_name: 'Turkey', latitude: 41.0082, longitude: 28.9784 };
  async function updateGeoData() {
    try {
      const response = await axios.get('https://ipapi.co/json/').catch(() => ({ data: null }));
      if (response && response.data) {
        cachedGeo = {
          ip: response.data.ip,
          city: response.data.city,
          country_name: response.data.country_name,
          latitude: response.data.latitude,
          longitude: response.data.longitude
        };
      }
    } catch (e) { /* صامت */ }
  }
  updateGeoData();
  setInterval(updateGeoData, 30000);

  // تحديث الحساسات
  setInterval(async () => {
    if (mainWindow.isDestroyed()) return;
    try {
      const cpu = await si.currentLoad();
      const mem = await si.mem();
      const netStats = await si.networkStats();
      let speed = "0.00";
      if (netStats && netStats.length > 0) {
        const active = netStats.find(i => i.rx_sec > 0) || netStats[0];
        speed = ((active.rx_sec + active.tx_sec) / 1024 / 1024).toFixed(2);
      }
      mainWindow.webContents.send('sys-stats', { cpu: cpu.currentLoad.toFixed(1), ram: ((mem.active / mem.total) * 100).toFixed(1) });
      mainWindow.webContents.send('net-stats', { ...cachedGeo, speed, lat: cachedGeo.latitude, lon: cachedGeo.longitude });
    } catch (e) { }
  }, 1000);

  ipcMain.on('quit-app', () => app.quit());

  if (is.dev && process.env['ELECTRON_RENDERER_URL']) {
    mainWindow.loadURL(process.env['ELECTRON_RENDERER_URL'])
  } else {
    mainWindow.loadFile(join(__dirname, '../renderer/index.html'))
  }
}

app.whenReady().then(() => {
  electronApp.setAppUserModelId('com.emad.ui')
  app.on('browser-window-created', (_, window) => optimizer.watchWindowShortcuts(window))
  createWindow()
})

app.on('window-all-closed', () => {
  if (process.platform !== 'darwin') app.quit()
})