/**
 * ChatDrawer Component (Direct Buyer-to-Farmer Real-time Messaging)
 */

const ChatDrawer = {
  activeConversationId: null,
  activeProductContext: null,

  render(state) {
    const user = state.currentUser;
    const conversations = state.conversations;
    const isFarmer = user.role === "farmer";

    // Auto-select first conversation if none selected
    if (!this.activeConversationId && conversations.length > 0) {
      this.activeConversationId = conversations[0].id;
    }

    const currentConv = conversations.find(c => c.id === this.activeConversationId) || conversations[0];

    const quickReplies = isFarmer ? [
      "Namaste! Fresh batch is ready for immediate dispatch.",
      "Yes, 100% certified organic with zero chemical spray.",
      "We offer a 10% discount for orders above 50kg.",
      "Harvested early this morning from our Nashik farm."
    ] : [
      "Is this produce 100% certified organic?",
      "Can you dispatch 20kg to Pune by tomorrow?",
      "When was this batch harvested?",
      "Can you provide a bulk discount for regular weekly delivery?"
    ];

    return `
      <div id="chat-drawer-overlay" class="fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-sm animate-fade-in flex justify-end">
        <div class="bg-white w-full max-w-lg h-full shadow-2xl flex flex-col justify-between animate-slide-up sm:animate-slide-down relative">
          
          <!-- Top Header -->
          <div class="p-4 border-b border-slate-200 bg-slate-50 flex items-center justify-between">
            <div class="flex items-center gap-3">
              <div class="relative">
                <img 
                  src="${currentConv?.farmerAvatar || 'https://images.unsplash.com/photo-1544717305-2782549b5136?w=200&auto=format&fit=crop&q=80'}" 
                  alt="Avatar" 
                  class="w-10 h-10 rounded-full object-cover ring-2 ring-emerald-500"
                />
                <span class="absolute bottom-0 right-0 w-3 h-3 bg-emerald-500 border-2 border-white rounded-full"></span>
              </div>
              <div>
                <h3 class="font-heading font-bold text-sm text-slate-900 flex items-center gap-1.5">
                  <span>${isFarmer ? (currentConv?.buyerName || 'Buyer Ananya') : (currentConv?.farmerName || 'Farmer Rameshwar')}</span>
                  <i data-lucide="check-circle" class="w-3.5 h-3.5 text-emerald-600"></i>
                </h3>
                <p class="text-[11px] text-emerald-700 font-medium">Online • Direct Kisan Connect</p>
              </div>
            </div>

            <button 
              onclick="App.closeChat()" 
              class="p-2 rounded-full text-slate-400 hover:text-slate-700 hover:bg-slate-200/60 transition-colors"
            >
              <i data-lucide="x" class="w-5 h-5"></i>
            </button>
          </div>

          <!-- Active Product Context Banner -->
          <div class="px-4 py-2.5 bg-emerald-50/90 border-b border-emerald-200 flex items-center justify-between text-xs">
            <div class="flex items-center gap-2">
              <i data-lucide="wheat" class="w-4 h-4 text-emerald-600 flex-shrink-0"></i>
              <span class="text-slate-700">Inquiring about: <strong class="text-slate-900 font-bold">${currentConv?.productName || 'Fresh Organic Produce'}</strong> (${currentConv?.productPrice || '₹34/kg'})</span>
            </div>
            <span class="text-[10px] text-emerald-800 bg-emerald-100 px-2 py-0.5 rounded font-bold">Direct Link</span>
          </div>

          <!-- Messages Scroll View -->
          <div id="chat-messages-container" class="flex-1 overflow-y-auto p-4 space-y-3 bg-slate-50/50">
            ${currentConv ? currentConv.messages.map(msg => {
              const isMe = (isFarmer && msg.sender === 'farmer') || (!isFarmer && msg.sender === 'buyer');

              return `
                <div class="flex ${isMe ? 'justify-end' : 'justify-start'}">
                  <div class="max-w-[80%] rounded-2xl p-3 shadow-xs ${isMe ? 'bg-gradient-to-r from-brand-600 to-emerald-700 text-white rounded-br-none' : 'bg-white text-slate-800 border border-slate-200/80 rounded-bl-none'}">
                    <p class="text-xs leading-relaxed">${msg.text}</p>
                    <span class="block text-[9px] ${isMe ? 'text-emerald-200' : 'text-slate-400'} text-right mt-1">${msg.time}</span>
                  </div>
                </div>
              `;
            }).join('') : '<p class="text-center text-xs text-slate-400 py-10">Start conversation with the farmer...</p>'}
          </div>

          <!-- Quick Suggestion Chips -->
          <div class="px-3 py-2 bg-white border-t border-slate-100 overflow-x-auto no-scrollbar flex items-center gap-1.5">
            ${quickReplies.map(q => `
              <button 
                onclick="ChatDrawer.sendQuickReply('${q.replace(/'/g, "\\'")}')" 
                class="flex-shrink-0 px-2.5 py-1 text-[11px] font-semibold bg-slate-100 hover:bg-emerald-50 hover:text-emerald-800 text-slate-700 rounded-full border border-slate-200 transition-colors"
              >
                ${q}
              </button>
            `).join('')}
          </div>

          <!-- Input Footer -->
          <div class="p-3 sm:p-4 bg-white border-t border-slate-200">
            <form onsubmit="ChatDrawer.handleSendMessage(event)" class="flex items-center gap-2">
              <input 
                type="text" 
                id="chat-input-text" 
                placeholder="Type your message to ${isFarmer ? 'buyer' : 'farmer'}..." 
                class="flex-1 px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-2xl text-xs sm:text-sm focus:outline-none focus:ring-2 focus:ring-brand-500 focus:bg-white"
              />
              <button 
                type="submit" 
                class="p-2.5 sm:px-4 sm:py-2.5 bg-brand-600 hover:bg-brand-700 text-white rounded-2xl font-bold text-xs shadow-farm flex items-center justify-center gap-1.5 transition-transform active:scale-95 flex-shrink-0"
              >
                <i data-lucide="send" class="w-4 h-4"></i>
                <span class="hidden sm:inline">Send</span>
              </button>
            </form>
          </div>

        </div>
      </div>
    `;
  },

  handleSendMessage(e) {
    e.preventDefault();
    const input = document.getElementById("chat-input-text");
    if (!input || !input.value.trim()) return;
    const text = input.value.trim();
    input.value = "";

    const user = StorageManager.getUser();
    const senderRole = user.role;

    StorageManager.sendMessage(this.activeConversationId, text, senderRole, this.activeProductContext);
    App.refreshView();
    this.scrollToBottom();

    // Trigger simulated automated response after 1.2 seconds for realistic demo
    setTimeout(() => {
      this.simulateReply(senderRole);
    }, 1200);
  },

  sendQuickReply(text) {
    const user = StorageManager.getUser();
    const senderRole = user.role;

    StorageManager.sendMessage(this.activeConversationId, text, senderRole, this.activeProductContext);
    App.refreshView();
    this.scrollToBottom();

    setTimeout(() => {
      this.simulateReply(senderRole);
    }, 1200);
  },

  simulateReply(myRole) {
    const counterpartRole = myRole === "farmer" ? "buyer" : "farmer";
    const farmerReplies = [
      "Ji bilkul! Everything is packed straight from harvest. Shall I pack it for you today?",
      "Understood. I have confirmed your produce specifications. Thank you for supporting our farm directly!",
      "Yes, we deliver within 24 hours in temperature-maintained vans to keep nutritional value intact."
    ];
    const buyerReplies = [
      "Thank you for the quick clarification! Placing the direct order now.",
      "Sounds great! Looking forward to receiving the fresh farm batch.",
      "Could you also please include the organic certificate copy with the package?"
    ];

    const pool = counterpartRole === "farmer" ? farmerReplies : buyerReplies;
    const randomReply = pool[Math.floor(Math.random() * pool.length)];

    StorageManager.sendMessage(this.activeConversationId, randomReply, counterpartRole, this.activeProductContext);
    Toast.show(`New message from ${counterpartRole === 'farmer' ? 'Farmer Rameshwar' : 'Buyer Ananya'} 💬`, "info");
    App.refreshView();
    this.scrollToBottom();
  },

  scrollToBottom() {
    setTimeout(() => {
      const container = document.getElementById("chat-messages-container");
      if (container) {
        container.scrollTop = container.scrollHeight;
      }
    }, 100);
  }
};
