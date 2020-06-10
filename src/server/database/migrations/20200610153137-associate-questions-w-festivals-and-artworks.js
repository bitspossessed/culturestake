'use strict';

module.exports = {
  up: (queryInterface, Sequelize) => {
    return queryInterface
      .addColumn('questions', 'festivalId', {
        type: Sequelize.INTEGER,
        references: {
          model: 'festivals',
          key: 'id',
        },
        onUpdate: 'CASCADE',
        onDelete: 'SET NULL',
      })
      .then(() => {
        queryInterface.addColumn('questions', 'artworkId', {
          type: Sequelize.INTEGER,
          references: {
            model: 'artworks',
            key: 'id',
          },
          onUpdate: 'CASCADE',
          onDelete: 'SET NULL',
        });
      });
  },
  down: queryInterface => {
    return queryInterface
      .removeColumn('questions', 'festivalId')
      .then(queryInterface.removeColumn('questions', 'artworkId'));
  },
};
