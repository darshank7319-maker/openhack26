/**
 * OrderTrackerModal Component (Visual 5-Stage Agricultural Delivery Timeline)
 */

const OrderTrackerModal = {
  render(order) {
    if (!order) return "";

    const stages = [
      { key: "Order Placed", label: "Order Placed", icon: "check-circle", desc: "Order booked & payment verified." },
      { key: "Confirmed", label: "Farm Packing Confirmed", icon: "clipboard-check", desc: "Farmer harvested & graded produce." },
      { key: "Shipped", label: "Shipped from Farm", icon: "package", desc: "Chilled agri-transport dispatched." },
      { key: "Out for Delivery", label: "Out for Delivery", icon: "truck", desc: "Local delivery van reaching destination." },
      { key: "Delivered", label: "Delivered Farm Fresh", icon: "home", desc: "Fresh produce handed over." }
    ];

    const currentStatusIndex = stages.findIndex(s => s.key === order.status);
    const effectiveIndex = currentStatusIndex >= 0 ? currentStatusIndex : 0;

    return `
      <div id="order-tracker-modal" class="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-slate-900/60 backdrop-blur-sm animate-fade-in overflow-y-auto">
        <div class="bg-white rounded-3xl shadow-2xl border border-slate-100 max-w-xl w-full overflow-hidden animate-slide-up relative my-8">
          
          <!-- Close Button -->
          <button 
            onclick="App.closeOrderTracker()" 
            class="absolute top-4 right-4 p-2.5 rounded-full text-slate-400 hover:text-slate-700 hover:bg-slate-100 z-10 transition-colors"
          >
            <i data-lucide="x" class="w-5 h-5"></i>
          </button>

          <!-- Top Header -->
          <div class="bg-gradient-to-r from-brand-900 via-brand-800 to-emerald-900 text-white p-6">
            <div class="flex items-center gap-2 mb-1">
              <span class="px-2.5 py-0.5 rounded-full text-[10px] font-bold bg-white/20 uppercase tracking-wider">Live Tracking</span>
              <span class="text-xs text-emerald-300">• Direct Farm Logistics</span>
            </div>
            <h2 class="text-2xl font-bold font-heading text-white">Tracking Order #${order.id}</h2>
            <p class="text-emerald-100 text-xs mt-0.5">Estimated Arrival: <strong class="text-white">${order.expectedDelivery}</strong></p>
          </div>

          <!-- Content Body -->
          <div class="p-6 space-y-6 max-h-[70vh] overflow-y-auto">
            
            <!-- Visual Map Simulation Card -->
            <div class="relative h-32 rounded-2xl bg-gradient-to-br from-emerald-100 via-green-50 to-stone-100 border border-emerald-200 overflow-hidden flex items-center justify-center">
              <div class="absolute inset-0 opacity-20 bg-[radial-gradient(#16a34a_1px,transparent_1px)] [background-size:16px_16px]"></div>
              
              <!-- Route Points -->
              <div class="relative z-10 w-full px-8 flex items-center justify-between">
                
                <!-- Farm Point -->
                <div class="text-center space-y-1">
                  <div class="w-10 h-10 rounded-2xl bg-brand-700 text-white flex items-center justify-center mx-auto shadow-md">
                    <i data-lucide="sprout" class="w-5 h-5"></i>
                  </div>
                  <span class="text-[10px] font-bold text-slate-700 block max-w-[80px] truncate">${order.farmName || 'Nashik Farm'}</span>
                </div>

                <!-- Animated Moving Van Line -->
                <div class="flex-1 mx-4 relative flex items-center">
                  <div class="w-full h-1.5 bg-emerald-200 rounded-full overflow-hidden">
                    <div class="h-full bg-brand-600 rounded-full transition-all duration-1000" style="width: ${(effectiveIndex + 1) * 20}%"></div>
                  </div>
                  <div class="absolute -top-3 text-brand-700 bg-white p-1 rounded-full shadow-md border border-brand-300 animate-pulse" style="left: calc(${Math.min(90, (effectiveIndex + 1) * 20)}% - 12px)">
                    <i data-lucide="truck" class="w-4 h-4 text-brand-600"></i>
                  </div>
                </div>

                <!-- Buyer Home Point -->
                <div class="text-center space-y-1">
                  <div class="w-10 h-10 rounded-2xl bg-slate-900 text-white flex items-center justify-center mx-auto shadow-md">
                    <i data-lucide="home" class="w-5 h-5"></i>
                  </div>
                  <span class="text-[10px] font-bold text-slate-700 block max-w-[80px] truncate">${order.buyerName}</span>
                </div>

              </div>
            </div>

            <!-- Stepper Timeline -->
            <div class="space-y-4">
              <h3 class="font-heading font-bold text-xs uppercase tracking-wider text-slate-500">Live Stage Milestones</h3>

              <div class="space-y-4 relative pl-3">
                
                ${stages.map((stage, idx) => {
                  const isCompleted = idx <= effectiveIndex;
                  const isCurrent = idx === effectiveIndex;

                  return `
                    <div class="flex items-start gap-3 relative">
                      
                      <!-- Vertical connector line -->
                      ${idx < stages.length - 1 ? `
                        <div class="absolute left-4 top-7 w-0.5 h-10 ${idx < effectiveIndex ? 'bg-brand-600' : 'bg-slate-200'}"></div>
                      ` : ''}

                      <!-- Circle Node -->
                      <div class="w-8 h-8 rounded-full flex items-center justify-center flex-shrink-0 z-10 ${isCompleted ? 'bg-brand-600 text-white shadow-sm' : 'bg-slate-100 text-slate-400 border border-slate-300'} ${isCurrent ? 'ring-4 ring-brand-100 animate-pulse' : ''}">
                        <i data-lucide="${stage.icon}" class="w-4 h-4"></i>
                      </div>

                      <!-- Details -->
                      <div class="flex-1 min-w-0 pt-0.5">
                        <div class="flex items-center justify-between">
                          <h4 class="text-xs sm:text-sm font-bold ${isCompleted ? 'text-slate-900' : 'text-slate-400'}">${stage.label}</h4>
                          <span class="text-[10px] ${isCompleted ? 'text-emerald-700 font-bold' : 'text-slate-400'}">
                            ${isCompleted ? (order.trackingTimeline[idx]?.time || 'Completed') : 'Pending'}
                          </span>
                        </div>
                        <p class="text-[11px] text-slate-500 mt-0.5">${stage.desc}</p>
                      </div>

                    </div>
                  `;
                }).join('')}

              </div>
            </div>

            <!-- Delivery Partner Card -->
            <div class="p-4 bg-slate-50 rounded-2xl border border-slate-200 flex items-center justify-between gap-3">
              <div class="flex items-center gap-3">
                <div class="w-11 h-11 rounded-2xl bg-emerald-100 text-brand-700 flex items-center justify-center flex-shrink-0 font-bold">
                  <i data-lucide="user-check" class="w-5 h-5"></i>
                </div>
                <div>
                  <span class="text-[10px] text-slate-400 font-bold uppercase tracking-wider block">Assigned Agri-Courier</span>
                  <p class="font-bold text-xs text-slate-800 mt-0.5">${order.deliveryPartner?.name || 'Vikas Shinde'}</p>
                  <p class="text-[11px] text-slate-500">${order.deliveryPartner?.vehicle || 'AgriDirect Express (MH-15-EG-4912)'}</p>
                </div>
              </div>

              <a 
                href="tel:${order.deliveryPartner?.phone || '+919823011223'}" 
                class="px-3.5 py-2 bg-white hover:bg-emerald-50 text-emerald-800 border border-emerald-300 rounded-xl font-bold text-xs flex items-center gap-1.5 shadow-sm transition-colors"
              >
                <i data-lucide="phone-call" class="w-3.5 h-3.5 text-emerald-600"></i>
                <span>Call Driver</span>
              </a>
            </div>

          </div>

          <!-- Footer -->
          <div class="p-4 bg-slate-50 border-t border-slate-200 text-center">
            <button 
              onclick="App.closeOrderTracker()" 
              class="px-6 py-2.5 bg-slate-800 hover:bg-slate-900 text-white rounded-xl font-bold text-xs transition-colors"
            >
              Close Tracker
            </button>
          </div>

        </div>
      </div>
    `;
  }
};
