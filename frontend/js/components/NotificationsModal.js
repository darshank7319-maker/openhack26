/**
 * NotificationsModal Component
 */

const NotificationsModal = {
  render(state) {
    const notifs = state.notifications;
    const unreadCount = notifs.filter(n => !n.isRead).length;

    const icons = {
      order: `<div class="w-9 h-9 rounded-xl bg-blue-100 text-blue-700 flex items-center justify-center"><i data-lucide="package" class="w-4 h-4"></i></div>`,
      price: `<div class="w-9 h-9 rounded-xl bg-emerald-100 text-brand-700 flex items-center justify-center"><i data-lucide="trending-up" class="w-4 h-4"></i></div>`,
      payment: `<div class="w-9 h-9 rounded-xl bg-purple-100 text-purple-700 flex items-center justify-center"><i data-lucide="wallet" class="w-4 h-4"></i></div>`,
      message: `<div class="w-9 h-9 rounded-xl bg-amber-100 text-amber-700 flex items-center justify-center"><i data-lucide="message-square" class="w-4 h-4"></i></div>`
    };

    return `
      <div id="notifications-modal" class="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-sm animate-fade-in">
        <div class="bg-white rounded-3xl shadow-2xl border border-slate-100 max-w-md w-full overflow-hidden animate-slide-up relative">
          
          <!-- Header -->
          <div class="p-5 border-b border-slate-200 flex items-center justify-between bg-slate-50">
            <div class="flex items-center gap-2">
              <div class="w-8 h-8 rounded-xl bg-brand-100 text-brand-700 flex items-center justify-center">
                <i data-lucide="bell" class="w-4 h-4"></i>
              </div>
              <div>
                <h3 class="font-heading font-bold text-base text-slate-900">Notifications</h3>
                <span class="text-xs text-slate-500">${unreadCount} unread alert(s)</span>
              </div>
            </div>

            <div class="flex items-center gap-1">
              ${unreadCount > 0 ? `
                <button 
                  onclick="NotificationsModal.markAllRead()" 
                  class="text-[11px] font-bold text-brand-600 hover:text-brand-700 px-2 py-1"
                >
                  Mark all read
                </button>
              ` : ''}
              <button 
                onclick="App.closeNotificationsModal()" 
                class="p-2 rounded-full text-slate-400 hover:text-slate-700 hover:bg-slate-200/60"
              >
                <i data-lucide="x" class="w-5 h-5"></i>
              </button>
            </div>
          </div>

          <!-- Notification Items -->
          <div class="max-h-[65vh] overflow-y-auto divide-y divide-slate-100 p-2">
            ${notifs.length > 0 ? notifs.map(n => `
              <div 
                onclick="NotificationsModal.handleNotifClick('${n.target || 'orders'}')" 
                class="p-3.5 rounded-2xl flex items-start gap-3 transition-colors cursor-pointer ${n.isRead ? 'hover:bg-slate-50 opacity-80' : 'bg-emerald-50/50 hover:bg-emerald-50'}"
              >
                ${icons[n.type] || icons.order}
                <div class="flex-1 min-w-0 space-y-0.5">
                  <div class="flex items-center justify-between">
                    <h4 class="font-bold text-xs text-slate-900 truncate">${n.title}</h4>
                    <span class="text-[10px] text-slate-400 font-medium">${n.time}</span>
                  </div>
                  <p class="text-xs text-slate-600 leading-relaxed">${n.message}</p>
                </div>
              </div>
            `).join('') : `
              <div class="py-12 text-center text-xs text-slate-400">
                No notifications right now.
              </div>
            `}
          </div>

          <!-- Footer -->
          <div class="p-3.5 bg-slate-50 border-t border-slate-200 text-center">
            <button 
              onclick="App.closeNotificationsModal()" 
              class="w-full py-2 bg-slate-800 hover:bg-slate-900 text-white rounded-xl text-xs font-bold transition-colors"
            >
              Close
            </button>
          </div>

        </div>
      </div>
    `;
  },

  markAllRead() {
    StorageManager.markAllNotificationsRead();
    Toast.show("All notifications marked as read.", "info");
    App.refreshModal();
  },

  handleNotifClick(target) {
    App.closeNotificationsModal();
    if (target === "orders") {
      App.navigate("orders");
    } else if (target === "mandi") {
      App.navigate("mandi");
    } else if (target === "earnings") {
      App.navigate("earnings");
    } else if (target === "chat") {
      App.openChat();
    } else if (target === "my-products") {
      App.navigate("my-products");
    } else {
      App.navigate("marketplace");
    }
  }
};
