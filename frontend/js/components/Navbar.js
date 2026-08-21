/**
 * Navbar Component (Responsive Desktop & Mobile Header)
 */

const Navbar = {
  render(state) {
    const user = state.currentUser;
    const isFarmer = user.role === "farmer";
    const cartCount = state.cart.reduce((sum, item) => sum + (item.quantity || 1), 0);
    const unreadNotifs = state.notifications.filter(n => !n.isRead).length;
    const currentLang = StorageManager.getLanguage();

    return `
      <header class="sticky top-0 z-40 glass-nav border-b border-emerald-100/80 transition-all duration-200">
        <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div class="flex items-center justify-between h-16 md:h-20 gap-2 md:gap-4">
            
            <!-- Brand Logo -->
            <div class="flex items-center gap-3 cursor-pointer flex-shrink-0" onclick="App.navigate('home')">
              <div class="w-10 h-10 md:w-11 md:h-11 rounded-2xl bg-gradient-to-tr from-brand-700 via-brand-600 to-brand-400 flex items-center justify-center text-white shadow-farm shadow-brand-600/30">
                <i data-lucide="sprout" class="w-6 h-6 animate-float"></i>
              </div>
              <div>
                <div class="flex items-center gap-1.5">
                  <span class="font-heading font-extrabold text-xl md:text-2xl text-slate-900 tracking-tight">Farm<span class="text-brand-600">Connect</span></span>
                  <span class="inline-flex items-center px-1.5 py-0.5 rounded text-[10px] font-bold uppercase tracking-wider ${isFarmer ? 'bg-amber-100 text-amber-800 border border-amber-300' : 'bg-blue-100 text-blue-800 border border-blue-300'}">
                    ${isFarmer ? '🌾 Farmer' : '🛒 Buyer'}
                  </span>
                </div>
                <p class="hidden sm:block text-[11px] text-slate-500 font-medium -mt-1 tracking-wide">Direct Farmer-to-Buyer Marketplace</p>
              </div>
            </div>

            <!-- Desktop Nav Links -->
            <nav class="hidden md:flex items-center gap-1 lg:gap-2">
              <button onclick="App.navigate('marketplace')" class="px-3 py-2 rounded-xl text-sm font-semibold transition-colors ${state.currentView === 'marketplace' ? 'bg-brand-50 text-brand-700 font-bold' : 'text-slate-600 hover:text-brand-600 hover:bg-slate-50'}">
                <span class="flex items-center gap-1.5"><i data-lucide="store" class="w-4 h-4"></i> ${StorageManager.t('navMarket')}</span>
              </button>

              <button onclick="App.navigate('mandi')" class="px-3 py-2 rounded-xl text-sm font-semibold transition-colors ${state.currentView === 'mandi' ? 'bg-brand-50 text-brand-700 font-bold' : 'text-slate-600 hover:text-brand-600 hover:bg-slate-50'}">
                <span class="flex items-center gap-1.5"><i data-lucide="trending-up" class="w-4 h-4 text-emerald-600"></i> ${StorageManager.t('navMandi')}</span>
              </button>

              ${isFarmer ? `
                <button onclick="App.navigate('dashboard')" class="px-3 py-2 rounded-xl text-sm font-semibold transition-colors ${state.currentView === 'dashboard' ? 'bg-brand-50 text-brand-700 font-bold' : 'text-slate-600 hover:text-brand-600 hover:bg-slate-50'}">
                  <span class="flex items-center gap-1.5"><i data-lucide="layout-dashboard" class="w-4 h-4"></i> Dashboard</span>
                </button>
                <button onclick="App.navigate('my-products')" class="px-3 py-2 rounded-xl text-sm font-semibold transition-colors ${state.currentView === 'my-products' ? 'bg-brand-50 text-brand-700 font-bold' : 'text-slate-600 hover:text-brand-600 hover:bg-slate-50'}">
                  <span class="flex items-center gap-1.5"><i data-lucide="wheat" class="w-4 h-4"></i> ${StorageManager.t('navMyProducts')}</span>
                </button>
                <button onclick="App.navigate('earnings')" class="px-3 py-2 rounded-xl text-sm font-semibold transition-colors ${state.currentView === 'earnings' ? 'bg-brand-50 text-brand-700 font-bold' : 'text-slate-600 hover:text-brand-600 hover:bg-slate-50'}">
                  <span class="flex items-center gap-1.5"><i data-lucide="wallet" class="w-4 h-4 text-emerald-600"></i> ${StorageManager.t('navEarnings')}</span>
                </button>
              ` : ''}

              <button onclick="App.navigate('orders')" class="px-3 py-2 rounded-xl text-sm font-semibold transition-colors ${state.currentView === 'orders' ? 'bg-brand-50 text-brand-700 font-bold' : 'text-slate-600 hover:text-brand-600 hover:bg-slate-50'}">
                <span class="flex items-center gap-1.5"><i data-lucide="package" class="w-4 h-4"></i> ${StorageManager.t('navOrders')}</span>
              </button>

              <button onclick="App.openChat()" class="px-3 py-2 rounded-xl text-sm font-semibold transition-colors text-slate-600 hover:text-brand-600 hover:bg-slate-50">
                <span class="flex items-center gap-1.5"><i data-lucide="message-square" class="w-4 h-4"></i> ${StorageManager.t('navChat')}</span>
              </button>
            </nav>

            <!-- Actions & User Menu -->
            <div class="flex items-center gap-2 sm:gap-3">
              
              <!-- Role Switcher Quick Pill -->
              <button 
                onclick="App.toggleRole()" 
                class="hidden sm:inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-semibold border transition-all duration-200 ${isFarmer ? 'bg-emerald-50 text-emerald-800 border-emerald-300 hover:bg-emerald-100' : 'bg-blue-50 text-blue-800 border-blue-300 hover:bg-blue-100'}"
                title="Switch between Farmer & Buyer Demo Mode"
              >
                <i data-lucide="refresh-cw" class="w-3 h-3"></i>
                <span>Switch to ${isFarmer ? 'Buyer' : 'Farmer'}</span>
              </button>

              <!-- Language Selector Dropdown -->
              <div class="relative inline-block text-left">
                <select 
                  id="lang-select" 
                  onchange="App.changeLanguage(this.value)" 
                  class="bg-slate-100/90 text-slate-700 text-xs font-semibold rounded-xl px-2.5 py-2 border border-slate-200 hover:bg-slate-200/80 focus:outline-none focus:ring-2 focus:ring-brand-500 cursor-pointer"
                >
                  <option value="en" ${currentLang === 'en' ? 'selected' : ''}>🇬🇧 EN</option>
                  <option value="hi" ${currentLang === 'hi' ? 'selected' : ''}>🇮🇳 हिन्दी</option>
                  <option value="mr" ${currentLang === 'mr' ? 'selected' : ''}>🌾 मराठी</option>
                  <option value="te" ${currentLang === 'te' ? 'selected' : ''}>🇮🇳 తెలుగు</option>
                  <option value="ta" ${currentLang === 'ta' ? 'selected' : ''}>🇮🇳 தமிழ்</option>
                  <option value="pa" ${currentLang === 'pa' ? 'selected' : ''}>🌾 ਪੰਜਾਬੀ</option>
                </select>
              </div>

              <!-- Notifications Bell Button -->
              <button 
                onclick="App.openNotificationsModal()" 
                class="relative p-2 text-slate-600 hover:text-brand-700 hover:bg-brand-50 rounded-xl transition-colors"
                title="Notifications"
              >
                <i data-lucide="bell" class="w-5 h-5"></i>
                ${unreadNotifs > 0 ? `
                  <span class="absolute top-1 right-1 w-4 h-4 bg-red-500 text-white text-[10px] font-bold rounded-full flex items-center justify-center animate-pulse">
                    ${unreadNotifs}
                  </span>
                ` : ''}
              </button>

              <!-- Shopping Cart Button (Buyer / All) -->
              <button 
                onclick="App.openCartDrawer()" 
                class="relative p-2 text-slate-600 hover:text-brand-700 hover:bg-brand-50 rounded-xl transition-colors flex items-center"
                title="Shopping Cart"
              >
                <i data-lucide="shopping-bag" class="w-5 h-5"></i>
                ${cartCount > 0 ? `
                  <span class="absolute top-1 right-1 w-4 h-4 bg-brand-600 text-white text-[10px] font-bold rounded-full flex items-center justify-center">
                    ${cartCount}
                  </span>
                ` : ''}
              </button>

              <!-- Farmer Quick Add Crop Action -->
              ${isFarmer ? `
                <button 
                  onclick="App.openAddProductModal()" 
                  class="hidden sm:inline-flex items-center gap-1.5 px-3.5 py-2 bg-gradient-to-r from-brand-600 to-emerald-600 hover:from-brand-700 hover:to-emerald-700 text-white text-xs font-bold rounded-xl shadow-farm shadow-brand-600/20 transition-all transform active:scale-95"
                >
                  <i data-lucide="plus" class="w-4 h-4"></i>
                  <span>${StorageManager.t('navAddProduct')}</span>
                </button>
              ` : ''}

              <!-- User Profile Avatar & Dropdown -->
              <div class="relative">
                <button 
                  onclick="App.toggleProfileDropdown()" 
                  class="flex items-center gap-2 p-1 pl-1.5 pr-2 rounded-full bg-slate-100 hover:bg-slate-200/80 border border-slate-200 transition-colors"
                >
                  <img src="${user.avatar}" alt="${user.name}" class="w-7 h-7 rounded-full object-cover ring-2 ring-brand-500/50" />
                  <span class="hidden md:inline text-xs font-bold text-slate-800 max-w-[100px] truncate">${user.name.split(' ')[0]}</span>
                  <i data-lucide="chevron-down" class="w-3.5 h-3.5 text-slate-500"></i>
                </button>

                <!-- Profile Dropdown Menu -->
                <div id="profile-dropdown" class="hidden absolute right-0 mt-2 w-56 bg-white rounded-2xl shadow-xl border border-slate-100 py-2 z-50 animate-slide-down">
                  <div class="px-4 py-2.5 border-b border-slate-100">
                    <p class="text-xs font-bold text-slate-900 truncate">${user.name}</p>
                    <p class="text-[11px] text-slate-500 truncate">${user.email}</p>
                    <span class="inline-block mt-1 px-2 py-0.5 text-[10px] font-bold rounded ${isFarmer ? 'bg-amber-100 text-amber-800' : 'bg-blue-100 text-blue-800'}">
                      Role: ${isFarmer ? 'Registered Farmer' : 'Direct Buyer'}
                    </span>
                  </div>
                  
                  <a onclick="App.navigate('profile'); App.closeProfileDropdown()" class="flex items-center gap-2 px-4 py-2 text-xs font-medium text-slate-700 hover:bg-brand-50 hover:text-brand-700 cursor-pointer">
                    <i data-lucide="user" class="w-4 h-4"></i> My Profile & Farm Info
                  </a>
                  
                  ${isFarmer ? `
                    <a onclick="App.openAddProductModal(); App.closeProfileDropdown()" class="flex items-center gap-2 px-4 py-2 text-xs font-medium text-slate-700 hover:bg-brand-50 hover:text-brand-700 cursor-pointer">
                      <i data-lucide="plus-circle" class="w-4 h-4 text-brand-600"></i> Add New Produce
                    </a>
                    <a onclick="App.navigate('earnings'); App.closeProfileDropdown()" class="flex items-center gap-2 px-4 py-2 text-xs font-medium text-slate-700 hover:bg-brand-50 hover:text-brand-700 cursor-pointer">
                      <i data-lucide="wallet" class="w-4 h-4 text-emerald-600"></i> Financial Earnings
                    </a>
                  ` : ''}

                  <a onclick="App.toggleRole(); App.closeProfileDropdown()" class="flex items-center gap-2 px-4 py-2 text-xs font-medium text-slate-700 hover:bg-blue-50 hover:text-blue-700 cursor-pointer">
                    <i data-lucide="repeat" class="w-4 h-4 text-blue-600"></i> Switch to ${isFarmer ? 'Buyer' : 'Farmer'} Mode
                  </a>

                  <div class="border-t border-slate-100 my-1"></div>

                  <a onclick="App.openAuthModal(); App.closeProfileDropdown()" class="flex items-center gap-2 px-4 py-2 text-xs font-medium text-slate-700 hover:bg-slate-50 cursor-pointer">
                    <i data-lucide="key" class="w-4 h-4 text-slate-500"></i> Switch Account / Login
                  </a>

                  <a onclick="App.resetDemoData(); App.closeProfileDropdown()" class="flex items-center gap-2 px-4 py-2 text-xs font-medium text-amber-700 hover:bg-amber-50 cursor-pointer">
                    <i data-lucide="rotate-ccw" class="w-4 h-4 text-amber-600"></i> Reset Demo Mock Data
                  </a>

                  <a onclick="App.logout(); App.closeProfileDropdown()" class="flex items-center gap-2 px-4 py-2 text-xs font-medium text-red-600 hover:bg-red-50 cursor-pointer">
                    <i data-lucide="log-out" class="w-4 h-4"></i> Logout
                  </a>
                </div>
              </div>

            </div>

          </div>
        </div>
      </header>
    `;
  }
};
