module.exports = {
  up: queryInterface => {
    return queryInterface.removeConstraint(
      'festivals',
      'festivals_description_key',
      {
        type: 'unique',
      },
    );
  },
  down: queryInterface => {
    return queryInterface.addConstraint('festivals', ['description'], {
      type: 'unique',
      name: 'festivals_description_key',
    });
  },
};
