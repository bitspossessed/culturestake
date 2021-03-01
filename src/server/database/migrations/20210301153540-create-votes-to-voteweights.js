module.exports = {
  up: (queryInterface, Sequelize) => {
    return queryInterface.createTable('votes2voteweights', {
      id: {
        type: Sequelize.INTEGER,
        allowNull: false,
        primaryKey: true,
        autoIncrement: true,
      },
      voteId: {
        type: Sequelize.INTEGER,
      },
      voteweightId: {
        type: Sequelize.INTEGER,
      },
    });
  },
  down: (queryInterface) => {
    return queryInterface.dropTable('votes2voteweights');
  },
};
