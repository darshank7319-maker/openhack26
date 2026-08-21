/**
 * MandiPricesView Component (APMC Market Intelligence & Live Mandi Rates)
 */

const MandiPricesView = {
  searchQuery: "",
  categoryFilter: "All",

  render(state) {
    let list = [...state.mandiPrices];

    if (this.searchQuery.trim()) {
      const q = this.searchQuery.toLowerCase();
      list = list.filter(m => m.commodity.toLowerCase().includes(q) || m.localMandi.toLowerCase().includes(q));
    }

    if (this.categoryFilter !== "All") {
      list = list.filter(m => m.category === this.categoryFilter);
    }

    return `
      <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6 md:py-8 space-y-6 animate-fade-in">
        
        <!-- Header Banner -->
        <div class="relative rounded-3xl bg-gradient-to-r from-slate-900 via-slate-800 to-emerald-950 text-white p-6 sm:p-8 shadow-farm overflow-hidden border border-emerald-900/50">
          <div class="relative z-10 space-y-2 max-w-3xl">
            <div class="flex items-center gap-2">
              <span class="px-2.5 py-0.5 rounded-full text-[10px] font-bold bg-emerald-500/20 text-emerald-300 border border-emerald-400/30 uppercase tracking-wider">
                APMC Real-time Feed
              </span>
              <span class="text-xs text-slate-300">• Direct Mandi Benchmark</span>
            </div>
            <h1 class="text-2xl sm:text-4xl font-extrabold font-heading text-white">
              National & Regional Mandi Price Intelligence
            </h1>
            <p class="text-slate-300 text-xs sm:text-sm">
              Live wholesale commodity price trends, state APMC comparisons, and direct selling margin recommendations for farmers.
            </p>
          </div>
        </div>

        <!-- Filter & Search Controls -->
        <div class="flex flex-wrap items-center justify-between gap-3 bg-white p-4 rounded-2xl border border-slate-200 shadow-sm">
          <div class="relative flex-1 min-w-[220px]">
            <i data-lucide="search" class="w-4 h-4 text-slate-400 absolute left-3 top-3 pointer-events-none"></i>
            <input 
              type="text" 
              value="${this.searchQuery}" 
              oninput="MandiPricesView.handleSearch(this.value)" 
              placeholder="Search commodity or APMC Mandi..." 
              class="w-full pl-9 pr-3 py-2 text-xs sm:text-sm bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-brand-500"
            />
          </div>

          <div class="flex items-center gap-2">
            <select 
              onchange="MandiPricesView.setCategory(this.value)" 
              class="bg-slate-100 text-slate-700 text-xs sm:text-sm font-semibold rounded-xl px-3 py-2 border border-slate-200 focus:outline-none focus:ring-2 focus:ring-brand-500 cursor-pointer"
            >
              <option value="All">All Categories</option>
              <option value="Vegetables">Vegetables</option>
              <option value="Fruits">Fruits</option>
              <option value="Grains & Cereals">Grains & Cereals</option>
              <option value="Spices & Herbs">Spices & Herbs</option>
            </select>
          </div>
        </div>

        <!-- Mandi Commodity Cards Grid -->
        <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-5">
          ${list.map(item => `
            <div class="bg-white rounded-3xl border border-slate-200/90 shadow-sm p-5 space-y-4 hover:border-brand-300 transition-all flex flex-col justify-between">
              
              <div class="space-y-3">
                <div class="flex items-start justify-between gap-2">
                  <div>
                    <span class="text-[10px] font-bold uppercase tracking-wider text-brand-700 bg-brand-50 px-2 py-0.5 rounded">${item.category}</span>
                    <h3 class="font-heading font-extrabold text-base text-slate-900 mt-1">${item.commodity}</h3>
                  </div>

                  <span class="inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-xs font-bold ${item.trend === 'up' ? 'bg-emerald-100 text-emerald-800' : 'bg-red-100 text-red-800'}">
                    <i data-lucide="${item.trend === 'up' ? 'trending-up' : 'trending-down'}" class="w-3.5 h-3.5"></i>
                    ${item.changePercent > 0 ? '+' : ''}${item.changePercent}%
                  </span>
                </div>

                <!-- Price Comparison Box -->
                <div class="grid grid-cols-2 gap-2 bg-slate-50 p-3 rounded-2xl border border-slate-100 text-xs">
                  <div>
                    <span class="text-[10px] text-slate-400 font-medium block">Current APMC Rate</span>
                    <div class="font-extrabold text-slate-900 text-base">₹${item.currentPrice}/kg</div>
                    <span class="text-[10px] text-slate-500">Prev: ₹${item.previousPrice}/kg</span>
                  </div>

                  <div>
                    <span class="text-[10px] text-emerald-800 font-bold block">FarmConnect Direct</span>
                    <div class="font-extrabold text-brand-700 text-base">₹${item.farmConnectPrice}/kg</div>
                    <span class="text-[10px] text-emerald-600 font-bold">+100% Margin</span>
                  </div>
                </div>

                <!-- Mandi Benchmark Breakdown -->
                <div class="space-y-1.5 text-xs">
                  <div class="flex justify-between text-slate-600">
                    <span class="text-slate-400">Local Mandi:</span>
                    <span class="font-semibold text-slate-800">${item.localMandi}</span>
                  </div>
                  <div class="flex justify-between text-slate-600">
                    <span class="text-slate-400">Best State Mandi:</span>
                    <span class="font-semibold text-emerald-700">${item.bestMandi}</span>
                  </div>
                </div>

                <!-- Advisory Tip Box -->
                <div class="p-3 bg-emerald-50/70 rounded-xl border border-emerald-200/60 text-xs text-emerald-900 flex items-start gap-2">
                  <i data-lucide="lightbulb" class="w-4 h-4 text-emerald-600 flex-shrink-0 mt-0.5"></i>
                  <span class="text-[11px] leading-relaxed">${item.advisoryTip}</span>
                </div>
              </div>

              <!-- Action button -->
              <button 
                onclick="App.openAddProductModal()" 
                class="w-full py-2.5 bg-slate-900 hover:bg-brand-700 text-white rounded-xl text-xs font-bold flex items-center justify-center gap-1.5 transition-colors shadow-xs"
              >
                <i data-lucide="plus-circle" class="w-3.5 h-3.5 text-emerald-400"></i> List ${item.commodity.split(' ')[0]} at ₹${item.farmConnectPrice}/kg
              </button>

            </div>
          `).join('')}
        </div>

      </div>
    `;
  },

  handleSearch(val) {
    this.searchQuery = val;
    App.refreshView();
  },

  setCategory(val) {
    this.categoryFilter = val;
    App.refreshView();
  }
};
