module.exports = {
  up: (queryInterface, Sequelize) => {
    return queryInterface.createTable('organisations', {
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
      name: {
        type: Sequelize.STRING(128),
        allowNull: false,
      },
      description: {
        type: Sequelize.TEXT,
        allowNull: false,
      },
    });
  },
  down: (queryInterface) => {
    return queryInterface.dropTable('organisations');
  },
};
