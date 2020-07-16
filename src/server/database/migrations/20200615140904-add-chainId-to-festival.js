module.exports = {
  up: (queryInterface, Sequelize) => {
    return queryInterface
      .addColumn('festivals', 'chainId', {
        type: Sequelize.STRING(66),
        unique: true,
      })
      .then(
        queryInterface.sequelize.query(`
          update festivals
          set "chainId" =
            cast((select floor(random() * 10000) + 1 where festivals.id = festivals.id)
            as text);`),
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
