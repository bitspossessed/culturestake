module.exports = {
  up: (queryInterface, Sequelize) => {
    return queryInterface.createTable('questions', {
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
      title: {
        type: Sequelize.STRING(128),
        allowNull: false,
      },
    });
  },
  down: queryInterface => {
    return queryInterface.dropTable('questions');
  },
};
