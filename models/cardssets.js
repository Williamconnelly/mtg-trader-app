'use strict';
module.exports = (sequelize, DataTypes) => {
  var cardsSets = sequelize.define('cardsSets', {
    cardId: DataTypes.INTEGER,
    setId: DataTypes.INTEGER
  }, {});
  cardsSets.associate = function(models) {
    // associations can be defined here
  };
  return cardsSets;
};