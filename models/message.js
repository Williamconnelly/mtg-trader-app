'use strict';
module.exports = (sequelize, DataTypes) => {
  var message = sequelize.define('message', {
    userId: DataTypes.INTEGER,
    tradeId: DataTypes.INTEGER,
    content: DataTypes.STRING
  }, {});
  message.associate = function(models) {
    // associations can be defined here
  };
  return message;
};