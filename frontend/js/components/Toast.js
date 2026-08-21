/**
 * Toast Notification Helper
 */

const Toast = {
  container: null,

  init() {
    if (!document.getElementById("toast-container")) {
      const el = document.createElement("div");
      el.id = "toast-container";
      document.body.appendChild(el);
      this.container = el;
    } else {
      this.container = document.getElementById("toast-container");
    }
  },

  show(message, type = "success", duration = 3500) {
    this.init();

    const toast = document.createElement("div");
    const icons = {
      success: `<svg class="w-5 h-5 text-emerald-600" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5 13l4 4L19 7"/></svg>`,
      error: `<svg class="w-5 h-5 text-red-600" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12"/></svg>`,
      info: `<svg class="w-5 h-5 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"/></svg>`,
      warning: `<svg class="w-5 h-5 text-amber-600" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z"/></svg>`
    };

    const bgColors = {
      success: "border-emerald-500 bg-white shadow-farm",
      error: "border-red-500 bg-white shadow-lg",
      info: "border-blue-500 bg-white shadow-lg",
      warning: "border-amber-500 bg-white shadow-lg"
    };

    toast.className = `flex items-center gap-3 px-4 py-3 rounded-xl border-l-4 shadow-farm text-slate-800 text-sm font-medium animate-slide-down transform transition-all duration-300 max-w-md ${bgColors[type] || bgColors.success}`;
    toast.innerHTML = `
      <div class="flex-shrink-0">${icons[type] || icons.success}</div>
      <div class="flex-1">${message}</div>
      <button class="text-slate-400 hover:text-slate-600 p-1 text-xs" onclick="this.parentElement.remove()">✕</button>
    `;

    this.container.appendChild(toast);

    setTimeout(() => {
      toast.classList.add("opacity-0", "translate-y-[-8px]");
      setTimeout(() => toast.remove(), 300);
    }, duration);
  }
};
