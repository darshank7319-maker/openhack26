/**
 * FarmConnect - Backend REST API Client
 * Seamlessly connects to backend on http://localhost:5000 with LocalStorage fallback.
 */

const API_BASE_URL = window.location.hostname === "localhost" || window.location.hostname === "127.0.0.1" 
  ? "http://localhost:5000/api" 
  : "/api";

const ApiClient = {
  isBackendConnected: false,

  async checkHealth() {
    try {
      const res = await fetch(`${API_BASE_URL}/health`, { signal: AbortSignal.timeout(1500) });
      if (res.ok) {
        this.isBackendConnected = true;
        console.log("🌾 FarmConnect: Connected to Backend REST API at " + API_BASE_URL);
        return true;
      }
    } catch (e) {
      this.isBackendConnected = false;
      console.log("🌿 FarmConnect: Running in client-side LocalStorage mode");
      return false;
    }
    return false;
  },

  async getProducts() {
    try {
      const res = await fetch(`${API_BASE_URL}/products`);
      if (res.ok) {
        const data = await res.json();
        return data.products;
      }
    } catch (e) {
      console.warn("Falling back to local storage for products");
    }
    return null;
  },

  async addProduct(productData) {
    try {
      const res = await fetch(`${API_BASE_URL}/products`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(productData)
      });
      if (res.ok) {
        return await res.json();
      }
    } catch (e) {
      console.warn("Product saved to local storage");
    }
    return null;
  },

  async getOrders() {
    try {
      const res = await fetch(`${API_BASE_URL}/orders`);
      if (res.ok) {
        const data = await res.json();
        return data.orders;
      }
    } catch (e) {
      console.warn("Falling back to local storage for orders");
    }
    return null;
  },

  async createOrder(orderData) {
    try {
      const res = await fetch(`${API_BASE_URL}/orders`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(orderData)
      });
      if (res.ok) {
        return await res.json();
      }
    } catch (e) {
      console.warn("Order saved to local storage");
    }
    return null;
  },

  async updateOrderStatus(orderId, status) {
    try {
      const res = await fetch(`${API_BASE_URL}/orders/${orderId}/status`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ status })
      });
      if (res.ok) {
        return await res.json();
      }
    } catch (e) {
      console.warn("Status updated in local storage");
    }
    return null;
  },

  async sendMessage(conversationId, text, sender = "buyer") {
    try {
      const res = await fetch(`${API_BASE_URL}/messages`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ conversationId, text, sender })
      });
      if (res.ok) {
        return await res.json();
      }
    } catch (e) {
      console.warn("Message saved to local storage");
    }
    return null;
  },

  async requestPayout(amount, upi) {
    try {
      const res = await fetch(`${API_BASE_URL}/payouts`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ amount, upi })
      });
      if (res.ok) {
        return await res.json();
      }
    } catch (e) {
      console.warn("Payout saved to local storage");
    }
    return null;
  },

  async resetDatabase() {
    try {
      await fetch(`${API_BASE_URL}/reset`, { method: "POST" });
    } catch (e) {
      console.warn("Reset locally");
    }
  }
};
