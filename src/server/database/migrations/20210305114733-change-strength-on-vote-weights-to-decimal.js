module.exports = {
  up: async (queryInterface, Sequelize) => {
    await queryInterface.changeColumn('voteweights', 'strength', {
      type: Sequelize.DECIMAL(13, 2),
    });
  },
  down: async (queryInterface, Sequelize) => {
    await queryInterface.changeColumn('voteweights', 'strength', {
      type: Sequelize.INTEGER,
    });
  },
};
