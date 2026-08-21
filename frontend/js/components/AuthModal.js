/**
 * AuthModal Component (Login & Registration with Demo Accounts)
 */

const AuthModal = {
  currentTab: "login", // 'login' or 'register'
  selectedRole: "farmer", // 'farmer' or 'buyer'

  render() {
    return `
      <div id="auth-modal" class="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-sm animate-fade-in">
        <div class="bg-white rounded-3xl shadow-2xl border border-slate-100 max-w-md w-full overflow-hidden animate-slide-up relative">
          
          <!-- Close Button -->
          <button 
            onclick="App.closeAuthModal()" 
            class="absolute top-4 right-4 p-2 rounded-full text-slate-400 hover:text-slate-700 hover:bg-slate-100 z-10 transition-colors"
          >
            <i data-lucide="x" class="w-5 h-5"></i>
          </button>

          <!-- Top Header Banner -->
          <div class="bg-gradient-to-br from-brand-700 via-brand-600 to-emerald-800 text-white p-6 sm:p-7 relative overflow-hidden">
            <div class="absolute -right-8 -bottom-8 w-32 h-32 bg-white/10 rounded-full blur-xl pointer-events-none"></div>
            <div class="flex items-center gap-2 mb-2">
              <div class="w-8 h-8 rounded-xl bg-white/20 flex items-center justify-center">
                <i data-lucide="sprout" class="w-5 h-5 text-white"></i>
              </div>
              <span class="font-heading font-bold text-lg tracking-tight">FarmConnect</span>
            </div>
            <h2 class="text-2xl font-bold font-heading">Empowering Indian Farmers</h2>
            <p class="text-emerald-100 text-xs mt-1">Direct market link • Fair prices • Zero middleman commission</p>
          </div>

          <!-- Quick Demo One-Click Login Box -->
          <div class="bg-amber-50/80 border-b border-amber-200/80 p-4">
            <div class="flex items-center justify-between mb-2">
              <span class="text-xs font-bold text-amber-900 flex items-center gap-1.5">
                <i data-lucide="zap" class="w-3.5 h-3.5 text-amber-600"></i> Fast Demo Instant Login:
              </span>
              <span class="text-[10px] text-amber-700 font-medium">Click to test role</span>
            </div>
            <div class="grid grid-cols-2 gap-2">
              <button 
                onclick="AuthModal.loginAsDemo('farmer')" 
                class="flex items-center justify-center gap-1.5 py-2 px-3 bg-white hover:bg-amber-100 text-amber-900 border border-amber-300 rounded-xl text-xs font-bold shadow-sm transition-all transform active:scale-95"
              >
                <span>🌾 Login as Farmer</span>
              </button>
              <button 
                onclick="AuthModal.loginAsDemo('buyer')" 
                class="flex items-center justify-center gap-1.5 py-2 px-3 bg-white hover:bg-blue-100 text-blue-900 border border-blue-300 rounded-xl text-xs font-bold shadow-sm transition-all transform active:scale-95"
              >
                <span>🛒 Login as Buyer</span>
              </button>
            </div>
            <div class="mt-2 text-[10px] text-slate-500 text-center">
              Credentials: <code class="bg-amber-100/70 px-1 py-0.5 rounded text-amber-900">farmer@farmconnect.com</code> / <code class="bg-amber-100/70 px-1 py-0.5 rounded text-amber-900">farmer123</code>
            </div>
          </div>

          <!-- Tab Selection (Login / Register) -->
          <div class="p-6">
            <div class="flex border-b border-slate-200 mb-5">
              <button 
                onclick="AuthModal.switchTab('login')" 
                class="flex-1 pb-3 text-sm font-bold text-center border-b-2 transition-colors ${this.currentTab === 'login' ? 'border-brand-600 text-brand-600' : 'border-transparent text-slate-500 hover:text-slate-700'}"
              >
                Login
              </button>
              <button 
                onclick="AuthModal.switchTab('register')" 
                class="flex-1 pb-3 text-sm font-bold text-center border-b-2 transition-colors ${this.currentTab === 'register' ? 'border-brand-600 text-brand-600' : 'border-transparent text-slate-500 hover:text-slate-700'}"
              >
                Register New Account
              </button>
            </div>

            <!-- Role Selector Toggle -->
            <div class="mb-4">
              <label class="block text-xs font-bold text-slate-700 mb-1.5">I am registering/logging in as:</label>
              <div class="grid grid-cols-2 gap-2 p-1 bg-slate-100 rounded-xl">
                <button 
                  type="button"
                  onclick="AuthModal.setRole('farmer')" 
                  class="py-2 text-xs font-bold rounded-lg transition-all flex items-center justify-center gap-1.5 ${this.selectedRole === 'farmer' ? 'bg-white text-emerald-800 shadow-sm border border-emerald-200' : 'text-slate-600 hover:text-slate-900'}"
                >
                  <i data-lucide="tractor" class="w-3.5 h-3.5"></i> Farmer / Producer
                </button>
                <button 
                  type="button"
                  onclick="AuthModal.setRole('buyer')" 
                  class="py-2 text-xs font-bold rounded-lg transition-all flex items-center justify-center gap-1.5 ${this.selectedRole === 'buyer' ? 'bg-white text-blue-800 shadow-sm border border-blue-200' : 'text-slate-600 hover:text-slate-900'}"
                >
                  <i data-lucide="shopping-cart" class="w-3.5 h-3.5"></i> Customer / Buyer
                </button>
              </div>
            </div>

            <!-- Form Body -->
            ${this.currentTab === "login" ? this.renderLoginForm() : this.renderRegisterForm()}

          </div>

        </div>
      </div>
    `;
  },

  renderLoginForm() {
    const isFarmer = this.selectedRole === "farmer";
    const defaultEmail = isFarmer ? "farmer@farmconnect.com" : "buyer@farmconnect.com";
    const defaultPass = isFarmer ? "farmer123" : "buyer123";

    return `
      <form onsubmit="AuthModal.handleLogin(event)" class="space-y-3.5">
        <div>
          <label class="block text-xs font-semibold text-slate-700 mb-1">Email Address or Mobile Number</label>
          <div class="relative">
            <i data-lucide="mail" class="w-4 h-4 text-slate-400 absolute left-3 top-3"></i>
            <input 
              type="text" 
              id="auth-login-email" 
              value="${defaultEmail}" 
              required 
              placeholder="e.g. farmer@farmconnect.com or 9823456789" 
              class="w-full pl-9 pr-3 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-brand-500 focus:bg-white transition-all"
            />
          </div>
        </div>

        <div>
          <label class="block text-xs font-semibold text-slate-700 mb-1">Password</label>
          <div class="relative">
            <i data-lucide="lock" class="w-4 h-4 text-slate-400 absolute left-3 top-3"></i>
            <input 
              type="password" 
              id="auth-login-password" 
              value="${defaultPass}" 
              required 
              placeholder="Enter your password" 
              class="w-full pl-9 pr-3 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-brand-500 focus:bg-white transition-all"
            />
          </div>
        </div>

        <div class="flex items-center justify-between text-xs text-slate-500 pt-1">
          <label class="flex items-center gap-1.5 cursor-pointer">
            <input type="checkbox" checked class="rounded text-brand-600 focus:ring-brand-500" />
            <span>Remember me</span>
          </label>
          <a href="javascript:void(0)" onclick="Toast.show('Demo password reset link sent to registered mobile.', 'info')" class="text-brand-600 hover:underline">Forgot password?</a>
        </div>

        <button 
          type="submit" 
          class="w-full py-3 bg-gradient-to-r from-brand-600 to-emerald-700 hover:from-brand-700 hover:to-emerald-800 text-white font-bold text-sm rounded-xl shadow-farm shadow-brand-600/30 transition-all transform active:scale-98 flex items-center justify-center gap-2"
        >
          <i data-lucide="log-in" class="w-4 h-4"></i>
          <span>Login to FarmConnect</span>
        </button>
      </form>
    `;
  },

  renderRegisterForm() {
    const isFarmer = this.selectedRole === "farmer";

    return `
      <form onsubmit="AuthModal.handleRegister(event)" class="space-y-3">
        <div>
          <label class="block text-xs font-semibold text-slate-700 mb-1">Full Name</label>
          <input 
            type="text" 
            id="auth-reg-name" 
            required 
            placeholder="e.g. Rajesh Kumar" 
            class="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-brand-500"
          />
        </div>

        ${isFarmer ? `
          <div>
            <label class="block text-xs font-semibold text-slate-700 mb-1">Farm / Orchard Name</label>
            <input 
              type="text" 
              id="auth-reg-farmname" 
              placeholder="e.g. Krishna Agro & Organic Farm" 
              class="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-brand-500"
            />
          </div>
        ` : ''}

        <div class="grid grid-cols-2 gap-2">
          <div>
            <label class="block text-xs font-semibold text-slate-700 mb-1">Mobile Number</label>
            <input 
              type="tel" 
              id="auth-reg-phone" 
              required 
              placeholder="98765 43210" 
              class="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-brand-500"
            />
          </div>
          <div>
            <label class="block text-xs font-semibold text-slate-700 mb-1">Location / District</label>
            <input 
              type="text" 
              id="auth-reg-location" 
              required 
              placeholder="e.g. Pune, MH" 
              class="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-brand-500"
            />
          </div>
        </div>

        <div>
          <label class="block text-xs font-semibold text-slate-700 mb-1">Email Address</label>
          <input 
            type="email" 
            id="auth-reg-email" 
            required 
            placeholder="user@example.com" 
            class="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-brand-500"
          />
        </div>

        <div>
          <label class="block text-xs font-semibold text-slate-700 mb-1">Create Password</label>
          <input 
            type="password" 
            id="auth-reg-password" 
            required 
            placeholder="At least 6 characters" 
            class="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-brand-500"
          />
        </div>

        <button 
          type="submit" 
          class="w-full py-3 bg-gradient-to-r from-brand-600 to-emerald-700 hover:from-brand-700 hover:to-emerald-800 text-white font-bold text-sm rounded-xl shadow-farm transition-all transform active:scale-98 flex items-center justify-center gap-2 mt-2"
        >
          <i data-lucide="user-plus" class="w-4 h-4"></i>
          <span>Create ${isFarmer ? 'Farmer' : 'Buyer'} Account</span>
        </button>
      </form>
    `;
  },

  switchTab(tab) {
    this.currentTab = tab;
    App.refreshModal();
  },

  setRole(role) {
    this.selectedRole = role;
    App.refreshModal();
  },

  loginAsDemo(role) {
    const user = StorageManager.switchDemoRole(role);
    Toast.show(`Logged in successfully as ${role === 'farmer' ? 'Farmer (' + user.name + ')' : 'Buyer (' + user.name + ')'}!`, "success");
    App.closeAuthModal();
    if (role === "farmer") {
      App.navigate("dashboard");
    } else {
      App.navigate("marketplace");
    }
  },

  handleLogin(e) {
    e.preventDefault();
    const email = document.getElementById("auth-login-email").value.trim();
    const role = this.selectedRole;
    const user = StorageManager.switchDemoRole(role);
    Toast.show(`Welcome back, ${user.name}!`, "success");
    App.closeAuthModal();
    App.navigate(role === "farmer" ? "dashboard" : "marketplace");
  },

  handleRegister(e) {
    e.preventDefault();
    const name = document.getElementById("auth-reg-name").value.trim();
    const email = document.getElementById("auth-reg-email").value.trim();
    const phone = document.getElementById("auth-reg-phone").value.trim();
    const location = document.getElementById("auth-reg-location").value.trim();
    const farmName = document.getElementById("auth-reg-farmname")?.value.trim() || `${name}'s Agro Farm`;
    const role = this.selectedRole;

    const newUser = {
      id: "usr_" + Date.now(),
      role: role,
      name: name,
      email: email,
      phone: phone,
      location: location,
      avatar: "https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=200&auto=format&fit=crop&q=80",
      farmName: farmName,
      isVerified: true,
      rating: 5.0,
      totalRatings: 1,
      totalCropsSold: "0 Quintals",
      deliveryAddress: {
        fullName: name,
        phone: phone,
        street: location,
        city: location.split(",")[0] || location,
        state: "Maharashtra",
        pincode: "411001",
        landmark: "Near Main Market"
      }
    };

    StorageManager.setUser(newUser);
    Toast.show(`Account created! Welcome, ${name}.`, "success");
    App.closeAuthModal();
    App.navigate(role === "farmer" ? "dashboard" : "marketplace");
  }
};
