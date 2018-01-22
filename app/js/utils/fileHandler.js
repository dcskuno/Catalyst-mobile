import AjaxInterceptor from 'ajax-interceptor';

export const resolveURL = filePath => new Promise((resolve, reject) => {
  window.resolveLocalFileSystemURL(filePath, fileEntry => resolve(fileEntry), err => reject(err));
});

/** DirectoryEntry.copyのPromise化 */
const copy = (srcEntry, destEntry, newName = null) => new Promise((resolve, reject) => {
  srcEntry.copyTo(destEntry, newName, entry => resolve(entry), error => reject(error));
});

/** DirectoryEntry.readEntriesのPromise化 */
const readEntries = entry => new Promise((resolve, reject) => {
  entry.createReader().readEntries(entries => resolve(entries), error => reject(error));
});

/** DirectoryEntry.getDirectoryのPromise化 */
const getDirectory = (entry, dirName, options) => new Promise((resolve, reject) => {
  entry.getDirectory(dirName, options, dirEntry => resolve(dirEntry), error => reject(error));
});

/** DirectoryEntry.removeRecursivelyのPromise化 */
const removeRecursively = entry => new Promise((resolve, reject) => {
  entry.removeRecursively(() => resolve(), error => reject(error));
});

/** FileEntry.removeRecursivelyのPromise化 */
const remove = entry => new Promise((resolve, reject) => {
  entry.remove(() => resolve(), error => reject(error));
});

/** ローカルサーバーを起動 */
export const startServer = rootEntry => new Promise((resolve, reject) => {
  const root = rootEntry.nativeURL.replace('file://', '');

  window.cordova.plugins.CorHttpd.startServer(
    {
      www_root: root,
      port: 50000,
      localhost_only: true,
    },
    (url) => { console.log('server startup success', root, url); resolve(); },
    error => reject(error),
  );
});

// #init3 キャッシュディレクトリにコピー
const copyDir = (orgEntry, destEntry) => new Promise((resolve, reject) => {
  getDirectory(destEntry, 'data', { create: true }).then((entryDir) => {
    readEntries(entryDir).then((entries) => {
      const targetEntry = entries.find(item =>
        item.name === orgEntry.name && item.isDirectory === orgEntry.isDirectory);

      // 既存なしの場合、そのままコピーする
      if (!targetEntry) {
        console.log('既存なし');
        copy(orgEntry, entryDir)
          .then(entry => resolve({ cache: entryDir, copied: entry }))
          .catch(error => reject(error));
        return;
      }

      console.log('既存あり');
      const removeFunc = targetEntry.isDirectory ? removeRecursively : remove;

      // 既存ありの場合、削除してからコピーする
      removeFunc(targetEntry)
        .then(() => copy(orgEntry, entryDir))
        .then(entry => resolve({ cache: entryDir, copied: entry }))
        .catch(error => reject(error));
    });
  });
});

// #init2 移動先(キャッシュdirectory)を取得
export const getLandingDirEntry = orgDirEntry =>
  resolveURL(window.cordova.file.cacheDirectory)
    .then(cacheEntry => copyDir(orgDirEntry, cacheEntry));

/** サブフォルダも含め、ファイル数をカウントする */
const countFiles = entry => new Promise((resolve, reject) => {
  if (entry.isDirectory) {
    entry.createReader().readEntries((entries) => {
      if (entries.length === 0) {
        resolve(0);
        return;
      }

      Promise.all(entries.map(item => countFiles(item)))
        .then((files) => {
          const count = files.reduce((prev, current) => prev + current, 0);
          resolve(count);
        })
        .catch(err => reject(err));
    });

    return;
  }
  // isFile
  resolve(1);
});

/** ファイル数チェック */
const checkFiles = dirEntry => countFiles(dirEntry);

/** 設定ファイルの数量をチェックする */
const checkConfig = () => new Promise((resolve, reject) => {
  const filePath = `${window.cordova.file.cacheDirectory}/data/pri`;
  const rootPath = `${window.cordova.file.cacheDirectory}/data`;

  resolveURL(filePath)
    .then(fileEntry => checkFiles(fileEntry))
    .then((fileCount) => {
      // 設定ファイル数チェック
      if (fileCount === 108) {
        resolveURL(rootPath)
          .then(fileEntry => startServer(fileEntry))
          .then(() => resolve(true))
          .catch(error => reject(error));
      }
    })
    .catch((error) => {
      console.error('checkConfig file', error);
      resolve(false);
    });
});

/** 設定ファイル初期化 */
const initConfig = () => {
  const filePath = `${window.cordova.file.applicationDirectory}/www/data/pri`;
  const rootPath = `${window.cordova.file.cacheDirectory}/data`;

  // 1.LocalPath解析
  // 2.Cacheに移動
  // 3.RootPath解析
  // 4.サーバ起動
  return resolveURL(filePath)
    .then(fileEntry => getLandingDirEntry(fileEntry))
    .then(() => resolveURL(rootPath))
    .then(fileEntry => startServer(fileEntry));
};

