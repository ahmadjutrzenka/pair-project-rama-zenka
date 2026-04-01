"use strict";
const { Model } = require("sequelize");

module.exports = (sequelize, DataTypes) => {
  class User extends Model {
    static associate(models) {
      User.hasOne(models.Profile, { foreignKey: "userId" });
      User.hasMany(models.Product, { foreignKey: "userId" });
      User.belongsToMany(models.Product, {
        through: models.Cart,
        foreignKey: "userId",
      });
    }
  }

  User.init(
    {
      username: {
        type: DataTypes.STRING,
      },
      email: {
        type: DataTypes.STRING,
        allowNull: false,
        unique: true,
        validate: {
          notNull: { msg: "Email wajib diisi" },
          notEmpty: { msg: "Email wajib diisi" },
          isEmail: { msg: "Format email tidak valid" },
        },
      },
      password: {
        type: DataTypes.STRING,
        allowNull: false,
        validate: {
          notNull: { msg: "Password wajib diisi" },
          notEmpty: { msg: "Password wajib diisi" },
          len: {
            args: [8],
            msg: "Password minimal 8 karakter",
          },
        },
      },
      role: {
        type: DataTypes.STRING,
        allowNull: false,
        validate: {
          notNull: { msg: "Role wajib diisi" },
          notEmpty: { msg: "Role wajib diisi" },
          isIn: {
            args: [["buyer", "seller"]],
            msg: "Role harus buyer atau seller",
          },
        },
      },
    },
    {
      sequelize,
      modelName: "User",
      // TODO (partner): tambahkan hooks bcrypt di sini
      // hooks: {
      //   beforeCreate: function (user) {
      //     user.password = bcrypt.hashSync(user.password, 10);
      //   },
      // },
    }
  );

  return User;
};
