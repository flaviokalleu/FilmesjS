'use strict';
module.exports = {
  up: async (queryInterface, Sequelize) => {
    await queryInterface.createTable('ProductionCompanies', {
      id: {
        type: Sequelize.INTEGER,
        autoIncrement: true,
        primaryKey: true
      },
      tmdb_id: {
        type: Sequelize.INTEGER,
        allowNull: false,
        unique: true
      },
      name: Sequelize.STRING,
      logo_path: Sequelize.STRING,
      origin_country: Sequelize.STRING,
      createdAt: {
        allowNull: false,
        type: Sequelize.DATE
      },
      updatedAt: {
        allowNull: false,
        type: Sequelize.DATE
      }
    });
  },
  down: async (queryInterface, Sequelize) => {
    await queryInterface.dropTable('ProductionCompanies');
  }
};
