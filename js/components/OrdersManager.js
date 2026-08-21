/**
 * OrdersManager Component (Order Management with Status Updates & Tracking)
 */

const OrdersManager = {
  activeTab: "All",

  renderStatusBadge(status) {
    const badges = {
      "Pending": "bg-amber-100 text-amber-800 border-amber-300",
      "Confirmed": "bg-blue-100 text-blue-800 border-blue-300",
      "Shipped": "bg-purple-100 text-purple-800 border-purple-300",
      "Out for Delivery": "bg-indigo-100 text-indigo-800 border-indigo-300",
      "Delivered": "bg-emerald-100 text-emerald-800 border-emerald-300",
      "Cancelled": "bg-red-100 text-red-800 border-red-300"
    };

    const icons = {
      "Pending": "clock",
      "Confirmed": "check-circle",
      "Shipped": "box",
      "Out for Delivery": "truck",
      "Delivered": "badge-check",
      "Cancelled": "x-circle"
    };

    return `
      <span class="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-bold border ${badges[status] || badges.Pending}">
        <i data-lucide="${icons[status] || 'clock'}" class="w-3.5 h-3.5"></i>
        <span>${status}</span>
      </span>
    `;
  },

  render(state) {
    const user = state.currentUser;
    const isFarmer = user.role === "farmer";
    let orders = [...state.orders];

    // Filter by tab
    if (this.activeTab !== "All") {
      orders = orders.filter(o => o.status === this.activeTab);
    }

    const statuses = ["All", "Pending", "Confirmed", "Shipped", "Out for Delivery", "Delivered", "Cancelled"];

    return `
      <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6 md:py-8 space-y-6 animate-fade-in">
        
        <!-- Header -->
        <div class="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-white p-6 rounded-3xl border border-slate-200 shadow-sm">
          <div>
            <div class="flex items-center gap-2 mb-1">
              <span class="px-2.5 py-0.5 rounded-full text-[10px] font-bold ${isFarmer ? 'bg-amber-100 text-amber-800' : 'bg-blue-100 text-blue-800'} uppercase tracking-wider">
                ${isFarmer ? 'Farmer Order Fulfillment' : 'Buyer Purchase History'}
              </span>
              <span class="text-xs text-slate-500">• ${orders.length} orders</span>
            </div>
            <h1 class="text-2xl sm:text-3xl font-extrabold font-heading text-slate-900">
              ${isFarmer ? 'Farmer Order Management' : 'My Orders & Farm Deliveries'}
            </h1>
            <p class="text-xs sm:text-sm text-slate-500 mt-0.5">
              ${isFarmer ? 'Track incoming harvest orders and advance delivery stages directly.' : 'Real-time order statuses, farm origin details, and live delivery tracking.'}
            </p>
          </div>

          ${!isFarmer ? `
            <button 
              onclick="App.navigate('marketplace')" 
              class="px-4 py-2.5 bg-brand-600 hover:bg-brand-700 text-white font-bold text-xs rounded-xl shadow-farm flex items-center gap-2 flex-shrink-0"
            >
              <i data-lucide="store" class="w-4 h-4"></i> Order Fresh Produce
            </button>
          ` : ''}
        </div>

        <!-- Filter Tabs Bar -->
        <div class="flex items-center gap-2 overflow-x-auto no-scrollbar py-1">
          ${statuses.map(st => `
            <button 
              onclick="OrdersManager.setTab('${st}')" 
              class="flex-shrink-0 px-3.5 py-2 rounded-xl text-xs sm:text-sm font-bold transition-all ${this.activeTab === st ? 'bg-slate-900 text-white shadow-md' : 'bg-white hover:bg-slate-100 text-slate-600 border border-slate-200'}"
            >
              ${st}
            </button>
          `).join('')}
        </div>

        <!-- Orders List -->
        ${orders.length > 0 ? `
          <div class="space-y-4">
            ${orders.map(order => this.renderOrderCard(order, isFarmer)).join('')}
          </div>
        ` : `
          <!-- Empty State -->
          <div class="bg-white rounded-3xl border border-slate-200 p-12 text-center space-y-4 max-w-lg mx-auto">
            <div class="w-16 h-16 rounded-full bg-slate-100 text-slate-500 flex items-center justify-center mx-auto">
              <i data-lucide="package" class="w-8 h-8"></i>
            </div>
            <h3 class="font-heading font-bold text-lg text-slate-900">No orders found in "${this.activeTab}"</h3>
            <p class="text-xs sm:text-sm text-slate-500">
              There are currently no orders under this status filter.
            </p>
            <button 
              onclick="OrdersManager.setTab('All')" 
              class="px-4 py-2 bg-slate-800 text-white rounded-xl text-xs font-bold"
            >
              View All Orders
            </button>
          </div>
        `}

      </div>
    `;
  },

  renderOrderCard(order, isFarmer) {
    const nextStatusMap = {
      "Pending": "Confirmed",
      "Confirmed": "Shipped",
      "Shipped": "Out for Delivery",
      "Out for Delivery": "Delivered"
    };

    const nextStatus = nextStatusMap[order.status];

    return `
      <div class="bg-white rounded-3xl border border-slate-200/90 shadow-sm overflow-hidden hover:border-brand-300 transition-all space-y-4 p-5 sm:p-6">
        
        <!-- Top Order Header -->
        <div class="flex flex-wrap items-center justify-between gap-3 pb-4 border-b border-slate-100">
          <div class="flex items-center gap-3">
            <div class="w-10 h-10 rounded-2xl bg-emerald-50 text-brand-700 flex items-center justify-center flex-shrink-0">
              <i data-lucide="package" class="w-5 h-5"></i>
            </div>
            <div>
              <div class="flex items-center gap-2">
                <span class="font-extrabold text-sm sm:text-base text-slate-900">Order #${order.id}</span>
                ${this.renderStatusBadge(order.status)}
              </div>
              <span class="text-xs text-slate-400">Placed on ${order.date}</span>
            </div>
          </div>

          <div class="text-right">
            <span class="text-xs text-slate-400 block">Total Amount</span>
            <span class="font-extrabold text-lg text-brand-700 font-heading">₹${order.total}</span>
          </div>
        </div>

        <!-- Items Row -->
        <div class="space-y-2.5">
          ${order.items.map(item => `
            <div class="flex items-center gap-3 p-2.5 bg-slate-50 rounded-2xl border border-slate-100">
              <img 
                src="${item.image}" 
                alt="${item.name}" 
                class="w-12 h-12 rounded-xl object-cover border border-slate-200 flex-shrink-0"
                onerror="this.src='https://images.unsplash.com/photo-1592924357228-91a4daadcfea?w=600&auto=format&fit=crop&q=80'"
              />
              <div class="flex-1 min-w-0">
                <h4 class="font-bold text-xs text-slate-900 truncate">${item.name}</h4>
                <p class="text-[11px] text-slate-500">Qty: <strong>${item.quantity} ${item.unit}</strong> @ ₹${item.price}/${item.unit}</p>
              </div>
              <div class="font-bold text-xs text-slate-800">₹${item.price * item.quantity}</div>
            </div>
          `).join('')}
        </div>

        <!-- Buyer & Farmer Details Grid -->
        <div class="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs bg-slate-50/70 p-3.5 rounded-2xl border border-slate-200/60">
          <div>
            <span class="text-[10px] text-slate-400 font-bold uppercase tracking-wider block">Customer Destination</span>
            <p class="font-bold text-slate-800 mt-0.5">${order.buyerName} (${order.buyerPhone})</p>
            <p class="text-slate-500 text-[11px] truncate">${order.deliveryAddress}</p>
          </div>

          <div>
            <span class="text-[10px] text-slate-400 font-bold uppercase tracking-wider block">Farm Origin & Farmer</span>
            <p class="font-bold text-slate-800 mt-0.5">${order.farmerName} • ${order.farmName}</p>
            <p class="text-slate-500 text-[11px]">Payment: <strong class="text-emerald-700">${order.paymentStatus}</strong></p>
          </div>
        </div>

        <!-- Bottom Actions Row -->
        <div class="flex flex-wrap items-center justify-between gap-3 pt-2">
          
          <div class="flex items-center gap-2">
            <!-- Track Order Button -->
            <button 
              onclick="App.openOrderTracker('${order.id}')" 
              class="px-4 py-2 bg-slate-900 hover:bg-slate-800 text-white rounded-xl font-bold text-xs flex items-center gap-1.5 transition-colors shadow-sm"
            >
              <i data-lucide="map-pin" class="w-3.5 h-3.5 text-emerald-400"></i>
              <span>${StorageManager.t('trackOrder')}</span>
            </button>

            <!-- Chat Button -->
            <button 
              onclick="App.openChat()" 
              class="px-3.5 py-2 bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-xl font-semibold text-xs flex items-center gap-1.5 transition-colors"
            >
              <i data-lucide="message-square" class="w-3.5 h-3.5"></i>
              <span>Chat</span>
            </button>
          </div>

          <!-- Farmer Status Updater Controls (for demonstration) -->
          <div class="flex items-center gap-2">
            ${nextStatus ? `
              <button 
                onclick="App.advanceOrderStatus('${order.id}', '${nextStatus}')" 
                class="px-4 py-2 bg-gradient-to-r from-brand-600 to-emerald-600 hover:from-brand-700 hover:to-emerald-700 text-white rounded-xl font-bold text-xs flex items-center gap-1.5 shadow-sm transition-all transform active:scale-95"
                title="Advance Status Demo"
              >
                <i data-lucide="arrow-right-circle" class="w-3.5 h-3.5"></i>
                <span>Mark as: ${nextStatus}</span>
              </button>
            ` : ''}

            ${order.status === "Pending" ? `
              <button 
                onclick="App.advanceOrderStatus('${order.id}', 'Cancelled')" 
                class="px-3 py-2 border border-red-300 text-red-600 hover:bg-red-50 rounded-xl font-semibold text-xs transition-colors"
              >
                Cancel
              </button>
            ` : ''}

            ${order.status === "Delivered" ? `
              <button 
                onclick="Toast.show('Tax invoice receipt downloaded for #${order.id} 📄', 'success')" 
                class="px-3.5 py-2 bg-emerald-50 text-emerald-800 hover:bg-emerald-100 rounded-xl font-semibold text-xs flex items-center gap-1 border border-emerald-200 transition-colors"
              >
                <i data-lucide="download" class="w-3.5 h-3.5"></i> Invoice
              </button>
            ` : ''}
          </div>

        </div>

      </div>
    `;
  },

  setTab(tab) {
    this.activeTab = tab;
    App.refreshView();
  }
};
