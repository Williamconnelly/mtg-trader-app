'use strict';
module.exports = (sequelize, DataTypes) => {
  var trade = sequelize.define('trade', {
    a_user: DataTypes.INTEGER,
    b_user: DataTypes.INTEGER,
    phase: DataTypes.INTEGER,
    b_accept: DataTypes.BOOLEAN,
    a_lock: DataTypes.STRING,
    b_lock: DataTypes.STRING,
    a_submit: DataTypes.STRING,
    b_submit: DataTypes.STRING
  }, {});
  trade.associate = function(models) {
    // associations can be defined here
    models.trade.belongsToMany(models.collection, {through: "tradescollections"});
    models.trade.belongsTo(models.user, {foreignKey: 'a_user', as: 'user_a'});
    models.trade.belongsTo(models.user, {foreignKey: 'b_user', as: 'user_b'});
  };
  return trade;
};