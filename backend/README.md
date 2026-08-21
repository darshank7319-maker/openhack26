# 🌾 FarmConnect – Backend REST API Service

A lightweight Python RESTful backend with SQLite persistence, CORS support, and complete endpoints for the FarmConnect agricultural marketplace.

---

## 🚀 How to Run the Backend

```bash
cd backend
python server.py
```

Server runs on: **`http://localhost:5000`**

---

## 📡 Available REST API Endpoints

### 1. Products / Crops
- `GET /api/products` — Retrieve all active agricultural crop listings.
- `POST /api/products` — Create a new crop listing.

### 2. Orders & Tracking
- `GET /api/orders` — Retrieve all direct orders.
- `POST /api/orders` — Place a new farm order.
- `PUT /api/orders/<id>/status` — Update order milestone status (`Confirmed`, `Shipped`, `Out for Delivery`, `Delivered`).

### 3. Mandi Market Intelligence
- `GET /api/mandi-prices` — Live APMC commodity price trends and advisory.

### 4. Direct Farmer-to-Buyer Chat
- `GET /api/conversations` — Retrieve conversation threads.
- `POST /api/messages` — Send a chat message.

### 5. Earnings & Payouts
- `GET /api/earnings` — Farmer earnings metrics and payout transaction history.
- `POST /api/payouts` — Request instant payout withdrawal to bank/UPI.

### 6. Notifications & System
- `GET /api/notifications` — Retrieve notifications.
- `PUT /api/notifications/read-all` — Mark notifications as read.
- `POST /api/reset` — Reset database to initial sample demo data.
