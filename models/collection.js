'use strict';
module.exports = (sequelize, DataTypes) => {
  var collection = sequelize.define('collection', {
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