# 👟 Heelstivate — Ecommerce Shoes App

Project Pair Phase 1 Hacktiv8 — Full Stack Web App menggunakan Node.js, Express, EJS, Sequelize, dan PostgreSQL.

---

## 📦 Tech Stack

- **Runtime:** Node.js
- **Framework:** Express.js
- **Template Engine:** EJS
- **ORM:** Sequelize
- **Database:** PostgreSQL
- **Auth:** bcryptjs + express-session

---

## 🗂️ Struktur Folder

```
pair-project-rama-zenka/
├── config/         → konfigurasi database
├── controllers/    → logic handler setiap route
├── helpers/        → fungsi bantu (formatRupiah, formatDate)
├── middlewares/    → isLoggedIn, isSeller
├── migrations/     → file migration database
├── models/         → definisi model + asosiasi Sequelize
├── routes/         → definisi semua route
├── seeders/        → data awal database
├── views/          → halaman EJS
└── app.js          → entry point server
```

---

## ⚙️ Cara Setup

### 1. Clone / Extract project

```bash
git clone https://github.com/ahmadjutrzenka/pair-project-rama-zenka.git
```

### 2. Install dependencies

```bash
npm install
```

### 3. Sesuaikan konfigurasi database

Buka `config/config.json`, sesuaikan dengan PostgreSQL kamu:

```json
{
  "development": {
    "username": "postgres",
    "password": "postgres",
    "database": "Project-Heelstivate",
    "host": "127.0.0.1",
    "dialect": "postgres",
    "port": 5432
  }
}
```

### 4. Buat database

```bash
npx sequelize-cli db:create
```

### 5. Jalankan migration

```bash
npx sequelize-cli db:migrate
```

### 6. Jalankan seeder

```bash
npx sequelize-cli db:seed:all
```

### 7. Jalankan server

```bash
npx nodemon app.js
# atau
node app.js
```

### 8. Buka browser

```
http://localhost:3000
```

---

## 🔑 Akun Default

| Role   | Email                  | Password  |
| ------ | ---------------------- | --------- |
| Seller | seller@pairproject.com | seller123 |
| Buyer  | buyer@pairproject.com  | buyer123  |

---

## 🗄️ ERD (Entity Relationship Diagram)

```text
Users ──────────── Profiles   (One to One)
Users ──────────── Products   (One to Many, sebagai seller)
Categories ──────── Products  (One to Many)
Users ─── Carts ─── Products  (Many to Many via Carts)
```

### Tabel

| Tabel      | Kolom Utama                                                                                                              |
| ---------- | ------------------------------------------------------------------------------------------------------------------------ |
| Users      | id (PK), username, email, password, role, createdAt, updatedAt                                                           |
| Profiles   | id (PK), address, phoneNumber, avatarUrl, userId (FK), createdAt, updatedAt                                              |
| Categories | id (PK), name, createdAt, updatedAt                                                                                      |
| Products   | id (PK), name, description, price, size, stock, sold, imgUrl, userId (FK), categoryId (FK), createdAt, updatedAt        |
| Carts      | id (PK), quantity, userId (FK), productId (FK), createdAt, updatedAt                                                    |

---

## ✅ Fitur

- Register & Login (session-based)
- Role: Buyer & Seller
- Seller: Add, Edit, Delete produk
- Buyer: Browse produk, Add to Cart, Remove from Cart
- Search produk by nama (`Op.iLike`)
- Sort produk by harga (low-high / high-low) dan Terlaris (by sold)
- Bestseller badge 🔥 jika `sold >= 15`
- Profile page (view & edit)
- Eager loading: Cart → Product → Category

---

## 📋 Requirement Checklist

| Requirement        | Status | Implementasi                                                                              |
| ------------------ | ------ | ----------------------------------------------------------------------------------------- |
| 3 jenis asosiasi   | ✅     | 1:1 (User-Profile), 1:M (User-Products, Category-Products), M:M (User-Product via Cart)  |
| Static method      | ✅     | `Product.getAll()`, `Product.getById()`                                                   |
| Instance method    | ✅     | `product.formatPrice()`, `product.isBestSeller()`                                         |
| Validasi Sequelize | ✅     | notNull, notEmpty, isEmail, isIn, len, min, isUrl, Custom: `antiBarangPalsu`, `notNegative` |
| CRUD               | ✅     | Products (Seller) & Cart (Buyer)                                                          |
| Hooks              | ✅     | `beforeCreate` — hash password di User model                                              |
| Helper             | ✅     | `formatRupiah()`, `formatDate()`                                                          |
| Promise chaining   | ✅     | `CartController.postAddToCart` — sequential async: findByPk → findOne → create/update     |
| Eager loading      | ✅     | Cart + Product + Category, User + Profile                                                 |
| Login system       | ✅     | bcryptjs + express-session                                                                |
| Middleware         | ✅     | `isLoggedIn`, `isSeller`                                                                  |
| Migration tambahan | ✅     | `20260401000006-add-size-to-products.js`                                                  |
| Seeder             | ✅     | Categories, Users, Products                                                               |

---

## 🚨 Troubleshooting

**`Cannot find module`**

```bash
npm install
```

**`database does not exist`**

```bash
# Cek config/config.json sudah benar
npx sequelize-cli db:create
```

**`relation does not exist`**

```bash
npx sequelize-cli db:migrate
```

**`SequelizeEagerLoadingError`**

```
Pastikan alias di include sudah sesuai dengan as: di model
```

**Port 3000 sudah dipakai**

```js
// Ganti port di app.js
app.listen(3001, ...)
```
