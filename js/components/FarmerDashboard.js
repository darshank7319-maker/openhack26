/**
 * FarmerDashboard Component
 */

const FarmerDashboard = {
  render(state) {
    const user = state.currentUser;
    const products = state.products.filter(p => p.farmerId === user.id || p.farmerName === user.name);
    const allFarmerProductsCount = products.length > 0 ? products.length : state.products.length;
    
    const orders = state.orders.filter(o => o.farmerId === user.id || o.farmerName === user.name);
    const relevantOrders = orders.length > 0 ? orders : state.orders;

    const pendingOrders = relevantOrders.filter(o => o.status === "Pending" || o.status === "Confirmed").length;
    const completedOrders = relevantOrders.filter(o => o.status === "Delivered");
    
    const totalSales = relevantOrders.reduce((sum, o) => sum + (o.status !== "Cancelled" ? o.total : 0), 0) + 14850;
    const availableEarnings = 18450 - (StorageManager.getPayouts().reduce((sum, p) => sum + p.amount, 0) - 11000);

    const mandiPrices = state.mandiPrices.slice(0, 4);

    return `
      <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6 md:py-8 space-y-6 animate-fade-in">
        
        <!-- Welcome Banner with Agricultural Theme -->
        <div class="relative rounded-3xl bg-gradient-to-r from-brand-900 via-brand-800 to-emerald-900 text-white p-6 sm:p-8 shadow-farm-lg overflow-hidden border border-emerald-700/50">
          <div class="absolute -right-10 -bottom-10 w-64 h-64 bg-emerald-500/10 rounded-full blur-2xl pointer-events-none"></div>
          <div class="relative z-10 flex flex-col md:flex-row md:items-center justify-between gap-6">
            
            <div class="space-y-2">
              <div class="flex items-center gap-2">
                <span class="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold bg-emerald-500/20 text-emerald-300 border border-emerald-400/30">
                  <i data-lucide="check-circle-2" class="w-3.5 h-3.5 text-emerald-400"></i> ${StorageManager.t('verifiedFarmer')} • Kisan ID: ${user.kisanCardNumber || 'MH-8821'}
                </span>
                <span class="inline-flex items-center px-2 py-0.5 rounded text-[11px] font-semibold bg-white/10 text-white">
                  ${user.location}
                </span>
              </div>
              
              <h1 class="text-2xl sm:text-3xl lg:text-4xl font-extrabold font-heading tracking-tight text-white">
                ${StorageManager.t('welcome')}, ${user.name}! 🌾
              </h1>
              
              <p class="text-emerald-100/90 text-sm sm:text-base max-w-2xl">
                Managing <span class="font-bold text-white">${user.farmName || 'Patil Organic Agri Farms'}</span>. Direct orders are reaching buyers with 0% middleman fees.
              </p>
            </div>

            <!-- Header Quick Action -->
            <div class="flex flex-wrap items-center gap-3">
              <button 
                onclick="App.openAddProductModal()" 
                class="px-5 py-3 rounded-2xl bg-gradient-to-r from-amber-500 to-harvest-amber hover:from-amber-600 hover:to-amber-700 text-white font-bold text-sm shadow-lg shadow-amber-500/30 flex items-center gap-2 transform active:scale-95 transition-all"
              >
                <i data-lucide="plus-circle" class="w-5 h-5"></i>
                <span>${StorageManager.t('navAddProduct')}</span>
              </button>

              <button 
                onclick="App.navigate('earnings')" 
                class="px-4 py-3 rounded-2xl bg-white/10 hover:bg-white/20 text-white font-semibold text-sm border border-white/20 flex items-center gap-2 transition-colors"
              >
                <i data-lucide="banknote" class="w-4 h-4 text-emerald-400"></i>
                <span>Payouts</span>
              </button>
            </div>

          </div>
        </div>

        <!-- 4 Core Metric KPI Cards -->
        <div class="grid grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-5">
          
          <!-- Total Products -->
          <div onclick="App.navigate('my-products')" class="glass-card rounded-2xl p-4 sm:p-5 border border-slate-200/80 cursor-pointer bg-white">
            <div class="flex items-center justify-between mb-3">
              <span class="text-xs font-bold text-slate-500 uppercase tracking-wider">${StorageManager.t('activeCrops')}</span>
              <div class="w-10 h-10 rounded-xl bg-emerald-50 text-brand-600 flex items-center justify-center">
                <i data-lucide="wheat" class="w-5 h-5"></i>
              </div>
            </div>
            <div class="text-2xl sm:text-3xl font-extrabold text-slate-900 font-heading">${allFarmerProductsCount}</div>
            <div class="flex items-center gap-1 mt-1 text-xs text-emerald-600 font-semibold">
              <i data-lucide="check" class="w-3.5 h-3.5"></i> In Stock & Live
            </div>
          </div>

          <!-- Pending Orders -->
          <div onclick="App.navigate('orders')" class="glass-card rounded-2xl p-4 sm:p-5 border border-slate-200/80 cursor-pointer bg-white">
            <div class="flex items-center justify-between mb-3">
              <span class="text-xs font-bold text-slate-500 uppercase tracking-wider">${StorageManager.t('pendingOrders')}</span>
              <div class="w-10 h-10 rounded-xl bg-amber-50 text-amber-600 flex items-center justify-center">
                <i data-lucide="clock" class="w-5 h-5"></i>
              </div>
            </div>
            <div class="text-2xl sm:text-3xl font-extrabold text-slate-900 font-heading">${pendingOrders}</div>
            <div class="flex items-center gap-1 mt-1 text-xs text-amber-700 font-semibold">
              <i data-lucide="alert-circle" class="w-3.5 h-3.5"></i> Needs Dispatch
            </div>
          </div>

          <!-- Total Sales -->
          <div onclick="App.navigate('earnings')" class="glass-card rounded-2xl p-4 sm:p-5 border border-slate-200/80 cursor-pointer bg-white">
            <div class="flex items-center justify-between mb-3">
              <span class="text-xs font-bold text-slate-500 uppercase tracking-wider">${StorageManager.t('totalSales')}</span>
              <div class="w-10 h-10 rounded-xl bg-blue-50 text-blue-600 flex items-center justify-center">
                <i data-lucide="trending-up" class="w-5 h-5"></i>
              </div>
            </div>
            <div class="text-2xl sm:text-3xl font-extrabold text-slate-900 font-heading">₹${totalSales.toLocaleString('en-IN')}</div>
            <div class="flex items-center gap-1 mt-1 text-xs text-blue-600 font-semibold">
              <i data-lucide="arrow-up-right" class="w-3.5 h-3.5"></i> Direct Farm Revenue
            </div>
          </div>

          <!-- Available Earnings -->
          <div onclick="App.navigate('earnings')" class="glass-card rounded-2xl p-4 sm:p-5 border border-slate-200/80 cursor-pointer bg-white">
            <div class="flex items-center justify-between mb-3">
              <span class="text-xs font-bold text-slate-500 uppercase tracking-wider">${StorageManager.t('availableEarnings')}</span>
              <div class="w-10 h-10 rounded-xl bg-purple-50 text-purple-600 flex items-center justify-center">
                <i data-lucide="wallet" class="w-5 h-5"></i>
              </div>
            </div>
            <div class="text-2xl sm:text-3xl font-extrabold text-slate-900 font-heading">₹${availableEarnings.toLocaleString('en-IN')}</div>
            <div class="flex items-center gap-1 mt-1 text-xs text-purple-700 font-semibold">
              <i data-lucide="badge-check" class="w-3.5 h-3.5"></i> Ready for Payout
            </div>
          </div>

        </div>

        <!-- Quick Actions Toolbar -->
        <div class="glass-panel rounded-2xl p-4 sm:p-5">
          <div class="flex items-center justify-between mb-3">
            <h2 class="text-sm font-bold text-slate-800 uppercase tracking-wider flex items-center gap-2">
              <i data-lucide="sparkles" class="w-4 h-4 text-amber-500"></i> ${StorageManager.t('quickActions')}
            </h2>
            <span class="text-xs text-slate-500">Farmer Tools</span>
          </div>

          <div class="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-3">
            
            <button onclick="App.openAddProductModal()" class="flex flex-col items-center justify-center p-3.5 rounded-xl bg-white hover:bg-emerald-50 border border-slate-200 hover:border-emerald-300 transition-all text-slate-700 hover:text-emerald-800 shadow-sm group">
              <div class="w-10 h-10 rounded-xl bg-emerald-100 text-brand-700 flex items-center justify-center mb-2 group-hover:scale-110 transition-transform">
                <i data-lucide="plus-circle" class="w-5 h-5"></i>
              </div>
              <span class="text-xs font-bold">${StorageManager.t('navAddProduct')}</span>
              <span class="text-[10px] text-slate-400 mt-0.5">List produce</span>
            </button>

            <button onclick="App.navigate('my-products')" class="flex flex-col items-center justify-center p-3.5 rounded-xl bg-white hover:bg-emerald-50 border border-slate-200 hover:border-emerald-300 transition-all text-slate-700 hover:text-emerald-800 shadow-sm group">
              <div class="w-10 h-10 rounded-xl bg-blue-100 text-blue-700 flex items-center justify-center mb-2 group-hover:scale-110 transition-transform">
                <i data-lucide="wheat" class="w-5 h-5"></i>
              </div>
              <span class="text-xs font-bold">${StorageManager.t('navMyProducts')}</span>
              <span class="text-[10px] text-slate-400 mt-0.5">Edit inventory</span>
            </button>

            <button onclick="App.navigate('orders')" class="flex flex-col items-center justify-center p-3.5 rounded-xl bg-white hover:bg-emerald-50 border border-slate-200 hover:border-emerald-300 transition-all text-slate-700 hover:text-emerald-800 shadow-sm group">
              <div class="w-10 h-10 rounded-xl bg-amber-100 text-amber-700 flex items-center justify-center mb-2 group-hover:scale-110 transition-transform">
                <i data-lucide="package" class="w-5 h-5"></i>
              </div>
              <span class="text-xs font-bold">${StorageManager.t('navOrders')}</span>
              <span class="text-[10px] text-slate-400 mt-0.5">Process shipments</span>
            </button>

            <button onclick="App.navigate('earnings')" class="flex flex-col items-center justify-center p-3.5 rounded-xl bg-white hover:bg-emerald-50 border border-slate-200 hover:border-emerald-300 transition-all text-slate-700 hover:text-emerald-800 shadow-sm group">
              <div class="w-10 h-10 rounded-xl bg-purple-100 text-purple-700 flex items-center justify-center mb-2 group-hover:scale-110 transition-transform">
                <i data-lucide="wallet" class="w-5 h-5"></i>
              </div>
              <span class="text-xs font-bold">${StorageManager.t('navEarnings')}</span>
              <span class="text-[10px] text-slate-400 mt-0.5">UPI / Bank payout</span>
            </button>

            <button onclick="App.navigate('mandi')" class="flex flex-col items-center justify-center p-3.5 rounded-xl bg-white hover:bg-emerald-50 border border-slate-200 hover:border-emerald-300 transition-all text-slate-700 hover:text-emerald-800 shadow-sm group">
              <div class="w-10 h-10 rounded-xl bg-orange-100 text-orange-700 flex items-center justify-center mb-2 group-hover:scale-110 transition-transform">
                <i data-lucide="trending-up" class="w-5 h-5"></i>
              </div>
              <span class="text-xs font-bold">${StorageManager.t('navMandi')}</span>
              <span class="text-[10px] text-slate-400 mt-0.5">APMC Intelligence</span>
            </button>

            <button onclick="App.openChat()" class="flex flex-col items-center justify-center p-3.5 rounded-xl bg-white hover:bg-emerald-50 border border-slate-200 hover:border-emerald-300 transition-all text-slate-700 hover:text-emerald-800 shadow-sm group">
              <div class="w-10 h-10 rounded-xl bg-teal-100 text-teal-700 flex items-center justify-center mb-2 group-hover:scale-110 transition-transform">
                <i data-lucide="message-square" class="w-5 h-5"></i>
              </div>
              <span class="text-xs font-bold">${StorageManager.t('navChat')}</span>
              <span class="text-[10px] text-slate-400 mt-0.5">Buyer Inquiries</span>
            </button>

          </div>
        </div>

        <!-- 2-Column Grid: Live Mandi Rates Widget + Recent Orders -->
        <div class="grid grid-cols-1 lg:grid-cols-12 gap-6">
          
          <!-- Live Mandi Rates Widget (5 Cols) -->
          <div class="lg:col-span-5 bg-white rounded-2xl border border-slate-200/80 p-5 shadow-sm space-y-4">
            <div class="flex items-center justify-between">
              <div>
                <h3 class="font-heading font-bold text-base text-slate-900 flex items-center gap-2">
                  <i data-lucide="activity" class="w-4 h-4 text-emerald-600"></i> ${StorageManager.t('liveMandiTrends')}
                </h3>
                <p class="text-xs text-slate-500">Live wholesale vs FarmConnect direct</p>
              </div>
              <button onclick="App.navigate('mandi')" class="text-xs font-bold text-brand-600 hover:text-brand-700 flex items-center gap-1">
                View All <i data-lucide="arrow-right" class="w-3.5 h-3.5"></i>
              </button>
            </div>

            <div class="space-y-2.5">
              ${mandiPrices.map(item => `
                <div class="p-3 rounded-xl bg-slate-50 hover:bg-emerald-50/60 border border-slate-200/70 transition-colors flex items-center justify-between">
                  <div class="space-y-0.5">
                    <div class="font-bold text-xs text-slate-800">${item.commodity}</div>
                    <div class="text-[11px] text-slate-500">${item.localMandi.split('(')[0]}</div>
                  </div>
                  <div class="text-right">
                    <div class="font-extrabold text-sm text-slate-900">₹${item.currentPrice}/kg</div>
                    <div class="text-[11px] font-bold ${item.trend === 'up' ? 'text-emerald-600' : 'text-red-500'} flex items-center justify-end gap-0.5">
                      <i data-lucide="${item.trend === 'up' ? 'trending-up' : 'trending-down'}" class="w-3 h-3"></i>
                      ${item.changePercent > 0 ? '+' : ''}${item.changePercent}%
                    </div>
                  </div>
                </div>
              `).join('')}
            </div>

            <div class="p-3 bg-emerald-50 rounded-xl border border-emerald-200 text-xs text-emerald-800 flex items-start gap-2">
              <i data-lucide="sparkles" class="w-4 h-4 text-emerald-600 flex-shrink-0 mt-0.5"></i>
              <span><strong>Mandi Tip:</strong> Tomato demand is at a 2-week peak. Listing directly on FarmConnect saves you ₹4.5/kg in middleman mandi tax!</span>
            </div>
          </div>

          <!-- Recent Orders Management Card (7 Cols) -->
          <div class="lg:col-span-7 bg-white rounded-2xl border border-slate-200/80 p-5 shadow-sm space-y-4">
            <div class="flex items-center justify-between">
              <div>
                <h3 class="font-heading font-bold text-base text-slate-900 flex items-center gap-2">
                  <i data-lucide="truck" class="w-4 h-4 text-brand-600"></i> ${StorageManager.t('recentOrders')}
                </h3>
                <p class="text-xs text-slate-500">Incoming buyer orders requiring action</p>
              </div>
              <button onclick="App.navigate('orders')" class="text-xs font-bold text-brand-600 hover:text-brand-700 flex items-center gap-1">
                All Orders <i data-lucide="arrow-right" class="w-3.5 h-3.5"></i>
              </button>
            </div>

            <div class="space-y-3">
              ${relevantOrders.slice(0, 3).map(order => `
                <div class="p-4 rounded-xl border border-slate-200 hover:border-brand-300 transition-all bg-slate-50/50 hover:bg-white space-y-3">
                  <div class="flex items-center justify-between gap-2">
                    <div class="flex items-center gap-2">
                      <span class="font-bold text-xs text-slate-900">#${order.id}</span>
                      <span class="text-[11px] text-slate-500">${order.date}</span>
                    </div>
                    ${OrdersManager.renderStatusBadge(order.status)}
                  </div>

                  <div class="flex items-center justify-between text-xs text-slate-700">
                    <div>
                      <span class="font-semibold text-slate-900">${order.buyerName}</span>
                      <span class="text-slate-500 text-[11px]">(${order.items.map(i => i.name.split(' ')[0] + ' ' + i.quantity + i.unit).join(', ')})</span>
                    </div>
                    <div class="font-extrabold text-slate-900 text-sm">₹${order.total}</div>
                  </div>

                  <!-- Inline Quick Action for Farmer -->
                  <div class="flex items-center justify-between pt-2 border-t border-slate-200/70 text-xs">
                    <button onclick="App.openOrderTracker('${order.id}')" class="text-slate-600 hover:text-brand-600 font-semibold flex items-center gap-1">
                      <i data-lucide="map-pin" class="w-3.5 h-3.5"></i> Track
                    </button>

                    ${order.status === "Pending" ? `
                      <button onclick="App.advanceOrderStatus('${order.id}', 'Confirmed')" class="px-3 py-1 bg-brand-600 hover:bg-brand-700 text-white rounded-lg font-bold text-[11px] shadow-sm">
                        ✓ Accept & Confirm
                      </button>
                    ` : order.status === "Confirmed" ? `
                      <button onclick="App.advanceOrderStatus('${order.id}', 'Shipped')" class="px-3 py-1 bg-purple-600 hover:bg-purple-700 text-white rounded-lg font-bold text-[11px]">
                        📦 Mark Shipped
                      </button>
                    ` : order.status === "Shipped" ? `
                      <button onclick="App.advanceOrderStatus('${order.id}', 'Out for Delivery')" class="px-3 py-1 bg-blue-600 hover:bg-blue-700 text-white rounded-lg font-bold text-[11px]">
                        🚚 Out for Delivery
                      </button>
                    ` : order.status === "Out for Delivery" ? `
                      <button onclick="App.advanceOrderStatus('${order.id}', 'Delivered')" class="px-3 py-1 bg-emerald-600 hover:bg-emerald-700 text-white rounded-lg font-bold text-[11px]">
                        ✓ Mark Delivered
                      </button>
                    ` : `
                      <span class="text-emerald-600 font-bold text-[11px] flex items-center gap-1">
                        <i data-lucide="check-circle" class="w-3.5 h-3.5"></i> Completed
                      </span>
                    `}
                  </div>
                </div>
              `).join('')}
            </div>

          </div>

        </div>

      </div>
    `;
  }
};
