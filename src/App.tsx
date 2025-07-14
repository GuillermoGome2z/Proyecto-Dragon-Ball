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
        const personajesConUniverso = data.items.map((char: any) => {
          let universo = 'Desconocido';

          if (char.name?.includes("Goku") || char.name?.includes("Vegeta")) {
            universo = 'Universo 7';
          } else if (char.name?.includes("Vegeta")) {
            universo = 'Universo 7';

          }

          return { ...char, universe: universo };

        });
        console.log(data.items);
        console.log("Primer personaje:", data.items?.[0]);
        setCharacters(personajesConUniverso);
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
              <p><strong>Ki:</strong> {char.ki || 'N/A'}</p>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

export default App;
