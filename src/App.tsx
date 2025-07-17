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
  const [filteredCharacters, setFilteredCharacters] = useState<Character[]>([]);
  const [loading, setLoading] = useState(true);
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [filters, setFilters] = useState({
    race: '',
    gender: '',
    affiliation: '',
    sortKi: 'none',
    sortMaxKi: 'none'
  });

  useEffect(() => {
    setLoading(true);
    fetch(`https://dragonball-api.com/api/characters?page=${page}&limit=12`)
      .then(response => response.json())
      .then(data => {
        setCharacters(data.items);
        setFilteredCharacters(data.items);
        setTotalPages(data.meta.totalPages);
        setLoading(false);
      })
      .catch(error => {
        console.error('Error al consumir la API:', error);
        setLoading(false);
      });
  }, [page]);

  useEffect(() => {
    applyFilters();
  }, [characters, filters]);

  const applyFilters = () => {
    let result = [...characters];
    
    // Filtros básicos
    if (filters.race) {
      result = result.filter(char => 
        char.race?.toLowerCase().includes(filters.race.toLowerCase())
      );
    }
    
    if (filters.gender) {
      result = result.filter(char => 
        char.gender?.toLowerCase() === filters.gender.toLowerCase()
      );
    }
    
    if (filters.affiliation) {
      result = result.filter(char => 
        char.affiliation?.toLowerCase().includes(filters.affiliation.toLowerCase())
      );
    }
    
    // Ordenamiento por Ki
    if (filters.sortKi !== 'none') {
      result = [...result].sort((a, b) => {
        const kiA = a.ki || 0;
        const kiB = b.ki || 0;
        return filters.sortKi === 'asc' ? kiA - kiB : kiB - kiA;
      });
    }
    
    // Ordenamiento por Máx Ki
    if (filters.sortMaxKi !== 'none') {
      result = [...result].sort((a, b) => {
        const maxKiA = a.maxKi || 0;
        const maxKiB = b.maxKi || 0;
        return filters.sortMaxKi === 'asc' ? maxKiA - maxKiB : maxKiB - maxKiA;
      });
    }
    
    setFilteredCharacters(result);
  };

  const handleFilterChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFilters(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const resetFilters = () => {
    setFilters({
      race: '',
      gender: '',
      affiliation: '',
      sortKi: 'none',
      sortMaxKi: 'none'
    });
  };

  const nextPage = () => {
    if (page < totalPages) setPage(prev => prev + 1);
  };

  const prevPage = () => {
    if (page > 1) setPage(prev => prev - 1);
  };

  // Obtener opciones únicas para los filtros
  const uniqueRaces = Array.from(new Set(
    characters.map(char => char.race).filter(Boolean) as string[]
  ));
  
  const uniqueGenders = Array.from(new Set(
    characters.map(char => char.gender).filter(Boolean) as string[]
  ));
  
  const uniqueAffiliations = Array.from(new Set(
    characters.map(char => char.affiliation).filter(Boolean) as string[]
  ));

  return (
    <div className="app">
      {/* ENCABEZADO CON IMAGEN */}
      <div className="banner" style={{ backgroundImage: `url(${kameHouse})` }}>
        <div className="overlay">
          <h2 className="banner-title">¡Bienvenido al Universo Dragon Ball!</h2>
        </div>
      </div>

      <h1 className="fuente">Personajes de Dragon Ball</h1>

      {/* SECCIÓN DE FILTROS */}
      <div className="filters-container">
        <div className="filter-group">
          <label htmlFor="race">Raza:</label>
          <select
            id="race"
            name="race"
            value={filters.race}
            onChange={handleFilterChange}
          >
            <option value="">Todas las razas</option>
            {uniqueRaces.map(race => (
              <option key={race} value={race}>{race}</option>
            ))}
          </select>
        </div>

        <div className="filter-group">
          <label htmlFor="gender">Género:</label>
          <select
            id="gender"
            name="gender"
            value={filters.gender}
            onChange={handleFilterChange}
          >
            <option value="">Todos los géneros</option>
            {uniqueGenders.map(gender => (
              <option key={gender} value={gender}>{gender}</option>
            ))}
          </select>
        </div>

        <div className="filter-group">
          <label htmlFor="affiliation">Afiliación:</label>
          <select
            id="affiliation"
            name="affiliation"
            value={filters.affiliation}
            onChange={handleFilterChange}
          >
            <option value="">Todas las afiliaciones</option>
            {uniqueAffiliations.map(affiliation => (
              <option key={affiliation} value={affiliation}>{affiliation}</option>
            ))}
          </select>
        </div>

        <div className="filter-group">
          <label htmlFor="sortKi">Ordenar por Ki:</label>
          <select
            id="sortKi"
            name="sortKi"
            value={filters.sortKi}
            onChange={handleFilterChange}
          >
            <option value="none">Sin orden</option>
            <option value="asc">Menor a Mayor</option>
            <option value="desc">Mayor a Menor</option>
          </select>
        </div>

        <div className="filter-group">
          <label htmlFor="sortMaxKi">Ordenar por Máx Ki:</label>
          <select
            id="sortMaxKi"
            name="sortMaxKi"
            value={filters.sortMaxKi}
            onChange={handleFilterChange}
          >
            <option value="none">Sin orden</option>
            <option value="asc">Menor a Mayor</option>
            <option value="desc">Mayor a Menor</option>
          </select>
        </div>

        <button className="reset-filters" onClick={resetFilters}>
          Reiniciar Filtros
        </button>
      </div>

      {loading ? (
        <p>Cargando personajes...</p>
      ) : (
        <>
          <div className="characters-grid">
            {filteredCharacters.map((char) => (
              <div key={char.id} className="card-container">
                <div className="card-inner">
                  <div className="card-front">
                    <img src={char.image} alt={char.name} />
                  </div>
                  <div className="card-back">
                    <div className="info-box">
                      <h3>{char.name}</h3>
                      {char.race && <p><strong>Raza:</strong> {char.race}</p>}
                      {char.gender && <p><strong>Género:</strong> {char.gender}</p>}
                      {char.affiliation && <p><strong>Afiliación:</strong> {char.affiliation}</p>}
                      {char.ki && <p><strong>Ki:</strong> {char.ki.toLocaleString()}</p>}
                      {char.maxKi && <p><strong>Máx Ki:</strong> {char.maxKi.toLocaleString()}</p>}
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>

          <div className="pagination">
            <button onClick={prevPage} disabled={page === 1}>Anterior</button>
            <span>Página {page} de {totalPages}</span>
            <button onClick={nextPage} disabled={page === totalPages}>Siguiente</button>
          </div>
        </>
      )}
    </div>
  );
}

export default App;