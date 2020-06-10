module.exports = {
  up: (queryInterface, Sequelize) => {
    return queryInterface.createTable('documents', {
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
      attachableId: {
        type: Sequelize.INTEGER,
      },
      attachableType: {
        type: Sequelize.STRING,
      },
      fileName: {
        type: Sequelize.STRING,
        allowNull: false,
      },
      fileType: {
        type: Sequelize.STRING,
        allowNull: false,
      },
      url: {
        type: Sequelize.STRING,
        allowNull: false,
      },
    });
  },
  down: (queryInterface) => {
    return queryInterface.dropTable('documents');
  },
};
