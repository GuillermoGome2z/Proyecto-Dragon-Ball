import { useEffect, useState } from 'react';
import './App.css';
import kameHouse from './assets/kameHouse.jpg';


interface Character {
  id: number;
  name: string;
  image: string;
  race?: string;
  gender?: string;
  affiliation?: string;
  ki?: number;
  maxKi?: number;
}
function App() {
  const [characters, setCharacters] = useState<Character[]>([]);
  const [loading, setLoading] = useState(true);
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);

  useEffect(() => {
  setLoading(true);
  fetch(`https://dragonball-api.com/api/characters?page=${page}&limit=12`)
    .then(response => response.json())
    .then(data => {
      setCharacters(data.items);
      setTotalPages(data.meta.totalPages);
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
      {/* ENCABEZADO CON IMAGEN */}
      <div
        className="banner"
        style={{ backgroundImage: `url(${kameHouse})` }}
      >
        <div className="overlay">
          <h2 className="banner-title">¡Bienvenido al Universo Dragon Ball!</h2>
        </div>
      </div>

      <h1 className="fuente">Personajes de Dragon Ball</h1>

      {loading ? (
        <p>Cargando personajes...</p>
      ) : (
        <>
         <div className="characters-grid">
            {characters.map((char) => (
              <div key={char.id} className="card-container">
                <div className="card-inner">
                  {/* Frente: imagen */}
                  <div className="card-front">
                    <img src={char.image} alt={char.name} />
                  </div>

                  {/* Reverso: información */}
                  <div className="card-back">
                    <div className="info-box">
                      <h3>{char.name}</h3>
                      {char.race && <p><strong>Raza:</strong> {char.race}</p>}
                      {char.gender && <p><strong>Género:</strong> {char.gender}</p>}
                      {char.affiliation && <p><strong>Afiliación:</strong> {char.affiliation}</p>}
                      {char.ki && <p><strong>Ki:</strong> {char.ki}</p>}
                      {char.maxKi && <p><strong>Máx Ki:</strong> {char.maxKi}</p>}
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