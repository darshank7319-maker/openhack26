/**
 * ProductCard Component
 */

const ProductCard = {
  render(product) {
    const isOutOfStock = product.availableQty <= 0;

    return `
      <div class="glass-card rounded-2xl bg-white border border-slate-200/80 overflow-hidden flex flex-col justify-between group relative transition-all duration-300">
        
        <!-- Top Image Section -->
        <div class="relative w-full h-48 sm:h-52 overflow-hidden bg-slate-100 cursor-pointer" onclick="App.openProductModal('${product.id}')">
          <img 
            src="${product.image}" 
            alt="${product.name}" 
            loading="lazy" 
            class="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
            onerror="this.src='https://images.unsplash.com/photo-1592924357228-91a4daadcfea?w=600&auto=format&fit=crop&q=80'"
          />

          <!-- Gradient Overlay -->
          <div class="absolute inset-0 bg-gradient-to-t from-slate-900/60 via-transparent to-transparent opacity-60"></div>

          <!-- Badges Overlay -->
          <div class="absolute top-2.5 left-2.5 flex flex-col gap-1.5 items-start">
            ${product.isOrganic ? `
              <span class="inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-[10px] font-extrabold uppercase tracking-wider badge-organic shadow-sm">
                <i data-lucide="leaf" class="w-3 h-3"></i> Organic
              </span>
            ` : `
              <span class="inline-flex items-center px-2 py-0.5 rounded-full text-[10px] font-bold bg-white/90 text-slate-700 backdrop-blur-sm shadow-sm">
                Standard
              </span>
            `}
          </div>

          <!-- Freshness Tag -->
          <div class="absolute bottom-2.5 left-2.5">
            <span class="inline-flex items-center gap-1 px-2 py-0.5 rounded-md text-[10px] font-bold bg-slate-900/80 text-white backdrop-blur-sm">
              <i data-lucide="sparkles" class="w-3 h-3 text-amber-400"></i> ${product.freshness || 'Freshly Harvested'}
            </span>
          </div>

          <!-- Rating Pill -->
          <div class="absolute top-2.5 right-2.5 bg-white/95 backdrop-blur-md px-2 py-0.5 rounded-lg text-[11px] font-bold text-slate-800 flex items-center gap-1 shadow-sm">
            <i data-lucide="star" class="w-3 h-3 fill-amber-400 text-amber-400"></i>
            <span>${product.rating || '4.8'}</span>
            <span class="text-slate-400 font-normal text-[10px]">(${product.reviewsCount || 12})</span>
          </div>
        </div>

        <!-- Content Body -->
        <div class="p-4 flex-1 flex flex-col justify-between space-y-3">
          
          <div class="space-y-1.5 cursor-pointer" onclick="App.openProductModal('${product.id}')">
            <!-- Category & Location -->
            <div class="flex items-center justify-between text-[11px] text-slate-500 font-medium">
              <span class="text-brand-700 font-bold uppercase tracking-wider">${product.category}</span>
              <span class="flex items-center gap-1 text-slate-500"><i data-lucide="map-pin" class="w-3 h-3 text-emerald-600"></i> ${product.location.split(',')[0]}</span>
            </div>

            <!-- Product Title -->
            <h3 class="font-heading font-bold text-base text-slate-900 group-hover:text-brand-600 transition-colors line-clamp-1">
              ${product.name}
            </h3>

            <!-- Farmer Name -->
            <div class="flex items-center gap-1.5 text-xs text-slate-600">
              <i data-lucide="user-check" class="w-3.5 h-3.5 text-emerald-600 flex-shrink-0"></i>
              <span class="truncate font-medium text-slate-700">${product.farmerName}</span>
              <span class="text-[10px] text-slate-400">• ${product.farmName ? product.farmName.split(' ')[0] : 'Farm'}</span>
            </div>
          </div>

          <!-- Stock & Price Box -->
          <div class="pt-2 border-t border-slate-100">
            <div class="flex items-baseline justify-between mb-3">
              <div>
                <span class="text-xl font-extrabold font-heading text-slate-900">₹${product.price}</span>
                <span class="text-xs text-slate-500 font-medium">/${product.unit}</span>
              </div>
              <div class="text-[11px] font-semibold ${product.availableQty > 50 ? 'text-emerald-700' : 'text-amber-700'}">
                ${product.availableQty} ${product.unit} left
              </div>
            </div>

            <!-- Action Buttons: Add to Cart & Buy Now -->
            <div class="grid grid-cols-2 gap-2">
              <button 
                onclick="App.addToCart('${product.id}', 1)" 
                class="py-2 px-2.5 rounded-xl border border-brand-600 text-brand-700 hover:bg-brand-50 font-bold text-xs flex items-center justify-center gap-1 transition-all active:scale-95"
              >
                <i data-lucide="shopping-bag" class="w-3.5 h-3.5"></i>
                <span>Add</span>
              </button>

              <button 
                onclick="App.buyNow('${product.id}', 1)" 
                class="py-2 px-2.5 rounded-xl bg-gradient-to-r from-brand-600 to-emerald-600 hover:from-brand-700 hover:to-emerald-700 text-white font-bold text-xs flex items-center justify-center gap-1 shadow-sm shadow-brand-600/20 transition-all active:scale-95"
              >
                <i data-lucide="zap" class="w-3.5 h-3.5 fill-current"></i>
                <span>Buy Now</span>
              </button>
            </div>
          </div>

        </div>

      </div>
    `;
  }
};
