"use strict";
const { Model, Op } = require("sequelize");

module.exports = (sequelize, DataTypes) => {
  class Product extends Model {
    // ============ STATIC METHOD - ambil semua produk ============
    static async getAll(query) {
      var search = query.search || "";
      var sort = query.sort || "";
      var categoryId = query.categoryId || "";

      var where = {};
      var order = [];

      if (search) {
        where.name = { [Op.iLike]: "%" + search + "%" };
      }

      if (categoryId) {
        where.categoryId = categoryId;
      }

      if (sort == "price_asc") order.push(["price", "ASC"]);
      else if (sort == "price_desc") order.push(["price", "DESC"]);
      else if (sort == "terlaris") order.push(["sold", "DESC"]);

      var products = await Product.findAll({
        where: where,
        order: order,
        include: [
          { model: sequelize.models.Category, as: "Category" },
          { model: sequelize.models.User, as: "User" },
        ],
      });

      return products;
    }

    // ============ STATIC METHOD - ambil 1 produk by id ============
    static async getById(id) {
      var product = await Product.findByPk(id, {
        include: [
          { model: sequelize.models.Category, as: "Category" },
          { model: sequelize.models.User, as: "User" },
        ],
      });
      return product;
    }

    // ============ INSTANCE METHOD - format harga ============
    formatPrice() {
      return new Intl.NumberFormat("id-ID", {
        style: "currency",
        currency: "IDR",
        minimumFractionDigits: 0,
      }).format(this.price);
    }

    // ============ INSTANCE METHOD - cek terlaris ============
    isBestSeller() {
      return this.sold >= 15;
    }

    static associate(models) {
      Product.belongsTo(models.Category, {
        foreignKey: "categoryId",
        as: "Category",
      });
      Product.belongsTo(models.User, {
        foreignKey: "userId",
        as: "User",
      });
      Product.belongsToMany(models.User, {
        through: models.Cart,
        foreignKey: "productId",
      });
      Product.hasMany(models.Cart, { foreignKey: "productId" });
    }
  }

  Product.init(
    {
      name: {
        type: DataTypes.STRING,
        allowNull: false,
        validate: {
          notNull: { msg: "Nama produk wajib diisi" },
          notEmpty: { msg: "Nama produk wajib diisi" },
        },
      },
      description: {
        type: DataTypes.STRING,
        allowNull: false,
        validate: {
          notNull: { msg: "Deskripsi wajib diisi" },
          notEmpty: { msg: "Deskripsi wajib diisi" },
        },
      },
      price: {
        type: DataTypes.INTEGER,
        allowNull: false,
        validate: {
          notNull: { msg: "Harga wajib diisi" },
          notEmpty: { msg: "Harga wajib diisi" },
          min: {
            args: [1000],
            msg: "Harga minimal Rp 1.000",
          },
        },
      },
      stock: {
        type: DataTypes.INTEGER,
        allowNull: false,
        validate: {
          notNull: { msg: "Stok wajib diisi" },
          min: {
            args: [0],
            msg: "Stok tidak boleh negatif",
          },
        },
      },
      sold: {
        type: DataTypes.INTEGER,
        defaultValue: 0,
        validate: {
          // ============ CUSTOM VALIDATION ============
          notNegative: function (value) {
            if (value < 0) {
              throw new Error("Jumlah terjual tidak boleh negatif");
            }
          },
        },
      },
      imgUrl: {
        type: DataTypes.STRING,
        validate: {
          isUrl: { msg: "URL gambar tidak valid" },
        },
      },
      categoryId: {
        type: DataTypes.INTEGER,
      },
      userId: {
        type: DataTypes.INTEGER,
      },
    },
    {
      sequelize,
      modelName: "Product",
    }
  );

  return Product;
};
