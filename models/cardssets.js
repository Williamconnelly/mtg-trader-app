'use strict';
module.exports = (sequelize, DataTypes) => {
  var cardsSets = sequelize.define('cardsSets', {
    id: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true
    },
    cardId: DataTypes.INTEGER,
    setId: DataTypes.INTEGER,
    img_url: DataTypes.STRING,
    can_be_foil: DataTypes.BOOLEAN,
    collector_number: DataTypes.INTEGER,
    scryfall_id: DataTypes.INTEGER
  }, {});
  cardsSets.associate = function(models) {
    // associations can be defined here
    models.cardsSets.belongsToMany(models.user, {through: "collection"});
    models.cardsSets.belongsTo(models.card);
    models.cardsSets.belongsTo(models.set);
  };
  return cardsSets;
};