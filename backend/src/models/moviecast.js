// models/movieCast.js
module.exports = (sequelize, DataTypes) => {
  const MovieCast = sequelize.define('MovieCast', {
    movie_id: {
      type: DataTypes.INTEGER,
      references: {
        model: 'Movies',
        key: 'id'
      }
    },
    cast_id: {
      type: DataTypes.INTEGER,
      references: {
        model: 'Casts',
        key: 'id'
      }
    }
  });

  return MovieCast;
};