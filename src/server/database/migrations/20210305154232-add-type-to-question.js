'use strict';

const QUESTION_TYPES = ['festival', 'artwork'];

module.exports = {
  up: async (queryInterface, Sequelize) => {
    await queryInterface.sequelize.transaction(async (transaction) => {
      await queryInterface.addColumn('questions', 'type', {
        type: Sequelize.ENUM,
        values: QUESTION_TYPES,
        transaction,
      });
      await queryInterface.sequelize.query(
        `UPDATE questions SET type = (CASE WHEN "artworkId" IS NULL THEN 'festival'::enum_questions_type ELSE 'artwork'::enum_questions_type END)`,
      );
      await queryInterface.sequelize.query(
        `ALTER TABLE questions ALTER COLUMN type SET NOT NULL`,
      );
      await queryInterface.addIndex('questions', ['festivalId', 'type'], {
        unique: true,
        where: {
          type: 'festival',
        },
        transaction,
      });
    });
  },

  down: async (queryInterface) => {
    await queryInterface.sequelize.transaction(async (transaction) => {
      await queryInterface.removeIndex('questions', ['festivalId', 'type'], {
        transaction,
      });
      await queryInterface.removeColumn('questions', 'type', { transaction });
      await queryInterface.dropEnum('enum_questions_type', { transaction });
    });
  },
};
