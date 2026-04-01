const express = require("express");
const router = express.Router();

const ProductController = require("../controllers/ProductController");
const CartController = require("../controllers/CartController");
const ProfileController = require("../controllers/ProfileController");

// ============================================================
// TODO (partner): import AuthController dan middleware di sini
// const AuthController = require('../controllers/AuthController')
// const { isLoggedIn, isSeller } = require('../middlewares/auth')
// ============================================================

// ===== LANDING =====
router.get("/", function (req, res) {
  res.render("landing");
});

// ===== AUTH =====
// TODO (partner): tambahkan route auth di sini
// router.get('/login', AuthController.getLogin)
// router.post('/login', AuthController.postLogin)
// router.get('/register', AuthController.getRegister)
// router.post('/register', AuthController.postRegister)
// router.get('/logout', isLoggedIn, AuthController.logout)

// ===== PRODUCTS =====
// PENTING: /products/add harus di atas /products/:id
router.get("/products", ProductController.getProducts);
router.get("/products/add", ProductController.getAddProduct);
router.post("/products", ProductController.postAddProduct);
router.get("/products/:id", ProductController.getProductDetail);
router.get("/products/:id/edit", ProductController.getEditProduct);
router.post("/products/:id/update", ProductController.postEditProduct);
router.post("/products/:id/delete", ProductController.postDeleteProduct);

// ===== CART =====
router.get("/cart", CartController.getCart);
router.post("/cart/:productId", CartController.postAddToCart);
router.post("/cart/:id/delete", CartController.postDeleteCart);

// ===== PROFILE =====
router.get("/profile", ProfileController.getProfile);
router.post("/profile/update", ProfileController.postUpdateProfile);

module.exports = router;
