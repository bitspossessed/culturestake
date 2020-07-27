module.exports = {
  up: (queryInterface, Sequelize) => {
    return queryInterface
      .addColumn('votes', 'festivalQuestion', {
        type: Sequelize.STRING(66),
        allowNull: false,
      })
      .then(
        queryInterface.addColumn('votes', 'festivalAnswers', {
          type: Sequelize.STRING(2000),
          allowNull: false,
        }),
      )
      .then(
        queryInterface.addColumn('votes', 'festivalVoteTokens', {
          type: Sequelize.STRING(2000),
          allowNull: false,
        }),
      )
      .then(
        queryInterface.addColumn('votes', 'artworkQuestion', {
          type: Sequelize.STRING(66),
          allowNull: false,
        }),
      )
      .then(
        queryInterface.addColumn('votes', 'artworkAnswers', {
          type: Sequelize.STRING(2000),
          allowNull: false,
        }),
      )
      .then(
        queryInterface.addColumn('votes', 'artworkVoteTokens', {
          type: Sequelize.STRING(2000),
          allowNull: false,
        }),
      )
      .then(queryInterface.removeColumn('votes', 'question'));
  },
  down: (queryInterface, Sequelize) => {
    return queryInterface
      .removeColumn('votes', 'festivalQuestion')
      .then(queryInterface.removeColumn('votes', 'festivalAnswers'))
      .then(queryInterface.removeColumn('votes', 'festivalVoteTokens'))
      .then(queryInterface.removeColumn('votes', 'artworkQuestion'))
      .then(queryInterface.removeColumn('votes', 'artworkAnswers'))
      .then(queryInterface.removeColumn('votes', 'artworkVoteTokens'))
      .then(
        queryInterface.addColumn('votes', 'question', {
          type: Sequelize.STRING(66),
          allowNull: false,
        }),
      );
  },
};
