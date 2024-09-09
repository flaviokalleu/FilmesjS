const { Movie, Cast } = require('../models'); // Certifique-se de que Cast está sendo importado aqui

// Adicionar um novo filme
exports.addMovie = async (req, res) => {
  try {
    const movie = await Movie.create(req.body);
    res.status(201).json(movie);
  } catch (error) {
    console.error('Erro ao adicionar o filme:', error);
    res.status(500).json({ message: 'Erro ao adicionar o filme' });
  }
};

// Obter todos os filmes
exports.getMovies = async (req, res) => {
  try {
    const movies = await Movie.findAll();
    res.status(200).json(movies);
  } catch (error) {
    console.error('Erro ao obter os filmes:', error);
    res.status(500).json({ message: 'Erro ao obter os filmes' });
  }
};

// Obter filme por ID
exports.getMovieById = async (req, res) => {
  try {
    const movie = await Movie.findByPk(req.params.id);
    if (!movie) {
      return res.status(404).json({ message: 'Filme não encontrado' });
    }
    res.status(200).json(movie);
  } catch (error) {
    console.error('Erro ao obter o filme:', error);
    res.status(500).json({ message: 'Erro ao obter o filme' });
  }
};

// Obter recomendações de filmes
exports.getRecommendedMovies = async (req, res) => {
  // Implementação da função de recomendações de filmes
};

// Obter elenco do filme por ID
exports.getMovieCast = async (req, res) => {
  try {
    const movie = await Movie.findByPk(req.params.id, {
      include: {
        model: Cast,
        as: 'casts', // Alias definido na associação do modelo `Movie`
        through: { attributes: [] }
      }
    });

    if (!movie) {
      return res.status(404).json({ message: 'Filme não encontrado' });
    }

    res.status(200).json(movie.casts);
  } catch (error) {
    console.error('Erro ao obter o elenco do filme:', error);
    res.status(500).json({ message: 'Erro ao obter o elenco do filme' });
  }
};
