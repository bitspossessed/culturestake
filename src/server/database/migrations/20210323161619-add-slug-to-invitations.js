module.exports = {
  up: async (queryInterface, Sequelize) => {
    await queryInterface.sequelize.transaction(async (transaction) => {
      await queryInterface.addColumn('invitations', 'festivalSlug', {
        type: Sequelize.STRING,
        transaction,
      });
      await queryInterface.sequelize.query(
        `UPDATE invitations SET "festivalSlug" = 'festival-slug'`,
      );
      await queryInterface.sequelize.query(
        `ALTER TABLE invitations ALTER COLUMN "festivalSlug" SET NOT NULL`,
      );
    });
  },
  down: async (queryInterface) => {
    await queryInterface.removeColumn('invitations', 'festivalSlug');
  },
};
