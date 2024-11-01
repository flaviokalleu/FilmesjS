'use strict';
const { Model } = require('sequelize');

module.exports = (sequelize, DataTypes) => {
  class TVShowCast extends Model {
    static associate(models) {
      // Associando TVShowCast a Series
      TVShowCast.belongsTo(models.Series, {
        foreignKey: 'tv_show_id', // deve ser 'tv_show_id' referenciando 'tmdb_id'
        as: 'series'
      });
      // Associando TVShowCast a Cast
      TVShowCast.belongsTo(models.Cast, {
        foreignKey: 'cast_id',
        as: 'cast'
      });
    }
  }
  TVShowCast.init({
    tv_show_id: {
      type: DataTypes.INTEGER,
      allowNull: false, // Torna obrigatória para garantir integridade referencial
      references: {
        model: 'Series', // Nome da tabela
        key: 'tmdb_id' // Chave primária da tabela Series
      }
    },
    cast_id: {
      type: DataTypes.INTEGER,
      allowNull: false,
      references: {
        model: 'Cast', // Nome da tabela
        key: 'id' // Chave primária da tabela Cast
      }
    }
  }, {
    sequelize,
    modelName: 'TVShowCast',
    timestamps: true // Se você deseja ter createdAt e updatedAt
  });
  return TVShowCast;
};
