import React from "react";
import { Order, UserAccount } from "../types";
import { ShieldCheck, Calendar, Coins, Truck, CheckCircle, Package, ArrowRight, UserCheck, AlertCircle, BarChart3, Users, Landmark } from "lucide-react";

interface AdminDashboardProps {
  orders: Order[];
  setOrders: React.Dispatch<React.SetStateAction<Order[]>>;
  accounts: UserAccount[];
  setAccounts: React.Dispatch<React.SetStateAction<UserAccount[]>>;
  onAdminShipOrder: (orderId: string, customerId: string, pointsAwarded: number) => void;
}

export default function AdminDashboard({
  orders,
  setOrders,
  accounts,
  setAccounts,
  onAdminShipOrder
}: AdminDashboardProps) {

  const totalSalesVal = orders.reduce((total, ord) => total + ord.totalAmount, 0);
  const totalPointsAwarded = orders.reduce((sum, ord) => sum + (ord.pointsCredited ? ord.pointsAwarded : 0), 0);
  const pendingShipmentsCount = orders.filter((o) => o.shippingStatus === "pending").length;

  const handleGrantBonus = (accountId: string, amount: number) => {
    setAccounts((prev) =>
      prev.map((acc) => {
        if (acc.id === accountId) {
          return { ...acc, points: acc.points + amount };
        }
        return acc;
      })
    );
  };

  return (
    <div className="mx-auto max-w-7xl py-6 px-4 animate-fadeIn">
      {/* Admin Title */}
      <div className="border-b border-forest-100 pb-5 mb-8 flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h2 className="font-display text-3xl font-extrabold text-forest-900 tracking-tight flex items-center">
            <ShieldCheck className="h-8 w-8 text-red-600 mr-2.5" />
            <span>GUL Global Platform Control Unit</span>
          </h2>
          <p className="text-xs sm:text-sm text-sage-700 mt-1">
            Reconcile physical shipments, approve delayed Cash on Delivery order points, and review transaction ledgers.
          </p>
        </div>
        <div className="bg-red-900/10 border border-red-500/20 text-red-800 px-4 py-2 rounded-full text-xs font-black uppercase tracking-wider">
          System Level: Administrative Console
        </div>
      </div>

      {/* Stats Cards Bento */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
        <div className="p-5 rounded-[24px] bg-red-950 text-cream-50 flex flex-col justify-between">
          <BarChart3 className="h-6 w-6 text-red-400" />
          <div className="mt-4">
            <span className="text-[10px] text-red-300 font-mono uppercase tracking-widest block font-bold">Platform Revenue</span>
            <span className="text-2xl font-black font-mono mt-1 block">Rs. {totalSalesVal}</span>
          </div>
        </div>

        <div className="p-5 rounded-[24px] bg-cream-50 border-2 border-forest-900/10 flex flex-col justify-between text-forest-900">
          <Coins className="h-6 w-6 text-gold-500" />
          <div className="mt-4">
            <span className="text-[10px] text-sage-500 font-mono uppercase tracking-widest block font-bold">Distributed points</span>
            <span className="text-2xl font-extrabold font-mono mt-1 block">+{totalPointsAwarded} PTS</span>
          </div>
        </div>

        <div className="p-5 rounded-[24px] bg-cream-50 border-2 border-forest-900/10 flex flex-col justify-between text-forest-900">
          <Truck className="h-6 w-6 text-emerald-600" />
          <div className="mt-4">
            <span className="text-[10px] text-sage-500 font-mono uppercase tracking-widest block font-bold">Pending Dispatches</span>
            <span className="text-2xl font-extrabold font-mono mt-1 block">{pendingShipmentsCount} Orders</span>
          </div>
        </div>

        <div className="p-5 rounded-[24px] bg-cream-50 border-2 border-forest-900/10 flex flex-col justify-between text-forest-900">
          <Users className="h-6 w-6 text-indigo-500" />
          <div className="mt-4">
            <span className="text-[10px] text-sage-500 font-mono uppercase tracking-widest block font-bold">Registered Members</span>
            <span className="text-2xl font-extrabold font-mono mt-1 block">{accounts.length} active</span>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        
        {/* Left Side: Order dispatches & COD shipping checks */}
        <div className="lg:col-span-8 space-y-6">
          <div className="rounded-[40px] border-2 border-forest-900/10 bg-cream-50 p-6 sm:p-8 shadow-xs">
            <h3 className="font-display font-black text-xs uppercase tracking-widest text-[#1B3022]/60 mb-6 flex items-center gap-1.5 pb-2 border-b border-forest-100">
              <Package className="h-4 w-4 text-emerald-600" />
              <span>Pending Shipments & Point Dispatches</span>
            </h3>

            {orders.length === 0 ? (
              <div className="text-center py-12">
                <Truck className="h-10 w-10 text-sage-300 mx-auto mb-2" />
                <p className="text-xs text-forest-700 font-bold">No customer orders recorded on the platform yet.</p>
              </div>
            ) : (
              <div className="space-y-4">
                {orders.map((order) => {
                  const isCODHold = order.paymentMethod === "cod" && !order.pointsCredited;
                  const isPendingShipping = order.shippingStatus === "pending";

                  return (
                    <div
                      key={order.id}
                      className="p-5 rounded-3xl bg-[#FAF9F5] border border-forest-900/5 hover:border-forest-900/10 transition-all space-y-4"
                    >
                      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-2 border-b border-forest-900/5 pb-3">
                        <div>
                          <div className="flex items-center space-x-2">
                            <span className="text-xs font-black text-forest-950 font-mono">ID: {order.id}</span>
                            <span className="text-[9px] font-mono text-sage-500">{order.date}</span>
                          </div>
                          <p className="text-[11px] text-forest-750 font-bold mt-1">
                            Buyer: {order.customerName}
                          </p>
                        </div>

                        <div className="flex flex-wrap gap-2 text-[10px] font-mono tracking-wider font-extrabold text-white">
                          <span className={`px-2.5 py-0.5 rounded-full capitalize ${
                            order.paymentMethod === "card" 
                              ? "bg-emerald-600" 
                              : order.paymentMethod === "points"
                                ? "bg-purple-700"
                                : "bg-amber-600"
                          }`}>
                            {order.paymentMethod === "card" 
                              ? "Paid Card" 
                              : order.paymentMethod === "points"
                                ? "Paid Points"
                                : "COD Pending"
                            }
                          </span>
                          <span className={`px-2.5 py-0.5 rounded-full capitalize ${
                            order.shippingStatus === "shipped" ? "bg-forest-905 bg-[#1B3022]" : "bg-red-500"
                          }`}>
                            {order.shippingStatus}
                          </span>
                        </div>
                      </div>

                      {/* Items */}
                      <div className="space-y-1.5 pl-2">
                        {order.items.map((item) => (
                          <div key={item.product.id} className="text-xs text-forest-800 flex justify-between">
                            <span>• {item.product.name} <span className="font-mono text-sage-500">x{item.quantity}</span></span>
                            <span className="font-mono text-forest-950 font-bold">Rs. {item.product.priceCurrency * item.quantity}</span>
                          </div>
                        ))}
                      </div>

                      {/* Summary */}
                      <div className="pt-3 border-t border-forest-900/5 flex flex-col sm:flex-row justify-between items-start sm:items-center gap-3">
                        <div className="text-xs">
                          <p className="text-forest-900 font-bold">Total price: <span className="font-mono text-forest-950">Rs. {order.totalAmount}</span></p>
                          <p className={`text-[10px] font-bold ${order.paymentMethod === "points" || order.pointsCredited ? 'text-emerald-700' : 'text-red-500'}`}>
                            {order.paymentMethod === "points"
                              ? "✓ GUL Points Redeemed at Checkout"
                              : order.pointsCredited 
                                ? `✓ ${order.pointsAwarded} GUL Coins deposited` 
                                : `⏳ Points hold: +${order.pointsAwarded} Coins pending shipment`
                            }
                          </p>
                        </div>

                        {isPendingShipping && (
                          <button
                            onClick={() => onAdminShipOrder(order.id, order.customerId, order.pointsAwarded)}
                            className="w-full sm:w-auto px-4 py-2 bg-forest-900 hover:bg-forest-950 text-white font-extrabold text-[10px] uppercase tracking-wider rounded-xl cursor-pointer shadow-md transition-all flex items-center justify-center gap-1.5"
                          >
                            <Truck className="h-3.5 w-3.5 shrink-0" />
                            <span>Dispatch Shipment ({isCODHold ? "Releases coins" : "Complete order"})</span>
                          </button>
                        )}
                      </div>
                    </div>
                  );
                })}
              </div>
            )}
          </div>
        </div>

        {/* Right Side: User Directory / point adjustments */}
        <div className="lg:col-span-4 space-y-6">
          <div className="rounded-[40px] border-2 border-forest-900/10 bg-cream-50 p-6 shadow-xs">
            <h3 className="font-display font-black text-xs uppercase tracking-widest text-[#1B3022]/60 mb-5 flex items-center gap-1.5 pb-2 border-b border-forest-100">
              <Users className="h-4 w-4 text-indigo-500" />
              <span>GUL User Registry Drawer</span>
            </h3>

            <div className="space-y-4 max-h-[420px] overflow-y-auto pr-1">
              {accounts.map((user) => {
                let rColor = "bg-emerald-500/10 text-emerald-700";
                if (user.role === "admin") rColor = "bg-rose-500/10 text-rose-700";
                if (user.role === "botanist") rColor = "bg-amber-500/10 text-amber-700";

                return (
                  <div key={user.id} className="p-3 rounded-2xl bg-[#FAF9F5] border border-forest-900/5 space-y-2">
                    <div className="flex items-center space-x-3">
                      <img
                        src={user.avatar}
                        alt={user.name}
                        referrerPolicy="no-referrer"
                        className="h-9 w-9 rounded-xl object-cover shrink-0 border border-forest-100"
                      />
                      <div className="overflow-hidden">
                        <h4 className="font-bold text-xs uppercase text-forest-900 truncate">{user.name}</h4>
                        <span className={`text-[8px] uppercase font-black px-2 py-0.2 rounded-full mt-0.5 inline-block ${rColor}`}>
                          {user.role}
                        </span>
                      </div>
                    </div>

                    <div className="pt-2 border-t border-forest-900/5 flex justify-between items-center text-[11px] font-mono">
                      <span>Wallet:</span>
                      <span className="font-extrabold text-gold-600">{user.points} PTS</span>
                    </div>

                    {user.role !== "admin" && (
                      <div className="flex gap-1.5 justify-end">
                        <button
                          onClick={() => handleGrantBonus(user.id, 50)}
                          className="px-2 py-0.5 bg-white border border-forest-900/10 hover:border-gold-500 rounded-sm text-[9px] font-bold text-forest-800"
                        >
                          +50 Gift
                        </button>
                        <button
                          onClick={() => handleGrantBonus(user.id, 100)}
                          className="px-2 py-0.5 bg-[#FCEFDC] hover:bg-gold-500 hover:text-white rounded-sm text-[9px] font-extrabold text-gold-700"
                        >
                          +100 Bonus
                        </button>
                      </div>
                    )}
                  </div>
                );
              })}
            </div>
          </div>
        </div>

      </div>
    </div>
  );
}
