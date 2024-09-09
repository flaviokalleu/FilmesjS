// models/Season.js
module.exports = (sequelize, DataTypes) => {
    const Season = sequelize.define('Season', {
      season_number: DataTypes.INTEGER,
      air_date: DataTypes.STRING,
      episode_count: DataTypes.INTEGER,
      overview: DataTypes.TEXT,
      poster_path: DataTypes.STRING,
      vote_average: DataTypes.FLOAT,
      series_tmdb_id: DataTypes.INTEGER,
    });
  
    Season.associate = (models) => {
      Season.belongsTo(models.Series, { foreignKey: 'series_tmdb_id' });
      Season.hasMany(models.Episode, { foreignKey: 'season_id' });
    };
  
    return Season;
  };
  