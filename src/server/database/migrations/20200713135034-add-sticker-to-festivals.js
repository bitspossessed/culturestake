module.exports = {
  up: (queryInterface, Sequelize) => {
    return queryInterface.addColumn('festivals', 'sticker', {
      type: Sequelize.STRING,
      allowNull: true,
    });
  },
  down: (queryInterface) => {
    return queryInterface.removeColumn('festivals', 'sticker');
  },
};
