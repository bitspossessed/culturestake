module.exports = {
  up: (queryInterface, Sequelize) => {
    return queryInterface
      .addColumn('questions', 'chainId', {
        type: Sequelize.STRING(66),
        unique: true,
      })
      .then(
        queryInterface.sequelize.query(`
          UPDATE questions
          SET "chainId" =
            cast((SELECT floor(random() * 10000) + 1 WHERE questions.id = questions.id)
            AS text);`),
      )
      .then(
        queryInterface.changeColumn('questions', 'chainId', {
          type: Sequelize.STRING(66),
          unique: true,
          allowNull: false,
        }),
      );
  },
  down: (queryInterface, Sequelize) => {
    return queryInterface.addColumn('questions', 'chainId', {
      type: Sequelize.STRING,
    });
  },
};
