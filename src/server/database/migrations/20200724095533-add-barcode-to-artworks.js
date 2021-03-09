module.exports = {
  up: async (queryInterface, Sequelize) => {
    await queryInterface.sequelize.transaction(async (transaction) => {
      await queryInterface.addColumn(
        'artworks',
        'barcode',
        {
          type: Sequelize.STRING(8),
          unique: true,
        },
        { transaction },
      );

      await queryInterface.sequelize.query(
        `
          UPDATE artworks
          SET "barcode" =
            cast((select floor(random() * 10000000) + 1 WHERE artworks.id = artworks.id)
            as text);`,
        { transaction },
      );

      await queryInterface.changeColumn(
        'artworks',
        'barcode',
        {
          type: Sequelize.STRING(8),
          unique: true,
          allowNull: false,
        },
        { transaction },
      );
    });
  },
  down: (queryInterface) => {
    return queryInterface.removeColumn('artworks', 'barcode');
  },
};
