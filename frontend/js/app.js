/**
 * FarmConnect - Core Application Coordinator & View Engine
 */

const App = {
  state: {
    currentUser: null,
    currentView: "home", // 'home', 'marketplace', 'dashboard', 'my-products', 'orders', 'earnings', 'mandi', 'profile'
    products: [],
    orders: [],
    cart: [],
    conversations: [],
    notifications: [],
    mandiPrices: [],
    activeModal: null, // 'auth', 'addProduct', 'productDetail', 'cart', 'checkout', 'orderSuccess', 'orderTracker', 'notifications', 'chat'
    modalData: null
  },

  init() {
    StorageManager.init();
    this.syncState();

    // Default view based on role
    if (this.state.currentUser.role === "farmer") {
      this.state.currentView = "dashboard";
    } else {
      this.state.currentView = "marketplace";
    }

    // Listen to storage state change events
    window.addEventListener("farmconnect:state-change", (e) => {
      this.syncState();
      this.render();
    });

    // Initial render
    this.render();
  },

  syncState() {
    this.state.currentUser = StorageManager.getUser();
    this.state.products = StorageManager.getProducts();
    this.state.orders = StorageManager.getOrders();
    this.state.cart = StorageManager.getCart();
    this.state.conversations = StorageManager.getConversations();
    this.state.notifications = StorageManager.getNotifications();
    this.state.mandiPrices = StorageManager.getMandiPrices();
  },

  navigate(view) {
    // If switching to home as farmer, redirect to dashboard
    if (view === "home" && this.state.currentUser.role === "farmer") {
      view = "dashboard";
    }
    this.state.currentView = view;
    window.scrollTo({ top: 0, behavior: "smooth" });
    this.render();
  },

  refreshView() {
    this.syncState();
    this.render();
  },

  refreshModal() {
    this.render();
  },

  refreshCheckoutModal() {
    this.render();
  },

  toggleRole() {
    const currentRole = this.state.currentUser.role;
    const newRole = currentRole === "farmer" ? "buyer" : "farmer";
    const newUser = StorageManager.switchDemoRole(newRole);
    
    Toast.show(`Switched active mode to ${newRole === 'farmer' ? 'Farmer' : 'Buyer'} (${newUser.name})! 🔄`, "info");
    this.navigate(newRole === "farmer" ? "dashboard" : "marketplace");
  },

  changeLanguage(lang) {
    StorageManager.setLanguage(lang);
    Toast.show(`Language updated. (भाषा बदलली)`, "info");
    this.render();
  },

  resetDemoData() {
    if (confirm("Reset all demo data (products, orders, cart, chats) back to original factory state?")) {
      StorageManager.resetAll();
      Toast.show("All prototype data reset to fresh demo state! 🌿", "success");
      this.navigate(this.state.currentUser.role === "farmer" ? "dashboard" : "marketplace");
    }
  },

  logout() {
    Toast.show("Logged out. Choose demo account to log in again.", "info");
    this.openAuthModal();
  },

  // Modal Handlers
  openAuthModal() {
    this.state.activeModal = "auth";
    this.render();
  },
  closeAuthModal() {
    this.state.activeModal = null;
    this.render();
  },

  openAddProductModal() {
    this.state.activeModal = "addProduct";
    this.render();
  },
  closeAddProductModal() {
    this.state.activeModal = null;
    this.render();
  },

  openProductModal(productId) {
    const product = this.state.products.find(p => p.id === productId);
    if (!product) return;
    this.state.activeModal = "productDetail";
    this.state.modalData = product;
    this.render();
  },
  closeProductModal() {
    this.state.activeModal = null;
    this.state.modalData = null;
    this.render();
  },

  openCartDrawer() {
    this.state.activeModal = "cart";
    this.render();
  },
  closeCartDrawer() {
    if (this.state.activeModal === "cart") {
      this.state.activeModal = null;
      this.render();
    }
  },

  openCheckoutModal() {
    this.state.activeModal = "checkout";
    this.render();
  },
  closeCheckoutModal() {
    this.state.activeModal = null;
    this.render();
  },

  openOrderSuccessModal(order) {
    this.state.activeModal = "orderSuccess";
    this.state.modalData = order;
    this.render();
  },
  closeOrderSuccessModal() {
    this.state.activeModal = null;
    this.state.modalData = null;
    this.render();
  },

  openOrderTracker(orderId) {
    const order = this.state.orders.find(o => o.id === orderId);
    if (!order) return;
    this.state.activeModal = "orderTracker";
    this.state.modalData = order;
    this.render();
  },
  closeOrderTracker() {
    this.state.activeModal = null;
    this.state.modalData = null;
    this.render();
  },

  openNotificationsModal() {
    this.state.activeModal = "notifications";
    this.render();
  },
  closeNotificationsModal() {
    this.state.activeModal = null;
    this.render();
  },

  openChat() {
    this.state.activeModal = "chat";
    this.render();
  },
  openChatWithFarmer(farmerId, productId) {
    const product = this.state.products.find(p => p.id === productId);
    ChatDrawer.activeProductContext = product;
    
    // Find or create conversation
    let conv = this.state.conversations.find(c => c.productId === productId);
    if (conv) {
      ChatDrawer.activeConversationId = conv.id;
    } else {
      ChatDrawer.activeConversationId = "conv_" + Date.now();
    }
    
    this.state.activeModal = "chat";
    this.render();
  },
  closeChat() {
    this.state.activeModal = null;
    this.render();
  },

  toggleProfileDropdown() {
    const el = document.getElementById("profile-dropdown");
    if (el) el.classList.toggle("hidden");
  },
  closeProfileDropdown() {
    const el = document.getElementById("profile-dropdown");
    if (el) el.classList.add("hidden");
  },

  // Direct Quick Actions
  addToCart(productId, quantity = 1) {
    const product = this.state.products.find(p => p.id === productId);
    if (!product) return;
    StorageManager.addToCart(product, quantity);
    Toast.show(`Added ${quantity} ${product.unit} of "${product.name}" to cart! 🛒`, "success");
  },

  buyNow(productId, quantity = 1) {
    const product = this.state.products.find(p => p.id === productId);
    if (!product) return;
    StorageManager.addToCart(product, quantity);
    this.openCheckoutModal();
  },

  advanceOrderStatus(orderId, nextStatus) {
    StorageManager.updateOrderStatus(orderId, nextStatus);
    Toast.show(`Order #${orderId} status advanced to "${nextStatus}"! 🚚`, "success");
    this.refreshView();
  },

  // Main Render Routine
  render() {
    const root = document.getElementById("root");
    if (!root) return;

    let viewHtml = "";

    switch (this.state.currentView) {
      case "dashboard":
        viewHtml = FarmerDashboard.render(this.state);
        break;
      case "my-products":
        viewHtml = MyProducts.render(this.state);
        break;
      case "marketplace":
      case "home":
        viewHtml = Marketplace.render(this.state);
        break;
      case "orders":
        viewHtml = OrdersManager.render(this.state);
        break;
      case "earnings":
        viewHtml = EarningsView.render(this.state);
        break;
      case "mandi":
        viewHtml = MandiPricesView.render(this.state);
        break;
      case "profile":
        viewHtml = ProfileView.render(this.state);
        break;
      default:
        viewHtml = Marketplace.render(this.state);
    }

    let modalHtml = "";
    if (this.state.activeModal === "auth") {
      modalHtml = AuthModal.render();
    } else if (this.state.activeModal === "addProduct") {
      modalHtml = AddProductModal.render();
    } else if (this.state.activeModal === "productDetail") {
      modalHtml = ProductDetailModal.render(this.state.modalData);
    } else if (this.state.activeModal === "cart") {
      modalHtml = CartDrawer.render(this.state);
    } else if (this.state.activeModal === "checkout") {
      modalHtml = CheckoutModal.render(this.state);
    } else if (this.state.activeModal === "orderSuccess") {
      modalHtml = OrderSuccessModal.render(this.state.modalData);
    } else if (this.state.activeModal === "orderTracker") {
      modalHtml = OrderTrackerModal.render(this.state.modalData);
    } else if (this.state.activeModal === "notifications") {
      modalHtml = NotificationsModal.render(this.state);
    } else if (this.state.activeModal === "chat") {
      modalHtml = ChatDrawer.render(this.state);
    }

    root.innerHTML = `
      <!-- Desktop & Mobile Header Navbar -->
      ${Navbar.render(this.state)}

      <!-- Main Dynamic View Container -->
      <main class="flex-1 safe-bottom-padding">
        ${viewHtml}
      </main>

      <!-- Footer -->
      <footer class="bg-slate-900 text-slate-400 py-10 border-t border-slate-800 text-xs hidden md:block">
        <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex flex-col sm:flex-row items-center justify-between gap-4">
          <div class="flex items-center gap-2">
            <div class="w-8 h-8 rounded-xl bg-brand-600 text-white flex items-center justify-center font-bold">
              <i data-lucide="sprout" class="w-5 h-5"></i>
            </div>
            <div>
              <span class="font-heading font-extrabold text-sm text-white">FarmConnect Prototype</span>
              <p class="text-[11px] text-slate-500">Direct Agricultural Marketplace for Indian Farmers & Conscious Consumers</p>
            </div>
          </div>

          <div class="flex items-center gap-4 text-[11px]">
            <a href="javascript:void(0)" onclick="App.toggleRole()" class="hover:text-emerald-400 transition-colors">Switch Mode</a>
            <a href="javascript:void(0)" onclick="App.resetDemoData()" class="hover:text-amber-400 transition-colors">Reset Demo Data</a>
            <a href="javascript:void(0)" onclick="App.openAuthModal()" class="hover:text-white transition-colors">Demo Credentials</a>
            <span>•</span>
            <span class="text-slate-500">Kisan Hotline: 1800-180-1551</span>
          </div>
        </div>
      </footer>

      <!-- Mobile Sticky Bottom Navigation -->
      ${BottomNav.render(this.state)}

      <!-- Active Modal / Drawer Layer -->
      ${modalHtml}
    `;

    // Re-initialize Lucide icons across freshly rendered DOM elements
    if (window.lucide) {
      lucide.createIcons();
    }
  }
};

// Auto boot on DOM load
document.addEventListener("DOMContentLoaded", () => {
  App.init();
});