// #init1 コピーするデータを取得
export function launchLocalServer() {
  return checkConfig()
    .then(success => (success ? Promise.resolve : initConfig()));
    // .catch(err => console.log('launchLocalServer', err));
}

/** offlineファイル数カウント */
export const checkOffline = () => new Promise((resolve) => {
  console.log(window.cordova);
  const libPath = `${window.cordova.file.cacheDirectory}/data/WRAP/libs`;
  const mapPath = `${window.cordova.file.cacheDirectory}/data/WRAP/wrap-pri/data/Map_OpenStreetMap`;
  const startTime = Date.now();

  Promise.all([
    resolveURL(libPath)
      .then(fileEntry => checkFiles(fileEntry))
      .catch(() => Promise.resolve(0)),
    resolveURL(mapPath)
      .then(fileEntry => checkFiles(fileEntry))
      .catch(() => Promise.resolve(0)),
  ]).then((fileCount) => {
    const endTime = Date.now();
    console.error('checkOffline', endTime - startTime, fileCount);
    resolve((fileCount[0] + fileCount[1]) === 5458);
  });
});

// #Overwrite4 データを保存
function writeFile(fileEntry, dataObj) {
  fileEntry.createWriter((fileWriter) => {
    fileWriter.write(dataObj);
  });
}

// #Overwrite3 Pathに沿ってディレクトリを掘る
function createDirectory(rootDirEntry, path, data) {
  if (path.length > 1) {
    const dirName = path.shift();
    rootDirEntry.getDirectory(dirName, { create: true }, (dirEntry) => {
      createDirectory(dirEntry, path, data);
    });
  } else {
    switch (path[0].split('.')[1]) {
      case 'json': {
        rootDirEntry.getFile(path[0], { create: true, exclusive: false }, (dirEntry) => {
          const blob = new Blob([data], { type: 'application/json' });
          writeFile(dirEntry, blob);
        }, () => console.log('create error'));
        break;
      }
      case 'png': {
        rootDirEntry.getFile(path[0], { create: true, exclusive: false }, (dirEntry) => {
          const blob = new Blob([data], { type: 'image/png' });
          writeFile(dirEntry, blob);
        }, () => console.log('create error'));
        break;
      }
      case 'tiff': {
        rootDirEntry.getFile(path[0], { create: true, exclusive: false }, (dirEntry) => {
          const blob = new Blob([data], { type: 'image/tiff' });
          writeFile(dirEntry, blob);
        }, () => console.log('create error'));
        break;
      }
      default:
        rootDirEntry.getFile(path[0], { create: true, exclusive: false }, (dirEntry) => {
          const blob = new Blob([data], { type: 'application/json' });
          writeFile(dirEntry, blob);
        }, () => console.log('create error'));
        break;
    }
  }
}

// #Overwrite2 保存先(キャッシュdirectory)を取得
function saveLayerData(path, data) {
  const dirs = path.split('/');
  window.resolveLocalFileSystemURL(window.cordova.file.cacheDirectory, (cacheEntry) => {
    createDirectory(cacheEntry, dirs, data);
  });
}

export function xhrHook(actions) {
  /* eslint-disable global-require */
  // #Overwrite1 #Basetime1 通信を監視してURLで引っ掛ける。レイヤーデータおよびBaseTimeの保存をする。
  AjaxInterceptor.addResponseCallback((xhr) => {
    const responseURL = xhr.responseURL;
    if (responseURL.indexOf('wrap-pri') !== -1) {
      // basetime対応
      if (responseURL.indexOf('WX_JP_Lightning_Latest') !== -1) {
        actions.setLightningBasetime('lightningJpBasetime', JSON.parse(xhr.response).created);
      } else if (responseURL.indexOf('WX_KMA_Lightning_Latest') !== -1) {
        actions.setLightningBasetime('lightningKmaBasetime', JSON.parse(xhr.response).created);
      } else if (responseURL.indexOf('WX_JMA_LIDEN_Latest') !== -1) {
        actions.setLightningBasetime('lightningLidenBasetime', JSON.parse(xhr.response).created);
      }
    }
    // オフライン対応
    if (!window.localStorage.getItem('initedOffline')) { return; }

    const element = document.createElement('a');
    element.href = responseURL;
    const path = element.pathname;
    if (
      responseURL.indexOf('WRAP/wrap-pri/data/JMA_Warn') !== -1
      || responseURL.indexOf('WarnRankMaster') !== -1
      || responseURL.indexOf('JMA_ANLSIS_PRCINT') !== -1
      || responseURL.indexOf('WRAP/wrap-pri/data/WX_JMA_Amedas') !== -1
      || responseURL.indexOf('catalyst/contents/WX_WNI_COMPASS_HOUR') !== -1
    ) {
      saveLayerData(`data${path}`, xhr.response);
    }
  });
  AjaxInterceptor.wire();
}
