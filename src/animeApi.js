import React, { useState, useEffect } from 'react';

const AnimeApi = () => {
  const [recommendations, setRecommendations] = useState([]);
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
    </div>
  );
};

export default AnimeApi;