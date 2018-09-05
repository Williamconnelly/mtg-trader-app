'use strict';
module.exports = {
  up: (queryInterface, Sequelize) => {
    return queryInterface.createTable('cards', {
      id: {
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
        type: Sequelize.INTEGER
      },
      layout: {
        type: Sequelize.STRING
      },
      name: {
        type: Sequelize.STRING
      },
      names: {
        type: Sequelize.ARRAY(Sequelize.STRING)
      },
      mana_cost: {
        type: Sequelize.STRING
      },
      cmc: {
        type: Sequelize.INTEGER
      },
      colors: {
        type: Sequelize.ARRAY(Sequelize.STRING)
      },
      color_identity: {
        type: Sequelize.ARRAY(Sequelize.STRING)
      },
      type: {
        type: Sequelize.STRING
      },
      supertypes: {
        type: Sequelize.ARRAY(Sequelize.STRING)
      },
      types: {
        type: Sequelize.ARRAY(Sequelize.STRING)
      },
      subtypes: {
        type: Sequelize.ARRAY(Sequelize.STRING)
      },
      rarity: {
        type: Sequelize.STRING
      },
      text: {
        type: Sequelize.STRING(400)
      },
      power: {
        type: Sequelize.STRING
      },
      toughness: {
        type: Sequelize.STRING
      },
      loyalty: {
        type: Sequelize.INTEGER
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
    return queryInterface.dropTable('cards');
  }
};