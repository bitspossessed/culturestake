'use strict';

module.exports = {
  up: (queryInterface, Sequelize) => {
    return queryInterface.createTable('properties', {
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
        unique: true,
      },
      title: {
        type: Sequelize.STRING(128),
        allowNull: false,
      },
    });
  },
  down: queryInterface => {
    return queryInterface.dropTable('properties');
  },
};
