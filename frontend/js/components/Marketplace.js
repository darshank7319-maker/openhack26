/**
 * Marketplace Component (Search, Filter, Product Grid)
 */

const Marketplace = {
  searchQuery: "",
  selectedCategory: "All",
  onlyOrganic: false,
  sortBy: "default", // 'default', 'price_asc', 'price_desc', 'rating', 'freshness'

  categories: [
    { id: "All", label: "filterAll", icon: "layout-grid" },
    { id: "Vegetables", label: "filterVeg", icon: "carrot" },
    { id: "Fruits", label: "filterFruits", icon: "apple" },
    { id: "Grains & Cereals", label: "filterGrains", icon: "wheat" },
    { id: "Dairy & Organic", label: "filterDairy", icon: "milk" },
    { id: "Spices & Herbs", label: "filterSpices", icon: "sparkles" }
  ],

  render(state) {
    let filtered = [...state.products];

    // Search filter
    if (this.searchQuery.trim()) {
      const q = this.searchQuery.toLowerCase().trim();
      filtered = filtered.filter(p => 
        p.name.toLowerCase().includes(q) || 
        p.category.toLowerCase().includes(q) || 
        p.farmerName.toLowerCase().includes(q) || 
        p.location.toLowerCase().includes(q)
      );
    }

    // Category filter
    if (this.selectedCategory !== "All") {
      filtered = filtered.filter(p => p.category === this.selectedCategory);
    }

    // Organic toggle
    if (this.onlyOrganic) {
      filtered = filtered.filter(p => p.isOrganic);
    }

    // Sorting
    if (this.sortBy === "price_asc") {
      filtered.sort((a, b) => a.price - b.price);
    } else if (this.sortBy === "price_desc") {
      filtered.sort((a, b) => b.price - a.price);
    } else if (this.sortBy === "rating") {
      filtered.sort((a, b) => (b.rating || 0) - (a.rating || 0));
    } else if (this.sortBy === "freshness") {
      filtered.sort((a, b) => new Date(b.harvestDate) - new Date(a.harvestDate));
    }

    return `
      <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6 md:py-8 space-y-6 animate-fade-in">
        
        <!-- Marketplace Hero Search Header -->
        <div class="relative rounded-3xl bg-gradient-to-r from-emerald-800 via-brand-800 to-green-900 text-white p-6 sm:p-8 shadow-farm overflow-hidden">
          <div class="relative z-10 max-w-3xl space-y-3">
            <span class="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold bg-white/15 text-emerald-200 backdrop-blur-sm">
              <i data-lucide="shield-check" class="w-3.5 h-3.5 text-emerald-300"></i> 100% Direct Farm Fresh • Guaranteed Fair Prices
            </span>
            <h1 class="text-2xl sm:text-4xl font-extrabold font-heading text-white tracking-tight">
              Direct Farmer Marketplace
            </h1>
            <p class="text-emerald-100 text-xs sm:text-sm">
              Buy directly from verified Indian farmers with full harvest transparency, zero middlemen markups, and doorstep express delivery.
            </p>

            <!-- Search Bar Input Box -->
            <div class="pt-2">
              <div class="relative flex items-center">
                <i data-lucide="search" class="w-5 h-5 text-slate-400 absolute left-4 pointer-events-none"></i>
                <input 
                  type="text" 
                  id="market-search-input" 
                  value="${this.searchQuery}" 
                  oninput="Marketplace.handleSearch(this.value)" 
                  placeholder="${StorageManager.t('searchPlaceholder')}" 
                  class="w-full pl-12 pr-10 py-3.5 bg-white text-slate-800 rounded-2xl shadow-lg text-sm sm:text-base font-medium focus:outline-none focus:ring-4 focus:ring-emerald-400/40"
                />
                ${this.searchQuery ? `
                  <button onclick="Marketplace.clearSearch()" class="absolute right-4 text-slate-400 hover:text-slate-600 p-1">
                    <i data-lucide="x" class="w-4 h-4"></i>
                  </button>
                ` : ''}
              </div>
            </div>
          </div>
        </div>

        <!-- Category Pills Filter Bar -->
        <div class="flex items-center gap-2 overflow-x-auto no-scrollbar py-1">
          ${this.categories.map(cat => `
            <button 
              onclick="Marketplace.setCategory('${cat.id}')" 
              class="flex-shrink-0 flex items-center gap-2 px-4 py-2.5 rounded-2xl text-xs sm:text-sm font-bold transition-all shadow-sm ${this.selectedCategory === cat.id ? 'bg-brand-600 text-white shadow-farm shadow-brand-600/30' : 'bg-white hover:bg-slate-100 text-slate-700 border border-slate-200'}"
            >
              <i data-lucide="${cat.icon}" class="w-4 h-4"></i>
              <span>${StorageManager.t(cat.label) || cat.id}</span>
            </button>
          `).join('')}
        </div>

        <!-- Filter Controls & Sort Bar -->
        <div class="flex flex-wrap items-center justify-between gap-3 bg-white p-3.5 sm:p-4 rounded-2xl border border-slate-200/80 shadow-sm">
          
          <div class="flex items-center gap-3">
            <!-- Organic Only Toggle -->
            <label class="flex items-center gap-2 cursor-pointer select-none">
              <input 
                type="checkbox" 
                ${this.onlyOrganic ? 'checked' : ''} 
                onchange="Marketplace.toggleOrganic(this.checked)" 
                class="w-4 h-4 text-brand-600 rounded focus:ring-brand-500 cursor-pointer"
              />
              <span class="text-xs sm:text-sm font-bold text-slate-800 flex items-center gap-1">
                <i data-lucide="leaf" class="w-3.5 h-3.5 text-emerald-600"></i> ${StorageManager.t('organic')} Only
              </span>
            </label>
          </div>

          <div class="flex items-center gap-2">
            <span class="text-xs text-slate-500 font-semibold hidden sm:inline">Sort by:</span>
            <select 
              id="market-sort-select" 
              onchange="Marketplace.setSort(this.value)" 
              class="bg-slate-100 hover:bg-slate-200/80 text-slate-700 text-xs sm:text-sm font-semibold rounded-xl px-3 py-2 border border-slate-200 focus:outline-none focus:ring-2 focus:ring-brand-500 cursor-pointer"
            >
              <option value="default" ${this.sortBy === 'default' ? 'selected' : ''}>Featured / Newest</option>
              <option value="price_asc" ${this.sortBy === 'price_asc' ? 'selected' : ''}>Price: Low to High</option>
              <option value="price_desc" ${this.sortBy === 'price_desc' ? 'selected' : ''}>Price: High to Low</option>
              <option value="rating" ${this.sortBy === 'rating' ? 'selected' : ''}>Highest Rated ★</option>
              <option value="freshness" ${this.sortBy === 'freshness' ? 'selected' : ''}>Freshly Harvested</option>
            </select>
          </div>

        </div>

        <!-- Results Counter -->
        <div class="flex items-center justify-between text-xs sm:text-sm text-slate-600 px-1">
          <span>Showing <strong class="text-slate-900 font-bold">${filtered.length}</strong> fresh agricultural products</span>
          ${this.selectedCategory !== 'All' || this.onlyOrganic || this.searchQuery ? `
            <button onclick="Marketplace.resetFilters()" class="text-brand-600 hover:text-brand-700 font-bold flex items-center gap-1">
              <i data-lucide="rotate-ccw" class="w-3.5 h-3.5"></i> Clear all filters
            </button>
          ` : ''}
        </div>

        <!-- Product Grid -->
        ${filtered.length > 0 ? `
          <div class="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 sm:gap-6">
            ${filtered.map(product => ProductCard.render(product)).join('')}
          </div>
        ` : `
          <!-- Empty State -->
          <div class="bg-white rounded-3xl border border-slate-200 p-12 text-center space-y-4 max-w-lg mx-auto">
            <div class="w-16 h-16 rounded-full bg-emerald-50 text-brand-600 flex items-center justify-center mx-auto">
              <i data-lucide="sprout" class="w-8 h-8"></i>
            </div>
            <h3 class="font-heading font-bold text-lg text-slate-900">No matching crops found</h3>
            <p class="text-xs sm:text-sm text-slate-500">
              We couldn't find any produce matching "${this.searchQuery}". Try searching for tomato, wheat, onion, or clear your filters.
            </p>
            <button 
              onclick="Marketplace.resetFilters()" 
              class="px-5 py-2.5 bg-brand-600 hover:bg-brand-700 text-white rounded-xl font-bold text-xs shadow-farm"
            >
              Show All Crops
            </button>
          </div>
        `}

      </div>
    `;
  },

  handleSearch(val) {
    this.searchQuery = val;
    App.refreshView();
  },

  clearSearch() {
    this.searchQuery = "";
    App.refreshView();
  },

  setCategory(catId) {
    this.selectedCategory = catId;
    App.refreshView();
  },

  toggleOrganic(val) {
    this.onlyOrganic = val;
    App.refreshView();
  },

  setSort(val) {
    this.sortBy = val;
    App.refreshView();
  },

  resetFilters() {
    this.searchQuery = "";
    this.selectedCategory = "All";
    this.onlyOrganic = false;
    this.sortBy = "default";
    App.refreshView();
  }
};
