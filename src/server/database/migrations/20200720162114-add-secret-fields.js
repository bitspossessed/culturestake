module.exports = {
  up: async (queryInterface, Sequelize) => {
    await queryInterface.addColumn('questions', 'secret', {
      type: Sequelize.STRING,
      unique: true,
    });

    await queryInterface.addColumn('festivals', 'secret', {
      type: Sequelize.STRING,
      unique: true,
    });
  },
  down: async (queryInterface) => {
    await queryInterface.removeColumn('questions', 'secret');
    await queryInterface.removeColumn('festivals', 'secret');
  },
};
