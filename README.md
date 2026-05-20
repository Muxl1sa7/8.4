# ☕ Coffee Delivery — Backend API

**NestJS + PostgreSQL + TypeORM + Swagger** to'liq backend loyihasi.

---

## 📦 Texnologiyalar

| Texnologiya | Versiya | Maqsad |
|-------------|---------|--------|
| **NestJS** | ^10.0 | Backend framework |
| **PostgreSQL** | 15 | Ma'lumotlar bazasi |
| **TypeORM** | ^0.3 | ORM (Object-Relational Mapping) |
| **Swagger** | ^7.1 | API dokumentatsiyasi (`/api/docs`) |
| **JWT** | ^10.1 | Autentifikatsiya tokeni |
| **bcryptjs** | ^2.4 | Parol shifrlash |
| **Passport.js** | ^0.6 | Auth middleware |
| **class-validator** | ^0.14 | DTO validatsiyasi |

---

## 🚀 Ishga tushirish

### 1. Talablar
- Node.js **18+**
- PostgreSQL **14+** (yoki Docker)
- npm yoki yarn

### 2. O'rnatish

```bash
# Loyiha papkasiga o'ting
cd coffee-delivery-backend

# Paketlarni o'rnating
npm install

# .env fayl yarating
cp .env.example .env
```

### 3. .env sozlash

```env
PORT=3000

# PostgreSQL
DB_HOST=localhost
DB_PORT=5432
DB_USER=postgres
DB_PASS=postgres
DB_NAME=coffee_delivery

# JWT
JWT_SECRET=your_very_secret_key_change_in_production_min_32_chars
JWT_EXPIRES=7d
```

### 4. PostgreSQL ishga tushirish

**Docker orqali (eng oson):**
```bash
docker-compose up -d
# PostgreSQL: localhost:5432
# pgAdmin UI: http://localhost:5050 (admin@coffee.com / admin)
```

**Yoki qo'lda:**
```sql
CREATE DATABASE coffee_delivery;
```

### 5. Serverni ishga tushirish

```bash
# Build + start
npm run build && npm start

# Development mode (hot reload)
npm run start:dev
```

---

## 🌐 URL Manzillar

| Xizmat | URL |
|--------|-----|
| **API Base** | http://localhost:3000/api/v1 |
| **Swagger Docs** | http://localhost:3000/api/docs |
| **pgAdmin** | http://localhost:5050 |

---

## 👥 Rol Tizimi

```
SUPERADMIN  ─── Hamma narsa
    │           • Admin va Worker yaratish
    │           • Qahva qo'shish/yangilash/O'chirish
    │           • Barcha foydalanuvchilarni ko'rish/bloklash
    │           • Barcha buyurtmalarni boshqarish
    │           • Seed va statistika
    │
    ▼
  ADMIN  ─────── Ko'p narsa
    │           • Worker yaratish
    │           • Qahva qo'shish/yangilash (o'chirish emas)
    │           • O'z workerlarini ko'rish/bloklash
    │           • Barcha buyurtmalarni ko'rish va status yangilash
    │           • Statistika
    │
    ▼
  WORKER  ────── Cheklangan
    │           • Barcha buyurtmalarni ko'rish
    │           • Buyurtma statusini yangilash
    │           • Statistika
    │
    ▼
 CUSTOMER  ───── Oddiy foydalanuvchi
                • Qahvalar katalogini ko'rish
                • Buyurtma berish
                • O'z buyurtmalarini ko'rish
                • Buyurtmani bekor qilish (pending holatda)
```

### 🔑 Default Superadmin (server ishga tushganda avtomatik yaratiladi)
```
Email:    superadmin@coffeedelivery.com
Password: SuperAdmin123!
```

---

## 📚 API Endpointlar

### 🔐 Auth & Users — `/api/v1/auth`

