module.exports = {
  up: (queryInterface, Sequelize) => {
    return queryInterface.addColumn('artworks', 'imageCredits', {
      type: Sequelize.STRING,
    });
  },
  down: (queryInterface) => {
    return queryInterface.removeColumn('artworks', 'imageCredits');
  },
};
