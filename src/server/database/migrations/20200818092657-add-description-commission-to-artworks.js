module.exports = {
  up: async (queryInterface, Sequelize) => {
    await queryInterface.addColumn('artworks', 'descriptionCommission', {
      type: Sequelize.TEXT,
    });
  },
  down: async (queryInterface) => {
    await queryInterface.removeColumn('artworks', 'descriptionCommission');
  },
};
