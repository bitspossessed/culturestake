'use strict';

module.exports = {
  up: (queryInterface, Sequelize) => {
    return queryInterface
      .addColumn('answers', 'artworkSlug', {
        type: Sequelize.STRING,
        references: {
          model: 'artworks',
          key: 'slug',
        },
        onUpdate: 'CASCADE',
        onDelete: 'SET NULL',
      })
      .then(
        queryInterface.addColumn('answers', 'propertySlug', {
          type: Sequelize.STRING,
          references: {
            model: 'properties',
            key: 'slug',
          },
          onUpdate: 'CASCADE',
          onDelete: 'SET NULL',
        }),
      );
  },

  down: queryInterface => {
    return queryInterface
      .removeColumn('answers', 'artworkSlug')
      .then(queryInterface.removeColumn('answers', 'propertySlug'));
  },
};
