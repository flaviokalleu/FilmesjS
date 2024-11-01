const { DataTypes } = require('sequelize');

module.exports = (sequelize, DataTypes) => {
  const Genre = sequelize.define('Genre', {
    tmdb_id: {
      type: DataTypes.INTEGER,
      allowNull: false,
      unique: true,
    },
    name: {
      type: DataTypes.STRING,
      allowNull: false,
    },
  }, {
    timestamps: true,
  });

  // Associações
  Genre.associate = (models) => {
    Genre.belongsToMany(models.Movie, {
      through: 'MovieGenres', // Nome da tabela intermediária para filmes
      foreignKey: 'genre_id', // Chave estrangeira para 'Genre'
      otherKey: 'movie_id',   // Chave estrangeira para 'Movie'
      as: 'movies', // Nome do relacionamento
    });

    Genre.belongsToMany(models.TVShow, {
      through: 'TVShowGenres', // Nome da tabela intermediária para séries
      foreignKey: 'genre_id', // Chave estrangeira para 'Genre'
      otherKey: 'tvshow_id',   // Chave estrangeira para 'TVShow'
      as: 'tvshows', // Nome do relacionamento
    });
  };

  return Genre;
};
