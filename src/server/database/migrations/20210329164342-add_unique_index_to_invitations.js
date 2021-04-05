module.exports = {
  up: async (queryInterface, Sequelize) => {
    await queryInterface.addIndex('invitations', ['boothSignature'], { type: 'unique' })
  },
  down: async (queryInterface) => {
    await queryInterface.removeIndex('invitations', ['boothSignature']);
  },
};
