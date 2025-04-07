const { contextBridge, ipcRenderer } = require('electron');

// Exponer APIs seguras al proceso de renderizado
contextBridge.exposeInMainWorld('electronAPI', {
  // Función para obtener animes
  fetchAnimes: () => ipcRenderer.invoke('fetch-animes'),
  fetchAnimeRecommendations: (animeId) => ipcRenderer.invoke('fetch-anime-recommendations', animeId)
});

window.addEventListener('DOMContentLoaded', () => {
    const replaceText = (selector, text) => {
      const element = document.getElementById(selector)
      if (element) element.innerText = text
    }
  
    for (const type of ['chrome', 'node', 'electron']) {
      replaceText(`${type}-version`, process.versions[type])
    }
  })