'use strict';
module.exports = (sequelize, DataTypes) => {
  var printings = sequelize.define('printings', {
    id: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true
    },
    cardId: DataTypes.INTEGER,
    setId: DataTypes.INTEGER,
    rarity: DataTypes.STRING,
    img_url: DataTypes.STRING,
    can_be_foil: DataTypes.BOOLEAN,
    scryfall_url: DataTypes.INTEGER,
    backside_img_url: DataTypes.STRING
  }, {});
  printings.associate = function(models) {
    // associations can be defined here
    models.printings.belongsToMany(models.user, {through: "collection"});
    models.printings.belongsTo(models.card);
    models.printings.belongsTo(models.set);
  };
  return printings;
};