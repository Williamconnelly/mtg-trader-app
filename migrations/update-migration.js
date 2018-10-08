module.exports = {
  up: function (queryInterface, Sequelize) {
    return Promise.all([
      queryInterface.addColumn(
        'cardsSets',
        'img_url',
         Sequelize.STRING
       ),
      queryInterface.addColumn(
        'cardsSets',
        'can_be_foil',
        Sequelize.BOOLEAN
      ),
      queryInterface.addColumn(
        'cardsSets',
        'collector_number',
        Sequelize.INTEGER
      ),
      queryInterface.addColumn(
        'collections',
        'card_condition',
        Sequelize.INTEGER
      ),
      queryInterface.addColumn(
        'collections',
        'foil',
        Sequelize.BOOLEAN
      ),
      queryInterface.addColumn(
        'cardsSets',
        'scryfall_id',
        Sequelize.INTEGER
      )
    ]);
  },

  down: function (queryInterface, Sequelize) {
    // logic for reverting the changes
  }
};