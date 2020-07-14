module.exports = {
  up: (queryInterface, Sequelize) => {
    return queryInterface.addColumn('festivals', 'subtitle', {
      type: Sequelize.STRING,
    });
  },
  down: (queryInterface) => {
    return queryInterface.removeColumn('festivals', 'subtitle');
  },
};
