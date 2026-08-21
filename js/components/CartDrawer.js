/**
 * CartDrawer Component (Slide-out / Modal Shopping Cart)
 */

const CartDrawer = {
  appliedCoupon: null,
  couponDiscount: 0,

  render(state) {
    const cart = state.cart;
    const subtotal = cart.reduce((sum, item) => sum + (item.price * item.quantity), 0);
    const deliveryFee = subtotal > 500 || subtotal === 0 ? 0 : 40;
    
    let discount = 0;
    if (this.appliedCoupon === "KISANFIRST") {
      discount = Math.round(subtotal * 0.10);
    } else if (this.appliedCoupon === "FRESH10") {
      discount = Math.round(subtotal * 0.10);
    } else if (this.appliedCoupon === "ORGANIC50" && subtotal >= 300) {
      discount = 50;
    }
    this.couponDiscount = discount;

    const grandTotal = Math.max(0, subtotal + deliveryFee - discount);

    return `
      <div id="cart-drawer-overlay" class="fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-sm animate-fade-in flex justify-end">
        <div class="bg-white w-full max-w-md h-full shadow-2xl flex flex-col justify-between animate-slide-up sm:animate-slide-down relative">
          
          <!-- Top Header -->
          <div class="p-4 sm:p-5 border-b border-slate-200 flex items-center justify-between bg-slate-50">
            <div class="flex items-center gap-2">
              <div class="w-8 h-8 rounded-xl bg-brand-100 text-brand-700 flex items-center justify-center">
                <i data-lucide="shopping-bag" class="w-4 h-4"></i>
              </div>
              <div>
                <h3 class="font-heading font-bold text-base text-slate-900">Your Fresh Produce Cart</h3>
                <span class="text-xs text-slate-500">${cart.length} unique produce item(s)</span>
              </div>
            </div>

            <button 
              onclick="App.closeCartDrawer()" 
              class="p-2 rounded-full text-slate-400 hover:text-slate-700 hover:bg-slate-200/60 transition-colors"
            >
              <i data-lucide="x" class="w-5 h-5"></i>
            </button>
          </div>

          <!-- Items List -->
          <div class="flex-1 overflow-y-auto p-4 sm:p-5 space-y-3">
            ${cart.length > 0 ? cart.map(item => `
              <div class="p-3.5 rounded-2xl bg-white border border-slate-200 shadow-sm flex items-center gap-3">
                <img 
                  src="${item.image}" 
                  alt="${item.name}" 
                  class="w-16 h-16 rounded-xl object-cover border border-slate-100 flex-shrink-0"
                  onerror="this.src='https://images.unsplash.com/photo-1592924357228-91a4daadcfea?w=600&auto=format&fit=crop&q=80'"
                />
                
                <div class="flex-1 min-w-0 space-y-1">
                  <div class="flex items-center justify-between">
                    <h4 class="font-bold text-xs text-slate-900 truncate">${item.name}</h4>
                    <button 
                      onclick="CartDrawer.removeItem('${item.id}')" 
                      class="text-slate-400 hover:text-red-600 p-1 text-xs"
                      title="Remove item"
                    >
                      <i data-lucide="trash" class="w-3.5 h-3.5"></i>
                    </button>
                  </div>

                  <p class="text-[11px] text-slate-500">₹${item.price} / ${item.unit} • ${item.farmerName}</p>

                  <div class="flex items-center justify-between pt-1">
                    <!-- Quantity Stepper -->
                    <div class="flex items-center bg-slate-100 rounded-lg border border-slate-200 p-0.5">
                      <button 
                        onclick="CartDrawer.updateQty('${item.id}', ${item.quantity - 1})" 
                        class="w-6 h-6 rounded bg-white hover:bg-slate-200 text-slate-700 font-bold text-xs flex items-center justify-center shadow-xs"
                      >
                        -
                      </button>
                      <span class="w-8 text-center text-xs font-bold text-slate-800">${item.quantity}</span>
                      <button 
                        onclick="CartDrawer.updateQty('${item.id}', ${item.quantity + 1})" 
                        class="w-6 h-6 rounded bg-white hover:bg-slate-200 text-slate-700 font-bold text-xs flex items-center justify-center shadow-xs"
                      >
                        +
                      </button>
                    </div>

                    <span class="font-extrabold text-sm text-slate-900">₹${item.price * item.quantity}</span>
                  </div>
                </div>

              </div>
            `).join('') : `
              <!-- Empty Cart State -->
              <div class="py-16 text-center space-y-4">
                <div class="w-16 h-16 rounded-full bg-emerald-50 text-brand-600 flex items-center justify-center mx-auto">
                  <i data-lucide="shopping-basket" class="w-8 h-8"></i>
                </div>
                <h4 class="font-heading font-bold text-base text-slate-800">Your cart is empty</h4>
                <p class="text-xs text-slate-500 max-w-xs mx-auto">Browse fresh organic vegetables, fruits, and grains directly from our verified farmers.</p>
                <button 
                  onclick="App.closeCartDrawer(); App.navigate('marketplace')" 
                  class="px-5 py-2.5 bg-brand-600 hover:bg-brand-700 text-white rounded-xl text-xs font-bold shadow-farm"
                >
                  Explore Marketplace
                </button>
              </div>
            `}
          </div>

          <!-- Bottom Footer / Checkout Controls -->
          ${cart.length > 0 ? `
            <div class="p-4 sm:p-5 border-t border-slate-200 bg-slate-50 space-y-3">
              
              <!-- Coupon Input Box -->
              <div class="flex gap-2">
                <input 
                  type="text" 
                  id="cart-coupon-input" 
                  placeholder="Coupon code (Try: KISANFIRST)" 
                  value="${this.appliedCoupon || ''}" 
                  class="flex-1 px-3 py-2 text-xs bg-white border border-slate-200 rounded-xl uppercase font-bold focus:outline-none focus:ring-2 focus:ring-brand-500"
                />
                <button 
                  onclick="CartDrawer.applyCoupon()" 
                  class="px-3.5 py-2 bg-slate-800 hover:bg-slate-900 text-white text-xs font-bold rounded-xl transition-colors"
                >
                  Apply
                </button>
              </div>

              ${this.appliedCoupon ? `
                <div class="flex items-center justify-between text-xs text-emerald-700 font-bold bg-emerald-50 px-2.5 py-1.5 rounded-lg border border-emerald-200">
                  <span class="flex items-center gap-1"><i data-lucide="check" class="w-3.5 h-3.5"></i> Coupon '${this.appliedCoupon}' applied!</span>
                  <button onclick="CartDrawer.removeCoupon()" class="text-slate-400 hover:text-red-500 text-xs">Remove</button>
                </div>
              ` : ''}

              <!-- Price Breakdown -->
              <div class="space-y-1.5 text-xs text-slate-600 pt-1">
                <div class="flex justify-between">
                  <span>${StorageManager.t('subtotal')}</span>
                  <span class="font-semibold text-slate-800">₹${subtotal}</span>
                </div>
                <div class="flex justify-between">
                  <span class="flex items-center gap-1">${StorageManager.t('deliveryFee')} ${deliveryFee === 0 ? '<span class="text-[10px] text-emerald-600 font-bold bg-emerald-100 px-1.5 py-0.2 rounded">FREE</span>' : ''}</span>
                  <span class="font-semibold text-slate-800">${deliveryFee === 0 ? '₹0' : '₹' + deliveryFee}</span>
                </div>
                ${discount > 0 ? `
                  <div class="flex justify-between text-emerald-700 font-bold">
                    <span>Direct Kisan Discount</span>
                    <span>-₹${discount}</span>
                  </div>
                ` : ''}
                <div class="flex justify-between text-sm font-extrabold text-slate-900 pt-2 border-t border-slate-200">
                  <span>${StorageManager.t('totalAmount')}</span>
                  <span class="text-brand-700 text-base font-heading">₹${grandTotal}</span>
                </div>
              </div>

              <!-- Checkout Button -->
              <button 
                onclick="App.closeCartDrawer(); App.openCheckoutModal()" 
                class="w-full py-3.5 bg-gradient-to-r from-brand-600 to-emerald-700 hover:from-brand-700 hover:to-emerald-800 text-white font-bold text-sm rounded-2xl shadow-farm shadow-brand-600/30 flex items-center justify-center gap-2 transition-all transform active:scale-98"
              >
                <span>${StorageManager.t('checkout')}</span>
                <i data-lucide="arrow-right" class="w-4 h-4"></i>
              </button>

            </div>
          ` : ''}

        </div>
      </div>
    `;
  },

  updateQty(productId, newQty) {
    StorageManager.updateCartQuantity(productId, newQty);
    App.refreshView();
  },

  removeItem(productId) {
    StorageManager.updateCartQuantity(productId, 0);
    Toast.show("Item removed from cart.", "info");
    App.refreshView();
  },

  applyCoupon() {
    const input = document.getElementById("cart-coupon-input");
    if (!input) return;
    const code = input.value.trim().toUpperCase();

    if (code === "KISANFIRST" || code === "FRESH10" || code === "ORGANIC50") {
      this.appliedCoupon = code;
      Toast.show(`Coupon ${code} applied successfully! 🎉`, "success");
      App.refreshView();
    } else {
      Toast.show("Invalid coupon code. Try: KISANFIRST", "error");
    }
  },

  removeCoupon() {
    this.appliedCoupon = null;
    this.couponDiscount = 0;
    App.refreshView();
  }
};
