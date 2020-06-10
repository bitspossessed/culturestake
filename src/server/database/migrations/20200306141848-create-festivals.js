module.exports = {
  up: (queryInterface, Sequelize) => {
    return queryInterface.createTable('festivals', {
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
      description: {
        type: Sequelize.TEXT,
        allowNull: false,
        unique: true,
      },
    });
  },
  down: (queryInterface) => {
    return queryInterface.dropTable('festivals');
  },
};
