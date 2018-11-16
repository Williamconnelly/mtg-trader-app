'use strict';
module.exports = (sequelize, DataTypes) => {
  var message = sequelize.define('message', {
    id: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true
    },
    userId: DataTypes.INTEGER,
    tradeId: DataTypes.INTEGER,
    content: DataTypes.STRING
  }, {});
  message.associate = function(models) {
    // associations can be defined here
    models.message.belongsTo(models.user)
  };
  return message;
};