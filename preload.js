const { contextBridge, ipcRenderer } = require('electron');

// Exponer APIs seguras al proceso de renderizado
contextBridge.exposeInMainWorld('electronAPI', {
  // Función para obtener animes
  fetchAnimes: () => ipcRenderer.invoke('fetch-animes'),
  fetchAnimeRecommendations: (animeId) => ipcRenderer.invoke('fetch-anime-recommendations', animeId),
  fetchAnimeDetails: (animeId) => ipcRenderer.invoke('fetch-anime-details', animeId),
  fetchAnimeEpisodes: (animeId, withTorrents) => ipcRenderer.invoke('fetch-anime-episodes', animeId, withTorrents),
  fetchRssFeed: (page, perPage, withHevc) => ipcRenderer.invoke('fetch-rss-feed', page, perPage, withHevc)
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