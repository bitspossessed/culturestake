'use strict';

module.exports = {
  up: (queryInterface, Sequelize) => {
    return queryInterface
      .addColumn('festivals2artworks', 'createdAt', {
        type: Sequelize.DATE,
      })
      .then(
        queryInterface.addColumn('festivals2artworks', 'updatedAt', {
          type: Sequelize.DATE,
        }),
      );
  },
  down: (queryInterface) => {
    return queryInterface
      .removeColumn('festivals2artworks', 'createdAt')
      .then(queryInterface.removeColumn('festivals2artworks', 'updatedAt'));
  },
};
