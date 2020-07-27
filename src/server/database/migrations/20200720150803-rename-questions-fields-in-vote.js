module.exports = {
  up: async (queryInterface) => {
    await queryInterface.renameColumn(
      'votes',
      'festivalQuestionAddress',
      'festivalQuestionChainId',
    );
    await queryInterface.renameColumn(
      'votes',
      'artworkQuestionAddress',
      'artworkQuestionChainId',
    );
  },
  down: async (queryInterface) => {
    await queryInterface.renameColumn(
      'votes',
      'festivalQuestionChainId',
      'festivalQuestionAddress',
    );
    await queryInterface.renameColumn(
      'votes',
      'artworkQuestionChainId',
      'artworkQuestionAddress',
    );
  },
};
