# FarmConnect – Direct Market Access for Farmers 🌾

> **FarmConnect** is a responsive, farmer-friendly agricultural marketplace web and mobile application designed to connect Indian farmers directly with retail consumers and buyers, eliminating unnecessary middlemen markups and providing real-time APMC Mandi market intelligence.

---

## 🌟 Core Features

- **🔐 Dual-Role Authentication & Demo Accounts**: Quick 1-click login for Farmer (`farmer@farmconnect.com`) and Buyer (`buyer@farmconnect.com`) + seamless role switching.
- **🌾 Farmer Dashboard**: Verified Kisan badge, 4 live KPI cards (Active Crops, Pending Orders, Sales Revenue, Available Earnings), quick tools, Mandi ticker, and recent orders.
- **➕ Add Crop Listing Form**: 12 produce photo presets, multi-unit support (`kg`, `quintal`, `crate`, `ton`, `dozen`, `liter`), organic certification tags, and instant publishing.
- **🛒 Direct Marketplace**: Instant search, category filters, organic-only filter, price/rating sorting, freshness badges, and Add to Cart / Buy Now.
- **🔍 Detailed Crop View**: High-res gallery, farm gate price, stock counter, farmer profile card, harvest date, shelf-life, and direct "Chat with Farmer".
- **🛍️ Shopping Cart & Coupons**: Persistent cart with quantity incrementer, free delivery above ₹500, and promo coupons (`KISANFIRST`, `FRESH10`, `ORGANIC50`).
- **💳 Multi-Method Checkout**: Delivery address with GPS auto-fill, Express 24h vs Standard 48h slot, and payment options (UPI QR Code, Card, Cash on Delivery).
- **🎉 Celebratory Order Success & 5-Stage Tracker**: Confetti animation, generated Order ID, 5-stage visual tracking stepper (*Placed → Confirmed → Shipped → Out for Delivery → Delivered*), route map simulation, and assigned courier card.
- **📋 Orders Management**: Filter tabs by status, farmer status advancement controls, and downloadable invoice receipt.
- **💰 Financials & Earnings**: Revenue metrics, interactive weekly sales bar chart, transaction log, and instant Payout Withdrawal modal to UPI/Bank.
- **📈 APMC Mandi Market Intelligence**: Real-time wholesale commodity price trends with `%` change indicators, state comparison, and agricultural advisory tips.
- **💬 Real-Time Farmer-Buyer Chat**: Product contextual header, quick reply chips, and automated instant replies from the counterpart.
- **👤 Profile, Multilingual & Support**: Profile management, 6-language switcher (English, हिन्दी, मराठी, తెలుగు, தமிழ், ਪੰਜਾਬੀ), and Kisan Toll-Free Hotline (`1800-180-1551`).

---

## 🚀 Running Locally

1. Clone the repository:
   ```bash
   git clone https://github.com/darshank7319-maker/openhack26.git
   cd openhack26
   ```

2. Start any local static HTTP server (e.g. Python):
   ```bash
   python -m http.server 8080
   ```

3. Open your browser and navigate to:
   ```
   http://localhost:8080
   ```

---

## 🛠️ Tech Stack

- **Frontend**: HTML5, Vanilla JavaScript (ES6+), Modern Component Architecture
- **Styling**: Tailwind CSS, Custom Agricultural CSS Design System, Glassmorphism
- **Icons & Effects**: Lucide Icons, Canvas Confetti
- **State & Storage**: LocalStorage Persistence Engine with Event Dispatching
