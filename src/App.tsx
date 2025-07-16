import { useEffect, useState } from 'react';
import './App.css';
import kameHouse from './assets/kameHouse.jpg';


function App() {
  const [characters, setCharacters] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);

  useEffect(() => {
    setLoading(true);
    fetch(`https://dragonball-api.com/api/characters?page=${page}&limit=12`)
      .then(response => response.json())
      .then(data => {
        const personajesConUniverso = data.items.map((char: any) => {
          let universo = 'Desconocido';
          if (char.name?.includes("Goku") || char.name?.includes("Vegeta") || char.name?.includes("Freezer")) {
            universo = 'Universo 7';
          } else if (char.name?.includes("Jiren")) {
            universo = 'Universo 11';
          }
          return { ...char, universe: universo };
        });

        setCharacters(personajesConUniverso);
        setTotalPages(data.meta.totalPages); // la API lo da
        setLoading(false);
      })
      .catch(error => {
        console.error('Error al consumir la API:', error);
        setLoading(false);
      });
  }, [page]);

  const nextPage = () => {
    if (page < totalPages) setPage(prev => prev + 1);
  };

  const prevPage = () => {
    if (page > 1) setPage(prev => prev - 1);
  };

  return (
    <div className="app">

      {/* ENCABEZADO VISUAL CON IMAGEN */}
      <div
        className="banner"
        style={{ backgroundImage: `url(${kameHouse})` }}
      >
        <div className="overlay">
          <div className="banner-content">
            <h2 className="banner-title">¡Bienvenido al Universo Dragon Ball!</h2>
            <h3 className="grupo-title">Grupo No.4</h3>
          </div>
        </div>
      </div>


      <h1 className="fuente">Personajes de Dragon Ball</h1>

      {loading ? (
        <p>Cargando personajes...</p>
      ) : (
        <>
          <div className="characters-grid">
            {characters.map((char) => (
             <div key={char.id} className="flip-box">
                <div className="flip-inner">
                  {/* Parte frontal: solo la imagen */}
                  <div className="flip-front">
                    <img src={char.image} alt={char.name} />
                  </div>

                  {/* Parte trasera: fondo negro con cuadro naranja centrado */}
                  <div className="flip-back">
                    <div className="info-box">
                      <h3>{char.name}</h3>
                      <p><strong>Raza:</strong> {char.race}</p>
                      <p><strong>Universo:</strong> {char.universe}</p>
                      <p><strong>Ki:</strong> {char.ki || 'N/A'}</p>
                    </div>
                  </div>
                </div>
              </div>

            ))}
          </div>

          <div style={{ marginTop: '20px' }}>
            <button onClick={prevPage} disabled={page === 1}>Anterior</button>
            <span style={{ margin: '0 10px' }}>Página {page} de {totalPages}</span>
            <button onClick={nextPage} disabled={page === totalPages}>Siguiente</button>
          </div>
        </>
      )}
    </div>
  );
}

export default App;
