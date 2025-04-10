const { app, BrowserWindow, ipcMain } = require("electron");
const path = require("path");
const axios = require("axios");

//Fuente:
// https://www.freecodecamp.org/espanol/news/como-crear-una-aplicacion-react-con-un-backend-de-node-la-guia-completa/
// https://medium.com/@xagustin93/a%C3%B1adiendo-react-a-una-aplicaci%C3%B3n-de-electron-ab3df35f48fd
// https://www.electronjs.org/es/docs/latest/tutorial/quick-start
//

const API = "http://192.168.101.15:3001";

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
      preload: path.join(__dirname, "preload.js"),
    },
  });

  // Carga el archivo HTML
  mainWindow.loadFile(path.join(__dirname, "public", "index.html"));
}

ipcMain.handle("fetch-animes-r", async () => {
  try {
    console.log("Realizando solicitud a la API desde el proceso principal...");
    const response = await axios.get(
      `${API_URL}/anime/recommendations/${animeId}`
    );
    console.log("Respuesta recibida:", response.status);
    return response.data;
  } catch (error) {
    console.error("Error al obtener datos:", error.message);
    throw new Error(error.message);
  }
});

ipcMain.handle("fetch-animes", async () => {
  try {
    console.log("Realizando solicitud a la API desde el proceso principal...");
    const response = await axios.get(`${API}/anime/list`);
    console.log("Respuesta recibida:", response.status);
    return response.data;
  } catch (error) {
    console.error("Error al obtener datos:", error.message);
    throw new Error(error.message);
  }
});

ipcMain.handle("fetch-anime-details", async (event, animeId) => {
  try {
    console.log(`Obteniendo detalles del anime ID: ${animeId}`);
    const response = await axios.get(`${API}/anime/list/${animeId}`);
    console.log("Respuesta recibida:", response.status);
    return response.data;
  } catch (error) {
    console.error("Error al obtener detalles del anime:", error.message);
    throw new Error(error.message);
  }
});

ipcMain.handle(
  "fetch-anime-episodes",
  async (event, animeId, withTorrents = false) => {
    try {
      console.log(`Obteniendo episodios del anime ID: ${animeId}`);
      const url = `${API}/anime/episodes/${animeId}?torrents=${withTorrents}`;
      const response = await axios.get(url);
      console.log("Respuesta recibida:", response.status);
      return response.data;
    } catch (error) {
      console.error("Error al obtener episodios:", error.message);
      throw new Error(error.message);
    }
  }
);

ipcMain.handle(
  "fetch-rss-feed",
  async (event, page = 1, perPage = 10, withHevc = false) => {
    try {
      console.log(
        `Obteniendo RSS feed, página: ${page}, items por página: ${perPage}`
      );
      const url = `${API}/anime/rss?page=${page}&perPage=${perPage}&withHevc=${withHevc}`;
      const response = await axios.get(url);
      console.log("Respuesta recibida:", response.status);
      return response.data;
    } catch (error) {
      console.error("Error al obtener RSS feed:", error.message);
      throw new Error(error.message);
    }
  }
);
//Este método se llamará cuando Electron haya terminado
//la inicialización y esté listo para crear ventanas del navegador.
app.whenReady().then(() => {
  createWindow();

  app.on("activate", function () {
    //En macOS es común volver a crear una ventana en la aplicación cuando
    //se hace clic en el icono del dock y no hay otras ventanas abiertas.
    if (BrowserWindow.getAllWindows().length === 0) createWindow();
  });
});

//Salir cuando todas las ventanas estén cerradas, excepto en macOS
app.on("window-all-closed", function () {
  if (process.platform !== "darwin") app.quit();
});
