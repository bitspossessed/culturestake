module.exports = {
  up: (queryInterface, Sequelize) => {
    return queryInterface
      .addColumn('festivals', 'chainId', {
        type: Sequelize.STRING(66),
        unique: true,
      })
      .then(
        queryInterface.sequelize.query(`
          UPDATE festivals
          SET "chainId" =
            cast((SELECT floor(random() * 10000) + 1 WHERE festivals.id = festivals.id)
            AS text);`),
      )
      .then(
        queryInterface.changeColumn('festivals', 'chainId', {
          type: Sequelize.STRING(66),
          unique: true,
          allowNull: false,
        }),
      );
  },
  down: (queryInterface) => {
    return queryInterface.removeColumn('festivals', 'chainId');
  },
};
