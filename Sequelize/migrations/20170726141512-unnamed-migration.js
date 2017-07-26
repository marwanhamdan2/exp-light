'use strict';

module.exports = {
  up: function (queryInterface, Sequelize) {
    queryInterface.createTable(
      'mig_table',
      {
        id: {
          type: Sequelize.INTEGER,
          primaryKey: true,
          autoIncrement: true
        },
        createdAt: {
          type: Sequelize.DATE
        },
        updatedAt: {
          type: Sequelize.DATE
        },
        attr1: Sequelize.STRING,
        attr2: Sequelize.INTEGER,
        attr3: {
          type: Sequelize.BOOLEAN,
          defaultValue: false,
          allowNull: false
        },
      },
      {
        charset: 'latin1',                    // default: null
      }
    )
  },

  down: function (queryInterface, Sequelize) {
    queryInterface.dropTable('mig_table')
  }
};
