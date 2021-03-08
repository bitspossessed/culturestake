module.exports = {
  up: async (queryInterface, Sequelize) => {
    await queryInterface.sequelize.transaction(async (transaction) => {
      await queryInterface.addColumn(
        'festivals',
        'chainId',
        {
          type: Sequelize.STRING(66),
          unique: true,
        },
        { transaction },
      );

      await queryInterface.sequelize.query(
        `
          UPDATE festivals
          SET "chainId" =
            cast((SELECT floor(random() * 10000) + 1 WHERE festivals.id = festivals.id)
            AS text);`,
        { transaction },
      );

      await queryInterface.changeColumn(
        'festivals',
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
  down: (queryInterface) => {
    return queryInterface.removeColumn('festivals', 'chainId');
  },
};
