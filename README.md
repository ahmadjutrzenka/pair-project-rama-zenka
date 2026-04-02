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
├── helpers/        → fungsi bantu (formatRupiah, dll)
├── middlewares/    → isLoggedIn, isSeller, errorHandler
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

| Tabel      | Kolom Utama                                                                                                  |
| ---------- | ------------------------------------------------------------------------------------------------------------ |
| Users      | id (PK), username, email, password, role, createdAt, updatedAt                                               |
| Profiles   | id (PK), address, phoneNumber, avatarUrl, userId (FK), createdAt, updatedAt                                  |
| Categories | id (PK), name, createdAt, updatedAt                                                                          |
| Products   | id (PK), name, description, price, size, stock, imageUrl, userId (FK), categoryId (FK), createdAt, updatedAt |
| Carts      | id (PK), quantity, userId (FK), productId (FK), createdAt, updatedAt                                         |

---

## ✅ Fitur

- Register & Login (session-based)
- Role: Buyer & Seller
- Seller: Add, Edit, Delete produk
- Buyer: Browse produk, Add to Cart, Remove from Cart
- Search produk by nama
- Sort produk by harga (low-high / high-low)
- Profile page (view & edit)
- Eager loading: Cart menampilkan data Product + Category

---

## 📋 Requirement Checklist

| Requirement        | Status | Implementasi                                                         |
| ------------------ | ------ | -------------------------------------------------------------------- |
| 3 jenis asosiasi   | ✅     | 1:1, 1:M, M:M                                                        |
| Static method      | ✅     | `Product.getAll()`, `Product.getById()`                              |
| Instance method    | ✅     | `product.formatPrice()`                                              |
| Validasi Sequelize | ✅     | notNull, isEmail, isIn, len, min, isUrl, Custom Validation (Anti-KW) |
| CRUD               | ✅     | Products & Cart                                                      |
| Hooks              | ✅     | `beforeCreate` hash password                                         |
| Helper             | ✅     | `formatRupiah()`, `formatDate()`                                     |
| Promise chaining   | ✅     | CartController.postAddToCart                                         |
| Eager loading      | ✅     | Cart + Product + Category, User + Profile                            |
| Search & Sort      | ✅     | `Op.iLike`, order ASC/DESC                                           |
| Login system       | ✅     | bcryptjs + express-session                                           |
| Middleware         | ✅     | isLoggedIn, isSeller                                                 |
| Migration tambahan | ✅     | add-imageurl-to-products                                             |
| Seeder             | ✅     | Categories, Users, Products                                          |

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
