'use strict';
const { Model } = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class TVShowGenre extends Model {
    static associate(models) {
      // Associando TVShowGenre a Series
      TVShowGenre.belongsTo(models.Series, {
        foreignKey: 'tmdb_id',
        as: 'series'
      });
      // Associando TVShowGenre a Genre
      TVShowGenre.belongsTo(models.Genre, {
        foreignKey: 'genre_id',
        as: 'genre'
      });
    }
  }
  TVShowGenre.init({
    tv_show_id: DataTypes.INTEGER,
    genre_id: DataTypes.INTEGER
  }, {
    sequelize,
    modelName: 'TVShowGenre',
  });
  return TVShowGenre;
};
