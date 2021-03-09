module.exports = {
  up: (queryInterface, Sequelize) => {
    return queryInterface.addColumn('votes', 'location', {
      type: Sequelize.GEOGRAPHY('POINT', 4326),
      allowNull: true,
    });
  },
  down: (queryInterface) => {
    return queryInterface.removeColumn('votes', 'location');
  },
};
