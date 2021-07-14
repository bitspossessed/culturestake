module.exports = {
  up: async (queryInterface, Sequelize) => {
    return queryInterface.addColumn('festivals', 'locationName', {
      type: Sequelize.STRING,
    });
  },

  down: async (queryInterface) => {
    return queryInterface.removeColumn('festivals', 'locationName');
  },
};
