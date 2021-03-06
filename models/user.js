'use strict';
const bcrypt = require("bcrypt");

module.exports = (sequelize, DataTypes) => {
  var user = sequelize.define('user', {
    username: { type: DataTypes.STRING,
      validate: {
        len: {
          args: [1, 99],
          msg: "Invalid Name. Must be between 1 and 99 characters."
        }
      }
    },
    password: { type: DataTypes.STRING,
      validate: {
        len: {
          args: [8,99],
          msg: "Password must be between 8 and 99 characters."
        }
      }
    },
    email: { type: DataTypes.STRING,
      validate: {
        isEmail: {
          msg: "Invalid email address."
        }
      }
    }
  }, {
    hooks: {
      beforeCreate: (pendingUser, options) => {
        if (pendingUser && pendingUser.password) {
          var hash = bcrypt.hashSync(pendingUser.password, 12);
          pendingUser.password = hash;
        }
      }
    }
  });
  user.associate = function(models) {
    // associations can be defined here
    models.user.belongsToMany(models.card, {through: "wishlist"});
    models.user.belongsToMany(models.printings, {through: "collection"})
    // models.user.belongsToMany(models.user, {through: "trade"});
    models.user.hasMany(models.wishlist);
    models.user.hasMany(models.collection);
    models.user.hasMany(models.trade, {foreignKey: 'a_user', as: 'initiated_trades'});
    models.user.hasMany(models.trade, {foreignKey: 'b_user', as: 'received_trades'});
  };
  // This checks the entered password against the database hashed password
  user.prototype.validPassword = passwordTyped => bcrypt.compareSync(passwordTyped, this.password);

  user.prototype.toJSON = function () {
    var userData = this.get();
    delete userData.password;
    return userData;
  };

  // Returns user object without password (for token)
  // user.prototype.set("toObject", {
  //   transform: (doc, ret, options) => {
  //     let returnJson = {
  //       id: ret.id,
  //       email: ret.email,
  //       name: ret.name
  //     }
  //     return returnJson;
  //   }
  // })

  return user;
};