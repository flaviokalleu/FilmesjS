import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import axios from 'axios';
import { Star, CalendarToday } from '@mui/icons-material';
import { FaPlay } from 'react-icons/fa';
import { motion } from 'framer-motion'; // Importa framer-motion para animações

const MovieDetails = () => {
  const { id } = useParams();
  const [movie, setMovie] = useState(null);
  const [recommendedMovies, setRecommendedMovies] = useState([]);
  const [cast, setCast] = useState([]);

  useEffect(() => {
    const fetchMovieDetails = async () => {
      try {
        const movieResponse = await axios.get(`${process.env.REACT_APP_BACKEND_URL}/api/movies/${id}`);
        setMovie(movieResponse.data);

        const castResponse = await axios.get(`${process.env.REACT_APP_BACKEND_URL}/api/movies/${id}/cast`);
        setCast(castResponse.data);

        const recommendedResponse = await axios.get(`${process.env.REACT_APP_BACKEND_URL}/api/movies/${id}/recommended`);
        setRecommendedMovies(recommendedResponse.data);
        
      } catch (error) {
        console.error('Erro ao buscar detalhes do filme:', error);
      }
    };

    fetchMovieDetails();
  }, [id]);

  if (!movie) return (
    <div className="flex justify-center items-center h-screen bg-gray-900 text-white text-lg">
      <p>Carregando...</p>
    </div>
  );

  return (
    <div className="relative bg-cover bg-center min-h-screen p-4 md:p-8"
         style={{
           backgroundImage: `url(${movie.backdrop_path ? `https://image.tmdb.org/t/p/w1280${movie.backdrop_path}` : 'https://via.placeholder.com/1280x720'})`,
           backgroundColor: 'rgba(0, 0, 0, 0.75)',
           backgroundBlendMode: 'darken',
         }}
    >
      {/* Detalhes do Filme para Mobile e Desktop */}
      <header className="relative flex flex-col-reverse items-center md:flex-row md:items-center md:gap-8 md:min-h-[60vh]">
        <div className="md:w-2/3 flex flex-col items-center justify-center text-center md:text-left">
          <motion.h1
            className="text-3xl md:text-5xl font-bold mb-4 text-center" 
            style={{ fontFamily: "'Cinzel', serif" }}
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 4.5 }}
          >
            {movie.title}
          </motion.h1>
          <p className="text-sm md:text-lg mb-4 text-justify leading-relaxed">{movie.overview}</p>
          <div className="flex flex-wrap justify-center gap-4 mb-4">
            <div className="flex items-center gap-2">
              <CalendarToday className="text-lg" />
              <span className="text-sm md:text-base">{new Date(movie.release_date).toLocaleDateString()}</span>
            </div>
            <div className="flex items-center gap-2">
              <Star className="text-lg" />
              <span className="text-sm md:text-base">{movie.vote_average.toFixed(1)} ({movie.vote_count} votos)</span>
            </div>
          </div>
          <button className="flex items-center bg-red-600 text-white py-2 px-4 rounded-lg hover:bg-red-700 transition-transform transform hover:scale-105 shadow-lg">
            <FaPlay className="text-lg mr-2" />
            <span className="text-sm md:text-base">Assistir Trailer</span>
          </button>
        </div>
        <div className="mb-4 md:mb-0 md:w-1/3 flex justify-center">
          <img
            src={movie.poster_path ? `https://image.tmdb.org/t/p/w500${movie.poster_path}` : 'https://via.placeholder.com/200x300'}
            alt={movie.title}
            className="w-full rounded-lg shadow-lg"
          />
        </div>
      </header>

      {/* Elenco */}
      <section className="my-8 text-center">
        <motion.h2
          className="text-xl md:text-2xl font-bold mb-4" 
          style={{ fontFamily: "'Cinzel', serif" }}
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 3.5 }}
        >
          Elenco
        </motion.h2>
        <div className="flex flex-wrap justify-center gap-4">
          {cast.length > 0 ? cast.slice(0, 5).map((member) => (
            <div key={member.id} className="flex flex-col items-center">
              <img
                src={member.profile_path ? `https://image.tmdb.org/t/p/w500${member.profile_path}` : 'https://via.placeholder.com/100x100'}
                alt={member.name}
                className="w-20 h-20 rounded-full object-cover border-2 border-white shadow-lg"
              />
              <div className="mt-2 text-center">
                <h4 className="text-sm font-bold mb-1">{member.name}</h4>
                <p className="text-xs text-gray-400">{member.character_name}</p>
              </div>
            </div>
          )) : <p className="text-gray-400">Elenco não disponível</p>}
        </div>
      </section>

      {/* Filmes Recomendados */}
      <section>
        <motion.h2
          className="text-xl md:text-2xl font-bold mb-4 text-center" 
          style={{ fontFamily: "'Cinzel', serif" }}
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 2.5 }}
        >
          Filmes Recomendados
        </motion.h2>
        <div className="flex flex-wrap justify-center md:justify-start gap-4">
          {recommendedMovies.length > 0 ? recommendedMovies.map((recMovie) => (
            <div key={recMovie.id} className="w-40 rounded-lg overflow-hidden shadow-lg transition-transform transform hover:scale-105">
              <img
                src={recMovie.poster_path ? `https://image.tmdb.org/t/p/w500${recMovie.poster_path}` : 'https://via.placeholder.com/200x300'}
                alt={recMovie.title}
                className="w-full object-cover"
              />
              <div className="p-2">
                <h4 className="text-sm font-bold">{recMovie.title}</h4>
                <p className="text-xs text-gray-400">{recMovie.release_date}</p>
              </div>
            </div>
          )) : <p className="text-gray-400">Nenhuma recomendação disponível</p>}
        </div>
      </section>
    </div>
  );
};

export default MovieDetails;
