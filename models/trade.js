'use strict';
module.exports = (sequelize, DataTypes) => {
  var trade = sequelize.define('trade', {
    user_one: DataTypes.INTEGER,
    user_two: DataTypes.INTEGER,
    phase: DataTypes.INTEGER
  }, {});
  trade.associate = function(models) {
    // associations can be defined here
  };
  return trade;
};