'use strict';
module.exports = (sequelize, DataTypes) => {
  var wishlist = sequelize.define('wishlist', {
    cardId: DataTypes.INTEGER,
    userId: DataTypes.INTEGER,
    number_wanted: DataTypes.INTEGER,
    pref_printing: DataTypes.INTEGER
  }, {});
  wishlist.associate = function(models) {
    // associations can be defined here
  };
  return wishlist;
};