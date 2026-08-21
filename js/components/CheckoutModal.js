/**
 * CheckoutModal Component (Delivery Address & Multi-Payment Checkout)
 */

const CheckoutModal = {
  selectedPayment: "UPI", // 'UPI', 'Card', 'COD'
  selectedSlot: "express", // 'express', 'standard'

  render(state) {
    const user = state.currentUser;
    const cart = state.cart;
    if (cart.length === 0) return "";

    const subtotal = cart.reduce((sum, item) => sum + (item.price * item.quantity), 0);
    const deliveryFee = subtotal > 500 ? 0 : 40;
    const discount = CartDrawer.couponDiscount || 0;
    const grandTotal = Math.max(0, subtotal + deliveryFee - discount);

    const defaultAddress = user.deliveryAddress?.street ? 
      `${user.deliveryAddress.street}, ${user.deliveryAddress.city}, ${user.deliveryAddress.state} - ${user.deliveryAddress.pincode}` :
      "Flat 402, Green Meadows Residency, Paud Road, Pune, Maharashtra 411038";

    return `
      <div id="checkout-modal" class="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-slate-900/60 backdrop-blur-sm animate-fade-in overflow-y-auto">
        <div class="bg-white rounded-3xl shadow-2xl border border-slate-100 max-w-2xl w-full overflow-hidden animate-slide-up relative my-8">
          
          <!-- Close Button -->
          <button 
            onclick="App.closeCheckoutModal()" 
            class="absolute top-4 right-4 p-2.5 rounded-full text-slate-400 hover:text-slate-700 hover:bg-slate-100 z-10 transition-colors"
          >
            <i data-lucide="x" class="w-5 h-5"></i>
          </button>

          <!-- Header -->
          <div class="bg-gradient-to-r from-brand-800 via-brand-700 to-emerald-800 text-white p-6">
            <div class="flex items-center gap-2 mb-1">
              <span class="px-2.5 py-0.5 rounded-full text-[10px] font-bold bg-white/20 uppercase tracking-wider">Direct Farm Order</span>
              <span class="text-xs text-emerald-200">• Secure Checkout</span>
            </div>
            <h2 class="text-2xl font-bold font-heading text-white">Complete Your Farm Order</h2>
            <p class="text-emerald-100 text-xs mt-0.5">Your payment goes directly into the farmer's escrow with fair payout settlement.</p>
          </div>

          <!-- Checkout Form -->
          <form onsubmit="CheckoutModal.handlePlaceOrder(event)" class="p-6 space-y-6 max-h-[70vh] overflow-y-auto">
            
            <!-- Section 1: Delivery Address -->
            <div class="space-y-3">
              <div class="flex items-center justify-between">
                <h3 class="font-heading font-bold text-sm text-slate-900 flex items-center gap-2">
                  <i data-lucide="map-pin" class="w-4 h-4 text-brand-600"></i> 1. Delivery Destination
                </h3>
                <button 
                  type="button" 
                  onclick="CheckoutModal.fillCurrentLocation()" 
                  class="text-[11px] font-bold text-brand-600 hover:text-brand-700 flex items-center gap-1"
                >
                  <i data-lucide="crosshair" class="w-3.5 h-3.5"></i> Use GPS Auto-fill
                </button>
              </div>

              <div class="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label class="block text-[11px] font-bold text-slate-700 mb-1">Recipient Name *</label>
                  <input 
                    type="text" 
                    id="checkout-name" 
                    required 
                    value="${user.deliveryAddress?.fullName || user.name}" 
                    class="w-full px-3 py-2 text-xs sm:text-sm bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-brand-500"
                  />
                </div>
                <div>
                  <label class="block text-[11px] font-bold text-slate-700 mb-1">Phone Number *</label>
                  <input 
                    type="tel" 
                    id="checkout-phone" 
                    required 
                    value="${user.phone || '+91 97112 34567'}" 
                    class="w-full px-3 py-2 text-xs sm:text-sm bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-brand-500"
                  />
                </div>
              </div>

              <div>
                <label class="block text-[11px] font-bold text-slate-700 mb-1">Full Street Address & Pincode *</label>
                <textarea 
                  id="checkout-address" 
                  required 
                  rows="2" 
                  class="w-full px-3 py-2 text-xs sm:text-sm bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-brand-500"
                >${defaultAddress}</textarea>
              </div>
            </div>

            <!-- Section 2: Delivery Slot Choice -->
            <div class="space-y-2.5">
              <h3 class="font-heading font-bold text-sm text-slate-900 flex items-center gap-2">
                <i data-lucide="clock" class="w-4 h-4 text-amber-600"></i> 2. Delivery Speed & Slot
              </h3>
              
              <div class="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
                <label class="flex items-start gap-3 p-3 rounded-2xl border cursor-pointer transition-all ${this.selectedSlot === 'express' ? 'border-brand-600 bg-brand-50/50 ring-1 ring-brand-500' : 'border-slate-200 bg-white hover:bg-slate-50'}">
                  <input 
                    type="radio" 
                    name="slot" 
                    value="express" 
                    checked 
                    onchange="CheckoutModal.selectedSlot = this.value" 
                    class="mt-1 text-brand-600 focus:ring-brand-500"
                  />
                  <div>
                    <div class="font-bold text-xs text-slate-900 flex items-center gap-1.5">
                      <span>Express Direct (24 Hours)</span>
                      <span class="text-[10px] bg-emerald-100 text-emerald-800 font-bold px-1.5 py-0.2 rounded">Fastest</span>
                    </div>
                    <p class="text-[11px] text-slate-500 mt-0.5">Direct farm dispatch via chilled logistics van</p>
                  </div>
                </label>

                <label class="flex items-start gap-3 p-3 rounded-2xl border cursor-pointer transition-all ${this.selectedSlot === 'standard' ? 'border-brand-600 bg-brand-50/50 ring-1 ring-brand-500' : 'border-slate-200 bg-white hover:bg-slate-50'}">
                  <input 
                    type="radio" 
                    name="slot" 
                    value="standard" 
                    onchange="CheckoutModal.selectedSlot = this.value" 
                    class="mt-1 text-brand-600 focus:ring-brand-500"
                  />
                  <div>
                    <div class="font-bold text-xs text-slate-900">Standard Fresh Delivery (48h)</div>
                    <p class="text-[11px] text-slate-500 mt-0.5">Batched regional farm delivery</p>
                  </div>
                </label>
              </div>
            </div>

            <!-- Section 3: Payment Method Selection -->
            <div class="space-y-3">
              <h3 class="font-heading font-bold text-sm text-slate-900 flex items-center gap-2">
                <i data-lucide="credit-card" class="w-4 h-4 text-purple-600"></i> 3. Select Payment Mode
              </h3>

              <div class="grid grid-cols-3 gap-2">
                
                <button 
                  type="button" 
                  onclick="CheckoutModal.setPaymentMethod('UPI')" 
                  class="p-3 rounded-2xl border text-center transition-all flex flex-col items-center justify-center gap-1.5 ${this.selectedPayment === 'UPI' ? 'border-brand-600 bg-brand-50/80 text-brand-800 ring-2 ring-brand-500' : 'border-slate-200 bg-white text-slate-700 hover:bg-slate-50'}"
                >
                  <i data-lucide="smartphone" class="w-5 h-5"></i>
                  <span class="text-xs font-bold">UPI / GPay</span>
                </button>

                <button 
                  type="button" 
                  onclick="CheckoutModal.setPaymentMethod('Card')" 
                  class="p-3 rounded-2xl border text-center transition-all flex flex-col items-center justify-center gap-1.5 ${this.selectedPayment === 'Card' ? 'border-brand-600 bg-brand-50/80 text-brand-800 ring-2 ring-brand-500' : 'border-slate-200 bg-white text-slate-700 hover:bg-slate-50'}"
                >
                  <i data-lucide="credit-card" class="w-5 h-5"></i>
                  <span class="text-xs font-bold">Debit / Card</span>
                </button>

                <button 
                  type="button" 
                  onclick="CheckoutModal.setPaymentMethod('COD')" 
                  class="p-3 rounded-2xl border text-center transition-all flex flex-col items-center justify-center gap-1.5 ${this.selectedPayment === 'COD' ? 'border-brand-600 bg-brand-50/80 text-brand-800 ring-2 ring-brand-500' : 'border-slate-200 bg-white text-slate-700 hover:bg-slate-50'}"
                >
                  <i data-lucide="banknote" class="w-5 h-5"></i>
                  <span class="text-xs font-bold">Pay on Delivery</span>
                </button>

              </div>

              <!-- Payment Details Preview -->
              ${this.selectedPayment === "UPI" ? `
                <div class="p-3.5 bg-slate-50 rounded-2xl border border-slate-200 flex items-center gap-3">
                  <div class="w-16 h-16 bg-white rounded-xl border border-slate-200 flex items-center justify-center p-1 shadow-xs flex-shrink-0">
                    <img src="https://api.qrserver.com/v1/create-qr-code/?size=100x100&data=upi://pay?pa=farmconnect.escrow@icici&pn=FarmConnect%20Direct&am=${grandTotal}&cu=INR" alt="UPI QR" class="w-full h-full object-contain" />
                  </div>
                  <div class="text-xs space-y-0.5">
                    <span class="font-bold text-slate-800">Scan & Pay ₹${grandTotal} via any UPI App</span>
                    <p class="text-[11px] text-slate-500">Google Pay, PhonePe, Paytm, BHIM</p>
                    <span class="inline-block text-[10px] text-emerald-700 font-semibold bg-emerald-100 px-1.5 py-0.2 rounded">Instant Escrow Verified</span>
                  </div>
                </div>
              ` : this.selectedPayment === "Card" ? `
                <div class="p-3.5 bg-slate-50 rounded-2xl border border-slate-200 space-y-2">
                  <input type="text" placeholder="Card Number (Demo: 4242 •••• •••• 4242)" value="4242 4242 4242 4242" class="w-full px-3 py-2 text-xs bg-white border border-slate-200 rounded-xl" />
                  <div class="grid grid-cols-2 gap-2">
                    <input type="text" placeholder="MM/YY" value="08/28" class="px-3 py-1.5 text-xs bg-white border border-slate-200 rounded-xl" />
                    <input type="password" placeholder="CVV" value="888" class="px-3 py-1.5 text-xs bg-white border border-slate-200 rounded-xl" />
                  </div>
                </div>
              ` : `
                <div class="p-3 bg-amber-50 rounded-2xl border border-amber-200 text-xs text-amber-800 flex items-center gap-2">
                  <i data-lucide="info" class="w-4 h-4 text-amber-600 flex-shrink-0"></i>
                  <span>Pay exact amount of <strong>₹${grandTotal}</strong> in cash or UPI directly to delivery driver upon receiving fresh produce.</span>
                </div>
              `}
            </div>

            <!-- Section 4: Mini Summary -->
            <div class="p-4 bg-emerald-50/70 rounded-2xl border border-emerald-200/70 space-y-1.5 text-xs">
              <div class="flex justify-between text-slate-600">
                <span>Items Total (${cart.length} produce)</span>
                <span class="font-semibold text-slate-800">₹${subtotal}</span>
              </div>
              <div class="flex justify-between text-slate-600">
                <span>Delivery Fee</span>
                <span class="font-semibold text-slate-800">${deliveryFee === 0 ? 'FREE' : '₹' + deliveryFee}</span>
              </div>
              ${discount > 0 ? `
                <div class="flex justify-between text-emerald-700 font-bold">
                  <span>Direct Coupon Discount</span>
                  <span>-₹${discount}</span>
                </div>
              ` : ''}
              <div class="flex justify-between text-sm font-extrabold text-slate-900 pt-1.5 border-t border-emerald-200">
                <span>Total Payable</span>
                <span class="text-base text-brand-700 font-heading">₹${grandTotal}</span>
              </div>
            </div>

            <!-- Submit Place Order Button -->
            <button 
              type="submit" 
              class="w-full py-4 bg-gradient-to-r from-brand-600 via-brand-700 to-emerald-700 hover:from-brand-700 hover:to-emerald-800 text-white font-bold text-sm sm:text-base rounded-2xl shadow-farm shadow-brand-600/30 flex items-center justify-center gap-2 transition-all transform active:scale-98"
            >
              <i data-lucide="shield-check" class="w-5 h-5"></i>
              <span>${StorageManager.t('placeOrder')} (₹${grandTotal})</span>
            </button>

          </form>

        </div>
      </div>
    `;
  },

  setPaymentMethod(method) {
    this.selectedPayment = method;
    App.refreshCheckoutModal();
  },

  fillCurrentLocation() {
    const addrEl = document.getElementById("checkout-address");
    if (addrEl) {
      addrEl.value = "Sector 14, Near APMC Market Yard, Pune, Maharashtra 411037 (GPS Auto-Detected)";
      Toast.show("Location auto-detected via GPS! 📍", "info");
    }
  },

  handlePlaceOrder(e) {
    e.preventDefault();
    const address = document.getElementById("checkout-address").value.trim();
    const phone = document.getElementById("checkout-phone").value.trim();
    const name = document.getElementById("checkout-name").value.trim();
    const cart = StorageManager.getCart();

    if (cart.length === 0) {
      Toast.show("Your cart is empty.", "error");
      return;
    }

    const subtotal = cart.reduce((sum, item) => sum + (item.price * item.quantity), 0);
    const deliveryFee = subtotal > 500 ? 0 : 40;
    const discount = CartDrawer.couponDiscount || 0;
    const total = Math.max(0, subtotal + deliveryFee - discount);

    const order = StorageManager.createOrder({
      items: cart,
      itemTotal: subtotal,
      deliveryFee: deliveryFee,
      discount: discount,
      total: total,
      deliveryAddress: address,
      buyerName: name,
      buyerPhone: phone,
      paymentMethod: this.selectedPayment
    });

    App.closeCheckoutModal();

    // Trigger Canvas Confetti celebration
    if (typeof confetti === "function") {
      confetti({
        particleCount: 80,
        spread: 70,
        origin: { y: 0.6 }
      });
    }

    App.openOrderSuccessModal(order);
  }
};
