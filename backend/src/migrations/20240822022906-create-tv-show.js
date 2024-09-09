'use strict';
/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.createTable('TVShows', {
      id: {
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
        type: Sequelize.INTEGER
      },
      tmdb_id: {
        type: Sequelize.INTEGER
      },
      name: {
        type: Sequelize.STRING
      },
      overview: {
        type: Sequelize.TEXT
      },
      first_air_date: {
        type: Sequelize.DATE
      },
      last_air_date: {
        type: Sequelize.DATE
      },
      poster_path: {
        type: Sequelize.STRING
      },
      backdrop_path: {
        type: Sequelize.STRING
      },
      popularity: {
        type: Sequelize.FLOAT
      },
      vote_average: {
        type: Sequelize.FLOAT
      },
      vote_count: {
        type: Sequelize.INTEGER
      },
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
  async down(queryInterface, Sequelize) {
    await queryInterface.dropTable('TVShows');
  }
};