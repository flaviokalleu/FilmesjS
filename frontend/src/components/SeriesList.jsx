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
      <h1 className="text-3xl font-bold mb-4">Séries</h1>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {seriesList.map((series) => (
          <motion.div
            key={series.id}
            className="bg-gray-800 rounded-lg overflow-hidden shadow-lg transition-transform transform hover:scale-105"
            whileHover={{ scale: 1.05 }}
          >
            <Link to={`/series/${series.tmdb_id}`}>
              <img
                src={series.poster_path ? `https://image.tmdb.org/t/p/w500${series.poster_path}` : 'https://via.placeholder.com/200x300'}
                alt={series.name}
                className="w-full object-cover"
              />
              <div className="p-4">
                <h2 className="text-lg font-bold">{series.name}</h2>
                <p className="text-sm text-gray-400">{series.first_air_date}</p>
              </div>
            </Link>
          </motion.div>
        ))}
      </div>
    </div>
  );
};

export default SeriesList;
