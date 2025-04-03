const { app, BrowserWindow } = require('electron');
const path = require('path');

//Fuente:
// https://www.freecodecamp.org/espanol/news/como-crear-una-aplicacion-react-con-un-backend-de-node-la-guia-completa/
// https://medium.com/@xagustin93/a%C3%B1adiendo-react-a-una-aplicaci%C3%B3n-de-electron-ab3df35f48fd
// https://www.electronjs.org/es/docs/latest/tutorial/quick-start
// 

//Evita problemas de referencia de la ventana
let mainWindow;

function createWindow() {
  //Crea la ventana del navegador
  mainWindow = new BrowserWindow({
    width: 800,
    height: 600,
    webPreferences: {
      nodeIntegration: false,
      contextIsolation: true,
      preload: path.join(__dirname, 'preload.js')
    }
  });

  // Carga el archivo HTML
  mainWindow.loadFile(path.join(__dirname, 'public', 'index.html'));
  mainWindow.webContents.openDevTools();
}

//Este método se llamará cuando Electron haya terminado
//la inicialización y esté listo para crear ventanas del navegador.
app.whenReady().then(() => {
  createWindow();
  
  app.on('activate', function () {
    //En macOS es común volver a crear una ventana en la aplicación cuando
    //se hace clic en el icono del dock y no hay otras ventanas abiertas.
    if (BrowserWindow.getAllWindows().length === 0) createWindow();
  });
});

//Salir cuando todas las ventanas estén cerradas, excepto en macOS
app.on('window-all-closed', function () {
  if (process.platform !== 'darwin') app.quit();
});