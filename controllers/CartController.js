const { Cart, Product, Category } = require("../models");

class CartController {
  static async getCart(req, res) {
    try {
      var userId = req.session.userId;

      var carts = await Cart.findAll({
        where: { userId: userId },
        include: [
          {
            model: Product,
            include: [{ model: Category, as: "Category" }],
          },
        ],
      });

      res.render("cart/index", { carts: carts });
    } catch (error) {
      res.send(error.message);
    }
  }

  static async postAddToCart(req, res) {
    try {
      var userId = req.session.userId;
      var productId = req.params.productId;
      var quantity = Number(req.body.quantity) || 1;

      // promise chaining: cek produk -> cek stok -> cek cart -> update/create
      var product = await Product.findByPk(productId);
      if (!product) {
        return res.send("Produk tidak ditemukan");
      }

      if (product.stock < quantity) {
        return res.send("Stok tidak mencukupi");
      }

      var existingCart = await Cart.findOne({
        where: { userId: userId, productId: productId },
      });

      if (existingCart) {
        var newQty = existingCart.quantity + quantity;
        await existingCart.update({ quantity: newQty });
      } else {
        await Cart.create({
          userId: userId,
          productId: productId,
          quantity: quantity,
        });
      }

      await product.update({
        sold: product.sold + quantity,
        stock: product.stock - quantity,
      });

      res.redirect("/cart");
    } catch (error) {
      res.send(error.message);
    }
  }

  static async postDeleteCart(req, res) {
    try {
      var id = req.params.id;
      var cart = await Cart.findByPk(id);

      if (!cart) {
        return res.send("Item tidak ditemukan");
      }

      await cart.destroy();
      res.redirect("/cart");
    } catch (error) {
      res.send(error.message);
    }
  }
}

module.exports = CartController;
