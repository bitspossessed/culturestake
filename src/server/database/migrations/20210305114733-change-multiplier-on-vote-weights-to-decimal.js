module.exports = {
  up: async (queryInterface, Sequelize) => {
    await queryInterface.changeColumn('voteweights', 'multiplier', {
      type: Sequelize.DECIMAL(13, 2),
    });
  },
  down: async (queryInterface, Sequelize) => {
    await queryInterface.changeColumn('voteweights', 'multiplier', {
      type: Sequelize.INTEGER,
    });
  },
};
