module.exports = {
  up: (queryInterface, Sequelize) => {
    return queryInterface.addColumn('users', 'slug', {
      type: Sequelize.STRING,
    });
  },
  down: queryInterface => {
    return queryInterface.removeColumn('users', 'slug');
  },
};
