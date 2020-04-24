'use strict';

module.exports = {
  up: (queryInterface, Sequelize) => {
    return queryInterface.addColumn('questions', 'address', {
      type: Sequelize.STRING(42),
    });
  },
  down: queryInterface => {
    return queryInterface.removeColumn('questions', 'address');
  },
};
