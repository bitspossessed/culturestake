module.exports = {
  up: (queryInterface, Sequelize) => {
    return queryInterface.createTable('images', {
      id: {
        type: Sequelize.INTEGER,
        allowNull: false,
        primaryKey: true,
        autoIncrement: true,
      },
      createdAt: {
        type: Sequelize.DATE,
      },
      updatedAt: {
        type: Sequelize.DATE,
      },
      attachableId: {
        type: Sequelize.INTEGER,
      },
      attachableType: {
        type: Sequelize.STRING,
      },
      fileName: {
        type: Sequelize.STRING,
        allowNull: false,
      },
      fileType: {
        type: Sequelize.STRING,
        allowNull: false,
      },
      url: {
        type: Sequelize.STRING,
        allowNull: false,
      },
      urlThreshold: {
        type: Sequelize.STRING,
      },
      urlThresholdThumb: {
        type: Sequelize.STRING,
      },
      urlThumb: {
        type: Sequelize.STRING,
      },
    });
  },
  down: queryInterface => {
    return queryInterface.dropTable('images');
  },
};
