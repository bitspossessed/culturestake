module.exports = {
  up: (queryInterface, Sequelize) => {
    return queryInterface.addColumn('answers', 'secret', {
      type: Sequelize.STRING,
      allowNull: true,
    });
  },
  down: (queryInterface) => {
    return queryInterface.removeColumn('answers', 'secret');
  },
};

