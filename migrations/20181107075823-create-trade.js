'use strict';
module.exports = {
  up: (queryInterface, Sequelize) => {
    return queryInterface.createTable('trades', {
      id: {
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
        type: Sequelize.INTEGER
      },
      a_user: {
        type: Sequelize.INTEGER
      },
      b_user: {
        type: Sequelize.INTEGER
      },
      phase: {
        type: Sequelize.INTEGER
      },
      b_accept: {
        type: Sequelize.BOOLEAN
      },
      a_lock: {
        type: Sequelize.STRING
      },
      b_lock: {
        type: Sequelize.STRING
      },
      a_submit: {
        type: Sequelize.STRING
      },
      b_submit: {
        type: Sequelize.STRING
      },
      createdAt: {
        allowNull: false,
        type: Sequelize.DATE
      },
      updatedAt: {
        allowNull: false,
        type: Sequelize.DATE
      }
    });
  },
  down: (queryInterface, Sequelize) => {
    return queryInterface.dropTable('trades');
  }
};