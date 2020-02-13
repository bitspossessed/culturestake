module.exports = {
  up: queryInterface => {
    return queryInterface.bulkInsert('users', [
      {
        username: 'admin',
        password: 'adminadmin',
        email: 'admin@domain.com',
      },
    ]);
  },
  down: queryInterface => {
    return queryInterface.bulkDelete('users', [
      {
        email: ['admin@domain.com'],
      },
    ]);
  },
};
