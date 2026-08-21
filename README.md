<<<<<<< HEAD
# FarmConnect – Direct Market Access for Farmers 🌾

> **FarmConnect** is a practical agricultural marketplace system connecting farmers directly with buyers to eliminate middlemen, provide fair prices, and deliver real-time APMC Mandi market intelligence.

---

## 📁 Repository Architecture (Frontend & Backend Separation)

```
openhack/
├── frontend/                     # Modern Web & Mobile Client Application
│   ├── index.html                # Main UI Entry Point (Tailwind CSS, Lucide Icons)
│   ├── css/
│   │   └── styles.css            # Agricultural Design Tokens, Animations, Glassmorphism
│   ├── js/
│   │   ├── api.js                # REST API Client (Connects to backend on :5000 with fallback)
│   │   ├── app.js                # Core App View Router & State Coordinator
│   │   ├── data.js               # Initial agricultural mock datasets
│   │   ├── storage.js            # State persistence engine
│   │   ├── translations.js       # 6-language dictionary (EN, हिन्दी, मराठी, తెలుగు, தமிழ், ਪੰਜਾਬੀ)
│   │   └── components/           # 20 Modular UI Components
│   │       ├── FarmerDashboard.js
│   │       ├── Marketplace.js
│   │       ├── ProductCard.js
│   │       ├── ProductDetailModal.js
│   │       ├── AddProductModal.js
│   │       ├── MyProducts.js
│   │       ├── CartDrawer.js
│   │       ├── CheckoutModal.js
│   │       ├── OrderSuccessModal.js
│   │       ├── OrdersManager.js
│   │       ├── OrderTrackerModal.js
│   │       ├── EarningsView.js
│   │       ├── MandiPricesView.js
│   │       ├── ChatDrawer.js
│   │       ├── ProfileView.js
│   │       ├── NotificationsModal.js
│   │       ├── AuthModal.js
│   │       ├── Navbar.js
│   │       ├── BottomNav.js
│   │       └── Toast.js
│   └── README.md
│
├── backend/                      # Python REST API Server & SQLite Persistence
│   ├── server.py                 # RESTful HTTP API Server (Port 5000, full CORS)
│   ├── db.py                     # SQLite Database Engine & Seed Data Generator
│   ├── farmconnect.db            # SQLite Database File
│   ├── requirements.txt          # Python requirements
│   └── README.md                 # Backend API documentation
│
├── start_all.bat                 # One-click Windows launcher for Frontend + Backend
└── README.md                     # Main project guide
```

---

## 🚀 How to Run

### Option 1: One-Click Launcher (Windows)
Double-click **`start_all.bat`** in the root directory. It starts:
- **Backend Server** on `http://localhost:5000`
- **Frontend Server** on `http://localhost:8080`

---

### Option 2: Run Separately

#### 1. Start Backend:
```bash
cd backend
python server.py
```
> Running at **`http://localhost:5000`**

#### 2. Start Frontend:
```bash
cd frontend
python -m http.server 8080
```
> Open **`http://localhost:8080`** in your browser.

---

## 🌟 Implemented Features

1. **🔐 Authentication & Role Switcher**: Farmer and Buyer accounts + instant demo logins (`farmer@farmconnect.com` / `farmer123`, `buyer@farmconnect.com` / `buyer123`).
2. **🌾 Farmer Dashboard**: 4 KPI stat cards, Mandi ticker, quick action tools, and recent incoming orders.
3. **➕ Add Product**: 12 produce photo presets, multi-unit selector (`kg`, `quintal`, `crate`, `ton`, `dozen`, `liter`), organic certification tags, and instant publishing.
4. **🛒 Marketplace**: Live search, category filters, organic-only filter, price/rating sorting, and Add to Cart / Buy Now.
5. **🔍 Crop Details**: High-res produce view, freshness meter, quantity selector, and direct *Chat with Farmer*.
6. **🛍️ Cart & Coupons**: Persistent cart, free delivery over ₹500, and promo coupons (`KISANFIRST`, `FRESH10`, `ORGANIC50`).
7. **💳 Multi-Method Checkout**: GPS auto-fill, Express 24h vs Standard slot, UPI QR Code, Card, and Cash on Delivery.
8. **🎉 Order Success & 5-Stage Tracking**: Confetti celebration, generated Order ID, visual milestone stepper (*Placed → Confirmed → Shipped → Out for Delivery → Delivered*), route map simulation, and assigned courier details.
9. **📋 Orders Management**: Status filter tabs, farmer status advancement controls, and downloadable invoice receipt.
10. **💰 Earnings & Analytics**: Revenue metrics, interactive weekly sales chart, transaction log, and instant Payout Withdrawal modal to UPI/Bank.
11. **📈 APMC Mandi Market Intelligence**: Real-time wholesale commodity price trends with `%` change indicators and advisory tips.
12. **💬 Direct Farmer-Buyer Chat**: Real-time chat with product context, quick suggestions, and automated counterpart replies.
13. **👤 Profile, Multilingual & Support**: Profile editor, 6-language switcher (English, हिन्दी, मराठी, తెలుగు, தமிழ், ਪੰਜਾਬੀ), and Kisan Toll-Free Helpline (`1800-180-1551`).
=======
# openhack26
FarmConnect is a mobile app that connects farmers directly with customers and buyers to sell their agricultural products. It helps farmers get better prices, reach more markets, and manage products, orders, and payments easily.
>>>>>>> 5cf6ca294662c25638cca767ebbec6ce62d174e1
