"use strict";

const bcrypt = require("bcryptjs");

module.exports = {
  async up(queryInterface) {
    await queryInterface.bulkInsert("Users", [
      {
        username: "admin_seller",
        email: "seller@pairproject.com",
        password: bcrypt.hashSync("seller123", 10),
        role: "seller",
        createdAt: new Date(),
        updatedAt: new Date(),
      },
      {
        username: "john_buyer",
        email: "buyer@pairproject.com",
        password: bcrypt.hashSync("buyer123", 10),
        role: "buyer",
        createdAt: new Date(),
        updatedAt: new Date(),
      },
    ]);
  },
  async down(queryInterface) {
    await queryInterface.bulkDelete("Users", null, {});
  },
};
