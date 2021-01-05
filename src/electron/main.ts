import { app, BrowserWindow, ipcMain, ipcRenderer, Menu } from 'electron';
import * as tsElectronSourceMap from 'source-map-support';
import { IPCChannel } from '../ipc/channels';

// allows errors to refer to the TypeScript file, etc. by use of source-maps
tsElectronSourceMap.install();

function createWindow() {
  const win = new BrowserWindow({
    width: 800,
    height: 600,
    webPreferences: {
      nodeIntegration: true
    }
  })

  win.loadFile('index.html')

  const contextMenuNav = Menu.buildFromTemplate([
    {
      label: 'Rename',
      click: () => {
        win.webContents.send(IPCChannel.RENAME_SELECTED_FILE);
      }
    },
    {
      label: 'Delete',
      click: () => {
        win.webContents.send(IPCChannel.DELETE_SELECTED_FILE);
      }
    },

  ]);


  ipcMain.on(IPCChannel.CONTEXT_MENU_NAV_OPEN, (event) => {
    contextMenuNav.popup({
      window: win,
    });

  });


}


app.whenReady().then(createWindow)

app.on('window-all-closed', () => {
  if (process.platform !== 'darwin') {
    app.quit()
  }
})

app.on('activate', () => {
  if (BrowserWindow.getAllWindows().length === 0) {
    createWindow()
  }
})