| Method | Endpoint | Ruxsat | Tavsif |
|--------|----------|--------|--------|
| `POST` | `/auth/register` | Hamma | Ro'yxatdan o'tish → CUSTOMER role |
| `POST` | `/auth/login` | Hamma | Tizimga kirish → JWT token |
| `GET`  | `/auth/profile` | Login qilganlar | O'z profilini ko'rish |
| `POST` | `/auth/create-user` | Admin, Superadmin | Yangi user yaratish |
| `GET`  | `/auth/users` | Admin, Superadmin | Foydalanuvchilar ro'yxati |
| `PATCH`| `/auth/users/:id/toggle-status` | Admin, Superadmin | Bloklash/faollashtirish |

### ☕ Coffees — `/api/v1/coffees`

| Method | Endpoint | Ruxsat | Tavsif |
|--------|----------|--------|--------|
| `GET`  | `/coffees` | Hamma | Barcha qahvalar |
| `GET`  | `/coffees/:id` | Hamma | Bitta qahva |
| `POST` | `/coffees` | Admin, Superadmin | Yangi qahva qo'shish |
| `PUT`  | `/coffees/:id` | Admin, Superadmin | Qahvani yangilash |
| `DELETE`| `/coffees/:id` | Faqat Superadmin | Qahvani o'chirish |
| `POST` | `/coffees/seed` | Faqat Superadmin | 14 ta namunaviy qahva yuklash |

### 📦 Orders — `/api/v1/orders`

| Method | Endpoint | Ruxsat | Tavsif |
|--------|----------|--------|--------|
| `POST` | `/orders` | Login qilganlar | Buyurtma berish |
| `GET`  | `/orders` | Login qilganlar | Buyurtmalar (rol asosida) |
| `GET`  | `/orders/stats` | Admin, Worker, Superadmin | Statistika |
| `GET`  | `/orders/:id` | Login qilganlar | Bitta buyurtma |
| `PATCH`| `/orders/:id/status` | Login qilganlar | Status yangilash |

---

## 🔐 JWT Autentifikatsiya

Login yoki Register qilgandan so'ng `access_token` olinadi.

Barcha himoyalangan so'rovlarda:
```
Authorization: Bearer <your_jwt_token_here>
```

---

## 🧪 Swagger orqali test qilish

