import React, { useState, useEffect } from 'react';

const AnimeApi = () => {
  const [recommendations, setRecommendations] = useState([]);
  //nuevos métodos
  const [animeList, setAnimeList] = useState([]);
  const [animeDetails, setAnimeDetails] = useState(null);
  const [animeEpisodes, setAnimeEpisodes] = useState([]);
  const [rssFeed, setRssFeed] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const animeId = 21;

  useEffect(() => {
    console.log("Componente montado, intentando obtener recomendaciones...");

    // Comprobamos si electronAPI está disponible
    if (window.electronAPI) {
      window.electronAPI.fetchAnimeRecommendations(animeId) // se deberá hacer lo mismo para otros metodos
        .then(data => {
          console.log("Recomendaciones recibidas:", data);
          setRecommendations(data);
          setLoading(false);
        })
        .catch(err => {
          console.error("Error:", err);
          setError('Error al cargar recomendaciones: ' + err.message);
          setLoading(false);
        });
      //lista de animes
      window.electronAPI.fetchAnimes()
        .then(data => {
          console.log("Lista de animes recibida:", data);
          setAnimeList(data);
        })
        .catch(err => {
          console.error("Error al cargar lista de animes:", err);
        });

      //detalles del anime
      window.electronAPI.fetchAnimeDetails(animeId)
        .then(data => {
          console.log("Detalles del anime recibidos:", data);
          setAnimeDetails(data);
        })
        .catch(err => {
          console.error("Error al cargar detalles del anime:", err);
        });

      //episodios del anime
      window.electronAPI.fetchAnimeEpisodes(animeId, false)
        .then(data => {
          console.log("Episodios del anime recibidos:", data);
          setAnimeEpisodes(data);
        })
        .catch(err => {
          console.error("Error al cargar episodios del anime:", err);
        });

      //RSS feed
      window.electronAPI.fetchRssFeed(1, 5, false)
        .then(data => {
          console.log("RSS feed recibido:", data);
          setRssFeed(data);
        })
        .catch(err => {
          console.error("Error al cargar RSS feed:", err);
        });
    } else {
      setError('electronAPI no está disponible. Verifica preload.js');
      setLoading(false);
    }
  }, []);



  if (loading) {
    return <div>Cargando recomendaciones de anime... Por favor espera.</div>;
  }

  if (error) {
    return (
      <div>
        <h1>Error al cargar los datos</h1>
        <p>{error}</p>
        <p>Verifica que tu API esté funcionando y que la URL sea correcta.</p>
      </div>
    );
  }

  if (!recommendations || recommendations.length === 0) {
    return (
      <div>
        <h1>No se encontraron recomendaciones</h1>
        <p>La API respondió correctamente pero no devolvió datos.</p>
      </div>
    );
  }

  return (
    <div>
      <h1>Recomendaciones de Anime</h1>
      <div>
        {recommendations.map((anime, index) => (
          <div key={anime.id || anime.idAnilist || index} style={{ marginBottom: '20px' }}>
            <h3>{anime.title?.romaji || anime.title?.english || 'Sin título'}</h3>
            {anime.coverImage && (
              <img
                src={anime.coverImage.extraLarge || anime.coverImage.medium}
                alt={anime.title?.romaji || 'Anime'}
                style={{ maxWidth: '200px' }}
              />
            )}
            {anime.genres && <p>Géneros: {anime.genres.join(', ')}</p>}
            {anime.description && (
              <p dangerouslySetInnerHTML={{ __html: anime.description.slice(0, 150) + '...' }}></p>
            )}
            <hr />
          </div>
        ))}
      </div>
      {/*Lista de Animes*/}
      <h1>Lista de Animes</h1>
      <div>
        {animeList && animeList.length > 0 ? (
          animeList.slice(0, 3).map((anime, index) => (
            <div key={index} style={{ marginBottom: '20px' }}>
              <h3>{anime.title?.romaji || anime.title?.english || 'Sin título'}</h3>
              {anime.coverImage && (
                <img
                  src={anime.coverImage.extraLarge || anime.coverImage.medium}
                  alt={anime.title?.romaji || 'Anime'}
                  style={{ maxWidth: '200px' }}
                />
              )}
              <hr />
            </div>
          ))
        ) : (
          <p>No se encontraron animes en la lista.</p>
        )}
      </div>

      {/*Detalles del Anime*/}
      <h1>Detalles del Anime</h1>
      <div>
        {animeDetails ? (
          <div style={{ marginBottom: '20px' }}>
            <h3>{animeDetails.title?.romaji || animeDetails.title?.english || 'Sin título'}</h3>
            {animeDetails.coverImage && (
              <img
                src={animeDetails.coverImage.extraLarge || animeDetails.coverImage.medium}
                alt={animeDetails.title?.romaji || 'Anime'}
                style={{ maxWidth: '200px' }}
              />
            )}
            {animeDetails.genres && <p>Géneros: {animeDetails.genres.join(', ')}</p>}
            {animeDetails.description && (
              <p dangerouslySetInnerHTML={{ __html: animeDetails.description }}></p>
            )}
            <hr />
          </div>
        ) : (
          <p>No se encontraron detalles del anime.</p>
        )}
      </div>

      {/*Episodios*/}
      <h1>Episodios del Anime</h1>
      <div>
        {animeEpisodes && animeEpisodes.episodes && animeEpisodes.episodes.length > 0 ? (
          <div>
            <p>Total de episodios: {animeEpisodes.episodes.length}</p>
            <ul>
              {animeEpisodes.episodes.slice(0, 5).map((episode, index) => (
                <li key={index}>
                  Episodio {episode.episode}:
                  {episode.title?.en || episode.title?.ja || 'Sin título'}
                </li>
              ))}
            </ul>
            <hr />
          </div>
        ) : (
          <p>No se encontraron episodios para este anime.</p>
        )}
      </div>

      {/*RSS Feed */}
      <h1>Feed RSS</h1>
      <div>
        {rssFeed && rssFeed.length > 0 ? (
          rssFeed.map((item, index) => (
            <div key={index} style={{ marginBottom: '20px' }}>
              <h3>{item.title?.romaji || item.title?.english || 'Sin título'}</h3>
              <p>Episodio: {item.episode?.episodeNumber || 'Desconocido'}</p>
              {item.coverImage && (
                <img
                  src={item.coverImage.extraLarge}
                  alt="Anime Cover"
                  style={{ maxWidth: '200px' }}
                />
              )}
              <hr />
            </div>
          ))
        ) : (
          <p>No se encontraron items en el feed RSS.</p>
        )}
      </div>
    </div>
  );
};

export default AnimeApi;