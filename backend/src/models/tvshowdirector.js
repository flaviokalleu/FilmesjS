'use strict';
const { Model } = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class TVShowDirector extends Model {
    static associate(models) {
      // Associando TVShowDirector a Series
      TVShowDirector.belongsTo(models.Series, {
        foreignKey: 'tmdb_id',
        as: 'series'
      });
      // Associando TVShowDirector a Director
      TVShowDirector.belongsTo(models.Director, {
        foreignKey: 'director_id',
        as: 'director'
      });
    }
  }
  TVShowDirector.init({
    tv_show_id: DataTypes.INTEGER,
    director_id: DataTypes.INTEGER
  }, {
    sequelize,
    modelName: 'TVShowDirector',
  });
  return TVShowDirector;
};
