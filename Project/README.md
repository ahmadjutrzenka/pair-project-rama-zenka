# Hellstivate — Pair Project

## Pembagian Tugas

- **Rama** → Product, Cart, Profile, Model, Seeder, Migrasi, Custom Validation ✅
- **Zenka (partner)** → Auth (Login, Register, Logout), Bcrypt, Session, Middleware ← **ini tugasmu**

---

## Yang Sudah Selesai (Rama)

- Semua migration & model (User, Product, Category, Cart, Profile)
- Seeder (kategori, user, produk)
- ProductController: CRUD produk lengkap + search, filter, sort
- CartController: tambah ke cart, hapus cart, update sold
- ProfileController: lihat & update profile
- Custom validation: `isBestSeller()` (sold >= 15 → badge 🔥 Terlaris)
- Semua view EJS sudah tersedia termasuk navbar/footer yang sudah pakai `session`

---

## Yang Harus Dikerjakan (Zenka)

Kamu perlu mengimplementasikan **5 hal** berikut secara berurutan:

1. Setup `express-session` di `app.js`
2. Bcrypt hook di `models/user.js`
3. `AuthController.js` (login, register, logout)
4. Middleware `middlewares/auth.js` (isLoggedIn, isSeller)
5. Uncomment route auth di `routes/index.js` + proteksi route
6. Buat view `views/auth/login.ejs` dan `views/auth/register.ejs`
7. Update seeder user agar password di-hash bcrypt

---

## Step-by-Step Pengerjaan

### Step 1 — Setup express-session di `app.js`

Buka file `app.js`. Tambahkan `express-session` dan dua middleware baru.

**Sebelum:**
```js
const express = require("express");
const router = require("./routes/index");
const app = express();

app.set("view engine", "ejs");
app.use(express.urlencoded({ extended: true }));
app.use(express.static("public"));

app.use("/", router);
```

**Sesudah:**
```js
const express = require("express");
const session = require("express-session");
const router = require("./routes/index");
const app = express();

app.set("view engine", "ejs");
app.use(express.urlencoded({ extended: true }));
app.use(express.static("public"));

// Setup session
app.use(
  session({
    secret: "rahasia_session_key",
    resave: false,
    saveUninitialized: false,
  })
);

// Kirim data session ke semua view EJS
app.use(function (req, res, next) {
  res.locals.session = req.session || {};
  next();
});

app.use("/", router);
```

> **Kenapa perlu middleware `res.locals.session`?**
> Semua file EJS (navbar, produk, cart, dll) menggunakan `<% session.userId %>` dan `<% session.role %>`.
> Middleware ini yang meneruskan data session ke setiap render view secara otomatis.

---

### Step 2 — Tambah Bcrypt Hook di `models/user.js`

Buka `models/user.js`. Tambahkan require bcrypt dan aktifkan hook `beforeCreate`.

Di bagian paling atas file, tambahkan:
```js
const bcrypt = require("bcryptjs");
```

Lalu di dalam `User.init(...)`, pada bagian options (objek ke-2), ganti komentar TODO dengan kode berikut:
```js
{
  sequelize,
  modelName: "User",
  hooks: {
    beforeCreate: function (user) {
      user.password = bcrypt.hashSync(user.password, 10);
    },
  },
}
```

> **Kenapa di `beforeCreate`?**
> Hook ini otomatis dijalankan Sequelize sebelum data user disimpan ke database.
> Jadi setiap kali ada `User.create(...)`, password langsung di-hash tanpa perlu manual.
> Catatan: hooks **tidak** berjalan saat `bulkInsert` (seeder), jadi seeder perlu di-hash manual (lihat Step 7).

---

### Step 3 — Buat `controllers/AuthController.js`

Buat file baru `controllers/AuthController.js` dengan isi berikut:

```js
const { User } = require("../models");
const bcrypt = require("bcryptjs");

class AuthController {
  // Tampilkan form login
  static getLogin(req, res) {
    res.render("auth/login", { error: null });
  }

  // Proses login
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

  // Tampilkan form register
  static getRegister(req, res) {
    res.render("auth/register", { error: null });
  }

  // Proses register
  static async postRegister(req, res) {
    try {
      var username = req.body.username;
      var email = req.body.email;
      var password = req.body.password;
      var role = req.body.role;

      await User.create({ username, email, password, role });

      res.redirect("/login");
    } catch (error) {
      var errorMsg = error.errors ? error.errors[0].message : error.message;
      res.render("auth/register", { error: errorMsg });
    }
  }

  // Logout
  static logout(req, res) {
    req.session.destroy(function (err) {
      res.redirect("/login");
    });
  }
}

module.exports = AuthController;
```

