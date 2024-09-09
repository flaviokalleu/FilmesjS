module.exports = (sequelize, DataTypes) => {
    const Keyword = sequelize.define('Keyword', {
      name: DataTypes.STRING
    });
  
    Keyword.associate = function(models) {
      Keyword.belongsToMany(models.Movie, {
        through: 'MovieKeyword',
        foreignKey: 'keyword_id'
      });
    };
  
    return Keyword;
  };
  