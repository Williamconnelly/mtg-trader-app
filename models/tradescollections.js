'use strict';
module.exports = (sequelize, DataTypes) => {
  var tradescollections = sequelize.define('tradescollections', {
    collectionId: DataTypes.INTEGER,
    tradeId: DataTypes.INTEGER,
    copies_offered: DataTypes.INTEGER
  }, {});
  tradescollections.associate = function(models) {
    // associations can be defined here
  };
  return tradescollections;
};