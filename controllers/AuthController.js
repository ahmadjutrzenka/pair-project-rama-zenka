const { User } = require("../models");
const bcrypt = require("bcryptjs");

class AuthController {
  static getLogin(req, res) {
    res.render("auth/login", { error: null });
  }

  static async postLogin(req, res) {
    try {
      var email = req.body.email;
      var password = req.body.password;

      var user = await User.findOne({ where: { email: email } });
      if (!user) {
        return res.render("auth/login", { error: "Email tidak ditemukan" });
      }

      var isMatch = bcrypt.compareSync(password, user.password);
      if (!isMatch) {
        return res.render("auth/login", { error: "Password salah" });
      }
      req.session.userId = user.id;
      req.session.username = user.username;
      req.session.role = user.role;

      res.redirect("/products");
    } catch (error) {
      res.render("auth/login", { error: error.message });
    }
  }

  static getRegister(req, res) {
    res.render("auth/register", { error: null });
  }

  static async postRegister(req, res) {
    try {
      var username = req.body.username;
      var email = req.body.email;
      var password = req.body.password;
      var role = req.body.role;

      await User.create({
        username,
        email,
        password,
        role,
      });

      res.redirect("/login");
    } catch (error) {
      var errorMsg = error.errors ? error.errors[0].message : error.message;
      res.render("auth/register", { error: errorMsg });
    }
  }

  static logout(req, res) {
    req.session.destroy(function (err) {
      res.redirect("/login");
    });
  }
}

module.exports = AuthController;
