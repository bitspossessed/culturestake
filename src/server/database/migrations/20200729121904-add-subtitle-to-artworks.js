module.exports = {
  up: (queryInterface, Sequelize) => {
    return queryInterface.addColumn('artworks', 'subtitle', {
      type: Sequelize.STRING,
    });
  },
  down: (queryInterface) => {
    return queryInterface.removeColumn('artworks', 'subtitle');
  },
};
