import React, { useState } from "react";
import { CartItem, Product, Order, UserAccount } from "../types";
import { Trash2, ShoppingBag, Plus, Minus, CreditCard, Truck, Check, AlertCircle, Sparkles, Coins } from "lucide-react";

interface CartPaymentProps {
  cart: CartItem[];
  setCart: React.Dispatch<React.SetStateAction<CartItem[]>>;
  currentUser: UserAccount;
  onAddPoints: (amount: number) => void;
  onDeductPoints: (amount: number) => boolean;
  orders: Order[];
  setOrders: React.Dispatch<React.SetStateAction<Order[]>>;
  onSubmitOrderSuccess: (message: string) => void;
}

export default function CartPayment({
  cart,
  setCart,
  currentUser,
  onAddPoints,
  onDeductPoints,
  orders,
  setOrders,
  onSubmitOrderSuccess
}: CartPaymentProps) {
  const [paymentMethod, setPaymentMethod] = useState<"card" | "cod" | "points">("card");
  const [cardHolder, setCardHolder] = useState("");
  const [cardNumber, setCardNumber] = useState("");
  const [cardExpiry, setCardExpiry] = useState("");
  const [cardCvv, setCardCvv] = useState("");
  const [shippingAddress, setShippingAddress] = useState("");
  const [isCheckingOut, setIsCheckingOut] = useState(false);
  const [errorMsg, setErrorMsg] = useState("");

  const subtotal = cart.reduce((total, item) => total + item.product.priceCurrency * item.quantity, 0);
  const calculatedPointsToAward = Math.floor(subtotal * 0.1); // Reward equal to 10% of spend in GUL points

  const totalPointsNeeded = cart.reduce(
    (total, item) => total + (item.product.pricePoints || Math.ceil(item.product.priceCurrency * 0.2)) * item.quantity,
    0
  );

  const updateQuantity = (productId: string, delta: number) => {
    setCart((prev) =>
      prev
        .map((item) => {
          if (item.product.id === productId) {
            const newQty = item.quantity + delta;
            return { ...item, quantity: newQty };
          }
          return item;
        })
        .filter((item) => item.quantity > 0)
    );
  };

  const removeFromCart = (productId: string) => {
    setCart((prev) => prev.filter((item) => item.product.id !== productId));
  };

  const handleCheckout = (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMsg("");

    if (cart.length === 0) {
      setErrorMsg("Your cart is empty. Please add items in the GUL Bazaar Store first.");
      return;
    }

    if (!shippingAddress.trim()) {
      setErrorMsg("Please enter a valid shipping destination address.");
      return;
    }

    if (paymentMethod === "card") {
      if (!cardHolder.trim() || !cardNumber.trim() || !cardExpiry.trim() || !cardCvv.trim()) {
        setErrorMsg("Please complete all credit/debit card credentials details.");
        return;
      }
    }

    if (paymentMethod === "points") {
      if (currentUser.points < totalPointsNeeded) {
        setErrorMsg(`Insufficient GUL points. This order costs ${totalPointsNeeded} PTS, but your ledger only has ${currentUser.points} PTS.`);
        return;
      }
    }

    // Process Order
    if (paymentMethod === "points") {
      const success = onDeductPoints(totalPointsNeeded);
      if (!success) {
        setErrorMsg("Failed to deduct points from your GUL account. Please retry.");
        return;
      }

      const newOrder: Order = {
        id: `ord-${Date.now()}`,
        customerId: currentUser.id,
        customerName: currentUser.name,
        items: [...cart],
        totalAmount: subtotal,
        paymentMethod: "points",
        paymentStatus: "points_deducted",
        shippingStatus: "pending",
        date: new Date().toISOString().split("T")[0],
        pointsAwarded: 0,
        pointsCredited: true
      };

      setOrders((prev) => [newOrder, ...prev]);
      setCart([]); // Clear Cart
      setIsCheckingOut(false);
      onSubmitOrderSuccess(
        `Eco Reward Redeemed! We have deducted ${totalPointsNeeded} GUL points from your wallet and queued your order for shipment. Check the Admin panel!`
      );
    } else {
      const pointsAwarded = calculatedPointsToAward;
      const isInstantPoints = paymentMethod === "card";

      const newOrder: Order = {
        id: `ord-${Date.now()}`,
        customerId: currentUser.id,
        customerName: currentUser.name,
        items: [...cart],
        totalAmount: subtotal,
        paymentMethod,
        paymentStatus: paymentMethod === "card" ? "paid" : "pending_cod",
        shippingStatus: "pending",
        date: new Date().toISOString().split("T")[0],
        pointsAwarded,
        pointsCredited: isInstantPoints // Card is instant; COD is credited upon Admin shipment
      };

      setOrders((prev) => [newOrder, ...prev]);
      setCart([]); // Clear Cart
      setIsCheckingOut(false);

      if (isInstantPoints) {
        onAddPoints(pointsAwarded);
        onSubmitOrderSuccess(
          `Instant card payment captured! You spent Rs. ${subtotal} and received an immediate +${pointsAwarded} GUL Points directly to your wallet!`
        );
      } else {
        onSubmitOrderSuccess(
          `Order registered successfully under Cash on Delivery (COD)! Your points (+${pointsAwarded} GUL Coins) are queued and will be credited once the physical shipment is dispatched by the Admin side.`
        );
      }
    }

    // Reset Form
    setCardHolder("");
    setCardNumber("");
    setCardExpiry("");
    setCardCvv("");
    setShippingAddress("");
  };

  return (
    <div className="mx-auto max-w-7xl py-6 px-4">
      <div className="border-b border-forest-100 pb-5 mb-8">
        <h2 className="font-display text-3xl font-extrabold text-forest-900 tracking-tight">
          Checkout & Personal Cart
        </h2>
        <p className="text-xs sm:text-sm text-sage-700 mt-1">
          Review your items and complete secure transactions. Check points crediting processes under checkout rules.
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        
        {/* Left Side (7 cols) - Cart items review */}
        <div className="lg:col-span-7 space-y-6">
          
          <div className="rounded-[40px] border-2 border-forest-900/10 bg-cream-50 p-6 sm:p-8 shadow-xs">
            <h3 className="font-display font-black text-xs uppercase tracking-widest text-[#1B3022]/60 mb-6 flex items-center gap-1.5 pb-2 border-b border-forest-100">
              <ShoppingBag className="h-4 w-4 text-emerald-600" />
              <span>Shopping Cart Items ({cart.length})</span>
            </h3>

            {cart.length === 0 ? (
              <div className="text-center py-16">
                <ShoppingBag className="h-12 w-12 text-sage-300 mx-auto mb-3" />
                <h4 className="font-black text-sm uppercase text-forest-900">Your Cart is empty</h4>
                <p className="text-xs text-forest-700 mt-1 mb-6">
                  Add custom indoor plants, compost, pots or biological feeds in the Botanical Bazaar.
                </p>
              </div>
            ) : (
              <div className="space-y-4">
                {cart.map((item) => (
                  <div
                    key={item.product.id}
                    className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 p-4 rounded-3xl bg-[#FAF9F5] border border-forest-900/5 hover:border-forest-900/10 transition-all"
                  >
                    <div className="flex items-center space-x-4">
                      <img
                        src={item.product.image}
                        alt={item.product.name}
                        className="h-14 w-14 rounded-xl object-cover shrink-0 border border-forest-100"
                      />
                      <div>
                        <h4 className="font-bold text-xs uppercase text-forest-900 leading-tight">
                          {item.product.name}
                        </h4>
                        <span className="text-[10px] text-sage-500 font-mono tracking-wide">
                          Seller: {item.product.sellerName}
                        </span>
                        <p className="text-xs font-black text-forest-950 font-mono mt-1">
                          Rs. {item.product.priceCurrency}
                        </p>
                      </div>
                    </div>

                    <div className="flex items-center justify-between sm:justify-end gap-6 border-t sm:border-0 pt-3 sm:pt-0">
                      <div className="flex items-center space-x-2 bg-cream-50 rounded-xl p-1 border border-forest-900/5">
                        <button
                          onClick={() => updateQuantity(item.product.id, -1)}
                          className="h-6 w-6 rounded-lg hover:bg-forest-150 flex items-center justify-center text-xs text-forest-800"
                        >
                          <Minus className="h-3 w-3" />
                        </button>
                        <span className="font-mono text-xs font-bold text-forest-900 px-2 shrink-0">
                          {item.quantity}
                        </span>
                        <button
                          onClick={() => updateQuantity(item.product.id, 1)}
                          className="h-6 w-6 rounded-lg hover:bg-forest-150 flex items-center justify-center text-xs text-forest-800"
                        >
                          <Plus className="h-3 w-3" />
                        </button>
                      </div>

                      <button
                        onClick={() => removeFromCart(item.product.id)}
                        className="text-red-650 hover:text-red-750 p-1 rounded-lg hover:bg-red-50"
                      >
                        <Trash2 className="h-4 w-4" />
                      </button>
                    </div>
                  </div>
                ))}

                <div className="border-t border-forest-100 pt-5 mt-6 space-y-2">
                  <div className="flex justify-between text-xs text-forest-800 font-bold">
                    <span>Order Subtotal</span>
                    <span className="font-mono">Rs. {subtotal}</span>
                  </div>
                  <div className="flex justify-between text-xs text-gold-600 font-extrabold bg-[#FCEFDC]/30 p-2.5 rounded-xl">
                    <span className="flex items-center gap-1">
                      <Coins className="h-3.5 w-3.5" />
                      Estimated coins points to gain
                    </span>
                    <span className="font-mono">+{calculatedPointsToAward} GUL Coins</span>
                  </div>
                </div>
              </div>
            )}
          </div>

        </div>

        {/* Right Side (5 cols) - Checkout & Payment processing */}
        <div className="lg:col-span-5">
          <div className="rounded-[40px] border-2 border-forest-900/10 bg-cream-50 p-6 sm:p-8 shadow-xs">
            <h3 className="font-display font-black text-xs uppercase tracking-widest text-[#1B3022]/60 mb-6 flex items-center gap-1.5 pb-2 border-b border-forest-100">
              <CreditCard className="h-4 w-4 text-amber-500" />
              <span>Checkout Settlement Console</span>
            </h3>

            {errorMsg && (
              <div className="mb-4 bg-rose-50 border border-rose-200 text-xs text-rose-800 rounded-xl p-3 font-semibold flex gap-1.5">
                <AlertCircle className="h-4 w-4 text-rose-500 shrink-0" />
                <span>{errorMsg}</span>
              </div>
            )}

            <form onSubmit={handleCheckout} className="space-y-4">
              <div>
                <label className="block text-xs font-black uppercase tracking-wider text-forest-800 mb-1.5">
                  Shipping Delivery Address
                </label>
                <textarea
                  required
                  rows={2}
                  placeholder="Street address, City, District code..."
                  value={shippingAddress}
                  onChange={(e) => setShippingAddress(e.target.value)}
                  className="w-full bg-white border-2 border-forest-900/10 hover:border-forest-900/20 focus:border-forest-850 rounded-2xl py-2 px-3 text-xs font-semibold focus:outline-hidden transition-all text-forest-950 h-16 resize-none"
                />
              </div>

              <div>
                <label className="block text-xs font-black uppercase tracking-wider text-forest-800 mb-3">
                  Settlement Method & Rules
                </label>
                <div className="grid grid-cols-3 gap-2">
                  <button
                    type="button"
                    onClick={() => setPaymentMethod("card")}
                    className={`p-2.5 rounded-2xl border-2 text-left transition-all flex flex-col justify-between h-24 cursor-pointer ${
                      paymentMethod === "card"
                        ? "bg-forest-900 text-cream-50 border-forest-900 shadow-xs"
                        : "bg-[#FAF9F5] border-forest-900/5 text-forest-900 hover:border-sage-300"
                    }`}
                  >
                    <CreditCard className={`h-4.5 w-4.5 ${paymentMethod === 'card' ? 'text-gold-500' : 'text-sage-500'}`} />
                    <div className="mt-2 text-left">
                      <h4 className="font-bold text-[10px] uppercase leading-tight">Card Payment</h4>
                      <p className="text-[8px] text-[#88A070] italic leading-none mt-0.5">Coins Instant</p>
                    </div>
                  </button>

                  <button
                    type="button"
                    onClick={() => setPaymentMethod("cod")}
                    className={`p-2.5 rounded-2xl border-2 text-left transition-all flex flex-col justify-between h-24 cursor-pointer ${
                      paymentMethod === "cod"
                        ? "bg-forest-900 text-cream-50 border-forest-900 shadow-xs"
                        : "bg-[#FAF9F5] border-forest-900/5 text-forest-900 hover:border-sage-300"
                    }`}
                  >
                    <Truck className={`h-4.5 w-4.5 ${paymentMethod === 'cod' ? 'text-gold-500' : 'text-sage-500'}`} />
                    <div className="mt-2 text-left">
                      <h4 className="font-bold text-[10px] uppercase leading-tight">Cash Deliv</h4>
                      <p className="text-[8px] text-amber-600 italic leading-none mt-0.5 font-semibold">Coins later</p>
                    </div>
                  </button>

                  <button
                    type="button"
                    onClick={() => setPaymentMethod("points")}
                    className={`p-2.5 rounded-2xl border-2 text-left transition-all flex flex-col justify-between h-24 cursor-pointer ${
                      paymentMethod === "points"
                        ? "bg-[#7024C4] text-cream-50 border-[#7024C4] shadow-xs"
                        : "bg-[#FAF9F5] border-forest-900/5 text-purple-950 hover:border-purple-300"
                    }`}
                  >
                    <Sparkles className={`h-4.5 w-4.5 ${paymentMethod === 'points' ? 'text-gold-500' : 'text-purple-600 animate-pulse'}`} />
                    <div className="mt-2 text-left">
                      <h4 className="font-bold text-[10px] uppercase leading-tight">By Points</h4>
                      <p className="text-[8px] text-purple-400 italic leading-none mt-0.5 font-semibold">Deduct PTS</p>
                    </div>
                  </button>
                </div>
              </div>

              {paymentMethod === "card" && (
                <div className="space-y-3 p-4 rounded-3xl bg-[#FAF9F5] border border-forest-900/5 animate-fadeIn">
                  <p className="text-[10px] text-sage-600 font-mono tracking-widest uppercase font-black">Credit Card Details</p>
                  <div>
                    <input
                      type="text"
                      placeholder="Cardholder Full Name"
                      value={cardHolder}
                      onChange={(e) => setCardHolder(e.target.value)}
                      className="w-full bg-white border border-forest-900/10 rounded-xl p-2 text-xs text-forest-950 font-bold"
                    />
                  </div>
                  <div>
                    <input
                      type="text"
                      placeholder="Card Number (4000 1234 5678 9010)"
                      value={cardNumber}
                      onChange={(e) => setCardNumber(e.target.value)}
                      className="w-full bg-white border border-forest-900/10 rounded-xl p-2 text-xs text-forest-950 font-mono"
                    />
                  </div>
                  <div className="grid grid-cols-2 gap-2">
                    <input
                      type="text"
                      placeholder="MM/YY"
                      value={cardExpiry}
                      onChange={(e) => setCardExpiry(e.target.value)}
                      className="w-full bg-[#FFFFFF] border border-forest-900/10 rounded-xl p-2 text-xs text-forest-950 font-mono text-center"
                    />
                    <input
                      type="password"
                      placeholder="CVV"
                      maxLength={3}
                      value={cardCvv}
                      onChange={(e) => setCardCvv(e.target.value)}
                      className="w-full bg-[#FFFFFF] border border-forest-900/10 rounded-xl p-2 text-xs text-forest-950 font-mono text-center"
                    />
                  </div>
                </div>
              )}

              {paymentMethod === "cod" && (
                <div className="p-4 rounded-3xl bg-amber-500/5 border border-gold-400/30 text-[11px] text-amber-800 leading-relaxed font-semibold">
                  <span className="flex items-center gap-1 text-gold-700 uppercase font-bold text-[10px] tracking-wider mb-1">
                    <AlertCircle className="h-4 w-4" />
                    How COD works
                  </span>
                  Your GUL Coins are placed on hold. Once you click "Submit Order", the Admin must approve & ship the order from the dispatch office to instantly add {calculatedPointsToAward} GUL points.
                </div>
              )}

              {paymentMethod === "points" && (
                <div className="p-4 rounded-3xl bg-purple-500/5 border border-purple-400/30 text-[11px] text-purple-800 leading-relaxed font-semibold">
                  <span className="flex items-center gap-1 text-purple-705 text-purple-700 uppercase font-bold text-[10px] tracking-wider mb-1">
                    <Sparkles className="h-4 w-4" />
                    Points Redemption
                  </span>
                  Use your ecological points to complete this order. This order costs <span className="font-extrabold text-[#7024C4] font-mono">{totalPointsNeeded} PTS</span>. You currently have <span className="font-extrabold text-[#7024C4] font-mono">{currentUser.points} PTS</span>.
                </div>
              )}

              <button
                type="submit"
                disabled={cart.length === 0}
                className={`w-full py-3 text-xs tracking-widest font-extrabold uppercase rounded-full shadow-md cursor-pointer transition-all ${
                  cart.length === 0
                    ? "bg-sage-200 text-sage-400 cursor-not-allowed"
                    : paymentMethod === "points"
                      ? "bg-purple-700 hover:bg-purple-800 text-white"
                      : "bg-forest-900 hover:bg-forest-950 text-white"
                }`}
              >
                {paymentMethod === "card"
                  ? `CONFIRM SECTIONS & PAY CARD (Rs. ${subtotal})`
                  : paymentMethod === "points"
                    ? `CONFIRM REDEMPTION & PAY (${totalPointsNeeded} PTS)`
                    : `DISPATCH CASH ON DELIVERY ORDER (Rs. ${subtotal})`}
              </button>
            </form>
          </div>
        </div>

      </div>
    </div>
  );
}
