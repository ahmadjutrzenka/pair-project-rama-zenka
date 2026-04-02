const express = require("express");
const router = express.Router();

const ProductController = require("../controllers/ProductController");
const CartController = require("../controllers/CartController");
const ProfileController = require("../controllers/ProfileController");

const AuthController = require("../controllers/AuthController");
const { isLoggedIn, isSeller } = require("../middlewares/auth");

router.get("/", function (req, res) {
  res.render("landing");
});

// ===== LOGIN & REGISTER =====
router.get("/login", AuthController.getLogin);
router.post("/login", AuthController.postLogin);

router.get("/register", AuthController.getRegister);
router.post("/register", AuthController.postRegister);

router.get("/logout", AuthController.logout);

// ===== PRODUCTS =====
router.get("/products", ProductController.getProducts);

router.get(
  "/products/add",
  isLoggedIn,
  isSeller,
  ProductController.getAddProduct,
);
router.post(
  "/products",
  isLoggedIn,
  isSeller,
  ProductController.postAddProduct,
);

router.get("/products/:id", ProductController.getProductDetail);

router.get(
  "/products/:id/edit",
  isLoggedIn,
  isSeller,
  ProductController.getEditProduct,
);
router.post(
  "/products/:id/update",
  isLoggedIn,
  isSeller,
  ProductController.postEditProduct,
);

router.post(
  "/products/:id/delete",
  isLoggedIn,
  isSeller,
  ProductController.postDeleteProduct,
);

// ===== CART =====
router.get("/cart", isLoggedIn, CartController.getCart);
router.post("/cart/:productId", isLoggedIn, CartController.postAddToCart);
router.post("/cart/:id/delete", isLoggedIn, CartController.postDeleteCart);

// ===== PROFILE =====
router.get("/profile", isLoggedIn, ProfileController.getProfile);
router.post("/profile/update", isLoggedIn, ProfileController.postUpdateProfile);

module.exports = router;
