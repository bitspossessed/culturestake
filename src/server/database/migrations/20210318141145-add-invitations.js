module.exports = {
  up: (queryInterface, Sequelize) => {
    return queryInterface.createTable('invitations', {
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
      email: {
        type: Sequelize.STRING,
        allowNull: false,
      },
      booth: {
        type: Sequelize.STRING(42),
        allowNull: false,
      },
      boothSignature: {
        type: Sequelize.STRING,
        allowNull: false,
      },
      festivalQuestionId: {
        type: Sequelize.INTEGER,
        allowNull: false,
      },
      festivalAnswerIds: {
        type: Sequelize.JSONB,
        allowNull: false,
      },
      nonce: {
        type: Sequelize.INTEGER,
        allowNull: false,
      },
      organisationId: {
        type: Sequelize.INTEGER,
      },
    });
  },
  down: (queryInterface) => {
    return queryInterface.dropTable('invitations');
  },
};
