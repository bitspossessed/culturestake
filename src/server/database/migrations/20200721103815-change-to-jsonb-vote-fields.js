module.exports = {
  up: async (queryInterface) => {
    await queryInterface.changeColumn('votes', 'festivalAnswerChainIds', {
      type: 'JSONB USING CAST("festivalAnswerChainIds" as JSONB)',
      allowNull: false,
    });
    await queryInterface.changeColumn('votes', 'festivalVoteTokens', {
      type: 'JSONB USING CAST("festivalVoteTokens" as JSONB)',
      allowNull: false,
    });
    await queryInterface.changeColumn('votes', 'artworkAnswerChainIds', {
      type: 'JSONB USING CAST("artworkAnswerChainIds" as JSONB)',
      allowNull: false,
    });
    await queryInterface.changeColumn('votes', 'artworkVoteTokens', {
      type: 'JSONB USING CAST("artworkVoteTokens" as JSONB)',
      allowNull: false,
    });
  },
  down: async (queryInterface, Sequelize) => {
    await queryInterface.changeColumn('votes', 'festivalAnswerChainIds', {
      type: Sequelize.STRING,
    });
    await queryInterface.changeColumn('votes', 'festivalVoteTokens', {
      type: Sequelize.STRING,
    });
    await queryInterface.changeColumn('votes', 'artworkAnswerChainIds', {
      type: Sequelize.STRING,
    });
    await queryInterface.changeColumn('votes', 'artworkVoteTokens', {
      type: Sequelize.STRING,
    });
  },
};
