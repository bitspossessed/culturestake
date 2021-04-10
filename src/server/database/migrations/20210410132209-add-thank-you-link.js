module.exports = {
  up: async (queryInterface, Sequelize) => {
    return queryInterface.addColumn('festivals', 'thankyouUrl', {
      type: Sequelize.STRING,
    });
  },

  down: async (queryInterface) => {
    return queryInterface.removeColumn('festivals', 'thankyouUrl');
  },
};
