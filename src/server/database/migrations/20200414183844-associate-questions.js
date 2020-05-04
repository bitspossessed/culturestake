'use strict';

module.exports = {
  up: (queryInterface, Sequelize) => {
    return queryInterface.addColumn('answers', 'questionId', {
      type: Sequelize.INTEGER,
      references: {
        model: 'questions',
        key: 'id',
      },
      onUpdate: 'CASCADE',
      onDelete: 'SET NULL',
    });
  },

  down: queryInterface => {
    return queryInterface.removeColumn('answers', 'questionId');
  },
};
