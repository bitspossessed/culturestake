module.exports = {
  up: async (queryInterface, Sequelize) => {
    await queryInterface.addColumn('answers', 'secret', {
      type: Sequelize.STRING,
      unique: true,
    });
  },
  down: async (queryInterface) => {
    await queryInterface.removeColumn('answers', 'secret');
  },
};
