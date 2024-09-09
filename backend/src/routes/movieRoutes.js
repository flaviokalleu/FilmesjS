const express = require('express');
const router = express.Router();
const movieController = require('../controllers/movieController');

// Rotas de filme
router.post('/add', movieController.addMovie);
router.get('/', movieController.getMovies); // Obter todos os filmes
router.get('/:id', movieController.getMovieById); // Obter detalhes do filme por ID

// Rotas adicionais
router.get('/:id/cast', movieController.getMovieCast); // Obter elenco do filme por ID

module.exports = router;
