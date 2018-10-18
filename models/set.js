'use strict';
module.exports = (sequelize, DataTypes) => {
  var set = sequelize.define('set', {
    title: DataTypes.STRING,
    code: DataTypes.STRING
  }, {});
  set.associate = function(models) {
    // associations can be defined here
    models.set.belongsToMany(models.card, {through: "printings"});
  };
  return set;
};