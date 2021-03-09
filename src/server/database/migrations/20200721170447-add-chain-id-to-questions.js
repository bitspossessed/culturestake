module.exports = {
  up: async (queryInterface, Sequelize) => {
    await queryInterface.sequelize.transaction(async (transaction) => {
      await queryInterface.addColumn(
        'questions',
        'chainId',
        {
          type: Sequelize.STRING(66),
          unique: true,
        },
        { transaction },
      );

      await queryInterface.sequelize.query(
        `
          UPDATE questions
          SET "chainId" =
            cast((SELECT floor(random() * 10000) + 1 WHERE questions.id = questions.id)
            AS text);`,
        { transaction },
      );

      await queryInterface.changeColumn(
        'questions',
        'chainId',
        {
          type: Sequelize.STRING(66),
          unique: true,
          allowNull: false,
        },
        { transaction },
      );
    });
  },
  down: (queryInterface, Sequelize) => {
    return queryInterface.addColumn('questions', 'chainId', {
      type: Sequelize.STRING,
    });
  },
};
