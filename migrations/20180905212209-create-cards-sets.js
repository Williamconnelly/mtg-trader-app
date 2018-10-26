'use strict';
module.exports = {
  up: (queryInterface, Sequelize) => {
    return queryInterface.createTable('printings', {
      id: {
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
        type: Sequelize.INTEGER
      },
      cardId: {
        type: Sequelize.INTEGER
      },
      setId: {
        type: Sequelize.INTEGER
      },
      rarity: {
        type: Sequelize.STRING
      },
      img_url: {
        type: Sequelize.STRING
      },
      foil_version: {
        type: Sequelize.BOOLEAN
      },
      nonFoil_version: {
        type: Sequelize.BOOLEAN
      },
      scryfall_url: {
        type: Sequelize.STRING
      },
      backside_img_url: {
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
    return queryInterface.dropTable('printings');
  }
};