/**
 * OrderSuccessModal Component (Celebratory Order Success Receipt)
 */

const OrderSuccessModal = {
  render(order) {
    if (!order) return "";

    return `
      <div id="order-success-modal" class="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/70 backdrop-blur-md animate-fade-in">
        <div class="bg-white rounded-3xl shadow-2xl border border-slate-100 max-w-md w-full overflow-hidden animate-slide-up text-center p-6 sm:p-8 space-y-5 relative">
          
          <!-- Green Tick Celebration Badge -->
          <div class="w-20 h-20 rounded-full bg-emerald-100 text-brand-600 flex items-center justify-center mx-auto ring-8 ring-emerald-50 animate-bounce">
            <i data-lucide="check" class="w-10 h-10 stroke-[3]"></i>
          </div>

          <div class="space-y-1">
            <span class="text-xs font-bold uppercase tracking-wider text-brand-700 bg-brand-50 px-3 py-1 rounded-full">
              Order Confirmed & Placed
            </span>
            <h2 class="text-2xl font-extrabold font-heading text-slate-900 mt-2">
              ${StorageManager.t('orderPlacedSuccess')}
            </h2>
            <p class="text-xs text-slate-500">
              Your direct produce order has been routed to the farmer.
            </p>
          </div>

          <!-- Order Summary Card -->
          <div class="bg-slate-50 rounded-2xl p-4 border border-slate-200 text-left space-y-2 text-xs">
            <div class="flex justify-between border-b border-slate-200/80 pb-2">
              <span class="text-slate-500 font-semibold">Order ID</span>
              <span class="font-extrabold text-slate-900">#${order.id}</span>
            </div>
            <div class="flex justify-between">
              <span class="text-slate-500">Farmer</span>
              <span class="font-bold text-slate-800">${order.farmerName} (${order.farmName})</span>
            </div>
            <div class="flex justify-between">
              <span class="text-slate-500">Amount Paid</span>
              <span class="font-extrabold text-brand-700 text-sm">₹${order.total}</span>
            </div>
            <div class="flex justify-between">
              <span class="text-slate-500">Payment Status</span>
              <span class="text-emerald-700 font-bold bg-emerald-100 px-2 py-0.5 rounded text-[10px]">${order.paymentStatus}</span>
            </div>
            <div class="flex justify-between">
              <span class="text-slate-500">Estimated Delivery</span>
              <span class="font-semibold text-slate-800">${order.expectedDelivery}</span>
            </div>
          </div>

          <!-- Action Buttons -->
          <div class="space-y-2 pt-2">
            <button 
              onclick="App.closeOrderSuccessModal(); App.openOrderTracker('${order.id}')" 
              class="w-full py-3.5 bg-brand-600 hover:bg-brand-700 text-white font-bold text-sm rounded-xl shadow-farm shadow-brand-600/30 flex items-center justify-center gap-2 transition-all transform active:scale-98"
            >
              <i data-lucide="truck" class="w-4 h-4"></i>
              <span>${StorageManager.t('trackOrder')}</span>
            </button>

            <button 
              onclick="App.closeOrderSuccessModal(); App.navigate('marketplace')" 
              class="w-full py-3 bg-slate-100 hover:bg-slate-200 text-slate-700 font-semibold text-xs rounded-xl transition-colors"
            >
              Continue Shopping
            </button>
          </div>

        </div>
      </div>
    `;
  }
};
