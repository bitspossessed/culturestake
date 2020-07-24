module.exports = {
  up: (queryInterface, Sequelize) => {
    return queryInterface
      .addColumn('artworks', 'barcode', {
        type: Sequelize.STRING(8),
        unique: true,
      })
      .then(
        queryInterface.sequelize.query(`
          UPDATE artworks
          SET "barcode" =
            cast((select floor(random() * 10000000) + 1 WHERE artworks.id = artworks.id)
            as text);`),
      )
      .then(
        queryInterface.changeColumn('artworks', 'barcode', {
          type: Sequelize.STRING(8),
          unique: true,
          allowNull: false,
        }),
      );
  },
  down: (queryInterface) => {
    return queryInterface.removeColumn('artworks', 'barcode');
  },
};
