/**
 * MyProducts Component (Farmer Crop Inventory Manager)
 */

const MyProducts = {
  render(state) {
    const user = state.currentUser;
    const products = state.products.filter(p => p.farmerId === user.id || p.farmerName === user.name);
    const displayProducts = products.length > 0 ? products : state.products;

    return `
      <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6 md:py-8 space-y-6 animate-fade-in">
        
        <!-- Header -->
        <div class="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-white p-6 rounded-3xl border border-slate-200 shadow-sm">
          <div>
            <div class="flex items-center gap-2 mb-1">
              <span class="px-2.5 py-0.5 rounded-full text-[10px] font-bold bg-amber-100 text-amber-800 uppercase tracking-wider">Farmer Inventory</span>
              <span class="text-xs text-slate-500">• ${displayProducts.length} Active Listings</span>
            </div>
            <h1 class="text-2xl sm:text-3xl font-extrabold font-heading text-slate-900">
              ${StorageManager.t('navMyProducts')} & Stock
            </h1>
            <p class="text-xs sm:text-sm text-slate-500 mt-0.5">
              Manage your active crop listings, update stock levels, prices, and monitor buyer demand.
            </p>
          </div>

          <button 
            onclick="App.openAddProductModal()" 
            class="px-5 py-3 rounded-2xl bg-gradient-to-r from-brand-600 to-emerald-700 hover:from-brand-700 hover:to-emerald-800 text-white font-bold text-sm shadow-farm shadow-brand-600/30 flex items-center justify-center gap-2 transform active:scale-95 transition-all flex-shrink-0"
          >
            <i data-lucide="plus-circle" class="w-5 h-5"></i>
            <span>${StorageManager.t('navAddProduct')}</span>
          </button>
        </div>

        <!-- Inventory List / Cards -->
        <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6">
          ${displayProducts.map(product => `
            <div class="bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden flex flex-col justify-between hover:border-brand-300 transition-colors">
              
              <div class="p-4 space-y-3">
                <div class="flex items-start gap-3">
                  <img 
                    src="${product.image}" 
                    alt="${product.name}" 
                    class="w-20 h-20 rounded-xl object-cover border border-slate-100 flex-shrink-0"
                    onerror="this.src='https://images.unsplash.com/photo-1592924357228-91a4daadcfea?w=600&auto=format&fit=crop&q=80'"
                  />
                  <div class="flex-1 min-w-0 space-y-1">
                    <div class="flex items-center justify-between">
                      <span class="text-[10px] font-bold uppercase tracking-wider text-brand-700 bg-brand-50 px-2 py-0.5 rounded">${product.category}</span>
                      ${product.isOrganic ? '<span class="text-[10px] font-bold text-emerald-700 bg-emerald-50 px-1.5 py-0.5 rounded">Organic</span>' : ''}
                    </div>
                    <h3 class="font-heading font-bold text-sm text-slate-900 truncate">${product.name}</h3>
                    <div class="flex items-baseline gap-1">
                      <span class="text-lg font-extrabold text-slate-900">₹${product.price}</span>
                      <span class="text-xs text-slate-500 font-medium">/${product.unit}</span>
                    </div>
                  </div>
                </div>

                <div class="grid grid-cols-2 gap-2 text-xs bg-slate-50 p-2.5 rounded-xl border border-slate-100">
                  <div>
                    <span class="text-[10px] text-slate-400 block">Stock Remaining</span>
                    <span class="font-bold text-slate-800">${product.availableQty} ${product.unit}</span>
                  </div>
                  <div>
                    <span class="text-[10px] text-slate-400 block">Harvest Date</span>
                    <span class="font-bold text-slate-800">${product.harvestDate}</span>
                  </div>
                </div>
              </div>

              <!-- Action Bar -->
              <div class="p-3 bg-slate-50/80 border-t border-slate-100 flex items-center justify-between gap-2">
                <button 
                  onclick="App.openProductModal('${product.id}')" 
                  class="px-3 py-1.5 rounded-lg text-xs font-semibold text-slate-600 hover:text-brand-700 hover:bg-white flex items-center gap-1"
                >
                  <i data-lucide="eye" class="w-3.5 h-3.5"></i> View Details
                </button>

                <button 
                  onclick="MyProducts.deleteProduct('${product.id}', '${product.name}')" 
                  class="px-3 py-1.5 rounded-lg text-xs font-semibold text-red-600 hover:bg-red-50 flex items-center gap-1"
                >
                  <i data-lucide="trash-2" class="w-3.5 h-3.5"></i> Remove
                </button>
              </div>

            </div>
          `).join('')}
        </div>

      </div>
    `;
  },

  deleteProduct(productId, name) {
    if (confirm(`Are you sure you want to remove "${name}" from your active listings?`)) {
      StorageManager.deleteProduct(productId);
      Toast.show(`Removed "${name}" from your listings.`, "info");
      App.refreshView();
    }
  }
};
