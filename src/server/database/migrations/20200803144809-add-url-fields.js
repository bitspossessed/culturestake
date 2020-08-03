module.exports = {
  up: async (queryInterface, Sequelize) => {
    await queryInterface.addColumn('artworks', 'url', {
      type: Sequelize.STRING,
    });
    await queryInterface.addColumn('artists', 'url', {
      type: Sequelize.STRING,
    });
    return queryInterface.addColumn('festivals', 'url', {
      type: Sequelize.STRING,
    });
  },
  down: async (queryInterface) => {
    await queryInterface.removeColumn('artworks', 'url');
    await queryInterface.removeColumn('artists', 'url');
    return queryInterface.removeColumn('festivals', 'url');
  },
};
