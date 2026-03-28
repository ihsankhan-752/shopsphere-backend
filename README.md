# 🛒 ShopSphere — E-Commerce REST API

A production-ready e-commerce backend built with **Node.js**, **Express**, **PostgreSQL** and **Drizzle ORM**. Powers both a customer-facing Flutter app and a Flutter admin panel.

---

## ✨ Features

- 🔐 JWT Authentication with bcrypt password hashing
- 👤 Role-based access control (User / Admin)
- 🛍️ Full product & category management with image uploads
- 🛒 Cart system with quantity management
- 📦 Orders with multi-item transactions
- 💳 Stripe payment integration
- 📍 Address management per user
- 📧 Automated email notifications via Resend
- ☁️ Cloudinary image storage
- ✅ Input validation with Zod

---

## 🧱 Tech Stack

| Layer           | Technology          |
| --------------- | ------------------- |
| Runtime         | Node.js             |
| Framework       | Express.js          |
| Database        | PostgreSQL          |
| ORM             | Drizzle ORM         |
| Auth            | JWT + bcrypt        |
| Validation      | Zod                 |
| Payments        | Stripe              |
| Email           | Resend              |
| File Storage    | Cloudinary + Multer |
| Package Manager | pnpm                |

---

## 📁 Project Structure

```
shop-sphere-backend/
├── controllers/        # Route handlers
├── db/
│   ├── index.js        # DB connection
│   └── schema/         # Drizzle table definitions
├── middlewares/        # Auth, admin, validation
├── routes/             # Express routers
├── services/           # Email service
├── validations/        # Zod schemas
└── index.js            # Entry point
```

---

## 🚀 Getting Started

### Prerequisites

- Node.js 18+
- PostgreSQL database
- pnpm — `npm install -g pnpm`

### Installation

```bash
# Clone the repository
git clone https://github.com/ihsankhan-752/shopsphere-backend.git
cd shopsphere-backend

# Install dependencies
pnpm install

# Copy environment file
cp .env.example .env

# Push database schema
npx drizzle-kit push

# Start development server
pnpm dev
```

---

## 🔑 Environment Variables

Create a `.env` file in the root directory:

```env
DATABASE_URL=postgresql://user:password@localhost:5432/shopsphere
JWT_SECRET=your_jwt_secret_here
CLOUDINARY_CLOUD_NAME=your_cloud_name
CLOUDINARY_API_KEY=your_api_key
CLOUDINARY_API_SECRET=your_api_secret
STRIPE_SECRET_KEY=sk_test_xxxxxxxxxxxx
RESEND_API_KEY=re_xxxxxxxxxxxx
RESEND_FROM_EMAIL=onboarding@resend.dev
PORT=8000
```

---

## 📡 API Endpoints

### 🔐 Auth — `/user`

| Method | Endpoint         | Description             | Auth |
| ------ | ---------------- | ----------------------- | ---- |
| POST   | `/user/register` | Register new user       | ❌   |
| POST   | `/user/login`    | Login and get JWT token | ❌   |

### 🛍️ Products — `/products`

| Method | Endpoint           | Description       | Auth     |
| ------ | ------------------ | ----------------- | -------- |
| GET    | `/products`        | Get all products  | ❌       |
| GET    | `/products/:id`    | Get product by ID | ❌       |
| POST   | `/products/create` | Create product    | ✅ Admin |
| PUT    | `/products/:id`    | Update product    | ✅ Admin |
| DELETE | `/products/:id`    | Delete product    | ✅ Admin |

### 🗂️ Categories — `/category`

| Method | Endpoint           | Description        | Auth     |
| ------ | ------------------ | ------------------ | -------- |
| GET    | `/category`        | Get all categories | ❌       |
| POST   | `/category/create` | Create category    | ✅ Admin |
| DELETE | `/category/:id`    | Delete category    | ✅ Admin |

### 🛒 Cart — `/cart`

| Method | Endpoint    | Description         | Auth |
| ------ | ----------- | ------------------- | ---- |
| GET    | `/cart`     | Get user cart       | ✅   |
| POST   | `/cart/add` | Add product to cart | ✅   |
| DELETE | `/cart/:id` | Remove from cart    | ✅   |

### 📍 Address — `/address`

| Method | Endpoint          | Description        | Auth |
| ------ | ----------------- | ------------------ | ---- |
| GET    | `/address`        | Get user addresses | ✅   |
| POST   | `/address/create` | Add new address    | ✅   |
| PATCH  | `/address/:id`    | Update address     | ✅   |
| DELETE | `/address/:id`    | Delete address     | ✅   |

### 📦 Orders — `/orders`

| Method | Endpoint                   | Description                      | Auth     |
| ------ | -------------------------- | -------------------------------- | -------- |
| POST   | `/orders/place`            | Place new order                  | ✅       |
| GET    | `/orders`                  | Get user orders                  | ✅       |
| GET    | `/orders/admin`            | Get all orders                   | ✅ Admin |
| PATCH  | `/orders/admin/:id/status` | Update order status + send email | ✅ Admin |

### 💳 Payment — `/payment`

| Method | Endpoint                 | Description                  | Auth |
| ------ | ------------------------ | ---------------------------- | ---- |
| POST   | `/payment/create-intent` | Create Stripe payment intent | ✅   |

### ❤️ Wishlist — `/wishlist`

| Method | Endpoint        | Description          | Auth |
| ------ | --------------- | -------------------- | ---- |
| GET    | `/wishlist`     | Get user wishlist    | ✅   |
| POST   | `/wishlist/add` | Add to wishlist      | ✅   |
| DELETE | `/wishlist/:id` | Remove from wishlist | ✅   |

---

## 🔒 Auth Header

All protected routes require:

```
Authorization: Bearer <your_jwt_token>
```

---

## 📧 Email Notifications

Emails are automatically sent to users when admin updates order status:

| Status       | Email                    |
| ------------ | ------------------------ |
| ✅ Confirmed | Order confirmation email |
| 🚚 Shipped   | Shipping notification    |
| 📦 Delivered | Delivery confirmation    |
| ❌ Cancelled | Cancellation notice      |

---

## 💳 Stripe Test Cards

```
Card Number  :  4242 4242 4242 4242
Expiry       :  Any future date
CVC          :  Any 3 digits
```

---

## 📱 Flutter Apps

This backend powers two Flutter applications:

- **ShopSphere** — Customer app (browse, cart, checkout, orders)
- **ShopSphere Admin** — Admin panel (manage products, update order status)

---

## 👨‍💻 Author

**Ihsan Khan** — Flutter & Full Stack Developer

- LinkedIn: [linkedin.com/in/ihsan-khan752](https://linkedin.com/in/ihsan-khan752)
- GitHub: [@ihsankhan-752](https://github.com/ihsankhan-752)

---

## 📄 License

This project is open source and available under the [MIT License](LICENSE).
