import React, { useState, useEffect } from 'react';
import Navbar from './navbar';

const AnimeApi = () => {
  const [recommendations, setRecommendations] = useState([]);
  //nuevos métodos
  const [animeList, setAnimeList] = useState([]);
  const [animeDetails, setAnimeDetails] = useState(null);
  const [animeEpisodes, setAnimeEpisodes] = useState([]);
  const [rssFeed, setRssFeed] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [activeSection, setActiveSection] = useState('recommendations');

  //esto hará que haya desplazamiento 
  const recommendationsRef = useRef(null);
  const animeListRef = useRef(null);
  const detailsRef = useRef(null);
  const episodesRef = useRef(null);
  const rssRef = useRef(null);

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

   //manejar la navegación
   const handleNavigate = (section) => {
    setActiveSection(section);
    let ref;
    
    switch(section) {
      case 'recommendations': ref = recommendationsRef; break;
      case 'anime-list': ref = animeListRef; break;
      case 'details': ref = detailsRef; break;
      case 'episodes': ref = episodesRef; break;
      case 'rss': ref = rssRef; break;
      default: ref = null;
    }
    
    if (ref && ref.current) {
      ref.current.scrollIntoView({ behavior: 'smooth' });
    }
  };

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
      <Navbar activeSection={activeSection} onNavigate={handleNavigate} />
      
      <div className="container">
        {/*Recomendaciones*/}
        <section id="recommendations" ref={recommendationsRef} className="section">
          <h1>Recomendaciones de Anime</h1>
          {!recommendations || recommendations.length === 0 ? (
            <p>No se encontraron recomendaciones. La API respondió correctamente pero no devolvió datos.</p>
          ) : (
            <div className="anime-grid">
              {recommendations.map((anime, index) => (
                <div key={anime.id || anime.idAnilist || index} className="anime-card">
                  {anime.coverImage && (
                    <img
                      src={anime.coverImage.extraLarge || anime.coverImage.medium}
                      alt={anime.title?.romaji || 'Anime'}
                    />
                  )}
                  <div className="anime-card-content">
                    <h3>{anime.title?.romaji || anime.title?.english || 'Sin título'}</h3>
                    {anime.genres && (
                      <div className="genre-tags">
                        {anime.genres.slice(0, 3).map((genre, idx) => (
                          <span key={idx} className="genre-tag">{genre}</span>
                        ))}
                      </div>
                    )}
                    {anime.description && (
                      <p dangerouslySetInnerHTML={{ __html: anime.description.slice(0, 100) + '...' }}></p>
                    )}
                  </div>
                </div>
              ))}
            </div>
          )}
        </section>

        {/*Lista de Animes*/}
        <section id="anime-list" ref={animeListRef} className="section">
          <h1>Lista de Animes</h1>
          {!animeList || animeList.length === 0 ? (
            <p>No se encontraron animes en la lista.</p>
          ) : (
            <div className="anime-grid">
              {animeList.slice(0, 6).map((anime, index) => (
                <div key={index} className="anime-card">
                  {anime.coverImage && (
                    <img
                      src={anime.coverImage.extraLarge || anime.coverImage.medium}
                      alt={anime.title?.romaji || 'Anime'}
                    />
                  )}
                  <div className="anime-card-content">
                    <h3>{anime.title?.romaji || anime.title?.english || 'Sin título'}</h3>
                  </div>
                </div>
              ))}
            </div>
          )}
        </section>

        {/*Detalles del anime*/}
        <section id="details" ref={detailsRef} className="section">
          <h1>Detalles del Anime</h1>
          {!animeDetails ? (
            <p>No se encontraron detalles del anime.</p>
          ) : (
            <div className="anime-details">
              <div style={{ display: 'flex', gap: '20px' }}>
                {animeDetails.coverImage && (
                  <img
                    src={animeDetails.coverImage.extraLarge || animeDetails.coverImage.medium}
                    alt={animeDetails.title?.romaji || 'Anime'}
                    style={{ maxWidth: '250px', borderRadius: '8px' }}
                  />
                )}
                <div>
                  <h2>{animeDetails.title?.romaji || animeDetails.title?.english || 'Sin título'}</h2>
                  {animeDetails.genres && (
                    <div className="genre-tags">
                      {animeDetails.genres.map((genre, idx) => (
                        <span key={idx} className="genre-tag">{genre}</span>
                      ))}
                    </div>
                  )}
                  {animeDetails.description && (
                    <div 
                      className="anime-description" 
                      dangerouslySetInnerHTML={{ __html: animeDetails.description }}
                    ></div>
                  )}
                </div>
              </div>
            </div>
          )}
        </section>

        {/*Episodios*/}
        <section id="episodes" ref={episodesRef} className="section">
          <h1>Episodios del Anime</h1>
          {!animeEpisodes || !animeEpisodes.episodes || animeEpisodes.episodes.length === 0 ? (
            <p>No se encontraron episodios para este anime.</p>
          ) : (
            <div>
              <p>Total de episodios: {animeEpisodes.episodes.length}</p>
              <ul className="episode-list">
                {animeEpisodes.episodes.slice(0, 10).map((episode, index) => (
                  <li key={index} className="episode-item">
                    <span>Episodio {episode.episode}</span>
                    <span>{episode.title?.en || episode.title?.ja || 'Sin título'}</span>
                  </li>
                ))}
              </ul>
            </div>
          )}
        </section>

        {/*RSS Feed*/}
        <section id="rss" ref={rssRef} className="section">
          <h1>Feed RSS</h1>
          {!rssFeed || rssFeed.length === 0 ? (
            <p>No se encontraron items en el feed RSS.</p>
          ) : (
            <div className="anime-grid">
              {rssFeed.map((item, index) => (
                <div key={index} className="anime-card">
                  {item.coverImage && (
                    <img
                      src={item.coverImage.extraLarge}
                      alt="Anime Cover"
                    />
                  )}
                  <div className="anime-card-content">
                    <h3>{item.title?.romaji || item.title?.english || 'Sin título'}</h3>
                    <p>Episodio: {item.episode?.episodeNumber || 'Desconocido'}</p>
                  </div>
                </div>
              ))}
            </div>
          )}
        </section>
      </div>
    </div>
  );
};

export default AnimeApi;