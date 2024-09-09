import React, { useState } from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Home from './components/Home';
import Dashboard from './components/Dashboard';
import Movies from './components/MovieList';
import Login from './components/Login';
import MovieInfo from './components/MovieInfo';
import SeriesDetails from './components/SeriesDetails';
import FetchSeriesFiles from './components/FetchSeriesFiles';
import EditSeries from './components/EditSeries';
import { CssBaseline, Typography } from '@mui/material';
import Navbar from './components/Navbar'; // Importe a Navbar
import SeriesList from './components/SeriesList'; // Importe o novo componente
function App() {
  const [activeComponent, setActiveComponent] = useState('movies');

  const handleShowComponent = (component) => {
    setActiveComponent(component);
  };

  return (
    <Router>
      <CssBaseline />
      
        {/* Navbar com a função de mudança de componente passada como prop */}
        <Navbar onComponentChange={handleShowComponent} />

        <main style={{  }}>
          <Routes>
            <Route path="/login" element={<Login />} />
            <Route path="/fetch-series" element={<FetchSeriesFiles />} />
            <Route path="/" element={<Home />} />
            <Route path="/dashboard" element={<Dashboard activeComponent={activeComponent} />} />
            <Route path="/movies" element={<Movies />} />
            <Route path="/edit-series/:id" element={<EditSeries />} />
            <Route path="/movie/:id" element={<MovieInfo />} />
            <Route path="/series" element={<SeriesList />} /> {/* Nova rota para listar séries */}
            <Route path="/series/:tmdb_id" element={<SeriesDetails />} />
          </Routes>
        </main>

        <footer style={{ backgroundColor: '#1E1E2F', padding: '16px', textAlign: 'center' }}>
          <Typography variant="body2" color="text.secondary">
            &copy; 2024 Your Company. All rights reserved.
          </Typography>
        </footer>
      
    </Router>
  );
}

export default App;
