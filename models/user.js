'use strict';
const bcrypt = require("bcrypt");
module.exports = (sequelize, DataTypes) => {
  var user = sequelize.define('user', {
    username: DataTypes.STRING,
    password: DataTypes.STRING,
    email: DataTypes.STRING
  }, {});
  user.associate = function(models) {
    // associations can be defined here
  };
  // This checks the entered password against the database hashed password
  user.prototype.validPassword = passwordTyped => bcrypt.compareSync(passwordTyped, this.password);
  user.prototype.toJSON = () => {
    var userData = this.get();
    delete userData.password;
    return userData;
  }
  return user;
};