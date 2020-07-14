module.exports = {
  up: (queryInterface, Sequelize) => {
    return queryInterface.createTable('festivals2artworks', {
      id: {
        type: Sequelize.INTEGER,
        allowNull: false,
        primaryKey: true,
        autoIncrement: true,
      },
      festivalId: {
        type: Sequelize.INTEGER,
      },
      artworkId: {
        type: Sequelize.INTEGER,
      },
    });
  },
  down: (queryInterface) => {
    return queryInterface.dropTable('festivals2artworks');
  },
};
