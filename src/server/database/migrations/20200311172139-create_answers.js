'use strict';

module.exports = {
  up: (queryInterface, Sequelize) => {
    return queryInterface.createTable('answers', {
      id: {
        type: Sequelize.INTEGER,
        allowNull: false,
        primaryKey: true,
        autoIncrement: true,
      },
      createdAt: {
        type: Sequelize.DATE,
      },
      updatedAt: {
        type: Sequelize.DATE,
      },
      slug: {
        type: Sequelize.STRING,
      },
      clientId: {
        type: Sequelize.STRING(64),
        allowNull: false,
        unique: true,
      },
      chainId: {
        type: Sequelize.STRING(64),
        allowNull: false,
        unique: true,
      },
      type: {
        type: Sequelize.ENUM,
        values: ['artwork', 'property'],
        allowNull: false,
      },
    });
  },
  down: queryInterface => {
    return queryInterface.dropTable('answers');
  },
};
