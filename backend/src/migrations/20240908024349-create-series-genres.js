'use strict';
module.exports = {
  up: async (queryInterface, Sequelize) => {
    await queryInterface.createTable('SeriesGenres', {
      series_tmdb_id: {
        type: Sequelize.INTEGER,
        references: { model: 'Series', key: 'tmdb_id' },
        onDelete: 'CASCADE'
      },
      genre_id: {
        type: Sequelize.INTEGER,
        references: { model: 'Genres', key: 'id' },
        onDelete: 'CASCADE'
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
  down: async (queryInterface, Sequelize) => {
    await queryInterface.dropTable('SeriesGenres');
  }
};
