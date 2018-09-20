'use strict';
module.exports = (sequelize, DataTypes) => {
  var collection = sequelize.define('collection', {
    id: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true
    },
    cardsSetId: DataTypes.INTEGER,
    userId: DataTypes.INTEGER,
    owned_copies: DataTypes.INTEGER,
    trade_copies: DataTypes.INTEGER
  }, {});
  collection.associate = function(models) {
    // associations can be defined here
  };
  return collection;
};