'use strict';
module.exports = (sequelize, DataTypes) => {
  var card = sequelize.define('card', {
    layout: DataTypes.STRING,
    name: DataTypes.STRING,
    names: DataTypes.ARRAY,
    mana_cost: DataTypes.STRING,
    cmc: DataTypes.INTEGER,
    colors: DataTypes.ARRAY,
    color_identity: DataTypes.ARRAY,
    type: DataTypes.STRING,
    supertypes: DataTypes.ARRAY,
    types: DataTypes.ARRAY,
    subtypes: DataTypes.ARRAY,
    rarity: DataTypes.STRING,
    text: DataTypes.STRING,
    power: DataTypes.STRING,
    toughness: DataTypes.STRING,
    loyalty: DataTypes.INTEGER
  }, {});
  card.associate = function(models) {
    // associations can be defined here
  };
  return card;
};