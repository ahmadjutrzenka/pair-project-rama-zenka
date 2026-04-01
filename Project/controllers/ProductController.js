const { Product, Category } = require("../models");
const { formatRupiah } = require("../helpers/helper");

class ProductController {
  static async getProducts(req, res) {
    try {
      var search = req.query.search || "";
      var sort = req.query.sort || "";
      var categoryId = req.query.categoryId || "";

      var products = await Product.getAll({
        search: search,
        sort: sort,
        categoryId: categoryId,
      });

      var categories = await Category.findAll();

      res.render("products/index", {
        products: products,
        categories: categories,
        search: search,
        sort: sort,
        categoryId: categoryId,
        formatRupiah: formatRupiah,
      });
    } catch (error) {
      res.send(error.message);
    }
  }

  static async getProductDetail(req, res) {
    try {
      var id = req.params.id;
      var product = await Product.getById(id);

      if (!product) {
        return res.send("Produk tidak ditemukan");
      }

      res.render("products/detail", {
        product: product,
        formatRupiah: formatRupiah,
      });
    } catch (error) {
      res.send(error.message);
    }
  }

  static async getAddProduct(req, res) {
    try {
      var categories = await Category.findAll();
      res.render("products/add", { categories: categories, error: null });
    } catch (error) {
      res.send(error.message);
    }
  }

  static async postAddProduct(req, res) {
    try {
      var name = req.body.name;
      var description = req.body.description;
      var price = req.body.price;
      var stock = req.body.stock;
      var imgUrl = req.body.imgUrl;
      var categoryId = req.body.categoryId;
      var userId = req.session.userId;

      await Product.create({
        name: name,
        description: description,
        price: price,
        stock: stock,
        sold: 0,
        imgUrl: imgUrl,
        categoryId: categoryId,
        userId: userId,
      });

      res.redirect("/products");
    } catch (error) {
      var categories = await Category.findAll();
      var errorMsg = error.errors ? error.errors[0].message : error.message;
      res.render("products/add", {
        categories: categories,
        error: errorMsg,
      });
    }
  }

  static async getEditProduct(req, res) {
    try {
      var id = req.params.id;
      var product = await Product.getById(id);

      if (!product) {
        return res.send("Produk tidak ditemukan");
      }

      var categories = await Category.findAll();

      res.render("products/edit", {
        product: product,
        categories: categories,
        error: null,
      });
    } catch (error) {
      res.send(error.message);
    }
  }

  static async postEditProduct(req, res) {
    try {
      var id = req.params.id;
      var product = await Product.findByPk(id);

      if (!product) {
        return res.send("Produk tidak ditemukan");
      }

      await product.update({
        name: req.body.name,
        description: req.body.description,
        price: req.body.price,
        stock: req.body.stock,
        imgUrl: req.body.imgUrl,
        categoryId: req.body.categoryId,
      });

      res.redirect("/products");
    } catch (error) {
      res.send(error.message);
    }
  }

  static async postDeleteProduct(req, res) {
    try {
      var id = req.params.id;
      var product = await Product.findByPk(id);

      if (!product) {
        return res.send("Produk tidak ditemukan");
      }

      await product.destroy();
      res.redirect("/products");
    } catch (error) {
      res.send(error.message);
    }
  }
}

module.exports = ProductController;
