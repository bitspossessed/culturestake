module.exports = {
  up: async (queryInterface) => {
    await queryInterface.renameColumn('votes', 'signature', 'senderSignature');
    await queryInterface.renameColumn('votes', 'sender', 'senderAddress');
    await queryInterface.renameColumn('votes', 'booth', 'boothAddress');
    await queryInterface.renameColumn(
      'votes',
      'festivalQuestion',
      'festivalQuestionAddress',
    );
    await queryInterface.renameColumn(
      'votes',
      'festivalAnswers',
      'festivalAnswerChainIds',
    );
    await queryInterface.renameColumn(
      'votes',
      'artworkQuestion',
      'artworkQuestionAddress',
    );
    await queryInterface.renameColumn(
      'votes',
      'artworkAnswers',
      'artworkAnswerChainIds',
    );
  },
  down: async (queryInterface) => {
    await queryInterface.renameColumn('votes', 'senderSignature', 'signature');
    await queryInterface.renameColumn('votes', 'senderAddress', 'sender');
    await queryInterface.renameColumn('votes', 'boothAddress', 'booth');
    await queryInterface.renameColumn(
      'votes',
      'festivalQuestionAddress',
      'festivalQuestion',
    );
    await queryInterface.renameColumn(
      'votes',
      'festivalAnswerChainIds',
      'festivalAnswers',
    );
    await queryInterface.renameColumn(
      'votes',
      'artworkQuestionAddress',
      'artworkQuestion',
    );
    await queryInterface.renameColumn(
      'votes',
      'artworkAnswerChainIds',
      'artworkAnswers',
    );
  },
};
