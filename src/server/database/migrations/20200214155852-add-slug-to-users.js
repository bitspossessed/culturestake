module.exports = {
  up: (queryInterface, Sequelize) => {
    return queryInterface.addColumn('users', 'slug', {
      type: Sequelize.STRING,
      unique: true,
    });
  },
  down: queryInterface => {
    return queryInterface.removeColumn('users', 'slug');
  },
};
