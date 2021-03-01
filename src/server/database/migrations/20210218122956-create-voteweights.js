module.exports = {
  up: (queryInterface, Sequelize) => {
    return queryInterface.createTable('voteweights', {
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
      festivalId: {
        type: Sequelize.INTEGER,
        references: {
          model: 'festivals',
          key: 'id',
        },
        onUpdate: 'CASCADE',
        onDelete: 'CASCADE',
      },
      strength: {
        type: Sequelize.INTEGER,
        allowNull: false,
      },
      name: {
        type: Sequelize.STRING,
        allowNull: false,
      },
      type: {
        type: Sequelize.ENUM,
        values: ['organisation', 'hotspot', 'location'],
        allowNull: false,
      },
      location: {
        type: Sequelize.GEOGRAPHY('POINT', 4326),
        allowNull: true,
      },
      radius: {
        type: Sequelize.DECIMAL(13, 2),
        allowNull: true,
      },
      organisationId: {
        type: Sequelize.INTEGER,
        references: {
          model: 'organisations',
          key: 'id',
        },
        onUpdate: 'CASCADE',
        onDelete: 'CASCADE',
        allowNull: true,
      },
      hotspot: {
        type: Sequelize.STRING(42),
        allowNull: true,
      },
    });
  },
  down: (queryInterface) => {
    return queryInterface.dropTable('voteweights');
  },
};
