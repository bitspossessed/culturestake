'use strict';

module.exports = {
  up: (queryInterface, Sequelize) => {
    return queryInterface.createTable('votes', {
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
      signature: {
        type: Sequelize.STRING(132),
        allowNull: false,
        unique: true,
      },
      sender: {
        type: Sequelize.STRING(42),
        allowNull: false,
      },
      booth: {
        type: Sequelize.STRING(42),
        allowNull: false,
      },
      boothSignature: {
        type: Sequelize.STRING(132),
        allowNull: false,
        unique: true,
      },
      nonce: {
        type: Sequelize.INTEGER,
        allowNull: false,
      },
      question: {
        type: Sequelize.STRING(66),
        allowNull: false,
      },
    });
  },
  down: queryInterface => {
    return queryInterface.dropTable('votes');
  },
};
