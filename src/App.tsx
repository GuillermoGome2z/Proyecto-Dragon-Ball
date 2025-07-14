// src/App.tsx
import { useEffect, useState } from 'react';
import './App.css';

function App() {
  const [characters, setCharacters] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch('https://dragonball-api.com/api/characters')
      .then(response => response.json())
      .then(data => {
        setCharacters(data.items || []);
        setLoading(false);
      })
      .catch(error => {
        console.error('Error al consumir la API:', error);
        setLoading(false);
      });
  }, []);

  return (
    <div className="app">
      <h1>Personajes de Dragon Ball</h1>

      {loading ? (
        <p>Cargando personajes...</p>
      ) : (
        <div className="characters-grid">
          {characters.map((char) => (

            <div key={char.id} className="card">
              <img src={char.image} alt={char.name} width="150" />
              <h3>{char.name}</h3>
              <p><strong>Raza:</strong> {char.race}</p>
              <p><strong>Universo:</strong> {char.universe}</p>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

export default App;
