// models/ProductionCompany.js
module.exports = (sequelize, DataTypes) => {
    const ProductionCompany = sequelize.define('ProductionCompany', {
      name: DataTypes.STRING,
      logo_path: DataTypes.STRING,
      origin_country: DataTypes.STRING,
    });
  
    ProductionCompany.associate = (models) => {
      ProductionCompany.belongsToMany(models.Series, { through: 'SeriesProductionCompanies', foreignKey: 'production_company_id' });
    };
  
    return ProductionCompany;
  };
  