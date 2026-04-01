"use strict";
// TODO (partner): setelah bcrypt diimplementasi, update password di sini
// pakai bcrypt.hashSync('seller123', 10) dan bcrypt.hashSync('buyer123', 10)

module.exports = {
  async up(queryInterface) {
    await queryInterface.bulkInsert("Users", [
      {
        username: "admin_seller",
        email: "seller@pairproject.com",
        password: "seller123",
        role: "seller",
        createdAt: new Date(),
        updatedAt: new Date(),
      },
      {
        username: "john_buyer",
        email: "buyer@pairproject.com",
        password: "buyer123",
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
