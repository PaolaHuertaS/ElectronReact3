import React, { useState, useEffect } from 'react';

const AnimeApi = () => {
  const [animes, setAnimes] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    console.log("Componente montado, intentando conectar a la API vía proxy...");
    
    // Comprobamos si electronAPI está disponible
    if (window.electronAPI) {
      window.electronAPI.fetchAnimes()
        .then(data => {
          console.log("Datos recibidos:", data);
          setAnimes(data);
          setLoading(false);
        })
        .catch(err => {
          console.error("Error:", err);
          setError('Error al cargar animes: ' + err.message);
          setLoading(false);
        });
    } else {
      setError('electronAPI no está disponible. Verifica preload.js');
      setLoading(false);
    }
  }, []);

  if (loading) {
    return <div>Cargando animes... Por favor espera.</div>;
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
  
  if (!animes || animes.length === 0) {
    return (
      <div>
        <h1>No se encontraron animes</h1>
        <p>La API respondió correctamente pero no devolvió datos.</p>
      </div>
    );
  }

  return (
    <div>
      <h1>Lista de Animes</h1>
      <div>
        {animes.map((anime, index) => (
          <div key={anime.id || anime._id || index}>
            <pre>{JSON.stringify(anime, null, 2)}</pre>
            <hr />
          </div>
        ))}
      </div>
    </div>
  );
};

export default AnimeApi;