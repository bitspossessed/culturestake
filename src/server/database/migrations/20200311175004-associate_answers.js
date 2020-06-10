'use strict';

module.exports = {
  up: (queryInterface, Sequelize) => {
    return queryInterface
      .addColumn('answers', 'artworkId', {
        type: Sequelize.INTEGER,
        references: {
          model: 'artworks',
          key: 'id',
        },
        onUpdate: 'CASCADE',
        onDelete: 'SET NULL',
      })
      .then(
        queryInterface.addColumn('answers', 'propertyId', {
          type: Sequelize.INTEGER,
          references: {
            model: 'properties',
            key: 'id',
          },
          onUpdate: 'CASCADE',
          onDelete: 'SET NULL',
        }),
      );
  },

  down: (queryInterface) => {
    return queryInterface
      .removeColumn('answers', 'artworkId')
      .then(queryInterface.removeColumn('answers', 'propertyId'));
  },
};
