/**
 * FarmConnect - LocalStorage Persistence & State Manager
 */

const STORAGE_KEYS = {
  CURRENT_USER: "farmconnect_current_user",
  PRODUCTS: "farmconnect_products",
  ORDERS: "farmconnect_orders",
  CART: "farmconnect_cart",
  CONVERSATIONS: "farmconnect_conversations",
  NOTIFICATIONS: "farmconnect_notifications",
  MANDI_PRICES: "farmconnect_mandi_prices",
  LANGUAGE: "farmconnect_lang",
  EARNINGS_PAYOUTS: "farmconnect_earnings_payouts"
};

const StorageManager = {
  // Initialize storage with defaults if empty
  init() {
    if (!localStorage.getItem(STORAGE_KEYS.CURRENT_USER)) {
      localStorage.setItem(STORAGE_KEYS.CURRENT_USER, JSON.stringify(INITIAL_DEMO_USERS.farmer));
    }
    if (!localStorage.getItem(STORAGE_KEYS.PRODUCTS)) {
      localStorage.setItem(STORAGE_KEYS.PRODUCTS, JSON.stringify(INITIAL_PRODUCTS));
    }
    if (!localStorage.getItem(STORAGE_KEYS.ORDERS)) {
      localStorage.setItem(STORAGE_KEYS.ORDERS, JSON.stringify(INITIAL_ORDERS));
    }
    if (!localStorage.getItem(STORAGE_KEYS.CART)) {
      localStorage.setItem(STORAGE_KEYS.CART, JSON.stringify([]));
    }
    if (!localStorage.getItem(STORAGE_KEYS.CONVERSATIONS)) {
      localStorage.setItem(STORAGE_KEYS.CONVERSATIONS, JSON.stringify(INITIAL_CONVERSATIONS));
    }
    if (!localStorage.getItem(STORAGE_KEYS.NOTIFICATIONS)) {
      localStorage.setItem(STORAGE_KEYS.NOTIFICATIONS, JSON.stringify(INITIAL_NOTIFICATIONS));
    }
    if (!localStorage.getItem(STORAGE_KEYS.MANDI_PRICES)) {
      localStorage.setItem(STORAGE_KEYS.MANDI_PRICES, JSON.stringify(INITIAL_MANDI_PRICES));
    }
    if (!localStorage.getItem(STORAGE_KEYS.LANGUAGE)) {
      localStorage.setItem(STORAGE_KEYS.LANGUAGE, "en");
    }
    if (!localStorage.getItem(STORAGE_KEYS.EARNINGS_PAYOUTS)) {
      localStorage.setItem(STORAGE_KEYS.EARNINGS_PAYOUTS, JSON.stringify([
        { id: "PAY-2091", amount: 4800, date: "2026-08-18", status: "Completed", upi: "patil.farm@sbi", ref: "SBIN88219491" },
        { id: "PAY-1980", amount: 6200, date: "2026-08-10", status: "Completed", upi: "patil.farm@sbi", ref: "SBIN77109244" }
      ]));
    }
  },

  // Reset demo to fresh state
  resetAll() {
    localStorage.setItem(STORAGE_KEYS.CURRENT_USER, JSON.stringify(INITIAL_DEMO_USERS.farmer));
    localStorage.setItem(STORAGE_KEYS.PRODUCTS, JSON.stringify(INITIAL_PRODUCTS));
    localStorage.setItem(STORAGE_KEYS.ORDERS, JSON.stringify(INITIAL_ORDERS));
    localStorage.setItem(STORAGE_KEYS.CART, JSON.stringify([]));
    localStorage.setItem(STORAGE_KEYS.CONVERSATIONS, JSON.stringify(INITIAL_CONVERSATIONS));
    localStorage.setItem(STORAGE_KEYS.NOTIFICATIONS, JSON.stringify(INITIAL_NOTIFICATIONS));
    localStorage.setItem(STORAGE_KEYS.MANDI_PRICES, JSON.stringify(INITIAL_MANDI_PRICES));
    localStorage.setItem(STORAGE_KEYS.LANGUAGE, "en");
    localStorage.setItem(STORAGE_KEYS.EARNINGS_PAYOUTS, JSON.stringify([
      { id: "PAY-2091", amount: 4800, date: "2026-08-18", status: "Completed", upi: "patil.farm@sbi", ref: "SBIN88219491" },
      { id: "PAY-1980", amount: 6200, date: "2026-08-10", status: "Completed", upi: "patil.farm@sbi", ref: "SBIN77109244" }
    ]));
    this.notifyStateChange();
  },

  // State change notification dispatcher
  notifyStateChange(detail = {}) {
    window.dispatchEvent(new CustomEvent("farmconnect:state-change", { detail }));
  },

  // Language
  getLanguage() {
    return localStorage.getItem(STORAGE_KEYS.LANGUAGE) || "en";
  },
  setLanguage(lang) {
    localStorage.setItem(STORAGE_KEYS.LANGUAGE, lang);
    this.notifyStateChange({ type: "language", lang });
  },
  t(key) {
    const lang = this.getLanguage();
    const dict = TRANSLATIONS[lang] || TRANSLATIONS.en;
    return dict[key] || TRANSLATIONS.en[key] || key;
  },

  // Current User
  getUser() {
    try {
      return JSON.parse(localStorage.getItem(STORAGE_KEYS.CURRENT_USER)) || INITIAL_DEMO_USERS.farmer;
    } catch {
      return INITIAL_DEMO_USERS.farmer;
    }
  },
  setUser(user) {
    localStorage.setItem(STORAGE_KEYS.CURRENT_USER, JSON.stringify(user));
    this.notifyStateChange({ type: "user", user });
  },
  switchDemoRole(role) {
    const user = role === "farmer" ? INITIAL_DEMO_USERS.farmer : INITIAL_DEMO_USERS.buyer;
    this.setUser(user);
    this.notifyStateChange({ type: "role_switch", role });
    return user;
  },

  // Products
  getProducts() {
    try {
      return JSON.parse(localStorage.getItem(STORAGE_KEYS.PRODUCTS)) || [];
    } catch {
      return [];
    }
  },
  addProduct(productData) {
    const products = this.getProducts();
    const newProduct = {
      id: "prod_" + Date.now(),
      farmerId: this.getUser().id,
      farmerName: this.getUser().name,
      farmName: this.getUser().farmName || "Direct Farm Produce",
      location: this.getUser().location || "Maharashtra, India",
      rating: 5.0,
      reviewsCount: 1,
      freshness: "Harvested Today",
      bulkDiscount: "5% off on bulk orders",
      ...productData
    };
    products.unshift(newProduct);
    localStorage.setItem(STORAGE_KEYS.PRODUCTS, JSON.stringify(products));

    // Also push a notification
    this.addNotification({
      type: "order",
      title: "New Crop Listed! 🌾",
      message: `Your produce "${newProduct.name}" is now live in the marketplace for buyers.`,
      target: "my-products"
    });

    this.notifyStateChange({ type: "products", product: newProduct });
    return newProduct;
  },
  deleteProduct(productId) {
    let products = this.getProducts();
    products = products.filter(p => p.id !== productId);
    localStorage.setItem(STORAGE_KEYS.PRODUCTS, JSON.stringify(products));
    this.notifyStateChange({ type: "products" });
  },

  // Cart
  getCart() {
    try {
      return JSON.parse(localStorage.getItem(STORAGE_KEYS.CART)) || [];
    } catch {
      return [];
    }
  },
  addToCart(product, quantity = 1) {
    let cart = this.getCart();
    const existingIndex = cart.findIndex(item => item.id === product.id);
    if (existingIndex > -1) {
      cart[existingIndex].quantity += Number(quantity);
    } else {
      cart.push({
        id: product.id,
        name: product.name,
        price: product.price,
        unit: product.unit,
        image: product.image,
        farmerName: product.farmerName,
        farmName: product.farmName,
        quantity: Number(quantity),
        isOrganic: product.isOrganic,
        availableQty: product.availableQty
      });
    }
    localStorage.setItem(STORAGE_KEYS.CART, JSON.stringify(cart));
    this.notifyStateChange({ type: "cart", cart });
  },
  updateCartQuantity(productId, quantity) {
    let cart = this.getCart();
    if (quantity <= 0) {
      cart = cart.filter(item => item.id !== productId);
    } else {
      const item = cart.find(item => item.id === productId);
      if (item) item.quantity = Number(quantity);
    }
    localStorage.setItem(STORAGE_KEYS.CART, JSON.stringify(cart));
    this.notifyStateChange({ type: "cart", cart });
  },
  clearCart() {
    localStorage.setItem(STORAGE_KEYS.CART, JSON.stringify([]));
    this.notifyStateChange({ type: "cart", cart: [] });
  },

  // Orders
  getOrders() {
    try {
      return JSON.parse(localStorage.getItem(STORAGE_KEYS.ORDERS)) || [];
    } catch {
      return [];
    }
  },
  createOrder(orderData) {
    const orders = this.getOrders();
    const orderId = "ORD-" + Math.floor(10000 + Math.random() * 90000);
    const now = new Date();
    const dateFormatted = now.toLocaleDateString("en-IN", { month: "short", day: "numeric" }) + " " + now.toLocaleTimeString("en-IN", { hour: "2-digit", minute: "2-digit" });

    const newOrder = {
      id: orderId,
      date: dateFormatted,
      expectedDelivery: "Tomorrow (Within 24 Hours)",
      buyerId: this.getUser().id,
      buyerName: this.getUser().name,
      buyerPhone: this.getUser().phone || "+91 98000 11223",
      deliveryAddress: orderData.deliveryAddress || "Pune, Maharashtra",
      farmerId: orderData.items[0]?.farmerId || "usr_farmer_01",
      farmerName: orderData.items[0]?.farmerName || "Rameshwar Patil",
      farmName: orderData.items[0]?.farmName || "Patil Organic Agri Farms",
      farmerPhone: "+91 98234 56789",
      items: orderData.items,
      itemTotal: orderData.itemTotal,
      deliveryFee: orderData.deliveryFee,
      discount: orderData.discount || 0,
      total: orderData.total,
      paymentMethod: orderData.paymentMethod,
      paymentStatus: orderData.paymentMethod === "Cash on Delivery" ? "Pending on Delivery" : "Paid via " + orderData.paymentMethod,
      status: "Pending",
      trackingTimeline: [
        { step: "Order Placed", time: dateFormatted, completed: true, desc: "Order booked and verified." },
        { step: "Confirmed", time: "Pending confirmation", completed: false, desc: "Farmer will confirm produce stock & packing." },
        { step: "Shipped", time: "Pending", completed: false, desc: "Picked up by AgriLogistics Van from Farm." },
        { step: "Out for Delivery", time: "Pending", completed: false, desc: "Delivery executive en route." },
        { step: "Delivered", time: "Pending", completed: false, desc: "Fresh produce received at doorstep." }
      ],
      deliveryPartner: {
        name: "Santosh Kumar",
        vehicle: "AgriDirect Express Van (MH-14-EA-6621)",
        phone: "+91 98230 44556"
      }
    };

    orders.unshift(newOrder);
    localStorage.setItem(STORAGE_KEYS.ORDERS, JSON.stringify(orders));
    this.clearCart();

    // Push notification
    this.addNotification({
      type: "order",
      title: "New Order Booked! 📦",
      message: `Order #${newOrder.id} has been placed successfully for ₹${newOrder.total}.`,
      target: "orders"
    });

    this.notifyStateChange({ type: "order_created", order: newOrder });
    return newOrder;
  },
  updateOrderStatus(orderId, nextStatus) {
    const orders = this.getOrders();
    const order = orders.find(o => o.id === orderId);
    if (!order) return null;

    order.status = nextStatus;
    const nowTime = new Date().toLocaleTimeString("en-IN", { hour: "2-digit", minute: "2-digit" });

    // Update timeline stages
    const statuses = ["Pending", "Confirmed", "Shipped", "Out for Delivery", "Delivered"];
    const targetIdx = statuses.indexOf(nextStatus);

    if (nextStatus === "Cancelled") {
      order.trackingTimeline.push({
        step: "Cancelled",
        time: nowTime,
        completed: true,
        desc: "Order was cancelled."
      });
    } else if (targetIdx >= 0) {
      order.trackingTimeline.forEach((stepItem, idx) => {
        if (idx <= targetIdx) {
          stepItem.completed = true;
          if (idx === targetIdx && stepItem.time.includes("Pending")) {
            stepItem.time = "Today, " + nowTime;
          }
        }
      });
    }

    if (nextStatus === "Delivered") {
      order.paymentStatus = "Paid & Settled";
    }

    localStorage.setItem(STORAGE_KEYS.ORDERS, JSON.stringify(orders));

    this.addNotification({
      type: "order",
      title: `Order Status Updated: ${nextStatus} 🚚`,
      message: `Order #${order.id} is now ${nextStatus}.`,
      target: "orders"
    });

    this.notifyStateChange({ type: "order_updated", order });
    return order;
  },

  // Mandi Prices
  getMandiPrices() {
    try {
      return JSON.parse(localStorage.getItem(STORAGE_KEYS.MANDI_PRICES)) || INITIAL_MANDI_PRICES;
    } catch {
      return INITIAL_MANDI_PRICES;
    }
  },

  // Conversations / Chat
  getConversations() {
    try {
      return JSON.parse(localStorage.getItem(STORAGE_KEYS.CONVERSATIONS)) || [];
    } catch {
      return [];
    }
  },
  sendMessage(conversationId, text, senderRole = "buyer", productContext = null) {
    let convs = this.getConversations();
    let conv = convs.find(c => c.id === conversationId);
    const nowTime = new Date().toLocaleTimeString("en-IN", { hour: "2-digit", minute: "2-digit" });

    if (!conv) {
      conv = {
        id: conversationId || "conv_" + Date.now(),
        farmerId: productContext?.farmerId || "usr_farmer_01",
        farmerName: productContext?.farmerName || "Rameshwar Patil",
        farmerAvatar: "https://images.unsplash.com/photo-1544717305-2782549b5136?w=200&auto=format&fit=crop&q=80",
        farmName: productContext?.farmName || "Patil Organic Agri Farms",
        buyerId: "usr_buyer_01",
        buyerName: "Ananya Sharma",
        productId: productContext?.id || "prod_01",
        productName: productContext?.name || "Fresh Harvest Crop",
        productPrice: productContext ? `₹${productContext.price}/${productContext.unit}` : "₹34/kg",
        lastUpdated: nowTime,
        unreadCount: 0,
        messages: []
      };
      convs.unshift(conv);
    }

    conv.messages.push({
      id: "msg_" + Date.now(),
      sender: senderRole,
      text: text,
      time: nowTime
    });
    conv.lastUpdated = nowTime;

    localStorage.setItem(STORAGE_KEYS.CONVERSATIONS, JSON.stringify(convs));
    this.notifyStateChange({ type: "chat", conversation: conv });
    return conv;
  },

  // Notifications
  getNotifications() {
    try {
      return JSON.parse(localStorage.getItem(STORAGE_KEYS.NOTIFICATIONS)) || [];
    } catch {
      return [];
    }
  },
  addNotification(notif) {
    const notifs = this.getNotifications();
    const newNotif = {
      id: "notif_" + Date.now(),
      time: "Just now",
      isRead: false,
      ...notif
    };
    notifs.unshift(newNotif);
    localStorage.setItem(STORAGE_KEYS.NOTIFICATIONS, JSON.stringify(notifs));
    this.notifyStateChange({ type: "notifications" });
  },
  markAllNotificationsRead() {
    const notifs = this.getNotifications();
    notifs.forEach(n => (n.isRead = true));
    localStorage.setItem(STORAGE_KEYS.NOTIFICATIONS, JSON.stringify(notifs));
    this.notifyStateChange({ type: "notifications" });
  },

  // Earnings & Payouts
  getPayouts() {
    try {
      return JSON.parse(localStorage.getItem(STORAGE_KEYS.EARNINGS_PAYOUTS)) || [];
    } catch {
      return [];
    }
  },
  requestPayout(amount, upiId) {
    const payouts = this.getPayouts();
    const newPayout = {
      id: "PAY-" + Math.floor(1000 + Math.random() * 9000),
      amount: Number(amount),
      date: new Date().toISOString().split("T")[0],
      status: "Completed",
      upi: upiId,
      ref: "SBIN" + Math.floor(10000000 + Math.random() * 90000000)
    };
    payouts.unshift(newPayout);
    localStorage.setItem(STORAGE_KEYS.EARNINGS_PAYOUTS, JSON.stringify(payouts));

    this.addNotification({
      type: "payment",
      title: "Bank Payout Successful! 🏦",
      message: `₹${Number(amount).toLocaleString("en-IN")} has been transferred to UPI ${upiId}. Ref: ${newPayout.ref}`,
      target: "earnings"
    });

    this.notifyStateChange({ type: "payout", payout: newPayout });
    return newPayout;
  }
};

// Initialize right away
StorageManager.init();
