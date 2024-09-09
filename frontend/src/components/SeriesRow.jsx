import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { Link } from 'react-router-dom';
import '../styles/MovieRow.css'; // Importando o arquivo de estilo

const SeriesList = () => {
  const [seriesList, setSeriesList] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchSeries = async () => {
      try {
        const response = await axios.get(`${process.env.REACT_APP_BACKEND_URL}/api/series`);
        setSeriesList(response.data);
      } catch (error) {
        console.error('Erro ao buscar séries:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchSeries();
  }, []);

  if (loading) {
    return (
      <div className="flex justify-center items-center h-screen bg-gray-900 text-white">
        <p>Carregando séries...</p>
      </div>
    );
  }

  return (
    <div className="movie-row">
      <h1 className="movie-row-title">Séries</h1>
      <div className="movie-row-content">
        {seriesList.slice(0, 4).map((series) => (
          <Link key={series.id} to={`/series/${series.tmdb_id}`} className="movie-card">
            <img
              src={series.poster_path ? `https://image.tmdb.org/t/p/w500${series.poster_path}` : 'https://via.placeholder.com/300x450'}
              alt={series.name}
              className="movie-poster"
            />
            <div className="movie-title">{series.name}</div>
          </Link>
        ))}
      </div>
    </div>
  );
};

export default SeriesList;
