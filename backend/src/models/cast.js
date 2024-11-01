module.exports = (sequelize, DataTypes) => {
  const Cast = sequelize.define('Cast', {
    tmdb_id: {
      type: DataTypes.INTEGER,
      unique: true,
      allowNull: false
    },
    name: DataTypes.STRING,
    character_name: DataTypes.STRING,
    profile_path: DataTypes.STRING
  });

  Cast.associate = function(models) {
    Cast.belongsToMany(models.Movie, {
      through: 'MovieCast',
      foreignKey: 'cast_id',
      as: 'movies'  // Defina um alias para a associação
    });

    Cast.belongsToMany(models.TVShow, {
      through: 'TVShowCast',
      foreignKey: 'cast_id',
      as: 'tvshows'  // Defina um alias para a associação
    });
  };

  return Cast;
};
