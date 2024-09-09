// src/components/MovieRow.js
import React from 'react';
import { Link } from 'react-router-dom';
import '../styles/MovieRow.css'; // Atualizado para refletir a nova localização

const MovieRow = ({ title, movies }) => {
  // Limita a exibição de filmes a no máximo 12
  const limitedMovies = movies.slice(0, 12);

  return (
    <div className="movie-row">
      <h2 className="movie-row-title">{title}</h2>
      <div className="movie-row-content">
        {limitedMovies.map((movie) => (
          <Link key={movie.id} to={`/movie/${movie.id}`} className="movie-card-link">
            <div className="movie-card">
              <img
                src={movie.poster_path ? `https://image.tmdb.org/t/p/w500${movie.poster_path}` : 'https://via.placeholder.com/300x450'}
                alt={movie.title}
                className="movie-poster"
              />
              <div className="movie-title">{movie.title}</div>
            </div>
          </Link>
        ))}
      </div>
    </div>
  );
};

export default MovieRow;
