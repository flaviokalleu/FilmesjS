import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import axios from 'axios';
import { Star, CalendarToday } from '@mui/icons-material';
import { FaPlay } from 'react-icons/fa';
import { motion } from 'framer-motion'; // Importa framer-motion para animações

const SeriesDetails = () => {
  const { tmdb_id } = useParams();
  const [series, setSeries] = useState(null);
  const [recommendedSeries, setRecommendedSeries] = useState([]);
  const [cast, setCast] = useState([]);

  useEffect(() => {
    const fetchSeriesDetails = async () => {
      try {
        const seriesResponse = await axios.get(`${process.env.REACT_APP_BACKEND_URL}/api/series/tmdb/${tmdb_id}`);
        setSeries(seriesResponse.data);

        const castResponse = await axios.get(`${process.env.REACT_APP_BACKEND_URL}/api/series/${tmdb_id}/cast`);
        setCast(castResponse.data);

        const recommendedResponse = await axios.get(`${process.env.REACT_APP_BACKEND_URL}/api/series/${tmdb_id}/recommended`);
        setRecommendedSeries(recommendedResponse.data);
        
      } catch (error) {
        console.error('Erro ao buscar detalhes da série:', error);
      }
    };

    fetchSeriesDetails();
  }, [tmdb_id]);

  if (!series) return (
    <div className="flex justify-center items-center h-screen bg-gray-900 text-white text-lg">
      <p>Carregando...</p>
    </div>
  );

  return (
    <div className="relative bg-cover bg-center min-h-screen p-4 md:p-8"
         style={{
           backgroundImage: `url(${series.backdrop_path ? `https://image.tmdb.org/t/p/w1280${series.backdrop_path}` : 'https://via.placeholder.com/1280x720'})`,
           backgroundColor: 'rgba(0, 0, 0, 0.75)',
           backgroundBlendMode: 'darken',
         }}
    >
      {/* Detalhes da Série para Mobile e Desktop */}
      <header className="relative flex flex-col-reverse md:flex-row md:items-center md:gap-8 md:min-h-[60vh]">
        <div className="md:w-2/3 flex flex-col items-start justify-center text-left">
          <motion.h1
            className="text-3xl md:text-5xl font-bold mb-4 text-white" 
            style={{ fontFamily: "'Cinzel', serif" }}
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 4.5 }}
          >
            {series.name}
          </motion.h1>
          <p className="text-sm md:text-lg mb-4 text-justify leading-relaxed text-white">{series.overview}</p>
          <div className="flex items-center gap-4 mb-4">
            <div className="flex items-center gap-2">
              <CalendarToday className="text-lg text-white" />
              <span className="text-sm md:text-base text-white">{new Date(series.first_air_date).toLocaleDateString()}</span>
            </div>
            <div className="flex items-center gap-2">
              <Star className="text-lg text-white" />
              <span className="text-sm md:text-base text-white">{series.vote_average.toFixed(1)} ({series.vote_count} votos)</span>
            </div>
          </div>
          <div className="flex flex-col md:flex-row md:gap-4">
            <button className="flex items-center bg-red-600 text-white py-2 px-4 rounded-lg hover:bg-red-700 transition-transform transform hover:scale-105 shadow-lg">
              <FaPlay className="text-lg mr-2" />
              <span className="text-sm md:text-base">Assistir</span>
            </button>
            <button className="flex items-center bg-gray-800 text-white py-2 px-4 rounded-lg hover:bg-gray-700 transition-transform transform hover:scale-105 shadow-lg">
              <span className="text-sm md:text-base">Mais Detalhes</span>
            </button>
          </div>
        </div>
        <div className="mb-4 md:mb-0 md:w-1/3 flex justify-center">
          <img
            src={series.poster_path ? `https://image.tmdb.org/t/p/w500${series.poster_path}` : 'https://via.placeholder.com/200x300'}
            alt={series.name}
            className="w-full rounded-lg shadow-lg"
          />
        </div>
      </header>

      {/* Elenco */}
      <section className="my-8 text-center">
        <motion.h2
          className="text-xl md:text-2xl font-bold mb-4 text-white" 
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
                <h4 className="text-sm font-bold mb-1 text-white">{member.name}</h4>
                <p className="text-xs text-gray-400">{member.character_name}</p>
              </div>
            </div>
          )) : <p className="text-gray-400">Elenco não disponível</p>}
        </div>
      </section>

      {/* Séries Recomendadas */}
      <section>
        <motion.h2
          className="text-xl md:text-2xl font-bold mb-4 text-center text-white" 
          style={{ fontFamily: "'Cinzel', serif" }}
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 2.5 }}
        >
          Séries Recomendadas
        </motion.h2>
        <div className="flex flex-wrap justify-center md:justify-start gap-4">
          {recommendedSeries.length > 0 ? recommendedSeries.map((recSeries) => (
            <div key={recSeries.id} className="w-40 rounded-lg overflow-hidden shadow-lg transition-transform transform hover:scale-105">
              <img
                src={recSeries.poster_path ? `https://image.tmdb.org/t/p/w500${recSeries.poster_path}` : 'https://via.placeholder.com/200x300'}
                alt={recSeries.name}
                className="w-full object-cover"
              />
              <div className="p-2">
                <h4 className="text-sm font-bold text-white">{recSeries.name}</h4>
                <p className="text-xs text-gray-400">{recSeries.first_air_date}</p>
              </div>
            </div>
          )) : <p className="text-gray-400">Nenhuma recomendação disponível</p>}
        </div>
      </section>
    </div>
  );
};

export default SeriesDetails;
