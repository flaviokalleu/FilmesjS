import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';

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
    <div className="p-4 md:p-8 bg-gray-900 text-white min-h-screen">
      <h1 className="text-4xl font-bold mb-6 text-center">Séries</h1>
      <div className="grid grid-cols-1 md:grid-cols-5 gap-6">
        {seriesList.map((series) => (
          <motion.div
          key={series.tmdb_id}
          className="relative w-full md:w-60 h-[410px] md:h-[360px] my-3 mx-4 md:my-5 md:mx-0 cursor-pointer rounded-xl overflow-hidden transition-transform transform hover:scale-105"
          whileHover={{ scale: 1.05 }}
        >
          <Link to={`/series/${series.tmdb_id}`} className="absolute inset-0 z-30" />
          <img
            src={series.poster_path ? `https://image.tmdb.org/t/p/w500${series.poster_path}` : 'https://via.placeholder.com/200x300'}
            alt={series.name}
            className="img object-cover w-full h-full"
          />
          {/* Overlay */}
          <div className="absolute inset-0 bg-black opacity-50 z-20"></div>
          <div className="absolute bottom-0 w-full flex justify-between items-center p-3 z-30">
            <h1 className="text-white text-lg font-semibold">{series.name}</h1>
            <h1 className="font-bold text-green-500 p-1 bg-zinc-900 rounded-full text-lg">{series.vote_average ? series.vote_average.toFixed(1) : 'N/A'}</h1>
          </div>
          <button className="absolute bg-black text-white p-2 z-20 right-0 m-3 rounded-full text-xl">
            {/* SVG aqui */}
          </button>
        </motion.div>
        
        
        ))}
      </div>
    </div>
  );
};

export default SeriesList;