> **Penjelasan alur login:**
> 1. Cari user berdasarkan email di database
> 2. Jika tidak ketemu → render login dengan pesan error
> 3. Bandingkan password input dengan hash di DB pakai `bcrypt.compareSync`
> 4. Jika cocok → simpan `userId`, `username`, `role` ke `req.session`
> 5. Redirect ke `/products`

---

### Step 4 — Buat `middlewares/auth.js`

Buat folder baru `middlewares/` di root project, lalu buat file `middlewares/auth.js`:

```js
function isLoggedIn(req, res, next) {
  if (req.session && req.session.userId) {
    next();
  } else {
    res.redirect("/login");
  }
}

function isSeller(req, res, next) {
  if (req.session && req.session.role === "seller") {
    next();
  } else {
    res.redirect("/products");
  }
}

module.exports = { isLoggedIn, isSeller };
```

> **Penjelasan:**
> - `isLoggedIn`: Cek apakah ada `req.session.userId`. Kalau tidak ada (belum login), redirect ke `/login`.
> - `isSeller`: Cek apakah role-nya `"seller"`. Kalau bukan seller (misal buyer), redirect ke `/products`.
> - Middleware ini nanti dipasang di route sebagai "penjaga" sebelum controller dijalankan.

---

### Step 5 — Update `routes/index.js`

Buka `routes/index.js`. Uncomment semua baris yang ada komentar `TODO (partner)`:

**Sebelum (komentar semua):**
```js
// const AuthController = require('../controllers/AuthController')
// const { isLoggedIn, isSeller } = require('../middlewares/auth')
```

**Sesudah (uncomment):**
```js
const AuthController = require('../controllers/AuthController');
const { isLoggedIn, isSeller } = require('../middlewares/auth');
```

Lalu uncomment semua route auth:
```js
// ===== AUTH =====
router.get('/login', AuthController.getLogin);
router.post('/login', AuthController.postLogin);
router.get('/register', AuthController.getRegister);
router.post('/register', AuthController.postRegister);
router.get('/logout', isLoggedIn, AuthController.logout);
```

Terakhir, tambahkan middleware proteksi ke route-route yang perlu login. Ubah route yang sudah ada menjadi:
```js
// ===== PRODUCTS =====
router.get("/products", ProductController.getProducts);
router.get("/products/add", isLoggedIn, isSeller, ProductController.getAddProduct);
router.post("/products", isLoggedIn, isSeller, ProductController.postAddProduct);
router.get("/products/:id", ProductController.getProductDetail);
router.get("/products/:id/edit", isLoggedIn, isSeller, ProductController.getEditProduct);
router.post("/products/:id/update", isLoggedIn, isSeller, ProductController.postEditProduct);
router.post("/products/:id/delete", isLoggedIn, isSeller, ProductController.postDeleteProduct);

// ===== CART =====
router.get("/cart", isLoggedIn, CartController.getCart);
router.post("/cart/:productId", isLoggedIn, CartController.postAddToCart);
router.post("/cart/:id/delete", isLoggedIn, CartController.postDeleteCart);

// ===== PROFILE =====
router.get("/profile", isLoggedIn, ProfileController.getProfile);
router.post("/profile/update", isLoggedIn, ProfileController.postUpdateProfile);
```

> **Urutan middleware di route:** `isLoggedIn` → `isSeller` → controller.
> Sequelize menjalankannya dari kiri ke kanan. Kalau `isLoggedIn` gagal (redirect), `isSeller` dan controller tidak akan dipanggil.

---

### Step 6 — Buat View `views/auth/login.ejs`

Buat file `views/auth/login.ejs`:

```html
<!DOCTYPE html>
<html lang="id">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>Login — Hellstivate</title>
  <link href="https://cdn.jsdelivr.net/npm/bootstrap@5.3.0/dist/css/bootstrap.min.css" rel="stylesheet">
</head>
<body class="bg-light d-flex align-items-center justify-content-center" style="min-height:100vh">
  <div class="card border-0 shadow-sm p-4" style="width:100%;max-width:420px">
    <h4 class="fw-bold text-center mb-4">👟 Login Hellstivate</h4>

    <% if (error) { %>
      <div class="alert alert-danger"><%= error %></div>
    <% } %>

    <form action="/login" method="POST">
      <div class="mb-3">
        <label class="form-label fw-semibold">Email</label>
        <input type="email" name="email" class="form-control" placeholder="email@contoh.com" required>
      </div>
      <div class="mb-4">
        <label class="form-label fw-semibold">Password</label>
        <input type="password" name="password" class="form-control" placeholder="Password" required>
      </div>
      <button type="submit" class="btn btn-dark w-100">Login</button>
    </form>

    <p class="text-center mt-3 mb-0">
      Belum punya akun? <a href="/register">Daftar di sini</a>
    </p>
  </div>
  <script src="https://cdn.jsdelivr.net/npm/bootstrap@5.3.0/dist/js/bootstrap.bundle.min.js"></script>
</body>
</html>
```

---

