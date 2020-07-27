module.exports = {
  up: (queryInterface) => {
    return queryInterface.removeColumn('questions', 'address');
  },
  down: (queryInterface, Sequelize) => {
    return queryInterface.addColumn('questions', 'address', {
      type: Sequelize.STRING(42),
    });
  },
};
