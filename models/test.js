'use strict';
module.exports = (sequelize, DataTypes) => {
  var test = sequelize.define('test', {
    title: DataTypes.STRING,
    body: DataTypes.STRING
  }, {});
  test.associate = function(models) {
    // associations can be defined here
  };
  return test;
};