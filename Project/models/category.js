"use strict";
const { Model } = require("sequelize");

module.exports = (sequelize, DataTypes) => {
  class Category extends Model {
    static associate(models) {
      Category.hasMany(models.Product, { foreignKey: "categoryId" });
    }
  }

  Category.init(
    {
      name: {
        type: DataTypes.STRING,
        allowNull: false,
        validate: {
          notNull: { msg: "Nama kategori wajib diisi" },
          notEmpty: { msg: "Nama kategori wajib diisi" },
        },
      },
    },
    {
      sequelize,
      modelName: "Category",
    }
  );

  return Category;
};
