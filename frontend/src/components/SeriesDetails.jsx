import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import axios from 'axios';
import { motion } from 'framer-motion';
import { FaPlay, FaHeart, FaLink } from 'react-icons/fa';

const SeriesDetails = () => {
  const { tmdb_id } = useParams();
  const [series, setSeries] = useState(null);
  const [loading, setLoading] = useState(true);
  const [seasons, setSeasons] = useState([]);
  const [episodesBySeason, setEpisodesBySeason] = useState({});

  useEffect(() => {
    const fetchSeriesDetails = async () => {
      try {
        const seriesResponse = await axios.get(`${process.env.REACT_APP_BACKEND_URL}/api/series/tmdb/${tmdb_id}`);
        setSeries(seriesResponse.data);

        const seasonsResponse = await axios.get(`${process.env.REACT_APP_BACKEND_URL}/api/series/seasons/${tmdb_id}`);
        setSeasons(seasonsResponse.data);

        const episodesPromises = seasonsResponse.data.map(season =>
          axios.get(`${process.env.REACT_APP_BACKEND_URL}/api/series/seasons/${season.id}/episodes`)
            .then(response => ({ seasonId: season.id, episodes: response.data }))
        );

        const episodesResults = await Promise.all(episodesPromises);
        const episodesMap = episodesResults.reduce((acc, { seasonId, episodes }) => {
          acc[seasonId] = episodes;
          return acc;
        }, {});

        setEpisodesBySeason(episodesMap);
      } catch (error) {
        console.error('Erro ao buscar detalhes da série:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchSeriesDetails();
  }, [tmdb_id]);

  if (loading) {
    return (
      <div className="flex justify-center items-center h-screen bg-gradient-to-r from-black to-gray-800">
        <p className="text-gray-300 text-lg animate-pulse">Carregando...</p>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-900 text-gray-300">
      <div
        className="relative bg-cover bg-center h-[70vh] flex flex-col justify-end p-8"
        style={{
          backgroundImage: `url(${series.backdrop_path ? `https://image.tmdb.org/t/p/original${series.backdrop_path}` : 'https://via.placeholder.com/1280x720'})`,
        }}
      >
        <div className="absolute inset-0 bg-black opacity-80"></div>
        <motion.h1
          className="text-5xl md:text-7xl font-bold text-red-500 drop-shadow-lg z-10"
          initial={{ opacity: 0, y: 50 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 1 }}
        >
          {series.name}
        </motion.h1>
        <div className="flex space-x-4 mt-4 z-10">
          <button className="flex items-center bg-red-600 py-2 px-4 rounded-lg hover:bg-red-700 transition">
            <FaPlay className="mr-2" />
            Assistir
          </button>
          {series.homepage && (
            <a href={series.homepage} target="_blank" rel="noopener noreferrer" className="flex items-center border border-gray-600 py-2 px-4 rounded-lg hover:bg-gray-700 transition">
              <FaLink className="mr-2" />
              Homepage
            </a>
          )}
        </div>
      </div>

      <div className="p-6 bg-gray-800 rounded-t-lg shadow-lg">
        <motion.p
          className="text-lg mb-4"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 1 }}
        >
          {series.overview}
        </motion.p>
        <div className="flex justify-between items-center mb-4">
          <div className="flex items-center">
            <span className="bg-red-500 rounded-full p-2 text-white mr-2">
              <FaHeart />
            </span>
            <span>{series.vote_average.toFixed(1)} ⭐ ({series.vote_count} votos)</span>
          </div>
          <span>{new Date(series.first_air_date).toLocaleDateString()}</span>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
          <div><strong>Número de Temporadas:</strong> {series.number_of_seasons || 'N/A'}</div>
          <div><strong>Número de Episódios:</strong> {series.number_of_episodes || 'N/A'}</div>
          <div><strong>Idioma Original:</strong> {series.original_language || 'N/A'}</div>
          <div><strong>Status:</strong> {series.status || 'N/A'}</div>
          <div><strong>Popularidade:</strong> {series.popularity ? series.popularity.toFixed(2) : 'N/A'}</div>
        </div>
      </div>

      <div className="p-4 bg-gray-800 mt-4 rounded-lg shadow-lg">
        <h2 className="text-2xl font-bold mb-4">Temporadas e Episódios</h2>
        {seasons.length > 0 ? (
          seasons.map(season => (
            <div key={season.id} className="mb-6">
              <h3 className="text-xl font-semibold">Temporada {season.season_number}</h3>
              <p className="text-sm">{season.overview || 'Sem descrição disponível.'}</p>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 mt-4">
                {episodesBySeason[season.id]?.map(episode => (
                  <div key={episode.id} className="flex flex-col items-center border border-gray-700 p-4 rounded-lg bg-gray-700 transition-transform transform hover:scale-105">
                    <img 
                      src={episode.still_path ? `https://image.tmdb.org/t/p/w500${episode.still_path}` : 'https://via.placeholder.com/150'} 
                      alt={episode.name} 
                      className="w-full h-auto rounded mb-2 shadow-md" 
                    />
                    <h4 className="font-bold text-center">{episode.name}</h4>
                    <p className="text-sm text-center text-gray-400">Duração: {episode.runtime ? `${episode.runtime} min` : 'N/A'}</p>
                  </div>
                ))}
              </div>
            </div>
          ))
        ) : (
          <p>Carregando temporadas...</p>
        )}
      </div>
    </div>
  );
};

export default SeriesDetails;
