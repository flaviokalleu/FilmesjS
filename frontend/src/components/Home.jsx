// src/components/Home.js
import React, { useState, useEffect } from 'react';
import axios from 'axios';
import HeroSection from './HeroSection';
import MovieRow from './MovieRow';
import SeriesRow from './SeriesRow'; // Importe o novo componente SeriesRow
import '../styles/Home.css'; // Certifique-se de que o caminho está correto

const Home = () => {
  const [movies, setMovies] = useState([]);
  const [series, setSeries] = useState([]); // Novo estado para as séries
  const [featuredMovie, setFeaturedMovie] = useState(null);

  useEffect(() => {
    const fetchMovies = async () => {
      try {
        const response = await axios.get(`${process.env.REACT_APP_BACKEND_URL}/api/movies`);
        setMovies(response.data);

        if (response.data.length > 0) {
          const randomIndex = Math.floor(Math.random() * response.data.length);
          setFeaturedMovie(response.data[randomIndex]);
        }
      } catch (error) {
        console.error('Erro ao buscar os filmes:', error);
      }
    };

    const fetchSeries = async () => { // Função para buscar séries
      try {
        const response = await axios.get(`${process.env.REACT_APP_BACKEND_URL}/api/series`);
        const allSeries = response.data;

        // Seleciona 10 séries aleatórias
        const randomSeries = [];
        const seriesCount = Math.min(10, allSeries.length); // Não exceder o número total de séries disponíveis

        while (randomSeries.length < seriesCount) {
          const randomIndex = Math.floor(Math.random() * allSeries.length);
          if (!randomSeries.includes(allSeries[randomIndex])) {
            randomSeries.push(allSeries[randomIndex]);
          }
        }

        setSeries(randomSeries); // Atualiza o estado com as séries aleatórias
      } catch (error) {
        console.error('Erro ao buscar as séries:', error);
      }
    };

    fetchMovies();
    fetchSeries(); // Chame a função para buscar séries
  }, []);

  return (
    <div className="home">
      <HeroSection movie={featuredMovie} />
      <div className="movie-rows">
        <MovieRow title="Trending Now" movies={movies} />
        <MovieRow title="Top Rated" movies={movies} />
        <MovieRow title="Action Movies" movies={movies} />
        <MovieRow title="Comedy Movies" movies={movies} />
        <MovieRow title="Horror Movies" movies={movies} />
        <MovieRow title="Romance Movies" movies={movies} />
      </div>
      <div className="series-rows"> {/* Seção para exibir séries */}
        <SeriesRow title="Series" series={series} />
      </div>
    </div>
  );
};

export default Home;
