/**
 * EarningsView Component (Farmer Financial Dashboard, Charts, and Payout Withdrawal)
 */

const EarningsView = {
  render(state) {
    const user = state.currentUser;
    const payouts = StorageManager.getPayouts();
    const completedPayoutsSum = payouts.reduce((sum, p) => sum + p.amount, 0);

    const todayEarnings = 2450;
    const weeklyEarnings = 14850;
    const monthlyEarnings = 58200;
    const totalLifetimeEarnings = 142600;
    const availableBalance = 18450 - (completedPayoutsSum - 11000);
    const pendingInEscrow = 3850;

    // Sample weekly revenue data for bar chart
    const weeklyData = [
      { day: "Mon", amount: 1800, height: "45%" },
      { day: "Tue", amount: 2400, height: "60%" },
      { day: "Wed", amount: 1200, height: "30%" },
      { day: "Thu", amount: 3100, height: "78%" },
      { day: "Fri", amount: 2450, height: "62%" },
      { day: "Sat", amount: 4200, height: "100%" },
      { day: "Sun", amount: 3600, height: "85%" }
    ];

    return `
      <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6 md:py-8 space-y-6 animate-fade-in">
        
        <!-- Header -->
        <div class="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-white p-6 rounded-3xl border border-slate-200 shadow-sm">
          <div>
            <div class="flex items-center gap-2 mb-1">
              <span class="px-2.5 py-0.5 rounded-full text-[10px] font-bold bg-emerald-100 text-emerald-800 uppercase tracking-wider">Direct Kisan Escrow</span>
              <span class="text-xs text-slate-500">• 0% Middleman Deduction</span>
            </div>
            <h1 class="text-2xl sm:text-3xl font-extrabold font-heading text-slate-900">
              Farmer Financial & Earnings Analytics
            </h1>
            <p class="text-xs sm:text-sm text-slate-500 mt-0.5">
              Instant settlement to <span class="font-bold text-slate-800">${user.bankDetails?.upiId || 'patil.farm@sbi'}</span> (${user.bankDetails?.bankName || 'State Bank of India'}).
            </p>
          </div>

          <button 
            onclick="EarningsView.openWithdrawModal(${availableBalance})" 
            class="px-5 py-3 rounded-2xl bg-gradient-to-r from-brand-600 to-emerald-700 hover:from-brand-700 hover:to-emerald-800 text-white font-bold text-sm shadow-farm shadow-brand-600/30 flex items-center justify-center gap-2 transform active:scale-95 transition-all flex-shrink-0"
          >
            <i data-lucide="arrow-down-circle" class="w-5 h-5"></i>
            <span>${StorageManager.t('payoutRequest')}</span>
          </button>
        </div>

        <!-- 4 Key Revenue Cards -->
        <div class="grid grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-5">
          
          <div class="glass-card rounded-2xl p-4 sm:p-5 border border-slate-200/80 bg-white">
            <span class="text-xs font-bold text-slate-500 uppercase tracking-wider block">Today's Revenue</span>
            <div class="text-2xl sm:text-3xl font-extrabold text-slate-900 font-heading mt-2">₹${todayEarnings.toLocaleString('en-IN')}</div>
            <div class="text-xs text-emerald-600 font-semibold flex items-center gap-1 mt-1">
              <i data-lucide="trending-up" class="w-3.5 h-3.5"></i> +18% vs yesterday
            </div>
          </div>

          <div class="glass-card rounded-2xl p-4 sm:p-5 border border-slate-200/80 bg-white">
            <span class="text-xs font-bold text-slate-500 uppercase tracking-wider block">This Week's Earnings</span>
            <div class="text-2xl sm:text-3xl font-extrabold text-slate-900 font-heading mt-2">₹${weeklyEarnings.toLocaleString('en-IN')}</div>
            <div class="text-xs text-blue-600 font-semibold flex items-center gap-1 mt-1">
              <i data-lucide="calendar" class="w-3.5 h-3.5"></i> 7 Days Total
            </div>
          </div>

          <div class="glass-card rounded-2xl p-4 sm:p-5 border border-slate-200/80 bg-white">
            <span class="text-xs font-bold text-slate-500 uppercase tracking-wider block">Available to Withdraw</span>
            <div class="text-2xl sm:text-3xl font-extrabold text-brand-700 font-heading mt-2">₹${availableBalance.toLocaleString('en-IN')}</div>
            <div class="text-xs text-purple-700 font-semibold flex items-center gap-1 mt-1">
              <i data-lucide="check-circle" class="w-3.5 h-3.5"></i> Instant Bank UPI Payout
            </div>
          </div>

          <div class="glass-card rounded-2xl p-4 sm:p-5 border border-slate-200/80 bg-white">
            <span class="text-xs font-bold text-slate-500 uppercase tracking-wider block">Pending Escrow</span>
            <div class="text-2xl sm:text-3xl font-extrabold text-amber-600 font-heading mt-2">₹${pendingInEscrow.toLocaleString('en-IN')}</div>
            <div class="text-xs text-amber-700 font-semibold flex items-center gap-1 mt-1">
              <i data-lucide="clock" class="w-3.5 h-3.5"></i> Unlocks on Delivery
            </div>
          </div>

        </div>

        <!-- 2-Column Analytics: Interactive Revenue Trend Chart + Bank Info -->
        <div class="grid grid-cols-1 lg:grid-cols-12 gap-6">
          
          <!-- Weekly Revenue Visual Chart (8 Cols) -->
          <div class="lg:col-span-8 bg-white rounded-3xl border border-slate-200 p-6 shadow-sm space-y-4">
            <div class="flex items-center justify-between">
              <div>
                <h3 class="font-heading font-bold text-base text-slate-900 flex items-center gap-2">
                  <i data-lucide="bar-chart-3" class="w-5 h-5 text-brand-600"></i> Weekly Direct Sales Performance
                </h3>
                <p class="text-xs text-slate-500">Daily crop sales revenue in Indian Rupees (₹)</p>
              </div>
              <span class="text-xs font-bold text-slate-700 bg-slate-100 px-3 py-1.5 rounded-xl">Aug 15 - Aug 21</span>
            </div>

            <!-- Bar Chart Display -->
            <div class="pt-6 pb-2">
              <div class="h-48 flex items-end justify-between gap-2 sm:gap-4 px-2 border-b border-slate-200">
                ${weeklyData.map(item => `
                  <div class="flex-1 flex flex-col items-center gap-2 h-full justify-end group cursor-pointer">
                    <div class="opacity-0 group-hover:opacity-100 transition-opacity text-[10px] font-bold text-brand-700 bg-emerald-50 px-1.5 py-0.5 rounded border border-emerald-200 shadow-xs">
                      ₹${item.amount}
                    </div>
                    <div 
                      class="w-full max-w-[42px] bg-gradient-to-t from-brand-600 to-emerald-400 group-hover:from-brand-700 group-hover:to-emerald-500 rounded-t-xl transition-all duration-300 shadow-sm"
                      style="height: ${item.height}"
                    ></div>
                    <span class="text-xs font-bold text-slate-600">${item.day}</span>
                  </div>
                `).join('')}
              </div>
            </div>

            <div class="grid grid-cols-3 gap-2 pt-2 text-center text-xs">
              <div class="p-2.5 bg-slate-50 rounded-xl">
                <span class="text-slate-400 block text-[10px]">Highest Day</span>
                <strong class="text-slate-800">Saturday (₹4,200)</strong>
              </div>
              <div class="p-2.5 bg-slate-50 rounded-xl">
                <span class="text-slate-400 block text-[10px]">Average / Day</span>
                <strong class="text-slate-800">₹2,685 / day</strong>
              </div>
              <div class="p-2.5 bg-slate-50 rounded-xl">
                <span class="text-slate-400 block text-[10px]">Commission Saved</span>
                <strong class="text-emerald-700 font-extrabold">+₹2,970 (100% saved)</strong>
              </div>
            </div>
          </div>

          <!-- Payout Bank Account Details Card (4 Cols) -->
          <div class="lg:col-span-4 bg-white rounded-3xl border border-slate-200 p-6 shadow-sm space-y-4 flex flex-col justify-between">
            <div>
              <h3 class="font-heading font-bold text-base text-slate-900 flex items-center gap-2">
                <i data-lucide="building" class="w-5 h-5 text-brand-600"></i> Linked Settlement Account
              </h3>
              <p class="text-xs text-slate-500 mt-0.5">Automated direct beneficiary transfer</p>
              
              <div class="mt-4 p-4 rounded-2xl bg-gradient-to-br from-slate-900 to-slate-800 text-white space-y-3 shadow-md">
                <div class="flex items-center justify-between text-xs">
                  <span class="text-slate-400 font-medium">State Bank of India</span>
                  <span class="text-emerald-400 font-bold flex items-center gap-1"><i data-lucide="check-circle" class="w-3.5 h-3.5"></i> Verified</span>
                </div>
                <div class="font-mono text-sm tracking-widest text-emerald-200 font-bold">
                  ${user.bankDetails?.accountNumber || '•••• •••• 4892'}
                </div>
                <div class="flex items-center justify-between text-[11px] text-slate-300 pt-1 border-t border-slate-700">
                  <span>${user.bankDetails?.accountHolder || user.name}</span>
                  <span>UPI: ${user.bankDetails?.upiId || 'patil.farm@sbi'}</span>
                </div>
              </div>
            </div>

            <button 
              onclick="EarningsView.openWithdrawModal(${availableBalance})" 
              class="w-full py-3 bg-brand-600 hover:bg-brand-700 text-white font-bold text-xs rounded-xl shadow-farm flex items-center justify-center gap-2 transition-all active:scale-98"
            >
              <i data-lucide="arrow-down-circle" class="w-4 h-4"></i> Withdraw ₹${availableBalance.toLocaleString('en-IN')} Now
            </button>
          </div>

        </div>

        <!-- Recent Financial Transactions Table -->
        <div class="bg-white rounded-3xl border border-slate-200 p-6 shadow-sm space-y-4">
          <div class="flex items-center justify-between">
            <div>
              <h3 class="font-heading font-bold text-base text-slate-900 flex items-center gap-2">
                <i data-lucide="receipt" class="w-5 h-5 text-emerald-600"></i> Recent Payout & Settlement History
              </h3>
              <p class="text-xs text-slate-500">All direct transactions processed through RBI-approved Kisan Escrow</p>
            </div>
          </div>

          <div class="overflow-x-auto">
            <table class="w-full text-left text-xs">
              <thead>
                <tr class="border-b border-slate-200 text-slate-400 uppercase tracking-wider">
                  <th class="pb-3 font-semibold">Payout ID</th>
                  <th class="pb-3 font-semibold">Date</th>
                  <th class="pb-3 font-semibold">Beneficiary UPI / Bank</th>
                  <th class="pb-3 font-semibold">Bank Ref / UTR</th>
                  <th class="pb-3 font-semibold">Amount</th>
                  <th class="pb-3 font-semibold">Status</th>
                  <th class="pb-3 font-semibold text-right">Receipt</th>
                </tr>
              </thead>
              <tbody class="divide-y divide-slate-100">
                ${payouts.map(p => `
                  <tr class="hover:bg-slate-50 transition-colors">
                    <td class="py-3 font-bold text-slate-900">#${p.id}</td>
                    <td class="py-3 text-slate-600">${p.date}</td>
                    <td class="py-3 text-slate-700 font-medium">${p.upi}</td>
                    <td class="py-3 font-mono text-[11px] text-slate-500">${p.ref}</td>
                    <td class="py-3 font-extrabold text-brand-700 text-sm">₹${p.amount.toLocaleString('en-IN')}</td>
                    <td class="py-3">
                      <span class="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[10px] font-bold bg-emerald-100 text-emerald-800">
                        <i data-lucide="check" class="w-3 h-3"></i> ${p.status}
                      </span>
                    </td>
                    <td class="py-3 text-right">
                      <button onclick="Toast.show('Downloaded payment voucher for ${p.id} 📄', 'success')" class="text-brand-600 hover:text-brand-700 font-bold text-xs p-1">
                        Download
                      </button>
                    </td>
                  </tr>
                `).join('')}
              </tbody>
            </table>
          </div>

        </div>

      </div>
    `;
  },

  openWithdrawModal(availableBalance) {
    const user = StorageManager.getUser();
    const upiId = user.bankDetails?.upiId || "patil.farm@sbi";

    const modalHtml = `
      <div id="payout-modal" class="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-sm animate-fade-in">
        <div class="bg-white rounded-3xl shadow-2xl border border-slate-100 max-w-md w-full overflow-hidden animate-slide-up p-6 space-y-4 relative">
          
          <button onclick="document.getElementById('payout-modal').remove()" class="absolute top-4 right-4 text-slate-400 hover:text-slate-600 p-2">
            <i data-lucide="x" class="w-5 h-5"></i>
          </button>

          <div class="text-center space-y-1">
            <div class="w-14 h-14 rounded-2xl bg-emerald-100 text-brand-700 flex items-center justify-center mx-auto mb-2">
              <i data-lucide="arrow-down-circle" class="w-7 h-7"></i>
            </div>
            <h3 class="font-heading font-bold text-xl text-slate-900">Withdraw Farm Earnings</h3>
            <p class="text-xs text-slate-500">Instant direct payout to your verified UPI handle</p>
          </div>

          <div class="p-3 bg-emerald-50 rounded-2xl border border-emerald-200 text-center">
            <span class="text-xs text-emerald-800 font-bold block">Available Balance</span>
            <span class="text-2xl font-extrabold text-emerald-900 font-heading">₹${availableBalance.toLocaleString('en-IN')}</span>
          </div>

          <div class="space-y-3">
            <div>
              <label class="block text-xs font-bold text-slate-700 mb-1">Enter Amount to Withdraw (₹)</label>
              <input 
                type="number" 
                id="payout-amount" 
                value="${Math.min(availableBalance, 5000)}" 
                max="${availableBalance}" 
                min="100" 
                class="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-sm font-bold text-slate-900 focus:outline-none focus:ring-2 focus:ring-brand-500"
              />
            </div>

            <div>
              <label class="block text-xs font-bold text-slate-700 mb-1">UPI ID</label>
              <input 
                type="text" 
                id="payout-upi" 
                value="${upiId}" 
                class="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs sm:text-sm font-medium text-slate-900 focus:outline-none focus:ring-2 focus:ring-brand-500"
              />
            </div>
          </div>

          <button 
            onclick="EarningsView.confirmPayout(${availableBalance})" 
            class="w-full py-3.5 bg-gradient-to-r from-brand-600 to-emerald-700 hover:from-brand-700 hover:to-emerald-800 text-white font-bold text-sm rounded-xl shadow-farm flex items-center justify-center gap-2"
          >
            <i data-lucide="check" class="w-4 h-4"></i> Confirm Payout
          </button>
        </div>
      </div>
    `;

    const el = document.createElement("div");
    el.innerHTML = modalHtml;
    document.body.appendChild(el.firstElementChild);
    if (window.lucide) lucide.createIcons();
  },

  confirmPayout(maxAvailable) {
    const amount = Number(document.getElementById("payout-amount").value);
    const upi = document.getElementById("payout-upi").value.trim();

    if (!amount || amount <= 0 || amount > maxAvailable) {
      Toast.show(`Please enter a valid amount up to ₹${maxAvailable}.`, "error");
      return;
    }

    StorageManager.requestPayout(amount, upi);
    const modal = document.getElementById("payout-modal");
    if (modal) modal.remove();

    Toast.show(`Payout of ₹${amount.toLocaleString('en-IN')} transferred to ${upi}! 🏦`, "success");
    App.refreshView();
  }
};
