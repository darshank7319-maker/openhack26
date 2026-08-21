# 🌾 FarmConnect – Frontend Web/Mobile Application

A modern, responsive, mobile-first agricultural marketplace frontend connecting farmers directly with buyers.

---

## 🚀 How to Run the Frontend

1. Open terminal in the `frontend` folder:
   ```bash
   cd frontend
   ```

2. Start a local HTTP server:
   ```bash
   python -m http.server 8080
   ```

3. Open in your browser:
   **`http://localhost:8080`**

---

## 📁 Architecture & Components

- `index.html` — Main HTML5 entry point with Tailwind CSS, Google Fonts, and Lucide icons.
- `css/styles.css` — Custom agricultural design system tokens, animations, glassmorphism.
- `js/api.js` — Client-side REST API connector for backend with automatic fallback.
- `js/storage.js` — State manager with LocalStorage persistence and event broadcasting.
- `js/translations.js` — 6-language dictionary (English, हिन्दी, मराठी, తెలుగు, தமிழ், ਪੰਜਾਬੀ).
- `js/components/` — 20 modular UI components (Dashboard, Marketplace, Cart, Checkout, Order Tracker, Earnings Chart, Chat, Mandi Prices, Profile, etc.).
- `js/app.js` — Main routing and application coordinator.
