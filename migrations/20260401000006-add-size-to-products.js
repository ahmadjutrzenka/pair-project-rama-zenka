"use strict";
module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.addColumn("Products", "size", {
      type: Sequelize.INTEGER,
      allowNull: true,
    });
  },
  async down(queryInterface) {
    await queryInterface.removeColumn("Products", "size");
  },
};
