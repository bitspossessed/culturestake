'use strict';

module.exports = {
  up: (queryInterface) => {
    return queryInterface.removeColumn('answers', 'slug');
  },
  down: (queryInterface, Sequelize) => {
    return queryInterface.addColumn('answers', 'slug', {
      type: Sequelize.STRING,
    });
  },
};
