'use strict';
module.exports = (sequelize, DataTypes) => {
  var trade = sequelize.define('trade', {
    a_user: DataTypes.INTEGER,
    b_user: DataTypes.INTEGER,
    phase: DataTypes.INTEGER,
    b_accept: DataTypes.BOOLEAN,
    a_lock: DatTypes.STRING,
    b_lock: DataTypes.STRING,
    a_submit: DataTypes.STING,
    b_submit: DataTypes.STRING
  }, {});
  trade.associate = function(models) {
    // associations can be defined here
  };
  return trade;
};