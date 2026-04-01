"use strict";

module.exports = {
  async up(queryInterface) {
    await queryInterface.bulkInsert("Categories", [
      { name: "Sports", createdAt: new Date(), updatedAt: new Date() },
      { name: "Casual", createdAt: new Date(), updatedAt: new Date() },
      { name: "Formal", createdAt: new Date(), updatedAt: new Date() },
      { name: "Womenswear", createdAt: new Date(), updatedAt: new Date() },
    ]);
  },
  async down(queryInterface) {
    await queryInterface.bulkDelete("Categories", null, {});
  },
};
