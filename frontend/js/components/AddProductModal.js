/**
 * AddProductModal Component (Farmer Crop Listing Form)
 */

const AddProductModal = {
  selectedPresetImage: "https://images.unsplash.com/photo-1592924357228-91a4daadcfea?w=600&auto=format&fit=crop&q=80",
  
  presetImages: [
    { label: "Tomato", url: "https://images.unsplash.com/photo-1592924357228-91a4daadcfea?w=600&auto=format&fit=crop&q=80" },
    { label: "Onion", url: "https://images.unsplash.com/photo-1618512496248-a07fe83aa8cb?w=600&auto=format&fit=crop&q=80" },
    { label: "Potato", url: "https://images.unsplash.com/photo-1518977676601-b53f82aba655?w=600&auto=format&fit=crop&q=80" },
    { label: "Carrot", url: "https://images.unsplash.com/photo-1598170845058-32b9d6a5da37?w=600&auto=format&fit=crop&q=80" },
    { label: "Wheat", url: "https://images.unsplash.com/photo-1574323347407-f5e1ad6d020b?w=600&auto=format&fit=crop&q=80" },
    { label: "Rice", url: "https://images.unsplash.com/photo-1586201375761-83865001e31c?w=600&auto=format&fit=crop&q=80" },
    { label: "Banana", url: "https://images.unsplash.com/photo-1571771894821-ce9b6c11b08e?w=600&auto=format&fit=crop&q=80" },
    { label: "Mango", url: "https://images.unsplash.com/photo-1553279768-865429fa0078?w=600&auto=format&fit=crop&q=80" },
    { label: "Capsicum", url: "https://images.unsplash.com/photo-1563565375-f3fdfdbefa83?w=600&auto=format&fit=crop&q=80" },
    { label: "Milk", url: "https://images.unsplash.com/photo-1550583724-b2692b85b150?w=600&auto=format&fit=crop&q=80" },
    { label: "Honey", url: "https://images.unsplash.com/photo-1587049352846-4a222e784d38?w=600&auto=format&fit=crop&q=80" },
    { label: "Turmeric", url: "https://images.unsplash.com/photo-1615485290382-441e4d049cb5?w=600&auto=format&fit=crop&q=80" }
  ],

  render() {
    const user = StorageManager.getUser();
    const today = new Date().toISOString().split("T")[0];

    return `
      <div id="add-product-modal" class="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-slate-900/60 backdrop-blur-sm animate-fade-in overflow-y-auto">
        <div class="bg-white rounded-3xl shadow-2xl border border-slate-100 max-w-2xl w-full overflow-hidden animate-slide-up relative my-8">
          
          <!-- Close Button -->
          <button 
            onclick="App.closeAddProductModal()" 
            class="absolute top-4 right-4 p-2.5 rounded-full text-slate-400 hover:text-slate-700 hover:bg-slate-100 z-10 transition-colors"
          >
            <i data-lucide="x" class="w-5 h-5"></i>
          </button>

          <!-- Top Header -->
          <div class="bg-gradient-to-r from-brand-800 via-brand-700 to-emerald-800 text-white p-6 relative">
            <div class="flex items-center gap-2 mb-1">
              <span class="px-2.5 py-0.5 rounded-full text-[10px] font-bold bg-white/20 uppercase tracking-wider">Farmer Tool</span>
              <span class="text-xs text-emerald-200">• Direct to Marketplace</span>
            </div>
            <h2 class="text-2xl font-bold font-heading text-white">Publish New Agricultural Produce</h2>
            <p class="text-emerald-100 text-xs mt-1">List your farm crop directly to buyers with transparent price and zero intermediary fees.</p>
          </div>

          <!-- Form Body -->
          <form onsubmit="AddProductModal.handleSubmit(event)" class="p-6 space-y-4 max-h-[70vh] overflow-y-auto">
            
            <!-- Image Picker with Presets & URL -->
            <div>
              <label class="block text-xs font-bold text-slate-800 mb-1.5">Crop Photo Selection</label>
              
              <div class="flex items-center gap-3 mb-2">
                <img 
                  id="add-prod-preview" 
                  src="${this.selectedPresetImage}" 
                  alt="Crop Preview" 
                  class="w-16 h-16 rounded-xl object-cover border-2 border-brand-500 shadow-sm flex-shrink-0"
                />
                <div class="flex-1 space-y-1">
                  <span class="text-[11px] text-slate-500 font-medium block">Quick Pick Produce Preset:</span>
                  <div class="flex flex-wrap gap-1.5 max-h-20 overflow-y-auto p-1 bg-slate-50 rounded-xl border border-slate-200">
                    ${this.presetImages.map(img => `
                      <button 
                        type="button"
                        onclick="AddProductModal.setPresetImage('${img.url}')" 
                        class="px-2 py-1 text-[11px] font-semibold bg-white hover:bg-brand-50 hover:text-brand-700 text-slate-700 rounded-md border border-slate-200 transition-colors"
                      >
                        ${img.label}
                      </button>
                    `).join('')}
                  </div>
                </div>
              </div>

              <div>
                <input 
                  type="url" 
                  id="add-prod-image" 
                  value="${this.selectedPresetImage}" 
                  oninput="document.getElementById('add-prod-preview').src = this.value" 
                  placeholder="Or paste custom image URL" 
                  class="w-full px-3 py-2 text-xs bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-brand-500"
                />
              </div>
            </div>

            <!-- Product Name & Category -->
            <div class="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <div>
                <label class="block text-xs font-bold text-slate-800 mb-1">Crop / Product Name *</label>
                <input 
                  type="text" 
                  id="add-prod-name" 
                  required 
                  placeholder="e.g. Fresh Organic Tomatoes" 
                  class="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-brand-500 focus:bg-white"
                />
              </div>

              <div>
                <label class="block text-xs font-bold text-slate-800 mb-1">Category *</label>
                <select 
                  id="add-prod-category" 
                  required 
                  class="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-brand-500 focus:bg-white"
                >
                  <option value="Vegetables">Vegetables (सब्जियां)</option>
                  <option value="Fruits">Fruits (फल)</option>
                  <option value="Grains & Cereals">Grains & Cereals (अनाज)</option>
                  <option value="Pulses & Legumes">Pulses & Legumes (दालें)</option>
                  <option value="Dairy & Organic">Dairy & Organic (दूध व जैविक)</option>
                  <option value="Spices & Herbs">Spices & Herbs (मसाले)</option>
                </select>
              </div>
            </div>

            <!-- Quantity, Unit, Price, Min Order -->
            <div class="grid grid-cols-2 sm:grid-cols-4 gap-2.5">
              <div>
                <label class="block text-xs font-bold text-slate-800 mb-1">Available Qty *</label>
                <input 
                  type="number" 
                  id="add-prod-quantity" 
                  required 
                  min="1" 
                  value="100" 
                  placeholder="e.g. 500" 
                  class="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-brand-500"
                />
              </div>

              <div>
                <label class="block text-xs font-bold text-slate-800 mb-1">Unit *</label>
                <select 
                  id="add-prod-unit" 
                  required 
                  class="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-brand-500"
                >
                  <option value="kg">kg (किलो)</option>
                  <option value="quintal">quintal (क्विंटल)</option>
                  <option value="crate">crate (क्रेट)</option>
                  <option value="dozen">dozen (दर्जन)</option>
                  <option value="ton">ton (टन)</option>
                  <option value="liter">liter (लीटर)</option>
                </select>
              </div>

              <div>
                <label class="block text-xs font-bold text-slate-800 mb-1">Price (₹/Unit) *</label>
                <input 
                  type="number" 
                  id="add-prod-price" 
                  required 
                  min="1" 
                  value="35" 
                  placeholder="e.g. 35" 
                  class="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-sm font-bold text-emerald-800 focus:outline-none focus:ring-2 focus:ring-brand-500"
                />
              </div>

              <div>
                <label class="block text-xs font-bold text-slate-800 mb-1">Min Order Qty</label>
                <input 
                  type="number" 
                  id="add-prod-min-qty" 
                  min="1" 
                  value="5" 
                  placeholder="e.g. 5" 
                  class="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-brand-500"
                />
              </div>
            </div>

            <!-- Harvest Date & Location -->
            <div class="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <div>
                <label class="block text-xs font-bold text-slate-800 mb-1">Harvest Date *</label>
                <input 
                  type="date" 
                  id="add-prod-harvest-date" 
                  required 
                  value="${today}" 
                  class="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-brand-500"
                />
              </div>

              <div>
                <label class="block text-xs font-bold text-slate-800 mb-1">Farm Origin / Location *</label>
                <input 
                  type="text" 
                  id="add-prod-location" 
                  required 
                  value="${user.location || 'Nashik, Maharashtra'}" 
                  placeholder="e.g. Nashik, Maharashtra" 
                  class="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-brand-500"
                />
              </div>
            </div>

            <!-- Organic Toggle & Certificate -->
            <div class="p-3.5 bg-emerald-50/80 rounded-2xl border border-emerald-200 space-y-2">
              <label class="flex items-center justify-between cursor-pointer">
                <span class="text-xs font-bold text-emerald-900 flex items-center gap-1.5">
                  <i data-lucide="leaf" class="w-4 h-4 text-emerald-600"></i> Is this 100% Certified Organic produce?
                </span>
                <input 
                  type="checkbox" 
                  id="add-prod-organic" 
                  checked 
                  class="w-4 h-4 text-brand-600 rounded focus:ring-brand-500 cursor-pointer"
                />
              </label>
              <input 
                type="text" 
                id="add-prod-cert" 
                placeholder="Organic Certification Tag (e.g. Jaivik Bharat / NPOP)" 
                value="Jaivik Bharat & NPOP Organic Certified" 
                class="w-full px-3 py-1.5 bg-white border border-emerald-200 rounded-lg text-xs text-slate-700 focus:outline-none focus:ring-2 focus:ring-brand-500"
              />
            </div>

            <!-- Description -->
            <div>
              <label class="block text-xs font-bold text-slate-800 mb-1">Crop Description & Quality Notes</label>
              <textarea 
                id="add-prod-desc" 
                rows="3" 
                placeholder="Describe variety, freshness, taste, and natural farming practices..." 
                class="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs sm:text-sm focus:outline-none focus:ring-2 focus:ring-brand-500 focus:bg-white"
              >Freshly harvested produce cultivated with zero synthetic chemical pesticides and organic compost. Graded for premium quality.</textarea>
            </div>

            <!-- Submit Button -->
            <button 
              type="submit" 
              class="w-full py-3.5 bg-gradient-to-r from-brand-600 to-emerald-700 hover:from-brand-700 hover:to-emerald-800 text-white font-bold text-sm rounded-2xl shadow-farm shadow-brand-600/30 transition-all transform active:scale-98 flex items-center justify-center gap-2 mt-4"
            >
              <i data-lucide="check-circle" class="w-5 h-5"></i>
              <span>Publish Produce to Marketplace</span>
            </button>

          </form>

        </div>
      </div>
    `;
  },

  setPresetImage(url) {
    this.selectedPresetImage = url;
    const imgEl = document.getElementById("add-prod-preview");
    const inputEl = document.getElementById("add-prod-image");
    if (imgEl) imgEl.src = url;
    if (inputEl) inputEl.value = url;
  },

  handleSubmit(e) {
    e.preventDefault();
    const name = document.getElementById("add-prod-name").value.trim();
    const category = document.getElementById("add-prod-category").value;
    const quantity = Number(document.getElementById("add-prod-quantity").value);
    const unit = document.getElementById("add-prod-unit").value;
    const price = Number(document.getElementById("add-prod-price").value);
    const minOrderQty = Number(document.getElementById("add-prod-min-qty").value) || 1;
    const harvestDate = document.getElementById("add-prod-harvest-date").value;
    const location = document.getElementById("add-prod-location").value.trim();
    const isOrganic = document.getElementById("add-prod-organic").checked;
    const organicCert = document.getElementById("add-prod-cert").value.trim();
    const description = document.getElementById("add-prod-desc").value.trim();
    const image = document.getElementById("add-prod-image").value.trim() || this.selectedPresetImage;

    const product = StorageManager.addProduct({
      name,
      category,
      availableQty: quantity,
      unit,
      price,
      minOrderQty,
      harvestDate,
      location,
      isOrganic,
      organicCert: isOrganic ? organicCert : "APMC Standard Graded",
      description,
      image,
      freshness: "Harvested Today"
    });

    Toast.show(`Successfully published "${product.name}"! Now available on Marketplace. 🌾`, "success");
    App.closeAddProductModal();
    App.navigate("marketplace");
  }
};
