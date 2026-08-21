/**
 * ProductDetailModal Component
 */

const ProductDetailModal = {
  selectedQty: 1,

  render(product) {
    if (!product) return "";
    this.selectedQty = product.minOrderQty || 1;
    const totalPrice = product.price * this.selectedQty;

    return `
      <div id="product-detail-modal" class="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-slate-900/60 backdrop-blur-sm animate-fade-in overflow-y-auto">
        <div class="bg-white rounded-3xl shadow-2xl border border-slate-100 max-w-2xl w-full overflow-hidden animate-slide-up relative my-8">
          
          <!-- Close Button -->
          <button 
            onclick="App.closeProductModal()" 
            class="absolute top-4 right-4 p-2.5 rounded-full bg-black/40 hover:bg-black/60 text-white z-20 backdrop-blur-md transition-colors"
          >
            <i data-lucide="x" class="w-5 h-5"></i>
          </button>

          <!-- Top Image & Badges -->
          <div class="relative w-full h-64 sm:h-80 bg-slate-100">
            <img 
              src="${product.image}" 
              alt="${product.name}" 
              class="w-full h-full object-cover"
              onerror="this.src='https://images.unsplash.com/photo-1592924357228-91a4daadcfea?w=600&auto=format&fit=crop&q=80'"
            />
            <div class="absolute inset-0 bg-gradient-to-t from-slate-900/70 via-transparent to-transparent"></div>

            <div class="absolute top-4 left-4 flex flex-wrap gap-2">
              ${product.isOrganic ? `
                <span class="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold badge-organic shadow-md">
                  <i data-lucide="leaf" class="w-3.5 h-3.5"></i> ${product.organicCert || '100% Certified Organic'}
                </span>
              ` : `
                <span class="inline-flex items-center px-3 py-1 rounded-full text-xs font-bold bg-white/90 text-slate-800 backdrop-blur-md shadow-md">
                  APMC Graded Standard
                </span>
              `}
            </div>

            <!-- Freshness & Category -->
            <div class="absolute bottom-4 left-4 right-4 text-white">
              <div class="flex items-center gap-2 text-xs font-semibold text-emerald-300 mb-1">
                <span>${product.category}</span>
                <span>•</span>
                <span class="flex items-center gap-1"><i data-lucide="sparkles" class="w-3 h-3 text-amber-400"></i> ${product.freshness || 'Fresh Farm Pick'}</span>
              </div>
              <h2 class="text-2xl sm:text-3xl font-extrabold font-heading text-white tracking-tight">${product.name}</h2>
            </div>
          </div>

          <!-- Modal Body Content -->
          <div class="p-6 space-y-6 max-h-[60vh] overflow-y-auto">
            
            <!-- Price and Quantity Stock -->
            <div class="flex items-center justify-between p-4 bg-emerald-50/70 rounded-2xl border border-emerald-200/80">
              <div>
                <div class="text-xs text-emerald-800 font-bold uppercase tracking-wider">Direct Farm Gate Price</div>
                <div class="flex items-baseline gap-1.5 mt-0.5">
                  <span class="text-3xl font-extrabold text-slate-900 font-heading">₹${product.price}</span>
                  <span class="text-sm text-slate-600 font-semibold">/ per ${product.unit}</span>
                </div>
              </div>

              <div class="text-right">
                <div class="text-xs font-bold ${product.availableQty > 50 ? 'text-emerald-700' : 'text-amber-700'}">
                  ${product.availableQty} ${product.unit} Available in Stock
                </div>
                <div class="text-[11px] text-slate-500 font-medium">Min Order: ${product.minOrderQty || 1} ${product.unit}</div>
              </div>
            </div>

            <!-- Farmer Information Card -->
            <div class="p-4 rounded-2xl bg-white border border-slate-200 flex items-center justify-between gap-4 shadow-sm">
              <div class="flex items-center gap-3">
                <div class="w-12 h-12 rounded-2xl bg-emerald-100 text-brand-700 flex items-center justify-center flex-shrink-0 font-bold text-lg">
                  <i data-lucide="tractor" class="w-6 h-6"></i>
                </div>
                <div>
                  <div class="flex items-center gap-1.5">
                    <span class="font-bold text-sm text-slate-900">${product.farmerName}</span>
                    <i data-lucide="check-circle-2" class="w-4 h-4 text-emerald-600" title="Verified Kisan"></i>
                  </div>
                  <p class="text-xs text-slate-500">${product.farmName || 'Patil Organic Agri Farms'}</p>
                  <p class="text-[11px] text-emerald-700 font-semibold flex items-center gap-1 mt-0.5">
                    <i data-lucide="map-pin" class="w-3 h-3"></i> ${product.location}
                  </p>
                </div>
              </div>

              <button 
                onclick="App.openChatWithFarmer('${product.farmerId}', '${product.id}')" 
                class="px-3.5 py-2 rounded-xl bg-emerald-100 hover:bg-emerald-200 text-emerald-900 font-bold text-xs flex items-center gap-1.5 transition-colors flex-shrink-0"
              >
                <i data-lucide="message-square" class="w-4 h-4"></i>
                <span>${StorageManager.t('chatFarmer')}</span>
              </button>
            </div>

            <!-- Agricultural Highlights & Specs -->
            <div class="grid grid-cols-2 sm:grid-cols-3 gap-3">
              <div class="p-3 bg-slate-50 rounded-xl border border-slate-200/70">
                <span class="text-[11px] text-slate-500 font-medium block">Harvest Date</span>
                <span class="text-xs font-bold text-slate-800 flex items-center gap-1 mt-0.5">
                  <i data-lucide="calendar" class="w-3.5 h-3.5 text-brand-600"></i> ${product.harvestDate}
                </span>
              </div>

              <div class="p-3 bg-slate-50 rounded-xl border border-slate-200/70">
                <span class="text-[11px] text-slate-500 font-medium block">Shelf Life</span>
                <span class="text-xs font-bold text-slate-800 flex items-center gap-1 mt-0.5">
                  <i data-lucide="clock" class="w-3.5 h-3.5 text-brand-600"></i> ${product.shelfLifeDays || 10} Days
                </span>
              </div>

              <div class="p-3 bg-slate-50 rounded-xl border border-slate-200/70 col-span-2 sm:col-span-1">
                <span class="text-[11px] text-slate-500 font-medium block">Bulk Offer</span>
                <span class="text-xs font-bold text-amber-700 flex items-center gap-1 mt-0.5">
                  <i data-lucide="tag" class="w-3.5 h-3.5 text-amber-600"></i> ${product.bulkDiscount || 'Special bulk rates'}
                </span>
              </div>
            </div>

            <!-- Description -->
            <div class="space-y-1.5">
              <h4 class="text-xs font-bold text-slate-700 uppercase tracking-wider">Crop Details & Natural Farming Notes</h4>
              <p class="text-xs sm:text-sm text-slate-600 leading-relaxed bg-slate-50/70 p-3.5 rounded-xl border border-slate-200/60">
                ${product.description}
              </p>
            </div>

            <!-- Interactive Quantity Selector -->
            <div class="p-4 bg-slate-100 rounded-2xl flex items-center justify-between gap-4">
              <div>
                <span class="text-xs font-bold text-slate-800 block">Select Quantity (${product.unit}):</span>
                <span class="text-[11px] text-slate-500">Min order: ${product.minOrderQty || 1} ${product.unit}</span>
              </div>

              <div class="flex items-center gap-3">
                <div class="flex items-center bg-white rounded-xl border border-slate-300 shadow-sm p-1">
                  <button 
                    onclick="ProductDetailModal.changeQty(-1, ${product.minOrderQty || 1}, ${product.availableQty}, ${product.price})" 
                    class="w-8 h-8 rounded-lg bg-slate-100 hover:bg-slate-200 text-slate-700 font-bold flex items-center justify-center transition-colors"
                  >
                    -
                  </button>
                  <span id="detail-modal-qty" class="w-12 text-center font-bold text-sm text-slate-900">${this.selectedQty}</span>
                  <button 
                    onclick="ProductDetailModal.changeQty(1, ${product.minOrderQty || 1}, ${product.availableQty}, ${product.price})" 
                    class="w-8 h-8 rounded-lg bg-slate-100 hover:bg-slate-200 text-slate-700 font-bold flex items-center justify-center transition-colors"
                  >
                    +
                  </button>
                </div>
                <div class="text-right min-w-[70px]">
                  <span class="text-[10px] text-slate-500 block">Total</span>
                  <span id="detail-modal-total" class="font-extrabold text-sm text-slate-900">₹${totalPrice}</span>
                </div>
              </div>
            </div>

          </div>

          <!-- Bottom Action Buttons -->
          <div class="p-4 sm:p-6 bg-slate-50 border-t border-slate-200 flex items-center gap-3">
            <button 
              onclick="ProductDetailModal.handleAddToCart('${product.id}')" 
              class="flex-1 py-3.5 px-4 rounded-xl border-2 border-brand-600 text-brand-700 hover:bg-brand-50 font-bold text-sm flex items-center justify-center gap-2 transition-all active:scale-98"
            >
              <i data-lucide="shopping-bag" class="w-4 h-4"></i>
              <span>${StorageManager.t('addToCart')}</span>
            </button>

            <button 
              onclick="ProductDetailModal.handleBuyNow('${product.id}')" 
              class="flex-1 py-3.5 px-4 rounded-xl bg-gradient-to-r from-brand-600 to-emerald-700 hover:from-brand-700 hover:to-emerald-800 text-white font-bold text-sm flex items-center justify-center gap-2 shadow-farm shadow-brand-600/30 transition-all active:scale-98"
            >
              <i data-lucide="zap" class="w-4 h-4 fill-current"></i>
              <span>${StorageManager.t('buyNow')}</span>
            </button>
          </div>

        </div>
      </div>
    `;
  },

  changeQty(delta, minQty, maxQty, unitPrice) {
    let newQty = this.selectedQty + delta;
    if (newQty < minQty) newQty = minQty;
    if (newQty > maxQty) newQty = maxQty;
    this.selectedQty = newQty;

    const qtyEl = document.getElementById("detail-modal-qty");
    const totalEl = document.getElementById("detail-modal-total");
    if (qtyEl) qtyEl.textContent = this.selectedQty;
    if (totalEl) totalEl.textContent = `₹${this.selectedQty * unitPrice}`;
  },

  handleAddToCart(productId) {
    const product = StorageManager.getProducts().find(p => p.id === productId);
    if (!product) return;
    StorageManager.addToCart(product, this.selectedQty);
    Toast.show(`Added ${this.selectedQty} ${product.unit} of "${product.name}" to cart! 🛒`, "success");
    App.closeProductModal();
  },

  handleBuyNow(productId) {
    const product = StorageManager.getProducts().find(p => p.id === productId);
    if (!product) return;
    StorageManager.addToCart(product, this.selectedQty);
    App.closeProductModal();
    App.openCheckoutModal();
  }
};
