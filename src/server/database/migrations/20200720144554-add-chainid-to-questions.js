module.exports = {
  up: (queryInterface, Sequelize) => {
    return queryInterface
      .addColumn('questions', 'chainId', {
        type: Sequelize.STRING(66),
        unique: true,
      })
      .then(
        queryInterface.sequelize.query(`
          update questions
          set "chainId" =
            cast((select floor(random() * 10000) + 1 where questions.id = questions.id)
            as text);`),
      )
      .then(
        queryInterface.changeColumn('questions', 'chainId', {
          type: Sequelize.STRING(66),
          unique: true,
          allowNull: false,
        }),
      );
  },
  down: (queryInterface) => {
    return queryInterface.removeColumn('questions', 'chainId');
  },
};
