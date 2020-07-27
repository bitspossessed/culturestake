module.exports = {
  up: (queryInterface, Sequelize) => {
    return queryInterface.addColumn('artworks', 'sticker', {
      type: Sequelize.STRING,
      allowNull: true,
    });
  },
  down: (queryInterface) => {
    return queryInterface.removeColumn('artworks', 'sticker');
  },
};
