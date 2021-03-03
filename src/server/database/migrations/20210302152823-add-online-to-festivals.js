module.exports = {
  up: (queryInterface, Sequelize) => {
    return queryInterface.addColumn('festivals', 'online', {
      type: Sequelize.BOOLEAN,
    });
  },

  down: (queryInterface) => {
    return queryInterface.removeColumn('festivals', 'online');
  },
};
