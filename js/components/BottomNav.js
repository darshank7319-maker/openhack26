/**
 * BottomNav Component (Sticky Mobile Navigation)
 */

const BottomNav = {
  render(state) {
    const isFarmer = state.currentUser.role === "farmer";
    const cartCount = state.cart.reduce((sum, item) => sum + (item.quantity || 1), 0);
    const unreadMessages = state.conversations.reduce((sum, c) => sum + (c.unreadCount || 0), 0);
    const currentView = state.currentView;

    return `
      <!-- Sticky Mobile Bottom Navigation -->
      <nav class="md:hidden fixed bottom-0 left-0 right-0 z-40 bg-white/95 backdrop-blur-md border-t border-slate-200 shadow-lg px-2 py-1.5 flex items-center justify-around safe-bottom-padding">
        
        <!-- Home / Dashboard -->
        <button 
          onclick="App.navigate('${isFarmer ? 'dashboard' : 'home'}')" 
          class="flex flex-col items-center justify-center flex-1 py-1 ${((isFarmer && currentView === 'dashboard') || (!isFarmer && currentView === 'home')) ? 'text-brand-600 font-bold' : 'text-slate-500 hover:text-slate-800'}"
        >
          <i data-lucide="${isFarmer ? 'layout-dashboard' : 'home'}" class="w-5 h-5 mb-0.5"></i>
          <span class="text-[10px] leading-tight">${isFarmer ? 'Dashboard' : StorageManager.t('navHome')}</span>
        </button>

        <!-- Marketplace -->
        <button 
          onclick="App.navigate('marketplace')" 
          class="flex flex-col items-center justify-center flex-1 py-1 ${currentView === 'marketplace' ? 'text-brand-600 font-bold' : 'text-slate-500 hover:text-slate-800'}"
        >
          <i data-lucide="store" class="w-5 h-5 mb-0.5"></i>
          <span class="text-[10px] leading-tight">${StorageManager.t('navMarket')}</span>
        </button>

        <!-- Center Action Button -->
        ${isFarmer ? `
          <div class="relative -top-3 flex flex-col items-center">
            <button 
              onclick="App.openAddProductModal()" 
              class="w-12 h-12 rounded-full bg-gradient-to-r from-brand-600 to-emerald-700 text-white flex items-center justify-center shadow-lg shadow-brand-600/40 transform active:scale-95 transition-transform"
              title="Add New Crop"
            >
              <i data-lucide="plus" class="w-6 h-6"></i>
            </button>
            <span class="text-[9px] font-bold text-brand-800 mt-0.5">Add Crop</span>
          </div>
        ` : `
          <div class="relative -top-3 flex flex-col items-center">
            <button 
              onclick="App.openCartDrawer()" 
              class="w-12 h-12 rounded-full bg-gradient-to-r from-brand-600 to-emerald-700 text-white flex items-center justify-center shadow-lg shadow-brand-600/40 transform active:scale-95 transition-transform relative"
              title="View Cart"
            >
              <i data-lucide="shopping-bag" class="w-6 h-6"></i>
              ${cartCount > 0 ? `
                <span class="absolute -top-1 -right-1 w-5 h-5 bg-amber-500 text-white text-[11px] font-bold rounded-full flex items-center justify-center border-2 border-white">
                  ${cartCount}
                </span>
              ` : ''}
            </button>
            <span class="text-[9px] font-bold text-brand-800 mt-0.5">Cart</span>
          </div>
        `}

        <!-- Orders -->
        <button 
          onclick="App.navigate('orders')" 
          class="flex flex-col items-center justify-center flex-1 py-1 ${currentView === 'orders' ? 'text-brand-600 font-bold' : 'text-slate-500 hover:text-slate-800'}"
        >
          <i data-lucide="package" class="w-5 h-5 mb-0.5"></i>
          <span class="text-[10px] leading-tight">${StorageManager.t('navOrders')}</span>
        </button>

        <!-- Messages / Profile -->
        <button 
          onclick="${isFarmer ? "App.navigate('earnings')" : "App.openChat()"}" 
          class="flex flex-col items-center justify-center flex-1 py-1 ${(isFarmer && currentView === 'earnings') ? 'text-brand-600 font-bold' : 'text-slate-500 hover:text-slate-800'}"
        >
          <div class="relative">
            <i data-lucide="${isFarmer ? 'wallet' : 'message-square'}" class="w-5 h-5 mb-0.5"></i>
            ${(!isFarmer && unreadMessages > 0) ? `
              <span class="absolute -top-1 -right-1 w-2 h-2 bg-brand-600 rounded-full"></span>
            ` : ''}
          </div>
          <span class="text-[10px] leading-tight">${isFarmer ? StorageManager.t('navEarnings') : StorageManager.t('navChat')}</span>
        </button>

        <!-- Profile -->
        <button 
          onclick="App.navigate('profile')" 
          class="flex flex-col items-center justify-center flex-1 py-1 ${currentView === 'profile' ? 'text-brand-600 font-bold' : 'text-slate-500 hover:text-slate-800'}"
        >
          <i data-lucide="user" class="w-5 h-5 mb-0.5"></i>
          <span class="text-[10px] leading-tight">${StorageManager.t('navProfile')}</span>
        </button>

      </nav>
    `;
  }
};
