'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class Episode extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
    }
  }
  Episode.init({
    name: DataTypes.STRING,
    overview: DataTypes.TEXT,
    vote_average: DataTypes.FLOAT,
    vote_count: DataTypes.INTEGER,
    air_date: DataTypes.DATE,
    episode_number: DataTypes.INTEGER,
    still_path: DataTypes.STRING,
    season_id: DataTypes.INTEGER,
    link: DataTypes.STRING,
    runtime: DataTypes.INTEGER,
    production_code: DataTypes.STRING,
    guest_stars: DataTypes.JSONB,
    crew: DataTypes.JSONB
  }, {
    sequelize,
    modelName: 'Episode',
  });
  return Episode;
};