### Step 7 — Buat View `views/auth/register.ejs`

Buat file `views/auth/register.ejs`:

```html
<!DOCTYPE html>
<html lang="id">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>Register — Hellstivate</title>
  <link href="https://cdn.jsdelivr.net/npm/bootstrap@5.3.0/dist/css/bootstrap.min.css" rel="stylesheet">
</head>
<body class="bg-light d-flex align-items-center justify-content-center" style="min-height:100vh">
  <div class="card border-0 shadow-sm p-4" style="width:100%;max-width:420px">
    <h4 class="fw-bold text-center mb-4">👟 Daftar Hellstivate</h4>

    <% if (error) { %>
      <div class="alert alert-danger"><%= error %></div>
    <% } %>

    <form action="/register" method="POST">
      <div class="mb-3">
        <label class="form-label fw-semibold">Username</label>
        <input type="text" name="username" class="form-control" placeholder="Username" required>
      </div>
      <div class="mb-3">
        <label class="form-label fw-semibold">Email</label>
        <input type="email" name="email" class="form-control" placeholder="email@contoh.com" required>
      </div>
      <div class="mb-3">
        <label class="form-label fw-semibold">Password</label>
        <input type="password" name="password" class="form-control" placeholder="Minimal 8 karakter" required>
      </div>
      <div class="mb-4">
        <label class="form-label fw-semibold">Role</label>
        <select name="role" class="form-select" required>
          <option value="">-- Pilih Role --</option>
          <option value="buyer">Buyer</option>
          <option value="seller">Seller</option>
        </select>
      </div>
      <button type="submit" class="btn btn-dark w-100">Daftar</button>
    </form>

    <p class="text-center mt-3 mb-0">
      Sudah punya akun? <a href="/login">Login di sini</a>
    </p>
  </div>
  <script src="https://cdn.jsdelivr.net/npm/bootstrap@5.3.0/dist/js/bootstrap.bundle.min.js"></script>
</body>
</html>
```

---

### Step 8 — Update Seeder User dengan Bcrypt

Setelah kamu mengimplementasikan bcrypt di model (Step 2), buka file `seeders/20260401000002-seed-users.js` dan update passwordnya agar di-hash:

```js
"use strict";
const bcrypt = require("bcryptjs");

module.exports = {
  async up(queryInterface) {
    await queryInterface.bulkInsert("Users", [
      {
        username: "admin_seller",
        email: "seller@pairproject.com",
        password: bcrypt.hashSync("seller123", 10),
        role: "seller",
        createdAt: new Date(),
        updatedAt: new Date(),
      },
      {
        username: "john_buyer",
        email: "buyer@pairproject.com",
        password: bcrypt.hashSync("buyer123", 10),
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
```

> **Kenapa hash manual di seeder?**
> Sequelize hooks (`beforeCreate`) hanya jalan saat `Model.create()` dipanggil lewat kode.
> Saat seeder menggunakan `bulkInsert`, hooks tidak dijalankan.
> Makanya password di seeder harus di-hash manual pakai `bcrypt.hashSync`.

---

### Step 9 — Re-seed Database

Setelah semua kode selesai, jalankan ulang database dari awal agar data seeder bersih:

```bash
npx sequelize-cli db:migrate:undo:all
npx sequelize-cli db:migrate
npx sequelize-cli db:seed:all
```

> Perintah `db:migrate:undo:all` akan drop semua tabel (sequence ID reset ke 1).
> Lalu `db:migrate` buat ulang semua tabel.
> Lalu `db:seed:all` isi data awal.

---

### Step 10 — Test Manual

Setelah semua selesai, jalankan server:

```bash
node app.js
# atau
nodemon app.js
```

Lalu test di browser:

| Test | Langkah | Yang Diharapkan |
|------|---------|-----------------|
| Register | Buka `/register`, isi form, submit | Redirect ke `/login` |
| Login buyer | Login dengan `buyer@pairproject.com` / `buyer123` | Redirect ke `/products`, navbar tampil nama + Cart |
| Login seller | Login dengan `seller@pairproject.com` / `seller123` | Redirect ke `/products`, navbar tampil + Add Product |
| Akses cart tanpa login | Buka `/cart` langsung | Redirect ke `/login` |
| Akses add product sebagai buyer | Login sebagai buyer, buka `/products/add` | Redirect ke `/products` |
| Logout | Klik tombol Logout | Redirect ke `/login`, session hilang |

---

## Catatan Penting

- `bcryptjs` sudah terinstall, tidak perlu `npm install` lagi
- `express-session` sudah terinstall, tidak perlu `npm install` lagi
- Semua view EJS sudah siap dan sudah pakai `session.userId`, `session.role`, `session.username` — kamu hanya perlu set session-nya di `postLogin`
- Jangan ubah file selain yang disebutkan di atas agar tidak bentrok dengan kode Rama
