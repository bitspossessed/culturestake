'use strict';

module.exports = {
  up: (queryInterface, Sequelize) => {
    return queryInterface
      .addColumn('artworks', 'description', {
        type: Sequelize.STRING(2000),
      })
      .then(() => {
        return queryInterface.addColumn('artworks', 'artistId', {
          type: Sequelize.INTEGER,
          references: {
            model: 'artists',
            key: 'id',
          },
          onUpdate: 'CASCADE',
          onDelete: 'SET NULL',
        });
      });
  },
  down: (queryInterface) => {
    return queryInterface
      .removeColumn('artworks', 'description')
      .then(queryInterface.removeColumn('artworks', 'artistId'));
  },
};
