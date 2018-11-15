'use strict';
module.exports = (sequelize, DataTypes) => {
  var collection = sequelize.define('collection', {
    id: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true
    },
    printingId: DataTypes.INTEGER,
    userId: DataTypes.INTEGER,
    owned_copies: DataTypes.INTEGER,
    trade_copies: DataTypes.INTEGER,
    card_condition: DataTypes.INTEGER,
    foil: DataTypes.BOOLEAN
  }, {});
  collection.associate = function(models) {
    // associations can be defined here
    models.collection.belongsTo(models.printings);
    models.collection.belongsTo(models.user);
    models.collection.hasMany(models.tradescollections, {as: "tradeEntry"});
    models.collection.belongsToMany(models.trade, {through: "tradescollections"});
  };
  return collection;
};