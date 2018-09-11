'use strict';
module.exports = (sequelize, DataTypes) => {
  var cardsSets = sequelize.define('cardsSets', {
    cardId: DataTypes.INTEGER,
    setId: DataTypes.INTEGER
  }, {});
  cardsSets.associate = function(models) {
    // associations can be defined here
    models.cardsSets.belongsToMany(models.user, {through: "collection"});
  };
  return cardsSets;
};