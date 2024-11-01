module.exports = (sequelize, DataTypes) => {
  const Director = sequelize.define('Director', {
    tmdb_director_id: {
      type: DataTypes.INTEGER,
      unique: true,
      allowNull: false
    },
    name: DataTypes.STRING,
    profile_path: DataTypes.STRING
  });

  Director.associate = function(models) {
    Director.belongsToMany(models.Movie, {
      through: 'MovieDirector',
      foreignKey: 'director_id'
    });

    Director.belongsToMany(models.TVShow, {
      through: 'TVShowDirector',
      foreignKey: 'director_id'
    });
  };

  return Director;
};
