/**
 * ProfileView Component (User Profile, Farm Details, Bank Settings, Multilingual & Support)
 */

const ProfileView = {
  render(state) {
    const user = state.currentUser;
    const isFarmer = user.role === "farmer";
    const currentLang = StorageManager.getLanguage();

    return `
      <div class="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-6 md:py-8 space-y-6 animate-fade-in">
        
        <!-- Profile Header Card -->
        <div class="bg-white rounded-3xl border border-slate-200 p-6 sm:p-8 shadow-sm relative overflow-hidden">
          <div class="flex flex-col sm:flex-row items-center sm:items-start gap-5 text-center sm:text-left">
            <div class="relative">
              <img 
                src="${user.avatar}" 
                alt="${user.name}" 
                class="w-24 h-24 sm:w-28 sm:h-28 rounded-full object-cover ring-4 ring-emerald-500/30 shadow-md"
              />
              <span class="absolute bottom-1 right-1 w-6 h-6 bg-brand-600 text-white rounded-full flex items-center justify-center text-xs shadow-sm">
                <i data-lucide="check" class="w-3.5 h-3.5"></i>
              </span>
            </div>

            <div class="flex-1 space-y-1.5">
              <div class="flex flex-wrap items-center justify-center sm:justify-start gap-2">
                <h1 class="text-2xl font-extrabold font-heading text-slate-900">${user.name}</h1>
                <span class="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-xs font-bold ${isFarmer ? 'bg-amber-100 text-amber-800' : 'bg-blue-100 text-blue-800'}">
                  ${isFarmer ? '🌾 Verified Farmer' : '🛒 Registered Buyer'}
                </span>
              </div>

              ${isFarmer ? `
                <p class="text-sm font-bold text-emerald-800">${user.farmName || 'Patil Organic Agri Farms'}</p>
              ` : ''}

              <p class="text-xs text-slate-500 flex items-center justify-center sm:justify-start gap-1">
                <i data-lucide="map-pin" class="w-3.5 h-3.5 text-emerald-600"></i> ${user.location}
              </p>

              <p class="text-xs text-slate-600 max-w-xl pt-1">
                ${user.bio || 'Direct registered user on FarmConnect supporting ethical agriculture and zero-middlemen food supply chain.'}
              </p>
            </div>

            <button 
              onclick="ProfileView.openEditProfileModal()" 
              class="px-4 py-2 bg-slate-100 hover:bg-slate-200 text-slate-800 rounded-xl font-bold text-xs flex items-center gap-1.5 transition-colors flex-shrink-0"
            >
              <i data-lucide="edit-3" class="w-3.5 h-3.5"></i> Edit Profile
            </button>
          </div>

          <!-- Farmer Stats Banner -->
          ${isFarmer ? `
            <div class="grid grid-cols-2 sm:grid-cols-4 gap-3 mt-6 pt-6 border-t border-slate-100 text-center">
              <div class="p-3 bg-emerald-50/60 rounded-2xl border border-emerald-100">
                <span class="text-[10px] text-emerald-800 font-bold uppercase tracking-wider block">Kisan Rating</span>
                <span class="text-lg font-extrabold text-slate-900 flex items-center justify-center gap-1 mt-0.5">
                  <i data-lucide="star" class="w-4 h-4 fill-amber-400 text-amber-400"></i> ${user.rating || '4.9'}
                </span>
              </div>
              <div class="p-3 bg-emerald-50/60 rounded-2xl border border-emerald-100">
                <span class="text-[10px] text-emerald-800 font-bold uppercase tracking-wider block">Farming Exp</span>
                <span class="text-lg font-extrabold text-slate-900 mt-0.5 block">${user.experienceYears || 16} Years</span>
              </div>
              <div class="p-3 bg-emerald-50/60 rounded-2xl border border-emerald-100">
                <span class="text-[10px] text-emerald-800 font-bold uppercase tracking-wider block">Produce Sold</span>
                <span class="text-lg font-extrabold text-slate-900 mt-0.5 block">${user.totalCropsSold || '1,420 Q'}</span>
              </div>
              <div class="p-3 bg-emerald-50/60 rounded-2xl border border-emerald-100">
                <span class="text-[10px] text-emerald-800 font-bold uppercase tracking-wider block">Govt Kisan Card</span>
                <span class="text-xs font-bold text-emerald-900 mt-1 block">${user.kisanCardNumber || 'MH-NSK-8841'}</span>
              </div>
            </div>
          ` : ''}

        </div>

        <!-- Language Preference Section -->
        <div class="bg-white rounded-3xl border border-slate-200 p-6 shadow-sm space-y-3">
          <div class="flex items-center justify-between">
            <h3 class="font-heading font-bold text-base text-slate-900 flex items-center gap-2">
              <i data-lucide="globe" class="w-4 h-4 text-brand-600"></i> Language & Region (भाषा निवडा)
            </h3>
            <span class="text-xs font-bold text-brand-700 bg-brand-50 px-2.5 py-1 rounded-lg">Instant UI Translation</span>
          </div>

          <div class="grid grid-cols-2 sm:grid-cols-3 gap-2.5 pt-1">
            ${[
              { id: "en", label: "English", flag: "🇬🇧" },
              { id: "hi", label: "हिन्दी (Hindi)", flag: "🇮🇳" },
              { id: "mr", label: "मराठी (Marathi)", flag: "🌾" },
              { id: "te", label: "తెలుగు (Telugu)", flag: "🇮🇳" },
              { id: "ta", label: "தமிழ் (Tamil)", flag: "🇮🇳" },
              { id: "pa", label: "ਪੰਜਾਬੀ (Punjabi)", flag: "🌾" }
            ].map(lang => `
              <button 
                onclick="App.changeLanguage('${lang.id}')" 
                class="p-3 rounded-2xl border text-left flex items-center gap-2.5 transition-all ${currentLang === lang.id ? 'border-brand-600 bg-brand-50 text-brand-800 ring-2 ring-brand-500 font-bold' : 'border-slate-200 bg-slate-50 hover:bg-slate-100 text-slate-700 font-semibold text-xs'}"
              >
                <span class="text-base">${lang.flag}</span>
                <span class="text-xs">${lang.label}</span>
              </button>
            `).join('')}
          </div>
        </div>

        <!-- Help & Kisan Support Section -->
        <div class="bg-white rounded-3xl border border-slate-200 p-6 shadow-sm space-y-4">
          <h3 class="font-heading font-bold text-base text-slate-900 flex items-center gap-2">
            <i data-lucide="help-circle" class="w-4 h-4 text-emerald-600"></i> Help & Kisan Toll-Free Advisory
          </h3>

          <div class="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div class="p-4 bg-emerald-50 rounded-2xl border border-emerald-200 space-y-1.5">
              <span class="text-xs font-bold text-emerald-900 flex items-center gap-1.5">
                <i data-lucide="phone-call" class="w-4 h-4 text-emerald-700"></i> Kisan Call Center (Toll Free)
              </span>
              <p class="text-lg font-extrabold text-emerald-950 font-heading">1800-180-1551</p>
              <p class="text-[11px] text-emerald-800">Free 24/7 crop advisory & mandi consultation from agricultural scientists.</p>
            </div>

            <div class="p-4 bg-blue-50 rounded-2xl border border-blue-200 space-y-1.5">
              <span class="text-xs font-bold text-blue-900 flex items-center gap-1.5">
                <i data-lucide="shield-check" class="w-4 h-4 text-blue-700"></i> Direct Escrow Support
              </span>
              <p class="text-lg font-extrabold text-blue-950 font-heading">support@farmconnect.in</p>
              <p class="text-[11px] text-blue-800">Instant resolution for dispute settlement, transport booking, and payments.</p>
            </div>
          </div>
        </div>

        <!-- Quick Switch Role & Reset Demo Data Box -->
        <div class="p-6 bg-slate-100 rounded-3xl border border-slate-200 flex flex-col sm:flex-row items-center justify-between gap-4">
          <div>
            <h4 class="font-bold text-sm text-slate-900">Prototype Demo Settings</h4>
            <p class="text-xs text-slate-500">Easily toggle between farmer and buyer roles, or reset all mock data to factory state.</p>
          </div>

          <div class="flex items-center gap-2 flex-shrink-0">
            <button 
              onclick="App.toggleRole()" 
              class="px-4 py-2.5 bg-white hover:bg-slate-50 text-slate-800 border border-slate-300 rounded-xl font-bold text-xs shadow-xs"
            >
              Switch Role (${isFarmer ? 'Buyer' : 'Farmer'})
            </button>

            <button 
              onclick="App.resetDemoData()" 
              class="px-4 py-2.5 bg-amber-500 hover:bg-amber-600 text-white rounded-xl font-bold text-xs shadow-xs"
            >
              Reset Demo
            </button>
          </div>
        </div>

      </div>
    `;
  },

  openEditProfileModal() {
    const user = StorageManager.getUser();

    const modalHtml = `
      <div id="edit-profile-modal" class="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-sm animate-fade-in">
        <div class="bg-white rounded-3xl shadow-2xl border border-slate-100 max-w-md w-full overflow-hidden animate-slide-up p-6 space-y-4 relative">
          <button onclick="document.getElementById('edit-profile-modal').remove()" class="absolute top-4 right-4 text-slate-400 hover:text-slate-600 p-2">
            <i data-lucide="x" class="w-5 h-5"></i>
          </button>

          <h3 class="font-heading font-bold text-xl text-slate-900">Edit Profile Details</h3>

          <form onsubmit="ProfileView.handleSaveProfile(event)" class="space-y-3">
            <div>
              <label class="block text-xs font-bold text-slate-700 mb-1">Full Name</label>
              <input type="text" id="edit-user-name" value="${user.name}" required class="w-full px-3.5 py-2 bg-slate-50 border border-slate-200 rounded-xl text-sm focus:ring-2 focus:ring-brand-500" />
            </div>

            <div>
              <label class="block text-xs font-bold text-slate-700 mb-1">Phone Number</label>
              <input type="text" id="edit-user-phone" value="${user.phone || ''}" required class="w-full px-3.5 py-2 bg-slate-50 border border-slate-200 rounded-xl text-sm focus:ring-2 focus:ring-brand-500" />
            </div>

            <div>
              <label class="block text-xs font-bold text-slate-700 mb-1">Location / District</label>
              <input type="text" id="edit-user-location" value="${user.location || ''}" required class="w-full px-3.5 py-2 bg-slate-50 border border-slate-200 rounded-xl text-sm focus:ring-2 focus:ring-brand-500" />
            </div>

            <div>
              <label class="block text-xs font-bold text-slate-700 mb-1">Bio / Farming Practices</label>
              <textarea id="edit-user-bio" rows="3" class="w-full px-3.5 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs">${user.bio || ''}</textarea>
            </div>

            <button type="submit" class="w-full py-3 bg-brand-600 hover:bg-brand-700 text-white font-bold text-sm rounded-xl shadow-farm">
              Save Changes
            </button>
          </form>
        </div>
      </div>
    `;

    const el = document.createElement("div");
    el.innerHTML = modalHtml;
    document.body.appendChild(el.firstElementChild);
    if (window.lucide) lucide.createIcons();
  },

  handleSaveProfile(e) {
    e.preventDefault();
    const user = StorageManager.getUser();
    user.name = document.getElementById("edit-user-name").value.trim();
    user.phone = document.getElementById("edit-user-phone").value.trim();
    user.location = document.getElementById("edit-user-location").value.trim();
    user.bio = document.getElementById("edit-user-bio").value.trim();

    StorageManager.setUser(user);
    const modal = document.getElementById("edit-profile-modal");
    if (modal) modal.remove();

    Toast.show("Profile updated successfully! ✨", "success");
    App.refreshView();
  }
};
