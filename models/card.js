'use strict';
module.exports = (sequelize, DataTypes) => {
  var card = sequelize.define('card', {
    layout: DataTypes.STRING,
    name: DataTypes.STRING,
    names: DataTypes.ARRAY(DataTypes.STRING),
    mana_cost: DataTypes.STRING,
    cmc: DataTypes.INTEGER,
    colors: DataTypes.ARRAY(DataTypes.STRING),
    color_identity: DataTypes.ARRAY(DataTypes.STRING),
    type: DataTypes.STRING,
    supertypes: DataTypes.ARRAY(DataTypes.STRING),
    types: DataTypes.ARRAY(DataTypes.STRING),
    subtypes: DataTypes.ARRAY(DataTypes.STRING),
    text: DataTypes.STRING(660),
    power: DataTypes.STRING,
    toughness: DataTypes.STRING,
    loyalty: DataTypes.INTEGER
  }, {});
  card.associate = function(models) {
    // associations can be defined here
    models.card.belongsToMany(models.set, {through: "printings"});
    models.card.belongsToMany(models.user, {through: "wishlist"});
    // Adding
    models.card.hasMany(models.printings, {as: "cardPrintings"});
    //
    models.card.hasMany(models.wishlist);
  };
  return card;
};