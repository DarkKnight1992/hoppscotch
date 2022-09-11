const { app, BrowserWindow, protocol, dialog, session } = require('electron');
const path = require('path');


// Handle creating/removing shortcuts on Windows when installing/uninstalling.
// eslint-disable-next-line global-require
if (require('electron-squirrel-startup')) {
  app.quit();
}

function isDebug() {
  return process.env.npm_lifecycle_event === 'start';
}

let mainWindow;

const createWindow = () => {
  // Create the browser window.
  mainWindow = new BrowserWindow({
    width: 1600,
    height: 600,
    webPreferences: {
      preload: path.join(__dirname, 'preload.js'),
      webSecurity: false
    },
  });

  const exApp = require('./server');
  const storage = require('./storage');
  
  const server = exApp.listen(0, async () => {
    console.log(`port is ${server.address().port}`);
    const localStorage = storage.getItem("localStorage");
    mainWindow.loadURL(`http://localhost:${server.address().port}/index.html`);
    for(let setting in localStorage) {
      try {
        await mainWindow.webContents.executeJavaScript(`window.localStorage.setItem("${setting}", ${JSON.stringify(localStorage[setting])})`);
      } catch (error) {
        console.error(error);
      }
    }
    mainWindow.loadURL(`http://localhost:${server.address().port}`);
    
  });

  mainWindow.on('close', async function() { //   <---- Catch close event
    const result = await mainWindow.webContents.executeJavaScript('window.localStorage');
    storage.setItem("localStorage", result);
  });
  
  if (isDebug()) {
    // Open the DevTools.
    mainWindow.webContents.openDevTools();
  }

  
};

// This method will be called when Electron has finished
// initialization and is ready to create browser windows.
// Some APIs can only be used after this event occurs.
app.on('ready', async () => {
  // await session.defaultSession.loadExtension(
  //   path.join(__dirname, '../extension'),
  //   // allowFileAccess is required to load the devtools extension on file:// URLs.
  //   { allowFileAccess: true }
  // )
  
  createWindow();
  // serveStatic();
});

// Quit when all windows are closed, except on macOS. There, it's common
// for applications and their menu bar to stay active until the user quits
// explicitly with Cmd + Q.
app.on('window-all-closed', () => {
  if (process.platform !== 'darwin') {
    app.quit();
  }
});

app.on('activate', () => {
  // On OS X it's common to re-create a window in the app when the
  // dock icon is clicked and there are no other windows open.
  if (BrowserWindow.getAllWindows().length === 0) {
    createWindow();
  }
});

// In this file you can include the rest of your app's specific main process
// code. You can also put them in separate files and import them here.
