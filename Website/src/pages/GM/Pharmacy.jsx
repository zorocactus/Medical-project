import { 
  Pill, 
  ShoppingCart, 
  Trash2, 
  AlertTriangle, 
  CheckCircle2, 
  Search,
  Filter,
  Plus,
  Minus,
  RefreshCw
} from "lucide-react";
import { useState } from "react";

const INITIAL_STOCK = [
  { id: 1, name: "Metformin 500mg", quantity: 8, threshold: 10, unit: "tablets", status: "low" },
  { id: 2, name: "Aspirin 75mg", quantity: 42, threshold: 15, unit: "tablets", status: "ok" },
  { id: 3, name: "Lisinopril 10mg", quantity: 5, threshold: 10, unit: "tablets", status: "critical" },
  { id: 4, name: "Paracetamol 500mg", quantity: 12, threshold: 5, unit: "tablets", status: "ok" }
];

export default function GMPharmacy() {
  const [stock, setStock] = useState(INITIAL_STOCK);
  const [cart, setCart] = useState([]);

  const addToCart = (med) => {
    if (!cart.find(item => item.id === med.id)) {
      setCart([...cart, { ...med, qty: 1 }]);
    }
  };

  const removeFromCart = (id) => {
    setCart(cart.filter(item => item.id !== id));
  };

  return (
    <div className="animate-in fade-in duration-500 space-y-8">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-[#0D2644] dark:text-white mb-1">Pharmacy & Stock</h1>
          <p className="text-[#5C738A] dark:text-gray-400 text-sm font-medium">Monitor and refill patient's daily medications</p>
        </div>
        <div className="flex items-center gap-3">
          <button className="px-4 py-2 bg-white dark:bg-[#172133] border border-gray-100 dark:border-gray-800 rounded-xl text-sm font-bold text-[#638ECB] hover:bg-blue-50 dark:hover:bg-blue-900/10 transition-all flex items-center gap-2">
            <RefreshCw size={16} /> Sync Stock
          </button>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Left Column - Current Stock List */}
        <div className="lg:col-span-2 space-y-6">
          <div className="bg-white dark:bg-[#172133] rounded-3xl border border-gray-100 dark:border-gray-800 shadow-sm p-8">
            <div className="flex items-center justify-between mb-8 flex-wrap gap-4">
               <h2 className="text-lg font-bold text-[#0D2644] dark:text-white flex items-center gap-2">
                 <Pill size={20} className="text-[#638ECB]" /> Medication Stock
               </h2>
               <div className="flex items-center gap-2 flex-1 md:flex-none">
                  <div className="relative flex-1">
                    <Search size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
                    <input type="text" placeholder="Search stock..." className="pl-9 pr-4 py-1.5 bg-gray-50 dark:bg-gray-800 border-none rounded-lg text-xs outline-none focus:ring-1 focus:ring-[#638ECB] w-full" />
                  </div>
                  <button className="p-1.5 border border-gray-100 dark:border-gray-800 rounded-lg text-gray-400"><Filter size={14} /></button>
               </div>
            </div>

            <div className="space-y-4">
               {stock.map((item) => (
                 <div key={item.id} className={`p-5 rounded-2xl border transition-all ${
                   item.status === 'critical' ? 'bg-red-50/50 border-red-100 dark:bg-red-900/10 dark:border-red-900/20' : 
                   item.status === 'low' ? 'bg-amber-50/50 border-amber-100 dark:bg-amber-900/10 dark:border-amber-900/20' : 
                   'bg-white dark:bg-transparent border-gray-50 dark:border-gray-800 hover:border-blue-100'
                 }`}>
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-4">
                         <div className={`w-10 h-10 rounded-xl flex items-center justify-center font-bold ${
                           item.status === 'critical' ? 'bg-red-500 text-white' : 
                           item.status === 'low' ? 'bg-amber-500 text-white' : 'bg-[#638ECB] text-white'
                         }`}>
                           <Pill size={18} />
                         </div>
                         <div>
                            <h4 className="text-sm font-bold text-[#0D2644] dark:text-white">{item.name}</h4>
                            <p className="text-[10px] font-bold text-gray-400 uppercase tracking-widest mt-1">Threshold: {item.threshold} {item.unit}</p>
                         </div>
                      </div>

                      <div className="flex items-center gap-6">
                         <div className="text-right">
                            <p className={`text-lg font-bold ${item.status === 'critical' ? 'text-red-500' : item.status === 'low' ? 'text-amber-500' : 'text-[#638ECB]'}`}>
                              {item.quantity} <small className="text-[10px] font-medium text-gray-400">{item.unit}</small>
                            </p>
                            <p className="text-[10px] font-bold text-gray-400 uppercase tracking-widest leading-none">In Stock</p>
                         </div>
                         <button 
                           disabled={item.status === 'ok'}
                           onClick={() => addToCart(item)}
                           className={`px-4 py-2 rounded-xl text-xs font-bold transition-all shadow-sm active:scale-95 ${
                            item.status === 'ok' ? 'bg-gray-100 text-gray-400 cursor-not-allowed' : 'bg-[#638ECB] text-white hover:bg-[#395886]'
                           }`}>
                           {item.status === 'ok' ? 'In Stock' : 'Order Refill'}
                         </button>
                      </div>
                    </div>
                 </div>
               ))}
            </div>
          </div>
        </div>

        {/* Right Column - Cart & Alerts */}
        <div className="lg:col-span-1 space-y-6">
          {/* Order Refill Panel */}
          <div className="bg-white dark:bg-[#172133] rounded-3xl border border-gray-100 dark:border-gray-800 p-8 shadow-sm">
             <div className="flex items-center justify-between mb-8">
                <h3 className="text-lg font-bold text-[#0D2644] dark:text-white flex items-center gap-2">
                  <ShoppingCart size={20} className="text-[#638ECB]" /> Order Refill
                </h3>
                <span className="text-[10px] font-bold text-gray-400 uppercase tracking-widest">{cart.length} Items</span>
             </div>

             <div className="space-y-4 mb-8">
                {cart.length === 0 ? (
                  <div className="text-center py-8">
                    <div className="w-16 h-16 rounded-full bg-gray-50 dark:bg-gray-800 flex items-center justify-center mx-auto mb-4 border border-gray-100 dark:border-gray-700">
                      <ShoppingCart size={24} className="text-gray-300" />
                    </div>
                    <p className="text-xs font-medium text-gray-400 max-w-[150px] mx-auto">Add low stock items to your refill order.</p>
                  </div>
                ) : (
                  cart.map((item) => (
                    <div key={item.id} className="flex items-center justify-between group">
                       <div className="flex items-center gap-3">
                          <button onClick={() => removeFromCart(item.id)} className="w-6 h-6 rounded-md bg-red-50 text-red-500 flex items-center justify-center hover:bg-red-500 hover:text-white transition-all">
                             <Trash2 size={12} />
                          </button>
                          <div>
                            <p className="text-xs font-bold text-[#0D2644] dark:text-white group-hover:text-[#638ECB]">{item.name}</p>
                            <p className="text-[10px] text-gray-400">1 Box (30 tabs)</p>
                          </div>
                       </div>
                       <div className="flex items-center gap-2">
                          <button className="w-6 h-6 rounded-md border border-gray-100 text-gray-400 font-bold flex items-center justify-center">-</button>
                          <span className="text-xs font-bold">1</span>
                          <button className="w-6 h-6 rounded-md border border-gray-100 text-gray-400 font-bold flex items-center justify-center">+</button>
                       </div>
                    </div>
                  ))
                )}
             </div>

             <div className="pt-6 border-t border-gray-50 dark:border-gray-800 space-y-4">
                <div className="flex items-center justify-between text-sm font-bold">
                   <span className="text-gray-400">Pharmacy</span>
                   <span className="text-[#0D2644] dark:text-gray-200">Pharmacie du Jardin</span>
                </div>
                <div className="flex items-center justify-between text-sm font-bold">
                   <span className="text-gray-400">Delivery</span>
                   <span className="text-[#0D2644] dark:text-gray-200">Home Delivery</span>
                </div>
                <button 
                  disabled={cart.length === 0}
                  className={`w-full py-4 rounded-xl font-bold transition-all shadow-lg active:scale-95 flex items-center justify-center gap-2 ${
                    cart.length === 0 ? 'bg-gray-100 text-gray-400 cursor-not-allowed' : 'bg-[#638ECB] text-white hover:bg-[#395886]'
                  }`}>
                   Place Order <CheckCircle2 size={18} />
                </button>
             </div>
          </div>

          {/* Stock Alerts Small */}
          <div className="bg-red-500 rounded-3xl p-8 relative overflow-hidden group shadow-xl shadow-red-500/10">
              <div className="absolute top-[-20px] right-[-20px] w-24 h-24 bg-white/10 rounded-full blur-xl animate-pulse"></div>
              <div className="relative z-10">
                <div className="flex items-center gap-2 text-white/70 text-[10px] font-bold uppercase tracking-widest mb-2">
                  <AlertTriangle size={14} /> Immediate Action
                </div>
                <h3 className="text-white font-bold text-lg mb-2">Lisinopril Critical</h3>
                <p className="text-white/80 text-xs font-medium leading-relaxed">
                  The stock level is below 1 day's dosage. Please place an order immediately to avoid interruption in treatment.
                </p>
              </div>
          </div>
        </div>
      </div>
    </div>
  );
}