1. Serverni ishga tushiring
2. **http://localhost:3000/api/docs** ni oching
3. `POST /auth/login` orqali kiring (superadmin ma'lumotlari bilan)
4. `access_token` ni ko'chiring
5. Yuqoridagi **"Authorize 🔓"** tugmasini bosing
6. `Bearer <token>` formatida kiriting → **Authorize**
7. Barcha endpointlarni sinab ko'ring!

---

## 💡 Misol So'rovlar (cURL)

### Ro'yxatdan o'tish
```bash
curl -X POST http://localhost:3000/api/v1/auth/register \
  -H "Content-Type: application/json" \
  -d '{
    "email": "user@example.com",
    "fullName": "Test User",
    "password": "Pass123!"
  }'
```

### Tizimga kirish
```bash
curl -X POST http://localhost:3000/api/v1/auth/login \
  -H "Content-Type: application/json" \
  -d '{
    "email": "superadmin@coffeedelivery.com",
    "password": "SuperAdmin123!"
  }'
```

### Admin yaratish (Superadmin tokeni bilan)
```bash
curl -X POST http://localhost:3000/api/v1/auth/create-user \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer <superadmin_token>" \
  -d '{
    "email": "admin@coffee.com",
    "fullName": "Coffee Admin",
    "password": "Admin123!",
    "role": "admin"
  }'
```

### Worker yaratish (Admin tokeni bilan)
```bash
curl -X POST http://localhost:3000/api/v1/auth/create-user \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer <admin_token>" \
  -d '{
    "email": "worker@coffee.com",
    "fullName": "Ali Ishchi",
    "password": "Worker123!",
    "role": "worker"
  }'
```

### Qahvalar yuklash (Superadmin)
```bash
curl -X POST http://localhost:3000/api/v1/coffees/seed \
  -H "Authorization: Bearer <superadmin_token>"
```

### Buyurtma berish
```bash
curl -X POST http://localhost:3000/api/v1/orders \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer <customer_token>" \
  -d '{
    "items": [{"coffeeId": "uuid-here", "quantity": 2}],
    "paymentMethod": "cash",
    "street": "Navoiy ko'\''chasi",
    "number": "15",
    "neighborhood": "Yunusobod",
    "city": "Toshkent",
    "state": "TK",
    "zipCode": "100000"
  }'
```

---

## 📊 Ma'lumotlar Bazasi Sxemasi

### users
```sql
id          UUID PRIMARY KEY
email       VARCHAR UNIQUE NOT NULL
fullName    VARCHAR NOT NULL
password    VARCHAR NOT NULL (bcrypt, select: false)
role        ENUM(superadmin, admin, worker, customer) DEFAULT 'customer'
isActive    BOOLEAN DEFAULT true
phone       VARCHAR NULL
createdAt   TIMESTAMP
updatedAt   TIMESTAMP
```

### coffees
```sql
id          UUID PRIMARY KEY
name        VARCHAR NOT NULL
description TEXT NOT NULL
price       DECIMAL(10,2) NOT NULL
image       VARCHAR NULL
tags        TEXT[] DEFAULT []
isAvailable BOOLEAN DEFAULT true
stock       INTEGER DEFAULT 0
createdAt   TIMESTAMP
updatedAt   TIMESTAMP
```

### orders
```sql
id            UUID PRIMARY KEY
customer_id   UUID → users.id
items         JSONB  [{coffeeId, coffeeName, quantity, price}]
subtotal      DECIMAL(10,2)
deliveryFee   DECIMAL(10,2) DEFAULT 3.50
total         DECIMAL(10,2)
status        ENUM(pending, confirmed, preparing, delivering, delivered, cancelled)
paymentMethod ENUM(credit_card, debit_card, cash)
street        VARCHAR
number        VARCHAR
complement    VARCHAR NULL
neighborhood  VARCHAR
city          VARCHAR
state         CHAR(2)
zipCode       VARCHAR
createdAt     TIMESTAMP
updatedAt     TIMESTAMP
```

---

## 📁 Loyiha Strukturasi

```
coffee-delivery-backend/
├── src/
│   ├── auth/
│   │   ├── auth.controller.ts    # Auth & Users endpointlari
│   │   ├── auth.service.ts       # Biznes logika
│   │   ├── auth.module.ts        # Modul konfiguratsiyasi
│   │   ├── auth.dto.ts           # RegisterDto, LoginDto, CreateUserByAdminDto
│   │   └── jwt.strategy.ts       # Passport JWT strategiyasi
│   ├── coffees/
│   │   ├── coffees.controller.ts
│   │   ├── coffees.service.ts
│   │   ├── coffees.module.ts
│   │   ├── coffee.entity.ts      # TypeORM entity
│   │   └── coffee.dto.ts
│   ├── orders/
│   │   ├── orders.controller.ts
│   │   ├── orders.service.ts
│   │   ├── orders.module.ts
│   │   ├── order.entity.ts
│   │   └── order.dto.ts
│   ├── users/
│   │   └── user.entity.ts        # User TypeORM entity + UserRole enum
│   ├── common/
│   │   └── guards/
│   │       └── index.ts          # JwtAuthGuard, RolesGuard, Roles, CurrentUser
│   ├── app.module.ts             # Root modul + TypeORM konfiguratsiyasi
│   └── main.ts                   # Bootstrap + Swagger + Superadmin seed
├── .env.example
├── docker-compose.yml
├── nest-cli.json
├── package.json
├── tsconfig.json
└── README.md
```

---

## ⚙️ Production Muhiti

`.env` da quyidagilarni o'zgartiring:
```env
NODE_ENV=production
JWT_SECRET=very_long_random_string_minimum_32_characters_here
```

`src/app.module.ts` da:
```typescript
synchronize: false,  // Migration ishlating
logging: false,
```
