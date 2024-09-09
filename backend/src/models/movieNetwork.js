// models/movieNetwork.js
module.exports = (sequelize, DataTypes) => {
    const MovieNetwork = sequelize.define('MovieNetwork', {
      movie_id: {
        type: DataTypes.INTEGER,
        references: {
          model: 'Movies',
          key: 'id'
        }
      },
      network_id: {
        type: DataTypes.INTEGER,
        references: {
          model: 'Networks',
          key: 'id'
        }
      }
    });
  
    return MovieNetwork;
  };