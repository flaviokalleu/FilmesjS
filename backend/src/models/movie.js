// movie.js
module.exports = (sequelize, DataTypes) => {
  const Movie = sequelize.define('Movie', {
      tmdb_id: {
          type: DataTypes.INTEGER,
          unique: true,
          allowNull: false
      },
      title: {
          type: DataTypes.STRING,
          allowNull: false
      },
      overview: DataTypes.TEXT,
      release_date: DataTypes.DATE,
      poster_path: DataTypes.STRING,
      backdrop_path: DataTypes.STRING,
      popularity: DataTypes.FLOAT,
      vote_average: DataTypes.FLOAT,
      vote_count: DataTypes.INTEGER,
      trailer_url: DataTypes.STRING
  });

  Movie.associate = function(models) {
    Movie.belongsToMany(models.Genre, {
        through: 'MovieGenres',
        foreignKey: 'movie_id'
    });
    Movie.belongsToMany(models.Cast, {
        through: 'MovieCast',
        foreignKey: 'movie_id',
        as: 'casts'  // Use o mesmo alias definido no modelo `Cast`
    });
    Movie.belongsToMany(models.Director, {
        through: 'MovieDirector',
        foreignKey: 'movie_id'
    });
    Movie.belongsToMany(models.Keyword, {
        through: 'MovieKeyword',
        foreignKey: 'movie_id'
    });
  };

  return Movie;
};
