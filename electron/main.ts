import { app, BrowserWindow, ipcMain } from 'electron';
import * as path from 'path';
import * as url from 'url';
import installExtension, {
  REACT_DEVELOPER_TOOLS,
} from 'electron-devtools-installer';
import { autoUpdater } from 'electron-updater';
import log from 'electron-log';
import electronOauth2 from 'electron-oauth2';

let mainWindow: Electron.BrowserWindow | null;

const oauthConfig = {
  clientId: process.env.PANCAKE_CLIENT_ID,
  clientSecret: process.env.PANCAKE_CLIENT_SECRET,
  authorizationUrl: 'http://github.com/login/oauth/authorize',
  tokenUrl: 'https://github.com/login/oauth/access_token',
  useBasicAuthorizationHeader: false,
  redirectUri: 'http://localhost',
};

// 770
const githubOAuth = electronOauth2(oauthConfig, {
  alwaysOnTop: true,
  autoHideMenuBar: true,
  WebPreferences: { nodeIntegration: false },
});

ipcMain.on('github-oauth', (event, arg) => {
  console.log('event');
  githubOAuth.getAccessToken({}).then(
    (token) => {
      event.sender.send('github-oath-reply', token);
    },
    (err) => {
      console.log('Error getting token:', err);
    }
  );
});

class AppUpdater {
  constructor() {
    log.transports.file.level = 'debug';
    autoUpdater.logger = log;
    autoUpdater.checkForUpdatesAndNotify().catch((err) => log.error(err));
  }
}

const updater = new AppUpdater();

function createWindow(): void {
  mainWindow = new BrowserWindow({
    width: 1100,
    height: 700,
    backgroundColor: '#191622',
    webPreferences: {
      nodeIntegration: true,
    },
  });

  if (process.env.NODE_ENV === 'development') {
    mainWindow.loadURL('http://localhost:4000').catch((err) => log.error(err));
  } else {
    mainWindow
      .loadURL(
        url.format({
          pathname: path.join(__dirname, 'renderer/index.html'),
          protocol: 'file:',
          slashes: true,
        })
      )
      .catch((err) => log.error(err));
  }

  mainWindow.webContents.on('did-finish-load', () => {
    mainWindow.setTitle('Pancake');
  });

  mainWindow.on('closed', () => {
    mainWindow = null;
  });
}

app
  .on('ready', createWindow)
  .whenReady()
  .then(() => {
    if (process.env.NODE_ENV === 'development') {
      installExtension(REACT_DEVELOPER_TOOLS)
        .then((name) => log.info(`Added Extension:  ${name}`))
        .catch((err) => log.info('An error occurred: ', err));
    }

    log.info('app loaded');
  })
  .catch((err) => log.error(err));

app.allowRendererProcessReuse = true;
