module.exports = {
  up: (queryInterface, Sequelize) => {
    return queryInterface
      .addColumn('questions', 'chainId', {
        type: Sequelize.STRING,
      })
      .then(() => {
        queryInterface.removeColumn('questions', 'address');
      });
  },
  down: (queryInterface, Sequelize) => {
    return queryInterface
      .addColumn('questions', 'address', {
        type: Sequelize.STRING,
      })
      .then(() => {
        queryInterface.removeColumn('questions', 'chainId');
      });
  },
};
